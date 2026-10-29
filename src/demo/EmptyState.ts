import type { EmptyStateProps } from "../primitives/EmptyState";

export const emptyStateDemo = {
  title: "No flavors yet",
  description: "Add your first flavor or import last season's menu to get started.",
  actions: [{ label: "Add flavor" }, { label: "Import menu" }],
} satisfies EmptyStateProps;

export const errorStateDemo = {
  tone: "error",
  title: "The run failed",
  description: "The POS export timed out after 30 seconds. Nothing was changed.",
  actions: [{ label: "Try again" }, { label: "View logs" }],
} satisfies EmptyStateProps;
