import type { Metadata } from "next";
import { PortalShell } from "../../../components/PortalShell";
import { requireCustomerSession } from "../../../server/auth/customer-session";
export const metadata: Metadata = { title: "Customer Portal" };
export default async function CustomerPortal() {
  await requireCustomerSession();
  return <PortalShell mode="customer" />;
}
