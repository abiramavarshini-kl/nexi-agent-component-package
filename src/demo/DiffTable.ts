import type { DiffTableProps } from "../primitives/DiffTable";

export const diffTableDemo = {
  title: "Proposed menu cleanup",
  columns: ["Flavor", "Category", "Supplier"],
  rows: [
    { key: "rocky", label: "Rocky Road", tag: "Classic", tagTone: "accent", detail: "aurora-scoops", change: "remove" },
    { key: "bubblegum", label: "Bubblegum", tag: "Retro", tagTone: "neutral", detail: "kumo-creamery", change: "remove" },
    { key: "mint", label: "Mint Chip", tag: "Classic", tagTone: "accent", detail: "maple-orbit" },
    { key: "pistachio", label: "Pistachio", tag: "Seasonal", tagTone: "green", detail: "maple-orbit", change: "add" },
  ],
} satisfies DiffTableProps;
