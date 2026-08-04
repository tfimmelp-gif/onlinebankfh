"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, MailCheck } from "lucide-react";

export function CustomerSignupForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [challenge,setChallenge] = useState<{challengeId:string;emailHint:string;developmentOtp?:string}|null>(null);
  const [verificationCode,setVerificationCode] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/customer/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action:"REQUEST_VERIFICATION", ...values }),
      });
      const result = await response.json() as { challengeId?:string;emailHint?:string;developmentOtp?:string;error?: string };
      if (!response.ok) throw new Error(result.error ?? "APPLICATION_SUBMIT_FAILED");
      if (!result.challengeId) throw new Error("EMAIL_VERIFICATION_REQUIRED");
      setChallenge({challengeId:result.challengeId,emailHint:result.emailHint??String(values.email),developmentOtp:result.developmentOtp});
    } catch (submitError) {
      setError((submitError instanceof Error ? submitError.message : "APPLICATION_SUBMIT_FAILED").replaceAll("_", " "));
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyEmail(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge) return;
    setSubmitting(true);
    setError("");
    try {
      const response=await fetch("/api/customer/signup",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"VERIFY_EMAIL",challengeId:challenge.challengeId,code:verificationCode}),
      });
      const result=await response.json() as {reference?:string;error?:string};
      if(!response.ok)throw new Error(result.error??"EMAIL_VERIFICATION_FAILED");
      setReference(result.reference??"Submitted");
      setChallenge(null);
      setVerificationCode("");
    } catch(verificationError) {
      setError((verificationError instanceof Error?verificationError.message:"EMAIL_VERIFICATION_FAILED").replaceAll("_"," "));
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return <div className="signup-confirmation">
      <CheckCircle2 size={31}/>
      <h3>Application received</h3>
      <p>Your account application is in the manual review queue. A confirmation email has been sent.</p>
      <strong>{reference}</strong>
      <button type="button" className="button button-blue" onClick={()=>setReference("")}>Submit another application</button>
    </div>;
  }


  if(challenge){
    return <form className="email-verification-form" onSubmit={verifyEmail}>
      <div className="email-verification-icon"><MailCheck size={27}/></div>
      <span className="verification-kicker">EMAIL VERIFICATION</span>
      <h3>Check your inbox</h3>
      <p>Enter the six-digit code sent to <b>{challenge.emailHint}</b>. The code expires in 10 minutes.</p>
      <div className="field"><label>6-DIGIT VERIFICATION CODE</label><div className="input-with-icon otp-input"><KeyRound size={15}/><input value={verificationCode} onChange={(event)=>setVerificationCode(event.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" placeholder="000000" required autoFocus/></div></div>
      {challenge.developmentOtp&&<div className="local-email-preview"><b>Local email preview</b><span>Verification code: {challenge.developmentOtp}</span></div>}
      {error&&<div className="auth-error" role="alert">{error}</div>}
      <button className="button button-blue" disabled={submitting||verificationCode.length!==6}>{submitting?"Verifying…":"Verify email & submit"}<ArrowRight size={16}/></button>
      <button type="button" className="verification-back" onClick={()=>{setChallenge(null);setVerificationCode("");setError("");}}><ArrowLeft size={14}/>Change email address</button>
    </form>;
  }

  return <form onSubmit={submit}>
    <div className="form-row">
      <div className="field"><label>FIRST NAME</label><input name="firstName" placeholder="Alex" required/></div>
      <div className="field"><label>LAST NAME</label><input name="lastName" placeholder="Morgan" required/></div>
    </div>
    <div className="field"><label>EMAIL ADDRESS</label><input name="email" type="email" placeholder="alex@example.test" required/></div>
    <div className="form-row">
      <div className="field"><label>DATE OF BIRTH</label><input name="dateOfBirth" type="date" required/></div>
      <div className="field"><label>PHONE</label><input name="phone" placeholder="+1 555 010 2000" required/></div>
    </div>
    <div className="field"><label>IDENTIFICATION TYPE</label><select name="idType"><option>Passport</option><option>Driver license</option><option>National ID</option></select></div>
    {error&&<div className="auth-error" role="alert">{error}</div>}
    <button className="button button-blue" disabled={submitting}>{submitting?"Submitting…":"Submit application"} <ArrowRight size={16}/></button>
  </form>;
}
