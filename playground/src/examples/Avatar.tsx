import { Avatar } from "nexi-agent";

export default function AvatarExample() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar name="Scout" status="online" />
      <Avatar name="Maya Chen" size="md" color="#3d9aff" status="busy" />
      <Avatar name="Ops Agent" size="lg" square color="#1f7a5f" />
      <Avatar name="Theo" size="lg" status="away" />
    </div>
  );
}
