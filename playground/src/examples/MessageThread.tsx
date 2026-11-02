import { Markdown, MessageThread, ThinkingState } from "nexi-agent";

export default function MessageThreadExample() {
  // give it a height (e.g. a flex parent) and it scrolls, pinned to the newest message
  return (
    <MessageThread
      messages={[
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
          content: <Markdown content={"Pistachio led **every** day — up *23%* on last weekend."} />,
        },
        { id: "5", role: "user", content: "Order more waffle cones for next weekend." },
      ]}
    />
  );
}
