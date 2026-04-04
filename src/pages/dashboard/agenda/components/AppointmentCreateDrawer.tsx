import { X } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Client } from '../../../../types/client';
import { Procedure } from '../../../../types/procedure';
import { AppointmentSummaryCard } from './AppointmentSummaryCard';
import { ClientSearchCombobox } from './ClientSearchCombobox';
import { ProcedureSearchCombobox } from './ProcedureSearchCombobox';

interface AppointmentCreateDrawerProps {
  isOpen: boolean;
  date: string;
  selectedSlot: string;
  clients: Client[];
  procedures: Procedure[];
  selectedClientId: number | null;
  selectedProcedureId: number | null;
  notes: string;
  isSubmitting: boolean;
  onClose: () => void;
  onChangeClient: (client: Client) => void;
  onChangeProcedure: (procedure: Procedure) => void;
  onChangeNotes: (value: string) => void;
  onConfirm: () => void;
}

export const AppointmentCreateDrawer = ({
  isOpen,
  date,
  selectedSlot,
  clients,
  procedures,
  selectedClientId,
  selectedProcedureId,
  notes,
  isSubmitting,
  onClose,
  onChangeClient,
  onChangeProcedure,
  onChangeNotes,
  onConfirm,
}: AppointmentCreateDrawerProps) => {
  if (!isOpen) return null;

  const selectedClient = clients.find((item) => item.clientId === selectedClientId) ?? null;
  const selectedProcedure = procedures.find((item) => item.procedureId === selectedProcedureId) ?? null;
  const canConfirm = Boolean(selectedClient && selectedProcedure && date && selectedSlot);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-slate-900/40"
        onClick={onClose}
        aria-label="Fechar criacao de agendamento"
      />

      <div className="fixed inset-0 z-[60] overflow-y-auto bg-white p-4 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-6 sm:h-[92vh] sm:w-[min(720px,96vw)] sm:rounded-3xl sm:border sm:border-slate-200 sm:shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Novo agendamento</p>
            <h3 className="text-lg font-bold text-slate-800">Fluxo rapido</h3>
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

        <ol className="mb-4 grid grid-cols-5 gap-1 rounded-xl border border-slate-100 bg-slate-50 p-2 text-[11px] font-semibold text-slate-500">
          <li className="text-center text-pink-600">Dia</li>
          <li className="text-center text-pink-600">Horario</li>
          <li className="text-center text-pink-600">Cliente</li>
          <li className="text-center text-pink-600">Proced.</li>
          <li className="text-center text-pink-600">Confirmar</li>
        </ol>

        <div className="space-y-3 pb-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <p>
              <strong>Data:</strong> {date} - <strong>Horario:</strong> {selectedSlot}
            </p>
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

          <AppointmentSummaryCard
            client={selectedClient}
            procedure={selectedProcedure}
            date={date}
            startTime={selectedSlot}
            notes={notes}
            onChangeNotes={onChangeNotes}
          />
        </div>

        <div className="sticky bottom-0 mt-4 flex items-center gap-2 border-t border-slate-100 bg-white pt-3">
          <Button
            variant="outline"
            className="h-11 flex-1 border-slate-200 text-slate-600"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="h-11 flex-1 bg-pink-600 text-white hover:bg-pink-700"
            onClick={onConfirm}
            disabled={!canConfirm}
            isLoading={isSubmitting}
          >
            Confirmar agendamento
          </Button>
        </div>
      </div>
    </>
  );
};
