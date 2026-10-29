import { useState, type ReactNode } from "react";
import {
  AgentScreen,
  ApprovalCard,
  Badge,
  Button,
  ChatComposer,
  Chip,
  CodeBlock,
  ContextCards,
  DiffTable,
  EntityChip,
  FilterTable,
  FineTuneCard,
  Flowchart,
  InsightCards,
  LoadingState,
  NexiProvider,
  ProgressRing,
  PromptBar,
  RecommendationCard,
  RecordsTable,
  SearchList,
  SegmentedControl,
  SelectionActions,
  SidebarNav,
  StatusPill,
  StreamingText,
  Switch,
  TaskRows,
  ThinkingState,
  ToolChips,
  ValuePill,
} from "nexi-agent";
import {
  agentScreenDemo,
  approvalCardDemo,
  chatComposerDemo,
  codeBlockDemo,
  contextCardsDemo,
  diffTableDemo,
  filterTableDemo,
  fineTuneCardDemo,
  flowchartDemo,
  insightCardsDemo,
  loadingStateDemo,
  promptBarDemo,
  recommendationCardDemo,
  recordsTableDemo,
  searchListDemo,
  selectionActionsDemo,
  sidebarNavDemo,
  streamingTextDemo,
  taskRowsDemo,
  thinkingStateDemos,
  toolChipsDemo,
} from "nexi-agent/demo";

/* Every component rendered with its sample data from "nexi-agent/demo".
 * Swap any `{...xyzDemo}` for your own props to try your content. */

function Card({ title, wide, children }: { title: string; wide?: boolean; children: ReactNode }) {
  return (
    <section className={`pg-card${wide ? " is-wide" : ""}`}>
      <h2>{title}</h2>
      <div className="pg-stage">{children}</div>
    </section>
  );
}

const thinkingVariants = ["Steps", "Reasoning", "Search", "Coding"] as const;

export default function App() {
  const [dark, setDark] = useState(false);
  const [thinking, setThinking] = useState<(typeof thinkingVariants)[number]>("Steps");
  const [code, setCode] = useState<"Code" | "Diff">("Code");
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <NexiProvider dark={dark} style={{ minHeight: "100vh", background: "var(--page)" }}>
      <header className="pg-header">
        <h1>nexi-agent playground</h1>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          Dark mode <Switch checked={dark} onChange={setDark} label="Dark mode" />
        </label>
      </header>

      <main className="pg-grid">
        <Card title="Atoms">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <Badge>Draft</Badge>
            <Badge tone="green" dot>Completed</Badge>
            <Badge tone="red" variant="outline" size="sm">Failed</Badge>
            <StatusPill tone="orange">Running</StatusPill>
            <ValuePill tone="accent">+12%</ValuePill>
            <Chip>v0.1.0</Chip>
            <EntityChip name="Nexus" />
            <ProgressRing progress={0.6} />
            <Button variant="accent" size="sm">Accent</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Switch checked={switchOn} onChange={setSwitchOn} label="Toggle" />
          </div>
        </Card>

        <Card title="Customize — your own text, colours and size">
          {/* own content + overridden labels + a CSS-variable brand + a className */}
          <div className="brand-purple" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
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
          </div>
        </Card>

        <Card title="LoadingState">
          <LoadingState {...loadingStateDemo} />
        </Card>

        <Card title="ThinkingState">
          <div style={{ width: "100%", display: "grid", gap: 12, justifyItems: "center" }}>
            <SegmentedControl options={thinkingVariants} value={thinking} onChange={setThinking} />
            <ThinkingState key={thinking} {...thinkingStateDemos[thinking]} />
          </div>
        </Card>

        <Card title="StreamingText">
          <StreamingText {...streamingTextDemo} />
        </Card>

        <Card title="ApprovalCard">
          <ApprovalCard {...approvalCardDemo} onSubmitted={(answers) => console.log(answers)} />
        </Card>

        <Card title="ToolChips">
          <ToolChips {...toolChipsDemo} />
        </Card>

        <Card title="TaskRows">
          <TaskRows {...taskRowsDemo} />
        </Card>

        <Card title="ChatComposer">
          <ChatComposer {...chatComposerDemo} onSend={(text) => console.log("send", text)} />
        </Card>

        <Card title="PromptBar">
          <PromptBar {...promptBarDemo} onSend={(text, files) => console.log("send", text, files)} />
        </Card>

        <Card title="RecommendationCard">
          <RecommendationCard {...recommendationCardDemo} />
        </Card>

        <Card title="ContextCards">
          <ContextCards {...contextCardsDemo} />
        </Card>

        <Card title="DiffTable">
          <DiffTable {...diffTableDemo} onApply={(rows) => console.log("applied", rows)} />
        </Card>

        <Card title="FilterTable">
          <FilterTable {...filterTableDemo} />
        </Card>

        <Card title="SearchList">
          <SearchList {...searchListDemo} />
        </Card>

        <Card title="CodeBlock">
          <div style={{ width: "100%", display: "grid", gap: 12, justifyItems: "center" }}>
            <SegmentedControl options={["Code", "Diff"] as const} value={code} onChange={setCode} />
            <CodeBlock {...codeBlockDemo} variant={code} />
          </div>
        </Card>

        <Card title="FineTuneCard">
          <FineTuneCard {...fineTuneCardDemo} />
        </Card>

        <Card title="SelectionActions">
          <SelectionActions {...selectionActionsDemo} />
        </Card>

        <Card title="InsightCards">
          <InsightCards {...insightCardsDemo} />
        </Card>

        <Card title="AgentScreen">
          <AgentScreen {...agentScreenDemo} />
        </Card>

        <Card title="Flowchart" wide>
          <Flowchart {...flowchartDemo} />
        </Card>

        <Card title="SidebarNav">
          <SidebarNav {...sidebarNavDemo} />
        </Card>

        <Card title="RecordsTable" wide>
          <div style={{ width: "100%", height: 480 }}>
            <RecordsTable {...recordsTableDemo} fill />
          </div>
        </Card>
      </main>
    </NexiProvider>
  );
}
