import Link from "next/link";
import { ArrowRight, Check, ShieldAlert, Sparkles } from "lucide-react";
import "../app/portal.css";

export function AuthScreen({ kind }: { kind: "login" | "open" | "admin" }) {
  const isOpen = kind === "open";
  const isAdmin = kind === "admin";
  return (
    <main className="auth-page">
      <section className="auth-panel auth-copy">
        <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={17}/></span>NORTHSTAR</Link>
        <div className="eyebrow light"><span/> CLOSED-LOOP BANKING</div>
        <h1>{isAdmin ? <>Control every operation.<br/><em>Account for every action.</em></> : <>Your simulated finances,<br/><em>clearly in view.</em></>}</h1>
        <p>{isAdmin ? "The staff realm is isolated from customer access and protected by mandatory multi-factor verification." : "Experience complete account, transfer, lending, statement, and support workflows in a safe training environment."}</p>
        <div className="trust-row" style={{color:"#aab7c7"}}><span><Check size={14}/> Synthetic data</span><span><Check size={14}/> No real funds</span><span><Check size={14}/> Audited activity</span></div>
      </section>
      <section className="auth-panel auth-form">
        <div className="simulation-bar" style={{position:"absolute", top:0, right:0, width:"50%"}}><ShieldAlert size={11}/> TRAINING ENVIRONMENT · NO REAL FUNDS</div>
        <h2>{isOpen ? "Open a simulated account" : isAdmin ? "Staff sign in" : "Welcome back"}</h2>
        <p>{isOpen ? "Your application will be reviewed manually by the training operations team." : isAdmin ? "Use your authorized staff identity. MFA follows password verification." : "Sign in to your Northstar customer portal."}</p>
        <form>
          {isOpen && <div className="form-row"><div className="field"><label>FIRST NAME</label><input placeholder="Alex"/></div><div className="field"><label>LAST NAME</label><input placeholder="Morgan"/></div></div>}
          <div className="field"><label>EMAIL ADDRESS</label><input type="email" placeholder={isAdmin ? "staff@northstar.test" : "alex@example.test"}/></div>
          {isOpen && <div className="form-row"><div className="field"><label>DATE OF BIRTH</label><input type="date"/></div><div className="field"><label>PHONE</label><input placeholder="+1 555 010 2000"/></div></div>}
          {!isOpen && <div className="field"><label>PASSWORD</label><input type="password" placeholder="••••••••••••"/></div>}
          {isOpen && <div className="field"><label>SIMULATED ID TYPE</label><select><option>Training passport</option><option>Training driver license</option><option>Training national ID</option></select></div>}
          <Link href={isAdmin ? "/admin" : "/app"} className="button button-blue">{isOpen ? "Submit application" : isAdmin ? "Continue to MFA" : "Sign in securely"} <ArrowRight size={16}/></Link>
        </form>
        <div className="auth-foot">{isOpen ? <>Already have an account? <Link href="/login">Sign in</Link></> : isAdmin ? <><Link href="/login">Customer sign in</Link> · Authorized staff only</> : <>New to Northstar? <Link href="/open-account">Open a simulated account</Link></>}</div>
      </section>
    </main>
  );
}
