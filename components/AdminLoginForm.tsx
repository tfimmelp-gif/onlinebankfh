"use client";

import { useState } from "react";
import { ArrowRight, KeyRound } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function AdminLoginForm() {
  const {t}=useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Unable to sign in." }));
        setError(body.error);
        setLoading(false);
        return;
      }
      window.location.assign("/admin");
    } catch {
      setError("The sign-in request did not complete. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label>{t("STAFF EMAIL")}</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="username" placeholder="name@your-bank.com" required />
      </div>
      <div className="field">
        <label>{t("PASSWORD")}</label>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="Enter your password" required />
      </div>
      <div className="field">
        <label>{t("6-DIGIT MFA CODE")}</label>
        <div className="input-with-icon"><KeyRound size={15} /><input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" pattern="[0-9]{6}" required /></div>
      </div>
      {error && <div className="auth-error" role="alert">{error}</div>}
      <button className="button button-blue" disabled={loading}>
        {loading ? t("Verifying…") : t("Enter operations console")} <ArrowRight size={16}/>
      </button>
    </form>
  );
}
