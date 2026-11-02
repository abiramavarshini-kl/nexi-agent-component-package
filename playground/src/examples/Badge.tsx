import { Badge } from "nexi-agent";

export default function BadgeExample() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      <Badge>Draft</Badge>
      <Badge tone="accent">Beta</Badge>
      <Badge tone="green" dot>Completed</Badge>
      <Badge tone="orange" dot>Queued</Badge>
      <Badge tone="red" variant="outline">Failed</Badge>
      <Badge tone="accent" variant="outline" size="sm">v2</Badge>
    </div>
  );
}
