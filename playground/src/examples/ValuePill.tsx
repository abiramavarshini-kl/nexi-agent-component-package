import { ValuePill } from "nexi-agent";

export default function ValuePillExample() {
  return (
    <p style={{ margin: 0, maxWidth: 440, lineHeight: 1.9 }}>
      Revenue was <ValuePill>$48,210</ValuePill> on <ValuePill>Dec 03</ValuePill>, up{" "}
      <ValuePill tone="green">+12%</ValuePill>, while refunds rose <ValuePill tone="red">+3%</ValuePill>.
    </p>
  );
}
