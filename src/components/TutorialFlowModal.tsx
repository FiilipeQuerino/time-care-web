import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BookOpenCheck, CircleDot, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { MenuSection } from '../types/navigation';

type TutorialModalStage = 'offer' | 'tutorial';
type StepPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
type StepConnector = 'line' | 'none' | 'auto';

export interface TutorialStep {
  id: string;
  section: MenuSection;
  title: string;
  description: string;
  tip: string;
  targetElement: string;
  placement?: StepPlacement;
  compact?: boolean;
  connector?: StepConnector;
  highlightPadding?: number;
}

interface TutorialFlowModalProps {
  isOpen: boolean;
  stage: TutorialModalStage;
  steps: TutorialStep[];
  tutorialStepIndex?: number;
  isLoading?: boolean;
  errorMessage?: string | null;
  onAccept: () => void;
  onDecline: () => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
}

interface Point {
  x: number;
  y: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const findVisibleElement = (selector: string): HTMLElement | null => {
  const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  return (
    elements.find((item) => {
      const rect = item.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }) ?? null
  );
};

export const TutorialFlowModal = ({
  isOpen,
  stage,
  steps,
  tutorialStepIndex = 0,
  isLoading = false,
  errorMessage = null,
  onAccept,
  onDecline,
  onNext,
  onBack,
  onComplete,
}: TutorialFlowModalProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPosition, setCardPosition] = useState<Point | null>(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [resolvedPlacement, setResolvedPlacement] = useState<StepPlacement>('bottom');
  const [isMobileViewport, setIsMobileViewport] = useState(window.innerWidth < 768);

  const currentStep = steps[tutorialStepIndex];
  const isCompactStep = Boolean(currentStep?.compact);
  const connectorMode = currentStep?.connector ?? 'line';
  const isLastStep = tutorialStepIndex >= steps.length - 1;
  const spotlightPadding = currentStep?.highlightPadding ?? 10;
  const spotlightRect = targetRect
    ? {
        left: targetRect.left - spotlightPadding,
        top: targetRect.top - spotlightPadding,
        width: targetRect.width + spotlightPadding * 2,
        height: targetRect.height + spotlightPadding * 2,
      }
    : null;

  useEffect(() => {
    if (!isOpen || stage !== 'tutorial' || !currentStep?.targetElement) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const element = findVisibleElement(currentStep.targetElement);
      if (!element) {
        setTargetRect(null);
        return;
      }
      setTargetRect(element.getBoundingClientRect());
    };

    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
      updateRect();
    };

    updateRect();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentStep?.targetElement, isOpen, stage]);

  useLayoutEffect(() => {
    if (!isOpen || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCardSize({ width: rect.width, height: rect.height });
  }, [isOpen, stage, tutorialStepIndex, errorMessage]);

  useLayoutEffect(() => {
    if (!isOpen || stage !== 'tutorial') return;

    const margin = isCompactStep && isMobileViewport ? 10 : 18;
    const anchorGap = isCompactStep && isMobileViewport ? 6 : 14;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (!targetRect) {
      setCardPosition({
        x: (viewportWidth - cardSize.width) / 2,
        y: (viewportHeight - cardSize.height) / 2,
      });
      setResolvedPlacement('bottom');
      return;
    }

    const preferred = currentStep?.placement ?? 'auto';
    const candidates: StepPlacement[] =
      preferred === 'auto' ? ['bottom', 'right', 'left', 'top'] : [preferred, 'bottom', 'right', 'left', 'top'];

    let nextPlacement: StepPlacement = 'bottom';
    let nextPosition: Point = { x: margin, y: margin };

    for (const candidate of candidates) {
      let x = 0;
      let y = 0;
      if (candidate === 'bottom') {
        x = targetRect.left + targetRect.width / 2 - cardSize.width / 2;
        y = targetRect.bottom + anchorGap;
      } else if (candidate === 'top') {
        x = targetRect.left + targetRect.width / 2 - cardSize.width / 2;
        y = targetRect.top - cardSize.height - anchorGap;
      } else if (candidate === 'right') {
        x = targetRect.right + anchorGap;
        y = targetRect.top + targetRect.height / 2 - cardSize.height / 2;
      } else if (candidate === 'left') {
        x = targetRect.left - cardSize.width - anchorGap;
        y = targetRect.top + targetRect.height / 2 - cardSize.height / 2;
      }

      const clampedX = clamp(x, margin, viewportWidth - cardSize.width - margin);
      const clampedY = clamp(y, margin, viewportHeight - cardSize.height - margin);
      const fits =
        clampedX >= margin &&
        clampedY >= margin &&
        clampedX + cardSize.width <= viewportWidth - margin &&
        clampedY + cardSize.height <= viewportHeight - margin;

      nextPlacement = candidate;
      nextPosition = { x: clampedX, y: clampedY };
      if (fits) break;
    }

    setResolvedPlacement(nextPlacement);
    setCardPosition(nextPosition);
  }, [cardSize.height, cardSize.width, currentStep?.placement, isCompactStep, isMobileViewport, isOpen, stage, targetRect]);

  const shouldShowConnector = useMemo(() => {
    if (!targetRect || !cardPosition) return false;
    if (connectorMode === 'none') return false;
    if (connectorMode === 'auto') {
      if (isCompactStep && isMobileViewport) return false;
      return true;
    }
    if (isCompactStep && isMobileViewport) return false;
    return true;
  }, [cardPosition, connectorMode, isCompactStep, isMobileViewport, targetRect]);

  const connector = useMemo(() => {
    if (!shouldShowConnector) return null;
    if (!targetRect || !cardPosition) return null;
    const cardRect = {
      left: cardPosition.x,
      top: cardPosition.y,
      right: cardPosition.x + cardSize.width,
      bottom: cardPosition.y + cardSize.height,
      centerX: cardPosition.x + cardSize.width / 2,
      centerY: cardPosition.y + cardSize.height / 2,
    };

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const start: Point = { x: cardRect.centerX, y: cardRect.centerY };

    if (resolvedPlacement === 'bottom') start.y = cardRect.top;
    if (resolvedPlacement === 'top') start.y = cardRect.bottom;
    if (resolvedPlacement === 'left') start.x = cardRect.right;
    if (resolvedPlacement === 'right') start.x = cardRect.left;

    return { start, end: { x: targetCenterX, y: targetCenterY } };
  }, [cardPosition, cardSize.height, cardSize.width, resolvedPlacement, shouldShowConnector, targetRect]);

  if (!isOpen) return null;

  if (stage === 'offer') {
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/45 p-4">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22 }}
          className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pink-700">
            <Sparkles size={12} />
            Onboarding
          </div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            E sua primeira vez aqui. Deseja fazer um tutorial rapido?
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Em menos de 2 minutos, mostramos os pontos principais para voce comecar com seguranca.
          </p>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              onClick={onDecline}
              disabled={isLoading}
              className="h-11 border-slate-200 text-slate-600"
            >
              Agora nao
            </Button>
            <Button onClick={onAccept} isLoading={isLoading} className="h-11 bg-pink-600 text-white hover:bg-pink-700">
              Sim, quero ver
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[130]">
      {spotlightRect ? (
        <>
          <div className="fixed left-0 top-0 bg-slate-900/55" style={{ width: '100vw', height: spotlightRect.top }} />
          <div className="fixed left-0 bg-slate-900/55" style={{ top: spotlightRect.top, width: spotlightRect.left, height: spotlightRect.height }} />
          <div
            className="fixed bg-slate-900/55"
            style={{ top: spotlightRect.top, left: spotlightRect.left + spotlightRect.width, width: window.innerWidth - (spotlightRect.left + spotlightRect.width), height: spotlightRect.height }}
          />
          <div className="fixed left-0 bg-slate-900/55" style={{ top: spotlightRect.top + spotlightRect.height, width: '100vw', height: window.innerHeight - (spotlightRect.top + spotlightRect.height) }} />

          <motion.div
            key={`${currentStep?.id}-focus`}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-none fixed rounded-2xl border-2 border-pink-400/90 shadow-[0_0_0_2px_rgba(255,255,255,0.18),0_0_0_16px_rgba(236,72,153,0.2)]"
            style={{
              left: spotlightRect.left,
              top: spotlightRect.top,
              width: spotlightRect.width,
              height: spotlightRect.height,
            }}
          >
            <motion.div
              animate={{ opacity: [0.45, 0.9, 0.45] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl border border-pink-300/70"
            />
          </motion.div>
        </>
      ) : (
        <div className="fixed inset-0 bg-slate-900/55" />
      )}

      {connector ? (
        <svg className="pointer-events-none fixed inset-0 h-full w-full">
          <line
            x1={connector.start.x}
            y1={connector.start.y}
            x2={connector.end.x}
            y2={connector.end.y}
            stroke="rgba(244,114,182,0.85)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <circle cx={connector.end.x} cy={connector.end.y} r="4.5" fill="rgba(244,114,182,1)" />
        </svg>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep?.id ?? 'tutorial'}
          ref={cardRef}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.99 }}
          transition={{ duration: 0.2 }}
          className={`fixed rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] ${isCompactStep ? 'w-[min(92vw,380px)] p-4' : 'w-[min(92vw,430px)] p-5'}`}
          style={{
            left: cardPosition?.x ?? (window.innerWidth - Math.min(window.innerWidth * 0.92, isCompactStep ? 380 : 430)) / 2,
            top: cardPosition?.y ?? (window.innerHeight - 320) / 2,
          }}
        >
          <div className={`${isCompactStep ? 'mb-2' : 'mb-3'} h-1.5 w-full overflow-hidden rounded-full bg-slate-100`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((tutorialStepIndex + 1) / Math.max(steps.length, 1)) * 100}%` }}
              transition={{ duration: 0.25 }}
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
            />
          </div>

          <div className={`${isCompactStep ? 'mb-1.5' : 'mb-2'} inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-pink-700`}>
            <Sparkles size={11} />
            Passo {tutorialStepIndex + 1} de {steps.length}
          </div>

          <div className={`flex items-start ${isCompactStep ? 'gap-2' : 'gap-2.5'}`}>
            <BookOpenCheck size={18} className="mt-1 text-pink-600" />
            <div>
              <h3 className={`${isCompactStep ? 'text-base' : 'text-lg'} font-black tracking-tight text-slate-900`}>{currentStep?.title}</h3>
              <p className={`${isCompactStep ? 'mt-1 text-[13px] leading-5' : 'mt-1.5 text-sm leading-6'} text-slate-600`}>{currentStep?.description}</p>
            </div>
          </div>

          <div className={`${isCompactStep ? 'mt-2' : 'mt-3'} rounded-xl border border-slate-200 bg-slate-50 px-3 ${isCompactStep ? 'py-2' : 'py-2.5'}`}>
            <p className={`flex items-start gap-2 ${isCompactStep ? 'text-[13px]' : 'text-sm'} text-slate-700`}>
              <CircleDot size={13} className="mt-1 text-pink-600" />
              {currentStep?.tip}
            </p>
          </div>

          {errorMessage ? (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className={`${isCompactStep ? 'mt-3' : 'mt-4'} flex justify-between gap-2`}>
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isLoading || tutorialStepIndex === 0}
              className="h-10 border-slate-200 text-slate-600"
            >
              Voltar
            </Button>
            {isLastStep ? (
              <Button onClick={onComplete} isLoading={isLoading} className="h-10 bg-pink-600 text-white hover:bg-pink-700">
                Concluir tutorial
              </Button>
            ) : (
              <Button onClick={onNext} disabled={isLoading} className="h-10 bg-pink-600 text-white hover:bg-pink-700" icon={ArrowRight}>
                Proximo passo
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
