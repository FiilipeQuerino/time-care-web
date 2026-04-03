import { Client, Procedure } from '../../types';

export type ClientStatusFilter = 'all' | 'active' | 'inactive';
export type ReportPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
export type ReportCategory = 'financeiro' | 'clientes' | 'procedimentos' | 'agenda' | 'comercial' | 'performance';
export type ReportMode = 'summary' | 'detailed';

export interface ReportFilters {
  professional: string;
  procedure: string;
  category: string;
  status: string;
  client: string;
  leadSource: string;
  startDate: string;
  endDate: string;
}

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
}

export interface ProcedureFormState {
  name: string;
  price: string;
  duration: string;
  category: number;
}

export interface EditClientFormState {
  name: string;
  email: string;
  phone: string;
  gender: number;
}

export interface ReportSnapshot {
  totalRevenue: number;
  ticketAverage: number;
  totalAppointments: number;
  attendanceRate: number;
  cancellations: number;
  newClients: number;
  recurringClients: number;
  proceduresPerformed: number;
  leadConversionRate: number;
  scheduleOccupancy: number;
}

export interface ReportContextData {
  clients: Client[];
  procedures: Procedure[];
}
