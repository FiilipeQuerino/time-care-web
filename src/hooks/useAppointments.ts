import { useCallback, useMemo, useState } from 'react';
import {
  Appointment,
  AppointmentStatus,
  CreateAppointmentPayload,
  CreateScheduleBlockPayload,
  ScheduleBlock,
  UpdateScheduleBlockPayload,
  UpdateAppointmentPayload,
} from '../types/appointment';
import {
  createAppointment,
  createScheduleBlock,
  deleteScheduleBlock,
  deleteAppointment,
  fetchAppointmentById,
  fetchAppointments,
  fetchAppointmentsByDay,
  updateScheduleBlock,
  updateAppointment,
  updateAppointmentStatus,
} from '../services/appointmentService';
import { getAppointmentDate } from '../pages/dashboard/agenda/dateUtils';

export const useAppointments = (token: string | null) => {
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [dayBlocks, setDayBlocks] = useState<ScheduleBlock[]>([]);
  const [isLoadingDay, setIsLoadingDay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAll = useCallback(async () => {
    if (!token) return;
    const data = await fetchAppointments(token);
    setAllAppointments(data);
  }, [token]);

  const loadDay = useCallback(async (date: string) => {
    if (!token) return;
    setIsLoadingDay(true);
    try {
      const data = await fetchAppointmentsByDay(token, date);
      setDayAppointments(data.appointments);
      setDayBlocks(data.blocks);
    } finally {
      setIsLoadingDay(false);
    }
  }, [token]);

  const loadById = useCallback(async (appointmentId: number) => {
    if (!token) throw new Error('Token de autenticacao indisponivel.');
    return fetchAppointmentById(token, appointmentId);
  }, [token]);

  const upsertLocal = useCallback((nextItem: Appointment) => {
    setAllAppointments((current) => {
      const existingIndex = current.findIndex((item) => item.appointmentId === nextItem.appointmentId);
      if (existingIndex === -1) return [nextItem, ...current];
      return current.map((item) => (item.appointmentId === nextItem.appointmentId ? nextItem : item));
    });

    setDayAppointments((current) => {
      const selectedDate = getAppointmentDate(nextItem);
      const dayDate = current[0] ? getAppointmentDate(current[0]) : selectedDate;

      if (selectedDate !== dayDate) {
        return current.filter((item) => item.appointmentId !== nextItem.appointmentId);
      }

      const exists = current.some((item) => item.appointmentId === nextItem.appointmentId);
      if (!exists) return [...current, nextItem];
      return current.map((item) => (item.appointmentId === nextItem.appointmentId ? nextItem : item));
    });
  }, []);

  const create = useCallback(async (payload: CreateAppointmentPayload) => {
    if (!token) throw new Error('Token de autenticacao indisponivel.');
    setIsSubmitting(true);
    try {
      const created = await createAppointment(token, payload);
      upsertLocal(created);
      return created;
    } finally {
      setIsSubmitting(false);
    }
  }, [token, upsertLocal]);

  const update = useCallback(async (appointmentId: number, payload: UpdateAppointmentPayload) => {
    if (!token) throw new Error('Token de autenticacao indisponivel.');
    setIsSubmitting(true);
    try {
      const updated = await updateAppointment(token, appointmentId, payload);
      upsertLocal(updated);
      return updated;
    } finally {
      setIsSubmitting(false);
    }
  }, [token, upsertLocal]);

  const remove = useCallback(async (appointmentId: number) => {
    if (!token) throw new Error('Token de autenticacao indisponivel.');
    setIsSubmitting(true);
    try {
      await deleteAppointment(token, appointmentId);
      setAllAppointments((current) => current.filter((item) => item.appointmentId !== appointmentId));
      setDayAppointments((current) => current.filter((item) => item.appointmentId !== appointmentId));
    } finally {
      setIsSubmitting(false);
    }
  }, [token]);

  const createBlock = useCallback(async (payload: CreateScheduleBlockPayload) => {
    if (!token) throw new Error('Token de autenticacao indisponivel.');
    setIsSubmitting(true);
    try {
      const created = await createScheduleBlock(token, payload);
      setDayBlocks((current) => [...current, created].sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)));
      return created;
    } finally {
      setIsSubmitting(false);
    }
  }, [token]);

  const updateBlock = useCallback(async (scheduleBlockId: number, payload: UpdateScheduleBlockPayload) => {
    if (!token) throw new Error('Token de autenticacao indisponivel.');
    setIsSubmitting(true);
    try {
      const updated = await updateScheduleBlock(token, scheduleBlockId, payload);
      setDayBlocks((current) =>
        current
          .map((item) => (item.scheduleBlockId === scheduleBlockId ? updated : item))
          .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)),
      );
      return updated;
    } finally {
      setIsSubmitting(false);
    }
  }, [token]);

  const removeBlock = useCallback(async (scheduleBlockId: number) => {
    if (!token) throw new Error('Token de autenticacao indisponivel.');
    setIsSubmitting(true);
    try {
      await deleteScheduleBlock(token, scheduleBlockId);
      setDayBlocks((current) => current.filter((item) => item.scheduleBlockId !== scheduleBlockId));
    } finally {
      setIsSubmitting(false);
    }
  }, [token]);

  const changeStatus = useCallback(async (appointmentId: number, status: AppointmentStatus) => {
    if (!token) throw new Error('Token de autenticacao indisponivel.');
    setIsSubmitting(true);
    try {
      const updated = await updateAppointmentStatus(token, appointmentId, status);
      upsertLocal(updated);
      return updated;
    } finally {
      setIsSubmitting(false);
    }
  }, [token, upsertLocal]);

  const appointmentsByDate = useMemo(() => {
    const grouped = new Map<string, Appointment[]>();

    allAppointments.forEach((appointment) => {
      const key = getAppointmentDate(appointment);
      grouped.set(key, [...(grouped.get(key) ?? []), appointment]);
    });

    return grouped;
  }, [allAppointments]);

  return {
    allAppointments,
    dayAppointments,
    dayBlocks,
    appointmentsByDate,
    isLoadingDay,
    isSubmitting,
    loadAll,
    loadDay,
    loadById,
    create,
    update,
    remove,
    createBlock,
    updateBlock,
    removeBlock,
    changeStatus,
  };
};
