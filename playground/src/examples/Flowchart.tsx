import { Flowchart } from "nexi-agent";
import { flowchartDemo } from "nexi-agent/demo";

export default function FlowchartExample() {
  // drag the cards around; the "Sample data" tab shows the node and edge shape
  return <Flowchart {...flowchartDemo} />;
}
