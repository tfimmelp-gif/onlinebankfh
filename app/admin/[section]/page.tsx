import { PortalShell } from "../../../components/PortalShell";
export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <PortalShell mode="admin" section={section} />;
}
