import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import "../styles/ShoppingCartIcon.css";

export interface ShoppingCartIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ShoppingCartIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  isAnimated?: boolean;
}

const ShoppingCartIcon = forwardRef<ShoppingCartIconHandle, ShoppingCartIconProps>(
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
        className={`shoppingCartIcon ${animating ? "shoppingCartIcon--animate" : ""} ${className}`}
        style={{ ["--shopping-cart-duration" as string]: `${duration}s` }}
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
          <path
            className="shoppingCartIcon__cart"
            d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
          />
          <circle className="shoppingCartIcon__wheel" cx="8" cy="21" r="1" />
          <circle className="shoppingCartIcon__wheel" cx="19" cy="21" r="1" />
        </svg>
      </div>
    );
  }
);

ShoppingCartIcon.displayName = "ShoppingCartIcon";
export { ShoppingCartIcon };
