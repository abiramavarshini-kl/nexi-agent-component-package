import type { ChatComposerProps } from "../primitives/ChatComposer";

export const chatComposerDemo = {
  initialPrompt: "Compare mint chip to last summer",
  suggestions: ["Flavors", "Suppliers"],
  messages: [
    { label: "Sales History", sub: "Flavor Data", time: "4s", body: "Pulled 3 summers of mint chip sales for comparison." },
    { label: "Comparison", sub: "Trend Detection", time: "2s", body: "Mint chip is up 12% with stronger weekend peaks." },
  ],
  labels: { placeholder: "Prompt or tag a flavor with @" },
} satisfies ChatComposerProps;
