export type NotificationChannel = 1 | 2 | 3;
export type TwoFactorMethod = 1 | 2 | 3 | 4;
export type AppointmentClosureMode = 1 | 2;

export interface UserSettings {
  userId: string;
  email: string;
  phone: string;
  allowEmailNotifications: boolean;
  allowPushNotifications: boolean;
  allowWhatsAppNotifications: boolean;
  criticalStockAlertsEnabled: boolean;
  appointmentClosureMode: AppointmentClosureMode;
  preferredNotificationChannel: NotificationChannel;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod;
  language: string;
  timeZone: string;
  updatedAt: string;
}

export interface UpdateUserSettingsPayload {
  email?: string;
  phone?: string;
  allowEmailNotifications: boolean;
  allowPushNotifications: boolean;
  allowWhatsAppNotifications: boolean;
  criticalStockAlertsEnabled: boolean;
  appointmentClosureMode: AppointmentClosureMode;
  preferredNotificationChannel: NotificationChannel;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod;
  language: string;
  timeZone: string;
}

export interface ProfileSystemInfo {
  currentVersion: string;
  lastUpdatedAt: string;
}
