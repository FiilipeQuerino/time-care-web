import { ApiResponse } from '../types/api';
import {
  OnboardingStatus,
  TutorialCompletedPayload,
  TutorialDecisionPayload,
} from '../types/onboarding';
import { apiRequest } from './api';

interface RawApiResponse<TData> extends Partial<ApiResponse<TData>> {
  success?: boolean;
  Success?: boolean;
  message?: string;
  Message?: string;
  data?: TData;
  Data?: TData;
}

const getValue = <T>(source: Record<string, unknown>, ...keys: string[]): T | undefined => {
  for (const key of keys) {
    if (key in source) return source[key] as T;
  }
  return undefined;
};

const unwrap = <TData>(response: RawApiResponse<TData> | TData, fallbackError: string): TData => {
  if (response && typeof response === 'object') {
    const source = response as Record<string, unknown>;
    const hasWrapperShape =
      'success' in source || 'Success' in source || 'data' in source || 'Data' in source;

    if (hasWrapperShape) {
      const success = getValue<boolean>(source, 'success', 'Success');
      const message = getValue<string>(source, 'message', 'Message');
      const data = getValue<TData>(source, 'data', 'Data');

      if (success === false) throw new Error(message || fallbackError);
      return data as TData;
    }
  }

  return response as TData;
};

const normalizeOnboardingStatus = (raw: unknown): OnboardingStatus => {
  const source = (raw ?? {}) as Record<string, unknown>;
  return {
    userId: String(getValue(source, 'userId', 'UserId') ?? ''),
    isFirstLogin: Boolean(getValue(source, 'isFirstLogin', 'IsFirstLogin') ?? false),
    shouldOfferTutorial: Boolean(
      getValue(source, 'shouldOfferTutorial', 'ShouldOfferTutorial') ?? false,
    ),
    tutorialVersion: String(getValue(source, 'tutorialVersion', 'TutorialVersion') ?? 'v1'),
    tutorialAccepted: getValue<boolean | null>(source, 'tutorialAccepted', 'TutorialAccepted'),
    firstLoginAt: getValue<string | null>(source, 'firstLoginAt', 'FirstLoginAt') ?? null,
    tutorialOfferedAt: getValue<string | null>(source, 'tutorialOfferedAt', 'TutorialOfferedAt') ?? null,
    tutorialCompletedAt:
      getValue<string | null>(source, 'tutorialCompletedAt', 'TutorialCompletedAt') ?? null,
    lastSeenWhatsNewVersion: String(
      getValue(source, 'lastSeenWhatsNewVersion', 'LastSeenWhatsNewVersion') ?? '',
    ),
  };
};

export async function fetchOnboardingStatus(token: string): Promise<OnboardingStatus> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Onboarding/status', {
    method: 'GET',
    token,
  });

  const data = unwrap<unknown>(response, 'Nao foi possivel carregar onboarding.');
  return normalizeOnboardingStatus(data);
}

export async function updateTutorialDecision(
  token: string,
  payload: TutorialDecisionPayload,
): Promise<OnboardingStatus> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(
    '/api/Onboarding/tutorial-decision',
    {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    },
  );

  const data = unwrap<unknown>(response, 'Nao foi possivel atualizar decisao do tutorial.');
  return normalizeOnboardingStatus(data);
}

export async function markTutorialCompleted(
  token: string,
  payload: TutorialCompletedPayload,
): Promise<OnboardingStatus> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(
    '/api/Onboarding/tutorial-completed',
    {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    },
  );

  const data = unwrap<unknown>(response, 'Nao foi possivel concluir tutorial.');
  return normalizeOnboardingStatus(data);
}

export async function updateWhatsNewVersion(token: string, version: string): Promise<OnboardingStatus> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(
    '/api/Onboarding/whats-new-version',
    {
      method: 'PUT',
      token,
      body: JSON.stringify({ version }),
    },
  );

  const data = unwrap<unknown>(response, 'Nao foi possivel atualizar versao de novidades.');
  return normalizeOnboardingStatus(data);
}
