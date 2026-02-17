// src/design-system/components/Badge.tsx
import React from 'react';

type BadgeVariant = 'primary' | 'danger' | 'ghost';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantMap: Record<BadgeVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--color-primary-faint)',
    color:      'var(--color-primary)',
    border:     '1px solid var(--color-primary-border)',
  },
  danger: {
    background: 'var(--color-danger)',
    color:      '#fff',
    border:     '1px solid var(--color-danger-border)',
  },
  ghost: {
    background: 'var(--color-surface-soft)',
    color:      'var(--color-text-muted)',
    border:     '1px dashed var(--color-primary-border)',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    display:      'inline-flex',
    alignItems:   'center',
    padding:      '6px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize:     'var(--font-size-xs)',
    fontWeight:   700,
    fontFamily:   'var(--font-family)',
    ...variantMap[variant],
    ...style,
  };

  return <span style={baseStyle}>{children}</span>;
};