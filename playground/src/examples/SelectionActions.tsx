import { SelectionActions } from "nexi-agent";
import { selectionActionsDemo } from "nexi-agent/demo";

export default function SelectionActionsExample() {
  // highlight some text, pick an action, then keep or discard the rewrite
  return <SelectionActions {...selectionActionsDemo} />;
}
