"use client";

import { Liveline, type LivelinePoint, type LivelineSeries } from "liveline";
import { useEffect, useMemo, useState } from "react";

/* ─────────────────────────────────────────────────────────
 * INSIGHT CARDS
 * Embedded mini-visualizations in a "<title> N ‹ ›"
 * carousel. Autoplay yields as soon as a person uses it.
 * ───────────────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const formatPercent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
const formatMoney = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
/* anchor the snapshot to *call* time (inside each card's mount-time memo) —
 * a module-load constant goes stale, and once the points age past the chart
 * window the canvas renders empty */
function makePoints(values: number[], gap = 6): LivelinePoint[] {
  const end = Math.floor(Date.now() / 1000);
  return values.map((value, index) => ({
    time: end - (values.length - 1 - index) * gap,
    value,
  }));
}

/* Catmull-Rom resample — turn a sparse series into a dense, smoothly curved
 * one so both the line and the hover cursor glide instead of stepping between
 * a handful of points. */
function smooth(values: number[], perSegment = 9): number[] {
  if (values.length < 3) return values.slice();
  const out: number[] = [];
  const n = values.length;
  for (let i = 0; i < n - 1; i += 1) {
    const p0 = values[Math.max(0, i - 1)];
    const p1 = values[i];
    const p2 = values[i + 1];
    const p3 = values[Math.min(n - 1, i + 2)];
    for (let s = 0; s < perSegment; s += 1) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push(
        0.5 *
          (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3),
      );
    }
  }
  out.push(values[n - 1]);
  return out;
}

/* dense, smoothed points spanning exactly `spanSecs` — keeps the chart window
 * unchanged while multiplying the resolution. */
function smoothPoints(values: number[], spanSecs: number): LivelinePoint[] {
  const dense = smooth(values);
  return makePoints(dense, spanSecs / (dense.length - 1));
}

function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

/* inline @entity mention — for use in an InsightPage's prose */
export function InsightEntity({ name, tone }: { name: string; tone: string }) {
  return (
    <span className="inline-flex items-center gap-1 align-baseline font-medium text-ink">
      <span className={`inline-block size-2.5 rounded-full ${tone}`} />
      @{name}
    </span>
  );
}

/* coloured mono figure — for prose and card subtitles */
export function InsightMono({ children, tone }: { children: React.ReactNode; tone: "red" | "green" }) {
  return (
    <code className={`font-mono text-[11.5px] ${tone === "red" ? "text-red" : "text-green"}`}>
      {children}
    </code>
  );
}

function chartIndexFromPointer(event: React.PointerEvent<HTMLDivElement>, pointCount: number) {
  const rect = event.currentTarget.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  return Math.round(progress * (pointCount - 1));
}

function ChartTooltip({ rows }: { rows: { label: string; value: string; color: string }[] }) {
  return (
    <div className="insight-chart-tooltip">
      {rows.map((row) => (
        <span key={row.label} className="insight-chart-tooltip-item">
          <span className="insight-chart-tooltip-dot" style={{ background: row.color }} />
          {row.value}
        </span>
      ))}
    </div>
  );
}

/* content shape for the return-comparison card's plotted series */
export type CompareSeries = {
  name: string;
  values: number[];
  /** secondary line under the big number, e.g. "-$2,377.66" */
  sub: string;
  tone: "red" | "green";
  /** Tailwind class for the legend dot, e.g. "bg-orange" */
  dot: string;
  /** line colour on the chart */
  color: string;
  /** dot colour in the hover tooltip */
  tooltipColor: string;
};

export type InsightCompareCardProps = {
  series?: CompareSeries[];
  /** caption above the chart */
  title?: string;
  /** small pill at the top-right of the chart */
  badge?: string;
  /** how values are printed — defaults to a signed percentage */
  formatValue?: (value: number) => string;
};

