import type { Metadata } from "next";
import { AuthScreen } from "../../../components/AuthScreen";
export const metadata: Metadata = { title: "Staff Sign In" };
export default function AdminLoginPage() { return <AuthScreen kind="admin"/>; }
