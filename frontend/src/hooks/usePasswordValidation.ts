// src/hooks/usePasswordValidation.ts

import { useMemo } from 'react';
import { PASSWORD_RULES, getStrengthLevel } from '../utils/passwordRules';
import type { PasswordRule, StrengthLevel } from '../utils/passwordRules';

export interface PasswordValidationResult {
  rules: Array<PasswordRule & { passed: boolean }>;
  passedCount: number;
  isValid: boolean;
  strengthLevel: StrengthLevel;
}

export function usePasswordValidation(password: string): PasswordValidationResult {
  return useMemo(() => {
    const rules = PASSWORD_RULES.map((rule) => ({
      ...rule,
      passed: rule.test(password),
    }));
    const passedCount = rules.filter((r) => r.passed).length;
    const isValid = passedCount === PASSWORD_RULES.length;
    const strengthLevel = getStrengthLevel(passedCount);

    return { rules, passedCount, isValid, strengthLevel };
  }, [password]);
}