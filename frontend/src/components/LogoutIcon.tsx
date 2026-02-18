import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import "../styles/LogoutIcon.css";

export interface LogoutIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface LogoutIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const LogoutIcon = forwardRef<LogoutIconHandle, LogoutIconProps>(
    (
        {
            onMouseEnter,
            onMouseLeave,
            className = "",
            size = 28,
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
                className={`logoutIcon ${animating ? "logoutIcon--animate" : ""} ${className}`}
                style={{ ["--logout-duration" as string]: `${duration}s` }}
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
                    <path className="logoutIcon__arrow" d="m16 17 5-5-5-5" />
                    <path className="logoutIcon__arrow" d="M21 12H9" />
                    <path
                        className="logoutIcon__door"
                        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                    />
                </svg>
            </div>
        );
    }
);

LogoutIcon.displayName = "LogoutIcon";
export { LogoutIcon };
