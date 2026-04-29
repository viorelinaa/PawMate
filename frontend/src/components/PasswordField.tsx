import { useId, useState, type CSSProperties, type InputHTMLAttributes } from "react";
import { EyeIcon } from "./EyeIcon";
import { EyeOffIcon } from "./EyeOffIcon";

type PasswordFieldProps = {
    label: string;
    inputStyle?: CSSProperties;
    labelStyle?: CSSProperties;
    inputClassName?: string;
    labelClassName?: string;
    fieldClassName?: string;
    toggleClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordField({
    label,
    inputStyle,
    labelStyle,
    inputClassName,
    labelClassName,
    fieldClassName,
    toggleClassName,
    id,
    ...props
}: PasswordFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [isVisible, setIsVisible] = useState(false);

    return (
        <label htmlFor={inputId} className={labelClassName} style={labelStyle}>
            {label}
            <span className={["password-field", fieldClassName].filter(Boolean).join(" ")} style={styles.fieldShell}>
                <input
                    {...props}
                    id={inputId}
                    type={isVisible ? "text" : "password"}
                    className={inputClassName}
                    style={{
                        ...inputStyle,
                        ...styles.inputWithToggle,
                    }}
                />
                <button
                    type="button"
                    className={["password-toggle", toggleClassName].filter(Boolean).join(" ")}
                    onClick={() => setIsVisible((current) => !current)}
                    aria-label={isVisible ? "Ascunde parola" : "Afiseaza parola"}
                    title={isVisible ? "Ascunde parola" : "Afiseaza parola"}
                    style={styles.toggleButton}
                >
                    {isVisible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
            </span>
        </label>
    );
}

const styles: Record<string, CSSProperties> = {
    fieldShell: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    inputWithToggle: {
        width: "100%",
        paddingRight: "48px",
    },
    toggleButton: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "32px",
        height: "32px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "999px",
        border: "none",
        background: "transparent",
        color: "#6b4ea0",
        cursor: "pointer",
        padding: 0,
    },
};
