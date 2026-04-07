import {
  Appointment,
  AppointmentCalendarDaySummary,
  AppointmentStatus,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../types/appointment';
import { ApiResponse } from '../types/api';
import { apiRequest } from './api';

interface RawApiResponse<TData, TMeta = unknown> extends Partial<ApiResponse<TData, TMeta>> {
  data?: TData;
  meta?: TMeta;
  message?: string;
  success?: boolean;
}

const getValue = <T>(source: Record<string, unknown>, ...keys: string[]): T | undefined => {
  for (const key of keys) {
    if (key in source) return source[key] as T;
  }
  return undefined;
};

const normalizeAppointment = (raw: unknown): Appointment => {
  const source = (raw ?? {}) as Record<string, unknown>;
  const rawStatus = getValue<unknown>(source, 'status', 'Status');
  const rawStatusLabel = getValue<string>(source, 'statusLabel', 'StatusLabel');

  return {
    appointmentId: Number(getValue(source, 'appointmentId', 'id', 'AppointmentId') ?? 0),
    clientId: Number(getValue(source, 'clientId', 'ClientId') ?? 0),
    procedureId: Number(getValue(source, 'procedureId', 'ProcedureId') ?? 0),
    clientName: getValue<string>(source, 'clientName', 'ClientName'),
    clientEmail: getValue<string>(source, 'clientEmail', 'ClientEmail'),
    clientPhone: getValue<string>(source, 'clientPhone', 'ClientPhone'),
    procedureName: getValue<string>(source, 'procedureName', 'ProcedureName'),
    status: mapStatusFromApi(rawStatus, rawStatusLabel),
    statusLabel: rawStatusLabel,
    startDateTime: String(getValue(source, 'startDateTime', 'startTime', 'StartDateTime', 'StartTime') ?? ''),
    endDateTime: getValue<string>(source, 'endDateTime', 'endTime', 'EndDateTime', 'EndTime'),
    durationInMinutes: Number(getValue(source, 'durationInMinutes', 'DurationInMinutes') ?? 0) || undefined,
    price: Number(getValue(source, 'price', 'Price', 'priceAtTime', 'PriceAtTime', 'amount', 'Amount') ?? 0) || undefined,
    notes: getValue<string>(source, 'notes', 'observation', 'Observations', 'Notes'),
  };
};

const normalizeCalendarSummary = (raw: unknown): AppointmentCalendarDaySummary => {
  const source = (raw ?? {}) as Record<string, unknown>;
  return {
    date: String(getValue(source, 'date', 'Date') ?? ''),
    totalAppointments: Number(
      getValue(source, 'totalAppointments', 'appointmentCount', 'appointmentsCount', 'count', 'total', 'TotalAppointments', 'AppointmentCount') ?? 0,
    ),
  };
};

const mapStatusFromApi = (status: unknown, statusLabel?: string): AppointmentStatus => {
  if (typeof status === 'number') {
    if (status === 0) return 'Scheduled';
    if (status === 1) return 'Confirmed';
    if (status === 2) return 'Completed';
    if (status === 3) return 'Cancelled';
    if (status === 4) return 'NoShow';
  }

  if (typeof status === 'string' && status.trim()) {
    const normalized = status.trim().toLowerCase();
    if (normalized === 'noshow' || normalized === 'no_show' || normalized === 'no-show') return 'NoShow';
    return status;
  }
  if (statusLabel) {
    const normalizedLabel = statusLabel.toLowerCase();
    if (normalizedLabel.includes('agend')) return 'Scheduled';
    if (normalizedLabel.includes('confirm')) return 'Confirmed';
    if (normalizedLabel.includes('concl')) return 'Completed';
    if (normalizedLabel.includes('cancel')) return 'Cancelled';
    if (normalizedLabel.includes('falt') || normalizedLabel.includes('no show')) return 'NoShow';
  }

  return 'Scheduled';
};

const mapStatusToApi = (status: AppointmentStatus): number => {
  if (status === 'Scheduled') return 0;
  if (status === 'Confirmed') return 1;
  if (status === 'Completed') return 2;
  if (status === 'Cancelled') return 3;
  if (status === 'NoShow') return 4;
  return 0;
};

const unwrap = <TData, TMeta = unknown>(
  response: RawApiResponse<TData, TMeta> | TData,
  fallbackError: string,
): { data: TData; meta?: TMeta } => {
  if (response && typeof response === 'object' && 'success' in (response as Record<string, unknown>)) {
    const wrapped = response as RawApiResponse<TData, TMeta>;
    if (wrapped.success === false) throw new Error(wrapped.message || fallbackError);
    return { data: wrapped.data as TData, meta: wrapped.meta };
  }

  return { data: response as TData };
};

export async function fetchAppointments(token: string): Promise<Appointment[]> {
  const response = await apiRequest<RawApiResponse<unknown[]> | unknown[]>('/api/Appointment', {
    method: 'GET',
    token,
  });
  const unwrapped = unwrap<unknown[]>(response, 'Nao foi possivel carregar os agendamentos.');
  return Array.isArray(unwrapped.data) ? unwrapped.data.map(normalizeAppointment) : [];
}

export async function fetchAppointmentById(token: string, appointmentId: number): Promise<Appointment> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Appointment/${appointmentId}`, {
    method: 'GET',
    token,
  });
  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel carregar o agendamento.');
  return normalizeAppointment(unwrapped.data);
}

export async function createAppointment(token: string, payload: CreateAppointmentPayload): Promise<Appointment> {
  const requestBody = {
    clientId: payload.clientId,
    procedureId: payload.procedureId,
    startTime: payload.startDateTime,
    notes: payload.notes,
  };

  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Appointment', {
    method: 'POST',
    token,
    body: JSON.stringify(requestBody),
  });
  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel criar o agendamento.');
  return normalizeAppointment(unwrapped.data);
}

export async function updateAppointment(
  token: string,
  appointmentId: number,
  payload: UpdateAppointmentPayload,
): Promise<Appointment> {
  const requestBody = {
    clientId: payload.clientId,
    procedureId: payload.procedureId,
    startTime: payload.startDateTime,
    notes: payload.notes,
    status: mapStatusToApi(payload.status ?? 'Scheduled'),
  };

  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Appointment/${appointmentId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(requestBody),
  });
  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel atualizar o agendamento.');
  return normalizeAppointment(unwrapped.data);
}

export async function deleteAppointment(token: string, appointmentId: number): Promise<void> {
  await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Appointment/${appointmentId}`, {
    method: 'DELETE',
    token,
  });
}

