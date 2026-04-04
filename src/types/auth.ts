export interface User {
  id: string;
  name?: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponseData {
  token: string;
  email: string;
  userId: string;
  expiresAt: string;
}
