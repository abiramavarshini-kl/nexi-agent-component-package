# nexi-agent

React components for AI-agent interfaces: streaming answers, thinking traces,
human-in-the-loop approvals, tool-call chips, task status, tables, a prompt bar
and more. They are built on [Beautiful UI](https://www.beautifului.dev) (MIT) and
packaged so you can install and import them instead of copy-pasting.

- **No hardcoded content.** Every component gets its words and data from
  props. Pass nothing and it renders empty. Sample content lives separately in
  `nexi-agent/demo`.
- **Customisable.** You can change the text, colours, size, dark mode and
  behaviour (see [Customising](#customising)).
- **Works anywhere React does.** React 18 or 19, with Vite, Next.js (App
  Router), Remix or CRA. Tailwind is optional.

---

## Contents

- [Install](#install)
- [Quick start](#quick-start)
- [How content works](#how-content-works)
- [Customising](#customising)
- [Components](#components)
- [Running this repo locally](#running-this-repo-locally)
- [Docker](#docker)
- [Project structure](#project-structure)
- [Publishing](#publishing)
- [License](#license)

---

## Install

The package isn't on the npm registry yet. Install it from this Git repository:

```bash
npm install github:<org>/<repo>          # e.g. github:kaaylabs/nexi-agent
# or a specific branch / tag
npm install github:<org>/<repo>#main
```

npm runs the package's `prepare` script, which builds `dist/` for you.

Once it's published to npm, this works too:

```bash
npm install nexi-agent
```

You can also use a local build, with no publishing at all:

```bash
# in this repo
npm install && npm run build && npm pack      # → nexi-agent-0.1.0.tgz
# in your app
npm install ../path/to/nexi-agent-0.1.0.tgz
```

## Quick start

```tsx
import "nexi-agent/styles.css";
import { NexiProvider, ThinkingState, StreamingText, ApprovalCard } from "nexi-agent";

export function AgentPanel() {
  return (
    <NexiProvider>
      <ThinkingState
        variant="Steps"
        done="Thought for 3 seconds"
        rows={[{ primary: "Reading the ticket" }, { primary: "Checking the logs" }]}
      />

      <StreamingText content="The deploy failed because the API key expired." />

      <ApprovalCard
        questions={[{ q: "Rotate the key now?", type: "radio", options: ["Yes", "Later"] }]}
        onSubmitted={(answers) => console.log(answers)}
      />
    </NexiProvider>
  );
}
```

To see a component with realistic content before you have your own data, spread
its demo fixture:

```tsx
import { RecordsTable } from "nexi-agent";
import { recordsTableDemo } from "nexi-agent/demo";

<RecordsTable {...recordsTableDemo} />;
```

The files in [`src/demo/`](src/demo) also show the exact shape of every
component's props.

## How content works

Every component follows the same three rules:

| Kind of text | Where it comes from | Default |
| --- | --- | --- |
| **Content** (rows, questions, messages, titles, column names, sources…) | regular props: `rows`, `questions`, `title`, `steps`… | empty |
| **UI words** (button text, aria-labels, "No results found", "Copy"…) | the `labels` prop | plain English, every key overridable |
| **Sample data** (the original Beautiful UI demo) | `nexi-agent/demo` | not used unless you import it |

Some labels are functions, so you can handle plurals or another language:

```tsx
<DiffTable
  title="Proposed changes"
  columns={["Name", "Team", "Email"]}
  rows={rows}
  labels={{
    apply: (n) => `Appliquer ${n} modification${n > 1 ? "s" : ""}`,
    toggleHint: "Cliquez pour inclure / exclure",
  }}
/>
```

## Customising

Yes, you can change the colour, size, text and behaviour of everything.

### Colours and theme

All colours are CSS variables, so you rebrand by overriding them, either
globally or on any wrapper element:

```css
:root {
  --accent: oklch(0.58 0.22 300);       /* buttons, links, focus */
  --accent-ink: oklch(0.5 0.2 300);     /* accent-coloured text */
  --accent-tint: oklch(0.95 0.03 300);  /* soft accent backgrounds */
}

/* or only for one area */
.billing-panel { --accent: #0f9d58; }
```

| Token | Used for |
| --- | --- |
| `--page`, `--canvas`, `--surface`, `--inset`, `--field` | backgrounds, from outermost to innermost |
| `--ink`, `--ink-2`, `--ink-3` | text, from strongest to faintest |
| `--line`, `--line-strong` | borders and dividers |
| `--accent`, `--green`, `--orange`, `--red` (+ `-tint`, `--accent-ink`) | status and brand colours |

There are two ways to turn on **dark mode**:

- `<NexiProvider dark>` for a subtree
- `class="dark"` on `<html>` for the whole app

**Fonts:** the design uses *Inter* and *JetBrains Mono*. Load them in your
app (for example from Google Fonts or `next/font`); otherwise the system font is
used.

### Size and layout

- Most components accept a `className`, which is added to their outer element.
  Use it for margins, width or positioning.
- Each component has a sensible maximum width (cards are about 320–440px). Put it in
  a container to control its size, or use `fill` where it's offered
  (`RecordsTable`, `SidebarNav`, `StreamingText`).
- Atoms have size and tone props, for example
  `<Badge size="sm" tone="green" variant="outline">` or `<Button size="sm" variant="accent">`.

### Text

Pass your own content props and override any UI word through `labels` (see
[How content works](#how-content-works)).

### Behaviour

Components report what the user does through callbacks, so you can connect them to
your backend. For example:

| Component | Callbacks |
| --- | --- |
| `ApprovalCard` | `onSubmitted(answers)`, `onAnswerChange(i, answer)` |
| `ChatComposer` / `PromptBar` | `onSend(text, attachments?)`, `onModelChange`, `onAttach(files)`, `onDictate()` |
| `StreamingText` | `onFollowUp(text)`, `onAction(i)`, `onDone()` |
| `SelectionActions` | `onAction(action)`: **return the rewritten text** (or a promise of it) and it streams in; `onKeep(text)`, `onDiscard()` |
| `DiffTable` | `onApply(keptRows)` |
| `RecommendationCard` | `onAccept(option)` |
| `RecordsTable` | `onSelectionChange(ids)`, `onCalculate(column)` |
| `SidebarNav` | `onNewChat`, `onPick(id)`, `onNavigate(key)`, `onWorkspaceMenu(key)`, `onFooterClick` |
| `Flowchart` | `onConditionChange(step, condition, field, value)`, `onSelect(step)` |

### Styling setup: pick one

| Your app | Import | What you get |
| --- | --- | --- |
| **No Tailwind** (or Tailwind v3) | `import "nexi-agent/styles.css"` | Precompiled CSS with every class the components use, including Tailwind's reset. |
| **Tailwind v4** | in your main CSS, after `@import "tailwindcss";`, add `@import "nexi-agent/tailwind.css";` | Your Tailwind build compiles our classes along with yours, and you can use our tokens (`bg-surface`, `text-ink-2`, `shadow-card`…) in your own markup. |

## Components

Every data type is exported (`ApprovalQuestion`, `ToolStep`, `RecordRow`…), and
so is every component's props type (`ApprovalCardProps`, `PromptBarProps`…).

### Atoms

`Badge` · `Button` · `Chip` · `EntityChip` / `Monogram` · `ProgressRing` ·
`SegmentedControl` · `Shimmer` · `StatusPill` · `StreamText` · `Switch` ·
`TextRow` · `ValuePill` · `NexiProvider`

```tsx
<Badge tone="green" dot>Completed</Badge>
<Button variant="accent" size="sm">Run</Button>
<StatusPill tone="orange">Running</StatusPill>
<ProgressRing progress={0.6} tone="accent" />
<SegmentedControl options={["Day", "Week"]} value={range} onChange={setRange} />
```

### Agent components

| Component | What it shows | Main props |
| --- | --- | --- |
| `LoadingState` | pixel-grid loader + timer | `label`, `variant` (Drive · Dots · Orbit · Surfer), `videoSrc`, `hideTimer` |
| `ThinkingState` | expandable reasoning trace | `variant` (Steps · Reasoning · Search · Coding), `rows`, `active`, `done`, `query`, `more` |
| `StreamingText` | streamed answer with citations | `content` (string or tokens), `sources`, `followUps`, `instant`, `loop` |
| `ApprovalCard` | questions before the agent acts | `questions`, `onSubmitted`, `resettable` |
| `ToolChips` | tool calls + file diffs | `title`, `steps`, `diffs`, `diffLines`, `more` |
| `TaskRows` | task status rows | `rows` (status: done · running · failed · sequence), `variant` (Capsules · List) |
| `ChatComposer` | tabbed chat panel | `messages`, `suggestions`, `initialPrompt`, `onSend` |
| `PromptBar` | composer with `@` sources, `/` commands, models | `sources`, `commands`, `models`, `defaultModel`, `onDictate`, `onSend`, `demo` |
| `RecommendationCard` | suggestion with confidence + alternatives | `title`, `options`, `onAccept` |
| `ContextCards` | retrieved RAG chunks | `title`, `count`, `chunks`, `onSourceClick` |
| `DiffTable` | proposed edits to a table | `title`, `columns`, `rows` (with `change: "remove" \| "add"`), `onApply` |
| `RecordsTable` | AI spreadsheet grid | `rows`, `labels.columns`, `tagColors`, `columnConfig`, `toolOptions`, `aiColumn` |
| `FilterTable` | status-filtered table | `rows`, `labels.columns`, `labels.status` |
| `SidebarNav` | workspace + chat navigation | `workspace`, `workspaceMenu`, `navItems`, `recents`, `footerLabel` |
| `SearchList` | command search | `items`, `onSelect`, `initialCount` |
| `Flowchart` | workflow canvas | `steps` (cards or `conditions`), `edges` |
| `InsightCards` | paged insight carousel | `title`, `pages` (each with `prose`, `card`, `pill`) |
| `InsightCompareCard` / `InsightAnomalyCard` / `InsightAllocationCard` | the charts used inside `InsightCards` (also usable on their own) | `series` / `metrics` / `segments` |
| `CodeBlock` | code listing or unified diff | `variant` (Code · Diff), `code` or `lines`, `diff`, `filename` |
| `FineTuneCard` | property inspector | `title`, `fields`, `options`, `onChange` |
| `SelectionActions` | highlight-to-rewrite bar | `text`, `actions`, `onAction` |
| `AgentScreen` | live view of the agent's screen | `agentName`, `streamSrc`, `placeholderUrl`, `onRecordStart/End` |
| `GlideMenu` | menu with a gliding hover highlight | `children` (rows marked `data-menu-row`) |

## Running this repo locally

**Prerequisites:** Node.js 20+ (22 LTS recommended) and npm 10+.

```bash
git clone <repo-url> nexi-agent
cd nexi-agent
npm install            # also builds dist/ (via "prepare")
```

| Command | What it does |
| --- | --- |
| `npm run build` | regenerates `src/index.ts`, bundles ESM + CJS + types into `dist/`, builds both CSS files |
| `npm test` | builds, then server-renders every component twice (empty and with demo data) |
| `npm run typecheck` | runs the TypeScript checks |
| `npm run playground` | builds the library and starts the gallery app at http://localhost:5173 |
| `npm pack` | creates `nexi-agent-x.y.z.tgz` so you can test-install it in another app |

### The playground

[`playground/`](playground) is a Vite app that shows every component with its
demo data, plus a dark-mode toggle and a "customise" example:

```bash
npm run playground
# or step by step
npm run build
cd playground
npm install
npm run dev           # http://localhost:5173
```

After you change something in `src/`, run `npm run build` in the repo root.
The playground picks up the new `dist/` automatically.

### Adding a component

Drop a `.tsx` file into `src/atoms` or `src/primitives`, add a matching fixture
to `src/demo` and export it from `src/demo/index.ts`, then run `npm test`. The
package's export list is regenerated on every build.

## Docker

Docker builds and tests the library, then serves the playground. You don't need
Node installed on the host.

```bash
# build and serve the playground with nginx → http://localhost:8080
docker compose up --build playground

# run it in the background / stop it
docker compose up -d --build playground
docker compose down

# Vite dev server instead → http://localhost:5173
docker compose --profile dev up --build dev
```

Without Compose:

```bash
docker build -t nexi-agent-playground .                 # default target: nginx + playground
docker run --rm -p 8080:80 nexi-agent-playground        # → http://localhost:8080

docker build --target test -t nexi-agent-test .         # build the library and run the smoke test
```

The [`Dockerfile`](Dockerfile) build stages are:

| Stage | Purpose |
| --- | --- |
| `deps` | `npm ci` for the library |
| `build` | `npm run build` produces `dist/` |
| `test` | runs the smoke test (the build fails if any component fails to render) |
| `dev` | runs the Vite dev server for the playground |
| `playground` | builds the playground as a static site |
| `web` *(default)* | nginx serving the playground on port 80 |

## Project structure

```
src/
  atoms/          small building blocks (Badge, Button, Switch…)
  primitives/     the agent components (ApprovalCard, PromptBar…)
  provider/       NexiProvider: font, colour scope, dark mode
  demo/           sample content for every component → "nexi-agent/demo"
  lib/            cn() helper and icon stand-ins
  styles/         foundation.css: design tokens, theme, keyframes
  index.ts        auto-generated export list (do not edit)
scripts/
  make-index.mjs  generates src/index.ts
  build-css.mjs   builds dist/styles.css and dist/tailwind.css
  make-foundation.py  regenerates foundation.css from upstream Beautiful UI
test/smoke.test.tsx   renders every component from the built bundle
playground/       Vite gallery app (not published)
Dockerfile, docker-compose.yml
```

## Publishing

```bash
npm login
npm publish                      # runs typecheck + build first
# scoped to your organisation instead:
#   set "name": "@kaaylabs/nexi-agent" in package.json, then
npm publish --access public      # or --access restricted for a private package (paid npm plan)
```

For releases after the first one: `npm version patch` (or `minor` / `major`), then `npm publish`.

## Changes from upstream Beautiful UI

- All demo content was moved out of the components into `src/demo` (exported as
  `nexi-agent/demo`). Components now take every word through props, and
  UI words through `labels`.
- Components gained callbacks and options needed for real use (`onApply`,
  `onAccept`, `onSelectionChange`, real file picking in `PromptBar`, async
  rewrites in `SelectionActions`, custom conditions in `Flowchart`…).
- The `InsightCards` charts are exported as standalone components.
- `SidebarNav` uses free `iconoir-react` icons instead of the commercial
  `@central-icons-react` set, which needs a paid licence key to install.
- Site-only global CSS was removed. Body typography lives on the `.nexi` scope, so
  it can't restyle your app.
- Added `Badge`, `NexiProvider` and the playground.

## License

MIT. Includes work from Beautiful UI © 2026 Shane Levine (MIT, see
`LICENSE.beautiful-ui`) and shadow-plugin © Florian Kiem (MIT).
