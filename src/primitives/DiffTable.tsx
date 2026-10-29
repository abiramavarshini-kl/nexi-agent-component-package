"use client";

import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";

/* ─────────────────────────────────────────────────────────
 * DIFF TABLE
 * The proposed edit plays once and rests on the completed
 * diff. Each changed row is the control: click it to include
 * or exclude that specific addition/removal before applying.
 * ───────────────────────────────────────────────────────── */

function useStage(steps: number[]) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= steps.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), steps[stage]);
    return () => clearTimeout(t);
  }, [stage, steps]);
  return stage;
}

const STAGE_DELAYS = [180, 260];

export type DiffTableTone = "accent" | "neutral" | "orange" | "green" | "red";

export type DiffTableRow = {
  key: string;
  /** first column — the record's name */
  label: string;
  /** second column — rendered as a tag with a coloured dot */
  tag: string;
  tagTone?: DiffTableTone;
  /** third column */
  detail: string;
  /** omit for unchanged rows */
  change?: "remove" | "add";
};

export type DiffTableLabels = {
  toggleHint: string;
  includeRow: (label: string) => string;
  summary: (removals: number, additions: number) => string;
  apply: (count: number) => string;
  applied: (count: number) => string;
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const DEFAULT_LABELS: DiffTableLabels = {
  toggleHint: "Click changed rows to toggle",
  includeRow: (label) => `Include ${label}`,
  summary: (r, a) => `${plural(r, "removal", "removals")} · ${plural(a, "addition", "additions")}`,
  apply: (n) => `Apply ${plural(n, "change", "changes")}`,
  applied: (n) => `${plural(n, "edit", "edits")} applied`,
};

const DOT: Record<DiffTableTone, string> = {
  accent: "bg-accent",
  neutral: "bg-ink-3",
  orange: "bg-orange",
  green: "bg-green",
  red: "bg-red",
};

export type DiffTableProps = {
  title?: string;
  /** the three column headers */
  columns?: [string, string, string];
  rows?: DiffTableRow[];
  labels?: Partial<DiffTableLabels>;
  /** fired with the changes the user kept */
  onApply?: (rows: DiffTableRow[]) => void;
  className?: string;
  variant?: string;
};

function IncludedMark({ included, tone }: { included: boolean; tone: "red" | "green" }) {
  return (
    <span
      aria-hidden
      className={`flex size-4.5 shrink-0 items-center justify-center rounded-[5px] transition-[background-color,color,transform] duration-150 ${
        included
          ? tone === "red" ? "bg-red text-white" : "bg-green text-white"
          : "bg-inset text-ink-3 shadow-hairline"
      }`}
      style={{ transform: included ? "scale(1)" : "scale(0.92)" }}
    >
      {included ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      ) : null}
    </span>
  );
}

