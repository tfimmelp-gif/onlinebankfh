import type { Metadata } from "next";
import { AuthScreen } from "../../components/AuthScreen";
export const metadata: Metadata = { title: "Open an Account" };
export default function OpenAccountPage() { return <AuthScreen kind="open"/>; }
