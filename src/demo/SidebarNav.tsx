import { IconArrowBoxLeft, IconHome, IconPlusMedium, IconPopsicle2, IconSettingsGear1, IconUserAdd } from "../lib/icons";
import type { SidebarNavProps } from "../primitives/SidebarNav";

export const sidebarNavDemo = {
  workspace: { name: "Creamery Ops", monogram: "C", logo: <IconPopsicle2 size={18} /> },
  workspaceMenu: [
    { key: "new", label: "New workspace", icon: <IconPlusMedium size={16} /> },
    { key: "settings", label: "Workspace settings", icon: <IconSettingsGear1 size={16} /> },
    { key: "invite", label: "Invite team members", icon: <IconUserAdd size={16} /> },
    { key: "signout", label: "Sign out", icon: <IconArrowBoxLeft size={16} />, separator: true },
  ],
  navItems: [
    { key: "home", label: "Home", icon: <IconHome size={18} /> },
    { key: "invite", label: "Invite users", icon: <IconUserAdd size={18} />, count: "3/10" },
  ],
  recents: [
    { id: "suppliers", label: "Supplier records" },
    { id: "todos", label: "Urgent to-dos this morning" },
    { id: "flavor", label: "Flavor page ticket" },
    { id: "workload", label: "Workload summary" },
    { id: "offboarding", label: "Off-board a supplier" },
    { id: "restock", label: "Batch restock function" },
    { id: "edits", label: "Propose flavor edits" },
    { id: "subway", label: "Subway surfing" },
  ],
  footerLabel: "Upgrade",
} satisfies SidebarNavProps;
