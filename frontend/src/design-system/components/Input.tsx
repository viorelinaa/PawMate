// src/design-system/components/Input.tsx
import React, { useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  const inputStyle: React.CSSProperties = {
    width:        '100%',
    padding:      '12px 14px',
    borderRadius: 'var(--radius-sm)',
    border:       focused
      ? `1px solid var(--color-primary)`
      : `1px solid var(--color-primary-border)`,
    outline:      'none',
    fontWeight:   600,
    color:        'var(--color-text)',
    background:   '#fff',
    fontFamily:   'var(--font-family)',
    fontSize:     'var(--font-size-base)',
    boxSizing:    'border-box' as const,
    boxShadow:    focused ? '0 0 0 3px var(--color-primary-faint)' : 'none',
    transition:   'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    display:    'block',
    marginBottom: '6px',
    fontWeight: 700,
    fontSize:   'var(--font-size-sm)',
    color:      'var(--color-text-muted)',
    fontFamily: 'var(--font-family)',
  };

  const errorStyle: React.CSSProperties = {
    marginTop:  '4px',
    fontSize:   'var(--font-size-xs)',
    color:      'var(--color-danger)',
    fontWeight: 600,
    fontFamily: 'var(--font-family)',
  };

  return (
    <div style={{ width: '100%' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        style={inputStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};