import React, { useRef, useState, useEffect, Children } from "react";
import "./FilterSelect.css";

interface Option {
    value: string;
    label: string;
}

interface FilterSelectProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    disabled?: boolean;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    children: React.ReactNode;
}

function parseOptions(children: React.ReactNode): Option[] {
    const options: Option[] = [];
    Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === "option") {
            const props = child.props as { value?: string; children?: React.ReactNode };
            options.push({
                value: props.value ?? "",
                label: String(props.children ?? ""),
            });
        }
    });
    return options;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
    value,
    onChange,
    className = "",
    disabled = false,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    children,
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const options = parseOptions(children);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optValue: string) => {
        if (disabled) {
            return;
        }

        const fakeEvent = { target: { value: optValue } } as React.ChangeEvent<HTMLSelectElement>;
        onChange(fakeEvent);
        setOpen(false);
    };

    return (
        <div
            className={`fs-dropdown ${disabled ? "fs-dropdown--disabled" : ""} ${className}`}
            ref={ref}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
            <button
                type="button"
                className="fs-btn"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="fs-btn-label">{selected?.label ?? ""}</span>
                <svg
                    className={`fs-chevron${open ? " fs-chevron--open" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {open && (
                <div className="fs-menu" role="listbox">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={opt.value === value}
                            className={`fs-option${opt.value === value ? " fs-option--active" : ""}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
