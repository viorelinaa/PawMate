import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import "../styles/SunIcon.css";

export interface SunIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface SunIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const SunIcon = forwardRef<SunIconHandle, SunIconProps>(
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
                className={`sunIcon ${animating ? "sunIcon--animate" : ""} ${className}`}
                style={{ ["--sun-duration" as string]: `${duration}s` }}
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
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                >
                    <circle className="sunIcon__center" cx="12" cy="12" r="4" />
                    <path className="sunIcon__ray" d="M12 2v2" />
                    <path className="sunIcon__ray" d="M12 20v2" />
                    <path className="sunIcon__ray" d="m4.93 4.93 1.41 1.41" />
                    <path className="sunIcon__ray" d="m17.66 17.66 1.41 1.41" />
                    <path className="sunIcon__ray" d="M2 12h2" />
                    <path className="sunIcon__ray" d="M20 12h2" />
                    <path className="sunIcon__ray" d="m6.34 17.66-1.41 1.41" />
                    <path className="sunIcon__ray" d="m19.07 4.93-1.41 1.41" />
                </svg>
            </div>
        );
    }
);

SunIcon.displayName = "SunIcon";
export { SunIcon };
