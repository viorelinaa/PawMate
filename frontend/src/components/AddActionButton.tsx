import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { PlusIcon } from "./PlusIcon";

type AddActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function AddActionButton({
  label,
  className = "",
  type = "button",
  title,
  style,
  "aria-label": ariaLabel,
  ...rest
}: AddActionButtonProps) {
  const safeLabel = label.trim();
  const estimatedExpandedWidth = Math.max(176, Math.ceil(safeLabel.length * 7.4 + 92));
  const styleRecord = style as (Record<string, string | undefined> & CSSProperties) | undefined;
  const styleWithWidth = {
    ...(style ?? {}),
    ["--add-action-expanded-width" as string]:
      styleRecord?.["--add-action-expanded-width"] ?? `${estimatedExpandedWidth}px`,
  } as CSSProperties;

  return (
    <button
      type={type}
      className={`roleActionBtn addActionBtn ${className}`.trim()}
      title={title ?? label}
      aria-label={ariaLabel ?? label}
      style={styleWithWidth}
      {...rest}
    >
      <span className="addActionIcon" aria-hidden="true">
        <PlusIcon size={18} />
      </span>
      <span className="addActionText">{label}</span>
    </button>
  );
}
