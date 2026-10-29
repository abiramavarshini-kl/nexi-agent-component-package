import { ChatBubbleQuestion, EmojiSatisfied, Scissor, Spark, TextBox } from "iconoir-react";
import type { SelectionActionsProps } from "../primitives/SelectionActions";

const icon = { width: 14, height: 14, strokeWidth: 1.8, "aria-hidden": true } as const;

export const selectionActionsDemo = {
  text: {
    lead: "Pistachio holds the top slot all weekend. ",
    original: "Churn it first thing Saturday so the batch has time to firm up before the afternoon rush.",
    rewrite: "Churn pistachio first thing Saturday so the batch has time to fully firm before the afternoon rush.",
  },
  actions: {
    primary: [
      { id: "Explain", icon: <ChatBubbleQuestion {...icon} /> },
      { id: "Improve", icon: <Spark {...icon} />, action: "Improve", busyLabel: "Improving" },
    ],
    more: [
      { id: "Shorten", icon: <Scissor {...icon} />, action: "Shorten", busyLabel: "Shortening" },
      { id: "Tone", icon: <EmojiSatisfied {...icon} />, action: "Change tone", busyLabel: "Changing tone" },
      { id: "Grammar", icon: <TextBox {...icon} />, action: "Fix grammar" },
    ],
  },
} satisfies SelectionActionsProps;
