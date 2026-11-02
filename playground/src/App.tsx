import { useEffect, useState } from "react";
import { NexiProvider, ToastProvider } from "nexi-agent";
import pkg from "nexi-agent/package.json";
import { GitHubIcon, MenuIcon, MoonIcon, SunIcon } from "./components/icons";
import ComponentPage from "./pages/ComponentPage";
import Gallery from "./pages/Gallery";
import Introduction from "./pages/Introduction";
import { docBySlug, docs, groups, slugOf } from "./registry";
import { Link, usePath } from "./router";
import { REPO_URL } from "./site";

const THEME_KEY = "nexi-docs-theme";

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === "dark";
    } catch {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    // tokens are defined on :root and .dark, so this themes portals (dialogs, toasts) too
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {}
  }, [dark]);
  return [dark, setDark] as const;
}

function route(path: string) {
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return { title: "Introduction", page: <Introduction /> };
  if (clean === "/all") return { title: "All components", page: <Gallery />, full: true };
  const match = /^\/components\/([\w-]+)$/.exec(clean);
  const doc = match && docBySlug(match[1]);
  if (doc) return { title: doc.name, page: <ComponentPage key={doc.name} doc={doc} /> };
  return {
    title: "Not found",
    page: (
      <article className="doc">
        <h1>Page not found</h1>
        <p className="lead">
          There's nothing at <code>{path}</code>. <Link to="/">Go to the introduction</Link>.
        </p>
      </article>
    ),
  };
}

function Sidebar({ path }: { path: string }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const match = (name: string) => !q || name.toLowerCase().includes(q);
  const item = (to: string, label: string) => (
    <Link key={to} to={to} className="nav-link" aria-current={path === to ? "page" : undefined}>
      {label}
    </Link>
  );
  const visibleGroups = groups
    .map((group) => ({ group, items: docs.filter((d) => d.group === group && match(d.name)) }))
    .filter((g) => g.items.length);

  return (
    <nav className="sidebar-inner" aria-label="Components">
      <input
        className="search"
        type="search"
        placeholder="Search components…"
        aria-label="Search components"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {!q && (
        <div className="nav-group">
          <p className="nav-heading">Getting started</p>
          {item("/", "Introduction")}
          {item("/all", "All components")}
        </div>
      )}
      {visibleGroups.map(({ group, items }) => (
        <div key={group} className="nav-group">
          <p className="nav-heading">{group}</p>
          {items.map((d) => item(`/components/${slugOf(d.name)}`, d.name))}
        </div>
      ))}
      {!visibleGroups.length && <p className="muted nav-empty">No component matches “{query}”.</p>}
    </nav>
  );
}

export default function App() {
  const path = usePath();
  const [dark, setDark] = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const { title, page, full } = route(path);

  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    document.title = title === "Introduction" ? "nexi-agent — components for AI-agent interfaces" : `${title} · nexi-agent`;
  }, [title]);

  return (
    <NexiProvider className="site">
      <ToastProvider>
        <header className="topbar">
          <button className="icon-btn menu-btn" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <MenuIcon />
          </button>
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden />
            nexi-agent
          </Link>
          <span className="version">v{pkg.version}</span>
          <span className="spacer" />
          <Link to="/all" className="top-link">
            Components
          </Link>
          <a href={REPO_URL} className="icon-btn" target="_blank" rel="noreferrer" aria-label="GitHub repository">
            <GitHubIcon />
          </a>
          <button className="icon-btn" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setDark(!dark)}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>
        <div className="layout">
          <aside className={`sidebar${menuOpen ? " is-open" : ""}`}>
            <Sidebar path={path} />
          </aside>
          {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}
          <main className={`content${full ? " is-full" : ""}`}>{page}</main>
        </div>
      </ToastProvider>
    </NexiProvider>
  );
}
