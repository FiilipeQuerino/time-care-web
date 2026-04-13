import { ApiResponse } from '../types/api';
import { ProfileSystemInfo, UpdateUserSettingsPayload, UserSettings } from '../types/profile';
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

const unwrap = <TData>(
  response: RawApiResponse<TData> | TData,
  fallbackError: string,
): TData => {
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

const normalizeSettings = (raw: unknown): UserSettings => {
  const source = (raw ?? {}) as Record<string, unknown>;
  return {
    userId: String(getValue(source, 'userId', 'UserId') ?? ''),
    email: String(getValue(source, 'email', 'Email') ?? ''),
    phone: String(getValue(source, 'phone', 'Phone') ?? ''),
    allowEmailNotifications: Boolean(
      getValue(source, 'allowEmailNotifications', 'AllowEmailNotifications') ?? false,
    ),
    allowPushNotifications: Boolean(
      getValue(source, 'allowPushNotifications', 'AllowPushNotifications') ?? true,
    ),
    allowWhatsAppNotifications: Boolean(
      getValue(source, 'allowWhatsAppNotifications', 'AllowWhatsAppNotifications') ?? false,
    ),
    criticalStockAlertsEnabled: Boolean(
      getValue(source, 'criticalStockAlertsEnabled', 'CriticalStockAlertsEnabled') ?? true,
    ),
    appointmentClosureMode: Number(
      getValue(source, 'appointmentClosureMode', 'AppointmentClosureMode') ?? 1,
    ) as UserSettings['appointmentClosureMode'],
    preferredNotificationChannel: Number(
      getValue(source, 'preferredNotificationChannel', 'PreferredNotificationChannel') ?? 2,
    ) as UserSettings['preferredNotificationChannel'],
    twoFactorEnabled: Boolean(getValue(source, 'twoFactorEnabled', 'TwoFactorEnabled') ?? false),
    twoFactorMethod: Number(getValue(source, 'twoFactorMethod', 'TwoFactorMethod') ?? 1) as UserSettings['twoFactorMethod'],
    language: String(getValue(source, 'language', 'Language') ?? 'pt-BR'),
    timeZone: String(getValue(source, 'timeZone', 'TimeZone') ?? 'America/Sao_Paulo'),
    updatedAt: String(getValue(source, 'updatedAt', 'UpdatedAt') ?? ''),
  };
};

const normalizeSystemInfo = (raw: unknown): ProfileSystemInfo => {
  const source = (raw ?? {}) as Record<string, unknown>;
  return {
    currentVersion: String(getValue(source, 'currentVersion', 'CurrentVersion') ?? ''),
    lastUpdatedAt: String(getValue(source, 'lastUpdatedAt', 'LastUpdatedAt') ?? ''),
  };
};

const toPayload = (payload: UpdateUserSettingsPayload) => ({
  email: payload.email,
  phone: payload.phone,
  allowEmailNotifications: payload.allowEmailNotifications,
  allowPushNotifications: payload.allowPushNotifications,
  allowWhatsAppNotifications: payload.allowWhatsAppNotifications,
  criticalStockAlertsEnabled: payload.criticalStockAlertsEnabled,
  appointmentClosureMode: payload.appointmentClosureMode,
  preferredNotificationChannel: payload.preferredNotificationChannel,
  twoFactorEnabled: payload.twoFactorEnabled,
  twoFactorMethod: payload.twoFactorMethod,
  language: payload.language,
  timeZone: payload.timeZone,
});

export async function fetchUserSettings(token: string): Promise<UserSettings> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Profile/settings', {
    method: 'GET',
    token,
  });
  return normalizeSettings(unwrap<unknown>(response, 'Nao foi possivel carregar configuracoes.'));
}

export async function updateUserSettings(
  token: string,
  payload: UpdateUserSettingsPayload,
): Promise<UserSettings> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Profile/settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(toPayload(payload)),
  });
  return normalizeSettings(unwrap<unknown>(response, 'Nao foi possivel salvar configuracoes.'));
}

export async function fetchProfileSystemInfo(token: string): Promise<ProfileSystemInfo> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Profile/system-info', {
    method: 'GET',
    token,
  });
  return normalizeSystemInfo(unwrap<unknown>(response, 'Nao foi possivel carregar informacoes de versao.'));
}
