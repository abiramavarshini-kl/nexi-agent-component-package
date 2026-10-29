"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* nexi-agent addition — a small dark label shown on hover or keyboard focus.
 * Rendered in a body portal so overflow-hidden parents can't clip it. */

export type TooltipProps = {
  /** the tooltip text (or any small content) */
  content: ReactNode;
  /** the element that triggers it */
  children: ReactNode;
  side?: "top" | "bottom";
  /** hover delay in ms */
  delay?: number;
  className?: string;
};

export function Tooltip({ content, children, side = "top", delay = 300, className = "" }: TooltipProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (rect) setPos({ x: rect.left + rect.width / 2, y: side === "top" ? rect.top - 6 : rect.bottom + 6 });
    }, delay);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setPos(null);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <span
      ref={anchorRef}
      className={`inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {pos &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            role="tooltip"
            className="nexi pointer-events-none fixed z-[200] max-w-60 rounded-[7px] px-2 py-1 text-[11.5px] leading-snug font-medium shadow-overlay"
            style={{
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, ${side === "top" ? "-100%" : "0"})`,
              color: "var(--tooltip-fg)",
              background: "var(--tooltip-bg)",
              animation: "fade-in 120ms ease-out both",
            }}
          >
            {content}
          </span>,
          document.body,
        )}
    </span>
  );
}
