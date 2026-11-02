import { useState } from "react";
import { CodeBlock, SegmentedControl } from "nexi-agent";
import { codeBlockDemo } from "nexi-agent/demo";

export default function CodeBlockExample() {
  const [view, setView] = useState<"Code" | "Diff">("Code");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center", width: "100%" }}>
      <div style={{ width: 200 }}>
        <SegmentedControl options={["Code", "Diff"] as const} value={view} onChange={setView} />
      </div>
      {/* `lines` is a plain listing; `diff` holds the rows of a unified diff */}
      <CodeBlock {...codeBlockDemo} variant={view} />
    </div>
  );
}
