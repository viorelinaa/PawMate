// src/design-system/tokens.ts
// Sursă unică de adevăr pentru toate valorile de design.
// Folosește aceste constante în Tailwind config, componente și teme.

export const colors = {
  primary: {
    DEFAULT: '#6a4a83',
    light:   '#7d5f96',
    faint:   'rgba(106,74,131,0.10)',
    border:  'rgba(106,74,131,0.15)',
  },
  surface: {
    DEFAULT: 'rgba(255,255,255,0.92)',
    soft:    'rgba(255,255,255,0.80)',
    dim:     'rgba(255,255,255,0.65)',
  },
  text: {
    DEFAULT: '#2b2236',
    muted:   'rgba(43,34,54,0.70)',
    soft:    'rgba(43,34,54,0.75)',
  },
  danger: {
    DEFAULT: '#ff4757',
    border:  'rgba(255,71,87,0.30)',
  },
  bg: 'lavender',
} as const;

export const shadows = {
  card:       '0 12px 22px rgba(0,0,0,0.08)',
  cardHover:  '0 16px 28px rgba(0,0,0,0.11)',
  btnPrimary: '0 14px 24px rgba(106,74,131,0.28)',
  btnGhost:   '0 10px 18px rgba(0,0,0,0.08)',
} as const;

export const radii = {
  sm:   '14px',
  md:   '18px',
  lg:   '22px',
  full: '9999px',
  hero: '40px',
} as const;

export const spacing = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const;

export const typography = {
  fontFamily: "'Nunito', sans-serif",
  fontSize: {
    xs:   '12px',
    sm:   '13px',
    base: '14px',
    md:   '16px',
    lg:   '18px',
    xl:   'clamp(32px, 4vw, 52px)',
  },
  fontWeight: {
    semibold: 600,
    bold:     700,
    extrabold:800,
  },
} as const;

export const transitions = {
  fast: '120ms ease',
} as const;

// Tipuri derivate automat din token-uri
export type ColorPrimary  = typeof colors.primary;
export type ShadowKey     = keyof typeof shadows;
export type RadiusKey     = keyof typeof radii;
export type SpacingKey    = keyof typeof spacing;