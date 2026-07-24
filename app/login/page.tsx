import type { Metadata } from "next";
import { AuthScreen } from "../../components/AuthScreen";
export const metadata: Metadata = { title: "Customer Sign In" };
export default function LoginPage() { return <AuthScreen kind="login"/>; }
