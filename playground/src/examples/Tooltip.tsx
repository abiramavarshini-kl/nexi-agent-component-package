import { Button, Tooltip } from "nexi-agent";

export default function TooltipExample() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Tooltip content="Copy answer">
        <Button size="sm">Hover me</Button>
      </Tooltip>
      <Tooltip content="Shown below, after 0ms" side="bottom" delay={0}>
        <Button size="sm" variant="ghost">Bottom, no delay</Button>
      </Tooltip>
    </div>
  );
}
