import { X, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import {
  Appointment,
  AppointmentStatus,
} from '../../../../types/appointment';
import { Client } from '../../../../types/client';
import { Procedure } from '../../../../types/procedure';
import { ClientSearchCombobox } from './ClientSearchCombobox';
import { ProcedureSearchCombobox } from './ProcedureSearchCombobox';
import { getAppointmentTimeRange } from '../dateUtils';
import { appointmentStatusOptions } from '../statusVisual';

interface AppointmentDetailsSheetProps {
  isOpen: boolean;
  appointment: Appointment | null;
  clients: Client[];
  procedures: Procedure[];
  selectedClientId: number | null;
  selectedProcedureId: number | null;
  date: string;
  startTime: string;
  notes: string;
  status: AppointmentStatus;
  isSaving: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onChangeClient: (client: Client) => void;
  onChangeProcedure: (procedure: Procedure) => void;
  onChangeDate: (value: string) => void;
  onChangeStartTime: (value: string) => void;
  onChangeNotes: (value: string) => void;
  onChangeStatus: (value: AppointmentStatus) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const AppointmentDetailsSheet = ({
  isOpen,
  appointment,
  clients,
  procedures,
  selectedClientId,
  selectedProcedureId,
  date,
  startTime,
  notes,
  status,
  isSaving,
  isDeleting,
  onClose,
  onChangeClient,
  onChangeProcedure,
  onChangeDate,
  onChangeStartTime,
  onChangeNotes,
  onChangeStatus,
  onSave,
  onDelete,
}: AppointmentDetailsSheetProps) => {
  if (!isOpen || !appointment) return null;

  const procedure = procedures.find((item) => item.procedureId === selectedProcedureId) ?? null;
  const originalRange = getAppointmentTimeRange(appointment);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-slate-900/40"
        onClick={onClose}
        aria-label="Fechar detalhes do agendamento"
      />

      <div className="fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto rounded-t-[1.8rem] border border-slate-200 bg-white p-4 shadow-2xl sm:left-auto sm:right-6 sm:top-20 sm:bottom-auto sm:w-[min(620px,94vw)] sm:max-h-[82vh] sm:rounded-3xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Agendamento #{appointment.appointmentId}</p>
            <h3 className="text-lg font-bold text-slate-800">Editar detalhes</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Fechar"
          >
            <X size={18} className="mx-auto" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Horario original: {originalRange.start || '-'} - {originalRange.end || '-'}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Data</label>
              <input
                type="date"
                value={date}
                onChange={(event) => onChangeDate(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Horario de inicio</label>
              <input
                type="time"
                value={startTime}
                step={1800}
                onChange={(event) => onChangeStartTime(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <ClientSearchCombobox
            clients={clients}
            selectedClientId={selectedClientId}
            onSelect={onChangeClient}
          />

          <ProcedureSearchCombobox
            procedures={procedures}
            selectedProcedureId={selectedProcedureId}
            onSelect={onChangeProcedure}
          />

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
            <select
              value={status}
              onChange={(event) => onChangeStatus(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
            >
              {appointmentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Observacoes</label>
            <textarea
              value={notes}
              onChange={(event) => onChangeNotes(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              placeholder="Adicionar observacoes"
            />
          </div>

          {procedure ? (
            <p className="text-xs font-medium text-slate-500">
              Duracao prevista: {procedure.estimatedDurationInMinutes} min. Horario final sera calculado no backend.
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            icon={Trash2}
            className="h-11 border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={onDelete}
            isLoading={isDeleting}
            disabled={isSaving || isDeleting}
          >
            Excluir
          </Button>

          <div className="flex-1" />

          <Button
            variant="outline"
            className="h-11 border-slate-200 text-slate-600"
            onClick={onClose}
            disabled={isSaving || isDeleting}
          >
            Fechar
          </Button>
          <Button
            className="h-11 bg-pink-600 text-white hover:bg-pink-700"
            onClick={onSave}
            isLoading={isSaving}
            disabled={isSaving || isDeleting}
          >
            Salvar alteracoes
          </Button>
        </div>
      </div>
    </>
  );
};
