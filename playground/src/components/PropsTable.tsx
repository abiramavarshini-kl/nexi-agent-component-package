import props from "../generated/props.json";

export type Prop = { name: string; type: string; required: boolean; description: string; default?: string };
type Entry = { file: string; props: Prop[]; native?: boolean };

const components = props.components as Record<string, Entry>;
const types = props.types as Record<string, Entry>;

function Table({ rows }: { rows: Prop[] }) {
  return (
    <div className="table-wrap">
      <table className="props">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.name}>
              <td>
                <code className="prop-name">
                  {p.name}
                  {p.required && <span className="req" title="required">*</span>}
                </code>
                {p.description && <p>{p.description}</p>}
              </td>
              <td>
                <code className="prop-type">{p.type}</code>
              </td>
              <td>{p.default ? <code>{p.default}</code> : <span className="muted">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Props of each listed component, then the data types declared alongside them. */
export function ApiReference({ names }: { names: string[] }) {
  const entries = names.map((name) => [name, components[name]] as const).filter(([, e]) => e);
  const files = new Set(entries.map(([, e]) => e.file));
  const skip = new Set(names.map((n) => `${n}Props`));
  const related = Object.entries(types).filter(([name, t]) => files.has(t.file) && !skip.has(name));

  return (
    <>
      {entries.map(([name, entry]) => (
        <section key={name} className="api-block">
          <h3>
            <code>{name}</code>
          </h3>
          {entry.props.length ? <Table rows={entry.props} /> : <p className="muted">No props.</p>}
          {entry.native && <p className="note">Also accepts the native HTML attributes of its root element (className, style, onClick…).</p>}
        </section>
      ))}
      {related.length > 0 && (
        <>
          <h2 id="types">Types</h2>
          <p className="muted">
            Data shapes used by the props above. Import them with <code>{'import type { … } from "nexi-agent"'}</code>.
          </p>
          {related.map(([name, t]) => (
            <section key={name} className="api-block">
              <h3>
                <code>{name}</code>
              </h3>
              <Table rows={t.props} />
            </section>
          ))}
        </>
      )}
    </>
  );
}
