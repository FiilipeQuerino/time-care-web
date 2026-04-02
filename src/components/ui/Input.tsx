import React from 'react';
import { motion } from 'motion/react';

interface InputProps {
  label?: string;
  error?: string;
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>}
      <motion.input
        whileFocus={{ scale: 1.01 }}
        className={`
          w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 
          focus:border-pink-500 focus:bg-white focus:outline-none transition-all duration-200
          placeholder:text-slate-400 text-slate-800
          ${error ? 'border-rose-500 focus:border-rose-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 font-medium ml-1">{error}</span>}
    </div>
  );
};
