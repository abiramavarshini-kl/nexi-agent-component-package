import { EntityChip } from "../atoms/EntityChip";
import { ValuePill } from "../atoms/ValuePill";
import type { RecommendationCardProps } from "../primitives/RecommendationCard";

export const recommendationCardDemo = {
  title: "Want me to place this restock order?",
  options: [
    {
      key: "high",
      body: (
        <>
          Reorder waffle cones from <EntityChip name="Cone King" /> with lead time{" "}
          <ValuePill tone="green">7 days</ValuePill>
        </>
      ),
      short: "Reorder from Cone King · 7-day lead",
      signal: 3,
      tone: "var(--green)",
      label: "High confidence",
      cta: "Accept",
      ctaVariant: "accent",
    },
    {
      key: "review",
      body: (
        <>
          Switch vanilla to <ValuePill>Vanilla Madagascar</ValuePill> for peak season.
        </>
      ),
      short: "Switch to Vanilla Madagascar",
      signal: 2,
      tone: "var(--orange)",
      label: "Needs review",
      cta: "Configure",
      ctaVariant: "primary",
    },
    {
      key: "none",
      body: (
        <>
          Fall back to a <span className="font-medium text-ink">full restock</span> across every SKU.
        </>
      ),
      short: "Full restock across every SKU",
      signal: 0,
      tone: "var(--ink-3)",
      label: "No signal",
      cta: "Accept full restock",
      ctaVariant: "primary",
    },
  ],
} satisfies RecommendationCardProps;
