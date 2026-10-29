import type { ThinkingStateProps } from "../primitives/ThinkingState";

/** One fixture per ThinkingState variant. */
export const thinkingStateDemos = {
  Steps: {
    variant: "Steps",
    done: "Thought for 4 seconds",
    rows: [
      { primary: "Reading flavor briefs" },
      { primary: "Scanning supplier lists" },
      { primary: "Comparing tasting notes", secondary: "6 flavors" },
      { primary: "Writing the scoop report" },
    ],
  },
  Reasoning: {
    variant: "Reasoning",
    done: "Thought for 4 seconds",
    rows: [
      { primary: "Summer demand spikes for stone-fruit flavors — peach and apricot lead." },
      { primary: "I should check cone inventory before promoting a waffle-bowl special." },
    ],
  },
  Search: {
    variant: "Search",
    query: "best waffle cone supplier",
    more: "+7 more",
    rows: [
      { primary: "Joy Cone", secondary: "joycone.com", href: "https://joycone.com/fs_products/waffle-cones/" },
      { primary: "WebstaurantStore", secondary: "webstaurantstore.com", href: "https://www.webstaurantstore.com/ice-cream-shop-supplies.html" },
      { primary: "The Konery", secondary: "thekonery.com", href: "https://www.thekonery.com/" },
    ],
  },
  Coding: {
    variant: "Coding",
    done: "Ran 3 tools",
    rows: [
      { primary: "Read", secondary: "flavors.ts", mono: true },
      { primary: "Edit", secondary: "ChurnSchedule.tsx", mono: true, add: 74, del: 41 },
      { primary: "Run", secondary: "npm run freeze", mono: true },
    ],
  },
} satisfies Record<string, ThinkingStateProps>;

export const thinkingStateDemo = thinkingStateDemos.Steps;
