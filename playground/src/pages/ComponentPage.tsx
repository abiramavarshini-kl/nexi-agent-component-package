import { Component, useState, type ReactNode } from "react";
import { CodeView } from "../components/CodeView";
import { ArrowIcon } from "../components/icons";
import { ApiReference } from "../components/PropsTable";
import { demoSourceOf, docs, exampleOf, exampleSourceOf, slugOf, type Doc } from "../registry";
import { Link } from "../router";

/** keeps one broken example from taking the whole page down */
class ExampleBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? <p className="muted">This example failed to render: {this.state.error.message}</p> : this.props.children;
  }
}

/** a framed live render of one example */
export function Preview({ doc }: { doc: Doc }) {
  const Example = exampleOf(doc.name);
  return (
    <div className={`preview${doc.wide ? " is-wide" : ""}`}>
      <ExampleBoundary>{Example ? <Example /> : <p className="muted">No example yet.</p>}</ExampleBoundary>
    </div>
  );
}

type Tab = "Preview" | "Code" | "Sample data";

export default function ComponentPage({ doc }: { doc: Doc }) {
  const [tab, setTab] = useState<Tab>("Preview");
  const source = exampleSourceOf(doc.name);
  const demo = demoSourceOf(doc.name);
  const tabs: Tab[] = demo ? ["Preview", "Code", "Sample data"] : ["Preview", "Code"];
  const names = doc.components ?? [doc.name];
  const imports = doc.name === "Toast" ? "ToastProvider, useToast" : names.join(", ");

  const index = docs.indexOf(doc);
  const prev = docs[index - 1];
  const next = docs[index + 1];

  return (
    <article className="doc">
      <p className="eyebrow">{doc.group}</p>
      <h1>{doc.name}</h1>
      <p className="lead">{doc.description}</p>

      <div className="tabs" role="tablist" aria-label="Example view">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className="tab" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      {/* keep the preview mounted so its state survives a peek at the code */}
      <div hidden={tab !== "Preview"}>
        <Preview doc={doc} />
      </div>
      {tab === "Code" && <CodeView code={source} className="tall" />}
      {tab === "Sample data" && demo && <CodeView code={demo} className="tall" />}

      <h2 id="usage">Usage</h2>
      <CodeView code={`import { ${imports} } from "nexi-agent";`} />

      <h2 id="api">API reference</h2>
      <ApiReference names={names} />

      <nav className="pager" aria-label="Previous and next component">
        {prev ? (
          <Link to={`/components/${slugOf(prev.name)}`} className="pager-link">
            <span className="muted">Previous</span>
            {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/components/${slugOf(next.name)}`} className="pager-link is-next">
            <span className="muted">Next</span>
            <span className="pager-name">
              {next.name} <ArrowIcon />
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
