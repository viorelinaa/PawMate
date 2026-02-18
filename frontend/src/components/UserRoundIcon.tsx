import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import "../styles/UserRoundIcon.css";

export interface UserRoundHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface UserRoundProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const UserRoundIcon = forwardRef<UserRoundHandle, UserRoundProps>(
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
                className={`userRoundIcon ${animating ? "userRoundIcon--animate" : ""} ${className}`}
                style={{ ["--user-duration" as string]: `${duration}s` }}
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
                    <circle className="userRoundIcon__head" cx="12" cy="8" r="5" />
                    <path className="userRoundIcon__curve" d="M20 21a8 8 0 0 0-16 0" />
                </svg>
            </div>
        );
    }
);

UserRoundIcon.displayName = "UserRoundIcon";
export { UserRoundIcon };
