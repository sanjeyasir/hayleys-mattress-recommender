import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gold' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md'
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-full tracking-wide';
  
  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[10px] font-semibold uppercase',
    md: 'px-3 py-1 text-xs'
  };

  const variantStyles = {
    primary: 'bg-brand-100 text-brand-800',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/50',
    error: 'bg-rose-50 text-rose-700 border border-rose-200/50',
    gold: 'bg-gold-50 text-gold-700 border border-gold-200/50',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/50'
  };

  return (
    <span className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
