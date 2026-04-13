import { Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { WhatsNewEntry } from '../types/whatsNew';

interface WhatsNewModalProps {
  isOpen: boolean;
  entry: WhatsNewEntry | null;
  isLoading?: boolean;
  onAcknowledge: () => void;
}

const helperByType = (type: string): string => {
  if (type === 'fix') return 'Correcoes e melhorias';
  if (type === 'improvement') return 'Melhorias no sistema';
  return 'Nova funcionalidade disponivel';
};

export const WhatsNewModal = ({
  isOpen,
  entry,
  isLoading = false,
  onAcknowledge,
}: WhatsNewModalProps) => {
  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 z-[131] flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-pink-700">
            <Sparkles size={12} />
            Novidades
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
            v{entry.version}
          </span>
        </div>

        <h3 className="text-2xl font-black leading-tight text-slate-900">{entry.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{helperByType(entry.type)}</p>

        <ul className="mt-4 space-y-2">
          {entry.items.slice(0, 6).map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-pink-500" />
              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <Button className="h-11 w-full bg-pink-600 text-white hover:bg-pink-700" isLoading={isLoading} onClick={onAcknowledge}>
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
};
