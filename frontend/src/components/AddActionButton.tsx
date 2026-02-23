import type { ButtonHTMLAttributes } from "react";
import { PlusIcon } from "./PlusIcon";

type AddActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function AddActionButton({
  label,
  className = "",
  type = "button",
  title,
  "aria-label": ariaLabel,
  ...rest
}: AddActionButtonProps) {
  return (
    <button
      type={type}
      className={`roleActionBtn addActionBtn ${className}`.trim()}
      title={title ?? label}
      aria-label={ariaLabel ?? label}
      {...rest}
    >
      <span className="addActionIcon" aria-hidden="true">
        <PlusIcon size={18} />
      </span>
      <span className="addActionText">{label}</span>
    </button>
  );
}

