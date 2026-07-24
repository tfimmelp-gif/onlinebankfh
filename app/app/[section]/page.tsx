import { PortalShell } from "../../../components/PortalShell";
export default async function CustomerSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <PortalShell mode="customer" section={section} />;
}
