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
  startDateTime: string;
  endDateTime?: string;
  durationInMinutes?: number;
  price?: number;
  notes?: string;
}

export interface AppointmentCalendarDaySummary {
  date: string;
  totalAppointments: number;
}

export interface CreateAppointmentPayload {
  clientId: number;
  procedureId: number;
  startDateTime: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface UpdateAppointmentPayload extends CreateAppointmentPayload {}
