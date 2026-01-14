
export interface Appointment {
  id: number;
  time: string; // HH:mm
  endTime: string; // HH:mm
  client: string;
  service: string;
  duration: number; // minutes
  type: 'facial' | 'corporal' | 'estetica' | 'block';
  status: 'confirmed' | 'pending' | 'finished' | 'canceled';
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
