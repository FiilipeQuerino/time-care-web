import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
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
  CreateScheduleBlockPayload,
  ScheduleBlock,
  UpdateAppointmentPayload,
  UpdateScheduleBlockPayload,
} from '../../../types/appointment';
import { Client } from '../../../types/client';
import { Procedure } from '../../../types/procedure';
import { AppointmentCreateDrawer } from '../agenda/components/AppointmentCreateDrawer';
import { AppointmentDetailsSheet } from '../agenda/components/AppointmentDetailsSheet';
import { AvailableSlotsList } from '../agenda/components/AvailableSlotsList';
import { ScheduleBlockEditorSheet } from '../agenda/components/ScheduleBlockEditorSheet';
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

const getCurrentMonthRange = (monthValue: string): { startDate: string; endDate: string } => {
  const monthDate = fromDateInputValue(`${monthValue}-01`);
  return {
    startDate: toDateInputValue(getMonthStart(monthDate)),
    endDate: toDateInputValue(getMonthEnd(monthDate)),
  };
};

const extractDate = (value: string): string => toDateInputValue(new Date(value));

const toBlockPayload = (date: string, startTime: string, endTime: string, reason: string, isAllDay: boolean): CreateScheduleBlockPayload => {
  if (isAllDay) {
    return {
      startDateTime: toIsoDateTime(date, '00:00'),
      endDateTime: toIsoDateTime(date, '23:59'),
      reason: reason.trim() || undefined,
      isAllDay: true,
    };
  }

  return {
    startDateTime: toIsoDateTime(date, startTime),
    endDateTime: toIsoDateTime(date, endTime),
    reason: reason.trim() || undefined,
    isAllDay: false,
  };
};

