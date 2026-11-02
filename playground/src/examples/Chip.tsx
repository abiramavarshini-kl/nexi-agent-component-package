import { Chip } from "nexi-agent";

export default function ChipExample() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Chip>updated_at</Chip>
      <Chip tone="accent">gpt-agent-v2</Chip>
      <Chip tone="orange">rate_limited</Chip>
    </div>
  );
}
