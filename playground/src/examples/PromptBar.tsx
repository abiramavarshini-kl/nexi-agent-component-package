import { PromptBar } from "nexi-agent";
import { promptBarDemo } from "nexi-agent/demo";

export default function PromptBarExample() {
  // type @ for sources and / for commands
  return <PromptBar {...promptBarDemo} onSend={(text, files) => console.log("send", text, files)} />;
}
