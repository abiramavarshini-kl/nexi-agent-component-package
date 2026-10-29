import type { MarkdownProps } from "../primitives/Markdown";

export const markdownDemo = {
  content: `### Weekend sales recap

Pistachio led **every** day, up *23%* on last weekend. Two things stood out:

1. Saturday afternoon sold out by \`15:40\`
2. Waffle cones ran short — see the [supplier sheet](https://example.com/suppliers)

| Flavor | Scoops | Change |
| --- | --- | --- |
| Pistachio | 412 | +23% |
| Vanilla | 288 | +6% |
| Rocky Road | 141 | -11% |

> Churn pistachio first thing Saturday so it can firm up before the rush.

\`\`\`ts
await freezer.schedule({ flavor: "pistachio", at: "06:00" });
\`\`\`
`,
} satisfies MarkdownProps;
