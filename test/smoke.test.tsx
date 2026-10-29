// Server-renders every exported component from the BUILT bundle, failing on any
// thrown error. Each component renders twice:
//   empty — no props at all (components must not depend on built-in content)
//   demo  — with its fixture from nexi-agent/demo (must produce real markup)
// Run: npm test (builds first)
import { renderToString } from "react-dom/server";
import { createElement, type ComponentType } from "react";
import * as Nexi from "../dist/index.js";
import * as Demo from "../dist/demo.js";

/* props the atoms need to render anything meaningful */
const atomProps: Record<string, Record<string, unknown>> = {
  Badge: { tone: "green", dot: true, children: "Badge" },
  StatusPill: { children: "Status" },
  ValuePill: { children: "Value" },
  Chip: { children: "Chip" },
  Button: { children: "Button" },
  NexiProvider: { children: "Provider" },
  EntityChip: { name: "Nexus" },
  Monogram: { children: "N" },
  ProgressRing: { progress: 0.6 },
  SegmentedControl: { options: ["One", "Two"], value: "One", onChange: () => {} },
  Switch: { checked: true, onChange: () => {} },
  StreamText: { text: "Hello from nexi-agent" },
  TextRow: { label: "Label", value: "Value" },
  Shimmer: { children: "Working" },
  GlideMenu: { children: createElement("button", { "data-menu-row": true }, "Row") },
  Avatar: { name: "Nexus", status: "online" },
  Tooltip: { content: "Hint", children: createElement("button", null, "Hover me") },
  Message: { role: "assistant", name: "Agent", content: "Hello" },
  ToastProvider: { children: createElement("span", null, "app") },
};

/* component name → demo fixture export (camelCase + "Demo") */
const demoFor = (name: string) =>
  (Demo as Record<string, unknown>)[`${name[0].toLowerCase()}${name.slice(1)}Demo`] as
    | Record<string, unknown>
    | undefined;

/* exports that aren't components */
const skip = new Set(["cn", "badgeVariants", "buttonVariants", "toStreamingTokens", "RECORD_TAG_PALETTE", "useToast"]);
/* portal components render nothing on the server; just check they don't throw */
const clientOnly = new Set(["Dialog"]);
/* sub-components rendered through their parent's demo */
const viaParent = new Set(["InsightCompareCard", "InsightAnomalyCard", "InsightAllocationCard", "InsightEntity", "InsightMono"]);

let pass = 0;
const failures: string[] = [];

function check(label: string, render: () => string, minLength: number) {
  try {
    const html = render();
    if (html.length < minLength) throw new Error(`rendered only ${html.length} chars`);
    pass++;
    console.log(`  ✓ ${label.padEnd(30)} ${html.length} chars`);
  } catch (e) {
    failures.push(`${label}: ${(e as Error).message.split("\n")[0]}`);
    console.log(`  ✗ ${label}`);
  }
}

for (const [name, value] of Object.entries(Nexi)) {
  if (skip.has(name) || viaParent.has(name) || typeof value !== "function") continue;
  const component = value as ComponentType<any>;

  if (atomProps[name]) {
    check(name, () => renderToString(createElement(component, atomProps[name])), 10);
    continue;
  }

  // must not crash without content (null / empty markup is fine)
  check(`${name} (empty)`, () => renderToString(createElement(component)), 0);

  const demo = demoFor(name);
  if (!demo) {
    failures.push(`${name}: no demo fixture in src/demo`);
    console.log(`  ✗ ${name} (no demo fixture)`);
    continue;
  }
  check(`${name} (demo)`, () => renderToString(createElement(component, demo)), clientOnly.has(name) ? 0 : 40);
}

// the error flavour of EmptyState
check("EmptyState (error)", () => renderToString(createElement(Nexi.EmptyState, Demo.errorStateDemo)), 40);

// every ThinkingState variant has its own fixture
for (const [variant, props] of Object.entries(Demo.thinkingStateDemos)) {
  check(`ThinkingState ${variant}`, () => renderToString(createElement(Nexi.ThinkingState, props)), 40);
}

console.log(`\n${pass} rendered, ${failures.length} failed`);
if (failures.length) {
  console.log(failures.join("\n"));
  process.exit(1);
}
