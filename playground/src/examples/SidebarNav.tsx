import { SidebarNav } from "nexi-agent";
import { sidebarNavDemo } from "nexi-agent/demo";

export default function SidebarNavExample() {
  return (
    <SidebarNav
      {...sidebarNavDemo}
      onNewChat={() => console.log("new chat")}
      onPick={(id) => console.log("open chat", id)}
    />
  );
}
