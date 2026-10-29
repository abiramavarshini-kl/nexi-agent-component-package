import type { UsageMeterProps } from "../primitives/UsageMeter";

export const usageMeterDemo = {
  label: "Tokens this month",
  limit: 2_000_000,
  segments: [
    { label: "Input", value: 1_120_000 },
    { label: "Output", value: 410_000 },
  ],
  hint: "Resets in 3 days",
} satisfies UsageMeterProps;
