
export type AppointmentStatus = 'pending' | 'confirmed' | 'finished' | 'canceled';
export type AppointmentType = 'facial' | 'corporal' | 'estetica' | 'block';

export interface Appointment {
  id: number;
  date: string; // Formato YYYY-MM-DD
  time: string;
  endTime: string;
  client: string;
  service: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalSpent: string;
  status: 'Ativo' | 'Inativo' | 'VIP';
}

export interface Service {
  id: number;
  name: string;
  price: string;
  duration: number; // minutes
  category: 'Facial' | 'Corporal' | 'Estética';
  active: boolean;
}

export interface Alert {
  id: number;
  message: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
}

export interface WeeklyData {
  day: string;
  count: number;
  revenue: number;
}
