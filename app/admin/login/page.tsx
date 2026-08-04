import type { Metadata } from "next";
import { AdminLoginForm } from "../../../components/AdminLoginForm";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import "../../portal.css";
export const metadata: Metadata = { title: "Staff Sign In" };
export default function AdminLoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel auth-copy">
        <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={17}/></span>NORTHSTAR</Link>
        <div className="eyebrow light"><span/> ISOLATED STAFF REALM</div>
        <h1>Control every operation.<br/><em>Account for every action.</em></h1>
        <p>The operations console is isolated from customer access and requires a password plus multi-factor verification.</p>
        <div className="trust-row" style={{color:"#aab7c7"}}><span><Check size={14}/> Staff-only session</span><span><Check size={14}/> MFA required</span><span><Check size={14}/> Audited actions</span></div>
      </section>
      <section className="auth-panel auth-form">
        <h2>Staff sign in</h2>
        <p>Verify your operations identity to continue.</p>
        <AdminLoginForm />
        <div className="auth-foot"><Link href="/login">Customer sign in</Link> · No admin access is linked from the public site</div>
      </section>
    </main>
  );
}
