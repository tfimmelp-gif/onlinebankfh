import { PortalShell } from "../../../components/PortalShell";
import { requireAdminSession } from "../../../server/auth/admin-session";
export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  await requireAdminSession();
  const { section } = await params;
  return <PortalShell mode="admin" section={section} />;
}
