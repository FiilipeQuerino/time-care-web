import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, OnboardingLoginFlags, User } from '../types/auth';
import { loginRequest } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setOnboardingFlags: (flags: OnboardingLoginFlags | null, resolved?: boolean) => void;
}

interface StoredAuth {
  token: string;
  expiresAt: string;
  user: User;
}

const STORAGE_KEY = 'timecare.auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: true,
  onboarding: null,
  onboardingResolved: true,
};

function isTokenExpired(expiresAt: string): boolean {
  const expiresAtTime = new Date(expiresAt).getTime();
  if (Number.isNaN(expiresAtTime)) {
    return true;
  }

  return Date.now() >= expiresAtTime;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(STORAGE_KEY);
      if (!rawSession) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const session = JSON.parse(rawSession) as StoredAuth;
      if (!session?.token || !session?.expiresAt || !session?.user || isTokenExpired(session.expiresAt)) {
        localStorage.removeItem(STORAGE_KEY);
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      setState({
        user: session.user,
        token: session.token,
        expiresAt: session.expiresAt,
        isAuthenticated: true,
        isLoading: false,
        onboarding: null,
        onboardingResolved: true,
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loginData = await loginRequest({ email, password });
      const user: User = {
        id: loginData.userId,
        email: loginData.email,
        name: loginData.email,
      };

      const nextState: AuthState = {
        user,
        token: loginData.token,
        expiresAt: loginData.expiresAt,
        isAuthenticated: true,
        isLoading: false,
        onboarding: loginData.onboarding ?? null,
        onboardingResolved: loginData.onboarding !== null && loginData.onboarding !== undefined,
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          token: loginData.token,
          expiresAt: loginData.expiresAt,
        }),
      );

      setState(nextState);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        token: null,
        expiresAt: null,
        isAuthenticated: false,
        isLoading: false,
        onboarding: null,
        onboardingResolved: true,
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      token: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      onboarding: null,
      onboardingResolved: true,
    });
  };

  const setOnboardingFlags = (flags: OnboardingLoginFlags | null, resolved = true) => {
    setState((current) => ({
      ...current,
      onboarding: flags,
      onboardingResolved: resolved,
    }));
  };

  return <AuthContext.Provider value={{ ...state, login, logout, setOnboardingFlags }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
