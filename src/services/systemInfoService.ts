import { ApiResponse } from '../types/api';
import { WhatsNewResponse } from '../types/whatsNew';
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

const unwrap = <TData>(response: RawApiResponse<TData> | TData): TData => {
  if (response && typeof response === 'object') {
    const source = response as Record<string, unknown>;
    const hasWrapper = 'success' in source || 'Success' in source || 'data' in source || 'Data' in source;
    if (hasWrapper) {
      return getValue<TData>(source, 'data', 'Data') as TData;
    }
  }
  return response as TData;
};

const normalizeWhatsNew = (raw: unknown): WhatsNewResponse => {
  const source = (raw ?? {}) as Record<string, unknown>;
  const rawWhatsNew = getValue<unknown>(source, 'whatsNew', 'WhatsNew');
  const whatsNewSource = (rawWhatsNew ?? {}) as Record<string, unknown>;

  return {
    currentVersion: String(getValue(source, 'currentVersion', 'CurrentVersion') ?? ''),
    hasNewVersion: Boolean(getValue(source, 'hasNewVersion', 'HasNewVersion') ?? false),
    shouldOfferUpdateTutorial: Boolean(
      getValue(source, 'shouldOfferUpdateTutorial', 'ShouldOfferUpdateTutorial') ?? false,
    ),
    whatsNew: rawWhatsNew
      ? {
          version: String(getValue(whatsNewSource, 'version', 'Version') ?? ''),
          title: String(getValue(whatsNewSource, 'title', 'Title') ?? ''),
          type: String(getValue(whatsNewSource, 'type', 'Type') ?? 'feature'),
          requiresTutorial: Boolean(getValue(whatsNewSource, 'requiresTutorial', 'RequiresTutorial') ?? false),
          items: Array.isArray(getValue(whatsNewSource, 'items', 'Items'))
            ? (getValue<unknown[]>(whatsNewSource, 'items', 'Items') ?? []).map((item) => String(item))
            : [],
        }
      : null,
  };
};

export async function fetchWhatsNew(token: string): Promise<WhatsNewResponse> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/system-info/whats-new', {
    method: 'GET',
    token,
  });
  return normalizeWhatsNew(unwrap(response));
}

export async function markVersionSeen(token: string, version: string): Promise<void> {
  await apiRequest<RawApiResponse<unknown> | unknown>('/api/system-info/mark-version-seen', {
    method: 'POST',
    token,
    body: JSON.stringify({ version }),
  });
}
