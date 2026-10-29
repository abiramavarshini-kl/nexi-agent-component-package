"use client";

import { useState } from "react";
import { Monogram } from "./EntityChip";

/* nexi-agent addition — a person or agent picture. Falls back to a Monogram
 * (initial on a coloured disc) when there is no image or it fails to load. */

const SIZES = { xs: 16, sm: 24, md: 32, lg: 40 } as const;

const STATUS: Record<"online" | "busy" | "away" | "offline", string> = {
  online: "var(--green)",
  busy: "var(--red)",
  away: "var(--orange)",
  offline: "var(--ink-3)",
};

export type AvatarStatus = keyof typeof STATUS;

export type AvatarProps = {
  /** used for the fallback initial and the image's alt text */
  name: string;
  src?: string;
  size?: keyof typeof SIZES;
  /** fallback disc colour */
  color?: string;
  /** small dot at the bottom-right */
  status?: AvatarStatus;
  /** rounded square instead of a circle — e.g. for agents or workspaces */
  square?: boolean;
  className?: string;
};

export function Avatar({ name, src, size = "sm", color, status, square = false, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const px = SIZES[size];
  const radius = square ? "rounded-[28%]" : "rounded-full";
  return (
    <span className={`relative inline-flex shrink-0 ${className}`} style={{ width: px, height: px }}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => setFailed(true)}
          className={`size-full object-cover shadow-hairline ${radius}`}
        />
      ) : (
        <Monogram color={color} className={`size-full! ${radius}`}>
          <span style={{ fontSize: Math.round(px * 0.42) }}>{name.trim().charAt(0).toUpperCase()}</span>
        </Monogram>
      )}
      {status && (
        <span
          aria-label={status}
          className="absolute right-0 bottom-0 rounded-full"
          style={{
            width: Math.max(6, px * 0.28),
            height: Math.max(6, px * 0.28),
            background: STATUS[status],
            boxShadow: "0 0 0 1.5px var(--surface)",
          }}
        />
      )}
    </span>
  );
}
