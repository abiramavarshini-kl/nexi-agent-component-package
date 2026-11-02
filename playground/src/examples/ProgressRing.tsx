import { ProgressRing } from "nexi-agent";

export default function ProgressRingExample() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ProgressRing progress={0.25} />
      <ProgressRing progress={0.6} tone="accent" />
      <ProgressRing progress={1} tone="green" />
      <ProgressRing progress={0.8} tone="red" size={40}>
        <span style={{ fontSize: 11 }}>4/5</span>
      </ProgressRing>
    </div>
  );
}
