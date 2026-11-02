import { docs, groups, slugOf } from "../registry";
import { Link } from "../router";
import { Preview } from "./ComponentPage";

/* Every example on one page — the quickest way to see the whole library. */
export default function Gallery() {
  return (
    <div className="gallery">
      <header className="gallery-head">
        <h1>All components</h1>
        <p className="lead">Every component in nexi-agent, live, on one page. Click a title for its code and props.</p>
      </header>
      {groups.map((group) => (
        <section key={group}>
          <h2 className="gallery-group">{group}</h2>
          <div className="gallery-grid">
            {docs
              .filter((d) => d.group === group)
              .map((doc) => (
                <div key={doc.name} className={`gallery-card${doc.wide ? " is-wide" : ""}`}>
                  <Link to={`/components/${slugOf(doc.name)}`} className="gallery-title">
                    {doc.name}
                  </Link>
                  <Preview doc={doc} />
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
