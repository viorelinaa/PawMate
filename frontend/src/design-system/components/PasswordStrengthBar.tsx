import React from 'react';
import type { PasswordValidationResult } from '../../hooks/usePasswordValidation';
import { STRENGTH_LABELS, PASSWORD_RULES } from '../../utils/passwordRules';
import '../../styles/PasswordStrengthBar.css';

interface Props {
  validation: PasswordValidationResult;
  password: string;
}

export const PasswordStrengthBar: React.FC<Props> = ({ validation, password }) => {
  if (!password) return null;

  const { rules, passedCount, strengthLevel } = validation;
  const totalRules = PASSWORD_RULES.length;

  return (
    <div className="psb-wrapper">
      <div className="psb-bar-track">
        {Array.from({ length: totalRules }).map((_, i) => (
          <div
            key={i}
            className={`psb-bar-segment ${i < passedCount ? `psb-bar-segment--${strengthLevel}` : ''}`}
          />
        ))}
      </div>

      <p className={`psb-strength-label psb-strength-label--${strengthLevel}`}>
        Putere parolă: <strong>{STRENGTH_LABELS[strengthLevel]}</strong>
      </p>

      <ul className="psb-rules">
        {rules.map((rule: { id: string; label: string; passed: boolean }) => (
          <li key={rule.id} className={`psb-rule ${rule.passed ? 'psb-rule--passed' : 'psb-rule--failed'}`}>
            <span className="psb-rule-icon">{rule.passed ? '✓' : '✗'}</span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
};