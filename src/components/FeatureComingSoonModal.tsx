import { AlertTriangle, Clock3, CircleX } from 'lucide-react';
import { Button } from './ui/Button';

export type NoticeModalType = 'coming-soon' | 'alert' | 'error';

interface FeatureComingSoonModalProps {
  isOpen: boolean;
  type?: NoticeModalType;
  title: string;
  onClose: () => void;
  message?: string;
  helperText?: string;
  confirmLabel?: string;
}

const themeByType: Record<NoticeModalType, { badge: string; badgeClass: string; icon: typeof Clock3; iconClass: string }> = {
  'coming-soon': {
    badge: 'Em breve',
    badgeClass: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: Clock3,
    iconClass: 'text-sky-600',
  },
  alert: {
    badge: 'Alerta',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: AlertTriangle,
    iconClass: 'text-amber-600',
  },
  error: {
    badge: 'Erro',
    badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: CircleX,
    iconClass: 'text-rose-600',
  },
};

export const FeatureComingSoonModal = ({
  isOpen,
  type = 'coming-soon',
  title,
  onClose,
  message,
  helperText,
  confirmLabel = 'Entendi',
}: FeatureComingSoonModalProps) => {
  if (!isOpen) return null;

  const theme = themeByType[type];
  const Icon = theme.icon;
  const defaultMessage =
    type === 'coming-soon'
      ? 'Este modulo esta em fase final de desenvolvimento e sera liberado em uma proxima versao da plataforma.'
      : type === 'alert'
      ? 'Este aviso requer atencao antes de continuar.'
      : 'Ocorreu um erro inesperado ao carregar os dados.';
  const defaultHelper =
    type === 'coming-soon'
      ? 'Assim que estiver disponivel, ele aparecera normalmente no menu com todos os recursos ativos.'
      : type === 'alert'
      ? 'Revise as informacoes e confirme que entendeu o aviso.'
      : 'Se o problema persistir, tente novamente em alguns instantes.';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <div className={`mb-4 inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${theme.badgeClass}`}>
          {theme.badge}
        </div>
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 ${theme.iconClass}`}>
            <Icon size={20} />
          </span>
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{message ?? defaultMessage}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{helperText ?? defaultHelper}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} className="h-11 min-w-28 bg-slate-900 text-white hover:bg-slate-800">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
