"use client";

import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "../atoms/Button";

/* ─────────────────────────────────────────────────────────
 * EMPTY STATE — what a panel shows when there's nothing to
 * show yet, or when something went wrong (tone="error").
 * An icon, a title, a short explanation and up to two actions.
 * ───────────────────────────────────────────────────────── */

const TONES = {
  neutral: { box: "bg-inset text-ink-3 shadow-hairline", title: "text-ink" },
  error: { box: "bg-red-tint text-red", title: "text-ink" },
  warning: { box: "bg-orange-tint text-orange", title: "text-ink" },
  success: { box: "bg-green-tint text-green", title: "text-ink" },
} as const;

const DEFAULT_ICONS: Record<keyof typeof TONES, ReactNode> = {
  neutral: <g><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 12l9 4 9-4M3 17l9 4 9-4" /></g>,
  error: <g><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></g>,
  warning: <g><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></g>,
  success: <g><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></g>,
};

export type EmptyStateAction = {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
};

export type EmptyStateProps = {
  title?: string;
  description?: ReactNode;
  /** neutral (default) · error · warning · success */
  tone?: keyof typeof TONES;
  /** replaces the tone's default icon */
  icon?: ReactNode;
  /** first is the primary action */
  actions?: EmptyStateAction[];
  /** smaller padding for inline use */
  compact?: boolean;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  tone = "neutral",
  icon,
  actions = [],
  compact = false,
  className = "",
}: EmptyStateProps = {}) {
  const t = TONES[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex w-full flex-col items-center text-center ${compact ? "gap-1 px-4 py-5" : "gap-1.5 px-6 py-10"} ${className}`}
      style={{ animation: "fade-in 250ms ease-out both" }}
    >
      <span className={`mb-1.5 flex size-9 items-center justify-center rounded-control ${t.box}`}>
        {icon ?? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {DEFAULT_ICONS[tone]}
          </svg>
        )}
      </span>
      {title && <span className={`text-[13.5px] font-medium ${t.title}`}>{title}</span>}
      {description && <span className="max-w-72 text-[12.5px] leading-relaxed text-ink-3">{description}</span>}
      {actions.length > 0 && (
        <span className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
          {actions.map((action, i) => (
            <Button
              key={action.label}
              size="sm"
              variant={action.variant ?? (i === 0 ? (tone === "error" ? "primary" : "accent") : "secondary")}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </span>
      )}
    </div>
  );
}
