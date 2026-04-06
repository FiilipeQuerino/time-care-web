import { ApiResponse, PaginationMeta } from '../types/api';
import { DashboardFinancialData } from '../types/dashboard';
import { Client, CreateClientPayload, UpdateClientPayload } from '../types/client';
import { Procedure, CreateProcedurePayload, UpdateProcedurePayload } from '../types/procedure';
import { apiRequest } from './api';

interface RawApiResponse<TData, TMeta = unknown> extends Partial<ApiResponse<TData, TMeta>> {
  success?: boolean;
  Success?: boolean;
  message?: string;
  Message?: string;
  data?: TData;
  Data?: TData;
  meta?: TMeta;
  Meta?: TMeta;
}

const getValue = <T>(source: Record<string, unknown>, ...keys: string[]): T | undefined => {
  for (const key of keys) {
    if (key in source) return source[key] as T;
  }
  return undefined;
};

const unwrap = <TData, TMeta = unknown>(
  response: RawApiResponse<TData, TMeta> | TData,
  fallbackError: string,
): { data: TData; meta?: TMeta } => {
  if (response && typeof response === 'object') {
    const source = response as Record<string, unknown>;
    const hasWrapperShape =
      'success' in source || 'Success' in source || 'data' in source || 'Data' in source;

    if (hasWrapperShape) {
      const success = getValue<boolean>(source, 'success', 'Success');
      const message = getValue<string>(source, 'message', 'Message');
      const data = getValue<TData>(source, 'data', 'Data');
      const meta = getValue<TMeta>(source, 'meta', 'Meta');

      if (success === false) throw new Error(message || fallbackError);
      return { data: data as TData, meta };
    }
  }

  return { data: response as TData };
};

const normalizeClient = (raw: unknown): Client => {
  const source = (raw ?? {}) as Record<string, unknown>;

  return {
    clientId: Number(getValue(source, 'clientId', 'ClientId') ?? 0),
    name: String(getValue(source, 'name', 'Name') ?? ''),
    email: String(getValue(source, 'email', 'Email') ?? ''),
    phone: String(getValue(source, 'phone', 'Phone') ?? ''),
    isActive: Boolean(getValue(source, 'isActive', 'IsActive') ?? false),
    gender: Number(getValue(source, 'gender', 'Gender') ?? 0) || undefined,
  };
};

const normalizeProcedure = (raw: unknown): Procedure => {
  const source = (raw ?? {}) as Record<string, unknown>;

  return {
    procedureId: Number(getValue(source, 'procedureId', 'ProcedureId') ?? 0),
    name: String(getValue(source, 'name', 'Name') ?? ''),
    suggestedPrice: Number(getValue(source, 'suggestedPrice', 'SuggestedPrice') ?? 0),
    estimatedDurationInMinutes: Number(
      getValue(source, 'estimatedDurationInMinutes', 'EstimatedDurationInMinutes') ?? 0,
    ),
    category: Number(getValue(source, 'category', 'Category') ?? 0),
  };
};

