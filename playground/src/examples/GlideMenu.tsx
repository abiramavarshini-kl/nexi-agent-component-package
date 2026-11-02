import { GlideMenu } from "nexi-agent";

const items = ["Rename chat", "Duplicate", "Share link", "Archive"];

const row = {
  position: "relative",
  display: "block",
  width: "100%",
  padding: "8px 12px",
  border: 0,
  background: "none",
  color: "var(--ink)",
  font: "inherit",
  fontSize: 13,
  textAlign: "left",
  cursor: "pointer",
} as const;

export default function GlideMenuExample() {
  // any element marked `data-menu-row` gets the gliding highlight
  return (
    <GlideMenu>
      <div style={{ width: 220, padding: 4, borderRadius: 12, background: "var(--surface)", boxShadow: "0 0 0 1px var(--line)" }}>
        {items.map((item) => (
          <button key={item} data-menu-row style={row}>
            {item}
          </button>
        ))}
      </div>
    </GlideMenu>
  );
}
