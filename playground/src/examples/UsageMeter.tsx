import { UsageMeter } from "nexi-agent";

export default function UsageMeterExample() {
  return (
    <div style={{ display: "grid", gap: 24, justifyItems: "center" }}>
      <UsageMeter
        label="Tokens this month"
        limit={2_000_000}
        segments={[
          { label: "Input", value: 1_120_000 },
          { label: "Output", value: 410_000 },
        ]}
        hint="Resets in 3 days"
      />
      <UsageMeter label="Credits" used={940} limit={1000} hint="94% used" />
    </div>
  );
}
