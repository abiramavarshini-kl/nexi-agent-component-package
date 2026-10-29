"use client";

/* ─────────────────────────────────────────────────────────
 * USAGE METER — how much of a budget a run or a plan has
 * used: tokens, credits, requests, storage. A label, the
 * used / limit figures and a bar that can be split into
 * segments (e.g. input vs output tokens). The bar turns
 * orange, then red, as it nears the limit.
 * ───────────────────────────────────────────────────────── */

export type UsageSegment = {
  label: string;
  value: number;
  /** CSS colour; defaults cycle through accent, accent-ink, ink-3 */
  color?: string;
};

export type UsageMeterProps = {
  label?: string;
  /** total used — defaults to the sum of `segments` */
  used?: number;
  limit?: number;
  /** split the bar; shown as a legend underneath */
  segments?: UsageSegment[];
  /** how numbers are printed — defaults to compact (12.4k) */
  format?: (value: number) => string;
  /** fraction of the limit at which the bar turns orange / red */
  warnAt?: number;
  dangerAt?: number;
  /** small text under the bar, e.g. "Resets in 3 days" */
  hint?: string;
  className?: string;
};

const compact = (value: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

const SEGMENT_COLORS = ["var(--accent)", "var(--accent-ink)", "var(--ink-3)", "var(--green)"];

export default function UsageMeter({
  label,
  used: usedProp,
  limit,
  segments = [],
  format = compact,
  warnAt = 0.75,
  dangerAt = 0.9,
  hint,
  className = "",
}: UsageMeterProps = {}) {
  const used = usedProp ?? segments.reduce((sum, s) => sum + s.value, 0);
  const ratio = limit ? Math.min(used / limit, 1) : 0;
  const level = ratio >= dangerAt ? "var(--red)" : ratio >= warnAt ? "var(--orange)" : undefined;
  const scale = limit || used || 1;

  return (
    <div className={`flex w-full max-w-80 flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
        {label && <span className="font-medium text-ink">{label}</span>}
        <span className="ml-auto tabular-nums text-ink-2">
          <span className="font-medium" style={{ color: level ?? "var(--ink)" }}>{format(used)}</span>
          {limit !== undefined && <span className="text-ink-3"> / {format(limit)}</span>}
        </span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={limit}
        className="flex h-1.5 w-full gap-px overflow-hidden rounded-full bg-field"
      >
        {segments.length > 0
          ? segments.map((s, i) => (
              <span
                key={s.label}
                className="h-full transition-[width] duration-500"
                style={{ width: `${(s.value / scale) * 100}%`, background: level ?? s.color ?? SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
              />
            ))
          : (
              <span
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${(Math.min(used, scale) / scale) * 100}%`, background: level ?? "var(--accent)" }}
              />
            )}
      </div>
      {(segments.length > 0 || hint) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-3">
          {segments.map((s, i) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full" style={{ background: s.color ?? SEGMENT_COLORS[i % SEGMENT_COLORS.length] }} />
              {s.label} <span className="tabular-nums text-ink-2">{format(s.value)}</span>
            </span>
          ))}
          {hint && <span className="ml-auto">{hint}</span>}
        </div>
      )}
    </div>
  );
}
