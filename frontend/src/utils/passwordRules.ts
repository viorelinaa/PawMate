// src/utils/passwordRules.ts

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'minLength',
    label: 'Minim 8 caractere',
    test: (p) => p.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Cel puțin o literă mare (A-Z)',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'lowercase',
    label: 'Cel puțin o literă mică (a-z)',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'digit',
    label: 'Cel puțin o cifră (0-9)',
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: 'special',
    label: 'Cel puțin un caracter special (!@#$...)',
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export function getStrengthLevel(passedCount: number): StrengthLevel {
  if (passedCount <= 1) return 'weak';
  if (passedCount === 2) return 'fair';
  if (passedCount === 3) return 'good';
  return 'strong';
}

export const STRENGTH_LABELS: Record<StrengthLevel, string> = {
  weak: 'Slabă',
  fair: 'Acceptabilă',
  good: 'Bună',
  strong: 'Puternică',
};