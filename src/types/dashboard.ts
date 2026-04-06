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
  topClients?: Array<{
    clientName: string;
    total: number;
  }>;
  upcomingAppointments?: Array<{
    appointmentId: number;
    clientId: number;
    clientName: string;
    procedureId: number;
    procedureName: string;
    startTime: string;
    endTime: string;
    status: number;
    statusLabel: string;
  }>;
}
