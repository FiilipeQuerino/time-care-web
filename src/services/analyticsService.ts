import { ApiResponse } from '../types/api';
import { AnalyticsFilters, FinancialSummary, PerformanceSummary } from '../types/analytics';
import { API_BASE_URL, apiRequest } from './api';

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
    if ('success' in source || 'Success' in source || 'data' in source || 'Data' in source) {
      const success = getValue<boolean>(source, 'success', 'Success');
      const message = getValue<string>(source, 'message', 'Message');
      const data = getValue<TData>(source, 'data', 'Data');
      if (success === false) throw new Error(message || fallbackError);
      return data as TData;
    }
  }
  return response as TData;
};

const toNumber = (value: unknown): number => Number(value ?? 0) || 0;

const buildQuery = (filters: AnalyticsFilters): string => {
  const params = new URLSearchParams();
  params.set('StartDate', filters.startDate);
  params.set('EndDate', filters.endDate);
  if (typeof filters.unitId === 'number' && Number.isFinite(filters.unitId)) params.set('UnitId', String(filters.unitId));
  if (filters.professionalId?.trim()) params.set('ProfessionalId', filters.professionalId.trim());
  if (typeof filters.status === 'number' && Number.isFinite(filters.status)) params.set('Status', String(filters.status));
  return params.toString();
};

const normalizeFinancial = (raw: unknown): FinancialSummary => {
  const source = (raw ?? {}) as Record<string, unknown>;
  const rawBreakdown = getValue<unknown[]>(source, 'breakdownByProcedure', 'BreakdownByProcedure') ?? [];

  return {
    totalReceived: toNumber(getValue(source, 'totalReceived', 'TotalReceived')),
    totalOutstanding: toNumber(getValue(source, 'totalOutstanding', 'TotalOutstanding')),
    totalBilled: toNumber(getValue(source, 'totalBilled', 'TotalBilled')),
    receiptsCount: toNumber(getValue(source, 'receiptsCount', 'ReceiptsCount')),
    previousPeriodReceived: toNumber(getValue(source, 'previousPeriodReceived', 'PreviousPeriodReceived')),
    receivedVariationPercent: toNumber(getValue(source, 'receivedVariationPercent', 'ReceivedVariationPercent')),
    breakdownByProcedure: Array.isArray(rawBreakdown)
      ? rawBreakdown.map((item) => {
          const line = (item ?? {}) as Record<string, unknown>;
          return {
            name: String(getValue(line, 'name', 'Name') ?? ''),
            received: toNumber(getValue(line, 'received', 'Received')),
            outstanding: toNumber(getValue(line, 'outstanding', 'Outstanding')),
            appointmentsCount: toNumber(getValue(line, 'appointmentsCount', 'AppointmentsCount')),
          };
        })
      : [],
  };
};

const normalizePerformance = (raw: unknown): PerformanceSummary => {
  const source = (raw ?? {}) as Record<string, unknown>;
  return {
    totalAppointments: toNumber(getValue(source, 'totalAppointments', 'TotalAppointments')),
    completedAppointments: toNumber(getValue(source, 'completedAppointments', 'CompletedAppointments')),
    cancelledAppointments: toNumber(getValue(source, 'cancelledAppointments', 'CancelledAppointments')),
    noShowAppointments: toNumber(getValue(source, 'noShowAppointments', 'NoShowAppointments')),
    scheduledAppointments: toNumber(getValue(source, 'scheduledAppointments', 'ScheduledAppointments')),
    confirmedAppointments: toNumber(getValue(source, 'confirmedAppointments', 'ConfirmedAppointments')),
    occupancyRatePercent: toNumber(getValue(source, 'occupancyRatePercent', 'OccupancyRatePercent')),
    completionRatePercent: toNumber(getValue(source, 'completionRatePercent', 'CompletionRatePercent')),
    cancellationRatePercent: toNumber(getValue(source, 'cancellationRatePercent', 'CancellationRatePercent')),
    noShowRatePercent: toNumber(getValue(source, 'noShowRatePercent', 'NoShowRatePercent')),
  };
};

export async function fetchAnalyticsFinancial(token: string, filters: AnalyticsFilters): Promise<FinancialSummary> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Analytics/financial?${buildQuery(filters)}`, {
    method: 'GET',
    token,
  });
  return normalizeFinancial(unwrap(response, 'Nao foi possivel carregar financeiro.'));
}

export async function fetchAnalyticsPerformance(token: string, filters: AnalyticsFilters): Promise<PerformanceSummary> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Analytics/performance?${buildQuery(filters)}`, {
    method: 'GET',
    token,
  });
  return normalizePerformance(unwrap(response, 'Nao foi possivel carregar desempenho.'));
}

const downloadFileFromEndpoint = async (
  token: string,
  endpoint: '/api/Analytics/export/csv' | '/api/Analytics/export/pdf',
  filters: AnalyticsFilters,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}?${buildQuery(filters)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Falha ao exportar arquivo.');
  }

  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') ?? '';
  const match = disposition.match(/filename=\"?([^\";]+)\"?/i);
  const fileName = match?.[1] ?? (endpoint.endsWith('/pdf') ? 'relatorio.pdf' : 'relatorio.csv');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export async function exportAnalyticsCsv(token: string, filters: AnalyticsFilters): Promise<void> {
  await downloadFileFromEndpoint(token, '/api/Analytics/export/csv', filters);
}

export async function exportAnalyticsPdf(token: string, filters: AnalyticsFilters): Promise<void> {
  await downloadFileFromEndpoint(token, '/api/Analytics/export/pdf', filters);
}

