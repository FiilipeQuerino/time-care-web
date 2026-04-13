import { X } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { ScheduleBlock } from '../../../../types/appointment';

interface ScheduleBlockEditorSheetProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  isAllDay: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  block?: ScheduleBlock | null;
  onClose: () => void;
  onChangeDate: (value: string) => void;
  onChangeStartTime: (value: string) => void;
  onChangeEndTime: (value: string) => void;
  onChangeReason: (value: string) => void;
  onChangeIsAllDay: (value: boolean) => void;
  onSubmit: () => void;
  onDelete?: () => void;
}

export const ScheduleBlockEditorSheet = ({
  isOpen,
  mode,
  date,
  startTime,
  endTime,
  reason,
  isAllDay,
  isSubmitting,
  canSubmit,
  block,
  onClose,
  onChangeDate,
  onChangeStartTime,
  onChangeEndTime,
  onChangeReason,
  onChangeIsAllDay,
  onSubmit,
  onDelete,
}: ScheduleBlockEditorSheetProps) => {
  if (!isOpen) return null;

  const title = mode === 'create' ? 'Novo bloqueio' : 'Editar bloqueio';

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-slate-900/45"
        onClick={onClose}
        aria-label="Fechar bloqueio"
      />

      <div className="fixed inset-0 z-[60] overflow-y-auto bg-white p-4 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-6 sm:h-[92vh] sm:w-[min(620px,96vw)] sm:rounded-3xl sm:border sm:border-slate-200 sm:shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Agenda</p>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
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
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            Bloqueio nao e agendamento. Use para fechar dia inteiro ou intervalo.
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(event) => onChangeIsAllDay(event.target.checked)}
              className="h-4 w-4 accent-slate-700"
            />
            <span className="text-sm font-medium text-slate-700">Bloquear dia inteiro</span>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Data</label>
              <input
                type="date"
                value={date}
                onChange={(event) => onChangeDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
              />
            </div>

            {!isAllDay ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Inicio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(event) => onChangeStartTime(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Fim</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(event) => onChangeEndTime(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Motivo (opcional)</label>
            <textarea
              value={reason}
              onChange={(event) => onChangeReason(event.target.value)}
              rows={4}
              maxLength={300}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
              placeholder="Ex.: Reuniao interna, pausa, indisponibilidade"
            />
          </div>
        </div>

        <div className="sticky bottom-0 mt-5 grid grid-cols-1 gap-2 border-t border-slate-100 bg-white pt-3 sm:grid-cols-3">
          {mode === 'edit' && block && onDelete ? (
            <Button
              variant="outline"
              className="h-11 border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={onDelete}
              isLoading={isSubmitting}
            >
              Remover
            </Button>
          ) : (
            <div />
          )}
          <Button
            variant="outline"
            className="h-11 border-slate-200 text-slate-600"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="h-11 bg-slate-800 text-white hover:bg-slate-900"
            onClick={onSubmit}
            disabled={!canSubmit}
            isLoading={isSubmitting}
          >
            {mode === 'create' ? 'Criar bloqueio' : 'Salvar bloqueio'}
          </Button>
        </div>
      </div>
    </>
  );
};
