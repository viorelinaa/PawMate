// src/design-system/components/PageLayout.tsx
import React from 'react';

export interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: number | string;
  style?: React.CSSProperties;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth = 1100,
  style,
}) => {
  const pageStyle: React.CSSProperties = {
    background: 'var(--color-bg)',
    minHeight:  '100vh',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth:   typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    margin:     '0 auto',
    padding:    'var(--space-8) var(--space-6) var(--space-20)',
    background: 'var(--color-bg)',
    minHeight:  '100vh',
    ...style,
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  );
};