export default function DiffTable({
  title,
  columns,
  rows = [],
  labels: labelsProp,
  onApply,
  className = "",
}: DiffTableProps = {}) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const stage = useStage(STAGE_DELAYS);
  // 0 plain · 1 removals · 2 completed diff
  const tinted = stage >= 1;
  const settled = stage >= 2;
  const [accepted, setAccepted] = useState(false);
  // every change starts included; a key maps to false once the user excludes it
  const [excluded, setExcluded] = useState<Record<string, boolean>>({});
  const included = (key: string) => !excluded[key];

  const baseRows = rows.filter((r) => r.change !== "add");
  const addedRows = rows.filter((r) => r.change === "add");
  const removals = rows.filter((r) => r.change === "remove" && included(r.key)).length;
  const additions = addedRows.filter((r) => included(r.key)).length;
  const total = removals + additions;

  const toggleEdit = (key: string) => setExcluded((current) => ({ ...current, [key]: !current[key] }));
  const keyToggle = (key: string) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleEdit(key);
    }
  };

  return (
    <div className={`w-full max-w-95 ${className}`}>
      <div className="relative overflow-hidden rounded-card bg-surface shadow-card">
        <div className="primitive-card-bar flex items-center justify-between border-b border-line">
          <span className="text-[12.5px] font-medium text-ink">{title}</span>
          {settled && !accepted && <span className="text-[11px] text-ink-3">{labels.toggleHint}</span>}
        </div>

        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[30%]" />
            <col className="w-[36%]" />
          </colgroup>
          {columns && (
            <thead>
              <tr className="border-b border-line">
                {columns.map((h, i) => (
                  <th key={i} className="primitive-table-cell text-[12px] font-medium text-ink-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {baseRows.map((row) => {
              const removed = row.change === "remove";
              const out = removed && tinted && included(row.key);
              const interactive = removed && settled && !accepted;
              return (
                <tr
                  key={row.key}
                  tabIndex={interactive ? 0 : undefined}
                  aria-selected={removed ? included(row.key) : undefined}
                  onClick={interactive ? () => toggleEdit(row.key) : undefined}
                  onKeyDown={interactive ? keyToggle(row.key) : undefined}
                  className={`border-b border-line transition-[background-color,filter,opacity] duration-150 last:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent ${
                    interactive ? "cursor-pointer hover:brightness-[0.985]" : ""
                  }`}
                  style={{ background: out ? "var(--red-tint)" : undefined }}
                >
                  <td
                    className="primitive-table-cell text-[13px] font-medium tabular-nums transition-colors duration-200"
                    style={{ color: out ? "var(--red)" : "var(--ink)" }}
                  >
                    {row.label}
                  </td>
                  <td className="primitive-table-cell">
                    <span
                      className="inline-flex h-5.5 items-center gap-1.5 rounded-full bg-inset px-2 text-[11.5px] font-medium shadow-hairline transition-opacity duration-200"
                      style={{ opacity: out ? 0.55 : 1 }}
                    >
                      <span className={`size-1.5 rounded-full ${DOT[row.tagTone ?? "neutral"]}`} />
                      <span className="text-ink-2">{row.tag}</span>
                    </span>
                  </td>
                  <td
                    className="primitive-table-cell text-[12.5px] whitespace-nowrap transition-colors duration-200"
                    style={{
                      color: out ? "var(--red)" : "var(--ink-2)",
                      textDecorationLine: out ? "line-through" : "none",
                      textDecorationColor: "color-mix(in srgb, var(--red) 50%, transparent)",
                    }}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate">{row.detail}</span>
                      {removed && settled && <IncludedMark included={included(row.key)} tone="red" />}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* added rows */}
            {addedRows.map((row) => {
              const on = included(row.key);
              return (
                <tr key={row.key}>
                  <td colSpan={3} className="p-0">
                    <div
                      className="grid transition-[grid-template-rows,opacity] duration-200"
                      style={{
                        gridTemplateRows: settled ? "1fr" : "0fr",
                        opacity: settled ? 1 : 0,
                        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                      }}
                    >
                      <div className="overflow-hidden">
                        <div
                          role="checkbox"
                          tabIndex={accepted ? -1 : 0}
                          aria-checked={on}
                          aria-label={labels.includeRow(row.label)}
                          onClick={accepted ? undefined : () => toggleEdit(row.key)}
                          onKeyDown={accepted ? undefined : keyToggle(row.key)}
                          className={`grid grid-cols-[34%_30%_36%] items-center border-t border-line transition-[background-color,filter,opacity] duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent ${
                            accepted ? "" : "cursor-pointer hover:brightness-[0.985]"
                          }`}
                          style={{ background: on ? "var(--green-tint)" : undefined }}
                        >
                          <span className="primitive-table-cell text-[13px] font-medium tabular-nums transition-colors duration-200" style={{ color: on ? "var(--green)" : "var(--ink-3)" }}>
                            {row.label}
                          </span>
                          <span className="primitive-table-cell">
                            <span className="inline-flex h-5.5 items-center gap-1.5 rounded-full bg-surface px-2 text-[11.5px] font-medium shadow-hairline">
                              <span className={`size-1.5 rounded-full ${DOT[row.tagTone ?? "green"]}`} />
                              <span className="text-ink-2">{row.tag}</span>
                            </span>
                          </span>
                          <span className="primitive-table-cell text-[13px] transition-colors duration-200" style={{ color: on ? "var(--green)" : "var(--ink-3)" }}>
                            <span className="flex items-center justify-between gap-2">
                              <span className="min-w-0 truncate">{row.detail}</span>
                              <IncludedMark included={on} tone="green" />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* footer — the summary follows the row-level selection */}
        {settled && (
          <div
            className="primitive-card-footer flex min-h-11 items-center justify-between border-t border-line"
            style={{ animation: "fade-up 180ms cubic-bezier(0.23,1,0.32,1) both" }}
          >
            {accepted ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-green-tint py-1 pr-2.5 pl-1 text-[12.5px] font-medium text-green"
                style={{ animation: "pop-in 180ms cubic-bezier(0.23,1,0.32,1) both" }}
              >
                <span className="flex size-4.5 items-center justify-center rounded-full bg-green text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </span>
                {labels.applied(total)}
              </span>
            ) : (
              <>
                <span className="text-[11.5px] tabular-nums text-ink-3">{labels.summary(removals, additions)}</span>
                <span className="flex items-center gap-1.5">
                  <Button
                    variant="accent"
                    size="sm"
                    disabled={total === 0}
                    onClick={() => {
                      setAccepted(true);
                      onApply?.(rows.filter((r) => r.change && included(r.key)));
                    }}
                    className="text-[12px]"
                  >
                    {labels.apply(total)}
                  </Button>
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
