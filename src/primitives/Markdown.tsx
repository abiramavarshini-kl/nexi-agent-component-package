"use client";

import { Fragment, type ReactNode } from "react";
import CodeBlock from "./CodeBlock";

/* ─────────────────────────────────────────────────────────
 * MARKDOWN — renders an agent's markdown answer with the
 * design tokens. Dependency-free and safe (no raw HTML):
 * headings, paragraphs, **bold**, *italic*, `code`, links,
 * lists, > quotes, tables, --- rules and fenced code (shown
 * in a CodeBlock). Partial input renders fine, so it can be
 * fed a stream as it arrives.
 * ───────────────────────────────────────────────────────── */

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "code"; lang: string; code: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "rule" };

const splitRow = (line: string) =>
  line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = /^```\s*([\w+-]*)/.exec(line);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) body.push(lines[i++]);
      i++; // closing fence (absent while streaming)
      blocks.push({ kind: "code", lang: fence[1], code: body.join("\n") });
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }
    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ kind: "rule" });
      i++;
      continue;
    }
    if (/^\s*>/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ""));
      blocks.push({ kind: "quote", text: body.join(" ") });
      continue;
    }
    const bullet = /^\s*([-*+]|\d+[.)])\s+/;
    if (bullet.test(line)) {
      const ordered = /^\s*\d/.test(line);
      const items: string[] = [];
      while (i < lines.length && bullet.test(lines[i])) {
        let item = lines[i++].replace(bullet, "");
        // indented continuation lines belong to the item
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !bullet.test(lines[i])) item += ` ${lines[i++].trim()}`;
        items.push(item);
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(splitRow(lines[i++]));
      blocks.push({ kind: "table", head, rows });
      continue;
    }
    const body: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(```|#{1,4}\s|\s*>|\s*([-*+]|\d+[.)])\s)/.test(lines[i])
    ) {
      body.push(lines[i++].trim());
    }
    blocks.push({ kind: "paragraph", text: body.join(" ") });
  }
  return blocks;
}

/* inline spans: `code`, **bold**, *italic* / _italic_, [text](url) */
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|_[^_\s][^_]*_|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string, onLink?: (href: string) => void): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const t = m[0];
    if (t.startsWith("`")) {
      out.push(
        <code key={k++} className="rounded-[4px] bg-inset px-1 py-px font-mono text-[0.88em] text-ink shadow-hairline">
          {t.slice(1, -1)}
        </code>,
      );
    } else if (t.startsWith("**") || t.startsWith("__")) {
      out.push(<strong key={k++} className="font-semibold text-ink">{inline(t.slice(2, -2), onLink)}</strong>);
    } else if (t.startsWith("[")) {
      const [, label, href] = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t)!;
      const safe = /^(https?:|mailto:|\/|#)/i.test(href) ? href : undefined;
      out.push(
        <a
          key={k++}
          href={safe}
          target={safe?.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          onClick={onLink && safe ? (event) => { event.preventDefault(); onLink(safe); } : undefined}
          className="font-medium text-accent-ink underline decoration-accent/40 underline-offset-2 hover:decoration-current"
        >
          {inline(label, onLink)}
        </a>,
      );
    } else {
      out.push(<em key={k++}>{inline(t.slice(1, -1), onLink)}</em>);
    }
    last = idx + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const HEADING_CLASS: Record<number, string> = {
  1: "text-[18px] font-semibold",
  2: "text-[16px] font-semibold",
  3: "text-[14px] font-semibold",
  4: "text-[13px] font-semibold text-ink-2",
};

export type MarkdownProps = {
  /** the markdown text — may be partial while streaming */
  content?: string;
  /** intercept link clicks (otherwise links open in a new tab) */
  onLinkClick?: (href: string) => void;
  /** fired when a code block's Copy is pressed */
  onCopyCode?: (code: string) => void;
  className?: string;
};

export default function Markdown({ content = "", onLinkClick, onCopyCode, className = "" }: MarkdownProps = {}) {
  const blocks = parseBlocks(content);
  return (
    <div className={`flex min-w-0 flex-col gap-2.5 text-[13px] leading-relaxed text-ink ${className}`}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "heading": {
            const Tag = `h${Math.min(block.level + 1, 6)}` as "h2";
            return (
              <Tag key={i} className={`${HEADING_CLASS[block.level]} mt-1 leading-snug text-ink`}>
                {inline(block.text, onLinkClick)}
              </Tag>
            );
          }
          case "paragraph":
            return <p key={i}>{inline(block.text, onLinkClick)}</p>;
          case "code":
            return (
              <CodeBlock
                key={i}
                code={block.code}
                filename={block.lang || undefined}
                onCopy={onCopyCode}
                className="max-w-none"
              />
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={i} className={`flex flex-col gap-1 pl-5 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-ink-3`}>
                {block.items.map((item, j) => (
                  <li key={j} className="pl-0.5">{inline(item, onLinkClick)}</li>
                ))}
              </List>
            );
          }
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-line-strong pl-3 text-ink-2">
                {inline(block.text, onLinkClick)}
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-card bg-surface shadow-card">
                <table className="w-full border-collapse text-left text-[12.5px]">
                  <thead>
                    <tr className="border-b border-line">
                      {block.head.map((cell, j) => (
                        <th key={j} className="px-3 py-2 font-medium text-ink-2">{inline(cell, onLinkClick)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r} className="border-b border-line last:border-0">
                        {block.head.map((_, j) => (
                          <td key={j} className="px-3 py-2 tabular-nums">{inline(row[j] ?? "", onLinkClick)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "rule":
            return <hr key={i} className="border-line" />;
          default:
            return <Fragment key={i} />;
        }
      })}
    </div>
  );
}
