import { StreamingText } from "nexi-agent";
import { streamingTextDemo } from "nexi-agent/demo";

export default function StreamingTextExample() {
  // `content` can also be a plain string you keep appending to as tokens arrive
  return <StreamingText {...streamingTextDemo} onFollowUp={(text) => console.log("follow up", text)} />;
}
