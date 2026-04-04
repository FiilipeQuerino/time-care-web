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
