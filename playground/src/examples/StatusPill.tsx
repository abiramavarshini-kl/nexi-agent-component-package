import { StatusPill } from "nexi-agent";

export default function StatusPillExample() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <StatusPill>Idle</StatusPill>
      <StatusPill tone="orange">Running</StatusPill>
      <StatusPill tone="green">Done</StatusPill>
      <StatusPill tone="red">Failed</StatusPill>
      <StatusPill tone="accent" dot={false}>Scheduled</StatusPill>
    </div>
  );
}
