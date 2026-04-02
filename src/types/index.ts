export interface User {
  id: string;
  name?: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<TData, TMeta = unknown> {
  success: boolean;
  message: string;
  data: TData;
  meta?: TMeta;
}

export interface LoginResponseData {
  token: string;
  email: string;
  userId: string;
  expiresAt: string;
}

export interface DashboardFinancialData {
  totalRevenue: number;
  totalAppointments: number;
  todayRevenue: number;
  todayAppointments: number;
  monthRevenue: number;
  monthAppointments: number;
  revenueByDay: Array<{
    date: string;
    value: number;
  }>;
  topProcedures: Array<{
    procedureName: string;
    total: number;
  }>;
}

export interface Client {
  clientId: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  gender?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type MenuSection =
  | 'dashboard'
  | 'clientes'
  | 'procedimentos'
  | 'agenda'
  | 'estoque'
  | 'relatorios'
  | 'config';

export interface NavigationItem {
  id: MenuSection;
  label: string;
}

export interface CreateClientPayload {
  name: string;
  email: string;
  phone: string;
  gender: number;
}

export interface UpdateClientPayload extends CreateClientPayload {}

export interface Procedure {
  procedureId: number;
  name: string;
  suggestedPrice: number;
  estimatedDurationInMinutes: number;
  category: number;
}

export interface CreateProcedurePayload {
  name: string;
  suggestedPrice: number;
  estimatedDurationInMinutes: number;
  category: number;
}
