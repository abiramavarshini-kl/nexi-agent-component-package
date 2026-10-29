import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* nexi-agent addition — a general-purpose badge on the Beautiful UI tokens.
 * StatusPill (status with a dot), ValuePill (inline value) and Chip (mono
 * token) remain available for their specific jobs. */
const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-medium leading-none tabular-nums",
  {
    variants: {
      tone: {
        neutral: "bg-inset text-ink-2",
        accent: "bg-accent-tint text-accent-ink",
        green: "bg-green-tint text-green",
        orange: "bg-orange-tint text-orange",
        red: "bg-red-tint text-red",
      },
      variant: {
        soft: "",
        outline: "bg-transparent",
      },
      size: {
        sm: "h-5 px-2 text-[12px]",
        md: "h-6 px-2.5 text-[13px]",
      },
    },
    defaultVariants: { tone: "neutral", variant: "soft", size: "md" },
  },
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

const ringColor: Record<BadgeTone, string> = {
  neutral: "var(--line, currentColor)",
  accent: "color-mix(in oklch, var(--accent) 40%, transparent)",
  green: "color-mix(in oklch, var(--green) 40%, transparent)",
  orange: "color-mix(in oklch, var(--orange) 40%, transparent)",
  red: "color-mix(in oklch, var(--red) 40%, transparent)",
};

const dotColor: Record<BadgeTone, string> = {
  neutral: "bg-ink-3",
  accent: "bg-accent",
  green: "bg-green",
  orange: "bg-orange",
  red: "bg-red",
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    /** Show a leading status dot. */
    dot?: boolean;
    /** Optional leading icon (rendered before the label). */
    icon?: React.ReactNode;
  };

export function Badge({ tone, variant, size, dot = false, icon, className, style, children, ...rest }: BadgeProps) {
  const t = (tone ?? "neutral") as BadgeTone;
  return (
    <span
      className={cn(badgeVariants({ tone, variant, size }), className)}
      style={variant === "outline" ? { boxShadow: `inset 0 0 0 1px ${ringColor[t]}`, ...style } : style}
      {...rest}
    >
      {dot && <span aria-hidden className={cn("size-1.5 rounded-full", dotColor[t])} />}
      {icon && <span aria-hidden className="-ml-0.5 inline-flex [&>svg]:size-3.5">{icon}</span>}
      {children}
    </span>
  );
}

export { badgeVariants };
