import React from "react";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--color-surface)",
    color: "var(--color-primary)",
    borderColor: "var(--color-primary-border)",
    boxShadow: "var(--shadow-btn-ghost)",
  },
  ghost: {
    background: "var(--color-surface)",
    color: "var(--color-primary)",
    borderColor: "var(--color-primary-border)",
    boxShadow: "var(--shadow-btn-ghost)",
  },
  outline: {
    background: "var(--color-surface)",
    color: "var(--color-primary)",
    borderColor: "var(--color-primary-border)",
    boxShadow: "var(--shadow-btn-ghost)",
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { height: 38, padding: "0 14px", fontSize: "var(--font-size-sm)" },
  md: { height: 46, padding: "0 18px", fontSize: "var(--font-size-base)" },
  lg: { height: 52, padding: "0 22px", fontSize: "var(--font-size-md)" },
};

export const AppButton: React.FC<AppButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  const mergedClassName = ["appBtn", className].filter(Boolean).join(" ");
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: "var(--radius-full)",
    border: "1px solid var(--color-primary-border)",
    fontWeight: 700,
    fontFamily: "var(--font-family)",
    lineHeight: 1,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition:
      "transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast)",
    width: fullWidth ? "100%" : undefined,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      className={mergedClassName}
      style={baseStyle}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        onMouseLeave?.(e);
      }}
      {...rest}
    />
  );
};
