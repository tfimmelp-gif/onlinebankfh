"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  Activity,
  ArrowRightLeft,
  Bell,
  BookOpen,
  Building2,
  Camera,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  CircleGauge,
  Clock3,
  Coins,
  Eye,
  EyeOff,
  FileText,
  FileImage,
  Flag,
  Globe2,
  Headphones,
  KeyRound,
  Landmark,
  LockKeyhole,
  LogOut,
  Menu,
  PiggyBank,
  Plus,
  RefreshCw,
  Palette,
  Calculator,
  Search,
  Server,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Users,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";
import "../app/portal.css";
import {
  CustomerWorkspace,
  TransferRequestDetails,
  transferRequestStatusLabel,
  transferRequestStatusTone,
} from "./CustomerWorkspaces";
import { formatMoney, useBankingData, type BankingTransferRequest } from "./useBankingData";
import { LiveChatPanel } from "./LiveChatPanel";
import { useLanguage } from "./LanguageProvider";

const customerNav = [
  { href: "/app", label: "Overview", icon: CircleGauge },
  { href: "/app/profile", label: "Profile & KYC", icon: Users },
  { href: "/app/accounts", label: "Accounts", icon: WalletCards },
  { href: "/app/deposits", label: "Deposit funds", icon: CircleDollarSign },
  { href: "/app/cards", label: "Virtual cards", icon: CreditCard },
  { href: "/app/transfers", label: "Transfers", icon: ArrowRightLeft },
  { href: "/app/bill-pay", label: "Bill pay", icon: FileText },
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
  { href: "/admin/kyc-files", label: "KYC documents", icon: FileImage },
  { href: "/admin/activity", label: "Customer activity", icon: Activity },
  { href: "/admin/accounts", label: "Accounts", icon: WalletCards },
  { href: "/admin/cards", label: "Card approvals", icon: CreditCard },
  { href: "/admin/transactions", label: "Transactions", icon: BookOpen },
  { href: "/admin/statement-onboarding", label: "Statement onboarding", icon: FileText },
  { href: "/admin/deposits", label: "Deposits", icon: CircleDollarSign },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowDownToLine },
  { href: "/admin/e-currency", label: "E-currency methods", icon: Coins },
  { href: "/admin/transfers", label: "Transfers", icon: ArrowRightLeft },
  { href: "/admin/transfer-errors", label: "Transfer errors", icon: ShieldAlert },
  { href: "/admin/loans", label: "Loans", icon: Landmark },
  { href: "/admin/support", label: "Support", icon: Headphones },
  { section: "CONTROL" },
  { href: "/admin/ledger", label: "Ledger", icon: BookOpen },
  { href: "/admin/stop-codes", label: "Stop codes", icon: ShieldAlert },
  { href: "/admin/audit", label: "Audit log", icon: FileText },
  { href: "/admin/website", label: "Website management", icon: Globe2 },
  { href: "/admin/branding", label: "Multi-branding", icon: Palette },
  { href: "/admin/fees", label: "Processing fees", icon: Calculator },
  { href: "/admin/system", label: "System", icon: Settings },
];

type NavItem = { href?: string; label?: string; icon?: React.ComponentType<{ size?: number }> ; section?: string };

function localDateTimeInputValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localDateInputValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function LivePortalDateTime({ isAdmin }: { isAdmin: boolean }) {
  const {localeTag,t}=useLanguage();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);
  if (!now) return <>{isAdmin ? `Northstar · ${t("MFA verified")}` : t("Loading current date and time…")}</>;
  const current = new Intl.DateTimeFormat(localeTag, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(now);
  return <>{isAdmin ? `${t("MFA verified")} · ${current}` : current}</>;
}

function CurrentDateTimeInput({ name = "effectiveAt", required = true }: { name?: string; required?: boolean }) {
  const [value, setValue] = useState("");
  const [edited, setEdited] = useState(false);
  useEffect(() => {
    const update = () => {
      if (!edited) setValue(localDateTimeInputValue());
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, [edited]);
  return <input name={name} type="datetime-local" value={value} onChange={(event) => { setEdited(true); setValue(event.target.value); }} required={required}/>;
}

function CurrentDateInput({ name, daysAhead = 0 }: { name?: string; daysAhead?: number }) {
  const [value, setValue] = useState(()=>{const date=new Date();date.setDate(date.getDate()+daysAhead);return localDateInputValue(date);});
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    const frame=window.requestAnimationFrame(()=>setValue(localDateInputValue(date)));
    return()=>window.cancelAnimationFrame(frame);
  }, [daysAhead]);
  return <input name={name} type="date" value={value} min={value ? localDateInputValue() : undefined} onChange={(event)=>setValue(event.target.value)} required/>;
}

function CurrentMonthInput() {
  const [value, setValue] = useState(()=>localDateInputValue().slice(0,7));
  return <input type="month" value={value} onChange={(event)=>setValue(event.target.value)}/>;
}

function localDateTimeDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return localDateTimeInputValue(date);
}

export function PortalShell({ mode, section }: { mode: "customer" | "admin"; section?: string }) {
  const {t}=useLanguage();
  const pathname = usePathname();
  const isAdmin = mode === "admin";
  const [customerMenuOpen,setCustomerMenuOpen] = useState(false);
  const [mobileAdminNavOpen,setMobileAdminNavOpen] = useState(false);
  const { customers: sessionCustomers,brandProfiles } = useBankingData(isAdmin ? "admin" : "customer");
  const activeBrand=brandProfiles.find((brand)=>brand.active)??brandProfiles[0];
  const signedInCustomer = sessionCustomers[0];
  const customerName = signedInCustomer ? `${signedInCustomer.firstName} ${signedInCustomer.lastName}`.trim() : "Customer";
  const customerInitials = signedInCustomer ? `${signedInCustomer.firstName[0] ?? ""}${signedInCustomer.lastName[0] ?? ""}`.toUpperCase() : "CU";
  const customerNumber = signedInCustomer?.userId ?? "Loading";
  const nav = (isAdmin ? adminNav : customerNav) as NavItem[];
  const rawTitle = section ? section.replaceAll("-", " ") : isAdmin ? "Operations center" : "Overview";
  const title = t(rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1));

  async function signOutAdmin() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.assign("/admin/login");
  }

  async function signOutCustomer() {
    setCustomerMenuOpen(false);
    try {
      await fetch("/api/customer/session", { method: "DELETE" });
    } finally {
      window.location.replace("/login");
    }
  }

  return (
    <main className={`portal-page ${isAdmin ? "admin-page" : ""}`} style={activeBrand?{"--blue":activeBrand.primaryColor} as React.CSSProperties:undefined}>
      <div className="portal-shell">
        <aside className="portal-sidebar">
          <Link href="/" className="portal-brand" aria-label={`${activeBrand?.bankName??"Northstar Bank"} home`}>{activeBrand?.logoUrl?<span className="portal-brand-logo"><img src={activeBrand.logoUrl} alt=""/></span>:<><span><Sparkles size={16}/></span>{activeBrand?.shortName??"NORTHSTAR"}</>}</Link>
          <nav className="portal-nav">
            {nav.map((item, index) =>
              item.section ? <div className="nav-section" key={`${item.section}-${index}`}>{t(item.section)}</div> : (
                <Link key={item.href} href={item.href!} className={pathname === item.href ? "active" : ""}>
                  {item.icon && <item.icon size={16} />} {t(item.label ?? "")}
                </Link>
              )
            )}
          </nav>
          <div className="portal-profile">
            <span>{isAdmin ? "SO" : customerInitials}</span>
            <div><b>{isAdmin ? "Sarah Okafor" : customerName}</b><small>{isAdmin ? "Operations admin" : `Customer · ${customerNumber}`}</small></div>
            {isAdmin
              ? <ChevronDown size={13}/>
              : <button type="button" className="portal-profile-logout" aria-label="Log out of customer portal" title="Log out" onClick={signOutCustomer}><LogOut size={14}/></button>}
          </div>
        </aside>
        <section className="portal-main">
          <header className="portal-header">
            {isAdmin&&<button type="button" className="mobile-admin-nav-trigger" aria-label={t("Open admin navigation")} aria-expanded={mobileAdminNavOpen} onClick={()=>setMobileAdminNavOpen(true)}><Menu size={19}/></button>}
            <div className="portal-header-title"><h1>{title}</h1><p><LivePortalDateTime isAdmin={isAdmin}/></p></div>
            <div className="header-tools"><button aria-label="Search"><Search size={15} /></button><button aria-label="Notifications"><Bell size={15} /></button>{isAdmin ? <button aria-label="Sign out" onClick={signOutAdmin}><LogOut size={15}/></button> : <div className="customer-menu-wrap"><button className="customer-menu-trigger" aria-label="Customer menu" aria-expanded={customerMenuOpen} onClick={()=>setCustomerMenuOpen((open)=>!open)}><span>{customerInitials}</span><ChevronDown size={14}/></button>{customerMenuOpen&&<div className="customer-menu" role="menu"><div><b>{customerName}</b><small>Customer {customerNumber}</small></div><Link role="menuitem" href="/app/profile" onClick={()=>setCustomerMenuOpen(false)}><Users size={14}/>Profile & identity</Link><Link role="menuitem" href="/app/security" onClick={()=>setCustomerMenuOpen(false)}><LockKeyhole size={14}/>Security center</Link><Link role="menuitem" href="/app/statements" onClick={()=>setCustomerMenuOpen(false)}><FileText size={14}/>Statements</Link><Link role="menuitem" href="/app/support" onClick={()=>setCustomerMenuOpen(false)}><Headphones size={14}/>Support</Link><button type="button" role="menuitem" className="customer-menu-logout" onClick={signOutCustomer}><LogOut size={14}/>Log out</button></div>}</div>}</div>
          </header>
          <div className="portal-content">
            {isAdmin ? <AdminContent section={section} /> : <CustomerContent section={section} />}
          </div>
        </section>
      </div>
      {isAdmin&&mobileAdminNavOpen&&<div className="mobile-admin-nav-backdrop" role="presentation" onClick={()=>setMobileAdminNavOpen(false)}>
        <aside className="mobile-admin-nav-drawer" role="dialog" aria-modal="true" aria-label={t("Admin navigation")} onClick={(event)=>event.stopPropagation()}>
          <div className="mobile-admin-nav-head">
            <Link href="/" className="portal-brand" aria-label={`${activeBrand?.bankName??"Northstar Bank"} home`} onClick={()=>setMobileAdminNavOpen(false)}>{activeBrand?.logoUrl?<span className="portal-brand-logo"><img src={activeBrand.logoUrl} alt=""/></span>:<><span><Sparkles size={16}/></span>{activeBrand?.shortName??"NORTHSTAR"}</>}</Link>
            <button type="button" aria-label={t("Close admin navigation")} onClick={()=>setMobileAdminNavOpen(false)}><X size={19}/></button>
          </div>
          <nav className="portal-nav">
            {adminNav.map((item,index)=>item.section?<div className="nav-section" key={`${item.section}-${index}`}>{t(item.section)}</div>:<Link key={item.href} href={item.href!} className={pathname===item.href?"active":""} onClick={()=>setMobileAdminNavOpen(false)}>{item.icon&&<item.icon size={17}/>} {t(item.label??"")}</Link>)}
          </nav>
          <div className="mobile-admin-account"><span>SO</span><div><b>Sarah Okafor</b><small>{t("Operations admin")}</small></div><button type="button" aria-label={t("Sign out")} onClick={signOutAdmin}><LogOut size={16}/></button></div>
        </aside>
      </div>}
    </main>
  );
}

function CustomerContent({ section }: { section?: string }) {
  if (section) return <CustomerWorkspace section={section} />;
  return <CustomerOverview />;
}

function resizeProfilePhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      reject(new Error("Choose a JPEG, PNG, or WebP image."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("The selected image is not valid."));
      image.onload = () => {
        const maximumSide = 512;
        const scale = Math.min(1, maximumSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("The image could not be prepared."));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.84));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function CustomerOverview() {
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profilePhotoSaving, setProfilePhotoSaving] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState("");
  const [balancesVisible, setBalancesVisible] = useState(true);
  const [selectedRequest,setSelectedRequest] = useState<BankingTransferRequest | null>(null);
  const { customers, accounts, transactions, transferRequests } = useBankingData("customer");
  const customer = customers[0];
  const customerName = customer ? `${customer.firstName} ${customer.lastName}`.trim() : "Customer";
  const customerInitials = customer ? `${customer.firstName[0] ?? ""}${customer.lastName[0] ?? ""}`.toUpperCase() : "CU";
  const customerAccounts = accounts;
  const checking = customerAccounts.find((account) => account.type === "CHECKING");
  const savings = customerAccounts.find((account) => account.type === "SAVINGS");
  const totalBalanceMinor = customerAccounts.reduce((sum, account) => sum + account.balanceMinor, 0);
  const customerAccountIds = new Set(customerAccounts.map((account) => account.id));
  const postedCustomerTransactions = transactions.filter((transaction) =>
    customerAccountIds.has(transaction.accountId)
    && transaction.status === "POSTED"
    && !transaction.reference.startsWith("EXTSET-")
  );
  const inflowMinor = postedCustomerTransactions
    .filter((transaction) => transaction.direction === "CREDIT")
    .reduce((sum, transaction) => sum + transaction.amountMinor, 0);
  const outflowMinor = postedCustomerTransactions
    .filter((transaction) => transaction.direction === "DEBIT")
    .reduce((sum, transaction) => sum + transaction.amountMinor, 0);
  const pendingTransfers = transferRequests.filter((request) =>
    request.status === "PENDING" || request.status === "PROCESSING"
  );
  const checkingShare = totalBalanceMinor > 0
    ? Math.round(((checking?.balanceMinor ?? 0) / totalBalanceMinor) * 100)
    : 0;
  const displayMoney = (minor: number) => balancesVisible ? formatMoney(minor) : "••••••";
  const postedActivity = transactions
    .filter((transaction) =>
      customerAccounts.some((account) => account.id === transaction.accountId)
      && !transaction.reference.startsWith("EXTSET-"))
    .map((transaction) => ({
      id: transaction.reference,
      name: transaction.description,
      date: `Posted ${new Date(transaction.effectiveAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
      account: transaction.accountNumber.endsWith("1842") ? "Checking" : "Savings",
      amount: `${transaction.direction === "CREDIT" ? "+" : "−"}${formatMoney(transaction.amountMinor)}`,
      tone: transaction.direction === "CREDIT" ? "credit" : "",
      direction: transaction.direction,
      createdAt: transaction.effectiveAt,
      request: null as BankingTransferRequest | null,
    }));
  const pendingExternalActivity = transferRequests
    .filter((request)=>request.userId===customer?.userId)
    .map((request)=>({
      id: request.reference,
      name: request.recipientName,
      date: `${request.rail==="ACH"?"ACH":request.rail==="DOMESTIC_WIRE"?"Domestic wire":"International wire"} · ${transferRequestStatusLabel(request.status)}`,
      account: `Checking · ${request.sourceAccountNumber.slice(-4)}`,
      amount: `−${formatMoney(request.amountMinor)}`,
      tone: request.status==="COMPLETED"?"":transferRequestStatusTone(request.status)==="block"?"blocked":"pending",
      direction: request.status==="COMPLETED"?"DEBIT":"PENDING",
      createdAt: request.requestedAt,
      request,
    }));
  const currentActivity = [...postedActivity,...pendingExternalActivity]
    .sort((left,right)=>new Date(right.createdAt).getTime()-new Date(left.createdAt).getTime())
    .slice(0,5);
  const visibleActivity = currentActivity;

  useEffect(()=>{
    if (!selectedRequest) return;
    const current=transferRequests.find((request)=>request.id===selectedRequest.id);
    if (current&&(current.status!==selectedRequest.status||current.holdState!==selectedRequest.holdState)) {
      const frame=window.requestAnimationFrame(()=>setSelectedRequest(current));
      return()=>window.cancelAnimationFrame(frame);
    }
  },[selectedRequest,transferRequests]);

  useEffect(() => {
    let active = true;
    fetch("/api/customer/profile/photo", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("PROFILE_PHOTO_READ_FAILED");
        return response.json() as Promise<{ profilePhotoDataUrl?: string | null }>;
      })
      .then((result) => {
        if (active) setProfilePhoto(result.profilePhotoDataUrl ?? "");
      })
      .catch(() => {
        if (active) setProfilePhotoError("Saved profile photo could not be loaded.");
      });
    return () => { active = false; };
  }, []);

  async function changeProfilePhoto(file?: File) {
    if (!file) return;
    setProfilePhotoSaving(true);
    setProfilePhotoError("");
    try {
      const profilePhotoDataUrl = await resizeProfilePhoto(file);
      const response = await fetch("/api/customer/profile/photo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profilePhotoDataUrl }),
      });
      const result = await response.json() as { profilePhotoDataUrl?: string; error?: string };
      if (!response.ok || !result.profilePhotoDataUrl) {
        throw new Error(result.error ?? "Profile photo could not be saved.");
      }
      setProfilePhoto(result.profilePhotoDataUrl);
    } catch (error) {
      setProfilePhotoError(error instanceof Error ? error.message.replaceAll("_", " ").toLowerCase().replace(/^./, (letter) => letter.toUpperCase()) : "Profile photo could not be saved.");
    } finally {
      setProfilePhotoSaving(false);
    }
  }

  return (
    <div className="customer-dashboard">
      <section className="customer-dashboard-intro" aria-labelledby="customer-welcome-title">
        <div className="customer-identity">
          <div className="customer-photo-frame">
            {profilePhoto ? <img src={profilePhoto} alt={`${customerName} profile`}/> : <span>{customerInitials}</span>}
            <label title={profilePhotoSaving ? "Saving profile photo" : "Change profile photo"} aria-busy={profilePhotoSaving}><Camera size={14}/><input type="file" accept="image/png,image/jpeg,image/webp" disabled={profilePhotoSaving} onChange={(event)=>changeProfilePhoto(event.target.files?.[0])}/></label>
          </div>
          <div className="customer-welcome-copy">
            <span className="customer-eyebrow">PERSONAL BANKING</span>
            <h2 id="customer-welcome-title">Welcome back, {customer?.firstName ?? "Customer"}.</h2>
            <p>Customer {customer?.userId ?? ""} · Your finances at a glance.</p>
            {profilePhotoError&&<small className="profile-photo-error">{profilePhotoError}</small>}
          </div>
        </div>
        <div className="customer-dashboard-actions">
          <Link href="/app/deposits" className="dashboard-secondary-action"><ArrowDownToLine size={16}/>Deposit funds</Link>
          <Link href="/app/transfers" className="primary-action"><ArrowRightLeft size={16}/>Move money</Link>
        </div>
      </section>

      <section className="customer-balance-hero" aria-label="Balance overview">
        <div className="balance-hero-main">
          <div className="balance-hero-label">
            <span>Total balance</span>
            <button type="button" onClick={()=>setBalancesVisible((visible)=>!visible)} aria-label={balancesVisible ? "Hide balances" : "Show balances"}>
              {balancesVisible ? <Eye size={17}/> : <EyeOff size={17}/>}
            </button>
          </div>
          <strong>{displayMoney(totalBalanceMinor)}</strong>
          <p><ShieldCheck size={15}/>Synced with your posted account ledger</p>
          <div className="balance-hero-links">
            <Link href="/app/accounts">View accounts <ArrowUpRight size={15}/></Link>
            <Link href="/app/statements">Download statement <FileText size={15}/></Link>
          </div>
        </div>
        <div className="balance-hero-insights">
          <div className="portfolio-summary">
            <div><span>Portfolio mix</span><b>{customerAccounts.length} active accounts</b></div>
            <div className="portfolio-bar" aria-label={`${checkingShare}% checking and ${100-checkingShare}% savings`}>
              <span style={{width:`${checkingShare}%`}}/>
            </div>
            <div className="portfolio-legend"><span><i className="checking-dot"/>Checking {checkingShare}%</span><span><i className="savings-dot"/>Savings {100-checkingShare}%</span></div>
          </div>
          <div className="cashflow-grid">
            <div><span><ArrowDownToLine size={15}/>Posted in</span><b>{displayMoney(inflowMinor)}</b></div>
            <div><span><ArrowUpRight size={15}/>Posted out</span><b>{displayMoney(outflowMinor)}</b></div>
          </div>
        </div>
      </section>

      <section className="customer-account-strip" aria-label="Your accounts">
        <Link href="/app/accounts" className="customer-account-tile">
          <span className="account-tile-icon checking"><CircleDollarSign size={18}/></span>
          <div><span>Everyday Checking</span><strong>{displayMoney(checking?.balanceMinor ?? 0)}</strong><small>Available balance</small></div>
          <div className="account-tile-meta"><b>{checking?.accountNumber ?? "7730191842"}</b><span>Active</span></div>
          <ArrowUpRight className="account-tile-arrow" size={17}/>
        </Link>
        <Link href="/app/accounts" className="customer-account-tile">
          <span className="account-tile-icon savings"><PiggyBank size={18}/></span>
          <div><span>Growth Savings</span><strong>{displayMoney(savings?.balanceMinor ?? 0)}</strong><small>Available balance</small></div>
          <div className="account-tile-meta"><b>{savings?.accountNumber ?? "7730199081"}</b><span>Active</span></div>
          <ArrowUpRight className="account-tile-arrow" size={17}/>
        </Link>
      </section>

      <div className="customer-dashboard-grid">
        <section className="panel customer-activity-panel">
          <div className="panel-head">
            <div><span className="customer-panel-kicker">LATEST POSTINGS</span><h3>Recent activity</h3></div>
            <Link href="/app/statements">View all activity <ArrowUpRight size={14}/></Link>
          </div>
          <div className="customer-activity-list">
            {visibleActivity.map((item) => (
              <button type="button" className={`customer-activity-row ${item.request?"clickable":""}`} key={item.id} onClick={()=>item.request&&setSelectedRequest(item.request)}>
                <span className={`customer-activity-icon ${item.direction.toLowerCase()}`}>
                  {item.direction === "CREDIT" ? <ArrowDownToLine size={16}/> : item.direction === "PENDING" ? <Clock3 size={16}/> : <ArrowUpRight size={16}/>}
                </span>
                <span className="customer-activity-name"><b>{item.name}</b><small>{item.date}</small></span>
                <span className="customer-activity-account">{item.account}</span>
                <span className={`customer-activity-amount ${item.tone}`}>{item.amount}<small>{item.tone === "pending" ? "In review" : item.tone === "blocked" ? "Action needed" : "Posted"}</small></span>
                {item.request&&<ChevronDown className="customer-activity-chevron" size={15}/>}
              </button>
            ))}
            {visibleActivity.length === 0 && <div className="empty-ledger">No transactions have been posted to this account yet.</div>}
          </div>
        </section>

        <aside className="dashboard-side-stack">
          <section className="panel dashboard-actions-panel">
            <div className="panel-head"><div><span className="customer-panel-kicker">SHORTCUTS</span><h3>Quick actions</h3></div></div>
            <div className="dashboard-action-rail">
              <Link href="/app/transfers"><span><ArrowRightLeft size={17}/></span><div><b>Transfer</b><small>Send or move money</small></div><ArrowUpRight size={14}/></Link>
              <Link href="/app/deposits"><span><ArrowDownToLine size={17}/></span><div><b>Deposit</b><small>Bank or crypto funding</small></div><ArrowUpRight size={14}/></Link>
              <Link href="/app/bill-pay"><span><FileText size={17}/></span><div><b>Pay a bill</b><small>One-time or scheduled</small></div><ArrowUpRight size={14}/></Link>
              <Link href="/app/statements"><span><BookOpen size={17}/></span><div><b>Statements</b><small>View or download</small></div><ArrowUpRight size={14}/></Link>
            </div>
          </section>

          <section className="panel next-up-card">
            <div className="panel-head"><div><span className="customer-panel-kicker">NEXT UP</span><h3>Account tasks</h3></div></div>
            <Link href="/app/transfers" className="next-up-item"><span className="next-up-icon"><Clock3 size={16}/></span><div><b>{pendingTransfers.length || "No"} pending transfer{pendingTransfers.length === 1 ? "" : "s"}</b><small>{pendingTransfers.length ? "Track approval and release status" : "Your transfer queue is clear"}</small></div><ChevronDown size={15}/></Link>
            <Link href="/app/loans" className="next-up-item"><span className="next-up-icon loan"><Landmark size={16}/></span><div><b>$842.16 payment due</b><small>Equipment loan · August 1</small></div><ChevronDown size={15}/></Link>
            <Link href="/app/security" className="dashboard-security-note"><ShieldCheck size={17}/><div><b>Security center</b><small>Review sign-in activity and MFA</small></div><ArrowUpRight size={14}/></Link>
          </section>
        </aside>
      </div>
      {selectedRequest&&<TransferRequestDetails request={selectedRequest} close={()=>setSelectedRequest(null)}/>}
    </div>
  );
}

function TransferForm() {
  return (
    <>
      <div className="overview-head"><div><h2>New transfer</h2><p>Move USD between your accounts, another customer, or an external beneficiary.</p></div></div>
      <div className="transfer-layout">
        <section className="section-card">
          <div className="section-title"><div><h2>Transfer details</h2><p>All instructions are validated against active stop codes before posting.</p></div></div>
          <form className="form-grid">
            <div className="form-row"><div className="field"><label>TRANSFER TYPE</label><select defaultValue="INTERNAL"><option>Internal</option><option>Domestic</option><option>International</option></select></div><div className="field"><label>FROM ACCOUNT</label><select><option>Everyday Checking · 1842 — $25,680.40</option><option>Growth Savings · 9081 — $78,340.22</option></select></div></div>
            <div className="field"><label>BENEFICIARY</label><select><option>Operations Reserve · 7812</option><option>Northstar Supply · 4088</option></select></div>
            <div className="form-row"><div className="field"><label>AMOUNT (USD)</label><input defaultValue="2,500.00" /></div><div className="field"><label>EXECUTION DATE</label><CurrentDateInput/></div></div>
            <div className="field"><label>STATEMENT MEMO</label><textarea defaultValue="Operations reserve transfer" /></div>
          </form>
        </section>
        <aside className="review-card"><h3>Review instruction</h3><div className="review-line"><span>From</span><strong>Checking · 1842</strong></div><div className="review-line"><span>To</span><strong>Reserve · 7812</strong></div><div className="review-line"><span>Rail</span><strong>Internal</strong></div><div className="review-line"><span>Fee</span><strong>$0.00</strong></div><div className="review-total"><span>Total debit</span><strong>$2,500.00</strong></div><button type="button">Review transfer</button><div className="notice">Review the destination and amount carefully before submitting this instruction.</div></aside>
      </div>
    </>
  );
}

function GenericCustomerSection({ section }: { section: string }) {
  const titles: Record<string, [string, string]> = {
    accounts: ["Your accounts", "Manage balances and inspect the immutable ledger behind each account."],
    beneficiaries: ["Beneficiaries", "Saved internal, domestic, and international recipients."],
    loans: ["Loans", "Apply for and track credit facilities."],
    statements: ["Statements", "Generate dynamic PDF or CSV statements from posted ledger activity."],
    support: ["Customer support", "Open a ticket and continue the conversation with the operations team."],
    security: ["Security", "Review sessions, password status, and account access controls."],
  };
  const [title, copy] = titles[section] ?? ["Portal", "Northstar digital banking."];
  return <><div className="overview-head"><div><h2>{title}</h2><p>{copy}</p></div><button className="primary-action"><Plus size={14}/> Create new</button></div><div className="section-card"><div className="section-title"><div><h2>{title}</h2><p>All records shown below reflect the latest account activity.</p></div></div><table className="activity-table"><thead><tr><th>Reference</th><th>Status</th><th className="money">Value</th></tr></thead><tbody><tr><td><div className="transaction-name"><span className="transaction-icon"><Building2 size={13}/></span><div><b>Northstar primary record</b><small>Updated today</small></div></div></td><td><span className="status-pill">Active</span></td><td className="money">$25,680.40</td></tr><tr><td><div className="transaction-name"><span className="transaction-icon"><FileText size={13}/></span><div><b>Secondary account record</b><small>Updated Jul 20</small></div></div></td><td><span className="status-pill warn">Pending</span></td><td className="money">$10,580.00</td></tr></tbody></table></div></>;
}

function AdminCustomerActivityWorkspace(){
  const {customers,customerActivity,refresh}=useBankingData();
  const [customerId,setCustomerId]=useState("ALL");
  const [actionType,setActionType]=useState("ALL");
  useEffect(()=>{const timer=window.setInterval(()=>{if(document.visibilityState==="visible")void refresh();},10_000);return()=>window.clearInterval(timer);},[refresh]);
  const rows=customerActivity.filter(item=>(customerId==="ALL"||item.userId===customerId)&&(actionType==="ALL"||item.actionType===actionType));
  const actionTypes=Array.from(new Set(customerActivity.map(item=>item.actionType))).sort();
  return <><div className="overview-head"><div><h2>Real-time customer activity</h2><p>Live operational events from logins, transfers, deposits, KYC uploads, and customer support.</p></div><span className="live-activity-indicator"><i/>Live · refreshes every 3 seconds</span></div>
    <section className="section-card"><div className="section-title"><div><h2>Customer action stream</h2><p>Newest verified server event first.</p></div><div className="table-tools"><select value={customerId} onChange={event=>setCustomerId(event.target.value)}><option value="ALL">All customers</option>{customers.map(customer=><option key={customer.userId} value={customer.userId}>{customer.firstName} {customer.lastName}</option>)}</select><select value={actionType} onChange={event=>setActionType(event.target.value)}><option value="ALL">All actions</option>{actionTypes.map(type=><option key={type}>{type}</option>)}</select></div></div>
      <table className="activity-table admin-workspace-table"><thead><tr><th>Customer</th><th>Action</th><th>Status</th><th>Time</th></tr></thead><tbody>{rows.map(item=><tr key={`${item.actionType}-${item.id}`}><td><div className="transaction-name"><span className="transaction-icon"><Activity size={13}/></span><div><b>{item.customerName}</b><small>{item.userId}</small></div></div></td><td><b>{item.actionType.replaceAll("_"," ")}</b><br/><small>{item.summary}</small></td><td><span className={`status-pill ${["FAILED","REJECTED","ENDED"].includes(item.status)?"block":["PENDING","WAITING","PROCESSING","UPLOADED"].includes(item.status)?"warn":""}`}>{item.status}</span></td><td>{new Date(item.occurredAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"medium"})}</td></tr>)}</tbody></table>{!rows.length&&<div className="empty-ledger">No matching customer actions have been recorded.</div>}</section></>;
}

function AdminKycFilesWorkspace(){
  const {customers,kycDocuments,refresh}=useBankingData();const [customerId,setCustomerId]=useState("ALL");const [notice,setNotice]=useState("");const [submitting,setSubmitting]=useState("");
  const rows=kycDocuments.filter(document=>customerId==="ALL"||document.userId===customerId);
  async function review(documentId:string,decision:"REVIEWED"|"REJECTED"){setSubmitting(documentId);const response=await fetch("/admin/api/kyc-files",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({documentId,decision})});const result=await response.json() as {error?:string};setSubmitting("");if(!response.ok){setNotice((result.error??"KYC_REVIEW_FAILED").replaceAll("_"," "));return;}await refresh();setNotice(`Document marked ${decision.toLowerCase()}.`);}
  return <><div className="overview-head"><div><h2>Customer KYC documents</h2><p>Review identity files uploaded through each customer’s protected profile.</p></div><span className="status-pill warn">{kycDocuments.filter(document=>document.status==="UPLOADED").length} awaiting review</span></div>{notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    <section className="section-card"><div className="section-title"><div><h2>Private document vault</h2><p>Files open through a staff-authenticated, non-cached endpoint.</p></div><div className="table-tools"><select value={customerId} onChange={event=>setCustomerId(event.target.value)}><option value="ALL">All customers</option>{customers.map(customer=><option key={customer.userId} value={customer.userId}>{customer.firstName} {customer.lastName}</option>)}</select></div></div>
      <table className="activity-table admin-workspace-table"><thead><tr><th>Document</th><th>Customer</th><th>Status</th><th>Uploaded</th><th></th></tr></thead><tbody>{rows.map(document=><tr key={document.id}><td><div className="transaction-name"><span className="transaction-icon"><FileImage size={13}/></span><div><b>{document.originalFilename}</b><small>{document.documentType} · {(document.byteSize/1024).toFixed(1)} KB</small></div></div></td><td>{document.customerName}<br/><small>{document.userId}</small></td><td><span className={`status-pill ${document.status==="UPLOADED"?"warn":document.status==="REJECTED"?"block":""}`}>{document.status}</span></td><td>{new Date(document.uploadedAt).toLocaleString()}</td><td className="kyc-file-actions"><a href={`/admin/api/kyc-files?documentId=${document.id}`} target="_blank" rel="noreferrer">View</a>{document.status==="UPLOADED"&&<><button disabled={submitting===document.id} onClick={()=>review(document.id,"REVIEWED")}>Approve</button><button className="reject" disabled={submitting===document.id} onClick={()=>review(document.id,"REJECTED")}>Reject</button></>}</td></tr>)}</tbody></table>{!rows.length&&<div className="empty-ledger">No KYC documents have been uploaded yet.</div>}</section></>;
}

function AdminBrandingWorkspace(){
  const {brandProfiles,mutate}=useBankingData();const [brandId,setBrandId]=useState("");const selected=brandProfiles.find(brand=>brand.id===brandId);const [bankName,setBankName]=useState("Northstar Bank");const [shortName,setShortName]=useState("NORTHSTAR");const [supportEmail,setSupportEmail]=useState("support@northstar.test");const [logoUrl,setLogoUrl]=useState("");const [primaryColor,setPrimaryColor]=useState("#2855d9");const [notice,setNotice]=useState("");const [error,setError]=useState("");const [saving,setSaving]=useState(false);const initializedBrandSelection=useRef(false);
  useEffect(()=>{if(initializedBrandSelection.current||!brandProfiles.length)return;initializedBrandSelection.current=true;setBrandId((brandProfiles.find(brand=>brand.active)??brandProfiles[0]).id);},[brandProfiles]);
  useEffect(()=>{if(!selected)return;const frame=window.requestAnimationFrame(()=>{setBankName(selected.bankName);setShortName(selected.shortName);setSupportEmail(selected.supportEmail);setLogoUrl(selected.logoUrl??"");setPrimaryColor(selected.primaryColor);});return()=>window.cancelAnimationFrame(frame);},[selected]);
  function fresh(){initializedBrandSelection.current=true;setBrandId("");setBankName("");setShortName("");setSupportEmail("");setLogoUrl("");setPrimaryColor("#2855d9");setError("");setNotice("");}
  async function save(event:React.FormEvent){event.preventDefault();setSaving(true);setError("");try{const result=await mutate({action:"BRAND_SAVE",brandId:brandId||undefined,bankName,shortName,supportEmail,logoUrl,primaryColor});if(result.id)setBrandId(result.id);const channel=new BroadcastChannel("northstar-brand");channel.postMessage({updated:true});channel.close();setNotice(selected?.active?"Active brand saved and refreshed across public and authenticated pages.":"Brand profile saved. Activate it when it is ready to go live.");}catch(saveError){setError(saveError instanceof Error?saveError.message.replaceAll("_"," "):"Unable to save brand");}finally{setSaving(false);}}
  async function activate(id:string){setSaving(true);setError("");try{await mutate({action:"BRAND_ACTIVATE",brandId:id});setBrandId(id);const channel=new BroadcastChannel("northstar-brand");channel.postMessage({updated:true});channel.close();setNotice("Active bank brand changed across the homepage, sign-in, account-opening, and portal screens.");}catch(activationError){setError(activationError instanceof Error?activationError.message.replaceAll("_"," "):"Unable to activate brand");}finally{setSaving(false);}}
  async function uploadLogo(file?:File){if(!file)return;if(!bankName.trim()||!shortName.trim()||!supportEmail.trim()){setError("Complete the bank name, short name, and support email before uploading a logo.");return;}setSaving(true);setError("");try{const form=new FormData();form.set("file",file);const response=await fetch("/admin/api/brand-logo",{method:"POST",body:form});const result=await response.json() as {logoUrl?:string;error?:string};if(!response.ok||!result.logoUrl)throw new Error(result.error??"BRAND_LOGO_UPLOAD_FAILED");const saved=await mutate({action:"BRAND_SAVE",brandId:brandId||undefined,bankName,shortName,supportEmail,logoUrl:result.logoUrl,primaryColor});setLogoUrl(result.logoUrl);if(saved.id)setBrandId(saved.id);const channel=new BroadcastChannel("northstar-brand");channel.postMessage({updated:true});channel.close();setNotice(selected?.active?"Logo uploaded, saved, and refreshed across every branded screen.":"Logo uploaded and saved to this brand profile. Activate this profile to show it across the site.");}catch(uploadError){setError(uploadError instanceof Error?uploadError.message.replaceAll("_"," "):"Logo upload failed");}finally{setSaving(false);}}
  return <><div className="overview-head"><div><h2>Multi-brand management</h2><p>Create bank identities and switch the active logo, name, contact email, and primary color.</p></div><button type="button" className="primary-action" onClick={fresh}><Plus size={14}/>New brand</button></div>{notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}{error&&<div className="auth-error" role="alert">{error}</div>}<div className="branding-layout"><form className="section-card form-grid" onSubmit={save}><div className="section-title"><div><h2>{brandId?"Edit brand":"Create brand"}</h2><p>Changes are stored centrally and activated separately.</p></div></div><div className="form-row"><div className="field"><label>BANK NAME</label><input value={bankName} maxLength={120} onChange={e=>setBankName(e.target.value)} required/></div><div className="field"><label>SHORT DISPLAY NAME</label><input value={shortName} maxLength={30} onChange={e=>setShortName(e.target.value)} required/></div></div><div className="field"><label>SUPPORT EMAIL</label><input type="email" maxLength={254} value={supportEmail} onChange={e=>setSupportEmail(e.target.value)} required/></div><div className="field"><label>BANK LOGO</label><div className={`brand-logo-control ${logoUrl?"has-logo":""}`}>{logoUrl?<span className="brand-logo-current"><img src={logoUrl} alt="Current saved bank logo"/><span><b>Current logo saved</b><small>This image will remain after refresh. Choose another file to replace it.</small></span></span>:<span className="brand-logo-empty"><Sparkles size={18}/><span><b>No logo uploaded</b><small>Choose an image to add one.</small></span></span>}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={saving} onChange={event=>{void uploadLogo(event.target.files?.[0]);event.currentTarget.value="";}}/></div><small>PNG, JPG, or WebP up to 2 MB. Uploading saves the logo immediately.</small></div><div className="field"><label>LOGO URL</label><input value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="Uploaded logo path or https://…/logo.png"/></div><div className="field"><label>PRIMARY COLOR</label><input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)}/></div><button className="admin-execute" disabled={saving}>{saving?"Saving…":"Save brand profile"}</button></form><aside className="section-card brand-preview" style={{"--preview-brand":primaryColor} as React.CSSProperties}>{logoUrl?<img src={logoUrl} alt="Brand logo preview"/>:<span><Sparkles size={26}/></span>}<h2>{bankName||"Bank name"}</h2><p>{supportEmail||"support@example.com"}</p><button type="button" style={{background:primaryColor}}>Primary action</button></aside></div>
    <section className="section-card"><div className="section-title"><div><h2>Brand profiles</h2><p>Select a profile to edit or activate across the site.</p></div></div><div className="brand-profile-grid">{brandProfiles.map(brand=><article key={brand.id}><span style={{background:brand.primaryColor}}>{brand.logoUrl?<img src={brand.logoUrl} alt=""/>:<Sparkles size={16}/>}</span><div><b>{brand.bankName}</b><small>{brand.supportEmail}</small></div><span className={`status-pill ${brand.active?"":"warn"}`}>{brand.active?"ACTIVE":"INACTIVE"}</span><button type="button" disabled={saving} onClick={()=>setBrandId(brand.id)}>Edit</button>{!brand.active&&<button type="button" disabled={saving} onClick={()=>activate(brand.id)}>Activate</button>}</article>)}</div></section></>;
}

function AdminProcessingFeesWorkspace(){
  const {processingFeeRules,mutate}=useBankingData();const [rail,setRail]=useState<"INTERNAL"|"P2P"|"ACH"|"DOMESTIC_WIRE"|"INTERNATIONAL_WIRE">("ACH");const rule=processingFeeRules.find(item=>item.rail===rail);const [amount,setAmount]=useState("1000.00");const [percentageBps,setPercentageBps]=useState(25);const [fixed,setFixed]=useState("0.50");const [minimum,setMinimum]=useState("0.50");const [maximum,setMaximum]=useState("25.00");const [notice,setNotice]=useState("");
  useEffect(()=>{if(!rule)return;const frame=window.requestAnimationFrame(()=>{setPercentageBps(rule.percentageBps);setFixed((rule.fixedMinor/100).toFixed(2));setMinimum((rule.minimumMinor/100).toFixed(2));setMaximum(rule.maximumMinor===null?"":(rule.maximumMinor/100).toFixed(2));});return()=>window.cancelAnimationFrame(frame);},[rule]);
  const amountMinor=Math.max(0,Math.round(Number(amount||0)*100));const raw=Math.round(amountMinor*percentageBps/10000)+Math.round(Number(fixed||0)*100);const feeMinor=Math.min(maximum?Math.round(Number(maximum)*100):Number.MAX_SAFE_INTEGER,Math.max(Math.round(Number(minimum||0)*100),raw));
  async function save(event:React.FormEvent){event.preventDefault();try{await mutate({action:"FEE_RULE_SAVE",rail,percentageBps,fixedMinor:Math.round(Number(fixed)*100),minimumMinor:Math.round(Number(minimum)*100),maximumMinor:maximum?Math.round(Number(maximum)*100):null,active:1});setNotice(`${rail.replaceAll("_"," ")} fee rule saved.`);}catch(error){setNotice(error instanceof Error?error.message.replaceAll("_"," "):"Unable to save fee rule");}}
  return <><div className="overview-head"><div><h2>Processing fee calculator</h2><p>Configure fixed-plus-percentage fee rules with minimum and maximum caps.</p></div></div>{notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}<div className="fee-workspace"><form className="section-card form-grid" onSubmit={save}><div className="field"><label>TRANSFER TYPE</label><select value={rail} onChange={e=>setRail(e.target.value as typeof rail)}>{["INTERNAL","P2P","ACH","DOMESTIC_WIRE","INTERNATIONAL_WIRE"].map(item=><option key={item} value={item}>{item.replaceAll("_"," ")}</option>)}</select></div><div className="form-row"><div className="field"><label>PERCENTAGE (BASIS POINTS)</label><input type="number" min="0" max="10000" value={percentageBps} onChange={e=>setPercentageBps(Number(e.target.value))}/><small>100 basis points = 1%</small></div><div className="field"><label>FIXED FEE (USD)</label><input type="number" min="0" step="0.01" value={fixed} onChange={e=>setFixed(e.target.value)}/></div></div><div className="form-row"><div className="field"><label>MINIMUM FEE</label><input type="number" min="0" step="0.01" value={minimum} onChange={e=>setMinimum(e.target.value)}/></div><div className="field"><label>MAXIMUM FEE (OPTIONAL)</label><input type="number" min="0" step="0.01" value={maximum} onChange={e=>setMaximum(e.target.value)}/></div></div><button className="admin-execute">Save fee rule</button></form><aside className="section-card fee-calculator"><div className="section-title"><div><h2>Calculation preview</h2><p>Fee = percentage + fixed amount, bounded by configured caps.</p></div></div><div className="field"><label>PAYMENT AMOUNT (USD)</label><input type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></div><dl><div><dt>Payment amount</dt><dd>{formatMoney(amountMinor)}</dd></div><div><dt>Percentage component</dt><dd>{formatMoney(Math.round(amountMinor*percentageBps/10000))}</dd></div><div><dt>Fixed component</dt><dd>{formatMoney(Math.round(Number(fixed||0)*100))}</dd></div><div className="fee-total"><dt>Processing fee</dt><dd>{formatMoney(feeMinor)}</dd></div><div><dt>Total debit preview</dt><dd>{formatMoney(amountMinor+feeMinor)}</dd></div></dl></aside></div></>;
}

function AdminContent({ section }: { section?: string }) {
  if (section === "customers") return <AdminCustomersWorkspace />;
  if (section === "accounts") return <AdminAccountsWorkspace />;
  if (section === "cards") return <AdminCardsWorkspace />;
  if (section === "transactions") return <AdminTransactionsWorkspace />;
  if (section === "kyc") return <AdminKycWorkspace />;
  if (section === "kyc-files") return <AdminKycFilesWorkspace />;
  if (section === "activity") return <AdminCustomerActivityWorkspace />;
  if (section === "transfers") return <AdminTransferQueue />;
  if (section === "statement-onboarding") return <AdminStatementOnboarding />;
  if (section === "deposits") return <AdminDepositsWorkspace />;
  if (section === "stop-codes") return <AdminStopCodesWorkspace />;
  if (section === "website") return <AdminWebsiteWorkspace />;
  if (section === "branding") return <AdminBrandingWorkspace />;
  if (section === "fees") return <AdminProcessingFeesWorkspace />;
  if (section) return <AdminSection section={section} />;
  const customers = [
    ["Alex Morgan", "C-882104", "Active", "$104,020.62"],
    ["Maya Chen", "C-882088", "KYC review", "$0.00"],
    ["Daniel Foster", "C-881972", "Transfer stop", "$32,802.10"],
    ["Nora Singh", "C-881940", "Active", "$18,447.82"],
  ];
  return (
    <>
      <div className="overview-head"><div><h2>Operational picture</h2><p>Live state of Northstar banking operations.</p></div><button className="primary-action"><Plus size={14}/> Fund account</button></div>
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

function AdminCardsWorkspace(){
  const {virtualCardRequests,mutate}=useBankingData();const [reason,setReason]=useState("Card issuance reviewed by operations.");const [notice,setNotice]=useState("");const [error,setError]=useState("");const pending=virtualCardRequests.filter(item=>item.status==="PENDING");
  async function decide(id:string,decision:"APPROVE"|"REJECT"){setError("");try{await mutate({action:"VIRTUAL_CARD_DECISION",requestId:id,cardDecision:decision,reason});setNotice(`Card request ${decision.toLowerCase()}d successfully.`);}catch(value){setError(value instanceof Error?value.message.replaceAll("_"," "):"Card decision failed");}}
  return <><div className="overview-head"><div><h2>Virtual card approvals</h2><p>Approve issuance before a card becomes visible and usable in the customer portal.</p></div></div>{notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}{error&&<div className="auth-error">{error}</div>}<section className="section-card"><div className="section-title"><div><h2>Issuance queue</h2><p>{pending.length} request{pending.length===1?"":"s"} awaiting staff approval.</p></div><span className="status-pill warn">{pending.length} pending</span></div><div className="field"><label>DECISION REASON</label><input value={reason} onChange={event=>setReason(event.target.value)} required/></div><table className="activity-table"><thead><tr><th>Customer / card</th><th>Funding account</th><th className="money">Limit</th><th></th></tr></thead><tbody>{pending.map(item=><tr key={item.id}><td><div className="transaction-name"><span className="transaction-icon"><CreditCard size={13}/></span><div><b>{item.customerName} · {item.displayName}</b><small>{item.userId} · requested {new Date(item.requestedAt).toLocaleString()}</small></div></div></td><td>···· {item.fundingAccountNumber.slice(-4)}</td><td className="money">{formatMoney(item.monthlyLimitMinor)}</td><td className="row-action"><button onClick={()=>decide(item.id,"REJECT")}>Reject</button><button onClick={()=>decide(item.id,"APPROVE")}>Approve</button></td></tr>)}</tbody></table>{!pending.length&&<div className="empty-ledger">No virtual card requests are awaiting approval.</div>}</section></>;
}

function AdminAccountsWorkspace() {
  const { customers, accounts, transactions, refresh } = useBankingData();
  const [customerFilter,setCustomerFilter] = useState("ALL");
  const [activeAction,setActiveAction] = useState<string|null>(null);
  const [notice,setNotice] = useState("");
  const visibleCustomers = customerFilter === "ALL"
    ? customers
    : customers.filter((customer)=>customer.userId===customerFilter);
  const totalBalanceMinor = accounts.reduce((sum,account)=>sum+account.balanceMinor,0);
  const zeroBalanceCount = accounts.filter((account)=>account.balanceMinor===0).length;

  return <>
    <div className="overview-head"><div><h2>Account management</h2><p>Customer accounts are categorized by profile and ready for authorized funding.</p></div><button className="primary-action" disabled={!accounts.length} onClick={()=>setActiveAction("Fund account")}><Plus size={14}/>Fund account</button></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    <div className="workspace-metrics"><div><strong>{accounts.length}</strong><span>Customer accounts</span></div><div><strong>{formatMoney(totalBalanceMinor)}</strong><span>Total customer balances</span></div><div><strong>{zeroBalanceCount}</strong><span>New or unfunded accounts</span></div></div>
    {activeAction&&<AdminActionPanel section="accounts" action={activeAction} close={()=>setActiveAction(null)} complete={(message)=>{setActiveAction(null);setNotice(message);refresh();}}/>}
    <section className="section-card transaction-category-controls"><div className="section-title"><div><h2>Funding categories</h2><p>Newly approved customers appear here as soon as their first account is opened.</p></div><label className="customer-record-filter"><span>Customer profile</span><select value={customerFilter} onChange={(event)=>setCustomerFilter(event.target.value)}><option value="ALL">All customers</option>{customers.map((customer)=><option key={customer.userId} value={customer.userId}>{customer.firstName} {customer.lastName} · {customer.userId}</option>)}</select></label></div></section>
    <div className="account-customer-groups">{visibleCustomers.map((customer)=>{
      const customerAccounts=accounts.filter((account)=>account.userId===customer.userId);
      const relationshipBalance=customerAccounts.reduce((sum,account)=>sum+account.balanceMinor,0);
      return <section className="section-card account-customer-group" key={customer.userId}>
        <header className="transaction-customer-heading"><div className="transaction-customer-identity"><span>{customer.firstName[0]}{customer.lastName[0]}</span><div><h2>{customer.firstName} {customer.lastName}</h2><p>{customer.userId} · {customer.email}</p></div></div><div className="transaction-customer-summary"><div><small>ACCOUNT STATUS</small><strong>{accountStatusLabel(customer.accountStatus)}</strong></div><div><small>ACCOUNTS</small><strong>{customerAccounts.length}</strong></div><div><small>RELATIONSHIP BALANCE</small><strong>{formatMoney(relationshipBalance)}</strong></div></div></header>
        {customerAccounts.length?<div className="categorized-account-grid">{customerAccounts.map((account)=>{
          const accountTransactions=transactions.filter((transaction)=>transaction.accountId===account.id);
          const isNew=account.balanceMinor===0&&accountTransactions.length===0;
          return <article key={account.id} className={isNew?"newly-approved-account":""}><div className="categorized-account-icon"><WalletCards size={19}/></div><div className="categorized-account-main"><div><span>{account.type === "CHECKING" ? "Everyday Checking" : account.type === "SAVINGS" ? "Growth Savings" : account.type}</span>{isNew&&<em>Newly approved</em>}</div><small>Account {account.accountNumber} · USD</small><strong>{formatMoney(account.balanceMinor)}</strong><p>{accountTransactions.length} posted transaction{accountTransactions.length===1?"":"s"}</p></div><button type="button" onClick={()=>setActiveAction(`Fund account · ${account.id}`)}><CircleDollarSign size={14}/>Fund this account</button></article>;
        })}</div>:<div className="empty-ledger">No account has been opened for this customer. Approve KYC to create the initial zero-balance checking account.</div>}
      </section>;
    })}</div>
    {!visibleCustomers.length&&<section className="section-card"><div className="empty-ledger">No customer profiles are available.</div></section>}
  </>;
}

function AdminTransactionsWorkspace() {
  const { customers, accounts, transactions, refresh } = useBankingData();
  const [customerFilter,setCustomerFilter] = useState("ALL");
  const [activeAction,setActiveAction] = useState<string|null>(null);
  const [notice,setNotice] = useState("");
  const visibleCustomers = customerFilter === "ALL"
    ? customers
    : customers.filter((customer)=>customer.userId===customerFilter);
  const totalVolumeMinor = transactions.reduce((sum,transaction)=>sum+transaction.amountMinor,0);

  return <>
    <div className="overview-head"><div><h2>Transaction management</h2><p>Ledger activity is categorized by customer profile and owned account.</p></div><button className="primary-action" onClick={()=>setActiveAction("Add transaction")}><Plus size={14}/>Add transaction</button></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    <div className="workspace-metrics"><div><strong>{transactions.length}</strong><span>Posted ledger entries</span></div><div><strong>{formatMoney(totalVolumeMinor)}</strong><span>Total categorized volume</span></div><div className="control-state"><KeyRound size={18}/><strong>Customer ownership enforced</strong><span>Every entry resolves through an owned account</span></div></div>
    {activeAction&&<AdminActionPanel section="transactions" action={activeAction} close={()=>setActiveAction(null)} complete={(message)=>{setActiveAction(null);setNotice(message);refresh();}}/>}
    <section className="section-card transaction-category-controls"><div className="section-title"><div><h2>Customer categories</h2><p>Select one profile or review every customer in separate groups.</p></div><label className="customer-record-filter"><span>Customer profile</span><select value={customerFilter} onChange={(event)=>setCustomerFilter(event.target.value)}><option value="ALL">All customers</option>{customers.map((customer)=><option key={customer.userId} value={customer.userId}>{customer.firstName} {customer.lastName} · {customer.userId}</option>)}</select></label></div></section>
    <div className="transaction-customer-groups">{visibleCustomers.map((customer)=>{
      const customerAccounts=accounts.filter((account)=>account.userId===customer.userId);
      const accountIds=new Set(customerAccounts.map((account)=>account.id));
      const customerTransactions=transactions.filter((transaction)=>accountIds.has(transaction.accountId)).sort((left,right)=>new Date(right.createdAt).getTime()-new Date(left.createdAt).getTime());
      const relationshipBalance=customerAccounts.reduce((sum,account)=>sum+account.balanceMinor,0);
      return <section className="section-card transaction-customer-group" key={customer.userId}>
        <header className="transaction-customer-heading"><div className="transaction-customer-identity"><span>{customer.firstName[0]}{customer.lastName[0]}</span><div><h2>{customer.firstName} {customer.lastName}</h2><p>{customer.userId} · {customer.email}</p></div></div><div className="transaction-customer-summary"><div><small>ACCOUNTS</small><strong>{customerAccounts.length}</strong></div><div><small>RELATIONSHIP BALANCE</small><strong>{formatMoney(relationshipBalance)}</strong></div><div><small>TRANSACTIONS</small><strong>{customerTransactions.length}</strong></div></div></header>
        <div className="transaction-account-categories">{customerAccounts.map((account)=><span key={account.id}><WalletCards size={13}/><b>{account.type}</b> ···· {account.accountNumber.slice(-4)} <strong>{formatMoney(account.balanceMinor)}</strong></span>)}{!customerAccounts.length&&<small>No accounts opened</small>}</div>
        {customerTransactions.length?<table className="activity-table categorized-transaction-table"><thead><tr><th>Transaction</th><th>Account category</th><th>Status / posted</th><th className="money">Amount</th><th></th></tr></thead><tbody>{customerTransactions.map((transaction)=>{
          const account=customerAccounts.find((item)=>item.id===transaction.accountId);
          return <tr key={transaction.id}><td><div className="transaction-name"><span className="transaction-icon"><BookOpen size={13}/></span><div><b>{transaction.description}</b><small>{transaction.reference}</small></div></div></td><td><b>{account?.type ?? "Account"}</b><br/><small>···· {transaction.accountNumber.slice(-4)}</small></td><td><span className={`status-pill ${transaction.status==="REVERSED"?"block":""}`}>{transaction.status}</span><br/><small>{new Date(transaction.effectiveAt).toLocaleString()}</small></td><td className={`money ${transaction.direction==="CREDIT"?"credit":""}`}>{transaction.direction==="CREDIT"?"+":"−"}{formatMoney(transaction.amountMinor)}</td><td className="row-action"><button onClick={()=>setActiveAction(`${transaction.status==="POSTED"?"Reverse":"Inspect"} · ${transaction.reference}`)}>{transaction.status==="POSTED"?"Reverse":"Inspect"}</button></td></tr>;
        })}</tbody></table>:<div className="empty-ledger">No transaction history for this customer.</div>}
      </section>;
    })}</div>
    {!visibleCustomers.length&&<section className="section-card"><div className="empty-ledger">No customer profiles are available.</div></section>}
  </>;
}

function accountStatusLabel(status:"ACTIVE"|"INACTIVE"|"IN_REVIEW") {
  return status === "IN_REVIEW" ? "In review" : status.charAt(0) + status.slice(1).toLowerCase();
}

function generateTemporaryPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return `Ns!${Array.from(bytes,(byte)=>alphabet[byte%alphabet.length]).join("")}7a`;
}

function AdminCustomersWorkspace() {
  const {customers,accounts,transactions,mutate,refresh,error:loadError}=useBankingData();
  const [selectedId,setSelectedId]=useState("");
  const selected=customers.find((customer)=>customer.userId===selectedId)??null;
  const [status,setStatus]=useState<"ACTIVE"|"INACTIVE"|"IN_REVIEW">("ACTIVE");
  const [reason,setReason]=useState("");
  const [temporaryPassword,setTemporaryPassword]=useState("");
  const [passwordReason,setPasswordReason]=useState("");
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [creating,setCreating]=useState(false);
  const [createFirstName,setCreateFirstName]=useState("");
  const [createLastName,setCreateLastName]=useState("");
  const [createEmail,setCreateEmail]=useState("");

  function manage(userId:string) {
    const customer=customers.find((item)=>item.userId===userId);
    setSelectedId(userId);
    setStatus(customer?.accountStatus??"IN_REVIEW");
    setReason("");setTemporaryPassword("");setPasswordReason("");setError("");
  }

  async function saveStatus(event:React.FormEvent) {
    event.preventDefault();
    if(!selected)return;
    setSubmitting(true);setError("");
    try {
      await mutate({action:"CUSTOMER_STATUS_SET",userId:selected.userId,accountStatus:status,reason});
      setNotice(`${selected.firstName} ${selected.lastName} is now ${accountStatusLabel(status)}.`);
      setReason("");
    } catch(saveError) { setError(saveError instanceof Error?saveError.message.replaceAll("_"," "):"Status update failed"); }
    finally { setSubmitting(false); }
  }

  async function resetPassword(event:React.FormEvent) {
    event.preventDefault();
    if(!selected)return;
    setSubmitting(true);setError("");
    try {
      await mutate({action:"CUSTOMER_PASSWORD_RESET",userId:selected.userId,temporaryPassword,reason:passwordReason});
      setNotice(`Password reset for ${selected.firstName} ${selected.lastName}. Existing sessions were revoked and a password change is required.`);
      setPasswordReason("");
    } catch(resetError) { setError(resetError instanceof Error?resetError.message.replaceAll("_"," "):"Password reset failed"); }
    finally { setSubmitting(false); }
  }

  async function createProfile(event:React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);setError("");
    try {
      const result=await mutate({action:"CUSTOMER_CREATE",firstName:createFirstName,lastName:createLastName,email:createEmail});
      setNotice(`${createFirstName} ${createLastName} was created as an empty profile and added to the KYC queue (${result.userId}).`);
      setCreateFirstName("");setCreateLastName("");setCreateEmail("");setCreating(false);
    } catch(createError) {
      setError(createError instanceof Error?createError.message.replaceAll("_"," "):"Customer creation failed");
    } finally { setSubmitting(false); }
  }

  const activeCount=customers.filter((customer)=>customer.accountStatus==="ACTIVE").length;
  const reviewCount=customers.filter((customer)=>customer.accountStatus==="IN_REVIEW").length;
  const selectedAccounts=selected ? accounts.filter((account)=>account.userId===selected.userId) : [];
  const selectedAccountIds=new Set(selectedAccounts.map((account)=>account.id));
  const selectedTransactions=selected
    ? transactions.filter((transaction)=>selectedAccountIds.has(transaction.accountId))
      .sort((left,right)=>new Date(right.createdAt).getTime()-new Date(left.createdAt).getTime())
    : [];
  return <>
    <div className="overview-head"><div><h2>Customer directory</h2><p>Manage account access, KYC state, and password recovery from one persistent customer record.</p></div><button type="button" className="primary-action" onClick={()=>{setCreating(true);setSelectedId("");setError("");}}><Plus size={15}/>Create profile</button></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    {loadError&&<div className="auth-error" role="alert">Customer records could not be loaded: {loadError.replaceAll("_"," ")} <button type="button" onClick={()=>void refresh()}>Retry</button></div>}
    <div className="customer-admin-metrics"><div><strong>{customers.length}</strong><span>Total customers</span></div><div><strong>{activeCount}</strong><span>Active</span></div><div><strong>{reviewCount}</strong><span>In review</span></div></div>
    <section className="section-card">
      <div className="section-title"><div><h2>Customer accounts</h2><p>Signup applications and staff-created profiles appear here automatically.</p></div><div className="table-tools"><button type="button" onClick={()=>void refresh()}><RefreshCw size={13}/>Refresh</button><span className="status-pill">Server persisted</span></div></div>
      <table className="activity-table admin-workspace-table"><thead><tr><th>Customer</th><th>Account status</th><th>Accounts</th><th>Password</th><th></th></tr></thead><tbody>{customers.map((customer)=>{
        const customerAccounts=accounts.filter((account)=>account.userId===customer.userId);
        return <tr key={customer.userId}><td><div className="transaction-name"><span className="transaction-icon">{customer.firstName[0]}{customer.lastName[0]}</span><div><b>{customer.firstName} {customer.lastName}</b><small>{customer.userId} · {customer.email}</small></div></div></td><td><span className={`status-pill ${customer.accountStatus==="IN_REVIEW"?"warn":customer.accountStatus==="INACTIVE"?"block":""}`}>{accountStatusLabel(customer.accountStatus)}</span></td><td>{customerAccounts.length} · {formatMoney(customerAccounts.reduce((sum,account)=>sum+account.balanceMinor,0))}</td><td><span className={`status-pill ${customer.passwordResetRequired?"warn":""}`}>{customer.passwordResetRequired?"Change required":"Current"}</span></td><td className="row-action"><button type="button" onClick={()=>manage(customer.userId)}>Manage</button></td></tr>;
      })}</tbody></table>
      {customers.length===0&&<div className="empty-ledger">No customer profiles have been created.</div>}
    </section>
    {creating&&<div className="customer-admin-drawer customer-create-drawer">
      <div className="customer-admin-drawer-head"><div><span><Users size={18}/></span><div><h3>Create customer profile</h3><p>Creates a fresh, empty profile awaiting KYC approval.</p></div></div><button type="button" onClick={()=>{setCreating(false);setError("");}}><XCircle size={17}/></button></div>
      <form className="customer-control-form customer-create-form" onSubmit={createProfile}>
        {error&&<div className="auth-error" role="alert">{error}</div>}
        <div className="fresh-profile-callout"><Users size={18}/><div><b>Fresh customer record</b><span>No account, balance, card, beneficiary, loan, or transaction is created until staff completes the appropriate workflow.</span></div></div>
        <div className="form-row"><div className="field"><label>FIRST NAME</label><input value={createFirstName} onChange={event=>setCreateFirstName(event.target.value)} required/></div><div className="field"><label>LAST NAME</label><input value={createLastName} onChange={event=>setCreateLastName(event.target.value)} required/></div></div>
        <div className="field"><label>EMAIL ADDRESS</label><input value={createEmail} onChange={event=>setCreateEmail(event.target.value)} type="email" required/></div>
        <div className="impact-preview"><b>Initial state</b><span>In review · email unverified · zero accounts · zero transactions</span></div>
        <div className="decision-buttons"><button type="button" className="deny" onClick={()=>{setCreating(false);setError("");}}>Cancel</button><button type="submit" disabled={submitting}>{submitting?"Creating…":"Create profile"}</button></div>
      </form>
    </div>}
    {selected&&<div className="customer-admin-drawer">
      <div className="customer-admin-drawer-head"><div><span>{selected.firstName[0]}{selected.lastName[0]}</span><div><h3>{selected.firstName} {selected.lastName}</h3><p>{selected.userId} · {selected.email}</p></div></div><button type="button" onClick={()=>setSelectedId("")}><XCircle size={17}/></button></div>
      {error&&<div className="auth-error">{error}</div>}
      <section className="customer-portfolio-section">
        <div className="section-title"><div><h2>Account portfolio</h2><p>Only accounts owned by {selected.firstName} {selected.lastName} are shown.</p></div><span className="status-pill">{selectedAccounts.length} account{selectedAccounts.length===1?"":"s"}</span></div>
        <div className="customer-portfolio-cards">{selectedAccounts.map((account)=><article key={account.id}><span><WalletCards size={17}/></span><div><b>{account.type === "CHECKING" ? "Everyday Checking" : account.type === "SAVINGS" ? "Growth Savings" : account.type}</b><small>Account ···· {account.accountNumber.slice(-4)}</small></div><strong>{formatMoney(account.balanceMinor)}</strong></article>)}</div>
        {!selectedAccounts.length&&<div className="empty-ledger">This customer has no accounts yet.</div>}
      </section>
      <section className="customer-history-section">
        <div className="section-title"><div><h2>Customer transaction history</h2><p>Transactions are linked through this customer&apos;s owned account IDs.</p></div><span className="status-pill">{selectedTransactions.length} entr{selectedTransactions.length===1?"y":"ies"}</span></div>
        <table className="activity-table customer-history-table"><thead><tr><th>Transaction</th><th>Account</th><th>Posted</th><th className="money">Amount</th></tr></thead><tbody>{selectedTransactions.map((transaction)=><tr key={transaction.id}><td><div className="transaction-name"><span className="transaction-icon"><BookOpen size={13}/></span><div><b>{transaction.description}</b><small>{transaction.reference}</small></div></div></td><td>{transaction.accountNumber.slice(-4)} · {selectedAccounts.find((account)=>account.id===transaction.accountId)?.type ?? "Account"}</td><td>{new Date(transaction.effectiveAt).toLocaleString()}</td><td className={`money ${transaction.direction==="CREDIT"?"credit":""}`}>{transaction.direction==="CREDIT"?"+":"−"}{formatMoney(transaction.amountMinor)}</td></tr>)}</tbody></table>
        {!selectedTransactions.length&&<div className="empty-ledger">No transactions have been posted for this customer.</div>}
      </section>
      <div className="customer-admin-drawer-grid">
        <form className="customer-control-form" onSubmit={saveStatus}><div className="section-title"><div><h2>Account status</h2><p>Inactive and In review statuses revoke active customer sessions.</p></div></div><div className="field"><label>STATUS</label><select value={status} onChange={(event)=>setStatus(event.target.value as typeof status)}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="IN_REVIEW">In review</option></select></div><div className="field"><label>REQUIRED REASON</label><textarea value={reason} onChange={(event)=>setReason(event.target.value)} required placeholder="Explain this account-status change"/></div><button className="admin-execute" disabled={submitting}>Save account status</button></form>
        <form className="customer-control-form" onSubmit={resetPassword}><div className="section-title"><div><h2>Reset customer password</h2><p>Creates a temporary password, revokes all sessions, and requires the customer to change it.</p></div></div><div className="field"><label>TEMPORARY PASSWORD</label><div className="password-reset-control"><input type="text" value={temporaryPassword} onChange={(event)=>setTemporaryPassword(event.target.value)} minLength={12} required autoComplete="off"/><button type="button" onClick={()=>setTemporaryPassword(generateTemporaryPassword())}>Generate</button><button type="button" disabled={!temporaryPassword} onClick={()=>navigator.clipboard.writeText(temporaryPassword)}>Copy</button></div></div><small className="password-policy">At least 12 characters with uppercase, lowercase, number, and symbol.</small><div className="field"><label>REQUIRED REASON</label><textarea value={passwordReason} onChange={(event)=>setPasswordReason(event.target.value)} required placeholder="Explain why the password is being reset"/></div><button className="admin-execute" disabled={submitting||!temporaryPassword}>Reset password & revoke sessions</button></form>
      </div>
    </div>}
  </>;
}

function AdminKycWorkspace() {
  const {customers,mutate,refresh,error:loadError}=useBankingData();
  const pending=customers.filter((customer)=>customer.accountStatus==="IN_REVIEW");
  const [selectedId,setSelectedId]=useState("");
  const [reason,setReason]=useState("");
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const selected=customers.find((customer)=>customer.userId===selectedId)??null;
  async function decide(decision:"APPROVE"|"REJECT") {
    if(!selected||!reason.trim()){setError("Enter a KYC decision reason.");return;}
    setSubmitting(true);setError("");
    try {
      const result=await mutate({action:"KYC_DECISION",userId:selected.userId,kycDecision:decision,reason});
      setNotice(decision==="APPROVE"
        ? `${selected.firstName} ${selected.lastName} is Active. ${result.accountCreated?"A new zero-balance checking account was opened.":"The existing account was retained."}`
        : `${selected.firstName} ${selected.lastName} was rejected and marked Inactive.`);
      setSelectedId("");setReason("");
    } catch(decisionError){setError(decisionError instanceof Error?decisionError.message.replaceAll("_"," "):"KYC decision failed");}
    finally{setSubmitting(false);}
  }
  return <>
    <div className="overview-head"><div><h2>KYC review queue</h2><p>Approve applications to activate the customer and open their initial empty checking account.</p></div><button type="button" className="primary-action" onClick={()=>void refresh()}><RefreshCw size={15}/>Refresh queue</button></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    {loadError&&<div className="auth-error" role="alert">KYC applications could not be loaded: {loadError.replaceAll("_"," ")}</div>}
    <section className="section-card"><div className="section-title"><div><h2>Applications in review</h2><p>Newest verified customer applications awaiting an operations decision.</p></div><span className="status-pill warn">{pending.length} pending</span></div><table className="activity-table admin-workspace-table"><thead><tr><th>Applicant</th><th>Email verification</th><th>Submitted</th><th></th></tr></thead><tbody>{pending.map((customer)=><tr key={customer.userId}><td><div className="transaction-name"><span className="transaction-icon"><FileText size={13}/></span><div><b>{customer.firstName} {customer.lastName}</b><small>{customer.userId}</small></div></div></td><td><span className={`status-pill ${customer.emailVerifiedAt?"":"warn"}`}>{customer.emailVerifiedAt?"Verified":"Pending"}</span></td><td>{new Date(customer.createdAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</td><td className="row-action"><button type="button" onClick={()=>{setSelectedId(customer.userId);setReason("");setError("");}}>Review</button></td></tr>)}</tbody></table>{pending.length===0&&<div className="empty-ledger">No customer applications are waiting for review.</div>}</section>
    {selected&&<div className="customer-admin-drawer kyc-decision-drawer"><div className="customer-admin-drawer-head"><div><span>{selected.firstName[0]}{selected.lastName[0]}</span><div><h3>{selected.firstName} {selected.lastName}</h3><p>{selected.email} · verified identity application</p></div></div><button type="button" onClick={()=>setSelectedId("")}><XCircle size={17}/></button></div>{error&&<div className="auth-error">{error}</div>}<div className="review-document"><FileText size={22}/><div><b>Identity application</b><span>Email verified · customer profile created empty</span></div><span className="status-pill warn">In review</span></div><div className="field"><label>DECISION REASON</label><textarea value={reason} onChange={(event)=>setReason(event.target.value)} required placeholder="Record the KYC approval or rejection rationale"/></div><div className="impact-preview"><b>Approval result</b><span>The customer becomes Active and receives one checking account with a $0.00 balance and no transaction history.</span></div><div className="decision-buttons"><button type="button" className="deny" disabled={submitting} onClick={()=>decide("REJECT")}>Reject & mark inactive</button><button type="button" disabled={submitting} onClick={()=>decide("APPROVE")}>Approve & activate</button></div></div>}
  </>;
}

function AdminTransferQueue() {
  const { customers, accounts, transferRequests, stopCodes, transferControls, mutate } = useBankingData();
  const [selected,setSelected] = useState<BankingTransferRequest | null>(null);
  const [reason,setReason] = useState("");
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");
  const [submitting,setSubmitting] = useState(false);
  const [generatedCode,setGeneratedCode] = useState("");
  // The save API validates against sim_customer_directory, so the selector must
  // use that same source instead of accounts that may be stale after an import.
  const customerOptions = useMemo(()=>customers.map((customer)=>({
    userId:customer.userId,
    name:`${customer.firstName} ${customer.lastName}`.trim(),
  })),[customers]);
  const [controlUserId,setControlUserId] = useState<string>("");
  const initialControl = transferControls.find((control)=>control.userId===controlUserId);
  const [controlMode,setControlMode] = useState<"STANDARD_APPROVAL"|"COMPLIANCE_CODE">(initialControl?.externalMode ?? "STANDARD_APPROVAL");
  const [preferredStopCode,setPreferredStopCode] = useState(initialControl?.preferredStopCode ?? "SOFT_COMPLIANCE_HOLD");
  const activeStopCodes=useMemo(()=>stopCodes.filter((code)=>Boolean(code.active)),[stopCodes]);
  const hasValidPreferredStopCode=activeStopCodes.some((code)=>code.code===preferredStopCode);
  // Guards the mode/stop-code controls from being reset by background refresh
  // polls while the operator has an unsaved selection in progress.
  const controlDirtyRef = useRef(false);
  // Surface server-side save failures directly in the transfer-mode section so
  // operators see the real reason instead of a silently failing button.
  const [controlError,setControlError] = useState("");
  const [savedTransferControl,setSavedTransferControl] = useState<{
    userId:string;
    customerName:string;
    externalMode:"STANDARD_APPROVAL"|"COMPLIANCE_CODE";
    preferredStopCode:string|null;
  }|null>(null);
  useEffect(()=>{
    if (controlDirtyRef.current) return;
    const control = transferControls.find((item)=>item.userId===controlUserId);
    if (!control) return;
    const savedStopCode=activeStopCodes.some((code)=>code.code===control.preferredStopCode)
      ? control.preferredStopCode!
      : activeStopCodes[0]?.code??"";
    const frame=window.requestAnimationFrame(()=>{setControlMode(control.externalMode);setPreferredStopCode(savedStopCode);});
    return()=>window.cancelAnimationFrame(frame);
  },[transferControls,controlUserId,activeStopCodes]);
  // Keep the selected customer valid against the customers actually available on
  // the server. If the current selection is gone (e.g. the hard-coded C-882104 in
  // a production database that seeds different customers), fall back to the first
  // real customer so the save never targets a non-existent directory row.
  useEffect(()=>{
    if (customerOptions.length===0) return;
    if (customerOptions.some((item)=>item.userId===controlUserId)) return;
    const first=customerOptions[0];
    const control=transferControls.find((item)=>item.userId===first.userId);
    const frame=window.requestAnimationFrame(()=>{
      controlDirtyRef.current=false;
      setControlUserId(first.userId);
      setControlMode(control?.externalMode??"STANDARD_APPROVAL");
      setPreferredStopCode(activeStopCodes.some((code)=>code.code===control?.preferredStopCode)
        ? control!.preferredStopCode!
        : activeStopCodes[0]?.code??"");
      setControlError("");
    });
    return()=>window.cancelAnimationFrame(frame);
  },[customerOptions,controlUserId,transferControls,activeStopCodes]);
  const pendingCount = transferRequests.filter((request)=>request.status==="PENDING").length;
  const reviewCount = transferRequests.filter((request)=>request.status==="PROCESSING").length;
  const statusLabel = (status:BankingTransferRequest["status"]) =>
    status==="PENDING"?"Pending approval"
      :status==="PROCESSING"?"Flagged for review"
        :status==="COMPLETED"?"Approved"
          :status==="FAILED"?"Rejected":"Cancelled";
  const statusBadge = (status:BankingTransferRequest["status"]) =>
    status==="FAILED"||status==="CANCELLED"?"block"
      :status==="PENDING"||status==="PROCESSING"?"warn":"";
  const railLabel = (rail:BankingTransferRequest["rail"]) =>
    rail==="ACH"?"External ACH":rail==="DOMESTIC_WIRE"?"Domestic wire":"International wire";
  const requestStatusLabel = (request:BankingTransferRequest) =>
    request.transferMode==="COMPLIANCE_CODE"&&request.status==="PROCESSING"
      ? "Soft compliance hold"
      : statusLabel(request.status);
  const customerById = new Map(customers.map((customer)=>[customer.userId,customer]));
  const transferGroups = Array.from(transferRequests.reduce((groups,request)=>{
    const requests=groups.get(request.userId)??[];
    requests.push(request);
    groups.set(request.userId,requests);
    return groups;
  },new Map<string,BankingTransferRequest[]>()).entries()).map(([userId,requests])=>{
    const customer=customerById.get(userId);
    const account=accounts.find((item)=>item.userId===userId);
    return {
      userId,
      customerName:customer?`${customer.firstName} ${customer.lastName}`:account?.customerName??"Unknown customer",
      email:customer?.email??"Customer profile unavailable",
      requests:requests.sort((left,right)=>new Date(right.requestedAt).getTime()-new Date(left.requestedAt).getTime()),
      openCount:requests.filter((request)=>request.status==="PENDING"||request.status==="PROCESSING").length,
      latestAt:requests.reduce((latest,request)=>request.requestedAt>latest?request.requestedAt:latest,""),
    };
  }).sort((left,right)=>right.latestAt.localeCompare(left.latestAt));
  const selectedCustomer=selected?customerById.get(selected.userId):undefined;
  const selectedCustomerName=selectedCustomer
    ?`${selectedCustomer.firstName} ${selectedCustomer.lastName}`
    :accounts.find((account)=>account.userId===selected?.userId)?.customerName??"Unknown customer";

  async function decide(decision:"APPROVE"|"REJECT"|"FLAG_REVIEW") {
    if (!selected) return;
    if (!reason.trim()) {
      setError("Enter an operational decision reason.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await mutate({
        action:"TRANSFER_DECISION",
        requestId:selected.id,
        decision,
        reason,
      });
      const outcome = decision==="APPROVE"?"approved and posted to clearing"
        :decision==="REJECT"?"rejected without a ledger posting"
          :"flagged for additional review";
      setNotice(`${result.reference} ${outcome}. The customer status was updated.`);
      setSelected(null);
      setReason("");
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message.replaceAll("_"," ") : "Decision failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveTransferControl() {
    if (!controlUserId || !customerOptions.some((item)=>item.userId===controlUserId)) {
      setControlError("Select a customer before saving the transfer mode.");
      return;
    }
    if(controlMode==="COMPLIANCE_CODE"&&!hasValidPreferredStopCode){
      setControlError(activeStopCodes.length
        ? "Select an active preferred stop code before saving Mode 2."
        : "Create an active compliance stop code before saving Mode 2.");
      return;
    }
    setSubmitting(true);
    setControlError("");
    try {
      const result=await mutate({
        action:"TRANSFER_CONTROL_SET",
        userId:controlUserId,
        externalMode:controlMode,
        preferredStopCode:controlMode==="COMPLIANCE_CODE"?preferredStopCode:undefined,
      });
      if(result.userId!==controlUserId||result.externalMode!==controlMode){
        throw new Error("TRANSFER_MODE_SAVE_NOT_CONFIRMED");
      }
      controlDirtyRef.current=false;
      const customer = customerOptions.find((item)=>item.userId===controlUserId);
      setSavedTransferControl({
        userId:controlUserId,
        customerName:customer?.name ?? controlUserId,
        externalMode:controlMode,
        preferredStopCode:controlMode==="COMPLIANCE_CODE"?preferredStopCode:null,
      });
      setNotice(`${controlUserId} now uses ${controlMode==="COMPLIANCE_CODE"?"compliance-code soft holds":"standard admin approval"} for external transfers.`);
    } catch (controlError) {
      const code=controlError instanceof Error?controlError.message:"";
      const message=code==="CUSTOMER_NOT_FOUND"
        ?"The selected customer no longer exists. Refresh the page and select a customer again."
        :code==="STOP_CODE_NOT_FOUND"
          ?"The selected stop code is inactive or no longer exists. Select an active stop code."
          :code==="PREFERRED_STOP_CODE_REQUIRED"
            ?"Select an active preferred stop code before saving Mode 2."
            :code?code.replaceAll("_"," "):"Unable to save transfer mode";
      setControlError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function generateComplianceCode() {
    if (!selected) return;
    if(!reason.trim()){
      setError("Enter an operation note before generating the customer code.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await mutate({
        action:"COMPLIANCE_CODE_GENERATE",
        requestId:selected.id,
        reason,
      });
      setGeneratedCode(result.generatedCode ?? "");
      setNotice(`${selected.reference} compliance code generated. Copy it and provide it to the customer through the secure support channel.`);
    } catch (generationError) {
      setError(generationError instanceof Error?generationError.message.replaceAll("_"," "):"Unable to generate code");
    } finally {
      setSubmitting(false);
    }
  }

  return <>
    <div className="overview-head"><div><h2>External transfer approvals</h2><p>Approve, reject, or flag customer ACH and wire instructions before settlement.</p></div></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    <div className="workspace-metrics">
      <div><strong>{pendingCount}</strong><span>Awaiting approval</span></div>
      <div><strong>{reviewCount}</strong><span>Review and compliance holds</span></div>
      <div className="control-state"><KeyRound size={18}/><strong>MFA verified</strong><span>Transfer decisions are audited</span></div>
    </div>
    <section className="admin-transfer-policy">
      <div className="section-title"><div><h2>Customer external-transfer mode</h2><p>Mode 1 uses staff approval. Mode 2 applies the customer’s preferred compliance stop code.</p></div></div>
      <div className="policy-control-grid">
        <div className="field"><label>CUSTOMER</label><select value={controlUserId} onChange={(event)=>{const userId=event.target.value;const control=transferControls.find((item)=>item.userId===userId);controlDirtyRef.current=false;setControlError("");setControlUserId(userId);setControlMode(control?.externalMode??"STANDARD_APPROVAL");setPreferredStopCode(activeStopCodes.some((code)=>code.code===control?.preferredStopCode)?control!.preferredStopCode!:activeStopCodes[0]?.code??"");}}>{customerOptions.map((customer)=><option key={customer.userId} value={customer.userId}>{customer.name} · {customer.userId}</option>)}</select></div>
        <div className="field"><label>TRANSFER MODE</label><select value={controlMode} onChange={(event)=>{const mode=event.target.value as "STANDARD_APPROVAL"|"COMPLIANCE_CODE";controlDirtyRef.current=true;setControlError("");setControlMode(mode);if(mode==="COMPLIANCE_CODE"&&!hasValidPreferredStopCode)setPreferredStopCode(activeStopCodes[0]?.code??"");}}><option value="STANDARD_APPROVAL">Mode 1 · Standard approval</option><option value="COMPLIANCE_CODE">Mode 2 · Compliance-code hold</option></select></div>
        <div className="field"><label>PREFERRED STOP CODE</label><select value={hasValidPreferredStopCode?preferredStopCode:""} disabled={controlMode!=="COMPLIANCE_CODE"||!activeStopCodes.length} onChange={(event)=>{controlDirtyRef.current=true;setControlError("");setPreferredStopCode(event.target.value);}}>{!activeStopCodes.length&&<option value="">No active stop codes</option>}{activeStopCodes.map((code)=><option key={code.code} value={code.code}>{code.code} · {code.name}</option>)}</select></div>
        <button type="button" className="inline-submit" disabled={submitting||!customerOptions.some((item)=>item.userId===controlUserId)||controlMode==="COMPLIANCE_CODE"&&!hasValidPreferredStopCode} onClick={saveTransferControl}>{submitting?"Saving transfer mode…":"Save transfer mode"}</button>
      </div>
      {controlError&&<div className="auth-error">{controlError}</div>}
    </section>
    {selected&&<section className="admin-transfer-review">
      <header><div><small>TRANSFER DECISION</small><h3>{selected.reference}</h3></div><span className={`status-pill ${statusBadge(selected.status)}`}>{requestStatusLabel(selected)}</span><button type="button" onClick={()=>{setSelected(null);setError("");}}>Close</button></header>
      <div className="admin-transfer-summary">
        <div><span>Customer</span><b>{selectedCustomerName} · {selected.userId}</b></div>
        <div><span>Amount</span><b>{formatMoney(selected.amountMinor)}</b></div>
        <div><span>Rail</span><b>{railLabel(selected.rail)}</b></div>
        <div><span>Source</span><b>Checking · •••• {selected.sourceAccountNumber.slice(-4)}</b></div>
        <div><span>Recipient</span><b>{selected.recipientName}</b></div>
        <div><span>Recipient account</span><b>•••• {selected.accountNumber.slice(-4)}</b></div>
        <div><span>Bank</span><b>{selected.bankName}</b></div>
        <div><span>Routing / SWIFT</span><b>{selected.routingNumber}{selected.swiftBic?` · ${selected.swiftBic}`:""}</b></div>
        <div className="wide"><span>Payment address</span><b>{selected.recipientAddressLine1}{selected.recipientAddressLine2?`, ${selected.recipientAddressLine2}`:""}, {selected.recipientCity}, {selected.recipientStateRegion} {selected.recipientPostalCode}, {selected.recipientCountryCode}</b></div>
        {selected.memo&&<div className="wide"><span>Memo</span><b>{selected.memo}</b></div>}
      </div>
      {error&&<div className="auth-error">{error}</div>}
      {selected.transferMode==="COMPLIANCE_CODE"&&selected.status==="PROCESSING"?<>
        <div className="compliance-admin-state">
          <ShieldAlert size={18}/><div><b>Compliance-code soft hold</b><span>{selected.holdState==="AWAITING_CODE"?"Waiting for the customer to request a code.":selected.holdState==="REQUESTED"?"Customer requested a code. Generate it below and provide it to the customer.":selected.holdState==="CODE_ISSUED"?`Reusable code issued · ending ${selected.codeHint??"••••"}`:"Hold released."}</span></div>
        </div>
        {generatedCode&&<div className="generated-compliance-code"><span>GENERATED REUSABLE COMPLIANCE CODE</span><strong>{generatedCode}</strong><button type="button" onClick={()=>navigator.clipboard.writeText(generatedCode)}>Copy code</button><small>Shown for this admin session. The database stores only its cryptographic hash.</small></div>}
        <div className="field"><label>REQUIRED OPERATION NOTE</label><textarea value={reason} onChange={(event)=>setReason(event.target.value)} placeholder="Record how the compliance-code request was handled"/></div>
        <div className="transfer-decision-actions compliance-actions">
          <button type="button" className="reject" disabled={submitting} onClick={()=>decide("REJECT")}><XCircle size={15}/>Reject transfer</button>
          <button type="button" className="flag" disabled={submitting||selected.holdState==="AWAITING_CODE"||!reason.trim()} onClick={generateComplianceCode}><KeyRound size={15}/>{selected.holdState==="CODE_ISSUED"?"Regenerate code":"Generate code to send"}</button>
        </div>
      </>:["PENDING","PROCESSING"].includes(selected.status)?<>
        <div className="field"><label>REQUIRED DECISION REASON</label><textarea value={reason} onChange={(event)=>setReason(event.target.value)} placeholder="Record the approval, rejection, or review rationale" required/></div>
        <div className="transfer-decision-actions">
          <button type="button" className="reject" disabled={submitting} onClick={()=>decide("REJECT")}><XCircle size={15}/>Reject</button>
          <button type="button" className="flag" disabled={submitting} onClick={()=>decide("FLAG_REVIEW")}><Flag size={15}/>Flag for review</button>
          <button type="button" className="approve" disabled={submitting} onClick={()=>decide("APPROVE")}><CheckCircle2 size={15}/>{submitting?"Saving…":"Approve & settle"}</button>
        </div>
      </>:<div className="impact-preview"><b>Decision complete</b><span>This request can no longer be changed from the active approval queue.</span></div>}
    </section>}
    <div className="admin-transfer-customer-groups">
      {transferGroups.map((group)=><section className="section-card admin-transfer-customer-group" key={group.userId}>
        <div className="transfer-customer-heading">
          <div className="transfer-customer-avatar">{group.customerName.split(" ").slice(0,2).map((name)=>name[0]).join("")}</div>
          <div><h2>{group.customerName}</h2><p>{group.email} · {group.userId} · {group.requests.length} transfer{group.requests.length===1?"":"s"}</p></div>
          <span className={`status-pill ${group.openCount?"warn":""}`}>{group.openCount?`${group.openCount} awaiting action`:"No open items"}</span>
        </div>
        <table className="activity-table admin-workspace-table">
          <thead><tr><th>Transfer</th><th>Status</th><th>Submitted</th><th className="money">Amount</th><th></th></tr></thead>
          <tbody>{group.requests.map((request)=><tr key={request.id}>
            <td><div className="transaction-name"><span className="transaction-icon"><Building2 size={13}/></span><div><b>{request.reference}</b><small>{railLabel(request.rail)} · {request.recipientName}</small></div></div></td>
            <td><span className={`status-pill ${statusBadge(request.status)}`}>{requestStatusLabel(request)}</span></td>
            <td>{new Date(request.requestedAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</td>
            <td className="money">{formatMoney(request.amountMinor)}</td>
            <td className="row-action"><button type="button" onClick={()=>{setSelected(request);setReason(request.transferMode==="COMPLIANCE_CODE"?"Compliance release code generated for the customer after operations review.":"");setError("");setGeneratedCode("");}}>Review</button></td>
          </tr>)}</tbody>
        </table>
      </section>)}
      {transferGroups.length===0&&<section className="section-card"><div className="empty-ledger">No customer external transfers have been submitted.</div></section>}
    </div>
    {savedTransferControl&&<div className="transfer-modal-backdrop" role="presentation"><section className="beneficiary-confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="transfer-mode-confirmation-title">
      <button className="modal-close" type="button" aria-label="Close transfer-mode confirmation" onClick={()=>setSavedTransferControl(null)}><X size={18}/></button>
      <div className="beneficiary-confirmation-icon"><CheckCircle2 size={29}/></div>
      <span className="confirmation-eyebrow">Transfer mode saved</span>
      <h2 id="transfer-mode-confirmation-title">{savedTransferControl.customerName} updated</h2>
      <p>This customer now uses the selected mode for all new external ACH and wire instructions.</p>
      <div className="beneficiary-confirmation-profile">
        <span><KeyRound size={21}/></span>
        <div><b>{savedTransferControl.customerName}</b><small>{savedTransferControl.userId}</small></div>
        <em>{savedTransferControl.externalMode==="COMPLIANCE_CODE"?"Mode 2":"Mode 1"}</em>
      </div>
      <dl className="beneficiary-confirmation-details">
        <div><dt>Transfer mode</dt><dd>{savedTransferControl.externalMode==="COMPLIANCE_CODE"?"Mode 2 · Compliance-code soft hold":"Mode 1 · Standard admin approval"}</dd></div>
        <div><dt>Preferred stop code</dt><dd>{savedTransferControl.preferredStopCode ?? "—"}</dd></div>
        <div className="wide"><dt>Status</dt><dd>Saved successfully · the customer&apos;s next external transfer request will use this mode.</dd></div>
      </dl>
      <div className="beneficiary-confirmation-note"><ShieldCheck size={15}/><span>{savedTransferControl.externalMode==="COMPLIANCE_CODE"?"Mode 2 places new external transfers on a compliance soft hold until a reusable release code is verified.":"Mode 1 routes external transfer approvals through standard staff review before settlement."}</span></div>
      <div className="confirmation-actions"><button type="button" className="secondary-action" onClick={()=>setSavedTransferControl(null)}>Keep editing</button><button type="button" className="inline-submit" onClick={()=>setSavedTransferControl(null)}>Done</button></div>
    </section></div>}
  </>;
}

function AdminStatementOnboarding() {
  const {customers,accounts,statementBatches,mutate}=useBankingData();
  const customerIds=useMemo(()=>new Set(customers.map((customer)=>customer.userId)),[customers]);
  // The server validates the account through sim_customer_directory. Exclude
  // stale/imported account rows whose customer directory record no longer exists.
  const customerAccounts=useMemo(()=>accounts.filter((account)=>account.userId!=="SYSTEM"&&customerIds.has(account.userId)),[accounts,customerIds]);
  const [accountId,setAccountId]=useState("");
  const [reason,setReason]=useState("Customer statement history onboarding requested by operations.");
  const [rows,setRows]=useState(()=>[
    {direction:"CREDIT" as const,amount:"4850.00",description:"Historical payroll deposit",effectiveAt:localDateTimeDaysAgo(90)},
    {direction:"DEBIT" as const,amount:"186.40",description:"Historical utility payment",effectiveAt:localDateTimeDaysAgo(60)},
    {direction:"DEBIT" as const,amount:"92.00",description:"Historical telecom payment",effectiveAt:localDateTimeDaysAgo(30)},
  ]);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const netMinor=rows.reduce((total,row)=>total+(row.direction==="CREDIT"?1:-1)*Math.round(Number(row.amount||0)*100),0);

  useEffect(()=>{
    if(customerAccounts.some((account)=>account.id===accountId))return;
    const frame=window.requestAnimationFrame(()=>{
      setAccountId(customerAccounts[0]?.id??"");
      setError("");
    });
    return()=>window.cancelAnimationFrame(frame);
  },[customerAccounts,accountId]);

  function updateRow(index:number,change:Partial<(typeof rows)[number]>) {
    setRows((items)=>items.map((row,rowIndex)=>rowIndex===index?{...row,...change}:row));
  }

  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!customerAccounts.some((account)=>account.id===accountId)){
      setError("Select an active customer account before importing transactions.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result=await mutate({
        action:"STATEMENT_ONBOARD",
        accountId,
        reason,
        entries:rows.map((row)=>({
          direction:row.direction,
          amountMinor:Math.round(Number(row.amount)*100),
          description:row.description,
          effectiveAt:new Date(row.effectiveAt).toISOString(),
        })),
      });
      setNotice(`${result.reference} imported ${rows.length} historical entries. The statement and current balance were updated.`);
    } catch(importError) {
      setError(importError instanceof Error?importError.message.replaceAll("_"," "):"Statement onboarding failed");
    } finally {
      setSubmitting(false);
    }
  }

  return <>
    <div className="overview-head"><div><h2>Automatic statement onboarding</h2><p>Build accurate dated transaction history for any new or existing customer account.</p></div></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    <section className="section-card statement-onboarding-card">
      <div className="section-title"><div><h2>Historical transaction batch</h2><p>All rows are validated and inserted atomically. One invalid row prevents the entire import.</p></div><span className="status-pill">{rows.length} entries</span></div>
      <form className="form-grid" onSubmit={submit}>
        {error&&<div className="auth-error">{error}</div>}
        <div className="form-row"><div className="field"><label>CUSTOMER ACCOUNT</label><select value={accountId} onChange={(event)=>{setError("");setAccountId(event.target.value);}} required disabled={!customerAccounts.length}>{!customerAccounts.length&&<option value="">No eligible customer accounts</option>}{customerAccounts.map((account)=><option key={account.id} value={account.id}>{account.customerName} · {account.type} •••• {account.accountNumber.slice(-4)} · {formatMoney(account.balanceMinor)}</option>)}</select></div><div className="onboarding-net"><small>NET BALANCE CHANGE</small><strong className={netMinor<0?"negative":""}>{netMinor>=0?"+":""}{formatMoney(netMinor)}</strong></div></div>
        <div className="onboarding-entry-list">{rows.map((row,index)=><div className="onboarding-entry" key={index}>
          <span className="entry-index">{index+1}</span>
          <div className="field"><label>DIRECTION</label><select value={row.direction} onChange={(event)=>updateRow(index,{direction:event.target.value as "CREDIT"|"DEBIT"})}><option value="CREDIT">Credit</option><option value="DEBIT">Debit</option></select></div>
          <div className="field"><label>AMOUNT</label><input type="number" min="0.01" step="0.01" value={row.amount} onChange={(event)=>updateRow(index,{amount:event.target.value})} required/></div>
          <div className="field"><label>EFFECTIVE DATE</label><input type="datetime-local" value={row.effectiveAt} onChange={(event)=>updateRow(index,{effectiveAt:event.target.value})} required/></div>
          <div className="field entry-description"><label>STATEMENT DESCRIPTION</label><input value={row.description} maxLength={280} onChange={(event)=>updateRow(index,{description:event.target.value})} required/></div>
          <button type="button" className="entry-remove" disabled={rows.length===1} onClick={()=>setRows((items)=>items.filter((_,rowIndex)=>rowIndex!==index))} aria-label={`Remove row ${index+1}`}><XCircle size={16}/></button>
        </div>)}</div>
        <button type="button" className="secondary-action add-history-row" onClick={()=>setRows((items)=>[...items,{direction:"CREDIT",amount:"1000.00",description:"Historical transaction",effectiveAt:localDateTimeInputValue()}])}><Plus size={14}/>Add transaction row</button>
        <div className="field"><label>REQUIRED AUDIT REASON</label><textarea value={reason} onChange={(event)=>setReason(event.target.value)} required/></div>
        <div className="impact-preview"><b>Atomic statement injection</b><span>Entries receive real references and creation timestamps, appear at their selected effective dates, and change the live account balance only after the full batch succeeds.</span></div>
        <button className="admin-execute" disabled={submitting||!customerAccounts.some((account)=>account.id===accountId)}>{submitting?"Importing statement…":`Import ${rows.length} transactions`}</button>
      </form>
    </section>
    <section className="section-card">
      <div className="section-title"><div><h2>Recent onboarding batches</h2><p>Staff actor, entry count, net change, and reason remain attached to each import.</p></div></div>
      <table className="activity-table"><thead><tr><th>Customer account</th><th>Entries</th><th>Created</th><th className="money">Net change</th></tr></thead><tbody>{statementBatches.map((batch)=><tr key={batch.id}><td><div className="transaction-name"><span className="transaction-icon"><FileText size={13}/></span><div><b>{batch.customerName} · •••• {batch.accountNumber.slice(-4)}</b><small>{batch.reason}</small></div></div></td><td>{batch.entryCount}</td><td>{new Date(batch.createdAt).toLocaleString()}</td><td className={`money ${batch.netChangeMinor>=0?"credit":""}`}>{batch.netChangeMinor>=0?"+":""}{formatMoney(batch.netChangeMinor)}</td></tr>)}</tbody></table>
      {!statementBatches.length&&<div className="empty-ledger">No historical statement batches have been imported.</div>}
    </section>
  </>;
}

function AdminDepositsWorkspace() {
  const {customers:directoryCustomers,depositMethods,depositRequests,mutate}=useBankingData();
  const customers=useMemo(()=>directoryCustomers.map((customer)=>({userId:customer.userId,name:`${customer.firstName} ${customer.lastName}`.trim()})),[directoryCustomers]);
  const [userId,setUserId]=useState("");
  const [methodType,setMethodType]=useState<"BANK_TRANSFER"|"CRYPTO">("BANK_TRANSFER");
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const [reason,setReason]=useState("Verified deposit evidence.");
  const [submitting,setSubmitting]=useState(false);

  useEffect(()=>{
    if(customers.some((customer)=>customer.userId===userId))return;
    const frame=window.requestAnimationFrame(()=>{
      setUserId(customers[0]?.userId??"");
      setError("");
    });
    return()=>window.cancelAnimationFrame(frame);
  },[customers,userId]);

  async function saveMethod(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!customers.some((customer)=>customer.userId===userId)){
      setError("Select a valid customer before publishing deposit instructions.");
      return;
    }
    setSubmitting(true);setError("");
    const values=Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const result=await mutate({action:"DEPOSIT_METHOD_SAVE",userId,methodType,...values});
      setNotice(`${result.reference} saved. The customer deposit page now displays these ${methodType==="CRYPTO"?"crypto":"bank"} instructions.`);
    } catch(saveError) {
      setError(saveError instanceof Error?saveError.message.replaceAll("_"," "):"Deposit method save failed");
    } finally {setSubmitting(false);}
  }

  async function decide(requestId:string,decision:"APPROVE"|"REJECT") {
    setSubmitting(true);setError("");
    try {
      const result=await mutate({action:"DEPOSIT_REQUEST_DECIDE",requestId,depositDecision:decision,reason});
      setNotice(`${result.reference} ${decision==="APPROVE"?"approved and credited to the customer ledger":"rejected without changing the balance"}.`);
    } catch(decisionError) {
      setError(decisionError instanceof Error?decisionError.message.replaceAll("_"," "):"Deposit decision failed");
    } finally {setSubmitting(false);}
  }

  return <>
    <div className="overview-head"><div><h2>Customer deposit operations</h2><p>Configure profile-specific bank and crypto instructions, then verify customer deposit requests.</p></div></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    {error&&<div className="auth-error">{error}</div>}
    <div className="two-column-workspace admin-deposit-layout">
      <section className="section-card">
        <div className="section-title"><div><h2>Configure customer instructions</h2><p>Only these staff-controlled details are exposed on the selected customer’s deposit page.</p></div></div>
        <form className="form-grid" key={`${userId}-${methodType}`} onSubmit={saveMethod}>
          <div className="form-row"><div className="field"><label>CUSTOMER</label><select value={userId} disabled={!customers.length} onChange={(event)=>{setError("");setUserId(event.target.value);}}>{!customers.length&&<option value="">No eligible customers</option>}{customers.map((customer)=><option value={customer.userId} key={customer.userId}>{customer.name} · {customer.userId}</option>)}</select></div><div className="field"><label>METHOD TYPE</label><select value={methodType} onChange={(event)=>setMethodType(event.target.value as "BANK_TRANSFER"|"CRYPTO")}><option value="BANK_TRANSFER">Bank transfer</option><option value="CRYPTO">Crypto</option></select></div></div>
          <div className="field"><label>CUSTOMER-FACING LABEL</label><input name="label" defaultValue={methodType==="BANK_TRANSFER"?"Northstar inbound bank transfer":"USDC deposit"} required/></div>
          {methodType==="BANK_TRANSFER"?<>
            <div className="form-row"><div className="field"><label>BANK NAME</label><input name="bankName" defaultValue="Northstar Clearing" required/></div><div className="field"><label>ACCOUNT NAME</label><input name="accountName" defaultValue={customers.find((customer)=>customer.userId===userId)?.name??"Customer"} required/></div></div>
            <div className="form-row"><div className="field"><label>ACCOUNT NUMBER</label><input name="accountNumber" defaultValue="9900882104" required/></div><div className="field"><label>ROUTING NUMBER</label><input name="routingNumber" defaultValue="021000021" required/></div></div>
            <div className="field"><label>SWIFT / BIC</label><input name="swiftBic" defaultValue="NSTRUS33"/></div>
          </>:<>
            <div className="form-row"><div className="field"><label>CRYPTO ASSET</label><input name="cryptoAsset" defaultValue="USDC" required/></div><div className="field"><label>NETWORK</label><input name="cryptoNetwork" defaultValue="SIM-ETHEREUM" required/></div></div>
            <div className="field"><label>WALLET ADDRESS</label><input name="walletAddress" defaultValue={`northstar_sim_usdc_${userId.replaceAll("-","").toLowerCase()}`} required/></div>
          </>}
          <div className="field"><label>CUSTOMER INSTRUCTIONS</label><textarea name="instructions" defaultValue={methodType==="BANK_TRANSFER"?"Use the customer number as the payment reference.":"Send only the selected asset on the specified network and include the customer reference."} required/></div>
          <button className="admin-execute" disabled={submitting||!customers.some((customer)=>customer.userId===userId)}>{submitting?"Saving…":"Publish deposit instructions"}</button>
        </form>
      </section>
      <aside className="section-card">
        <div className="section-title"><div><h2>Published methods</h2><p>{depositMethods.length} profile-specific instructions</p></div></div>
        <div className="configured-method-list">{depositMethods.map((method)=><article key={method.id}><span>{method.methodType==="CRYPTO"?<Coins size={17}/>:<Building2 size={17}/>}</span><div><b>{method.label}</b><small>{method.userId} · {method.methodType==="CRYPTO"?`${method.cryptoAsset} · ${method.cryptoNetwork}`:`${method.bankName} · •••• ${method.accountNumber?.slice(-4)}`}</small></div><span className="status-pill">Active</span></article>)}</div>
      </aside>
    </div>
    <section className="section-card" style={{marginTop:14}}>
      <div className="section-title"><div><h2>Customer deposit review queue</h2><p>Approval creates a posted credit and updates the customer balance. Rejection creates no ledger row.</p></div><span className="status-pill warn">{depositRequests.filter((request)=>request.status==="PENDING").length} pending</span></div>
      <div className="field deposit-decision-reason"><label>DECISION REASON</label><input value={reason} onChange={(event)=>setReason(event.target.value)} required/></div>
      <table className="activity-table admin-workspace-table"><thead><tr><th>Request</th><th>Status</th><th className="money">Amount</th><th></th></tr></thead><tbody>{depositRequests.map((request)=><tr key={request.id}><td><div className="transaction-name"><span className="transaction-icon"><CircleDollarSign size={13}/></span><div><b>{request.reference} · {request.customerName}</b><small>{request.methodLabel} · reference {request.senderReference} · •••• {request.accountNumber.slice(-4)}</small></div></div></td><td><span className={`status-pill ${request.status==="PENDING"?"warn":request.status==="REJECTED"?"block":""}`}>{request.status}</span></td><td className="money">{formatMoney(request.amountMinor)}</td><td className="row-action">{request.status==="PENDING"?<div className="deposit-decision-buttons"><button type="button" disabled={submitting} onClick={()=>decide(request.id,"REJECT")}>Reject</button><button type="button" className="approve" disabled={submitting} onClick={()=>decide(request.id,"APPROVE")}>Approve</button></div>:<button type="button" disabled>Complete</button>}</td></tr>)}</tbody></table>
      {!depositRequests.length&&<div className="empty-ledger">No customer deposit requests have been submitted.</div>}
    </section>
  </>;
}

function AdminStopCodesWorkspace() {
  const { customers:directoryCustomers, stopCodes, mutate } = useBankingData();
  const [code,setCode] = useState("ENHANCED_COMPLIANCE");
  const [name,setName] = useState("Enhanced compliance release");
  const [customerMessage,setCustomerMessage] = useState("Operations requires a reusable compliance release code before this transfer can be completed.");
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");
  const [submitting,setSubmitting] = useState(false);
  const [credentialUserId,setCredentialUserId] = useState("");
  const [credentialReason,setCredentialReason] = useState("Reusable compliance credential issued for enhanced transfer review.");
  const [generatedCredentials,setGeneratedCredentials] = useState<Record<string,string>>({});
  const customers=useMemo(()=>directoryCustomers.map((customer)=>({userId:customer.userId,name:`${customer.firstName} ${customer.lastName}`.trim()})),[directoryCustomers]);
  useEffect(()=>{
    if(customers.some((customer)=>customer.userId===credentialUserId))return;
    const frame=window.requestAnimationFrame(()=>{
      setCredentialUserId(customers[0]?.userId??"");
      setError("");
    });
    return()=>window.cancelAnimationFrame(frame);
  },[customers,credentialUserId]);
  async function save(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await mutate({action:"STOP_CODE_CREATE",code,name,customerMessage});
      setNotice(`${result.reference??code.toUpperCase()} is active and can now be paired with Mode 2 customers.`);
    } catch (saveError) {
      setError(saveError instanceof Error?saveError.message.replaceAll("_"," "):"Unable to save stop code");
    } finally {
      setSubmitting(false);
    }
  }
  async function generateCredential(stopCode:string) {
    if (!customers.some((customer)=>customer.userId===credentialUserId)) {
      setError("Select a valid customer before generating a compliance code.");
      return;
    }
    if (!credentialReason.trim()) {
      setError("Enter an operational reason before generating a compliance code.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await mutate({
        action:"STOP_CODE_CREDENTIAL_GENERATE",
        userId:credentialUserId,
        stopCode,
        reason:credentialReason,
      });
      if (!result.generatedCode) throw new Error("CODE_GENERATION_FAILED");
      setGeneratedCredentials((current)=>({...current,[stopCode]:result.generatedCode!}));
      setNotice(`${stopCode} generated a reusable compliance code for ${credentialUserId}. Copy it for secure delivery to the customer.`);
    } catch (generationError) {
      setError(generationError instanceof Error?generationError.message.replaceAll("_"," "):"Unable to generate compliance code");
    } finally {
      setSubmitting(false);
    }
  }
  return <>
    <div className="overview-head"><div><h2>Compliance stop codes</h2><p>Create customer-safe soft-hold definitions for Mode 2 external transfers.</p></div></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    <section className="section-card stop-code-builder">
      <div className="section-title"><div><h2>Create or update a stop code</h2><p>The customer sees only the safe message. The generated compliance code remains separate.</p></div></div>
      <form className="form-grid" onSubmit={save}>
        {error&&<div className="auth-error">{error}</div>}
        <div className="form-row"><div className="field"><label>STOP CODE</label><input value={code} onChange={(event)=>setCode(event.target.value.toUpperCase().replaceAll(" ","_"))} required/></div><div className="field"><label>DISPLAY NAME</label><input value={name} onChange={(event)=>setName(event.target.value)} required/></div></div>
        <div className="field"><label>CUSTOMER-SAFE HOLD MESSAGE</label><textarea value={customerMessage} onChange={(event)=>setCustomerMessage(event.target.value)} required/></div>
        <div className="impact-preview"><b>Reusable compliance control</b><span>When paired with Mode 2, every new ACH or wire request pauses until the customer enters the active reusable code generated by operations.</span></div>
        <button className="inline-submit" disabled={submitting}>{submitting?"Saving…":"Save stop code"}</button>
      </form>
    </section>
    <section className="section-card">
      <div className="section-title"><div><h2>Available Mode 2 stop codes</h2><p>Generate a separate reusable customer credential from any active stop code.</p></div><span className="status-pill">{stopCodes.length} configured</span></div>
      <div className="stop-code-credential-controls"><div className="field"><label>CUSTOMER RECEIVING THE CODE</label><select value={credentialUserId} disabled={!customers.length} onChange={(event)=>{setError("");setCredentialUserId(event.target.value);}}>{!customers.length&&<option value="">No eligible customers</option>}{customers.map((customer)=><option key={customer.userId} value={customer.userId}>{customer.name} · {customer.userId}</option>)}</select></div><div className="field"><label>GENERATION REASON</label><input value={credentialReason} onChange={(event)=>setCredentialReason(event.target.value)} required/></div></div>
      <div className="stop-code-catalog">{stopCodes.map((item)=><article key={item.code}><div><ShieldAlert size={17}/><span><b>{item.code}</b><small>{item.name}</small></span></div><p>{item.customerMessage}</p>{generatedCredentials[item.code]?<div className="catalog-generated-code"><span>Generated for {credentialUserId}</span><strong>{generatedCredentials[item.code]}</strong><button type="button" onClick={()=>navigator.clipboard.writeText(generatedCredentials[item.code])}>Copy for customer</button><small>Shown once; only its hash is stored.</small></div>:<button type="button" className="catalog-generate-button" disabled={submitting||!item.active||!customers.some((customer)=>customer.userId===credentialUserId)} onClick={()=>generateCredential(item.code)}><KeyRound size={14}/>Generate customer code</button>}<span className="status-pill">{item.active?"Active":"Inactive"}</span></article>)}</div>
    </section>
  </>;
}

type WebsiteSettingsForm = {
  heroHeading: string;
  heroMessage: string;
  simulationBanner: string;
  supportEmail: string;
  showChecking: boolean;
  showSavings: boolean;
  showLoans: boolean;
  maintenanceMode: boolean;
};

type WebsiteRevisionSummary = {
  id: string;
  revisionNumber: number;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  changeReason: string;
  createdBy: string;
  scheduledFor: string | null;
  publishedAt: string | null;
  createdAt: string;
};

const defaultWebsiteSettings: WebsiteSettingsForm = {
  heroHeading: "Build today. Plan for what comes next.",
  heroMessage: "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.",
  simulationBanner: "COMPLIANCE INFORMATION IS AVAILABLE IN THE DISCLOSURE SECTION",
  supportEmail: "support@northstar.test",
  showChecking: true,
  showSavings: true,
  showLoans: true,
  maintenanceMode: false,
};

function AdminWebsiteWorkspace() {
  const {brandProfiles}=useBankingData();
  const activeBrand=brandProfiles.find((brand)=>brand.active)??null;
  const [settings,setSettings] = useState<WebsiteSettingsForm>(defaultWebsiteSettings);
  const [revisions,setRevisions] = useState<WebsiteRevisionSummary[]>([]);
  const [publishedRevision,setPublishedRevision] = useState<WebsiteRevisionSummary | null>(null);
  const [publicationStatus,setPublicationStatus] = useState<"PUBLISHED"|"DRAFT"|"SCHEDULED">("PUBLISHED");
  const [scheduledFor,setScheduledFor] = useState("");
  const [minimumWebsiteSchedule]=useState(()=>new Date(Date.now()+60_000).toISOString().slice(0,16));
  const [changeReason,setChangeReason] = useState("");
  const [loading,setLoading] = useState(true);
  const [submitting,setSubmitting] = useState(false);
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");

  async function loadSettings() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/admin/api/website", { cache: "no-store" });
      const result = await response.json() as {
        error?: string;
        published?: WebsiteSettingsForm;
        publishedRevision?: WebsiteRevisionSummary | null;
        revisions?: WebsiteRevisionSummary[];
      };
      if (!response.ok) throw new Error(result.error ?? "WEBSITE_SETTINGS_READ_FAILED");
      setSettings(result.published ?? defaultWebsiteSettings);
      setPublishedRevision(result.publishedRevision ?? null);
      setRevisions(result.revisions ?? []);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message.replaceAll("_"," ") : "Website settings could not be loaded");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{const timer=window.setTimeout(()=>void loadSettings(),0);const channel=new BroadcastChannel("northstar-website");channel.onmessage=()=>void loadSettings();return()=>{window.clearTimeout(timer);channel.close();};},[]);

  function updateSetting<Key extends keyof WebsiteSettingsForm>(key: Key, value: WebsiteSettingsForm[Key]) {
    setSettings((current)=>({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/admin/api/website", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content: settings,
          publicationStatus,
          scheduledFor: publicationStatus === "SCHEDULED" ? new Date(scheduledFor).toISOString() : null,
          changeReason,
        }),
      });
      const result = await response.json() as { error?: string; revisionNumber?: number };
      if (!response.ok) throw new Error(result.error ?? "WEBSITE_SETTINGS_SAVE_FAILED");
      setNotice(publicationStatus === "PUBLISHED"
        ? `Revision ${result.revisionNumber} is published and now active on the landing page.`
        : publicationStatus === "SCHEDULED"
          ? `Revision ${result.revisionNumber} is scheduled for publication.`
          : `Revision ${result.revisionNumber} was saved as a draft.`);
      setChangeReason("");
      await loadSettings();
      const channel = new BroadcastChannel("northstar-website");
      channel.postMessage({ updated: true });
      channel.close();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message.replaceAll("_"," ") : "Website settings could not be saved");
    } finally {
      setSubmitting(false);
    }
  }

  return <>
    <div className="overview-head"><div><h2>Website management</h2><p>Publish landing-page messaging, product visibility, support details, and maintenance state.</p></div><div className="table-tools"><button type="button" onClick={()=>void loadSettings()}><RefreshCw size={14}/>Refresh</button><Link href="/" className="primary-action" target="_blank"><Globe2 size={14}/>Open public site</Link></div></div>
    {notice&&<div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
    {error&&<div className="auth-error website-settings-error">{error}</div>}
    <div className="website-management-metrics">
      <div><span>LIVE REVISION</span><strong>{publishedRevision ? `v${publishedRevision.revisionNumber}` : "—"}</strong><small>{publishedRevision?.publishedAt ? `Published ${new Date(publishedRevision.publishedAt).toLocaleString()}` : "Loading website state"}</small></div>
      <div><span>PUBLIC STATUS</span><strong>{settings.maintenanceMode ? "Maintenance" : "Published"}</strong><small>{settings.maintenanceMode ? "Maintenance notice is visible" : "Landing page is available"}</small></div>
      <div><span>REVISION HISTORY</span><strong>{revisions.length}</strong><small>Published, scheduled, draft, and archived versions</small></div>
    </div>
    <div className="website-management-layout">
      <form className="section-card website-settings-form" onSubmit={save}>
        <div className="section-title"><div><h2>Public website settings</h2><p>{loading ? "Loading the published configuration…" : "Every save creates a versioned, auditable revision."}</p></div><span className="status-pill">Server persisted</span></div>
        <div className="website-settings-body">
          <div className="form-row"><div className="field"><label>PUBLICATION STATUS</label><select value={publicationStatus} onChange={(event)=>setPublicationStatus(event.target.value as typeof publicationStatus)}><option value="PUBLISHED">Publish immediately</option><option value="DRAFT">Save draft</option><option value="SCHEDULED">Schedule publication</option></select></div><div className="field"><label>FALLBACK SUPPORT EMAIL</label><input type="email" value={settings.supportEmail} onChange={(event)=>updateSetting("supportEmail",event.target.value)} required/><small>{activeBrand?`The active ${activeBrand.shortName} brand currently publishes ${activeBrand.supportEmail}.`:"Used when no active brand profile is available."}</small></div></div>
          {publicationStatus==="SCHEDULED"&&<div className="field"><label>SCHEDULED DATE AND TIME</label><input type="datetime-local" min={minimumWebsiteSchedule} value={scheduledFor} onChange={(event)=>setScheduledFor(event.target.value)} required/></div>}
          <div className="field"><label>LANDING PAGE HERO HEADING</label><input value={settings.heroHeading} onChange={(event)=>updateSetting("heroHeading",event.target.value)} minLength={5} maxLength={120} required/></div>
          <div className="field"><label>LANDING PAGE HERO MESSAGE</label><textarea value={settings.heroMessage} onChange={(event)=>updateSetting("heroMessage",event.target.value)} minLength={10} maxLength={500} required/></div>
          <div className="website-control-grid website-live-controls"><label><input type="checkbox" checked={settings.showChecking} onChange={(event)=>updateSetting("showChecking",event.target.checked)}/>Show checking product</label><label><input type="checkbox" checked={settings.showSavings} onChange={(event)=>updateSetting("showSavings",event.target.checked)}/>Show savings product</label><label><input type="checkbox" checked={settings.showLoans} onChange={(event)=>updateSetting("showLoans",event.target.checked)}/>Show loan products</label><label className="maintenance-toggle"><input type="checkbox" checked={settings.maintenanceMode} onChange={(event)=>updateSetting("maintenanceMode",event.target.checked)}/>Enable maintenance notice</label></div>
          <div className="field"><label>REQUIRED CHANGE REASON</label><textarea value={changeReason} onChange={(event)=>setChangeReason(event.target.value)} minLength={8} maxLength={500} required placeholder="Explain why the public website is being changed"/></div>
          <div className="impact-preview"><b>Safe publication behavior</b><span>Published settings replace the current live revision atomically. Drafts do not affect customers. Scheduled revisions activate only after their publication time.</span></div>
          <button className="admin-execute" disabled={submitting||loading}>{submitting?"Saving revision…":publicationStatus==="PUBLISHED"?"Publish website update":publicationStatus==="DRAFT"?"Save website draft":"Schedule website update"}</button>
        </div>
      </form>
      <aside className="section-card website-live-preview">
        <div className="section-title"><div><h2>Live preview</h2><p>Preview of the editable landing-page content.</p></div></div>
        <div className="website-preview-hero"><small>PERSONAL BANKING</small><h3>{settings.heroHeading}</h3><p>{settings.heroMessage}</p><span>Open an account <ArrowUpRight size={13}/></span></div>
        {settings.maintenanceMode&&<div className="website-preview-maintenance"><ShieldAlert size={16}/><div><b>Scheduled maintenance</b><span>Customers will see a service notice while the site remains accessible.</span></div></div>}
        <div className="website-preview-products">{settings.showChecking&&<span>Checking</span>}{settings.showSavings&&<span>Savings</span>}{settings.showLoans&&<span>Loans</span>}{!settings.showChecking&&!settings.showSavings&&!settings.showLoans&&<small>No public products selected</small>}</div>
        <div className="website-preview-support"><Headphones size={15}/><span>Support: {activeBrand?.supportEmail??settings.supportEmail}</span></div>
      </aside>
    </div>
    <section className="section-card website-revision-history">
      <div className="section-title"><div><h2>Revision history</h2><p>Recent website changes are retained with their actor and reason.</p></div></div>
      <table className="activity-table"><thead><tr><th>Revision</th><th>Status</th><th>Reason</th><th className="money">Created</th></tr></thead><tbody>{revisions.map((revision)=><tr key={revision.id}><td><div className="transaction-name"><span className="transaction-icon"><Globe2 size={13}/></span><div><b>Revision {revision.revisionNumber}</b><small>{revision.createdBy}</small></div></div></td><td><span className={`status-pill ${revision.status==="SCHEDULED"||revision.status==="DRAFT"?"warn":revision.status==="ARCHIVED"?"block":""}`}>{revision.status.toLowerCase()}</span></td><td>{revision.changeReason}</td><td className="money">{new Date(revision.createdAt).toLocaleString()}</td></tr>)}</tbody></table>
    </section>
  </>;
}

function AdminSection({ section }: { section: string }) {
  const [notice, setNotice] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [customerFilter,setCustomerFilter] = useState("ALL");
  const { customers: liveCustomers, accounts: liveAccounts, transactions: liveTransactions, refresh } = useBankingData();
  const workspaces: Record<string, {
    title: string; copy: string; action: string; queue: string; queueCopy: string;
    metricA: [string,string]; metricB: [string,string];
    rows: Array<[string,string,string,string,string,string]>;
  }> = {
    customers: {
      title: "Customer directory", copy: "Search, review, and maintain customer profiles.",
      action: "Create customer", queue: "Customer records", queueCopy: "Relationship, KYC, and account status in one view.",
      metricA: ["1,248","Active customers"], metricB: ["18","Added this week"],
      rows: [
        ["Alex Morgan","C-882104 · alex@example.test","Active","","$104,020.62","View profile"],
        ["Maya Chen","C-882088 · maya@example.test","KYC review","warn","$0.00","Open review"],
        ["Daniel Foster","C-881972 · daniel@example.test","Restricted","block","$32,802.10","View profile"],
      ],
    },
    kyc: {
      title: "KYC review queue", copy: "Approve or reject identity submissions before account activation.",
      action: "Create review", queue: "Pending applications", queueCopy: "Oldest submitted applications appear first.",
      metricA: ["14","Awaiting decision"], metricB: ["4","Over 24 hours"],
      rows: [
        ["KYC-2026-0418","Maya Chen · submitted 3h ago","Documents ready","","3 files","Review"],
        ["KYC-2026-0417","Isaac Brown · submitted 9h ago","Needs review","warn","2 files","Review"],
        ["KYC-2026-0416","Lena Ortiz · submitted yesterday","Flagged","block","4 files","Investigate"],
      ],
    },
    accounts: {
      title: "Account management", copy: "Open, fund, freeze, and inspect customer deposit accounts.",
      action: "Fund account", queue: "Deposit accounts", queueCopy: "Balances are cached from the immutable ledger.",
      metricA: ["1,936","Open accounts"], metricB: ["$8.42m","Total deposits"],
      rows: [
        ["Everyday Checking · 1842","Alex Morgan · CHECKING","Active","","$25,680.40","Manage"],
        ["Growth Savings · 9081","Alex Morgan · SAVINGS","Active","","$78,340.22","Manage"],
        ["Reserve Checking · 3320","Daniel Foster · CHECKING","Frozen","block","$32,802.10","Review freeze"],
      ],
    },
    transactions: {
      title: "Transaction management", copy: "Post dated credits or debits to any customer and reverse incorrect entries without rewriting history.",
      action: "Add transaction", queue: "Customer transaction history", queueCopy: "Every row is reflected immediately in the selected customer account balance.",
      metricA: ["Live","Ledger history"], metricB: ["Balanced","Account cache"],
      rows: [],
    },
    deposits: {
      title: "Customer deposits", copy: "Post one-time funding or schedule recurring deposits for customer accounts.",
      action: "Create deposit", queue: "Deposit activity", queueCopy: "Every completed deposit creates a balanced treasury-to-customer ledger posting.",
      metricA: ["$284k","Deposited today"], metricB: ["18","Active schedules"],
      rows: [
        ["DEP-260724-1848","Alex Morgan · Payroll deposit","Completed","","$4,850.00","Inspect"],
        ["SCH-260724-0142","Maya Chen · Monthly recurring credit","Automatic","","$2,500.00","Edit schedule"],
        ["DEP-260724-1847","Daniel Foster · Branch cash deposit","Pending","warn","$1,200.00","Review"],
      ],
    },
    withdrawals: {
      title: "Withdrawal operations", copy: "Configure withdrawal methods and review outbound cash requests.",
      action: "Create method", queue: "Methods and requests", queueCopy: "Withdrawals debit customer accounts and credit an internal settlement account.",
      metricA: ["6","Active methods"], metricB: ["11","Pending requests"],
      rows: [
        ["WDM-ATM-001","ATM cash · instant","Active","","$500 max","Edit method"],
        ["WDM-BRANCH-002","Branch pickup · same day","Active","","$5,000 max","Edit method"],
        ["WDR-260724-0721","Alex Morgan · ATM cash request","Pending","warn","$240.00","Review request"],
      ],
    },
    "e-currency": {
      title: "Digital-asset methods", copy: "Configure digital-asset methods for customer deposits and withdrawals.",
      action: "Create digital-asset method", queue: "Configured digital-asset methods", queueCopy: "Manage wallet identifiers, supported networks, and conversion settings.",
      metricA: ["8","Active methods"], metricB: ["3","Currencies"],
      rows: [
        ["ECM-USDC-001","USD Coin · deposit and withdrawal","Active","","1.00 USD","Edit method"],
        ["ECM-BTC-002","Bitcoin · deposit only","Active","","Market rate","Edit method"],
        ["ECM-ETH-003","Ether · paused for maintenance","Paused","warn","Market rate","Review"],
      ],
    },
    transfers: {
      title: "Transfer operations", copy: "Review customer and staff-initiated transfer instructions.",
      action: "New transfer", queue: "Transfer activity", queueCopy: "Domestic and international rails terminate in clearing accounts.",
      metricA: ["342","Today"], metricB: ["7","Blocked"],
      rows: [
        ["TRF-260724-8841","Internal · Checking 1842 → Savings 9081","Completed","","$2,500.00","Inspect"],
        ["TRF-260724-8840","International · Daniel Foster","Blocked","block","$9,800.00","Review stop"],
        ["TRF-260724-8839","Domestic · Maya Chen","Processing","warn","$1,240.00","Inspect"],
      ],
    },
    "transfer-errors": {
      title: "Transfer error catalog", copy: "Create and edit processor errors shown during transfer processing.",
      action: "Add transfer error", queue: "Configured transfer errors", queueCopy: "Customer copy stays separate from staff diagnostics.",
      metricA: ["12","Active errors"], metricB: ["4","Retryable"],
      rows: [
        ["ERR_STOP_DEBIT","Outbound activity blocked by account control","Active","block","Customer-safe","Edit error"],
        ["ERR_DAILY_LIMIT","Configured daily transfer limit exceeded","Active","warn","Retry tomorrow","Edit error"],
        ["ERR_CLEARING_TIMEOUT","Clearing processor unavailable","Active","warn","Retryable","Edit error"],
      ],
    },
    loans: {
      title: "Loan decisions", copy: "Review applications, set terms, and post balanced disbursements.",
      action: "Create facility", queue: "Loan applications", queueCopy: "Decisions require recent MFA verification.",
      metricA: ["9","Pending decisions"], metricB: ["$412k","Active principal"],
      rows: [
        ["LN-2026-2041","Maya Chen · Equipment purchase","Pending","warn","$25,000.00","Decide"],
        ["LN-2026-2040","Alex Morgan · Working capital","Active","","$14,420.00","View schedule"],
        ["LN-2026-2039","Isaac Brown · Vehicle","Rejected","block","$18,000.00","View decision"],
      ],
    },
    support: {
      title: "Support inbox", copy: "Reply to customer tickets and add staff-only operational notes.",
      action: "New ticket", queue: "Open conversations", queueCopy: "Prioritized by urgency and most recent message.",
      metricA: ["23","Open tickets"], metricB: ["6m","Median response"],
      rows: [
        ["SUP-10482","Alex Morgan · Statement correction","Waiting for staff","warn","2m ago","Reply"],
        ["SUP-10481","Nora Singh · Beneficiary setup","Open","","11m ago","Reply"],
        ["SUP-10474","Daniel Foster · Transfer unavailable","Escalated","block","1h ago","Open case"],
      ],
    },
    ledger: {
      title: "General ledger", copy: "Inspect balanced postings and create audited corrections.",
      action: "Ledger operation", queue: "Recent journal", queueCopy: "Posted rows are immutable; corrections reverse and replace.",
      metricA: ["684","Postings today"], metricB: ["0","Imbalances"],
      rows: [
        ["LDG-260724-00984","Internal transfer · 2 entries","Posted","","$2,500.00","Inspect"],
        ["LDG-260724-00983","Admin funding · 2 entries","Posted","","$25,000.00","Inspect"],
        ["LDG-260724-00982","Correction group · 4 entries","Corrected","warn","$186.40","Audit correction"],
      ],
    },
    "stop-codes": {
      title: "Operational stop codes", copy: "Apply granular restrictions before any ledger write can occur.",
      action: "Apply stop code", queue: "Active restrictions", queueCopy: "Revocation also requires an audited reason.",
      metricA: ["7","Active stops"], metricB: ["2","System-wide"],
      rows: [
        ["TRANSFER_STOP","Daniel Foster · all transfers","Active","block","Applied 09:31","Revoke"],
        ["INTERNATIONAL_STOP","System · international rail","Active","block","Applied Jul 21","Revoke"],
        ["DEBIT_STOP","Account · 7730193320","Expires soon","warn","Ends 18:00","Extend"],
      ],
    },
    audit: {
      title: "Audit trail", copy: "Review the tamper-evident chain of privileged reads and changes.",
      action: "Export audit", queue: "Recent privileged events", queueCopy: "Events retain actor, request, before/after state, and hash.",
      metricA: ["12,408","Events this month"], metricB: ["Valid","Hash chain"],
      rows: [
        ["ACCOUNT_FUND","James Bell · account 1842","Success","","09:48:22","Inspect event"],
        ["STOP_CODE_APPLY","Sarah Okafor · Daniel Foster","Success","","09:31:04","Inspect event"],
        ["TRANSFER_CREATE","Daniel Foster · blocked by stop","Blocked","block","09:30:57","Inspect event"],
      ],
    },
    website: {
      title: "Website management", copy: "Manage public website content, product visibility, notices, and maintenance state.",
      action: "Edit website", queue: "Published website settings", queueCopy: "Changes are versioned and require an audit reason before publication.",
      metricA: ["Published","Website state"], metricB: ["Jul 24","Last update"],
      rows: [
        ["COMPLIANCE_DISCLOSURE","Compliance disclosure","Published","","Compliance section","Edit content"],
        ["PUBLIC_PRODUCTS","Checking, savings, and loan cards","Published","","3 products","Manage products"],
        ["MAINTENANCE_MODE","Public and customer portal availability","Off","","Updated Jul 20","Configure"],
      ],
    },
    system: {
      title: "System controls", copy: "Monitor service health and reconcile cached balances against the ledger.",
      action: "Run reconciliation", queue: "Service health", queueCopy: "Private infrastructure and service status.",
      metricA: ["Healthy","Platform state"], metricB: ["342ms","Average posting"],
      rows: [
        ["PostgreSQL 18","Primary system of record","Healthy","","12 ms","Details"],
        ["Redis worker","Outbox and statement jobs","Healthy","","3 queued","Details"],
        ["Object storage","KYC and PDF statement objects","Healthy","","2.4 GB","Details"],
      ],
    },
  };
  const visibleAccounts = customerFilter === "ALL"
    ? liveAccounts
    : liveAccounts.filter((account)=>account.userId===customerFilter);
  const visibleAccountIds = new Set(visibleAccounts.map((account)=>account.id));
  const visibleTransactions = customerFilter === "ALL"
    ? liveTransactions
    : liveTransactions.filter((transaction)=>visibleAccountIds.has(transaction.accountId));
  const transactionRows = visibleTransactions.map((transaction) => [
    transaction.reference,
    `${transaction.customerName} · ${transaction.accountNumber} · ${new Date(transaction.effectiveAt).toLocaleString()}`,
    transaction.status,
    transaction.status === "REVERSED" ? "block" : "",
    `${transaction.direction === "CREDIT" ? "+" : "−"}${formatMoney(transaction.amountMinor)}`,
    transaction.status === "POSTED" ? "Reverse" : "Inspect",
  ] as [string,string,string,string,string,string]);
  const accountRows = visibleAccounts.map((account) => [
    `${account.type === "CHECKING" ? "Everyday Checking" : "Growth Savings"} · ${account.accountNumber.slice(-4)}`,
    `${account.customerName} · ${account.type}`,
    "Active",
    "",
    formatMoney(account.balanceMinor),
    "Manage",
  ] as [string,string,string,string,string,string]);
  const customerRows = liveCustomers.map((customer) => {
    const customerAccounts=liveAccounts.filter((account)=>account.userId===customer.userId);
    const total=customerAccounts.reduce((sum,account)=>sum+account.balanceMinor,0);
    return [
      `${customer.firstName} ${customer.lastName}`,
      `${customer.userId} · ${customer.email} · ${customerAccounts.length} account${customerAccounts.length===1?"":"s"}`,
      customer.status,
      customer.status==="SUSPENDED"||customer.status==="BANNED"?"block":customer.status==="PENDING"?"warn":"",
      formatMoney(total),
      "View profile",
    ] as [string,string,string,string,string,string];
  });
  const baseWorkspace = workspaces[section] ?? workspaces.customers;
  const workspace = section === "transactions"
    ? { ...baseWorkspace, rows: transactionRows }
    : section === "accounts"
      ? { ...baseWorkspace, rows: accountRows }
      : section === "customers"
        ? { ...baseWorkspace, rows: customerRows }
      : baseWorkspace;

  function perform(action: string, reference?: string) {
    setActiveAction(`${action}${reference ? ` · ${reference}` : ""}`);
  }

  return (
    <>
      <div className="overview-head">
        <div><h2>{workspace.title}</h2><p>{workspace.copy}</p></div>
        <button className="primary-action" onClick={() => perform(workspace.action)}><Plus size={14}/>{workspace.action}</button>
      </div>
      {notice && <div className="operation-notice"><CheckCircle2 size={15}/><span>{notice}</span><button onClick={()=>setNotice("")}>Dismiss</button></div>}
      <div className="workspace-metrics">
        <div><strong>{workspace.metricA[0]}</strong><span>{workspace.metricA[1]}</span></div>
        <div><strong>{workspace.metricB[0]}</strong><span>{workspace.metricB[1]}</span></div>
        <div className="control-state"><KeyRound size={18}/><strong>MFA verified</strong><span>Sensitive actions unlocked for 4:32</span></div>
      </div>
      {section==="support"&&<LiveChatPanel realm="admin"/>}
      {activeAction && <AdminActionPanel section={section} action={activeAction} close={()=>setActiveAction(null)} complete={(message)=>{setActiveAction(null);setNotice(message);refresh();}}/>}
      <div className="section-card">
        <div className="section-title">
          <div><h2>{workspace.queue}</h2><p>{workspace.queueCopy}</p></div>
          <div className="table-tools">{(section==="accounts"||section==="transactions")&&<label className="customer-record-filter"><span>Customer profile</span><select value={customerFilter} onChange={(event)=>setCustomerFilter(event.target.value)}><option value="ALL">All customers</option>{liveCustomers.map((customer)=><option key={customer.userId} value={customer.userId}>{customer.firstName} {customer.lastName} · {customer.userId}</option>)}</select></label>}<button>Export</button></div>
        </div>
        <table className="activity-table admin-workspace-table">
          <thead><tr><th>Record</th><th>Status</th><th className="money">Value / updated</th><th></th></tr></thead>
          <tbody>{workspace.rows.map(([reference,detail,status,badge,value,action])=>
            <tr key={reference}>
              <td><div className="transaction-name"><span className="transaction-icon"><Server size={13}/></span><div><b>{reference}</b><small>{detail}</small></div></div></td>
              <td><span className={`status-pill ${badge}`}>{status}</span></td>
              <td className="money">{value}</td>
              <td className="row-action"><button onClick={()=>perform(action,reference)}>{action}</button></td>
            </tr>
          )}</tbody>
        </table>
      </div>
    </>
  );
}

function AdminActionPanel({ section, action, close, complete }: { section: string; action: string; close: () => void; complete: (message: string) => void }) {
  const { accounts, transactions, mutate } = useBankingData();
  const requestedAccountId = action.startsWith("Fund account · ")
    ? action.slice("Fund account · ".length)
    : accounts[0]?.id;
  const [selectedAccountId,setSelectedAccountId] = useState(requestedAccountId ?? "");
  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>{
      if (requestedAccountId && accounts.some((account)=>account.id===requestedAccountId)) setSelectedAccountId(requestedAccountId);
      else if (!accounts.some((account)=>account.id===selectedAccountId) && accounts[0]) setSelectedAccountId(accounts[0].id);
    });
    return()=>window.cancelAnimationFrame(frame);
  },[accounts,requestedAccountId,selectedAccountId]);
  const [submitError,setSubmitError] = useState("");
  const [submitting,setSubmitting] = useState(false);
  const [operation,setOperation] = useState(
    section === "ledger" ? "Statement correction"
      : section === "deposits" ? "Manual deposit"
      : section === "withdrawals" ? "Withdrawal method"
      : "",
  );
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitError("");
    setSubmitting(true);
    try {
      if(section==="customers"&&action.startsWith("Create customer")){
        const result=await mutate({
          action:"CUSTOMER_CREATE",
          firstName:String(form.get("firstName")??""),
          lastName:String(form.get("lastName")??""),
          email:String(form.get("email")??""),
        });
        complete(`${result.userId??"Customer"} created with no accounts, balances, cards, or transaction history.`);
        return;
      }
      if (section === "transactions" && action.startsWith("Reverse")) {
        const reference = action.split(" · ")[1];
        const transaction = transactions.find((item) => item.reference === reference);
        if (!transaction) throw new Error("TRANSACTION_NOT_FOUND");
        const result = await mutate({
          action: "REVERSE",
          transactionId: transaction.id,
          reason: String(form.get("reason") || "Admin correction"),
        });
        complete(`${result.reference} posted. The original transaction is retained as reversed.`);
        return;
      }
      if (section === "accounts" || section === "transactions" || (section === "deposits" && operation === "Manual deposit")) {
        const amountMinor = Math.round(Number(form.get("amount")) * 100);
        const balanceOperation = String(form.get("balanceOperation") || "");
        const payload: Record<string, unknown> = {
          action: "POST",
          accountId: String(form.get("accountId")),
          description: String(form.get("description") || form.get("reason") || "Admin transaction"),
          effectiveAt: new Date(String(form.get("effectiveAt") || new Date().toISOString())).toISOString(),
          customerVisible: section === "accounts" ? false : true,
        };
        if (section === "accounts" && balanceOperation === "TARGET") payload.targetBalanceMinor = amountMinor;
        else {
          payload.direction = section === "deposits" ? "CREDIT" : String(form.get("direction") || (balanceOperation === "DEBIT" ? "DEBIT" : "CREDIT"));
          payload.amountMinor = amountMinor;
        }
        const result = await mutate(payload);
        complete(`${result.reference} posted and the customer balance was updated.`);
        return;
      }
      complete(`${action} completed and appended to the tamper-evident audit trail.`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message.replaceAll("_"," ") : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  }
  return <section className="admin-action-panel">
    <div className="admin-action-head"><div><small>AUTHORIZED OPERATION</small><h3>{action}</h3></div><button onClick={close}>Close</button></div>
    <form onSubmit={submit}>
      {submitError && <div className="auth-error">{submitError}</div>}
      {section==="transactions" && (action.startsWith("Reverse") ? <><div className="impact-preview"><b>Immutable reversal</b><span>The original entry remains visible. A new opposite transaction restores the account balance.</span></div><div className="field"><label>REQUIRED REVERSAL REASON</label><textarea name="reason" required placeholder="Explain why this transaction is being reversed"/></div></> : <><div className="form-row"><div className="field"><label>CUSTOMER ACCOUNT</label><select name="accountId" required>{accounts.map((account)=><option key={account.id} value={account.id}>{account.customerName} · {account.type} {account.accountNumber.slice(-4)} · {formatMoney(account.balanceMinor)}</option>)}</select></div><div className="field"><label>TRANSACTION DIRECTION</label><select name="direction"><option value="CREDIT">Credit customer account</option><option value="DEBIT">Debit customer account</option></select></div></div><div className="form-row"><div className="field"><label>AMOUNT (USD)</label><input name="amount" type="number" min="0.01" step="0.01" defaultValue="1000.00" required/></div><div className="field"><label>EFFECTIVE DATE AND TIME</label><CurrentDateTimeInput/></div></div><div className="field"><label>CUSTOMER STATEMENT DESCRIPTION</label><input name="description" defaultValue="Administrative ledger adjustment" required maxLength={280}/></div><div className="field"><label>REQUIRED AUDIT REASON</label><textarea name="reason" required placeholder="Explain why this dated transaction is being added"/></div><div className="impact-preview"><b>Immediate balance update</b><span>The dated entry is added to customer history and its credit or debit is applied to the current balance atomically.</span></div></>)}
      {section==="customers" && (action.startsWith("Create customer")?<><div className="fresh-profile-callout"><Users size={18}/><div><b>Fresh customer profile</b><span>The profile starts pending with a $0.00 relationship balance and no accounts, cards, loans, beneficiaries, or transaction history.</span></div></div><div className="form-row"><div className="field"><label>FIRST NAME</label><input name="firstName" required/></div><div className="field"><label>LAST NAME</label><input name="lastName" required/></div></div><div className="field"><label>EMAIL ADDRESS</label><input name="email" type="email" required/></div><div className="field"><label>INITIAL STATUS</label><input value="PENDING · EMAIL NOT VERIFIED" readOnly/></div></>:<><div className="field"><label>CUSTOMER</label><select><option>Alex Morgan · C-882104</option><option>Maya Chen · C-882088</option><option>Daniel Foster · C-881972</option></select></div><div className="customer-360-strip"><div><b>Risk tier</b><span>Standard · 18/100</span></div><div><b>Portfolio</b><span>2 deposits · 1 loan</span></div><div><b>Last login</b><span>Today · Lagos</span></div></div><div className="field"><label>PROFILE STATUS OVERRIDE</label><select><option>VERIFIED</option><option>PENDING</option><option>SUSPENDED</option><option>BANNED</option></select></div><div className="field"><label>OVERRIDE REASON</label><textarea placeholder="Required audit reason"/></div></>)}
      {section==="kyc" && <><div className="review-document"><FileText size={22}/><div><b>Identity document package</b><span>3 verified files · address match passed</span></div><span className="status-pill">Ready</span></div><div className="field"><label>REVIEW NOTES</label><textarea placeholder="Record the decision rationale"/></div><div className="decision-buttons"><button type="button" className="deny" onClick={()=>complete(`${action} denied with an audit event.`)}>Deny application</button><button type="submit">Approve & open checking</button></div></>}
      {section==="accounts" && <><div className="form-row"><div className="field"><label>CUSTOMER ACCOUNT</label><select name="accountId" value={selectedAccountId} onChange={(event)=>setSelectedAccountId(event.target.value)} required>{accounts.map((account)=><option key={account.id} value={account.id}>{account.customerName} · {account.type} {account.accountNumber.slice(-4)} · {formatMoney(account.balanceMinor)}</option>)}</select></div><div className="field"><label>BALANCE OPERATION</label><select name="balanceOperation" defaultValue={action.startsWith("Fund account")?"CREDIT":"TARGET"}><option value="TARGET">Set target balance</option><option value="CREDIT">Add funding credit</option><option value="DEBIT">Post cash withdrawal</option></select></div></div><div className="balance-editor"><div><small>SELECTED ACCOUNT BALANCE</small><strong>Live ledger</strong></div><div className="field"><label>AMOUNT OR TARGET BALANCE (USD)</label><input name="amount" type="number" min="0.01" step="0.01" defaultValue="50000.00" required/></div><p>Target balance calculates the difference. Funding and withdrawals apply the entered amount. Every change creates a dated transaction instead of overwriting history.</p></div><div className="form-row"><div className="field"><label>FUNDING / ADJUSTMENT SOURCE</label><select><option>System treasury</option><option>Branch cash deposit</option><option>Inbound wire deposit</option></select></div><div className="field"><label>EFFECTIVE DATE AND TIME</label><CurrentDateTimeInput/></div></div><div className="field"><label>STATEMENT DESCRIPTION</label><input name="description" defaultValue="Administrative account funding" required/></div><div className="field"><label>REQUIRED AUDIT REASON</label><textarea name="reason" required placeholder="Explain why the customer balance is being changed"/></div></>}
      {section==="deposits" && <><div className="segmented-tabs"><button type="button" className={operation==="Manual deposit"?"active":""} onClick={()=>setOperation("Manual deposit")}>Manual deposit</button><button type="button" className={operation==="Automatic deposit"?"active":""} onClick={()=>setOperation("Automatic deposit")}>Automatic schedule</button></div><div className="form-row"><div className="field"><label>CUSTOMER ACCOUNT</label><select name="accountId" required>{accounts.map((account)=><option key={account.id} value={account.id}>{account.customerName} · {account.type} {account.accountNumber.slice(-4)} · {formatMoney(account.balanceMinor)}</option>)}</select></div><div className="field"><label>DEPOSIT AMOUNT (USD)</label><input name="amount" type="number" min="0.01" step="0.01" defaultValue={operation==="Manual deposit"?"4850.00":"2500.00"} required/></div></div>{operation==="Automatic deposit"?<div className="form-row"><div className="field"><label>FREQUENCY</label><select><option>Monthly</option><option>Every two weeks</option><option>Weekly</option><option>Quarterly</option></select></div><div className="field"><label>FIRST POSTING DATE</label><CurrentDateInput daysAhead={1}/></div></div>:<div className="field"><label>EFFECTIVE DATE AND TIME</label><CurrentDateTimeInput/></div>}<div className="form-row"><div className="field"><label>DEPOSIT SOURCE</label><select><option>System treasury</option><option>Payroll deposit</option><option>Branch cash</option><option>Inbound wire</option></select></div><div className="field"><label>STATEMENT DESCRIPTION</label><input name="description" defaultValue={operation==="Manual deposit"?"Admin cash deposit":"Scheduled deposit"} required/></div></div><div className="impact-preview"><b>{operation==="Manual deposit"?"Immediate balanced posting":"Automatic deposit schedule"}</b><span>{operation==="Manual deposit"?"The selected customer balance and dated history update as soon as this operation is confirmed.":"A worker creates one idempotent balanced ledger posting on each due date."}</span></div><div className="field"><label>REQUIRED AUDIT REASON</label><textarea name="reason" required placeholder="State why this deposit or schedule is being created"/></div></>}
      {section==="withdrawals" && <><div className="segmented-tabs"><button type="button" className={operation==="Withdrawal method"?"active":""} onClick={()=>setOperation("Withdrawal method")}>Withdrawal method</button><button type="button" className={operation==="Withdrawal request"?"active":""} onClick={()=>setOperation("Withdrawal request")}>Process request</button></div>{operation==="Withdrawal method"?<><div className="form-row"><div className="field"><label>METHOD NAME</label><input defaultValue="ATM cash"/></div><div className="field"><label>METHOD CODE</label><input defaultValue="ATM_CASH"/></div></div><div className="form-row"><div className="field"><label>MINIMUM / MAXIMUM</label><input defaultValue="$20.00 / $500.00"/></div><div className="field"><label>PROCESSING TIME</label><select><option>Instant</option><option>Same business day</option><option>1–2 business days</option></select></div></div><div className="form-row"><div className="field"><label>SETTLEMENT ACCOUNT</label><select><option>System cash clearing</option><option>System treasury</option></select></div><div className="field"><label>METHOD STATUS</label><select><option>Active</option><option>Paused</option></select></div></div><div className="field"><label>CUSTOMER INSTRUCTIONS</label><textarea defaultValue="Approved withdrawals post against the selected customer account."/></div></>:<><div className="review-document"><ArrowDownToLine size={21}/><div><b>WDR-260724-0721 · Alex Morgan</b><span>Checking 1842 · ATM cash · $240.00</span></div><span className="status-pill warn">Pending</span></div><div className="form-row"><div className="field"><label>DECISION</label><select><option>Approve and post</option><option>Reject request</option><option>Hold for review</option></select></div><div className="field"><label>SETTLEMENT ACCOUNT</label><select><option>System cash clearing</option></select></div></div></>}<div className="field"><label>REQUIRED AUDIT REASON</label><textarea required placeholder="Record the method change or withdrawal decision"/></div></>}
      {section==="e-currency" && <><div className="impact-preview e-currency-disclosure"><b>Digital-asset settlement settings</b><span>Configure supported assets, networks, conversion rates, fees, and settlement controls.</span></div><div className="form-row"><div className="field"><label>METHOD NAME</label><input defaultValue="USD Coin"/></div><div className="field"><label>METHOD CODE</label><input defaultValue="SIM_USDC"/></div></div><div className="form-row"><div className="field"><label>DIGITAL ASSET</label><select><option>USDC · USD Coin</option><option>BTC · Bitcoin</option><option>ETH · Ether</option><option>Custom E-currency</option></select></div><div className="field"><label>SUPPORTED DIRECTION</label><select><option>Deposits and withdrawals</option><option>Deposits only</option><option>Withdrawals only</option></select></div></div><div className="form-row"><div className="field"><label>CONVERSION RATE (USD)</label><input type="number" min="0" step="0.000001" defaultValue="1.000000"/></div><div className="field"><label>NETWORK FEE (USD)</label><input type="number" min="0" step="0.01" defaultValue="1.50"/></div></div><div className="form-row"><div className="field"><label>MINIMUM / MAXIMUM USD VALUE</label><input defaultValue="$10.00 / $25,000.00"/></div><div className="field"><label>METHOD STATUS</label><select><option>Active</option><option>Paused</option><option>Retired</option></select></div></div><div className="field"><label>INTERNAL WALLET IDENTIFIER PREFIX</label><input defaultValue="northstar_sim_usdc_"/></div><div className="field"><label>CUSTOMER INSTRUCTIONS</label><textarea defaultValue="Use the assigned wallet address and selected network. Include the customer reference with every deposit."/></div><div className="field"><label>REQUIRED AUDIT REASON</label><textarea required placeholder="Explain the E-currency method creation or change"/></div></>}
      {section==="transfers" && <><div className="form-row"><div className="field"><label>TRANSFER RAIL</label><select><option>Internal</option><option>Domestic ACH</option><option>International wire</option></select></div><div className="field"><label>SOURCE ACCOUNT</label><select><option>Checking · 1842</option><option>System treasury</option></select></div></div><div className="form-row"><div className="field"><label>DESTINATION / BENEFICIARY</label><input defaultValue="Northstar Supply LLC"/></div><div className="field"><label>AMOUNT</label><input defaultValue="1240.00"/></div></div><div className="field"><label>OPERATION NOTE</label><textarea placeholder="Staff transfer rationale"/></div></>}
      {section==="transfer-errors" && <><div className="form-row"><div className="field"><label>ERROR CODE</label><input defaultValue={action.includes("ERR_")?action.split(" · ")[1]:"ERR_CUSTOM_TRANSFER"}/></div><div className="field"><label>ERROR CATEGORY</label><select><option>Account restriction</option><option>Transaction limit</option><option>Processor failure</option><option>Beneficiary validation</option><option>Custom operations scenario</option></select></div></div><div className="field"><label>CUSTOMER-FACING MESSAGE</label><textarea defaultValue="This transfer cannot be completed right now. Contact support with the transfer reference."/></div><div className="field"><label>INTERNAL ADMIN DIAGNOSTIC</label><textarea defaultValue="Custom transfer error configured by operations."/></div><div className="form-row"><div className="field"><label>HTTP / DOMAIN STATUS</label><input defaultValue="422 · TRANSFER_REJECTED"/></div><div className="field"><label>RETRY POLICY</label><select><option>Not retryable</option><option>Retry immediately</option><option>Retry after 24 hours</option><option>Admin release required</option></select></div></div><div className="form-row"><div className="field"><label>ACTIVE</label><select><option>Yes</option><option>No</option></select></div><div className="field"><label>APPLIES TO RAIL</label><select><option>All transfer rails</option><option>Internal only</option><option>Domestic only</option><option>International only</option></select></div></div><div className="field"><label>CHANGE REASON</label><textarea placeholder="Required audit reason for adding or editing this system error"/></div></>}
      {section==="loans" && <><div className="underwriting-summary"><div><b>Applicant</b><span>Maya Chen</span></div><div><b>Risk score</b><span>22 / 100 · Low</span></div><div><b>Debt ratio</b><span>28.4%</span></div><div><b>Request</b><span>$25,000 equipment</span></div></div><div className="form-row"><div className="field"><label>APPROVED PRINCIPAL</label><input defaultValue="25000.00"/></div><div className="field"><label>ANNUAL RATE</label><input defaultValue="8.40%"/></div></div><div className="form-row"><div className="field"><label>TERM</label><select><option>36 months</option><option>24 months</option><option>48 months</option></select></div><div className="field"><label>DISBURSE TO</label><select><option>Checking · 3321</option></select></div></div><div className="field"><label>UNDERWRITING NOTES</label><textarea placeholder="Decision rationale"/></div><div className="decision-buttons"><button type="button" className="deny" onClick={()=>complete(`${action} denied; customer notified through the outbox.`)}>Deny loan</button><button type="submit">Approve & disburse</button></div></>}
      {section==="support" && <><div className="review-document"><Headphones size={21}/><div><b>Unauthorized transaction</b><span>SUP-10482 · Alex Morgan · unclaimed</span></div><button type="button" className="claim-button">Claim ticket</button></div><div className="ticket-thread"><p><b>Alex Morgan</b><span>I do not recognize the utility transaction posted yesterday.</span></p><p className="staff"><b>Operations draft</b><span>We are reviewing the posted ledger entry.</span></p></div><div className="field"><label>REPLY</label><textarea placeholder="Reply to customer or add an internal note"/></div><div className="form-row"><div className="field"><label>MESSAGE TYPE</label><select><option>Customer reply</option><option>Internal note</option></select></div><div className="field"><label>TICKET STATUS</label><select><option>Waiting for customer</option><option>Resolved</option><option>Closed</option></select></div></div></>}
      {section==="ledger" && <><div className="field"><label>LEDGER OPERATION</label><select value={operation} onChange={e=>setOperation(e.target.value)}><option>Statement correction</option><option>Backdated ledger entry</option><option>Maintenance fee injection</option><option>Overdraft fee injection</option><option>Wire penalty injection</option><option>Interest accrual run</option></select></div>{operation==="Statement correction"?<><div className="field"><label>POSTED TRANSACTION</label><select><option>Most recent posted transaction</option><option>Previous posted transaction</option></select></div><div className="form-row"><div className="field"><label>CORRECTED DESCRIPTION</label><input defaultValue="Operations reserve transfer"/></div><div className="field"><label>CORRECTED AMOUNT</label><input defaultValue="2500.00"/></div></div><div className="impact-preview"><b>Immutable correction</b><span>The original entry remains in the audit view. Northstar posts a reversal and replacement for the customer statement.</span></div></>:operation==="Backdated ledger entry"?<><div className="form-row"><div className="field"><label>CUSTOMER ACCOUNT</label><select><option>Checking · 1842 · Alex Morgan</option><option>Savings · 9081 · Alex Morgan</option></select></div><div className="field"><label>HISTORICAL EFFECTIVE DATE</label><CurrentDateTimeInput/></div></div><div className="form-row"><div className="field"><label>ENTRY DIRECTION</label><select><option>Credit customer account</option><option>Debit customer account</option></select></div><div className="field"><label>AMOUNT</label><input type="number" step="0.01" defaultValue="4850.00"/></div></div><div className="field"><label>STATEMENT DESCRIPTION</label><input defaultValue="Historical payroll deposit"/></div><div className="impact-preview"><b>Backdated ledger entry</b><span>The entry will appear at the selected historical date while retaining its creation time, staff identity, and audit hash.</span></div></>:operation.includes("Interest")?<><div className="form-row"><div className="field"><label>ACCOUNT PRODUCT</label><select><option>Growth Savings · all active accounts</option><option>12-Month CD</option></select></div><div className="field"><label>ACCRUAL PERIOD</label><CurrentMonthInput/></div></div><div className="impact-preview"><b>Preview</b><span>842 accounts · estimated $18,204.62 interest · balanced against interest expense</span></div></>:<><div className="form-row"><div className="field"><label>TARGET ACCOUNT</label><select><option>Checking · 1842 · Alex Morgan</option></select></div><div className="field"><label>FEE AMOUNT</label><input defaultValue="35.00"/></div></div><div className="field"><label>STATEMENT DESCRIPTION</label><input defaultValue={operation}/></div></>}<div className="field"><label>REQUIRED AUDIT REASON</label><textarea placeholder="Explain the correction, fee, accrual, or historical entry"/></div></>}
      {section==="stop-codes" && <><div className="form-row"><div className="field"><label>TARGET</label><select><option>Daniel Foster · all accounts</option><option>Account · 7730193320</option><option>System-wide</option></select></div><div className="field"><label>STOP CODE</label><select><option>STOP_DEBIT</option><option>STOP_CREDIT</option><option>HARD_HOLD</option><option>TRANSFER_STOP</option></select></div></div><div className="stop-code-explainer"><p><b>STOP_DEBIT</b>Credits remain open; all outbound activity is blocked.</p><p><b>STOP_CREDIT</b>Debits remain open; inbound funding is blocked.</p><p><b>HARD_HOLD</b>Account visibility and all customer activity are disabled.</p></div><div className="form-row"><div className="field"><label>DAILY VOLUME LIMIT</label><input defaultValue="5000.00"/></div><div className="field"><label>VELOCITY CAP</label><input defaultValue="5 transactions / day"/></div></div><div className="field"><label>RISK REASON</label><textarea placeholder="Required reason visible only to staff"/></div></>}
      {section==="audit" && <><div className="audit-event-detail"><code>STOP_CODE_APPLY</code><dl><div><dt>Actor</dt><dd>Sarah Okafor · Operations</dd></div><div><dt>Resource</dt><dd>Customer C-881972</dd></div><div><dt>Request</dt><dd>req_71f20b9a</dd></div><div><dt>Event hash</dt><dd>9a02…4f81 · verified</dd></div></dl></div><div className="field"><label>EXPORT FORMAT</label><select><option>CSV with hashes</option><option>JSON audit bundle</option></select></div></>}
      {section==="website" && <><div className="form-row"><div className="field"><label>CONTENT AREA</label><select><option>Compliance disclosure</option><option>Landing page hero</option><option>Product visibility</option><option>Support contact</option><option>Maintenance mode</option></select></div><div className="field"><label>PUBLICATION STATUS</label><select><option>Publish immediately</option><option>Save draft</option><option>Schedule publication</option></select></div></div><div className="field"><label>PUBLIC HEADING</label><input defaultValue="Banking designed around clarity, control, and dependable service."/></div><div className="field"><label>PUBLIC MESSAGE</label><textarea defaultValue="Explore accounts, transfers, lending, statements, and support from one secure banking experience."/></div><div className="website-control-grid"><label><input type="checkbox" defaultChecked/> Show checking product</label><label><input type="checkbox" defaultChecked/> Show savings product</label><label><input type="checkbox" defaultChecked/> Show loan product</label><label><input type="checkbox"/> Enable maintenance mode</label></div><div className="impact-preview"><b>Versioned website update</b><span>The prior content revision remains available to auditors and can be restored without editing audit history.</span></div><div className="field"><label>REQUIRED CHANGE REASON</label><textarea required placeholder="Explain why the public website is being changed"/></div></>}
      {section==="system" && <><div className="system-actions"><button type="button" onClick={()=>complete("Balance reconciliation completed with zero variances.")}><BookOpen size={17}/><b>Reconcile ledger</b><span>Compare cached balances with all posted entries</span></button><button type="button" onClick={()=>complete("Monthly interest accrual queued for 842 eligible accounts.")}><CircleDollarSign size={17}/><b>Run monthly interest</b><span>Preview and distribute account yields</span></button><button type="button" onClick={()=>complete("Outbox retry completed; all events processed.")}><Server size={17}/><b>Retry outbox</b><span>Process failed statements and notifications</span></button></div></>}
      {!["kyc","loans","system"].includes(section) && <button className="admin-execute" type="submit" disabled={submitting}>{submitting ? "Posting…" : section === "transactions" && action.startsWith("Reverse") ? "Post reversal" : "Confirm authorized operation"}</button>}
    </form>
  </section>;
}
