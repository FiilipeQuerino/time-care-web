export interface AnalyticsFilters {
  startDate: string;
  endDate: string;
  unitId?: number;
  professionalId?: string;
  status?: number;
}

export interface FinancialBreakdownItem {
  name: string;
  received: number;
  outstanding: number;
  appointmentsCount: number;
}

export interface FinancialSummary {
  totalReceived: number;
  totalOutstanding: number;
  totalBilled: number;
  receiptsCount: number;
  previousPeriodReceived: number;
  receivedVariationPercent: number;
  breakdownByProcedure: FinancialBreakdownItem[];
}

export interface PerformanceSummary {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  scheduledAppointments: number;
  confirmedAppointments: number;
  occupancyRatePercent: number;
  completionRatePercent: number;
  cancellationRatePercent: number;
  noShowRatePercent: number;
}

