"use client";

import { useState } from "react";
import { Button, type ButtonVariant } from "../atoms/Button";

/* ─────────────────────────────────────────────────────────
 * RECOMMENDATION CARD
 * The card holds its shape. Pressing "Alternatives" opens a
 * new drawer listing the other options; picking one promotes
 * it to the recommendation. The primary action confirms.
 * ───────────────────────────────────────────────────────── */

export type RecommendationOption = {
  key: string;
  /** the full recommendation — may include EntityChip / ValuePill */
  body: React.ReactNode;
  /** one-line summary shown in the alternatives drawer */
  short: string;
  /** confidence bars filled, 0–3 */
  signal: number;
  /** CSS colour for the filled bars, e.g. "var(--green)" */
  tone: string;
  /** confidence label, e.g. "High confidence" */
  label: string;
  /** primary button text */
  cta: string;
  ctaVariant?: ButtonVariant;
};

export type RecommendationLabels = {
  alternatives: string;
  otherOptions: string;
  accepted: string;
};

export type RecommendationCardProps = {
  /** the question or heading at the top of the card */
  title?: React.ReactNode;
  options?: RecommendationOption[];
  labels?: Partial<RecommendationLabels>;
  /** fired when the primary action is pressed */
  onAccept?: (option: RecommendationOption, index: number) => void;
  className?: string;
  variant?: string;
};

const DEFAULT_LABELS: RecommendationLabels = {
  alternatives: "Alternatives",
  otherOptions: "Other options",
  accepted: "Accepted",
};

function Meter({ signal, tone }: { signal: number; tone: string }) {
  return (
    <span className="flex items-end gap-0.5">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="w-1 rounded-full transition-colors duration-300"
          style={{ height: 10, background: bar < signal ? tone : "var(--line-strong)" }}
        />
      ))}
    </span>
  );
}

export default function RecommendationCard({
  title,
  options = [],
  labels,
  onAccept,
  className = "",
}: RecommendationCardProps = {}) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const active = options[selected];
  const others = options.map((o, i) => ({ o, i })).filter(({ i }) => i !== selected);

  return (
    <div className={`w-full max-w-95 overflow-hidden rounded-card bg-surface shadow-card ${className}`}>
      <div className="primitive-card-pad">
        <span className="text-[14px] font-medium text-ink">
          {title}
        </span>
        {active && (
          <p
            key={active.key}
            className="mt-1.5 min-h-12 text-[13px] leading-relaxed text-ink-2"
            style={{ animation: "fade-in 180ms ease-out both" }}
          >
            {active.body}
          </p>
        )}
      </div>

      {/* alternatives drawer — a distinctly new section of the card */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-300"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line bg-surface px-2 py-2">
            <p className="px-1.5 pb-1 text-[11px] font-medium text-ink-3">
              {t.otherOptions}
            </p>
            {others.map(({ o, i }) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  setSelected(i);
                  setAccepted(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-control px-1.5 py-1.5
                  text-left transition-colors duration-100 hover:bg-hover"
              >
                <Meter signal={o.signal} tone={o.tone} />
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{o.short}</span>
                <span className="shrink-0 text-[11px] text-ink-3">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {active && <div className="primitive-card-footer flex items-center justify-between gap-3 bg-surface">
        <span className="flex items-center gap-2">
          <Meter signal={active.signal} tone={active.tone} />
          <span className="text-[12.5px] font-medium text-ink-2">{active.label}</span>
        </span>

        <span className="-mr-0.5 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="px-2.5 text-[12.5px]"
          >
            {t.alternatives}
          </Button>
          <Button
            variant={accepted ? "success" : active.ctaVariant ?? "accent"}
            size="sm"
            onClick={() => {
              setAccepted(true);
              onAccept?.(active, selected);
            }}
            className="text-[12.5px]"
          >
            {accepted ? t.accepted : active.cta}
          </Button>
        </span>
      </div>}
    </div>
  );
}
