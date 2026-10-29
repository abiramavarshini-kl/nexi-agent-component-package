import type { FlowchartProps } from "../primitives/Flowchart";

function ConeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11" />
      <path d="M17 7A5 5 0 0 0 7 7" />
      <path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4" />
    </svg>
  );
}

const properties = ["flavor", "topping", "size", "scoops"];

export const flowchartDemo = {
  steps: [
    {
      id: "trigger",
      row: 0,
      x: 0.5,
      w: 300,
      kind: { label: "Trigger", hue: "#9a5cff" },
      hue: "#9a5cff",
      icon: <ConeIcon />,
      title: "New order created",
      caption: "Trigger when a new order is created",
    },
    {
      id: "cond",
      row: 1,
      x: 0.5,
      w: 356,
      kind: { label: "If / Else", hue: "#f09a2f" },
      conditions: [
        {
          key: "c1",
          joiner: "If",
          source: "order",
          property: { value: "flavor", options: properties },
          operator: "is",
          value: {
            value: "Rocky Road",
            options: [
              { name: "Rocky Road", tag: "Classic" },
              { name: "Mint Chip", tag: "Classic" },
              { name: "Pistachio", tag: "Seasonal" },
              { name: "Bubblegum", tag: "Retro" },
            ],
          },
        },
        {
          key: "c2",
          joiner: "and",
          source: "order",
          property: { value: "topping", options: properties },
          operator: "is",
          value: {
            value: "Brown butter bourbon brittle crunch",
            options: [
              { name: "Brown butter bourbon brittle crunch" },
              { name: "Rainbow sprinkles" },
              { name: "Hot fudge" },
              { name: "Candied pecans" },
            ],
          },
        },
      ],
    },
  ],
} satisfies FlowchartProps;
