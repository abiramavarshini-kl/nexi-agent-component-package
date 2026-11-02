import { useState } from "react";
import { SegmentedControl, ThinkingState } from "nexi-agent";
import { thinkingStateDemos } from "nexi-agent/demo";

const variants = ["Steps", "Reasoning", "Search", "Coding"] as const;

export default function ThinkingStateExample() {
  const [variant, setVariant] = useState<(typeof variants)[number]>("Steps");
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center", width: "100%" }}>
      <div style={{ width: 360, maxWidth: "100%" }}>
        <SegmentedControl options={variants} value={variant} onChange={setVariant} />
      </div>
      <ThinkingState key={variant} {...thinkingStateDemos[variant]} />
    </div>
  );
}
