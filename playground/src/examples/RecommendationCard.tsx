import { RecommendationCard } from "nexi-agent";

export default function RecommendationCardExample() {
  return (
    <RecommendationCard
      title="Deploy the new pricing page?"
      labels={{ alternatives: "Other plans", accepted: "Deployed" }}
      options={[
        {
          key: "now",
          body: "Ship it to 100% of traffic today.",
          short: "Ship today",
          signal: 3,
          tone: "var(--accent)",
          label: "Ready",
          cta: "Deploy",
        },
        {
          key: "ab",
          body: "Run an A/B test with 10% of traffic first.",
          short: "A/B test first",
          signal: 2,
          tone: "var(--orange)",
          label: "Safer",
          cta: "Start test",
          ctaVariant: "primary",
        },
      ]}
      onAccept={(option) => console.log("accepted", option.key)}
    />
  );
}
