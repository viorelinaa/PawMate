import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import "../styles/PlusIcon.css";

export interface PlusIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface PlusIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const PlusIcon = forwardRef<PlusIconHandle, PlusIconProps>(
    (
        {
            onMouseEnter,
            onMouseLeave,
            className = "",
            size = 24,
            duration = 1,
            isAnimated = true,
            ...props
        },
        ref
    ) => {
        const [animating, setAnimating] = useState(false);
        const isControlled = useRef(false);

        useImperativeHandle(ref, () => {
            isControlled.current = true;
            return {
                startAnimation: () => setAnimating(true),
                stopAnimation: () => setAnimating(false),
            };
        });

        const handleEnter = useCallback(
            (e?: React.MouseEvent<HTMLDivElement>) => {
                if (!isAnimated) return;
                if (!isControlled.current) setAnimating(true);
                else onMouseEnter?.(e as React.MouseEvent<HTMLDivElement>);
            },
            [isAnimated, onMouseEnter]
        );

        const handleLeave = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlled.current) {
                    setAnimating(false);
                } else {
                    onMouseLeave?.(e);
                }
            },
            [onMouseLeave]
        );

        return (
            <div
                className={`plusIcon ${animating ? "plusIcon--animate" : ""} ${className}`}
                style={{ ["--plus-duration" as string]: `${duration}s` }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                {...props}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path className="plusIcon__line" d="M5 12h14" />
                    <path className="plusIcon__line" d="M12 5v14" />
                </svg>
            </div>
        );
    }
);

PlusIcon.displayName = "PlusIcon";
export { PlusIcon };