export async function fetchAppointmentsByDay(token: string, date: string): Promise<Appointment[]> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Appointment/day?date=${date}`, {
    method: 'GET',
    token,
  });
  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel carregar a agenda do dia.');
  const source = (unwrapped.data ?? {}) as Record<string, unknown>;
  const appointments = getValue<unknown[]>(source, 'appointments', 'Appointments') ?? [];
  return Array.isArray(appointments) ? appointments.map(normalizeAppointment) : [];
}

export async function fetchCalendarRangeSummary(
  token: string,
  startDate: string,
  endDate: string,
): Promise<AppointmentCalendarDaySummary[]> {
  const response = await apiRequest<RawApiResponse<unknown[]> | unknown[]>(
    `/api/Appointment/calendar-range?startDate=${startDate}&endDate=${endDate}`,
    {
      method: 'GET',
      token,
    },
  );

  const unwrapped = unwrap<unknown[]>(response, 'Nao foi possivel carregar o resumo de agenda.');
  return Array.isArray(unwrapped.data) ? unwrapped.data.map(normalizeCalendarSummary) : [];
}

export async function fetchAvailableSlots(token: string, date: string, procedureId: number): Promise<string[]> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(
    `/api/Appointment/available-slots?date=${date}&procedureId=${procedureId}`,
    {
      method: 'GET',
      token,
    },
  );

  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel carregar os horarios disponiveis.');
  const source = (unwrapped.data ?? {}) as Record<string, unknown>;
  const slots = getValue<unknown[]>(source, 'slots', 'Slots') ?? [];
  if (!Array.isArray(slots)) return [];

  return slots
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const source = item as Record<string, unknown>;
        const isAvailable = Boolean(getValue(source, 'available', 'Available'));
        if (!isAvailable) return '';
        return String(getValue(source, 'time', 'slot', 'startTime', 'StartTime') ?? '');
      }
      return '';
    })
    .filter(Boolean);
}

export async function updateAppointmentStatus(
  token: string,
  appointmentId: number,
  status: AppointmentStatus,
): Promise<Appointment> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(
    `/api/Appointment/${appointmentId}/status?status=${mapStatusToApi(status)}`,
    {
      method: 'PATCH',
      token,
    },
  );

  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel atualizar o status do agendamento.');
  return normalizeAppointment(unwrapped.data);
}
