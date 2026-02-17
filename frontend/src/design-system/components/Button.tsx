// src/design-system/components/Button.tsx
import React from 'react';

type Variant = 'primary' | 'ghost' | 'outline';
type Size    = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--color-primary)',
    color:      '#fff',
    boxShadow:  'var(--shadow-btn-primary)',
  },
  ghost: {
    background: 'var(--color-surface)',
    color:      'var(--color-primary)',
    boxShadow:  'var(--shadow-btn-ghost)',
  },
  outline: {
    background: 'transparent',
    color:      'var(--color-primary)',
    border:     '2px solid var(--color-primary)',
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 14px',  fontSize: 'var(--font-size-sm)' },
  md: { padding: '10px 18px', fontSize: 'var(--font-size-base)' },
  lg: { padding: '14px 24px', fontSize: 'var(--font-size-md)' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  style,
  ...rest
}) => {
  const baseStyle: React.CSSProperties = {
    border:       'none',
    borderRadius: 'var(--radius-full)',
    fontWeight:   700,
    cursor:       'pointer',
    fontFamily:   'var(--font-family)',
    transition:   'transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast)',
    width:        fullWidth ? '100%' : undefined,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      style={baseStyle}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
      {...rest}
    >
      {children}
    </button>
  );
};