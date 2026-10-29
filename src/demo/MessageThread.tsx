import Markdown from "../primitives/Markdown";
import ThinkingState from "../primitives/ThinkingState";
import type { MessageThreadProps } from "../primitives/MessageThread";

export const messageThreadDemo = {
  messages: [
    { id: "1", role: "system", content: "Today" },
    { id: "2", role: "user", content: "How did pistachio do this weekend?" },
    {
      id: "3",
      role: "assistant",
      name: "Scout",
      time: "2:41 PM",
      content: (
        <ThinkingState
          variant="Steps"
          done="Thought for 2 seconds"
          rows={[{ primary: "Reading POS export" }, { primary: "Comparing to last weekend" }]}
        />
      ),
    },
    {
      id: "4",
      role: "assistant",
      name: "Scout",
      content: <Markdown content={"Pistachio led **every** day — up *23%* on last weekend, and it sold out by `15:40` on Saturday."} />,
    },
    { id: "5", role: "user", content: "Order more waffle cones for next weekend." },
  ],
} satisfies MessageThreadProps;