/* 1 — return comparison: series legend + big deltas + line chart */
export function InsightCompareCard({
  series = [],
  title,
  badge,
  formatValue = formatPercent,
}: InsightCompareCardProps) {
  const dark = useDarkMode();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const points = useMemo(
    () => series.map((s) => (s.values.length > 1 ? smoothPoints(s.values, 42) : makePoints(s.values))),
    [series],
  );
  const pointCount = points[0]?.length ?? 0;

  const chartSeries: LivelineSeries[] = useMemo(
    () =>
      series.map((s, i) => ({
        id: s.name,
        label: "",
        data: points[i],
        value: points[i].at(-1)?.value ?? (s.values.at(-1) ?? 0),
        color: s.color,
      })),
    [series, points],
  );

  return (
    <div className="min-h-[278px] rounded-card bg-surface p-3 shadow-hairline">
      <div className="flex items-center gap-4">
        {series.map((s, i) => (
          <div key={s.name} className="flex-1">
            <span className="flex items-center gap-1.5 text-[11.5px] text-ink-2">
              <span className={`size-2 rounded-full ${s.dot}`} />
              {s.name}
            </span>
            <span className={`block text-[17px] font-semibold tracking-[-0.01em] tabular-nums ${s.tone === "red" ? "text-red" : "text-green"}`}>
              {formatValue(points[i].at(-1)?.value ?? (s.values.at(-1) ?? 0))}
            </span>
            <InsightMono tone={s.tone}>{s.sub}</InsightMono>
          </div>
        ))}
      </div>
      <div className="mt-2 overflow-hidden rounded-control bg-inset shadow-hairline">
        <div className="flex min-h-[29px] items-center justify-between border-b border-line px-2.5 py-1.5">
          <span className="text-[11px] text-ink-3 tabular-nums">{title}</span>
          {badge && (
            <span className="rounded-full bg-field px-2 py-0.5 text-[10.5px] font-medium text-ink-2">{badge}</span>
          )}
        </div>
        <div
          className="insight-chart-stage relative h-[166px]"
          onPointerDown={(event) => pointCount > 1 && setHoverIndex(chartIndexFromPointer(event, pointCount))}
          onPointerMove={(event) => pointCount > 1 && setHoverIndex(chartIndexFromPointer(event, pointCount))}
          onPointerLeave={() => setHoverIndex(null)}
          onPointerCancel={() => setHoverIndex(null)}
          onPointerUp={() => setHoverIndex(null)}
        >
          <Liveline
            data={[]}
            value={0}
            series={chartSeries}
            theme={dark ? "dark" : "light"}
            grid={false}
            pulse={false}
            window={42}
            paused
            scrub={false}
            cursor="default"
            lineWidth={2.25}
            padding={{ top: 40, right: 0, bottom: 22, left: 0 }}
            formatValue={formatValue}
          />
          {hoverIndex !== null && <>
            <span className="insight-chart-cursor" style={{ left: `${(hoverIndex / (pointCount - 1)) * 100}%` }} />
            <span className="insight-chart-tooltip-anchor" style={{ left: `${Math.min(Math.max((hoverIndex / (pointCount - 1)) * 100, 28), 72)}%` }}>
              <ChartTooltip rows={series.map((s, i) => ({ label: s.name, value: formatValue(points[i][hoverIndex]?.value ?? 0), color: s.tooltipColor }))} />
            </span>
          </>}
        </div>
      </div>
    </div>
  );
}

/* one toggleable metric on the anomaly card */
export type AnomalyMetric = {
  key: string;
  /** toggle and tooltip label, e.g. "Spend" */
  label: string;
  values: number[];
  /** how values are printed, e.g. (v) => `${v} kWh` */
  format?: (value: number) => string;
  /** shown above the chart when nothing is hovered, e.g. "$2,112 threshold" */
  threshold?: string;
};

export type InsightAnomalyCardProps = {
  /** heading with the red ↑ arrow */
  title?: string;
  /** small pill at the top-right */
  badge?: string;
  metrics?: AnomalyMetric[];
  /** line colour */
  color?: string;
  /** summary row under the chart — any content */
  footer?: React.ReactNode;
};

