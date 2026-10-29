import type { TaskRowsProps } from "../primitives/TaskRows";

export const taskRowsDemo = {
  rows: [
    {
      key: "verify",
      label: "Verified vendor records",
      amount: "12 suppliers",
      status: "done",
      details: [
        { label: "Matched tax and contact IDs", meta: "12/12" },
        { label: "Flagged stale records", meta: "0" },
      ],
    },
    {
      key: "index",
      label: "Build reorder task list",
      amount: "7 SKUs",
      status: "running",
      step: 2,
      details: [
        { label: "Reading POS export", meta: "3 files" },
        { label: "Scoring stockout risk", meta: "68%" },
      ],
    },
    {
      key: "draft",
      label: "Draft supplier emails",
      amount: "2 messages",
      status: "sequence",
      step: 3,
      details: [
        { label: "Cone supplier follow-up", meta: "draft" },
        { label: "Pistachio reorder note", meta: "draft" },
      ],
    },
  ],
} satisfies TaskRowsProps;
