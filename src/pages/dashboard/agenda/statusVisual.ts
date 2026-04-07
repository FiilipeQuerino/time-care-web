import { AppointmentStatus } from '../../../types/appointment';

export const normalizeAppointmentStatus = (status: AppointmentStatus): AppointmentStatus => {
  const normalized = String(status ?? '').trim().toLowerCase();

  if (normalized === 'scheduled' || normalized === 'agendado') return 'Scheduled';
  if (normalized === 'confirmed' || normalized === 'confirmado') return 'Confirmed';
  if (normalized === 'completed' || normalized === 'concluido' || normalized === 'concluído') return 'Completed';
  if (normalized === 'cancelled' || normalized === 'canceled' || normalized === 'cancelado') return 'Cancelled';
  if (
    normalized === 'noshow' ||
    normalized === 'no_show' ||
    normalized === 'no-show' ||
    normalized === 'falta' ||
    normalized === 'faltou'
  ) {
    return 'NoShow';
  }

  return status || 'Scheduled';
};

export interface AppointmentStatusVisual {
  normalizedStatus: AppointmentStatus;
  label: string;
  cardClassName: string;
  badgeClassName: string;
}

export const getAppointmentStatusVisual = (
  status: AppointmentStatus,
  statusLabel?: string,
): AppointmentStatusVisual => {
  const normalized = normalizeAppointmentStatus(status);

  if (normalized === 'Scheduled') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Agendado',
      cardClassName:
        'border border-fuchsia-200 border-l-fuchsia-500 bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-600 text-white shadow-[0_12px_24px_rgba(190,24,93,0.35)]',
      badgeClassName: 'border-white/25 bg-white/15 text-white',
    };
  }

  if (normalized === 'Confirmed') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Confirmado',
      cardClassName:
        'border border-sky-200 border-l-sky-500 bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white shadow-[0_12px_24px_rgba(2,132,199,0.35)]',
      badgeClassName: 'border-white/25 bg-white/15 text-white',
    };
  }

  if (normalized === 'Completed') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Concluido',
      cardClassName:
        'border border-emerald-200 border-l-emerald-500 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white shadow-[0_12px_24px_rgba(5,150,105,0.34)]',
      badgeClassName: 'border-white/25 bg-white/15 text-white',
    };
  }

  if (normalized === 'Cancelled') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Cancelado',
      cardClassName:
        'border border-rose-200 border-l-rose-500 bg-gradient-to-br from-rose-500 via-red-500 to-pink-600 text-white shadow-[0_12px_24px_rgba(225,29,72,0.34)]',
      badgeClassName: 'border-white/25 bg-white/15 text-white',
    };
  }

  if (normalized === 'NoShow') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Nao compareceu',
      cardClassName:
        'border border-amber-200 border-l-amber-500 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 text-white shadow-[0_12px_24px_rgba(217,119,6,0.34)]',
      badgeClassName: 'border-white/25 bg-white/15 text-white',
    };
  }

  return {
    normalizedStatus: normalized,
    label: statusLabel || 'Agendado',
    cardClassName:
      'border border-fuchsia-200 border-l-fuchsia-500 bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-600 text-white shadow-[0_12px_24px_rgba(190,24,93,0.35)]',
    badgeClassName: 'border-white/25 bg-white/15 text-white',
  };
};

export const appointmentStatusOptions: Array<{ value: AppointmentStatus; label: string }> = [
  { value: 'Scheduled', label: 'Agendado' },
  { value: 'Confirmed', label: 'Confirmado' },
  { value: 'Completed', label: 'Concluido' },
  { value: 'Cancelled', label: 'Cancelado' },
  { value: 'NoShow', label: 'Nao compareceu' },
];
