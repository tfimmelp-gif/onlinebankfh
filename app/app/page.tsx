import type { Metadata } from "next";
import { PortalShell } from "../../components/PortalShell";
export const metadata: Metadata = { title: "Customer Portal" };
export default function CustomerPortal() { return <PortalShell mode="customer" />; }
