import type { DialogProps } from "../primitives/Dialog";

export const dialogDemo = {
  open: true,
  title: "Retire Bubblegum?",
  description: "It will be removed from the menu and all scheduled churns. You can bring it back later.",
  destructive: true,
  labels: { confirm: "Retire flavor" },
  onConfirm: () => {},
} satisfies DialogProps;
