export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow'
  | 'Rescheduled'
  | string;

export interface Appointment {
  appointmentId: number;
  clientId: number;
  procedureId: number;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  procedureName?: string;
  status: AppointmentStatus;
  statusLabel?: string;
  startDateTime: string;
  endDateTime?: string;
  durationInMinutes?: number;
  price?: number;
  notes?: string;
}

export interface AppointmentCalendarDaySummary {
  date: string;
  totalAppointments: number;
  isBlocked?: boolean;
}

export interface ScheduleBlock {
  scheduleBlockId: number;
  startDateTime: string;
  endDateTime: string;
  reason?: string;
  isAllDay: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentDayAgenda {
  date: string;
  appointments: Appointment[];
  blocks: ScheduleBlock[];
}

export interface CreateAppointmentPayload {
  clientId: number;
  procedureId: number;
  startDateTime: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface UpdateAppointmentPayload extends CreateAppointmentPayload {}

export interface CreateScheduleBlockPayload {
  startDateTime: string;
  endDateTime: string;
  reason?: string;
  isAllDay: boolean;
}

export interface UpdateScheduleBlockPayload extends CreateScheduleBlockPayload {}
