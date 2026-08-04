import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Compliance Disclosure",
  description: "Important compliance and environment information for Northstar.",
};

export default function ComplianceDisclosurePage() {
  return (
    <main className="compliance-page">
      <header>
        <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={18}/></span>NORTHSTAR</Link>
        <Link href="/"><ArrowLeft size={14}/> Return to home</Link>
      </header>
      <article>
        <span className="bank-kicker dark">COMPLIANCE &amp; DISCLOSURES</span>
        <h1>Northstar environment disclosure</h1>
        <p className="compliance-lead">Northstar is a simulated banking portal created exclusively for software testing, product demonstration, and staff training. The interface uses conventional banking language so workflows can be evaluated realistically, but the platform is not a licensed bank or financial institution and does not hold real funds.</p>
        <div className="compliance-points">
          <section><h2>Funds and accounts</h2><p>Balances, account numbers, cards, loans, deposits, withdrawals, and transaction histories are generated within the portal. They do not represent real funds or real bank accounts.</p></section>
          <section><h2>Payment networks</h2><p>ACH, wire, card, digital-asset, and international transfer workflows do not connect to live payment rails, banks, exchanges, wallets, or blockchains.</p></section>
          <section><h2>Identity information</h2><p>Only fictional or approved test data should be entered. Do not upload genuine identification documents, tax identifiers, passwords, or sensitive personal information.</p></section>
          <section><h2>Regulatory status</h2><p>Northstar has no banking charter, regulator affiliation, deposit insurance, or authority to offer financial products. Product rates and terms are illustrative.</p></section>
        </div>
        <p className="compliance-contact">Questions about this environment or its data-handling practices can be directed to <a href="mailto:support@northstar.test">support@northstar.test</a>.</p>
      </article>
    </main>
  );
}