/* 2 — anomaly: line with toggleable metrics + summary */
export function InsightAnomalyCard({
  title,
  badge,
  metrics = [],
  color = "#ee5c61",
  footer,
}: InsightAnomalyCardProps) {
  const dark = useDarkMode();
  const [metricKey, setMetricKey] = useState(metrics[0]?.key);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const metric = metrics.find((m) => m.key === metricKey) ?? metrics[0];
  const data = useMemo(() => makePoints(metric?.values ?? [], 7), [metric]);
  const format = metric?.format ?? ((v: number) => String(Math.round(v)));
  const value = data.at(-1)?.value ?? 0;

  return (
    <div className="min-h-[278px] rounded-card bg-surface p-3 shadow-hairline">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          {title}
        </span>
        {badge && (
          <span className="rounded-full bg-field px-2 py-0.5 text-[10.5px] font-medium text-ink-2">{badge}</span>
        )}
      </div>
      <div className="mt-2 overflow-hidden rounded-control bg-inset shadow-hairline">
        <div className="flex min-h-[29px] items-center justify-between border-b border-line px-2.5 py-1.5">
          <span className="text-[11px] text-ink-3 tabular-nums">
            {hoverIndex !== null && data[hoverIndex] ? format(data[hoverIndex].value) : metric?.threshold}
          </span>
          {metrics.length > 1 && (
            <span className="flex rounded-full bg-field p-0.5">
              {metrics.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={metric?.key === item.key}
                  onClick={() => setMetricKey(item.key)}
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.96] ${
                    metric?.key === item.key ? "bg-surface text-ink shadow-btn" : "text-ink-3 hover:text-ink-2"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </span>
          )}
        </div>
        <div
          className="insight-chart-stage relative h-[166px]"
          onPointerDown={(event) => data.length > 1 && setHoverIndex(chartIndexFromPointer(event, data.length))}
          onPointerMove={(event) => data.length > 1 && setHoverIndex(chartIndexFromPointer(event, data.length))}
          onPointerLeave={() => setHoverIndex(null)}
          onPointerCancel={() => setHoverIndex(null)}
          onPointerUp={() => setHoverIndex(null)}
        >
          <Liveline
            data={data}
            value={value}
            theme={dark ? "dark" : "light"}
            color={color}
            grid
            scrub={false}
            fill={false}
            pulse={false}
            momentum={false}
            paused
            window={49}
            lineWidth={2.25}
            cursor="crosshair"
            padding={{ top: 34, right: 0, bottom: 22, left: 0 }}
            formatValue={format}
          />
          {hoverIndex !== null && data[hoverIndex] && metric && <>
            <span className="insight-chart-cursor" style={{ left: `${(hoverIndex / (data.length - 1)) * 100}%` }} />
            <span className="insight-chart-tooltip-anchor" style={{ left: `${Math.min(Math.max((hoverIndex / (data.length - 1)) * 100, 28), 72)}%` }}>
              <ChartTooltip rows={[{ label: metric.label, value: format(data[hoverIndex].value), color: "var(--red)" }]} />
            </span>
          </>}
        </div>
      </div>
      {footer && <div className="mt-1.5 flex items-baseline gap-2">{footer}</div>}
    </div>
  );
}

/* content shape for one allocation segment */
export type AllocationSegment = {
  /** short code shown in the legend, e.g. "VAN" */
  name: string;
  /** full name shown in the detail box */
  label: string;
  pct: number;
  /** the big number shown while this segment is selected */
  amount: string;
  /** Tailwind background class for the bar, e.g. "bg-orange" */
  cls: string;
  /** Tailwind text class for the detail label, e.g. "text-orange" */
  tone: string;
};

export type InsightAllocationCardProps = {
  title?: string;
  /** small badge before the title — text or an icon */
  icon?: React.ReactNode;
  segments?: AllocationSegment[];
  /** explanatory text in the detail box */
  description?: string;
  /** aria-label of the segmented bar */
  groupLabel?: string;
};

/* 3 — allocation: hero number + segmented bar + legend */
export function InsightAllocationCard({
  title,
  icon,
  segments = [],
  description,
  groupLabel = "Allocation segments",
}: InsightAllocationCardProps) {
  const [selected, setSelected] = useState(segments[0]?.name);
  const active = segments.find((segment) => segment.name === selected) ?? segments[0];

  return (
    <div className="min-h-[278px] rounded-card bg-surface p-3 shadow-hairline">
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
        {icon !== undefined && (
          <span className={`flex size-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white ${segments[0]?.cls ?? "bg-orange"}`}>
            {icon}
          </span>
        )}
        {title}
      </span>
      <span className="mt-1 block min-h-[30px] text-[20px] font-semibold tracking-[-0.01em] text-ink tabular-nums">
        {active?.amount}
      </span>
      <div
        className="mt-3 flex h-9 gap-0.5 overflow-hidden rounded-full bg-field p-0.5"
        role="group"
        aria-label={groupLabel}
      >
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={selected === s.name}
            aria-label={`${s.label}: ${s.pct}%`}
            onClick={() => setSelected(s.name)}
            className={`relative h-full overflow-hidden rounded-full ${s.cls} transition-[opacity,transform,box-shadow] duration-300 active:scale-[0.98]`}
            style={{
              width: `${s.pct}%`,
              opacity: selected === s.name ? 1 : 0.58,
              boxShadow: selected === s.name ? "inset 0 0 0 1px rgba(255,255,255,0.22)" : undefined,
              transitionTimingFunction: EASE,
            }}
          >
            <span
              className="absolute inset-y-1 left-1 rounded-full bg-white/20 transition-[width,opacity] duration-500"
              style={{
                width: selected === s.name ? "calc(100% - 8px)" : "0%",
                opacity: selected === s.name ? 1 : 0,
                transitionTimingFunction: EASE,
              }}
            />
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={selected === s.name}
            onClick={() => setSelected(s.name)}
            className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] transition-[background-color,color,transform] duration-150 active:scale-[0.96] ${
              selected === s.name ? "bg-field text-ink" : "text-ink-2 hover:bg-hover hover:text-ink"
            }`}
          >
            <span className={`size-1.5 rounded-full ${s.cls}`} />
            {s.name} <span className="tabular-nums">{s.pct}%</span>
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-3 min-h-16 rounded-control bg-inset px-2.5 py-2 shadow-hairline">
          <span className={`block text-[11.5px] font-medium ${active.tone}`}>{active.label}</span>
          {description && <span className="mt-1 block text-[11px] leading-relaxed text-ink-3">{description}</span>}
        </div>
      )}
    </div>
  );
}

/* content shape for one insight page in the carousel */
export type InsightPage = {
  key: string;
  /** the sentence above the card — may use InsightEntity / InsightMono */
  prose: React.ReactNode;
  /** the visual, e.g. <InsightCompareCard … /> or any element */
  card: React.ReactNode;
  /** suggested follow-up shown as a pill under the card */
  pill?: string;
};

export type InsightCardsLabels = {
  previous: string;
  next: string;
};

const DEFAULT_INSIGHT_LABELS: InsightCardsLabels = {
  previous: "Previous insight",
  next: "Next insight",
};

export type InsightCardsProps = {
  variant?: string;
  /** carousel heading shown before the page count */
  title?: string;
  pages?: InsightPage[];
  labels?: Partial<InsightCardsLabels>;
  /** fired when a page's follow-up pill is pressed */
  onPillClick?: (page: InsightPage, index: number) => void;
  className?: string;
};

export default function InsightCards({
  title,
  pages = [],
  labels,
  onPillClick,
  className = "",
}: InsightCardsProps = {}) {
  const l = { ...DEFAULT_INSIGHT_LABELS, ...labels };
  const [page, setPage] = useState(0);

  const move = (direction: -1 | 1) => {
    setPage((current) => (current + direction + pages.length) % pages.length);
  };

  const current = pages[page];

  return (
    <div className={`min-h-[408px] w-full max-w-86 ${className}`}>
      {/* pager header */}
      <div className="flex items-center justify-between">
        <span className="flex items-baseline gap-1.5">
          {title && <span className="text-[13px] font-semibold text-ink">{title}</span>}
          <span className="text-[13px] text-ink-3 tabular-nums">{pages.length}</span>
        </span>
        <span className="flex items-center gap-0.5">
          {(["M15 18l-6-6 6-6", "M9 6l6 6-6 6"] as const).map((d, i) => (
            <button
              key={i}
              aria-label={i === 0 ? l.previous : l.next}
              disabled={pages.length < 2}
              onClick={() => move(i === 0 ? -1 : 1)}
              className="flex size-6 items-center justify-center rounded-[6px] text-ink-3
                transition-[background-color,color,transform] duration-100 hover:bg-hover
                hover:text-ink active:scale-[0.96] disabled:opacity-40"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d={d} />
              </svg>
            </button>
          ))}
        </span>
      </div>

      {/* page content */}
      {current && (
        <div key={current.key} className="transition-[opacity,filter] duration-250" style={{ opacity: 1, filter: "blur(0)" }}>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">{current.prose}</p>
          <div className="mt-2">{current.card}</div>
          {current.pill && (
            <button
              onClick={() => onPillClick?.(current, page)}
              className="mt-2 rounded-full bg-surface px-3 py-1.5 text-left text-[12px] text-ink
                shadow-btn transition-colors duration-100 hover:bg-hover"
            >
              {current.pill}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
