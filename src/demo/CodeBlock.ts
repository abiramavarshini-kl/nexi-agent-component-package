import type { CodeBlockProps } from "../primitives/CodeBlock";

export const codeBlockDemo = {
  filename: "churn.ts",
  lines: [
    "export async function churnBatch() {",
    '  const flavor = await getFlavor("pistachio");',
    "  const base = await dairy.fetch({ flavor });",
    '  await freezer.store(base, { temp: "-16C" });',
    "  if (!base.approved) return null;",
    "  return base.gallons;",
    "}",
  ],
  diff: [
    { old: 1, cur: 1, type: "ctx", pieces: [{ text: "export async function churnBatch() {" }] },
    { old: 2, cur: 2, type: "ctx", pieces: [{ text: '  const flavor = await getFlavor("pistachio");' }] },
    { old: 3, cur: 3, type: "ctx", pieces: [{ text: "  const base = await dairy.fetch({ flavor });" }] },
    { old: 4, cur: null, type: "del", pieces: [{ text: "  await freezer.store(base, { temp: " }, { text: '"-14C"', change: "del" }, { text: " });" }] },
    { old: null, cur: 4, type: "add", pieces: [{ text: "  await freezer.store(base, { temp: " }, { text: '"-16C"', change: "add" }, { text: " });" }] },
    { old: null, cur: 5, type: "add", pieces: [{ text: "  if (!base.approved) return null;" }] },
    { old: 5, cur: 6, type: "ctx", pieces: [{ text: "  return base.gallons;" }] },
    { old: 6, cur: 7, type: "ctx", pieces: [{ text: "}" }] },
  ],
} satisfies CodeBlockProps;
