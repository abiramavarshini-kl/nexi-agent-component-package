import { RecordsTable } from "nexi-agent";
import { recordsTableDemo } from "nexi-agent/demo";

export default function RecordsTableExample() {
  // `fill` makes the grid take its parent's height
  return (
    <div style={{ width: "100%", height: 480 }}>
      <RecordsTable {...recordsTableDemo} fill />
    </div>
  );
}
