import { useCallback, useMemo, useState } from 'react';
import { fetchCalendarRangeSummary } from '../services/appointmentService';

export const useCalendarRange = (token: string | null) => {
  const [countsByDate, setCountsByDate] = useState<Record<string, number>>({});
  const [isLoadingRange, setIsLoadingRange] = useState(false);

  const loadRange = useCallback(async (startDate: string, endDate: string) => {
    if (!token) return;
    setIsLoadingRange(true);

    try {
      const summary = await fetchCalendarRangeSummary(token, startDate, endDate);
      const mapped: Record<string, number> = {};

      summary.forEach((item) => {
        if (!item.date) return;
        mapped[item.date] = item.totalAppointments;
      });

      setCountsByDate(mapped);
    } finally {
      setIsLoadingRange(false);
    }
  }, [token]);

  const getCount = useCallback((date: string) => countsByDate[date] ?? 0, [countsByDate]);

  const totalInRange = useMemo(
    () => (Object.values(countsByDate) as number[]).reduce((acc, value) => acc + value, 0),
    [countsByDate],
  );

  return {
    countsByDate,
    isLoadingRange,
    totalInRange,
    loadRange,
    getCount,
  };
};
