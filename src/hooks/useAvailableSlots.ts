import { useCallback, useMemo, useState } from 'react';
import { Appointment } from '../types/appointment';
import { fetchAvailableSlots } from '../services/appointmentService';
import { generateTimeSlots, getAppointmentTimeRange, toMinutes } from '../pages/dashboard/agenda/dateUtils';

export interface SlotItem {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

const BASE_SLOTS = generateTimeSlots(7, 22, 30);
const DAY_END_MINUTES = 22 * 60;
const DEFAULT_DURATION = 30;

export const useAvailableSlots = (token: string | null) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const loadSlots = useCallback(async (date: string, procedureId?: number | null) => {
    if (!token || !procedureId) {
      setAvailableTimes([]);
      return;
    }

    setIsLoadingSlots(true);
    try {
      const slots = await fetchAvailableSlots(token, date, procedureId);
      setAvailableTimes(slots);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [token]);

  const buildSlots = useCallback(
    (
      dayAppointments: Appointment[],
      selectedProcedureDurationInMinutes?: number | null,
      hasProcedureSelected = false,
    ): SlotItem[] => {
      const duration = Math.max(DEFAULT_DURATION, selectedProcedureDurationInMinutes ?? DEFAULT_DURATION);
      const normalizedFromApi = new Set(availableTimes.map((slot) => slot.slice(0, 5)));

      const occupiedIntervals = dayAppointments
        .map(getAppointmentTimeRange)
        .filter((item) => item.start && item.end)
        .map((item) => ({
          start: toMinutes(item.start),
          end: toMinutes(item.end),
        }))
        .filter((item) => item.start >= 0 && item.end > item.start);

      return BASE_SLOTS.map((time) => {
        const start = toMinutes(time);
        const end = start + duration;
        const exceedsDayRange = end > DAY_END_MINUTES;
        const overlaps = occupiedIntervals.some((interval) => start < interval.end && end > interval.start);
        const localAvailability = !exceedsDayRange && !overlaps;
        const apiAvailability = !hasProcedureSelected || normalizedFromApi.size === 0 || normalizedFromApi.has(time);
        const isAvailable = localAvailability && apiAvailability;

        if (isAvailable) {
          return { time, isAvailable: true };
        }

        if (exceedsDayRange) {
          return {
            time,
            isAvailable: false,
            reason: 'Sem tempo suficiente ate 22:00',
          };
        }

        if (overlaps) {
          return {
            time,
            isAvailable: false,
            reason: 'Conflito com outro agendamento',
          };
        }

        return {
          time,
          isAvailable: false,
          reason: 'Indisponivel para o procedimento',
        };
      });
    },
    [availableTimes],
  );

  const hasAvailability = useMemo(() => availableTimes.length > 0, [availableTimes.length]);

  return {
    availableTimes,
    isLoadingSlots,
    hasAvailability,
    loadSlots,
    buildSlots,
  };
};
