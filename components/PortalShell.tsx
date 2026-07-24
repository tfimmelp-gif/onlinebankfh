"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowRightLeft,
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  CircleGauge,
  FileText,
  Headphones,
  Landmark,
  LockKeyhole,
  Menu,
  PiggyBank,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import "../app/portal.css";

const customerNav = [
  { href: "/app", label: "Overview", icon: CircleGauge },
  { href: "/app/accounts", label: "Accounts", icon: WalletCards },
  { href: "/app/transfers", label: "Transfers", icon: ArrowRightLeft },
  { href: "/app/beneficiaries", label: "Beneficiaries", icon: Users },
  { section: "PLANNING" },
  { href: "/app/loans", label: "Loans", icon: Landmark },
  { href: "/app/statements", label: "Statements", icon: FileText },
  { section: "ASSISTANCE" },
  { href: "/app/support", label: "Support", icon: Headphones },
  { href: "/app/security", label: "Security", icon: LockKeyhole },
];

const adminNav = [
  { href: "/admin", label: "Operations", icon: CircleGauge },
  { section: "MANAGEMENT" },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/kyc", label: "KYC queue", icon: CheckCircle2 },
  { href: "/admin/accounts", label: "Accounts", icon: WalletCards },
  { href: "/admin/transfers", label: "Transfers", icon: ArrowRightLeft },
  { href: "/admin/loans", label: "Loans", icon: Landmark },
  { href: "/admin/support", label: "Support", icon: Headphones },
  { section: "CONTROL" },
  { href: "/admin/ledger", label: "Ledger", icon: BookOpen },
  { href: "/admin/stop-codes", label: "Stop codes", icon: ShieldAlert },
  { href: "/admin/audit", label: "Audit log", icon: FileText },
  { href: "/admin/system", label: "System", icon: Settings },
];

type NavItem = { href?: string; label?: string; icon?: React.ComponentType<{ size?: number }> ; section?: string };

