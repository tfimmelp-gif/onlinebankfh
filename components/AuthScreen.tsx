"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import "../app/portal.css";
import { CustomerLoginForm } from "./CustomerLoginForm";
import { CustomerSignupForm } from "./CustomerSignupForm";
import { useLanguage } from "./LanguageProvider";

export function AuthScreen({ kind }: { kind: "login" | "open" | "admin" }) {
  const {t}=useLanguage();
  const isOpen = kind === "open";
  const isAdmin = kind === "admin";
  return (
    <main className="auth-page">
      <section className="auth-panel auth-copy">
        <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={17}/></span>NORTHSTAR</Link>
        <div className="eyebrow light"><span/> {t("DIGITAL BANKING")}</div>
        <h1>{isAdmin ? <>Control every operation.<br/><em>Account for every action.</em></> : <>Your finances,<br/><em>clearly in view.</em></>}</h1>
        <p>{t(isAdmin ? "The staff realm is isolated from customer access and protected by mandatory multi-factor verification." : "Manage accounts, transfers, lending, statements, and support from one secure digital banking experience.")}</p>
        <div className="trust-row" style={{color:"#aab7c7"}}><span><Check size={14}/> {t("Secure access")}</span><span><Check size={14}/> {t("Account controls")}</span><span><Check size={14}/> {t("Audited activity")}</span></div>
      </section>
      <section className="auth-panel auth-form">
        <h2>{t(isOpen ? "Open an account" : isAdmin ? "Staff sign in" : "Welcome back")}</h2>
        <p>{t(isOpen ? "Complete your application for review by our account services team." : isAdmin ? "Use your authorized staff identity. MFA follows password verification." : "Sign in to your Northstar customer portal.")}</p>
        {isOpen ? <CustomerSignupForm/> : !isAdmin ? <CustomerLoginForm/> : <form>
          {isOpen && <div className="form-row"><div className="field"><label>FIRST NAME</label><input placeholder="Alex"/></div><div className="field"><label>LAST NAME</label><input placeholder="Morgan"/></div></div>}
          <div className="field"><label>EMAIL ADDRESS</label><input type="email" placeholder={isAdmin ? "staff@northstar.test" : "alex@example.test"}/></div>
          {isOpen && <div className="form-row"><div className="field"><label>DATE OF BIRTH</label><input type="date"/></div><div className="field"><label>PHONE</label><input placeholder="+1 555 010 2000"/></div></div>}
          {!isOpen && <div className="field"><label>PASSWORD</label><input type="password" placeholder="••••••••••••"/></div>}
          {isOpen && <div className="field"><label>IDENTIFICATION TYPE</label><select><option>Passport</option><option>Driver license</option><option>National ID</option></select></div>}
          <Link href={isAdmin ? "/admin" : "/app"} className="button button-blue">{isOpen ? "Submit application" : isAdmin ? "Continue to MFA" : "Sign in securely"} <ArrowRight size={16}/></Link>
        </form>}
        <div className="auth-foot">{isOpen ? <>{t("Already have an account?")} <Link href="/login">{t("Sign in")}</Link></> : isAdmin ? <><Link href="/login">{t("Customer sign in")}</Link> · {t("Authorized staff only")}</> : <>{t("New to Northstar?")} <Link href="/open-account">{t("Open an account")}</Link></>}</div>
      </section>
    </main>
  );
}
