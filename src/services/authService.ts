import { ApiResponse } from '../types/api';
import { LoginResponseData } from '../types/auth';
import { apiRequest } from './api';

interface LoginPayload {
  email: string;
  password: string;
}

const getValue = <T>(source: Record<string, unknown>, ...keys: string[]): T | undefined => {
  for (const key of keys) {
    if (key in source) return source[key] as T;
  }
  return undefined;
};

const normalizeLoginResponse = (raw: unknown): LoginResponseData => {
  const source = (raw ?? {}) as Record<string, unknown>;
  const onboardingRaw =
    getValue<Record<string, unknown>>(source, 'onboarding', 'Onboarding') ?? null;

  const onboardingFromNested = onboardingRaw
    ? {
        isFirstLogin: Boolean(getValue(onboardingRaw, 'isFirstLogin', 'IsFirstLogin') ?? false),
        shouldOfferTutorial: Boolean(
          getValue(onboardingRaw, 'shouldOfferTutorial', 'ShouldOfferTutorial') ?? false,
        ),
        tutorialVersion: String(getValue(onboardingRaw, 'tutorialVersion', 'TutorialVersion') ?? 'v1'),
      }
    : null;

  const hasTopLevelOnboarding =
    'isFirstLogin' in source ||
    'IsFirstLogin' in source ||
    'shouldOfferTutorial' in source ||
    'ShouldOfferTutorial' in source;

  const onboardingFromTopLevel = hasTopLevelOnboarding
    ? {
        isFirstLogin: Boolean(getValue(source, 'isFirstLogin', 'IsFirstLogin') ?? false),
        shouldOfferTutorial: Boolean(
          getValue(source, 'shouldOfferTutorial', 'ShouldOfferTutorial') ?? false,
        ),
        tutorialVersion: String(getValue(source, 'tutorialVersion', 'TutorialVersion') ?? 'v1'),
      }
    : null;

  return {
    token: String(getValue(source, 'token', 'Token') ?? ''),
    email: String(getValue(source, 'email', 'Email') ?? ''),
    userId: String(getValue(source, 'userId', 'UserId') ?? ''),
    expiresAt: String(getValue(source, 'expiresAt', 'ExpiresAt') ?? ''),
    onboarding: onboardingFromNested ?? onboardingFromTopLevel,
  };
};

export async function loginRequest(payload: LoginPayload): Promise<LoginResponseData> {
  const response = await apiRequest<ApiResponse<unknown>>('/api/Auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel autenticar.');
  }

  return normalizeLoginResponse(response.data);
}
