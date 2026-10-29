# nexi-agent

**React components for building AI-agent interfaces:** chat threads, streaming
answers, reasoning traces, tool calls, approvals, task progress, data tables and
more. You install them, import them, and pass in your own data.

```tsx
<ThinkingState done="Thought for 3 seconds" rows={[{ primary: "Reading the ticket" }]} />
<StreamingText content="The deploy failed because the API key expired." />
<ApprovalCard questions={[{ q: "Rotate the key now?", type: "radio", options: ["Yes", "Later"] }]} />
```

- **43 components:** all 33 from [Beautiful UI](https://www.beautifului.dev), plus 10
  more (chat thread, markdown, dialog, toast, avatar…).
- **No hardcoded content.** Every word and every row comes from your props.
- **Fully themeable** through CSS variables, with dark mode built in.
- **Works in any React 18/19 app** (Vite, Next.js App Router, Remix, CRA). Tailwind
  is optional.
- **TypeScript-first.** Every component, prop and data type is exported.

---

## Table of contents

1. [Quick start](#1-quick-start)
2. [Setup](#2-setup)
3. [What's inside](#3-whats-inside)
4. [How to use the components](#4-how-to-use-the-components)
5. [Recipes](#5-recipes)
6. [Customising](#6-customising)
7. [Working on this repo](#7-working-on-this-repo)
8. [Docker](#8-docker)
9. [Releasing](#9-releasing)
10. [Troubleshooting](#10-troubleshooting)
11. [Credits and license](#11-credits-and-license)

---

## 1. Quick start

```bash
npm install github:abiramavarshini-kl/nexi-agent-packages
```

```tsx
// main.tsx (or your root layout)
import "nexi-agent/styles.css";
import { NexiProvider } from "nexi-agent";

root.render(
  <NexiProvider>
    <App />
  </NexiProvider>,
);
```

```tsx
// anywhere inside
import { StreamingText } from "nexi-agent";

<StreamingText content="Hello! I'm your agent." />;
```

That's all. To see every component with sample data first, run the
[playground](#the-playground).

---

## 2. Setup

### Requirements

- React **18 or 19** (`react` and `react-dom` are peer dependencies)
- Node **20+** to build this repo (22 LTS recommended)

### Install

| From | Command | When |
| --- | --- | --- |
| **Git** | `npm install github:abiramavarshini-kl/nexi-agent-packages` (add `#main` or `#v0.1.0` to pin) | the normal way, until it's on npm. npm builds the package on install. |
| **npm** | `npm install nexi-agent` | once it's published |
| **A local file** | in this repo: `npm run build && npm pack`, then in your app: `npm install ../path/nexi-agent-0.1.0.tgz` | testing unreleased changes in another app |

### Styles: pick one

| Your app | Add this | Result |
| --- | --- | --- |
| **No Tailwind** (or Tailwind v3) | `import "nexi-agent/styles.css";` once, at the root | precompiled CSS with everything the components need |
| **Tailwind v4** | in your main CSS, after `@import "tailwindcss";`: `@import "nexi-agent/tailwind.css";` | one combined build; you can also use our tokens (`bg-surface`, `text-ink-2`, `shadow-card`…) in your own markup |

### The provider

Wrap your UI in `<NexiProvider>` once. It applies the font, text size and colour
scope (the `.nexi` class) without touching the rest of your page.

```tsx
<NexiProvider>…</NexiProvider>          // light
<NexiProvider dark>…</NexiProvider>     // dark, for this subtree
<NexiProvider contents>…</NexiProvider> // no wrapper box (display: contents)
```

### Fonts (optional)

The design uses **Inter** and **JetBrains Mono**. Load them in your app (Google
Fonts or `next/font`); otherwise the system fonts are used.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

### Next.js

It works out of the box: the bundle is marked `"use client"`, so you can import
components straight into App Router pages. Put the CSS import in `app/layout.tsx`.

---

## 3. What's inside

### Conversation

| Component | What it shows |
| --- | --- |
| `MessageThread` / `Message` | the scrolling chat: user bubbles, agent turns that can hold any component, auto-scroll |
| `StreamingText` | an answer revealed word by word, with inline citations, sources, action buttons and follow-ups |
| `Markdown` | a formatted markdown answer (headings, lists, tables, code); safe, and works while text streams in |
| `ChatComposer` | a compact chat panel with tabs, replies and an input |
| `PromptBar` | a full input: `@` sources, `/` commands, model picker, attachments, dictation |
| `SelectionActions` | highlight text → ask the agent to rewrite it → keep or discard |

### Agent activity

| Component | What it shows |
| --- | --- |
| `ThinkingState` | an expandable reasoning trace (Steps · Reasoning · Search · Coding) |
| `ToolChips` | tool calls as compact rows, plus file-diff chips |
| `TaskRows` | tasks with running / failed / completed status |
| `LoadingState` | a pixel loader with shimmering label and live timer |
| `AgentScreen` | a live view of the agent's screen (image or video stream) |
| `ContextCards` | retrieved document chunks (RAG) and their sources |

### Decisions

| Component | What it shows |
| --- | --- |
| `ApprovalCard` | questions the user answers before the agent acts (human in the loop) |
| `RecommendationCard` | a suggested action with a confidence meter and alternatives |
| `DiffTable` | proposed row additions and removals the user can accept one by one |
| `Dialog` | a confirm or small-form modal |

### Data

| Component | What it shows |
| --- | --- |
| `RecordsTable` | a spreadsheet-style grid: tags, sorting, resizing, AI-calculated columns |
| `FilterTable` | a table filtered by status chips |
| `InsightCards` | a carousel of insights with live charts (`InsightCompareCard`, `InsightAnomalyCard`, `InsightAllocationCard` also work alone) |
| `CodeBlock` | a code listing or unified diff, with copy |
| `Flowchart` | a workflow canvas with draggable step and condition cards |
| `UsageMeter` | tokens or credits used against a limit |

### App shell and feedback

| Component | What it shows |
| --- | --- |
| `SidebarNav` | collapsible workspace switcher, navigation and chat history |
| `SearchList` | a command search with live filtering |
| `EmptyState` | "nothing here yet" or error panels |
| `ToastProvider` / `useToast` | short notifications |
| `FineTuneCard` | an inspector with draggable number fields |
| `GlideMenu` | a menu with a gliding hover highlight |

### Atoms (small building blocks)

`Avatar` · `Badge` · `Button` · `Chip` · `EntityChip` · `Monogram` ·
`ProgressRing` · `SegmentedControl` · `Shimmer` · `StatusPill` · `StreamText` ·
`Switch` · `TextRow` · `Tooltip` · `ValuePill` · `NexiProvider`

```tsx
<Badge tone="green" dot>Completed</Badge>
<Button variant="accent" size="sm">Run</Button>
<StatusPill tone="orange">Running</StatusPill>
<Avatar name="Maya Chen" src={photo} status="online" />
<Tooltip content="Copy answer"><button>…</button></Tooltip>
<SegmentedControl options={["Day", "Week"]} value={range} onChange={setRange} />
```

---

## 4. How to use the components

Every component follows the same four conventions. Once you know them, you know
the whole library.

### ① Content comes from props, and nothing is built in

A component without props renders empty, never with placeholder text. Pass your
data:

```tsx
<TaskRows
  rows={[
    { key: "fetch", label: "Fetch invoices", amount: "42 files", status: "done", details: [] },
    { key: "match", label: "Match payments", amount: "38 rows", status: "running", step: 2, details: [] },
  ]}
/>
```

### ② UI words go in `labels`

Button text, aria-labels and messages like "No results found" have English
defaults. Override any of them, for wording or translation. Some are functions,
so you can handle plurals:

```tsx
<DiffTable
  rows={rows}
  labels={{
    apply: (n) => `Apply ${n} edit${n === 1 ? "" : "s"}`,
    toggleHint: "Click a row to include or exclude it",
  }}
/>
```

### ③ User actions come back as callbacks

| Component | Callbacks |
| --- | --- |
| `PromptBar`, `ChatComposer` | `onSend(text, attachments)`, `onModelChange`, `onAttach(files)`, `onDictate()` |
| `ApprovalCard` | `onSubmitted(answers)`, `onAnswerChange` |
| `StreamingText` | `onFollowUp(text)`, `onAction(i)`, `onDone()` |
| `SelectionActions` | `onAction(action)`: return the rewritten text (or a promise of it); `onKeep`, `onDiscard` |
| `DiffTable` | `onApply(keptRows)` |
| `RecommendationCard` | `onAccept(option)` |
| `RecordsTable` | `onSelectionChange(ids)`, `onCalculate(column)` |
| `SidebarNav` | `onNewChat`, `onPick(id)`, `onNavigate(key)`, `onWorkspaceMenu(key)` |
| `Dialog` | `onConfirm()` (async is fine; return `false` to keep it open), `onOpenChange` |
| `Flowchart` | `onConditionChange`, `onSelect` |
| `Markdown` | `onLinkClick(href)`, `onCopyCode(code)` |

### ④ Sample data lives in `nexi-agent/demo`

Each component has a ready-made fixture, which is useful for prototyping and for
seeing what shape the props take:

```tsx
import { RecordsTable } from "nexi-agent";
import { recordsTableDemo } from "nexi-agent/demo";

<RecordsTable {...recordsTableDemo} />;
```

Fixture names are the component name in camelCase plus `Demo` (`approvalCardDemo`,
`promptBarDemo`…). Read them in [`src/demo/`](src/demo). Nothing from `demo` reaches
your bundle unless you import it.

### Types

All props and data types are exported:

```ts
import type { ApprovalQuestion, ToolStep, RecordRow, PromptBarProps, ThreadMessage } from "nexi-agent";
```

---

## 5. Recipes

### A complete chat screen

```tsx
import { useState } from "react";
import { EmptyState, LoadingState, Markdown, MessageThread, PromptBar, type ThreadMessage } from "nexi-agent";

export function Chat() {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text }]);
    setBusy(true);
    const reply = await askAgent(text); // your API
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", name: "Agent", content: <Markdown content={reply} /> }]);
    setBusy(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: 720, margin: "0 auto" }}>
      <MessageThread
        className="flex-1"
        messages={messages}
        empty={<EmptyState title="Ask anything" description="Answers show up here." />}
        footer={busy && <LoadingState label="Thinking" />}
      />
      <PromptBar onSend={send} placeholder="Message the agent…" />
    </div>
  );
}
```

### Streaming an answer as it arrives

Keep appending to a string. Both `Markdown` and `StreamingText` handle partial
text.

```tsx
const [answer, setAnswer] = useState("");

const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ prompt }) });
const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  setAnswer((a) => a + value);
}

<Markdown content={answer} />;                 // formatted
<StreamingText content={answer} fill />;       // word-by-word reveal + sources / follow-ups
```

### Showing the agent's work

```tsx
<ThinkingState
  variant="Steps"
  active="Working"
  done="Finished in 6s"
  rows={steps.map((s) => ({ primary: s.title, secondary: s.detail }))}
/>

<ToolChips
  steps={[
    { icon: "read", label: "Read file", chip: "invoices.csv", mono: true, detail: [{ text: "1,204 rows" }] },
    { icon: "run", label: "Run", chip: "npm test", mono: true, detail: [{ text: "✓ 34 passed" }] },
  ]}
/>
```

### Asking before acting

```tsx
<ApprovalCard
  questions={[
    { q: "Send the reminder emails?", type: "radio", options: ["Send now", "Schedule for 9am"] },
    { q: "Who should get them?", type: "check", options: ["Overdue", "Due this week"] },
  ]}
  onSubmitted={(answers) => agent.resume(answers)}
/>
```

### Confirm and notify

```tsx
// once, near the root
<ToastProvider>
  <App />
</ToastProvider>

// in any component
const { toast } = useToast();
const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete this run?"
  description="Its logs and outputs will be removed."
  destructive
  labels={{ confirm: "Delete" }}
  onConfirm={async () => {
    await deleteRun(id);
    toast({ title: "Run deleted", tone: "success" });
  }}
/>
```

---

## 6. Customising

### Colours

Every colour is a CSS variable. Override them globally or for any section:

```css
:root {
  --accent: oklch(0.58 0.22 300);       /* buttons, links, focus */
  --accent-ink: oklch(0.5 0.2 300);     /* accent-coloured text */
  --accent-tint: oklch(0.95 0.03 300);  /* soft accent backgrounds */
}

.billing { --accent: #0f9d58; }         /* only inside .billing */
```

| Token | Controls |
| --- | --- |
| `--page` `--canvas` `--surface` `--inset` `--field` | backgrounds, from the page down to inputs |
| `--ink` `--ink-2` `--ink-3` | text: primary, secondary, muted |
| `--line` `--line-strong` | borders and dividers |
| `--accent` `--green` `--orange` `--red` (+ `-tint`) | brand and status colours |
| `--tooltip-bg` `--tooltip-fg` | tooltips and chart labels |

### Dark mode

Use `<NexiProvider dark>`, or put `class="dark"` on `<html>` to follow your app's
own theme switch.

### Size and spacing

- Most components accept `className` for margins, width and positioning.
- Cards have a sensible maximum width (about 320–440px); wrap them to size them.
  `RecordsTable`, `SidebarNav` and `StreamingText` also accept `fill` to take the
  parent's size.
- Atoms take `size` / `tone` / `variant`: `<Badge size="sm" tone="red" variant="outline">`,
  `<Button size="xs" variant="quiet">`, `<Avatar size="lg" square>`.

### Wording and language

Use the `labels` prop on any component (see [②](#-ui-words-go-in-labels)).

---

## 7. Working on this repo

### Get going

```bash
git clone https://github.com/abiramavarshini-kl/nexi-agent-packages.git nexi-agent
cd nexi-agent
npm install            # installs and builds dist/
npm run playground     # opens the gallery at http://localhost:5173
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | builds `dist/`: ESM + CJS bundles, type files, `styles.css`, `tailwind.css` |
| `npm test` | builds, then renders every component twice: empty, and with demo data |
| `npm run typecheck` | runs the TypeScript checks |
| `npm run playground` | builds, then starts the playground dev server |
| `npm pack` | creates the `.tgz` file to test-install in another app |

### The playground

[`playground/`](playground) is a Vite app that shows every component with its demo
data, a dark-mode toggle and a customisation example. It uses the built `dist/`, so
after editing `src/`, run `npm run build` and the playground updates.

### Day-to-day workflow

```bash
# 1. edit src/…
npm test                 # 2. build + check every component renders
git add -A && git commit -m "…"
git push                 # dist/ and .tgz files are git-ignored; no packing needed
```

You only need `npm pack` to try the package in a separate app.

### Project structure

```
src/
  atoms/            small building blocks (Badge, Button, Avatar, Tooltip…)
  primitives/       the main components (ApprovalCard, PromptBar, MessageThread…)
  provider/         NexiProvider
  demo/             sample data for every component  → "nexi-agent/demo"
  lib/              cn() class helper, icon shims
  styles/           foundation.css: design tokens, theme, animations
  index.ts          generated export list (don't edit by hand)
scripts/
  make-index.mjs    regenerates src/index.ts on every build
  build-css.mjs     builds dist/styles.css and dist/tailwind.css
  make-foundation.py  regenerates foundation.css from upstream Beautiful UI
test/smoke.test.tsx render test for every component
playground/         Vite gallery app (not published)
```

### Adding a component

1. Create `src/primitives/MyThing.tsx` with `export default function MyThing(props)`,
   or `src/atoms/MyThing.tsx` with a named export.
2. Follow the conventions: content props default to empty, UI words go in
   `labels`, user actions go out through callbacks, the outer element accepts
   `className`, and you export a `MyThingProps` type.
3. Add `src/demo/MyThing.ts` exporting `myThingDemo`, and re-export it from
   `src/demo/index.ts`.
4. Add it to `playground/src/App.tsx`.
5. Run `npm test`. The export list regenerates automatically, and the test fails
   if the component has no demo fixture or crashes.

---

## 8. Docker

Docker builds and tests the library, then serves the playground. You don't need
Node on the host.

```bash
docker compose up --build playground             # nginx gallery → http://localhost:8080
docker compose up -d --build playground          # same, in the background
docker compose down                              # stop

docker compose --profile dev up --build dev      # Vite dev server → http://localhost:5173
```

Without Compose:

```bash
docker build -t nexi-agent-playground .
docker run --rm -p 8080:80 nexi-agent-playground        # → http://localhost:8080

docker build --target test -t nexi-agent-test .         # build + smoke test only
```

| Dockerfile stage | Purpose |
| --- | --- |
| `deps` | installs dependencies |
| `build` | builds `dist/` |
| `test` | runs the smoke test (the build fails if a component breaks) |
| `dev` | playground dev server |
| `playground` | builds the playground as static files |
| `web` *(default)* | nginx serving the playground on port 80 |

---

## 9. Releasing

**Via Git** (what teammates install with `npm install github:abiramavarshini-kl/nexi-agent-packages`):

```bash
npm version patch        # 0.1.0 → 0.1.1; use minor / major for bigger changes
git push --follow-tags   # teammates pin with  github:abiramavarshini-kl/nexi-agent-packages#v0.1.1
```

**Via npm:**

```bash
npm login
npm publish                       # runs typecheck + build first
# scoped to your organisation: set "name": "@kaaylabs/nexi-agent", then
npm publish --access public       # or --access restricted (paid npm plan)
```

A version number can't be published twice. Bump it with `npm version` each time.

---

## 10. Troubleshooting

| Problem | Fix |
| --- | --- |
| Components appear unstyled | Import `nexi-agent/styles.css` once at the root (or `tailwind.css` for Tailwind v4 apps). |
| A component renders empty | That's by design: pass your content props, or spread its fixture from `nexi-agent/demo`. |
| `Invalid hook call` / two copies of React | Make sure your app has a single React. With a linked local package, add `resolve: { dedupe: ["react", "react-dom"] }` to your Vite config. |
| Your app still shows old behaviour after reinstalling a `.tgz` | The version didn't change, so npm reused its cache. Delete `node_modules/nexi-agent` and install again. |
| `useToast must be used inside <ToastProvider>` | Wrap your app (or that part of it) in `<ToastProvider>`. |
| Fonts look different from the screenshots | Load Inter and JetBrains Mono (see [Fonts](#fonts-optional)). |
| `npm run build` fails on Windows | Use Node 20+ and run from the repo root. The build scripts are written to work on Windows. |

---

## 11. Credits and license

MIT © Kaaylabs.

The components are adapted from [Beautiful UI](https://www.beautifului.dev) © 2026
Shane Levine (MIT, see `LICENSE.beautiful-ui`), with shadow styles from
shadow-plugin © Florian Kiem (MIT).

**Changes from upstream:** all demo content moved out of the components into
`nexi-agent/demo`. Every component takes its text through props and `labels` and
reports actions through callbacks. The commercial icon set was replaced with free
`iconoir-react` icons, and global page styles were scoped to `.nexi`. Added:
`Avatar`, `Badge`, `Tooltip`, `NexiProvider`, `MessageThread`, `Markdown`,
`EmptyState`, `Dialog`, `ToastProvider`, `UsageMeter` and the playground.
