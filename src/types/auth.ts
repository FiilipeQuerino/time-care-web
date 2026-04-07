export interface User {
  id: string;
  name?: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface OnboardingLoginFlags {
  isFirstLogin: boolean;
  shouldOfferTutorial: boolean;
  tutorialVersion: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboarding: OnboardingLoginFlags | null;
  onboardingResolved: boolean;
}

export interface LoginResponseData {
  token: string;
  email: string;
  userId: string;
  expiresAt: string;
  onboarding?: OnboardingLoginFlags | null;
}
