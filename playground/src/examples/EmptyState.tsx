import { EmptyState } from "nexi-agent";

export default function EmptyStateExample() {
  return (
    <div style={{ display: "grid", gap: 24, width: "100%" }}>
      <EmptyState
        title="No flavors yet"
        description="Add your first flavor or import last season's menu to get started."
        actions={[{ label: "Add flavor" }, { label: "Import menu" }]}
      />
      <EmptyState
        tone="error"
        title="The run failed"
        description="The POS export timed out after 30 seconds. Nothing was changed."
        actions={[{ label: "Try again" }, { label: "View logs" }]}
      />
    </div>
  );
}
