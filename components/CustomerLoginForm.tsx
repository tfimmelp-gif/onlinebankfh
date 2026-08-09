"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, MailCheck } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

type Challenge = { challengeId:string; emailHint:string; developmentOtp?:string };
type View = "LOGIN" | "RESET_REQUEST" | "RESET_COMPLETE" | "RESET_SUCCESS";

function message(value: unknown, fallback: string) {
  return String(value ?? fallback).replaceAll("_", " ").toLowerCase()
    .replace(/^./, (letter) => letter.toUpperCase());
}

export function CustomerLoginForm() {
  const {t}=useLanguage();
  const [view,setView] = useState<View>("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe,setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [challenge,setChallenge] = useState<Challenge|null>(null);
  const [otp,setOtp] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/customer/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action:"REQUEST_OTP", email, password, rememberMe }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Unable to sign in." }));
        setError(message(body.error,"Unable to sign in."));
        return;
      }
      const result=await response.json() as Partial<Challenge>;
      if(!result.challengeId) throw new Error("OTP challenge was not created.");
      setChallenge({challengeId:result.challengeId,emailHint:result.emailHint??email,developmentOtp:result.developmentOtp});
    } catch {
      setError("The sign-in request did not complete. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event:React.FormEvent) {
    event.preventDefault();
    if(!challenge)return;
    setLoading(true);
    setError("");
    try {
      const response=await fetch("/api/customer/session",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"VERIFY_OTP",challengeId:challenge.challengeId,code:otp}),
        signal:AbortSignal.timeout(10000),
      });
      if(!response.ok){
        const body=await response.json().catch(()=>({error:"Unable to verify the code."}));
        setError(message(body.error,"Unable to verify the code."));
        return;
      }
      const result=await response.json() as {passwordResetRequired?:boolean};
      window.location.assign(result.passwordResetRequired?"/app/security?password-reset=required":"/app");
    } catch {
      setError("The verification request did not complete. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function requestReset(event:React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response=await fetch("/api/customer/session",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"REQUEST_PASSWORD_RESET",email}),
        signal:AbortSignal.timeout(10000),
      });
      const result=await response.json().catch(()=>({error:"Unable to send a reset code."})) as Partial<Challenge>&{error?:string};
      if(!response.ok||!result.challengeId){
        setError(message(result.error,"Unable to send a reset code."));
        return;
      }
      setChallenge({challengeId:result.challengeId,emailHint:result.emailHint??email,developmentOtp:result.developmentOtp});
      setOtp("");
      setView("RESET_COMPLETE");
    } catch {
      setError("The password reset request did not complete. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function completeReset(event:React.FormEvent) {
    event.preventDefault();
    if(!challenge)return;
    setError("");
    if(newPassword!==confirmPassword){setError("The new passwords do not match.");return;}
    setLoading(true);
    try {
      const response=await fetch("/api/customer/session",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"COMPLETE_PASSWORD_RESET",challengeId:challenge.challengeId,code:otp,newPassword}),
        signal:AbortSignal.timeout(10000),
      });
      const result=await response.json().catch(()=>({error:"Unable to reset the password."})) as {error?:string};
      if(!response.ok){setError(message(result.error,"Unable to reset the password."));return;}
      setPassword("");
      setChallenge(null);
      setOtp("");
      setView("RESET_SUCCESS");
    } catch {
      setError("The password reset did not complete. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function backToLogin(){setView("LOGIN");setChallenge(null);setOtp("");setNewPassword("");setConfirmPassword("");setError("");}

  if(view==="RESET_SUCCESS"){
    return <div className="email-verification-form password-reset-success">
      <div className="email-verification-icon"><CheckCircle2 size={27}/></div>
      <span className="verification-kicker">{t("PASSWORD UPDATED")}</span>
      <h3>{t("Your password is ready")}</h3>
      <p>{t("Your password was changed and existing customer sessions were signed out.")}</p>
      <button type="button" className="button button-blue" onClick={backToLogin}>{t("Return to sign in")} <ArrowRight size={16}/></button>
    </div>;
  }

  if(view==="RESET_COMPLETE"&&challenge){
    return <form className="email-verification-form" onSubmit={completeReset}>
      <div className="email-verification-icon"><KeyRound size={27}/></div>
      <span className="verification-kicker">{t("PASSWORD RECOVERY")}</span>
      <h3>{t("Create a new password")}</h3>
      <p>Enter the six-digit code sent to <b>{challenge.emailHint}</b>, then choose a new password.</p>
      <div className="field"><label>{t("RESET CODE")}</label><div className="input-with-icon otp-input"><KeyRound size={15}/><input value={otp} onChange={(event)=>setOtp(event.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" placeholder="000000" required autoFocus/></div></div>
      <div className="field"><label>{t("NEW PASSWORD")}</label><input value={newPassword} onChange={(event)=>setNewPassword(event.target.value)} type="password" autoComplete="new-password" minLength={12} required/><small>{t("12+ characters with uppercase, lowercase, a number and a symbol.")}</small></div>
      <div className="field"><label>{t("CONFIRM NEW PASSWORD")}</label><input value={confirmPassword} onChange={(event)=>setConfirmPassword(event.target.value)} type="password" autoComplete="new-password" minLength={12} required/></div>
      {challenge.developmentOtp&&<div className="local-email-preview"><b>Local email preview</b><span>Reset code: {challenge.developmentOtp}</span></div>}
      {error&&<div className="auth-error" role="alert">{error}</div>}
      <button className="button button-blue" disabled={loading||otp.length!==6}>{loading?"Updating password…":"Update password"}<ArrowRight size={16}/></button>
      <button type="button" className="verification-back" onClick={()=>{setView("RESET_REQUEST");setChallenge(null);setOtp("");setError("");}}><ArrowLeft size={14}/>Request another code</button>
    </form>;
  }

  if(view==="RESET_REQUEST"){
    return <form className="email-verification-form" onSubmit={requestReset}>
      <div className="email-verification-icon"><MailCheck size={27}/></div>
      <span className="verification-kicker">{t("PASSWORD RECOVERY")}</span>
      <h3>{t("Forgot your password?")}</h3>
      <p>{t("Enter the email address registered to your customer profile. We will send a secure six-digit reset code.")}</p>
      <div className="field"><label>{t("EMAIL ADDRESS")}</label><input value={email} onChange={(event)=>setEmail(event.target.value)} type="email" autoComplete="email" required autoFocus/></div>
      {error&&<div className="auth-error" role="alert">{error}</div>}
      <button className="button button-blue" disabled={loading}>{loading?"Sending code…":"Send reset code"}<ArrowRight size={16}/></button>
      <button type="button" className="verification-back" onClick={backToLogin}><ArrowLeft size={14}/>Back to sign in</button>
    </form>;
  }

  if(challenge){
    return <form className="email-verification-form" onSubmit={verifyOtp}>
      <div className="email-verification-icon"><MailCheck size={27}/></div>
      <span className="verification-kicker">{t("SECURE LOGIN")}</span>
      <h3>{t("Verify your email")}</h3>
      <p>Enter the six-digit login code sent to <b>{challenge.emailHint}</b>.</p>
      <div className="field"><label>{t("EMAIL OTP")}</label><div className="input-with-icon otp-input"><KeyRound size={15}/><input value={otp} onChange={(event)=>setOtp(event.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" placeholder="000000" required autoFocus/></div></div>
      {challenge.developmentOtp&&<div className="local-email-preview"><b>Local email preview</b><span>Login code: {challenge.developmentOtp}</span></div>}
      {error&&<div className="auth-error" role="alert">{error}</div>}
      <button className="button button-blue" disabled={loading||otp.length!==6}>{loading?"Verifying…":"Verify & sign in"}<ArrowRight size={16}/></button>
      <button type="button" className="verification-back" onClick={()=>{setChallenge(null);setOtp("");setError("");}}><ArrowLeft size={14}/>Back to sign in</button>
    </form>;
  }

  return <form onSubmit={submit}>
    <div className="field"><label>{t("EMAIL ADDRESS")}</label><input value={email} onChange={(event)=>setEmail(event.target.value)} type="email" autoComplete="username" required/></div>
    <div className="field"><label>{t("PASSWORD")}</label><input value={password} onChange={(event)=>setPassword(event.target.value)} type="password" autoComplete="current-password" required/></div>
    <div className="customer-login-options">
      <label className="remember-me"><input type="checkbox" checked={rememberMe} onChange={(event)=>setRememberMe(event.target.checked)}/><span>{t("Remember me for 30 days")}</span></label>
      <button type="button" className="forgot-password-link" onClick={()=>{setView("RESET_REQUEST");setError("");}}>{t("Forgot password?")}</button>
    </div>
    {error&&<div className="auth-error" role="alert">{error}</div>}
    <button className="button button-blue" disabled={loading}>{loading?t("Signing in…"):t("Sign in securely")} <ArrowRight size={16}/></button>
  </form>;
}
