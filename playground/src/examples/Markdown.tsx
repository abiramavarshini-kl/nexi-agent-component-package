import { Markdown } from "nexi-agent";

const answer = [
  "### Weekend sales recap",
  "",
  "Pistachio led **every** day, up *23%* on last weekend:",
  "",
  "1. Saturday afternoon sold out by `15:40`",
  "2. Waffle cones ran short — see the [supplier sheet](https://example.com/suppliers)",
  "",
  "| Flavor | Scoops | Change |",
  "| --- | --- | --- |",
  "| Pistachio | 412 | +23% |",
  "| Vanilla | 288 | +6% |",
  "",
  "> Churn pistachio first thing Saturday so it can firm up before the rush.",
].join("\n");

export default function MarkdownExample() {
  // safe to render while the text is still streaming in
  return <Markdown content={answer} />;
}
