import {
  InsightAllocationCard,
  InsightAnomalyCard,
  InsightCompareCard,
  InsightEntity,
  InsightMono,
  type InsightCardsProps,
} from "../primitives/InsightCards";

const money = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;

export const insightCardsDemo = {
  title: "Insights",
  pages: [
    {
      key: "compare",
      prose: (
        <>
          The worst performer in your <InsightEntity name="Creamery" tone="bg-orange" /> is Rocky Road — down{" "}
          <InsightMono tone="red">-6%</InsightMono> or <InsightMono tone="red">-$2,453.44</InsightMono>.
        </>
      ),
      card: (
        <InsightCompareCard
          title="Trend snapshot"
          badge="Snapshot"
          series={[
            { name: "Mint Chip", values: [-2.9, -3.4, -3.05, -3.86, -3.52, -4.1, -3.82, -4.41], sub: "-$2,377.66", tone: "red", dot: "bg-orange", color: "#f68f3c", tooltipColor: "var(--orange)" },
            { name: "Pistachio", values: [0.22, 0.58, 0.42, 0.91, 0.76, 1.08, 0.96, 1.15], sub: "+$617.22", tone: "green", dot: "bg-accent", color: "#3d9aff", tooltipColor: "var(--accent)" },
          ]}
        />
      ),
      pill: "Should I rebalance flavors?",
    },
    {
      key: "anomaly",
      prose: (
        <>
          Unusually high freezer bill on <span className="font-medium text-ink">Dec 13</span> —{" "}
          <InsightMono tone="red">+$1,834.66</InsightMono> above your average.
        </>
      ),
      card: (
        <InsightAnomalyCard
          title="High freezer spend"
          badge="Snapshot"
          metrics={[
            { key: "spend", label: "Spend", values: [274, 289, 264, 307, 331, 1210, 1718, 2112], format: money, threshold: "$2,112 threshold" },
            { key: "usage", label: "Usage", values: [18, 19, 17, 21, 22, 58, 81, 96], format: (v) => `${Math.round(v)} kWh`, threshold: "82 kWh threshold" },
          ]}
          footer={
            <>
              <span className="text-[17px] font-semibold tracking-[-0.01em] text-ink tabular-nums">$2,112 spent</span>
              <InsightMono tone="red">+$1,834.66</InsightMono>
              <span className="text-[11px] text-ink-3">vs 3 months</span>
            </>
          }
        />
      ),
      pill: "Get tips on cutting freezer costs",
    },
    {
      key: "allocation",
      prose: (
        <>
          You’re heavily invested in <InsightEntity name="Vanilla" tone="bg-orange" /> — it’s{" "}
          <span className="font-medium text-ink">72.5%</span> of your case.
        </>
      ),
      card: (
        <InsightAllocationCard
          title="Vanilla allocation"
          icon="V"
          description="Contribution snapshot across current inventory value. Segment selection changes the inspected group without moving the card."
          segments={[
            { name: "VAN", label: "Vanilla", pct: 72.5, amount: "$51,785", cls: "bg-orange", tone: "text-orange" },
            { name: "CHOC", label: "Chocolate", pct: 22.8, amount: "$16,278", cls: "bg-line-strong", tone: "text-ink-2" },
            { name: "MINT", label: "Mint", pct: 4.7, amount: "$3,357", cls: "bg-line", tone: "text-ink-3" },
          ]}
        />
      ),
      pill: "If we look at seasonals, what changes?",
    },
  ],
} satisfies InsightCardsProps;
