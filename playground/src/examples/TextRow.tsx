import { TextRow } from "nexi-agent";

export default function TextRowExample() {
  return (
    <div style={{ width: 320, display: "grid", gap: 2 }}>
      <TextRow label="Model" value="agent-large" />
      <TextRow label="Tokens" value="12,480" meta="in + out" />
      <TextRow label="Duration" value="6.2s" />
      <TextRow label="Cost" value="$0.04" />
    </div>
  );
}
