import type { Metadata } from "next";
import { PortalShell } from "../../components/PortalShell";
export const metadata: Metadata = { title: "Admin Console" };
export default function AdminPortal() { return <PortalShell mode="admin" />; }
