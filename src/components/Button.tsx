import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm tracking-wide',
    lg: 'px-8 py-3.5 text-base tracking-wide'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-brand-700 to-brand-400 text-white hover:from-brand-800 hover:to-brand-500 shadow-md shadow-brand-700/25 active:from-brand-900 active:to-brand-600',
    secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 active:bg-brand-200 border border-brand-200',
    outline: 'border-2 border-brand-700 text-brand-700 bg-transparent hover:bg-brand-50',
    ghost: 'text-brand-700 bg-transparent hover:bg-brand-50/70',
    gold: 'bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 font-extrabold hover:from-gold-500 hover:to-gold-400 shadow-md'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export default Button;
