import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import "../styles/SearchIcon.css";

export interface SearchIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface SearchIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const SearchIcon = forwardRef<SearchIconHandle, SearchIconProps>(
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
                className={`searchIcon ${animating ? "searchIcon--animate" : ""} ${className}`}
                style={{ ["--search-duration" as string]: `${duration}s` }}
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
                    <g className="searchIcon__lens">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.34-4.34" />
                    </g>
                </svg>
            </div>
        );
    }
);

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };
