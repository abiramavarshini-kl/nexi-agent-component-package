import { EntityChip, Monogram } from "nexi-agent";

export default function EntityChipExample() {
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
      <p style={{ margin: 0, lineHeight: 2 }}>
        Assigned to <EntityChip name="Nexus" /> and <EntityChip name="Kumo Creamery" color="#e56d24" />
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <Monogram>N</Monogram>
        <Monogram color="#1f7a5f">K</Monogram>
        <Monogram color="#e56d24">★</Monogram>
      </div>
    </div>
  );
}
