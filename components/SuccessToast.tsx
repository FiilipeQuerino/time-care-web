
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'delete' | 'edit';

interface SuccessToastProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  type?: ToastType;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ isVisible, onClose, message, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // Mais rápido (de 3.5s para 2.5s)
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const config = {
    success: {
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      shadow: 'shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)]',
      title: 'Realizado!'
    },
    delete: {
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      shadow: 'shadow-[0_20px_60px_-15px_rgba(244,114,182,0.3)]',
      title: 'Removido!'
    },
    edit: {
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      shadow: 'shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)]',
      title: 'Atualizado!'
    }
  }[type];

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[500] p-4">
      <div className={`bg-white/95 backdrop-blur-2xl border border-white/50 px-12 py-14 rounded-[4rem] ${config.shadow} flex flex-col items-center gap-6 animate-in zoom-in-95 fade-in duration-300`}>
        
        {/* Animated Checkmark Circle */}
        <div className="relative w-28 h-28">
          <svg className={`w-full h-full ${config.color}`} viewBox="0 0 52 52">
            <circle 
              className="opacity-20" 
              cx="26" cy="26" r="25" 
              fill="none" stroke="currentColor" strokeWidth="2" 
            />
            <circle 
              className="checkmark-circle" 
              cx="26" cy="26" r="25" 
              fill="none" stroke="currentColor" strokeWidth="2" 
              strokeDasharray="157" strokeDashoffset="157"
            />
            <path 
              className="checkmark-check" 
              fill="none" stroke="currentColor" strokeWidth="4" 
              d="M14.1 27.2l7.1 7.2 16.7-16.8" 
              strokeDasharray="48" strokeDashoffset="48"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <div className={`absolute inset-0 ${config.bg} rounded-full animate-ping opacity-30`} />
        </div>

        <div className="text-center">
          <h4 className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{config.title}</h4>
          <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">{message}</p>
        </div>
      </div>

      <style>{`
        .checkmark-circle {
          animation: stroke-circle 0.4s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark-check {
          animation: stroke-check 0.2s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards;
        }
        @keyframes stroke-circle {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes stroke-check {
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default SuccessToast;
