import { PortalShell } from "../../../../components/PortalShell";
import { requireCustomerSession } from "../../../../server/auth/customer-session";
export default async function CustomerSection({ params }: { params: Promise<{ section: string }> }) {
  await requireCustomerSession();
  const { section } = await params;
  return <PortalShell mode="customer" section={section} />;
}
