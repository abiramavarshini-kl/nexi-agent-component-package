import type { ComponentType } from "react";

/* Every docs page, in sidebar order. The live example and its source come from
 * src/examples/<name>.tsx; the props tables come from src/generated/props.json
 * (npm run props). To add a component: add an example file and a row here. */

export type Doc = {
  name: string;
  group: string;
  description: string;
  /** components whose props tables to show (default: [name]) */
  components?: string[];
  /** preview spans the full content width, no padding */
  wide?: boolean;
};

export const docs: Doc[] = [
  // Conversation
  { group: "Conversation", name: "MessageThread", components: ["MessageThread", "Message"], description: "The scrolling chat: user bubbles, agent turns that can hold any component, and auto-scroll." },
  { group: "Conversation", name: "StreamingText", description: "An answer revealed word by word, with inline citations, sources, action buttons and follow-ups." },
  { group: "Conversation", name: "Markdown", description: "A formatted markdown answer (headings, lists, tables, code). Safe, and works while text streams in." },
  { group: "Conversation", name: "ChatComposer", description: "A compact chat panel with tabs, replies and an input." },
  { group: "Conversation", name: "PromptBar", description: "A full input: @ sources, / commands, model picker, attachments and dictation." },
  { group: "Conversation", name: "SelectionActions", description: "Highlight text, ask the agent to rewrite it, then keep or discard the result." },
  // Agent activity
  { group: "Agent activity", name: "ThinkingState", description: "An expandable reasoning trace in four styles: Steps, Reasoning, Search and Coding." },
  { group: "Agent activity", name: "ToolChips", description: "Tool calls as compact rows, plus file-diff chips." },
  { group: "Agent activity", name: "TaskRows", description: "Tasks with running, failed and completed status." },
  { group: "Agent activity", name: "LoadingState", description: "A pixel loader with a shimmering label and a live timer." },
  { group: "Agent activity", name: "AgentScreen", description: "A live view of the agent's screen, from an image or video stream." },
  { group: "Agent activity", name: "ContextCards", description: "Retrieved document chunks (RAG) and their sources." },
  // Decisions
  { group: "Decisions", name: "ApprovalCard", description: "Questions the user answers before the agent acts — human in the loop." },
  { group: "Decisions", name: "RecommendationCard", description: "A suggested action with a confidence meter and alternatives." },
  { group: "Decisions", name: "DiffTable", description: "Proposed row additions and removals the user can accept one by one." },
  { group: "Decisions", name: "Dialog", description: "A confirm or small-form modal." },
  // Data
  { group: "Data", name: "RecordsTable", wide: true, description: "A spreadsheet-style grid with tags, sorting, resizing and AI-calculated columns." },
  { group: "Data", name: "FilterTable", description: "A table filtered by status chips." },
  {
    group: "Data",
    name: "InsightCards",
    components: ["InsightCards", "InsightCompareCard", "InsightAnomalyCard", "InsightAllocationCard"],
    description: "A carousel of insights with live charts. Each card type also works on its own.",
  },
  { group: "Data", name: "CodeBlock", description: "A code listing or a unified diff, with copy." },
  { group: "Data", name: "Flowchart", wide: true, description: "A workflow canvas with draggable step and condition cards." },
  { group: "Data", name: "UsageMeter", description: "Tokens or credits used against a limit." },
  // App shell & feedback
  { group: "App shell & feedback", name: "SidebarNav", description: "A collapsible workspace switcher, navigation and chat history." },
  { group: "App shell & feedback", name: "SearchList", description: "A command search with live filtering." },
  { group: "App shell & feedback", name: "EmptyState", description: "“Nothing here yet” and error panels." },
  { group: "App shell & feedback", name: "Toast", components: ["ToastProvider"], description: "Short notifications. Wrap your app in ToastProvider once, then call toast() from useToast()." },
  { group: "App shell & feedback", name: "FineTuneCard", description: "An inspector with draggable number fields." },
  { group: "App shell & feedback", name: "GlideMenu", description: "A menu with a highlight that glides between rows on hover." },
  // Atoms
  { group: "Atoms", name: "Avatar", description: "A person or agent picture, with an initial fallback and a status dot." },
  { group: "Atoms", name: "Badge", description: "A small label in five tones, soft or outlined." },
  { group: "Atoms", name: "Button", description: "Buttons in six variants and three sizes. Takes every native button attribute." },
  { group: "Atoms", name: "Chip", description: "A monospace token for code values like updated_at." },
  { group: "Atoms", name: "EntityChip", components: ["EntityChip", "Monogram"], description: "An inline reference to a person, team or company, and the Monogram mark it uses." },
  { group: "Atoms", name: "ProgressRing", description: "A small progress ring with optional content in the centre." },
  { group: "Atoms", name: "SegmentedControl", description: "Equal-width segments with a sliding thumb." },
  { group: "Atoms", name: "Shimmer", description: "A shimmering label that signals the agent is working." },
  { group: "Atoms", name: "StatusPill", description: "A run or task status with a coloured dot." },
  { group: "Atoms", name: "StreamText", description: "Text revealed character by character with a soft blurred edge and a caret." },
  { group: "Atoms", name: "Switch", description: "An on/off toggle." },
  { group: "Atoms", name: "TextRow", description: "A label-left, value-right row for cards and inspectors." },
  { group: "Atoms", name: "Tooltip", description: "A hint shown on hover and focus." },
  { group: "Atoms", name: "ValuePill", description: "An inline value (a date, a name, a count) set off in running text." },
];

export const groups = [...new Set(docs.map((d) => d.group))];

export const slugOf = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export const docBySlug = (slug: string) => docs.find((d) => slugOf(d.name) === slug);

const exampleModules = import.meta.glob<{ default: ComponentType }>("./examples/*.tsx", { eager: true });
const exampleSources = import.meta.glob<string>("./examples/*.tsx", { eager: true, query: "?raw", import: "default" });
const demoSources = import.meta.glob<string>("../../src/demo/*.{ts,tsx}", { eager: true, query: "?raw", import: "default" });

export const exampleOf = (name: string) => exampleModules[`./examples/${name}.tsx`]?.default;

export const exampleSourceOf = (name: string) => exampleSources[`./examples/${name}.tsx`]?.trimEnd() ?? "";

/** the "nexi-agent/demo" fixture an example spreads in, shown as it would be imported from the package */
export function demoSourceOf(name: string) {
  const source = exampleSourceOf(name);
  if (!source.includes('"nexi-agent/demo"')) return null;
  const entry = Object.entries(demoSources).find(([path]) => /\/(\w+)\.tsx?$/.exec(path)?.[1] === name);
  return entry ? entry[1].replace(/from "\.\.\/(?:primitives|atoms)\/\w+"/g, 'from "nexi-agent"').trimEnd() : null;
}