export function PortalShell({ mode, section }: { mode: "customer" | "admin"; section?: string }) {
  const pathname = usePathname();
  const isAdmin = mode === "admin";
  const nav = (isAdmin ? adminNav : customerNav) as NavItem[];
  const title = section ? section.replaceAll("-", " ") : isAdmin ? "Operations center" : "Overview";

  return (
    <main className={`portal-page ${isAdmin ? "admin-page" : ""}`}>
      <div className="portal-simbar"><ShieldAlert size={12} /> SIMULATION ENVIRONMENT · NO REAL FUNDS OR LIVE PAYMENT RAILS</div>
      <div className="portal-shell">
        <aside className="portal-sidebar">
          <Link href="/" className="portal-brand"><span><Sparkles size={16} /></span>NORTHSTAR</Link>
          <nav className="portal-nav">
            {nav.map((item, index) =>
              item.section ? <div className="nav-section" key={`${item.section}-${index}`}>{item.section}</div> : (
                <Link key={item.href} href={item.href!} className={pathname === item.href ? "active" : ""}>
                  {item.icon && <item.icon size={16} />} {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="portal-profile">
            <span>{isAdmin ? "SO" : "AM"}</span>
            <div><b>{isAdmin ? "Sarah Okafor" : "Alex Morgan"}</b><small>{isAdmin ? "Operations admin" : "Customer · 882104"}</small></div>
            <ChevronDown size={13} />
          </div>
        </aside>
        <section className="portal-main">
          <header className="portal-header">
            <div><h1>{title.charAt(0).toUpperCase() + title.slice(1)}</h1><p>{isAdmin ? "Northstar operations realm · MFA verified" : "Friday, July 24, 2026"}</p></div>
            <div className="header-tools"><button aria-label="Search"><Search size={15} /></button><button aria-label="Notifications"><Bell size={15} /></button><button aria-label="Menu"><Menu size={15} /></button></div>
          </header>
          <div className="portal-content">
            {isAdmin ? <AdminContent section={section} /> : <CustomerContent section={section} />}
          </div>
        </section>
      </div>
    </main>
  );
}

function CustomerContent({ section }: { section?: string }) {
  if (section === "transfers") return <TransferForm />;
  if (section) return <GenericCustomerSection section={section} />;
  return <CustomerOverview />;
}

function CustomerOverview() {
  const activity = [
    ["Payroll simulation", "Today, 09:42", "Checking", "+$4,850.00", "credit"],
    ["Savings transfer", "Yesterday, 16:18", "Checking", "−$1,200.00", ""],
    ["Northstar Utilities", "Jul 22, 2026", "Checking", "−$186.40", ""],
    ["Interest credit", "Jul 20, 2026", "Savings", "+$32.18", "credit"],
  ];
  return (
    <>
      <div className="overview-head">
        <div><h2>Good morning, Alex.</h2><p>Here is your simulated financial position today.</p></div>
        <Link href="/app/transfers" className="primary-action"><Plus size={14} /> New transfer</Link>
      </div>
      <div className="summary-grid">
        <div className="balance-card">
          <small>TOTAL RELATIONSHIP BALANCE</small><strong>$104,020.62</strong><p>↑ 4.8% from last month</p>
          <div className="mini-chart">{Array.from({ length: 8 }).map((_, i) => <i key={i} />)}</div>
        </div>
        <div className="account-card">
          <div className="account-title"><CircleDollarSign size={16} /> Everyday Checking</div><strong>$25,680.40</strong><p>Available $25,680.40</p>
          <footer><span>•••• 1842</span><span>Active</span></footer>
        </div>
        <div className="account-card">
          <div className="account-title"><PiggyBank size={16} /> Growth Savings</div><strong>$78,340.22</strong><p>Available $78,340.22</p>
          <footer><span>•••• 9081</span><span>Active</span></footer>
        </div>
      </div>
      <div className="portal-grid">
        <div className="panel">
          <div className="panel-head"><h3>Recent activity</h3><Link href="/app/statements">View all</Link></div>
          <table className="activity-table"><thead><tr><th>Transaction</th><th>Account</th><th className="money">Amount</th></tr></thead><tbody>
            {activity.map(([name,date,account,amount,type]) => <tr key={name}><td><div className="transaction-name"><span className="transaction-icon"><ArrowDownToLine size={13} /></span><div><b>{name}</b><small>{date}</small></div></div></td><td>{account}</td><td className={`money ${type}`}>{amount}</td></tr>)}
          </tbody></table>
        </div>
        <div>
          <div className="panel">
            <div className="panel-head"><h3>Quick actions</h3></div>
            <div className="quick-actions"><Link href="/app/transfers"><ArrowRightLeft size={17} />Transfer</Link><Link href="/app/statements"><FileText size={17} />Statement</Link><Link href="/app/loans"><Landmark size={17} />Apply for loan</Link><Link href="/app/support"><Headphones size={17} />Get support</Link></div>
          </div>
          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panel-head"><h3>Active loan</h3><Link href="/app/loans">Details</Link></div>
            <div className="loan-progress"><div className="loan-row"><span>Equipment loan</span><b>$10,580 / $25,000</b></div><div className="progress-track"><span /></div><p>Next simulated payment: $842.16 on August 1, 2026.</p></div>
          </div>
        </div>
      </div>
    </>
  );
}

function TransferForm() {
  return (
    <>
      <div className="overview-head"><div><h2>New transfer</h2><p>Move simulated USD between internal or external training accounts.</p></div></div>
      <div className="transfer-layout">
        <section className="section-card">
          <div className="section-title"><div><h2>Transfer details</h2><p>All instructions are validated against active stop codes before posting.</p></div></div>
          <form className="form-grid">
            <div className="form-row"><div className="field"><label>TRANSFER TYPE</label><select defaultValue="INTERNAL"><option>Internal</option><option>Domestic</option><option>International</option></select></div><div className="field"><label>FROM ACCOUNT</label><select><option>Everyday Checking · 1842 — $25,680.40</option><option>Growth Savings · 9081 — $78,340.22</option></select></div></div>
            <div className="field"><label>BENEFICIARY</label><select><option>Operations Reserve · 7812</option><option>Training Vendor · 4088</option></select></div>
            <div className="form-row"><div className="field"><label>AMOUNT (USD)</label><input defaultValue="2,500.00" /></div><div className="field"><label>EXECUTION DATE</label><input type="date" defaultValue="2026-07-24" /></div></div>
            <div className="field"><label>STATEMENT MEMO</label><textarea defaultValue="Operations reserve transfer" /></div>
          </form>
        </section>
        <aside className="review-card"><h3>Review instruction</h3><div className="review-line"><span>From</span><strong>Checking · 1842</strong></div><div className="review-line"><span>To</span><strong>Reserve · 7812</strong></div><div className="review-line"><span>Rail</span><strong>Internal</strong></div><div className="review-line"><span>Fee</span><strong>$0.00</strong></div><div className="review-total"><span>Total debit</span><strong>$2,500.00</strong></div><button type="button">Review transfer</button><div className="notice">Simulation only. Submitting this instruction never reaches a real banking or payment network.</div></aside>
      </div>
    </>
  );
}

function GenericCustomerSection({ section }: { section: string }) {
  const titles: Record<string, [string, string]> = {
    accounts: ["Your accounts", "Manage balances and inspect the immutable ledger behind each account."],
    beneficiaries: ["Beneficiaries", "Saved internal, domestic, and international simulated recipients."],
    loans: ["Loans", "Apply for and track simulated credit facilities."],
    statements: ["Statements", "Generate dynamic PDF or CSV statements from posted ledger activity."],
    support: ["Customer support", "Open a ticket and continue the conversation with the operations team."],
    security: ["Security", "Review sessions, password status, and account access controls."],
  };
  const [title, copy] = titles[section] ?? ["Portal", "Northstar simulated banking."];
  return <><div className="overview-head"><div><h2>{title}</h2><p>{copy}</p></div><button className="primary-action"><Plus size={14}/> Create new</button></div><div className="section-card"><div className="section-title"><div><h2>{title}</h2><p>All records shown below are synthetic training data.</p></div></div><table className="activity-table"><thead><tr><th>Reference</th><th>Status</th><th className="money">Value</th></tr></thead><tbody><tr><td><div className="transaction-name"><span className="transaction-icon"><Building2 size={13}/></span><div><b>Northstar primary record</b><small>Updated today</small></div></div></td><td><span className="status-pill">Active</span></td><td className="money">$25,680.40</td></tr><tr><td><div className="transaction-name"><span className="transaction-icon"><FileText size={13}/></span><div><b>Secondary training record</b><small>Updated Jul 20</small></div></div></td><td><span className="status-pill warn">Pending</span></td><td className="money">$10,580.00</td></tr></tbody></table></div></>;
}

function AdminContent({ section }: { section?: string }) {
  if (section) return <AdminSection section={section} />;
  const customers = [
    ["Alex Morgan", "C-882104", "Active", "$104,020.62"],
    ["Maya Chen", "C-882088", "KYC review", "$0.00"],
    ["Daniel Foster", "C-881972", "Transfer stop", "$32,802.10"],
    ["Nora Singh", "C-881940", "Active", "$18,447.82"],
  ];
  return (
    <>
      <div className="overview-head"><div><h2>Operational picture</h2><p>Live state of the Northstar simulated banking environment.</p></div><button className="primary-action"><Plus size={14}/> Fund account</button></div>
      <div className="admin-kpi-grid">
        <div className="kpi-card"><div className="kpi-top"><span>ACTIVE CUSTOMERS</span><Users size={15}/></div><strong>1,248</strong><p className="good">↑ 18 this week</p></div>
        <div className="kpi-card"><div className="kpi-top"><span>DEPOSIT BALANCE</span><CircleDollarSign size={15}/></div><strong>$8.42m</strong><p>Across 1,936 accounts</p></div>
        <div className="kpi-card"><div className="kpi-top"><span>PENDING KYC</span><CheckCircle2 size={15}/></div><strong>14</strong><p>4 require attention</p></div>
        <div className="kpi-card"><div className="kpi-top"><span>ACTIVE STOPS</span><ShieldAlert size={15}/></div><strong>7</strong><p>2 system · 5 account</p></div>
      </div>
      <div className="admin-grid">
        <div className="panel"><div className="panel-head"><h3>Customer activity</h3><Link href="/admin/customers">View directory</Link></div><table className="activity-table"><thead><tr><th>Customer</th><th>Status</th><th className="money">Relationship</th></tr></thead><tbody>{customers.map(([name,id,status,value])=><tr key={id}><td><div className="transaction-name"><span className="transaction-icon">{name.split(" ").map(x=>x[0]).join("")}</span><div><b>{name}</b><small>{id}</small></div></div></td><td><span className={`status-pill ${status === "KYC review" ? "warn" : status.includes("stop") ? "block" : ""}`}>{status}</span></td><td className="money">{value}</td></tr>)}</tbody></table></div>
        <div className="panel"><div className="panel-head"><h3>Operations feed</h3><button>Audit log</button></div><div className="ops-list"><div className="ops-item"><span><CircleDollarSign size={13}/></span><div><b>Account funded</b><small>$25,000 · J. Bell</small></div><time>09:48</time></div><div className="ops-item"><span><ShieldAlert size={13}/></span><div><b>Stop code applied</b><small>TRANSFER_STOP · S. Okafor</small></div><time>09:31</time></div><div className="ops-item"><span><CheckCircle2 size={13}/></span><div><b>KYC approved</b><small>Maya Chen · A. Fields</small></div><time>09:20</time></div><div className="ops-item"><span><BookOpen size={13}/></span><div><b>Ledger reconciled</b><small>0 variances · System</small></div><time>09:00</time></div></div></div>
      </div>
      <div className="panel" style={{marginTop:14}}><div className="panel-head"><h3>Control environment</h3></div><div className="risk-band"><div><strong>100%</strong><span>Balanced postings</span></div><div><strong>0</strong><span>Reconciliation variances</span></div><div><strong>342ms</strong><span>Average posting time</span></div></div></div>
    </>
  );
}

function AdminSection({ section }: { section: string }) {
  const label = section.replaceAll("-", " ");
  return <><div className="overview-head"><div><h2>{label.charAt(0).toUpperCase()+label.slice(1)}</h2><p>Authorized operations workspace. Every action is appended to the audit chain.</p></div><button className="primary-action"><Plus size={14}/> New operation</button></div><div className="section-card"><div className="section-title"><div><h2>Operations queue</h2><p>Filtered synthetic records requiring review or action.</p></div></div><table className="activity-table"><thead><tr><th>Record</th><th>Owner</th><th>Status</th><th className="money">Updated</th></tr></thead><tbody><tr><td><b>OP-2026-07142</b></td><td>Sarah Okafor</td><td><span className="status-pill warn">Review</span></td><td className="money">2 min ago</td></tr><tr><td><b>OP-2026-07141</b></td><td>James Bell</td><td><span className="status-pill">Completed</span></td><td className="money">14 min ago</td></tr><tr><td><b>OP-2026-07140</b></td><td>System</td><td><span className="status-pill block">Blocked</span></td><td className="money">21 min ago</td></tr></tbody></table></div></>;
}
