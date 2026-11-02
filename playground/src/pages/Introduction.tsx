import { CodeView } from "../components/CodeView";
import { ArrowIcon, GitHubIcon } from "../components/icons";
import { docs, groups, slugOf } from "../registry";
import { Link } from "../router";
import { REPO_URL } from "../site";

const install = "npm install github:abiramavarshini-kl/nexi-agent-component-package";

const setup = `// main.tsx (or app/layout.tsx in Next.js)
import "nexi-agent/styles.css";
import { NexiProvider } from "nexi-agent";

root.render(
  <NexiProvider>
    <App />
  </NexiProvider>,
);`;

const use = `import { ApprovalCard, StreamingText, ThinkingState } from "nexi-agent";

<ThinkingState done="Thought for 3 seconds" rows={[{ primary: "Reading the ticket" }]} />
<StreamingText content="The deploy failed because the API key expired." />
<ApprovalCard
  questions={[{ q: "Rotate the key now?", type: "radio", options: ["Yes", "Later"] }]}
  onSubmitted={(answers) => agent.resume(answers)}
/>`;

const tailwind = `/* Tailwind v4 instead: in your main CSS */
@import "tailwindcss";
@import "nexi-agent/tailwind.css";`;

const theme = `:root {
  --accent: oklch(0.58 0.22 300);      /* buttons, links, focus */
  --accent-ink: oklch(0.5 0.2 300);    /* accent-coloured text */
  --accent-tint: oklch(0.95 0.03 300); /* soft accent backgrounds */
}

.billing { --accent: #0f9d58; }        /* only inside .billing */`;

export default function Introduction() {
  return (
    <article className="doc">
      <section className="hero">
        <p className="eyebrow">React · TypeScript · {docs.length} components</p>
        <h1>Components for AI&#8209;agent interfaces</h1>
        <p className="lead">
          Streaming answers, reasoning traces, tool calls, approvals, tables and more. Each one is content-free: you pass your own
          data and words through props. Built on Beautiful UI.
        </p>
        <div className="hero-actions">
          <Link to="/components/message-thread" className="btn btn-primary">
            Browse components <ArrowIcon />
          </Link>
          <Link to="/all" className="btn">
            See them all on one page
          </Link>
          <a href={REPO_URL} className="btn" target="_blank" rel="noreferrer">
            <GitHubIcon /> GitHub
          </a>
        </div>
        <CodeView code={install} plain />
      </section>

      <h2 id="quick-start">Quick start</h2>
      <ol className="steps">
        <li>
          <h3>Install</h3>
          <p>Works in any React 18 or 19 app: Vite, Next.js, Remix. Tailwind is optional.</p>
          <CodeView code={install} plain />
        </li>
        <li>
          <h3>Add the styles and the provider, once</h3>
          <p>
            <code>NexiProvider</code> applies the font and colour scope without touching the rest of your page. Pass <code>dark</code> for
            the dark palette.
          </p>
          <CodeView code={setup} />
          <CodeView code={tailwind} />
        </li>
        <li>
          <h3>Use any component</h3>
          <p>Every component page has a live preview, code you can copy, and its full props.</p>
          <CodeView code={use} />
        </li>
      </ol>

      <h2 id="conventions">Four conventions</h2>
      <div className="conventions">
        <div>
          <h3>Content comes from props</h3>
          <p>Nothing is hardcoded. A component without props renders empty, never with placeholder text.</p>
        </div>
        <div>
          <h3>UI words go in labels</h3>
          <p>
            Button text and messages have English defaults. Override any of them through <code>labels</code>, for wording or translation.
          </p>
        </div>
        <div>
          <h3>Actions come back as callbacks</h3>
          <p>
            <code>onSend</code>, <code>onSubmitted</code>, <code>onApply</code>, <code>onAccept</code>… You decide what happens.
          </p>
        </div>
        <div>
          <h3>Sample data in nexi-agent/demo</h3>
          <p>
            Every component has a fixture for prototyping, like <code>approvalCardDemo</code>. It stays out of your bundle unless you
            import it.
          </p>
        </div>
      </div>

      <h2 id="theming">Theming</h2>
      <p>Every colour is a CSS variable. Override them globally or for one section. Dark mode is built in.</p>
      <CodeView code={theme} />

      <h2 id="components">Components</h2>
      {groups.map((group) => (
        <section key={group} className="index-group">
          <h3>{group}</h3>
          <div className="index-grid">
            {docs
              .filter((d) => d.group === group)
              .map((d) => (
                <Link key={d.name} to={`/components/${slugOf(d.name)}`} className="index-card">
                  <strong>{d.name}</strong>
                  <span>{d.description}</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </article>
  );
}
