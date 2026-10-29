import type { SearchListProps } from "../primitives/SearchList";

export const searchListDemo = {
  items: [
    "Forecast summer demand",
    "Find waffle cone suppliers",
    "Compare seasonal flavors",
    "Draft flavor launch plan",
    "Check cold-chain status",
    "Audit sugar costs",
    "Retire low sellers",
  ],
  labels: { placeholder: "Search flavors…", ariaLabel: "Search flavors" },
} satisfies SearchListProps;
