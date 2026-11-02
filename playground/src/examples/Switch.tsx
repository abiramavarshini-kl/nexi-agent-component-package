import { useState } from "react";
import { Switch } from "nexi-agent";

export default function SwitchExample() {
  const [autoApprove, setAutoApprove] = useState(true);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
      <Switch checked={autoApprove} onChange={setAutoApprove} label="Auto-approve small edits" />
      Auto-approve small edits ({autoApprove ? "on" : "off"})
    </label>
  );
}
