import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import "../styles/HandCoinsIcon.css";

export interface HandCoinsIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface HandCoinsIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const HandCoinsIcon = forwardRef<HandCoinsIconHandle, HandCoinsIconProps>(
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
                className={`handCoinsIcon ${animating ? "handCoinsIcon--animate" : ""} ${className}`}
                style={{ ["--handcoins-duration" as string]: `${duration}s` }}
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
                    <g className="handCoinsIcon__group">
                        <path
                            className="handCoinsIcon__hand"
                            d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"
                        />
                        <path
                            className="handCoinsIcon__hand"
                            d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"
                        />
                        <path className="handCoinsIcon__hand" d="m2 16 6 6" />
                        <circle className="handCoinsIcon__coin" cx="16" cy="9" r="2.9" />
                        <circle className="handCoinsIcon__coin" cx="6" cy="5" r="3" />
                    </g>
                </svg>
            </div>
        );
    }
);

HandCoinsIcon.displayName = "HandCoinsIcon";
export { HandCoinsIcon };