export const AgendaSection = () => {
  const { token } = useAuth();
  const { showSuccessToast, showWarningToast, showErrorToast } = useToast();

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
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isDeletingDetails, setIsDeletingDetails] = useState(false);

  const [isBlockSheetOpen, setIsBlockSheetOpen] = useState(false);
  const [blockMode, setBlockMode] = useState<'create' | 'edit'>('create');
  const [selectedBlock, setSelectedBlock] = useState<ScheduleBlock | null>(null);
  const [blockDate, setBlockDate] = useState('');
  const [blockStartTime, setBlockStartTime] = useState('08:00');
  const [blockEndTime, setBlockEndTime] = useState('18:00');
  const [blockReason, setBlockReason] = useState('');
  const [blockIsAllDay, setBlockIsAllDay] = useState(false);
  const [isSavingBlock, setIsSavingBlock] = useState(false);
  const [isDeletingBlock, setIsDeletingBlock] = useState(false);

  const selectedDateValue = toDateInputValue(selectedDate);
  const selectedProcedure = procedures.find((item) => item.procedureId === createProcedureId) ?? null;

  const {
    dayAppointments,
    dayBlocks,
    isLoadingDay,
    isSubmitting,
    loadDay,
    create,
    update,
    remove,
    createBlock,
    updateBlock,
    removeBlock,
    changeStatus,
  } = useAppointments(token);
  const { countsByDate, blockedByDate, loadRange } = useCalendarRange(token);
  const { buildSlots, isLoadingSlots, loadSlots } = useAvailableSlots(token);

  const slots = useMemo(
    () => buildSlots(dayAppointments, dayBlocks, selectedProcedure?.estimatedDurationInMinutes, Boolean(createProcedureId)),
    [buildSlots, dayAppointments, dayBlocks, createProcedureId, selectedProcedure?.estimatedDurationInMinutes],
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
        showErrorToast(message);
      }
    };

    void loadBaseData();
  }, [showErrorToast, token]);

  useEffect(() => {
    void loadDay(selectedDateValue).catch((error) => {
      const message = error instanceof Error ? error.message : 'Erro ao carregar agenda do dia.';
      showErrorToast(message);
    });
  }, [loadDay, selectedDateValue, showErrorToast]);

  useEffect(() => {
    const { startDate, endDate } = getCurrentMonthRange(monthValue);

    void loadRange(startDate, endDate).catch((error) => {
      const message = error instanceof Error ? error.message : 'Erro ao carregar resumo mensal.';
      showErrorToast(message);
    });
  }, [loadRange, monthValue, showErrorToast]);

  useEffect(() => {
    if (!createProcedureId) {
      loadSlots(selectedDateValue, null).catch(() => undefined);
      return;
    }

    void loadSlots(selectedDateValue, createProcedureId).catch((error) => {
      const message = error instanceof Error ? error.message : 'Erro ao carregar slots disponiveis.';
      showErrorToast(message);
    });
  }, [createProcedureId, loadSlots, selectedDateValue, showErrorToast]);

  const refreshCurrentMonth = async () => {
    const { startDate, endDate } = getCurrentMonthRange(monthValue);
    await loadRange(startDate, endDate);
  };

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

  const openCreateBlock = () => {
    setBlockMode('create');
    setSelectedBlock(null);
    setBlockDate(selectedDateValue);
    setBlockStartTime('08:00');
    setBlockEndTime('18:00');
    setBlockReason('');
    setBlockIsAllDay(false);
    setIsBlockSheetOpen(true);
  };

  const openBlockDetails = (block: ScheduleBlock) => {
    setBlockMode('edit');
    setSelectedBlock(block);
    setBlockDate(extractDate(block.startDateTime));
    setBlockStartTime(formatTime(block.startDateTime) || '08:00');
    setBlockEndTime(formatTime(block.endDateTime) || '18:00');
    setBlockReason(block.reason ?? '');
    setBlockIsAllDay(block.isAllDay);
    setIsBlockSheetOpen(true);
  };

  const closeBlockSheet = () => {
    setIsBlockSheetOpen(false);
    setSelectedBlock(null);
  };

  const handleCreateAppointment = async () => {
    if (!createClientId || !createProcedureId || !selectedSlot) {
      showWarningToast('Selecione cliente, procedimento e horario.');
      return;
    }

    const slotStillAvailable = slots.some((slot) => slot.time === selectedSlot && slot.isAvailable);
    if (!slotStillAvailable) {
      showWarningToast('Horario indisponivel para este procedimento.');
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
      showSuccessToast('Agendamento criado com sucesso.');
      await Promise.all([
        loadDay(selectedDateValue),
        loadSlots(selectedDateValue, createProcedureId),
        refreshCurrentMonth(),
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel criar o agendamento.';
      showErrorToast(message);
    }
  };

  const handleSaveBlock = async () => {
    if (!blockDate || (!blockIsAllDay && (!blockStartTime || !blockEndTime))) {
      showWarningToast('Preencha os dados do bloqueio.');
      return;
    }

    if (!blockIsAllDay && blockEndTime <= blockStartTime) {
      showWarningToast('Horario de fim deve ser maior que o inicio.');
      return;
    }

    const payload = toBlockPayload(blockDate, blockStartTime, blockEndTime, blockReason, blockIsAllDay);

    try {
      setIsSavingBlock(true);
      if (blockMode === 'create') {
        await createBlock(payload);
        showSuccessToast('Bloqueio criado com sucesso.');
      } else if (selectedBlock) {
        const updatePayload: UpdateScheduleBlockPayload = payload;
        await updateBlock(selectedBlock.scheduleBlockId, updatePayload);
        showSuccessToast('Bloqueio atualizado com sucesso.');
      }

      await Promise.all([
        loadDay(selectedDateValue),
        refreshCurrentMonth(),
      ]);
      if (createProcedureId) await loadSlots(selectedDateValue, createProcedureId);
      closeBlockSheet();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel salvar o bloqueio.';
      showErrorToast(message);
    } finally {
      setIsSavingBlock(false);
    }
  };

  const handleDeleteBlock = async () => {
    if (!selectedBlock) return;

    try {
      setIsDeletingBlock(true);
      await removeBlock(selectedBlock.scheduleBlockId);
      showSuccessToast('Bloqueio removido com sucesso.');

      await Promise.all([
        loadDay(selectedDateValue),
        refreshCurrentMonth(),
      ]);
      if (createProcedureId) await loadSlots(selectedDateValue, createProcedureId);
      closeBlockSheet();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel remover o bloqueio.';
      showErrorToast(message);
    } finally {
      setIsDeletingBlock(false);
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
      showWarningToast('Preencha cliente, procedimento, data e horario.');
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
      setIsSavingDetails(true);
      await update(selectedAppointment.appointmentId, payload);
      if (editStatus !== selectedAppointment.status) {
        await changeStatus(selectedAppointment.appointmentId, editStatus);
      }

      showSuccessToast('Agendamento atualizado com sucesso.');

      await loadDay(selectedDateValue);
      await refreshCurrentMonth();

      if (createProcedureId) {
        await loadSlots(selectedDateValue, createProcedureId);
      }

      closeAppointmentDetails();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel atualizar o agendamento.';
      showErrorToast(message);
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      setIsDeletingDetails(true);
      await remove(selectedAppointment.appointmentId);
      showSuccessToast('Agendamento excluido com sucesso.');

      await Promise.all([
        loadDay(selectedDateValue),
        refreshCurrentMonth(),
      ]);

      if (createProcedureId) {
        await loadSlots(selectedDateValue, createProcedureId);
      }
      closeAppointmentDetails();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel excluir o agendamento.';
      showErrorToast(message);
    } finally {
      setIsDeletingDetails(false);
    }
  };

  const isBlockSubmitting = isSavingBlock || isDeletingBlock;
  const canSaveBlock = Boolean(blockDate) && (blockIsAllDay || (blockStartTime && blockEndTime));

  return (
    <div className="space-y-3 md:space-y-4">
      <section className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Agenda</h3>
            <p className="text-sm text-slate-500">Selecione dia e horario.</p>
          </div>
          <Button
            variant="outline"
            className="h-10 border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
            onClick={openCreateBlock}
          >
            Bloquear horario
          </Button>
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-9.8rem)] flex-col rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm sm:min-h-[calc(100vh-10.2rem)] sm:p-4">
        <WeeklyCalendar
          weekStart={weekStart}
          selectedDate={selectedDate}
          countsByDate={countsByDate}
          blockedByDate={blockedByDate}
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
            blocks={dayBlocks}
            onSelectSlot={openCreateFlowFromSlot}
            onOpenAppointment={openAppointmentDetails}
            onOpenBlock={openBlockDetails}
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

      <ScheduleBlockEditorSheet
        isOpen={isBlockSheetOpen}
        mode={blockMode}
        date={blockDate}
        startTime={blockStartTime}
        endTime={blockEndTime}
        reason={blockReason}
        isAllDay={blockIsAllDay}
        isSubmitting={isBlockSubmitting}
        canSubmit={canSaveBlock}
        block={selectedBlock}
        onClose={closeBlockSheet}
        onChangeDate={setBlockDate}
        onChangeStartTime={setBlockStartTime}
        onChangeEndTime={setBlockEndTime}
        onChangeReason={setBlockReason}
        onChangeIsAllDay={setBlockIsAllDay}
        onSubmit={() => void handleSaveBlock()}
        onDelete={selectedBlock ? () => void handleDeleteBlock() : undefined}
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
        isSaving={isSavingDetails}
        isDeleting={isDeletingDetails}
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
