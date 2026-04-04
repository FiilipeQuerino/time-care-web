import { Appointment } from '../../../types/appointment';

const MINUTES_IN_DAY = 24 * 60;

const pad = (value: number) => String(value).padStart(2, '0');

export const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

export const fromDateInputValue = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

export const getStartOfWeek = (date: Date): Date => {
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  current.setDate(current.getDate() - current.getDay());
  return current;
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
};

export const addWeeks = (date: Date, weeks: number): Date => addDays(date, weeks * 7);

export const getWeekDays = (weekStart: Date): Date[] => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

export const getMonthStart = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const getMonthEnd = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0);

export const formatWeekLabel = (weekStart: Date): string => {
  const weekEnd = addDays(weekStart, 6);
  const startLabel = weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const endLabel = weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return `${startLabel} - ${endLabel}`;
};

export const formatDayLabel = (date: Date): { weekdayShort: string; day: string; monthShort: string } => ({
  weekdayShort: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
  day: pad(date.getDate()),
  monthShort: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
});

export const formatTime = (value: string): string => {
  if (!value) return '';
  if (/^\d{2}:\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
  }

  const match = value.match(/(\d{2}:\d{2})/);
  return match?.[1] ?? '';
};

export const generateTimeSlots = (startHour = 7, endHour = 22, stepMinutes = 30): string[] => {
  const slots: string[] = [];
  const startTotal = Math.max(0, startHour * 60);
  const endTotal = Math.min(MINUTES_IN_DAY, endHour * 60);

  for (let minutes = startTotal; minutes <= endTotal; minutes += stepMinutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(`${pad(hour)}:${pad(minute)}`);
  }

  return slots;
};

export const toMinutes = (time: string): number => {
  const [hour, minute] = formatTime(time).split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return -1;
  return hour * 60 + minute;
};

export const addMinutes = (time: string, minutesToAdd: number): string => {
  const minutes = toMinutes(time);
  if (minutes < 0) return '';

  const total = minutes + minutesToAdd;
  const bounded = Math.max(0, total);
  const hour = Math.floor((bounded % MINUTES_IN_DAY) / 60);
  const minute = bounded % 60;

  return `${pad(hour)}:${pad(minute)}`;
};

const toLocalDateString = (isoOrDate: string | Date): string => {
  if (typeof isoOrDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(isoOrDate)) return isoOrDate;

  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return toDateInputValue(date);
};

export const toIsoDateTime = (date: string, time: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = formatTime(time).split(':').map(Number);
  const localDate = new Date(year, (month || 1) - 1, day || 1, hour || 0, minute || 0, 0);
  return localDate.toISOString();
};

export const getAppointmentDate = (appointment: Appointment): string => {
  return toLocalDateString(appointment.startDateTime);
};

export const getAppointmentTimeRange = (
  appointment: Appointment,
): { start: string; end: string; durationInMinutes: number } => {
  const start = formatTime(appointment.startDateTime);

  if (appointment.endDateTime) {
    const end = formatTime(appointment.endDateTime);
    const duration = Math.max(0, toMinutes(end) - toMinutes(start));
    return { start, end, durationInMinutes: duration || appointment.durationInMinutes || 0 };
  }

  const durationFallback = appointment.durationInMinutes ?? 0;
  return {
    start,
    end: durationFallback > 0 ? addMinutes(start, durationFallback) : '',
    durationInMinutes: durationFallback,
  };
};

export const buildDayAppointmentMap = (appointments: Appointment[]): Map<string, Appointment[]> => {
  const map = new Map<string, Appointment[]>();

  appointments.forEach((appointment) => {
    const date = getAppointmentDate(appointment);
    const list = map.get(date) ?? [];
    list.push(appointment);
    map.set(date, list);
  });

  return map;
};
