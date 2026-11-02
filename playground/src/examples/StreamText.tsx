import { useState } from "react";
import { Button, StreamText } from "nexi-agent";

export default function StreamTextExample() {
  const [run, setRun] = useState(0);
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "start", maxWidth: 420 }}>
      <StreamText
        key={run}
        caret
        text="The deploy failed because the API key expired. I rotated it and re-ran the pipeline — all 34 checks pass now."
      />
      <Button size="sm" onClick={() => setRun((n) => n + 1)}>Replay</Button>
    </div>
  );
}
