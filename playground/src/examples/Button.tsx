import { Button } from "nexi-agent";

export default function ButtonExample() {
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="success">Success</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="quiet">Quiet</Button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  );
}
