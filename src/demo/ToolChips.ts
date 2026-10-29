import type { ToolChipsProps } from "../primitives/ToolChips";

export const toolChipsDemo = {
  title: "4 tool calls, 2 messages",
  more: "+2 more",
  steps: [
    {
      icon: "think", label: "Thinking", chip: "Planning the churn schedule…",
      detail: [
        { text: "Weekend demand carries pistachio, so it churns first." },
        { text: "Batch capacity leaves two evening freezer windows." },
      ],
    },
    {
      icon: "write", label: "Write 204 lines", chip: "ChurnSchedule.tsx", mono: true, detailMono: true,
      detail: [
        { text: "+ const windows = slots.filter((s) => s.temp <= -12)", tone: "add" },
        { text: '+ return schedule(windows, { hero: "pistachio" })', tone: "add" },
      ],
    },
    {
      icon: "run", label: "Rebuild and verify", chip: "npm run freeze", mono: true, detailMono: true,
      detail: [{ text: "✓ built in 1.2s" }, { text: "✓ 34 checks passed" }],
    },
    {
      icon: "read", label: "Read image", chip: "flavor-chart.png", mono: true,
      detail: [
        { text: "1280 × 720 · line chart, three summers." },
        { text: "Mint chip trends up 12% through July." },
      ],
    },
  ],
  diffs: [
    { file: "flavors.css", add: 13, del: 0 },
    { file: "ChurnSchedule.tsx", add: 74, del: 41 },
    { file: "menu.ts", add: 8, del: 2 },
  ],
  diffLines: {
    "flavors.css": [
      { text: ".scoop-card {", tone: "ctx" },
      { text: "  gap: 14px;", tone: "del" },
      { text: "  gap: 12px;", tone: "add" },
      { text: "  container-type: inline-size;", tone: "add" },
      { text: "}", tone: "ctx" },
    ],
    "ChurnSchedule.tsx": [
      { text: "const slots = coldSlots(week);", tone: "ctx" },
      { text: "const windows = slots;", tone: "del" },
      { text: "const windows = slots.filter(", tone: "add" },
      { text: "  (s) => s.temp <= -12,", tone: "add" },
      { text: ");", tone: "add" },
    ],
    "menu.ts": [
      { text: 'export const hero = "mint-chip";', tone: "del" },
      { text: 'export const hero = "pistachio";', tone: "add" },
    ],
  },
} satisfies ToolChipsProps;
