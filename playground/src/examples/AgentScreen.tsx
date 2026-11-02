import { AgentScreen } from "nexi-agent";

export default function AgentScreenExample() {
  // pass `src` (an image or video stream URL) to show the agent's live screen
  return <AgentScreen agentName="Scout" placeholderUrl="hunter.io/try/search/ugly.cash" />;
}
