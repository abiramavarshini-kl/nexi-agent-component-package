import { InsightCards } from "nexi-agent";
import { insightCardsDemo } from "nexi-agent/demo";

export default function InsightCardsExample() {
  // InsightCompareCard, InsightAnomalyCard and InsightAllocationCard also work on their own
  return <InsightCards {...insightCardsDemo} />;
}
