import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useAppointments } from '../../../hooks/useAppointments';
import { useAvailableSlots } from '../../../hooks/useAvailableSlots';
import { useCalendarRange } from '../../../hooks/useCalendarRange';
import { fetchClients, fetchProcedures } from '../../../services/dashboardService';
import {
  Appointment,
  AppointmentStatus,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../../../types/appointment';
import { Client } from '../../../types/client';
import { Procedure } from '../../../types/procedure';
import { AppointmentCreateDrawer } from '../agenda/components/AppointmentCreateDrawer';
import { AppointmentDetailsSheet } from '../agenda/components/AppointmentDetailsSheet';
import { AvailableSlotsList } from '../agenda/components/AvailableSlotsList';
import { WeeklyCalendar } from '../agenda/components/WeeklyCalendar';
import {
  addWeeks,
  formatTime,
  fromDateInputValue,
  getAppointmentDate,
  getAppointmentTimeRange,
  getMonthEnd,
  getMonthStart,
  getStartOfWeek,
  toDateInputValue,
  toIsoDateTime,
} from '../agenda/dateUtils';

const toMonthInput = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export const AgendaSection = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [weekStart, setWeekStart] = useState<Date>(getStartOfWeek(today));
  const [monthValue, setMonthValue] = useState<string>(toMonthInput(today));

  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [createClientId, setCreateClientId] = useState<number | null>(null);
  const [createProcedureId, setCreateProcedureId] = useState<number | null>(null);
  const [createNotes, setCreateNotes] = useState('');

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editClientId, setEditClientId] = useState<number | null>(null);
  const [editProcedureId, setEditProcedureId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<AppointmentStatus>('Scheduled');

  const selectedDateValue = toDateInputValue(selectedDate);
  const selectedProcedure = procedures.find((item) => item.procedureId === createProcedureId) ?? null;

  const {
    dayAppointments,
    isLoadingDay,
    isSubmitting,
    loadDay,
    create,
    update,
    remove,
    changeStatus,
  } = useAppointments(token);
  const { countsByDate, loadRange } = useCalendarRange(token);
  const { buildSlots, isLoadingSlots, loadSlots } = useAvailableSlots(token);

  const slots = useMemo(
    () => buildSlots(dayAppointments, selectedProcedure?.estimatedDurationInMinutes, Boolean(createProcedureId)),
    [buildSlots, dayAppointments, createProcedureId, selectedProcedure?.estimatedDurationInMinutes],
  );

  useEffect(() => {
    if (!token) return;

    const loadBaseData = async () => {
      try {
        const [clientsResponse, proceduresResponse] = await Promise.all([
          fetchClients(token),
          fetchProcedures(token),
        ]);

        setClients(clientsResponse.items.filter((item) => item.isActive));
        setProcedures(proceduresResponse);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar dados da agenda.';
        showToast(message, 'error');
      }
    };

    void loadBaseData();
  }, [showToast, token]);

  useEffect(() => {
    void loadDay(selectedDateValue).catch((error) => {
      const message = error instanceof Error ? error.message : 'Erro ao carregar agenda do dia.';
      showToast(message, 'error');
    });
  }, [loadDay, selectedDateValue, showToast]);

  useEffect(() => {
    const startDate = toDateInputValue(getMonthStart(fromDateInputValue(`${monthValue}-01`)));
    const endDate = toDateInputValue(getMonthEnd(fromDateInputValue(`${monthValue}-01`)));

    void loadRange(startDate, endDate).catch((error) => {
      const message = error instanceof Error ? error.message : 'Erro ao carregar resumo mensal.';
      showToast(message, 'error');
    });
  }, [loadRange, monthValue, showToast]);

  useEffect(() => {
    if (!createProcedureId) {
      loadSlots(selectedDateValue, null).catch(() => undefined);
      return;
    }

    void loadSlots(selectedDateValue, createProcedureId).catch((error) => {
      const message = error instanceof Error ? error.message : 'Erro ao carregar slots disponiveis.';
      showToast(message, 'error');
    });
  }, [createProcedureId, loadSlots, selectedDateValue, showToast]);

  const resetCreateFlow = () => {
    setSelectedSlot('');
    setCreateClientId(null);
    setCreateProcedureId(null);
    setCreateNotes('');
    setIsCreateDrawerOpen(false);
  };

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    setWeekStart(getStartOfWeek(date));
    setMonthValue(toMonthInput(date));
    resetCreateFlow();
  };

  const handlePrevWeek = () => {
    setWeekStart((current) => {
      const next = addWeeks(current, -1);
      setSelectedDate((prev) => addWeeks(prev, -1));
      setMonthValue(toMonthInput(next));
      return next;
    });
    resetCreateFlow();
  };

  const handleNextWeek = () => {
    setWeekStart((current) => {
      const next = addWeeks(current, 1);
      setSelectedDate((prev) => addWeeks(prev, 1));
      setMonthValue(toMonthInput(next));
      return next;
    });
    resetCreateFlow();
  };

  const handleGoToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setWeekStart(getStartOfWeek(now));
    setMonthValue(toMonthInput(now));
    resetCreateFlow();
  };

  const handleMonthChange = (value: string) => {
    setMonthValue(value);
    const selectedMonthDate = fromDateInputValue(`${value}-01`);
    setSelectedDate(selectedMonthDate);
    setWeekStart(getStartOfWeek(selectedMonthDate));
    resetCreateFlow();
  };

  const openCreateFlowFromSlot = (time: string) => {
    setSelectedSlot(time);
    setCreateClientId(null);
    setCreateProcedureId(null);
    setCreateNotes('');
    setIsCreateDrawerOpen(true);
  };

  const handleCreateAppointment = async () => {
    if (!createClientId || !createProcedureId || !selectedSlot) {
      showToast('Selecione cliente, procedimento e horario.', 'info');
      return;
    }

    const slotStillAvailable = slots.some((slot) => slot.time === selectedSlot && slot.isAvailable);
    if (!slotStillAvailable) {
      showToast('Horario indisponivel para este procedimento.', 'info');
      return;
    }

    const payload: CreateAppointmentPayload = {
      clientId: createClientId,
      procedureId: createProcedureId,
      startDateTime: toIsoDateTime(selectedDateValue, selectedSlot),
      notes: createNotes.trim() || undefined,
    };

    try {
      await create(payload);
      resetCreateFlow();
      showToast('Agendamento criado com sucesso.', 'success');
      await Promise.all([
        loadDay(selectedDateValue),
        loadSlots(selectedDateValue, createProcedureId),
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel criar o agendamento.';
      showToast(message, 'error');
    }
  };

  const openAppointmentDetails = (appointment: Appointment) => {
    const range = getAppointmentTimeRange(appointment);
    setSelectedAppointment(appointment);
    setEditClientId(appointment.clientId || null);
    setEditProcedureId(appointment.procedureId || null);
    setEditDate(getAppointmentDate(appointment));
    setEditStartTime(range.start || '');
    setEditNotes(appointment.notes ?? '');
    setEditStatus(appointment.status || 'Scheduled');
    setIsDetailsOpen(true);
  };

  const closeAppointmentDetails = () => {
    setIsDetailsOpen(false);
    setSelectedAppointment(null);
  };

  const handleSaveAppointment = async () => {
    if (!selectedAppointment || !editClientId || !editProcedureId || !editDate || !editStartTime) {
      showToast('Preencha cliente, procedimento, data e horario.', 'info');
      return;
    }

    const payload: UpdateAppointmentPayload = {
      clientId: editClientId,
      procedureId: editProcedureId,
      startDateTime: toIsoDateTime(editDate, editStartTime),
      notes: editNotes.trim() || undefined,
      status: editStatus,
    };

    try {
      await update(selectedAppointment.appointmentId, payload);
      if (editStatus !== selectedAppointment.status) {
        await changeStatus(selectedAppointment.appointmentId, editStatus);
      }

      showToast('Agendamento atualizado com sucesso.', 'success');

      if (editDate === selectedDateValue) {
        await loadDay(selectedDateValue);
      } else {
        await loadDay(selectedDateValue);
      }

      if (createProcedureId) {
        await loadSlots(selectedDateValue, createProcedureId);
      }

      closeAppointmentDetails();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel atualizar o agendamento.';
      showToast(message, 'error');
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await remove(selectedAppointment.appointmentId);
      showToast('Agendamento excluido com sucesso.', 'success');
      await loadDay(selectedDateValue);
      if (createProcedureId) {
        await loadSlots(selectedDateValue, createProcedureId);
      }
      closeAppointmentDetails();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel excluir o agendamento.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <section className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Agenda</h3>
          <p className="text-sm text-slate-500">Selecione dia e horario.</p>
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-17.5rem)] flex-col rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm sm:min-h-[calc(100vh-14rem)] sm:p-4">
        <WeeklyCalendar
          weekStart={weekStart}
          selectedDate={selectedDate}
          countsByDate={countsByDate}
          onSelectDate={handleSelectDay}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleGoToday}
          monthValue={monthValue}
          onMonthChange={handleMonthChange}
        />

        <div className="mt-3 min-h-0 flex-1">
          <AvailableSlotsList
            slots={slots}
            selectedSlot={selectedSlot}
            isLoading={isLoadingSlots || isLoadingDay}
            appointments={dayAppointments}
            onSelectSlot={openCreateFlowFromSlot}
            onOpenAppointment={openAppointmentDetails}
          />
        </div>
      </section>

      <AppointmentCreateDrawer
        isOpen={isCreateDrawerOpen}
        date={selectedDateValue}
        selectedSlot={selectedSlot}
        clients={clients}
        procedures={procedures}
        selectedClientId={createClientId}
        selectedProcedureId={createProcedureId}
        notes={createNotes}
        isSubmitting={isSubmitting}
        onClose={resetCreateFlow}
        onChangeClient={(client) => setCreateClientId(client.clientId)}
        onChangeProcedure={(procedure) => setCreateProcedureId(procedure.procedureId)}
        onChangeNotes={setCreateNotes}
        onConfirm={() => void handleCreateAppointment()}
      />

      <AppointmentDetailsSheet
        isOpen={isDetailsOpen}
        appointment={selectedAppointment}
        clients={clients}
        procedures={procedures}
        selectedClientId={editClientId}
        selectedProcedureId={editProcedureId}
        date={editDate}
        startTime={formatTime(editStartTime)}
        notes={editNotes}
        status={editStatus}
        isSubmitting={isSubmitting}
        onClose={closeAppointmentDetails}
        onChangeClient={(client) => setEditClientId(client.clientId)}
        onChangeProcedure={(procedure) => setEditProcedureId(procedure.procedureId)}
        onChangeDate={setEditDate}
        onChangeStartTime={setEditStartTime}
        onChangeNotes={setEditNotes}
        onChangeStatus={(value) => setEditStatus(value)}
        onSave={() => void handleSaveAppointment()}
        onDelete={() => void handleDeleteAppointment()}
      />

    </div>
  );
};
