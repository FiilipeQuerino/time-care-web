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
        'border-slate-200 bg-white text-slate-800 shadow-[0_8px_16px_rgba(15,23,42,0.08)]',
      badgeClassName: 'border-slate-200 bg-slate-100 text-slate-700',
    };
  }

  if (normalized === 'Confirmed') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Confirmado',
      cardClassName:
        'border-sky-200 bg-sky-50 text-sky-900 shadow-[0_10px_18px_rgba(14,116,144,0.16)]',
      badgeClassName: 'border-sky-200 bg-sky-100 text-sky-700',
    };
  }

  if (normalized === 'Completed') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Concluido',
      cardClassName:
        'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-[0_10px_18px_rgba(5,150,105,0.16)]',
      badgeClassName: 'border-emerald-200 bg-emerald-100 text-emerald-700',
    };
  }

  if (normalized === 'Cancelled') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Cancelado',
      cardClassName:
        'border-rose-200 bg-rose-50 text-rose-900 shadow-[0_10px_18px_rgba(225,29,72,0.16)]',
      badgeClassName: 'border-rose-200 bg-rose-100 text-rose-700',
    };
  }

  if (normalized === 'NoShow') {
    return {
      normalizedStatus: normalized,
      label: statusLabel || 'Nao compareceu',
      cardClassName:
        'border-amber-200 bg-amber-50 text-amber-900 shadow-[0_10px_18px_rgba(217,119,6,0.18)]',
      badgeClassName: 'border-amber-200 bg-amber-100 text-amber-700',
    };
  }

  return {
    normalizedStatus: normalized,
    label: statusLabel || 'Agendado',
    cardClassName:
      'border-slate-200 bg-white text-slate-800 shadow-[0_8px_16px_rgba(15,23,42,0.08)]',
    badgeClassName: 'border-slate-200 bg-slate-100 text-slate-700',
  };
};

export const appointmentStatusOptions: Array<{ value: AppointmentStatus; label: string }> = [
  { value: 'Scheduled', label: 'Agendado' },
  { value: 'Confirmed', label: 'Confirmado' },
  { value: 'Completed', label: 'Concluido' },
  { value: 'Cancelled', label: 'Cancelado' },
  { value: 'NoShow', label: 'Nao compareceu' },
];
