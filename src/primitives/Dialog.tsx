"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../atoms/Button";

/* ─────────────────────────────────────────────────────────
 * DIALOG — a centred modal over a dimmed page, for confirms
 * ("Delete this run?") and small forms. Controlled through
 * `open` / `onOpenChange`. Esc and the backdrop close it,
 * focus moves inside, and page scroll is locked while open.
 * ───────────────────────────────────────────────────────── */

export type DialogLabels = {
  confirm: string;
  cancel: string;
  close: string;
};

const DEFAULT_LABELS: DialogLabels = {
  confirm: "Confirm",
  cancel: "Cancel",
  close: "Close",
};

export type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: ReactNode;
  /** body content between the description and the actions */
  children?: ReactNode;
  /** shows the confirm button; fired when pressed (the dialog then closes unless it returns false) */
  onConfirm?: () => void | boolean | Promise<void | boolean>;
  /** red confirm button for destructive actions */
  destructive?: boolean;
  /** hide the cancel button */
  hideCancel?: boolean;
  labels?: Partial<DialogLabels>;
  className?: string;
};

export default function Dialog({
  open = false,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  destructive = false,
  hideCancel = false,
  labels,
  className = "",
}: DialogProps = {}) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onOpenChange?.(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus the first control (the confirm/cancel buttons come last)
    const focusable = panelRef.current?.querySelector<HTMLElement>("input, textarea, select, button:not([data-dialog-close])");
    focusable?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  const confirm = async () => {
    if (!onConfirm) return;
    setBusy(true);
    try {
      const result = await onConfirm();
      if (result !== false) onOpenChange?.(false);
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div className="nexi fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        style={{ animation: "fade-in 160ms ease-out both" }}
        onClick={() => onOpenChange?.(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={`relative w-full max-w-sm rounded-window bg-surface p-4 shadow-overlay ${className}`}
        style={{ animation: "pop-in 200ms cubic-bezier(0.23,1,0.32,1) both" }}
      >
        <button
          type="button"
          data-dialog-close
          aria-label={t.close}
          onClick={() => onOpenChange?.(false)}
          className="primitive-icon-button absolute top-2.5 right-2.5 text-ink-3 transition-colors duration-100 hover:bg-hover hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        {title && (
          <h2 id={titleId} className="pr-8 text-[14.5px] font-semibold text-ink">
            {title}
          </h2>
        )}
        {description && (
          <div id={descId} className="mt-1 text-[13px] leading-relaxed text-ink-2">
            {description}
          </div>
        )}
        {children && <div className="mt-3">{children}</div>}
        {(onConfirm || !hideCancel) && (
          <div className="mt-4 flex items-center justify-end gap-2">
            {!hideCancel && (
              <Button size="sm" variant="secondary" onClick={() => onOpenChange?.(false)}>
                {t.cancel}
              </Button>
            )}
            {onConfirm && (
              <Button
                size="sm"
                variant={destructive ? "primary" : "accent"}
                disabled={busy}
                onClick={confirm}
                className={destructive ? "bg-red text-white hover:opacity-90 dark:bg-red dark:text-white" : undefined}
              >
                {t.confirm}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
