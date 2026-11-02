import { ContextCards } from "nexi-agent";

export default function ContextCardsExample() {
  return (
    <ContextCards
      title="All chunks"
      count={32}
      chunks={[
        {
          title: "Vendor onboarding rule",
          chars: "290 characters",
          body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
          source: "Dairy Onboarding SOP.pdf",
          badge: "PDF",
          tone: "bg-red",
        },
        {
          title: "Seasonal demand row",
          chars: "1,250 characters",
          body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
          source: "Sales Velocity Export.csv",
          badge: "CSV",
          tone: "bg-green",
        },
      ]}
    />
  );
}
