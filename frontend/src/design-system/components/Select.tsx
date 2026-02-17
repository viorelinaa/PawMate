// src/design-system/components/Select.tsx
import React, { useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  placeholder,
  style,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  const selectStyle: React.CSSProperties = {
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
    cursor:       'pointer',
    appearance:   'none' as const,
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    display:     'block',
    marginBottom:'6px',
    fontWeight:  700,
    fontSize:    'var(--font-size-sm)',
    color:       'var(--color-text-muted)',
    fontFamily:  'var(--font-family)',
  };

  return (
    <div style={{ width: '100%' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <select
        style={selectStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};