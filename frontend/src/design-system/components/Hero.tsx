// src/design-system/components/Hero.tsx
import React from 'react';

export interface HeroProps {
  title: string;
  subtitle?: string;
  decorations?: boolean;
  children?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  decorations = true,
  children,
}) => {
  const heroStyle: React.CSSProperties = {
    position:                'relative',
    padding:                 '80px 24px 60px',
    background:              'var(--color-bg)',
    overflow:                'hidden',
    borderBottomLeftRadius:  '40px',
    borderBottomRightRadius: '40px',
    textAlign:               'center',
  };

  const titleStyle: React.CSSProperties = {
    margin:     0,
    fontSize:   'var(--font-size-xl)',
    color:      'var(--color-primary)',
    fontWeight: 800,
    fontFamily: 'var(--font-family)',
    position:   'relative',
    zIndex:     1,
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign:  'center',
    margin:     '10px 0 0',
    color:      'var(--color-text-muted)',
    fontWeight: 600,
    fontFamily: 'var(--font-family)',
    position:   'relative',
    zIndex:     1,
  };

  const cloudBase: React.CSSProperties = {
    position:     'absolute',
    background:   'rgba(255,255,255,0.95)',
    borderRadius: 'var(--radius-full)',
    filter:       'drop-shadow(0 10px 20px rgba(0,0,0,0.08))',
    pointerEvents:'none',
  };

  return (
    <header style={heroStyle}>
      {decorations && (
        <>
          {/* Clouds */}
          <div style={{ ...cloudBase, width: 200, height: 70, left: 30, top: 40, transform: 'scale(0.9)' }} />
          <div style={{ ...cloudBase, width: 220, height: 75, right: 30, top: 50 }} />
          {/* Paws */}
          {['🐾', '🐾', '🐾'].map((paw, i) => (
            <span
              key={i}
              style={{
                position:     'absolute',
                fontSize:     i === 2 ? 20 : 24,
                opacity:      0.3,
                pointerEvents:'none',
                ...(i === 0 ? { left: 20,  bottom: 30, transform: 'rotate(-14deg)' } : {}),
                ...(i === 1 ? { right: 24, bottom: 34, transform: 'rotate(12deg)' } : {}),
                ...(i === 2 ? { left: '50%', top: 20, transform: 'translateX(-50%) rotate(8deg)' } : {}),
              }}
            >
              {paw}
            </span>
          ))}
        </>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={titleStyle}>{title}</h1>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        {children}
      </div>
    </header>
  );
};