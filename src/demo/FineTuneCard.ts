import type { FineTuneCardProps } from "../primitives/FineTuneCard";

export const fineTuneCardDemo = {
  title: "Flavor card",
  fields: [
    { key: "width", label: "W", value: 324, min: 40, max: 999 },
    { key: "height", label: "H", value: 96, min: 24, max: 999 },
    { key: "radius", label: "Radius", value: 28, min: 0, max: 64 },
    { key: "opacity", label: "Opacity", value: 100, min: 0, max: 100, suffix: "%" },
  ],
  options: ["Seasonal", "Classic", "Limited"],
} satisfies FineTuneCardProps;
