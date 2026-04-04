import { Client } from '../../../../types/client';
import { Procedure } from '../../../../types/procedure';
import { formatCurrency } from '../../helpers';
import { addMinutes } from '../dateUtils';

interface AppointmentSummaryCardProps {
  client: Client | null;
  procedure: Procedure | null;
  date: string;
  startTime: string;
  notes: string;
  onChangeNotes: (value: string) => void;
}

export const AppointmentSummaryCard = ({
  client,
  procedure,
  date,
  startTime,
  notes,
  onChangeNotes,
}: AppointmentSummaryCardProps) => {
  const duration = procedure?.estimatedDurationInMinutes ?? 0;
  const endTime = startTime && duration > 0 ? addMinutes(startTime, duration) : '';

  return (
    <section className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50 p-4">
      <h4 className="text-sm font-bold text-slate-800">Resumo do agendamento</h4>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
        <SummaryItem label="Cliente" value={client?.name ?? '-'} />
        <SummaryItem label="Procedimento" value={procedure?.name ?? '-'} />
        <SummaryItem label="Data" value={date || '-'} />
        <SummaryItem label="Inicio" value={startTime || '-'} />
        <SummaryItem label="Fim" value={endTime || '-'} />
        <SummaryItem label="Duracao" value={duration > 0 ? `${duration} min` : '-'} />
        <SummaryItem label="Valor" value={procedure ? formatCurrency(procedure.suggestedPrice) : '-'} />
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-semibold text-slate-600">Observacoes (opcional)</label>
        <textarea
          value={notes}
          onChange={(event) => onChangeNotes(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
          placeholder="Ex.: cliente prefere atendimento no box 2"
        />
      </div>
    </section>
  );
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-white/70 bg-white/80 px-2.5 py-2">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 font-semibold text-slate-800">{value}</p>
  </div>
);