const normalizeDashboardFinancial = (raw: unknown): DashboardFinancialData => {
  const source = (raw ?? {}) as Record<string, unknown>;
  const rawRevenueByDay = getValue<unknown[]>(source, 'revenueByDay', 'RevenueByDay') ?? [];
  const rawTopProcedures = getValue<unknown[]>(source, 'topProcedures', 'TopProcedures') ?? [];
  const rawTopClients = getValue<unknown[]>(source, 'topClients', 'TopClients') ?? [];
  const rawUpcomingAppointments =
    getValue<unknown[]>(source, 'upcomingAppointments', 'UpcomingAppointments') ?? [];

  return {
    totalRevenue: Number(getValue(source, 'totalRevenue', 'TotalRevenue') ?? 0),
    totalAppointments: Number(getValue(source, 'totalAppointments', 'TotalAppointments') ?? 0),
    todayRevenue: Number(getValue(source, 'todayRevenue', 'TodayRevenue') ?? 0),
    todayAppointments: Number(getValue(source, 'todayAppointments', 'TodayAppointments') ?? 0),
    monthRevenue: Number(getValue(source, 'monthRevenue', 'MonthRevenue') ?? 0),
    monthAppointments: Number(getValue(source, 'monthAppointments', 'MonthAppointments') ?? 0),
    revenueByDay: Array.isArray(rawRevenueByDay)
      ? rawRevenueByDay.map((item) => {
          const line = (item ?? {}) as Record<string, unknown>;
          return {
            date: String(getValue(line, 'date', 'Date') ?? ''),
            value: Number(getValue(line, 'value', 'Value', 'revenue', 'Revenue') ?? 0),
          };
        })
      : [],
    topProcedures: Array.isArray(rawTopProcedures)
      ? rawTopProcedures.map((item) => {
          const line = (item ?? {}) as Record<string, unknown>;
          return {
            procedureName: String(getValue(line, 'procedureName', 'ProcedureName') ?? ''),
            total: Number(getValue(line, 'total', 'Total', 'count', 'Count') ?? 0),
          };
        })
      : [],
    topClients: Array.isArray(rawTopClients)
      ? rawTopClients.map((item) => {
          const line = (item ?? {}) as Record<string, unknown>;
          return {
            clientName: String(getValue(line, 'clientName', 'ClientName', 'name', 'Name') ?? ''),
            total: Number(getValue(line, 'total', 'Total', 'count', 'Count') ?? 0),
          };
        })
      : [],
    upcomingAppointments: Array.isArray(rawUpcomingAppointments)
      ? rawUpcomingAppointments.map((item) => {
          const line = (item ?? {}) as Record<string, unknown>;
          return {
            appointmentId: Number(getValue(line, 'appointmentId', 'AppointmentId') ?? 0),
            clientId: Number(getValue(line, 'clientId', 'ClientId') ?? 0),
            clientName: String(getValue(line, 'clientName', 'ClientName') ?? ''),
            procedureId: Number(getValue(line, 'procedureId', 'ProcedureId') ?? 0),
            procedureName: String(getValue(line, 'procedureName', 'ProcedureName') ?? ''),
            startTime: String(getValue(line, 'startTime', 'StartTime') ?? ''),
            endTime: String(getValue(line, 'endTime', 'EndTime') ?? ''),
            status: Number(getValue(line, 'status', 'Status') ?? 0),
            statusLabel: String(getValue(line, 'statusLabel', 'StatusLabel') ?? ''),
          };
        })
      : [],
  };
};

export async function fetchDashboardFinancial(token: string): Promise<DashboardFinancialData> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Dashboard/financial', {
    method: 'GET',
    token,
  });

  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel carregar o dashboard.');
  return normalizeDashboardFinancial(unwrapped.data);
}

export async function fetchClients(token: string): Promise<{ items: Client[]; meta?: PaginationMeta }> {
  const response = await apiRequest<RawApiResponse<unknown[], PaginationMeta> | unknown[]>('/api/Client', {
    method: 'GET',
    token,
  });

  const unwrapped = unwrap<unknown[], PaginationMeta>(response, 'Nao foi possivel carregar os clientes.');

  return {
    items: Array.isArray(unwrapped.data) ? unwrapped.data.map(normalizeClient) : [],
    meta: unwrapped.meta,
  };
}

export async function createClient(token: string, payload: CreateClientPayload): Promise<Client> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Client', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel criar o cliente.');
  return normalizeClient(unwrapped.data);
}

export async function updateClient(token: string, clientId: number, payload: UpdateClientPayload): Promise<Client> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Client/${clientId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel atualizar o cliente.');
  return normalizeClient(unwrapped.data);
}

export async function updateClientStatus(token: string, clientId: number, isActive: boolean): Promise<Client> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Client/${clientId}/status?isActive=${String(isActive)}`, {
    method: 'PATCH',
    token,
  });

  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel alterar o status do cliente.');
  return normalizeClient(unwrapped.data);
}

export async function fetchProcedures(token: string): Promise<Procedure[]> {
  const response = await apiRequest<RawApiResponse<unknown[]> | unknown[]>('/api/Procedure', {
    method: 'GET',
    token,
  });

  const unwrapped = unwrap<unknown[]>(response, 'Nao foi possivel carregar os procedimentos.');
  return Array.isArray(unwrapped.data) ? unwrapped.data.map(normalizeProcedure) : [];
}

export async function createProcedure(token: string, payload: CreateProcedurePayload): Promise<Procedure> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Procedure', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel cadastrar o procedimento.');
  return normalizeProcedure(unwrapped.data);
}

export async function updateProcedure(token: string, procedureId: number, payload: UpdateProcedurePayload): Promise<Procedure> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Procedure/${procedureId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel atualizar o procedimento.');
  return normalizeProcedure(unwrapped.data);
}
