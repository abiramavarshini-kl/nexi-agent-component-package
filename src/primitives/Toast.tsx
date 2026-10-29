"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* ─────────────────────────────────────────────────────────
 * TOAST — short-lived notifications ("Run finished",
 * "Copied"). Wrap the app once in <ToastProvider>, then call
 * `toast({ title })` from useToast() anywhere below it.
 * Toasts stack at a screen corner, pause while hovered, and
 * can carry one action.
 * ───────────────────────────────────────────────────────── */

export type ToastTone = "neutral" | "success" | "error" | "warning";

export type ToastOptions = {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** ms before it hides; 0 keeps it until dismissed */
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastItem = ToastOptions & { id: number };

type ToastApi = {
  /** show a toast; returns its id */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

/** Returns { toast, dismiss }. Must be used inside <ToastProvider>. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <ToastProvider>");
  return api;
}

const DOT: Record<ToastTone, string> = {
  neutral: "var(--ink-3)",
  success: "var(--green)",
  error: "var(--red)",
  warning: "var(--orange)",
};

export type ToastProviderProps = {
  children?: ReactNode;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "bottom-center";
  /** default duration in ms */
  duration?: number;
  /** most toasts on screen at once */
  max?: number;
  /** aria-label of each toast's close button */
  dismissLabel?: string;
};

function ToastCard({ item, onDismiss, dismissLabel }: { item: ToastItem; onDismiss: () => void; dismissLabel: string }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration ?? 0);

  useEffect(() => {
    if (!item.duration || paused) return;
    const started = Date.now();
    const t = setTimeout(onDismiss, remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current -= Date.now() - started;
    };
  }, [paused, item.duration, onDismiss]);

  const tone = item.tone ?? "neutral";
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto flex w-80 max-w-[calc(100vw-32px)] items-start gap-2.5 rounded-card bg-surface p-3 shadow-overlay"
      style={{ animation: "pop-in 220ms cubic-bezier(0.23,1,0.32,1) both" }}
    >
      <span className="mt-[5px] size-2 shrink-0 rounded-full" style={{ background: DOT[tone] }} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[13px] font-medium text-ink">{item.title}</span>
        {item.description && <span className="text-[12px] leading-snug text-ink-2">{item.description}</span>}
      </span>
      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action!.onClick();
            onDismiss();
          }}
          className="shrink-0 rounded-chip px-1.5 py-0.5 text-[12px] font-medium text-accent-ink transition-colors duration-100 hover:bg-hover"
        >
          {item.action.label}
        </button>
      )}
      <button
        type="button"
        aria-label={dismissLabel}
        onClick={onDismiss}
        className="-mt-0.5 -mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors duration-100 hover:bg-hover hover:text-ink"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

const POSITION: Record<NonNullable<ToastProviderProps["position"]>, string> = {
  "bottom-right": "right-4 bottom-4 items-end",
  "bottom-left": "left-4 bottom-4 items-start",
  "top-right": "right-4 top-4 items-end flex-col-reverse",
  "top-left": "left-4 top-4 items-start flex-col-reverse",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

/** Holds the toast stack. Wrap your app (inside NexiProvider) once. */
export function ToastProvider({
  children,
  position = "bottom-right",
  duration = 4000,
  max = 4,
  dismissLabel = "Dismiss",
}: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const nextId = useRef(1);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setItems((current) => [...current, { duration, ...options, id }].slice(-max));
      return id;
    },
    [duration, max],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div className={`nexi pointer-events-none fixed z-[160] flex flex-col gap-2 ${POSITION[position]}`}>
            {items.map((item) => (
              <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} dismissLabel={dismissLabel} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
