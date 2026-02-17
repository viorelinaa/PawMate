// src/design-system/components/Card.tsx
import React, { useState } from 'react';

export interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = true,
  style,
  className,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  const cardStyle: React.CSSProperties = {
    background:   'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    padding:      'var(--space-5)',
    boxShadow:    hovered && hoverable ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
    border:       '1px solid var(--color-primary-border)',
    transform:    hovered && hoverable ? 'translateY(-2px)' : 'translateY(0)',
    transition:   'transform var(--transition-fast), box-shadow var(--transition-fast)',
    cursor:       onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      style={cardStyle}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};