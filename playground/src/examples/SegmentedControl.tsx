import { useState } from "react";
import { SegmentedControl } from "nexi-agent";

const ranges = ["Day", "Week", "Month"] as const;

export default function SegmentedControlExample() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Week");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center", width: 280 }}>
      <SegmentedControl options={ranges} value={range} onChange={setRange} />
      <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Showing: {range}</span>
    </div>
  );
}
