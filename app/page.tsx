import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: CircleDollarSign,
    eyebrow: "Closed-loop ledger",
    title: "Money movement without the money.",
    copy: "Practice funding, transfers, loan disbursements, and corrections against a balanced double-entry ledger.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Operational controls",
    title: "Put every exception to the test.",
    copy: "Freeze accounts, apply granular stop codes, and verify that restricted transfers never reach the ledger.",
  },
  {
    icon: Globe2,
    eyebrow: "Simulated rails",
    title: "Domestic to international.",
    copy: "Model realistic internal, domestic, and international flows without connecting to a live payment network.",
  },
];

export default function Home() {
  return (
    <main>
      <div className="simulation-bar">
        <span className="pulse-dot" />
        TRAINING ENVIRONMENT
        <span className="simulation-separator">·</span>
        NO REAL FUNDS OR PAYMENT RAILS
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        <Link href="/" className="brand" aria-label="Northstar home">
          <span className="brand-mark"><Sparkles size={18} /></span>
          NORTHSTAR
        </Link>
        <div className="nav-links">
          <Link href="#platform">Platform</Link>
          <Link href="#controls">Controls</Link>
          <Link href="#security">Security</Link>
        </div>
        <div className="nav-actions">
          <Link href="/login" className="text-link">Sign in</Link>
          <Link href="/open-account" className="button button-dark">
            Open simulated account <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> THE BANK YOU CAN BREAK SAFELY</div>
          <h1>Simulated banking,<br /><em>fully under control.</em></h1>
          <p>
            A secure, self-hosted banking environment for training teams,
            validating workflows, and rehearsing complex operations—without
            touching a single real-world rail.
          </p>
          <div className="hero-actions">
            <Link href="/open-account" className="button button-blue">
              Explore the platform <ArrowRight size={17} />
            </Link>
            <Link href="/app" className="button button-ghost">
              View customer portal <ChevronRight size={17} />
            </Link>
          </div>
          <div className="trust-row">
            <span><Check size={14} /> Fully self-hosted</span>
            <span><Check size={14} /> Double-entry ledger</span>
            <span><Check size={14} /> Audited operations</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Northstar dashboard preview">
          <div className="grid-orbit orbit-one" />
          <div className="grid-orbit orbit-two" />
          <div className="preview-window">
            <div className="preview-top">
              <div className="mini-brand"><Sparkles size={12} /> N</div>
              <div className="preview-tabs"><span className="active" /><span /><span /></div>
              <div className="preview-avatar">AM</div>
            </div>
            <div className="preview-body">
              <aside>
                <span className="active" /><span /><span /><span /><span />
              </aside>
              <div className="preview-content">
                <div className="preview-label">TOTAL RELATIONSHIP BALANCE</div>
                <div className="preview-balance">$104,020.62</div>
                <div className="preview-change">↑ 4.8% this month</div>
                <div className="account-preview-row">
                  <div className="account-preview primary">
                    <small>CHECKING · 1842</small>
                    <strong>$25,680.40</strong>
                    <div className="sparkline">
                      <i /><i /><i /><i /><i /><i /><i />
                    </div>
                  </div>
                  <div className="account-preview">
                    <small>SAVINGS · 9081</small>
                    <strong>$78,340.22</strong>
                    <div className="sparkline muted">
                      <i /><i /><i /><i /><i /><i /><i />
                    </div>
                  </div>
                </div>
                <div className="transfer-preview">
                  <div className="transfer-icon">↗</div>
                  <div><small>INTERNAL TRANSFER</small><b>Operations reserve</b></div>
                  <strong>−$2,500.00</strong>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="status-card floating-card">
            <ShieldCheck size={18} />
            <div><small>LEDGER STATUS</small><b>Balanced</b></div>
            <span>✓</span>
          </div>
          <div className="control-card floating-card">
            <LockKeyhole size={18} />
            <div><small>CONTROL LAYER</small><b>All systems normal</b></div>
          </div>
        </div>
      </section>

      <section className="metric-strip">
        <div><strong>100%</strong><span>Closed-loop simulation</span></div>
        <div><strong>&lt; 1 sec</strong><span>Atomic ledger posting</span></div>
        <div><strong>24/7</strong><span>Operational rehearsal</span></div>
        <div><strong>0</strong><span>Live banking connections</span></div>
      </section>

      <section className="platform-section" id="platform">
        <div className="section-heading">
          <div className="eyebrow"><span /> ONE CONTROLLED ECOSYSTEM</div>
          <h2>Everything a bank does.<br /><em>Nothing a bank risks.</em></h2>
          <p>From customer onboarding to ledger correction, every workflow is connected, observable, and reversible.</p>
        </div>
        <div className="feature-grid" id="controls">
          {features.map(({ icon: Icon, eyebrow, title, copy }, index) => (
            <article className={`feature-card feature-${index + 1}`} key={title}>
              <div className="feature-number">0{index + 1}</div>
              <Icon size={22} />
              <small>{eyebrow}</small>
              <h3>{title}</h3>
              <p>{copy}</p>
              <Link href="/app">See it in action <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="security-callout" id="security">
        <div>
          <div className="eyebrow light"><span /> BUILT FOR CONSEQUENCE-FREE PRACTICE</div>
          <h2>Real controls.<br />Synthetic consequences.</h2>
        </div>
        <div className="security-list">
          <p><LockKeyhole size={18} /><span><b>Separated access realms</b>Customer and staff sessions never share a privilege boundary.</span></p>
          <p><Landmark size={18} /><span><b>Immutable accounting</b>Posted entries are corrected with audited reversal and replacement.</span></p>
          <p><ShieldCheck size={18} /><span><b>Operational stop layer</b>System, user, and account-level restrictions are evaluated before posting.</span></p>
        </div>
      </section>

      <footer>
        <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={18} /></span>NORTHSTAR</Link>
        <p>Simulated banking infrastructure for testing and training. No real funds.</p>
        <div><Link href="/app">Customer portal</Link><Link href="/admin">Admin console</Link></div>
      </footer>
    </main>
  );
}
