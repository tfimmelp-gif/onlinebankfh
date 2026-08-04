import type { Metadata } from "next";
import { PortalShell } from "../../components/PortalShell";
import { requireAdminSession } from "../../server/auth/admin-session";
export const metadata: Metadata = { title: "Admin Console" };
export default async function AdminPortal() {
  await requireAdminSession();
  return <PortalShell mode="admin" />;
}
