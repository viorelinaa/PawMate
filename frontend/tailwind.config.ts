import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /* ── Culori ───────────────────────────────────── */
      colors: {
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
      },

      /* ── Tipografie ───────────────────────────────── */
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      fontSize: {
        xs:   ['12px', { lineHeight: '1.4' }],
        sm:   ['13px', { lineHeight: '1.4' }],
        base: ['14px', { lineHeight: '1.5' }],
        md:   ['16px', { lineHeight: '1.5' }],
        lg:   ['18px', { lineHeight: '1.5' }],
      },
      fontWeight: {
        semibold:  '600',
        bold:      '700',
        extrabold: '800',
      },

      /* ── Border radius ────────────────────────────── */
      borderRadius: {
        sm:   '14px',
        md:   '18px',
        lg:   '22px',
        full: '999px',
        hero: '40px',
      },

      /* ── Umbre ────────────────────────────────────── */
      boxShadow: {
        card:          '0 12px 22px rgba(0,0,0,0.08)',
        'card-hover':  '0 16px 28px rgba(0,0,0,0.11)',
        'btn-primary': '0 14px 24px rgba(106,74,131,0.28)',
        'btn-ghost':   '0 10px 18px rgba(0,0,0,0.08)',
      },

      /* ── Tranziții ────────────────────────────────── */
      transitionDuration: {
        fast: '120ms',
      },
    },
  },
  plugins: [],
};

export default config;