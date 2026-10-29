"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Avatar } from "../atoms/Avatar";

/* ─────────────────────────────────────────────────────────
 * MESSAGE THREAD — the scrolling conversation that holds the
 * other primitives. User turns are right-aligned bubbles;
 * agent turns sit on the canvas with an avatar and name, and
 * their `content` can be anything: StreamingText, Markdown,
 * ThinkingState, ToolChips, ApprovalCard…
 * Sticks to the bottom as content grows, unless the reader
 * has scrolled up.
 * ───────────────────────────────────────────────────────── */

export type ThreadMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  /** plain text or any element */
  content: ReactNode;
  /** shown above an assistant turn */
  name?: string;
  avatar?: string;
  /** small text after the name, e.g. "2:41 PM" */
  time?: string;
};

export type MessageProps = Omit<ThreadMessage, "id"> & {
  /** hide the avatar + name row (e.g. for consecutive turns) */
  compact?: boolean;
  className?: string;
};

/** One turn of the conversation. Usable on its own or through MessageThread. */
export function Message({ role, content, name, avatar, time, compact = false, className = "" }: MessageProps) {
  if (role === "user") {
    return (
      <div className={`flex justify-end pl-12 ${className}`} style={{ animation: "fade-up 300ms cubic-bezier(0.23,1,0.32,1) both" }}>
        <div className="max-w-full rounded-xl bg-field px-3 py-1.5 text-[13px] leading-[1.45] break-words whitespace-pre-wrap text-ink">
          {content}
        </div>
      </div>
    );
  }
  if (role === "system") {
    return (
      <div className={`flex items-center gap-2 text-[11.5px] text-ink-3 ${className}`}>
        <span className="h-px flex-1 bg-line" />
        <span className="shrink-0">{content}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }
  return (
    <div className={`flex flex-col gap-1.5 ${className}`} style={{ animation: "fade-up 300ms cubic-bezier(0.23,1,0.32,1) both" }}>
      {!compact && (name || avatar) && (
        <div className="flex items-center gap-2">
          {name && <Avatar name={name} src={avatar} size="xs" square />}
          {name && <span className="text-[12.5px] font-medium text-ink">{name}</span>}
          {time && <span className="text-[11.5px] text-ink-3 tabular-nums">{time}</span>}
        </div>
      )}
      <div className="min-w-0 text-[13px] leading-relaxed text-ink">{content}</div>
    </div>
  );
}

export type MessageThreadProps = {
  messages?: ThreadMessage[];
  /** shown when there are no messages, e.g. an <EmptyState /> */
  empty?: ReactNode;
  /** rendered after the last message, e.g. a <LoadingState /> while the agent works */
  footer?: ReactNode;
  /** keep the view pinned to the newest message */
  autoScroll?: boolean;
  /** hide the name row on consecutive assistant turns */
  groupConsecutive?: boolean;
  className?: string;
};

export default function MessageThread({
  messages = [],
  empty,
  footer,
  autoScroll = true,
  groupConsecutive = true,
  className = "",
}: MessageThreadProps = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);

  /* follow growth (new turns and streaming text) while pinned to the bottom */
  useEffect(() => {
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!autoScroll || !scroller || !content) return;
    const stick = () => {
      if (pinned.current) scroller.scrollTop = scroller.scrollHeight;
    };
    stick();
    const observer = new ResizeObserver(stick);
    observer.observe(content);
    return () => observer.disconnect();
  }, [autoScroll]);

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-live="polite"
      onScroll={(event) => {
        const el = event.currentTarget;
        pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      }}
      className={`min-h-0 w-full overflow-y-auto ${className}`}
    >
      <div ref={contentRef} className="flex flex-col gap-4 px-1 py-2">
        {messages.length === 0 && empty}
        {messages.map((message, i) => {
          const previous = messages[i - 1];
          const compact = groupConsecutive && message.role === "assistant" && previous?.role === "assistant" && previous.name === message.name;
          return <Message key={message.id} {...message} compact={compact} />;
        })}
        {footer}
      </div>
    </div>
  );
}
