import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastPayload {
  title: string;
  description?: string;
}

interface ToastItem extends ToastPayload {
  id: number;
  type: ToastType;
  dedupeKey: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showSuccessToast: (payload: string | ToastPayload) => void;
  showWarningToast: (payload: string | ToastPayload) => void;
  showErrorToast: (payload: string | ToastPayload) => void;
  showInfoToast: (payload: string | ToastPayload) => void;
}

const MAX_VISIBLE_TOASTS = 3;
const DEDUPE_WINDOW_MS = 1600;
const TOAST_DURATION_BY_TYPE: Record<ToastType, number> = {
  success: 3000,
  info: 3500,
  warning: 4000,
  error: 4500,
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastStyles: Record<
  ToastType,
  {
    icon: React.ReactNode;
    iconWrap: string;
    titleClass: string;
    glow: string;
    borderClass: string;
    accentClass: string;
  }
> = {
  success: {
    icon: <CheckCircle2 size={17} />,
    iconWrap: 'bg-emerald-100 text-emerald-600',
    titleClass: 'text-emerald-700',
    glow: 'shadow-[0_16px_34px_rgba(16,185,129,0.20)]',
    borderClass: 'border-emerald-100',
    accentClass: 'from-emerald-400/70 to-transparent',
  },
  warning: {
    icon: <TriangleAlert size={17} />,
    iconWrap: 'bg-amber-100 text-amber-600',
    titleClass: 'text-amber-700',
    glow: 'shadow-[0_16px_34px_rgba(245,158,11,0.22)]',
    borderClass: 'border-amber-100',
    accentClass: 'from-amber-400/75 to-transparent',
  },
  error: {
    icon: <AlertCircle size={17} />,
    iconWrap: 'bg-rose-100 text-rose-600',
    titleClass: 'text-rose-700',
    glow: 'shadow-[0_16px_34px_rgba(244,63,94,0.22)]',
    borderClass: 'border-rose-100',
    accentClass: 'from-rose-400/75 to-transparent',
  },
  info: {
    icon: <Info size={17} />,
    iconWrap: 'bg-sky-100 text-sky-600',
    titleClass: 'text-sky-700',
    glow: 'shadow-[0_16px_34px_rgba(14,165,233,0.20)]',
    borderClass: 'border-sky-100',
    accentClass: 'from-sky-400/70 to-transparent',
  },
};

const normalizePayload = (payload: string | ToastPayload): ToastPayload => {
  if (typeof payload === 'string') return { title: payload };
  return payload;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const dedupeMapRef = useRef<Map<string, number>>(new Map());

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const enqueueToast = useCallback(
    (type: ToastType, payload: string | ToastPayload) => {
      const normalized = normalizePayload(payload);
      const title = normalized.title.trim();
      if (!title) return;

      const description = normalized.description?.trim();
      const dedupeKey = `${type}:${title}:${description ?? ''}`;
      const now = Date.now();
      const lastShownAt = dedupeMapRef.current.get(dedupeKey);

      if (lastShownAt && now - lastShownAt < DEDUPE_WINDOW_MS) return;
      dedupeMapRef.current.set(dedupeKey, now);

      const id = now + Math.floor(Math.random() * 1000);
      const toast: ToastItem = {
        id,
        type,
        title,
        description,
        dedupeKey,
      };

      setToasts((current) => {
        const next = [...current, toast];
        if (next.length <= MAX_VISIBLE_TOASTS) return next;
        return next.slice(next.length - MAX_VISIBLE_TOASTS);
      });

      setTimeout(() => {
        removeToast(id);
      }, TOAST_DURATION_BY_TYPE[type]);
    },
    [removeToast],
  );

  const showSuccessToast = useCallback((payload: string | ToastPayload) => {
    enqueueToast('success', payload);
  }, [enqueueToast]);

  const showWarningToast = useCallback((payload: string | ToastPayload) => {
    enqueueToast('warning', payload);
  }, [enqueueToast]);

  const showErrorToast = useCallback((payload: string | ToastPayload) => {
    enqueueToast('error', payload);
  }, [enqueueToast]);

  const showInfoToast = useCallback((payload: string | ToastPayload) => {
    enqueueToast('info', payload);
  }, [enqueueToast]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    enqueueToast(type, message);
  }, [enqueueToast]);

  const value = useMemo(
    () => ({ showToast, showSuccessToast, showWarningToast, showErrorToast, showInfoToast }),
    [showToast, showSuccessToast, showWarningToast, showErrorToast, showInfoToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed left-1/2 top-3 z-[150] flex w-[min(94vw,430px)] -translate-x-1/2 flex-col gap-2.5 sm:top-4">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const style = toastStyles[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border bg-white px-3.5 py-3 ${style.borderClass} ${style.glow}`}
              >
                <div className={`pointer-events-none absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-gradient-to-r ${style.accentClass}`} />
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${style.iconWrap}`}>
                    {style.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold leading-5 ${style.titleClass}`}>{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-0.5 text-[12.5px] leading-5 text-slate-500">{toast.description}</p>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
