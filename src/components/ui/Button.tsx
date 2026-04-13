import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: LucideIcon;
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  isLoading,
  className = '',
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 text-white shadow-[0_12px_28px_rgba(219,39,119,0.32)] hover:brightness-105',
    secondary:
      'bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 text-white shadow-[0_12px_28px_rgba(3,105,161,0.30)] hover:brightness-105',
    outline:
      'border-2 border-slate-200 bg-white text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.08)] hover:border-pink-200 hover:bg-pink-50/50',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
    icon: 'p-2.5',
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={20} />}
          {children}
        </>
      )}
    </motion.button>
  );
};
