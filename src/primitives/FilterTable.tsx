"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────
 * FILTER TABLE
 * Status chips directly filter the task table.
 * ───────────────────────────────────────────────────────── */

export type FilterTableStatus = "todo" | "progress" | "done";

export type TableRow = { key?: string; task: string; date: string; status: FilterTableStatus; owner: string };

export type FilterTableLabels = {
  columns: { task: string; date: string; status: string; owner: string };
  status: Record<FilterTableStatus, string>;
  all: string;
  tableAriaLabel: string;
};

const DEFAULT_LABELS: FilterTableLabels = {
  columns: { task: "Task", date: "Date", status: "Status", owner: "Owner" },
  status: { todo: "To do", progress: "In progress", done: "Completed" },
  all: "All",
  tableAriaLabel: "Scrollable table",
};

const STATUS_STYLE: Record<FilterTableStatus, { dot: string; cls: string }> = {
  todo: { dot: "#f09a2f", cls: "filter-status-todo" },
  progress: { dot: "#16a6c7", cls: "filter-status-progress" },
  done: { dot: "#25a878", cls: "filter-status-done" },
};

const STATUSES: FilterTableStatus[] = ["todo", "progress", "done"];

export type FilterTableProps = {
  rows?: TableRow[];
  labels?: Partial<Omit<FilterTableLabels, "columns" | "status">> & {
    columns?: Partial<FilterTableLabels["columns"]>;
    status?: Partial<FilterTableLabels["status"]>;
  };
  className?: string;
  variant?: string;
};

export default function FilterTable({
  rows = [],
  labels: labelsProp,
  className = "",
}: FilterTableProps = {}) {
  const labels: FilterTableLabels = {
    ...DEFAULT_LABELS,
    ...labelsProp,
    columns: { ...DEFAULT_LABELS.columns, ...labelsProp?.columns },
    status: { ...DEFAULT_LABELS.status, ...labelsProp?.status },
  };
  const [filter, setFilter] = useState<"all" | FilterTableStatus>("all");
  const filters: { key: "all" | FilterTableStatus; label: string; dot?: string; count: number }[] = [
    { key: "all", label: labels.all, count: rows.length },
    ...STATUSES.map((s) => ({
      key: s,
      label: labels.status[s],
      dot: STATUS_STYLE[s].dot,
      count: rows.filter((r) => r.status === s).length,
    })),
  ];

  return (
    <div className={`w-full max-w-105 ${className}`}>
      {/* filter chips */}
      <div
        className="-mx-1 mb-1 flex items-center gap-1 overflow-x-auto px-1 py-1"
        style={{ scrollbarWidth: "none" }}
      >
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={`flex h-6.5 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px]
                font-medium transition-[background-color,box-shadow,color] duration-200
                ${active ? "bg-surface text-ink shadow-btn" : "text-ink-2 hover:bg-hover"}`}
            >
              {f.dot && <span className="size-1.5 rounded-full" style={{ background: f.dot }} />}
              {f.label}
              <span
                className={`rounded-[4px] px-1 text-[10.5px] tabular-nums
                  ${active ? "bg-field text-ink-2" : "text-ink-3"}`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* table */}
      <div
        aria-label={labels.tableAriaLabel}
        className="overflow-x-auto rounded-card bg-surface shadow-card"
        role="region"
        tabIndex={0}
        style={{ scrollbarWidth: "none" }}
      >
        <div className="min-w-[420px]">
          <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.6fr)_minmax(0,0.95fr)_minmax(0,0.9fr)] border-b border-[var(--grid-line)] text-[12.5px] font-medium text-ink-2">
            <span className="border-r border-[var(--grid-line)] px-3 py-2">{labels.columns.task}</span>
            <span className="border-r border-[var(--grid-line)] px-3 py-2">{labels.columns.date}</span>
            <span className="border-r border-[var(--grid-line)] px-3 py-2">{labels.columns.status}</span>
            <span className="px-3 py-2">{labels.columns.owner}</span>
          </div>
          {rows.map((row, i) => {
            const shown = filter === "all" || row.status === filter;
            return (
              <div
                key={row.key ?? `${row.task}-${i}`}
                className="grid transition-[grid-template-rows,opacity] duration-300"
                style={{
                  gridTemplateRows: shown ? "1fr" : "0fr",
                  opacity: shown ? 1 : 0,
                  transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
                <div className="overflow-hidden">
                  <div
                    className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.6fr)_minmax(0,0.95fr)_minmax(0,0.9fr)] border-b
                      border-[var(--grid-line)] text-[13px] transition-colors duration-100 hover:bg-hover"
                  >
                    <span className="flex min-w-0 items-center border-r border-[var(--grid-line)] px-3 py-2">
                      <span className="truncate font-medium text-ink">{row.task}</span>
                    </span>
                    <span className="flex items-center whitespace-nowrap border-r border-[var(--grid-line)] px-3 py-2 text-ink-2 tabular-nums">
                      {row.date}
                    </span>
                    <span className="flex items-center border-r border-[var(--grid-line)] px-3 py-2">
                      <span
                        className={`inline-flex h-[23px] shrink-0 items-center whitespace-nowrap rounded-[8px] border px-[7px]
                          text-[13px] font-medium ${STATUS_STYLE[row.status].cls}`}
                      >
                        {labels.status[row.status]}
                      </span>
                    </span>
                    <span className="flex min-w-0 items-center px-3 py-2 text-ink-2">
                      <span className="truncate">{row.owner}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
