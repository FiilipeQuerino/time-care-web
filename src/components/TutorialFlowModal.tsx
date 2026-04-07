import { BookOpenCheck, CircleDot, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

type TutorialModalStage = 'offer' | 'tutorial';

interface TutorialFlowModalProps {
  isOpen: boolean;
  stage: TutorialModalStage;
  isLoading?: boolean;
  errorMessage?: string | null;
  onAccept: () => void;
  onDecline: () => void;
  onComplete: () => void;
}

export const TutorialFlowModal = ({
  isOpen,
  stage,
  isLoading = false,
  errorMessage = null,
  onAccept,
  onDecline,
  onComplete,
}: TutorialFlowModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pink-700">
          <Sparkles size={12} />
          Onboarding
        </div>

        {stage === 'offer' ? (
          <>
            <h3 className="text-xl font-black tracking-tight text-slate-900">
              E sua primeira vez aqui. Deseja fazer um tutorial rapido?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Em menos de 2 minutos, mostramos os pontos principais para voce comecar com seguranca.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <BookOpenCheck size={20} className="mt-1 text-pink-600" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-900">Tutorial rapido iniciado</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Este fluxo visual prepara o usuario para as principais areas do sistema.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="flex items-start gap-2 text-sm text-slate-700">
                <CircleDot size={14} className="mt-1 text-pink-600" />
                Dashboard: indicadores principais e visao geral.
              </p>
              <p className="flex items-start gap-2 text-sm text-slate-700">
                <CircleDot size={14} className="mt-1 text-pink-600" />
                Agenda: como criar e gerenciar agendamentos.
              </p>
              <p className="flex items-start gap-2 text-sm text-slate-700">
                <CircleDot size={14} className="mt-1 text-pink-600" />
                Cadastros: clientes e procedimentos.
              </p>
            </div>
          </>
        )}

        {errorMessage ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {stage === 'offer' ? (
            <>
              <Button
                variant="outline"
                onClick={onDecline}
                disabled={isLoading}
                className="h-11 border-slate-200 text-slate-600"
              >
                Agora nao
              </Button>
              <Button
                onClick={onAccept}
                isLoading={isLoading}
                className="h-11 bg-pink-600 text-white hover:bg-pink-700"
              >
                Sim, quero ver
              </Button>
            </>
          ) : (
            <Button
              onClick={onComplete}
              isLoading={isLoading}
              className="h-11 bg-pink-600 text-white hover:bg-pink-700"
            >
              Concluir tutorial
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
