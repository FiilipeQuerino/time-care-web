import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastStyles: Record<ToastType, { icon: React.ReactNode; box: string }> = {
  success: {
    icon: <CheckCircle2 size={18} />,
    box: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  error: {
    icon: <AlertCircle size={18} />,
    box: 'bg-rose-50 border-rose-200 text-rose-700',
  },
  info: {
    icon: <Info size={18} />,
    box: 'bg-slate-100 border-slate-200 text-slate-700',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 3800);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[min(92vw,360px)] pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto border rounded-xl px-4 py-3 shadow-md backdrop-blur ${toastStyles[toast.type].box}`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-[1px]">{toastStyles[toast.type].icon}</span>
                <p className="text-sm font-semibold leading-5">{toast.message}</p>
              </div>
            </motion.div>
          ))}
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
