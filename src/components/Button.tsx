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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm tracking-wide',
    lg: 'px-8 py-3.5 text-base tracking-wider'
  };

  const variantStyles = {
    primary: 'bg-brand-950 text-white hover:bg-brand-900 shadow-md shadow-brand-950/10 active:bg-black',
    secondary: 'bg-brand-100 text-brand-800 hover:bg-brand-200 active:bg-brand-300',
    outline: 'border border-brand-200 text-brand-700 bg-transparent hover:bg-brand-100/50 hover:border-brand-300',
    ghost: 'text-brand-600 bg-transparent hover:bg-brand-100/30',
    gold: 'bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 shadow-md active:bg-gold-800'
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
