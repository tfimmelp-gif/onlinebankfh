"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Coins,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Headphones,
  KeyRound,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  Monitor,
  Plus,
  Printer,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Snowflake,
  Trash2,
  UploadCloud,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { formatMoney, useBankingData, type BankingTransferRequest } from "./useBankingData";
import { makeStyledStatementPdf } from "../lib/statement-pdf";
import { LiveChatPanel } from "./LiveChatPanel";

type Notice = { tone?: "success" | "warn"; text: string } | null;

function localDateValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function dateDaysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function monthDescriptor(monthsAgo: number) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - monthsAgo);
  return {
    label: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date),
    prefix: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
  };
}

export function transferRequestStatusLabel(status:BankingTransferRequest["status"]) {
  if (status==="PENDING") return "Awaiting approval";
  if (status==="PROCESSING") return "Under review";
  if (status==="COMPLETED") return "Approved";
  if (status==="FAILED") return "Rejected";
  return "Cancelled";
}

export function transferRequestStatusTone(status:BankingTransferRequest["status"]) {
  if (status==="COMPLETED") return "";
  if (status==="FAILED"||status==="CANCELLED") return "block";
  return "warn";
}

export function CustomerWorkspace({ section }: { section: string }) {
  if (section === "profile") return <ProfileKycWorkspace />;
  if (section === "accounts") return <AccountsWorkspace />;
  if (section === "deposits") return <DepositsWorkspace />;
  if (section === "cards") return <VirtualCardsWorkspace />;
  if (section === "transfers") return <TransfersWorkspace />;
  if (section === "bill-pay") return <BillPayWorkspace />;
  if (section === "beneficiaries") return <BeneficiariesWorkspace />;
  if (section === "loans") return <LoansWorkspace />;
  if (section === "statements") return <StatementsWorkspace />;
  if (section === "support") return <SupportWorkspace />;
  if (section === "security") return <SecurityWorkspace />;
  return <AccountsWorkspace />;
}

type VirtualCard = {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  cvv: string;
  limit: number;
  spent: number;
  status: "ACTIVE" | "FROZEN";
  color: "blue" | "navy" | "amber";
};

function VirtualCardsWorkspace() {
  const { customers, accounts } = useBankingData("customer");
  const customer = customers[0];
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [cardRequests,setCardRequests]=useState<Array<{id:string;status:"PENDING"|"APPROVED"|"REJECTED";displayName:string;monthlyLimitMinor:number;fundingAccountId:string;panLast4:string|null;expiryMonth:number|null;expiryYear:number|null;cvv:string|null}>>([]);
  const [selectedId, setSelectedId] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("Travel virtual");
  const [newLimit, setNewLimit] = useState(1500);
  const [notice, setNotice] = useState<Notice>(null);
  const selected = cards.find((card) => card.id === selectedId) ?? cards[0];
  async function loadCards(){const response=await fetch("/api/customer/cards",{cache:"no-store"});const result=await response.json() as {cards?:typeof cardRequests;error?:string};if(!response.ok)throw new Error(result.error??"CARD_READ_FAILED");const requests=result.cards??[];setCardRequests(requests);const approved=requests.filter(item=>item.status==="APPROVED"&&item.panLast4).map((item,index)=>({id:item.id,name:item.displayName,last4:item.panLast4!,expiry:`${String(item.expiryMonth??1).padStart(2,"0")}/${String(item.expiryYear??2030).slice(-2)}`,cvv:item.cvv??"",limit:item.monthlyLimitMinor/100,spent:0,status:"ACTIVE" as const,color:(index%2?"navy":"blue") as VirtualCard["color"]}));setCards(approved);setSelectedId(current=>approved.some(card=>card.id===current)?current:(approved[0]?.id??""));}
  useEffect(()=>{const timer=window.setTimeout(()=>void loadCards().catch(()=>setNotice({tone:"warn",text:"Virtual card requests could not be loaded."})),0);return()=>window.clearTimeout(timer);},[]);

  function updateCard(changes: Partial<VirtualCard>) {
    setCards((items) => items.map((card) => card.id === selected.id ? { ...card, ...changes } : card));
  }

  async function issueCard(event: React.FormEvent) {
    event.preventDefault();
    const response=await fetch("/api/customer/cards",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({fundingAccountId:accounts[0]?.id,displayName:newName,monthlyLimitMinor:Math.round(Math.max(50,newLimit)*100)})});const result=await response.json() as {error?:string};if(!response.ok){setNotice({tone:"warn",text:(result.error??"CARD_REQUEST_FAILED").replaceAll("_"," ")});return;}setShowCreate(false);setRevealed(false);await loadCards();setNotice({text:`${newName} was submitted for admin approval. It will appear after approval.`});
  }

  function copyTrainingValue(value: string, label: string) {
    navigator.clipboard?.writeText(value);
    setNotice({ text: `${label} copied securely.` });
  }

  if (!selected) return <>
    <WorkspaceHeader title="Virtual cards" copy="Issue and control profile-linked cards for secure digital purchases." action="Issue virtual card" onAction={()=>setShowCreate(true)}/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    {showCreate && <section className="section-card inline-workflow"><div className="section-title"><div><h2>Issue a new virtual card</h2><p>Create the first card for this customer profile.</p></div><button className="panel-close" onClick={()=>setShowCreate(false)}>Cancel</button></div><form className="horizontal-form card-issue-form" onSubmit={issueCard}><div className="field"><label>CARD NAME</label><input value={newName} onChange={(event)=>setNewName(event.target.value)} required maxLength={30}/></div><div className="field"><label>MONTHLY SPENDING LIMIT</label><input type="number" min="50" max="25000" step="50" value={newLimit} onChange={(event)=>setNewLimit(Number(event.target.value))}/></div><button className="inline-submit">Issue instantly</button></form></section>}
    {!showCreate && <section className="section-card"><div className="empty-ledger">{cardRequests.some(item=>item.status==="PENDING")?"Your virtual card request is awaiting admin approval.":"No virtual cards have been issued for this customer yet."}</div></section>}
  </>;

  return <>
    <WorkspaceHeader title="Virtual cards" copy="Issue and control profile-linked cards for secure digital purchases." action="Issue virtual card" onAction={()=>setShowCreate(true)}/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    {showCreate && <section className="section-card inline-workflow">
      <div className="section-title"><div><h2>Issue a new virtual card</h2><p>Create a card for online purchases and manage it from your dashboard.</p></div><button className="panel-close" onClick={()=>setShowCreate(false)}>Cancel</button></div>
      <form className="horizontal-form card-issue-form" onSubmit={issueCard}>
        <div className="field"><label>CARD NAME</label><input value={newName} onChange={(event)=>setNewName(event.target.value)} required maxLength={30}/></div>
        <div className="field"><label>MONTHLY SPENDING LIMIT</label><input type="number" min="50" max="25000" step="50" value={newLimit} onChange={(event)=>setNewLimit(Number(event.target.value))}/></div>
        <button className="inline-submit">Issue instantly</button>
      </form>
    </section>}
    <div className="virtual-card-layout">
      <section className="virtual-card-stage">
        <article className={`virtual-card ${selected.color} ${selected.status === "FROZEN" ? "is-frozen" : ""}`}>
          <div className="virtual-card-top"><span>NORTHSTAR</span><span className="virtual-chip"/><CreditCard size={24}/></div>
          <div className="virtual-card-number">
            <span>{revealed ? `4128 9000 0000 ${selected.last4}` : `•••• •••• •••• ${selected.last4}`}</span>
            <button aria-label="Copy card number" onClick={()=>copyTrainingValue(`412890000000${selected.last4}`, "Card number")}><Copy size={14}/></button>
          </div>
          <div className="virtual-card-meta"><div><small>CARDHOLDER</small><b>{customer ? `${customer.firstName} ${customer.lastName}`.toUpperCase() : "CUSTOMER"}</b></div><div><small>EXPIRES</small><b>{selected.expiry}</b></div><div><small>CVV</small><b>{revealed ? selected.cvv : "•••"}</b></div></div>
          {selected.status === "FROZEN" && <div className="frozen-overlay"><Snowflake size={19}/> CARD FROZEN</div>}
        </article>
        <button className="reveal-card-button" onClick={()=>setRevealed((value)=>!value)}>{revealed ? <EyeOff size={15}/> : <Eye size={15}/>} {revealed ? "Hide card details" : "Reveal card details"}</button>
        <div className="simulation-card-notice"><ShieldCheck size={17}/><span><b>Protect your card details</b>Freeze this card immediately if you notice activity you do not recognize.</span></div>
      </section>
      <aside className="section-card card-controls">
        <div className="section-title"><div><h2>Card controls</h2><p>{selected.id}{accounts[0] ? ` · linked to ${accounts[0].type} ${accounts[0].accountNumber.slice(-4)}` : ""}</p></div><span className={`status-pill ${selected.status === "FROZEN" ? "block" : ""}`}>{selected.status}</span></div>
        <div className="card-control-row"><div><b>Freeze card</b><small>Immediately block new card authorizations.</small></div><button className={`switch ${selected.status === "FROZEN" ? "on danger" : ""}`} aria-label="Freeze card" onClick={()=>{const next=selected.status==="ACTIVE"?"FROZEN":"ACTIVE";updateCard({status:next});setNotice({tone:next==="FROZEN"?"warn":"success",text:`${selected.name} is now ${next.toLowerCase()}.`});}}><span/></button></div>
        <div className="field card-limit-field"><label>MONTHLY SPENDING LIMIT</label><div className="limit-input"><span>$</span><input type="number" min="50" max="25000" step="50" value={selected.limit} onChange={(event)=>updateCard({limit:Number(event.target.value)})}/></div></div>
        <div className="card-limit-summary"><div><span>Spent this month</span><strong>${selected.spent.toLocaleString(undefined,{minimumFractionDigits:2})}</strong></div><div><span>Remaining</span><strong>${Math.max(0,selected.limit-selected.spent).toLocaleString(undefined,{minimumFractionDigits:2})}</strong></div></div>
        <div className="card-usage-track"><span style={{width:`${Math.min(100,(selected.spent/selected.limit)*100)}%`}}/></div>
        <button className="full-action" onClick={()=>setNotice({text:`Spending controls saved for ${selected.name}.`})}>Save card controls</button>
      </aside>
    </div>
    <section className="section-card card-directory">
      <div className="section-title"><div><h2>Your virtual cards</h2><p>Select a card to view and manage its controls.</p></div><span className="status-pill">{cards.length} issued</span></div>
      <div className="card-profile-list">{cards.map((card)=><button key={card.id} className={card.id===selected.id?"active":""} onClick={()=>{setSelectedId(card.id);setRevealed(false);}}>
        <span className={`mini-card ${card.color}`}><CreditCard size={16}/></span>
        <span><b>{card.name}</b><small>•••• {card.last4} · {card.id}</small></span>
        <span className={`status-pill ${card.status==="FROZEN"?"block":""}`}>{card.status}</span>
      </button>)}</div>
    </section>
    <section className="section-card" style={{marginTop:14}}><div className="section-title"><div><h2>Recent card activity</h2><p>Authorizations for the selected virtual card.</p></div></div><div className="empty-ledger">No card activity has been recorded yet.</div></section>
  </>;
}

function WorkspaceHeader({ title, copy, action, onAction }: { title: string; copy: string; action?: string; onAction?: () => void }) {
  return <div className="overview-head"><div><h2>{title}</h2><p>{copy}</p></div>{action && <button className="primary-action" onClick={onAction}><Plus size={14}/>{action}</button>}</div>;
}

function NoticeBar({ notice, clear }: { notice: Notice; clear: () => void }) {
  if (!notice) return null;
  return <div className={`operation-notice ${notice.tone === "warn" ? "warning" : ""}`}><CheckCircle2 size={15}/><span>{notice.text}</span><button onClick={clear}>Dismiss</button></div>;
}

function ProfileKycWorkspace() {
  const { customers,kycDocuments,refresh } = useBankingData("customer");
  const customer = customers[0];
  const [fileName, setFileName] = useState("");
  const [selectedFile,setSelectedFile]=useState<File|null>(null);
  const [documentType,setDocumentType]=useState("Government-issued identification");
  const [uploading,setUploading]=useState(false);
  const [verified, setVerified] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  async function uploadKyc(){if(!selectedFile)return;setUploading(true);try{const form=new FormData();form.set("file",selectedFile);form.set("documentType",documentType);const response=await fetch("/api/customer/kyc-documents",{method:"POST",body:form});const result=await response.json() as {error?:string};if(!response.ok)throw new Error(result.error??"KYC_UPLOAD_FAILED");setVerified(true);setFileName("");setSelectedFile(null);await refresh();setNotice({text:"KYC document uploaded securely for operations review."});}catch(error){setNotice({tone:"warn",text:error instanceof Error?error.message.replaceAll("_"," "):"Upload failed"});}finally{setUploading(false);}}
  return <>
    <WorkspaceHeader title="Profile & identity" copy="Maintain your personal information and submit identity documents for account review."/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <div className="two-column-workspace">
      <section className="section-card">
        <div className="section-title"><div><h2>Personal profile</h2><p>Keep your contact and residential information current.</p></div><span className="status-pill">Verified profile</span></div>
        <form className="form-grid" onSubmit={(event)=>{event.preventDefault();setNotice({text:"Profile changes saved successfully."});}}>
          <div className="form-row"><div className="field"><label>LEGAL FIRST NAME</label><input key={`first-${customer?.userId}`} defaultValue={customer?.firstName ?? ""}/></div><div className="field"><label>LEGAL LAST NAME</label><input key={`last-${customer?.userId}`} defaultValue={customer?.lastName ?? ""}/></div></div>
          <div className="field"><label>EMAIL ADDRESS</label><input key={`email-${customer?.userId}`} type="email" defaultValue={customer?.email ?? ""}/></div>
          <div className="form-row"><div className="field"><label>SSN / TAX ID</label><input defaultValue=""/></div><div className="field"><label>PHONE</label><input defaultValue=""/></div></div>
          <div className="field"><label>RESIDENTIAL ADDRESS</label><input defaultValue=""/></div>
          <div className="form-row"><div className="field"><label>CITY</label><input defaultValue=""/></div><div className="field"><label>STATE / ZIP</label><input defaultValue=""/></div></div>
          <button className="inline-submit">Save profile</button>
        </form>
      </section>
      <aside className="section-card">
        <div className="section-title"><div><h2>KYC document upload</h2><p>Upload a JPG, PNG, or PDF for protected operations review.</p></div></div>
        <div className="field"><label>DOCUMENT TYPE</label><select value={documentType} onChange={event=>setDocumentType(event.target.value)}><option>Government-issued identification</option><option>Proof of address</option><option>Tax identification document</option><option>Business registration document</option></select></div>
        <label className="upload-drop">
          <UploadCloud size={25}/><b>{fileName || "Choose KYC document"}</b><span>PNG, JPG, or PDF · maximum 10 MB</span>
          <input type="file" accept="image/png,image/jpeg,application/pdf" onChange={(event)=>{const file=event.target.files?.[0]??null;setSelectedFile(file);setFileName(file?.name??"");}}/>
        </label>
        <div className="verification-checks">
          <p><FileCheck2 size={16}/><span><b>Identity document</b>{fileName ? "Ready for submission" : "Awaiting upload"}</span></p>
          <p><Building2 size={16}/><span><b>Address verification</b>{verified ? "Address verified" : "Not yet checked"}</span></p>
        </div>
        <button className="full-action" disabled={!selectedFile||uploading} onClick={uploadKyc}>{uploading?"Uploading securely…":"Submit KYC document"}</button>
        <div className="customer-kyc-file-list">{kycDocuments.map(document=><div key={document.id}><FileCheck2 size={15}/><span><b>{document.originalFilename}</b><small>{document.documentType} · {new Date(document.uploadedAt).toLocaleDateString()}</small></span><span className={`status-pill ${document.status==="UPLOADED"?"warn":document.status==="REJECTED"?"block":""}`}>{document.status}</span></div>)}</div>
      </aside>
    </div>
  </>;
}

function AccountsWorkspace() {
  const { accounts: persistedAccounts } = useBankingData("customer");
  const [accounts, setAccounts] = useState<Array<{
    type:string; number:string; balance:string; rate:string; overdraft:boolean;
  }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [newType, setNewType] = useState("Business Checking");
  const [notice, setNotice] = useState<Notice>(null);
  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>setAccounts(persistedAccounts.map((account)=>({
      type: account.type === "CHECKING" ? "Everyday Checking" : account.type === "SAVINGS" ? "Growth Savings" : account.type,
      number: account.accountNumber.slice(-4),
      balance: formatMoney(account.balanceMinor),
      rate: account.type === "SAVINGS" ? "3.20% APY" : "0.00% APY",
      overdraft: false,
    }))));
    return()=>window.cancelAnimationFrame(frame);
  },[persistedAccounts]);
  function openAccount(event: React.FormEvent) {
    event.preventDefault();
    setAccounts((items)=>[...items,{type:newType,number:String(3000+items.length*137),balance:"$0.00",rate:newType.includes("CD")?"4.10% APY":"0.00% APY",overdraft:false}]);
    setShowForm(false); setNotice({text:`${newType} opened with a zero balance.`});
  }
  return <>
    <WorkspaceHeader title="Accounts & preferences" copy="Open and configure separate checking, savings, business, and certificate accounts." action="Open account" onAction={()=>setShowForm(!showForm)}/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    {showForm && <section className="section-card inline-workflow"><div className="section-title"><div><h2>Open another account</h2><p>New accounts start with a zero balance.</p></div></div><form className="horizontal-form" onSubmit={openAccount}><div className="field"><label>ACCOUNT PRODUCT</label><select value={newType} onChange={(event)=>setNewType(event.target.value)}><option>Personal Checking</option><option>Growth Savings</option><option>Business Checking</option><option>12-Month CD</option></select></div><div className="field"><label>ACCOUNT NICKNAME</label><input placeholder="Optional nickname"/></div><button className="inline-submit">Open account</button></form></section>}
    <div className="account-management-grid">
      {accounts.map((account,index)=><article className="managed-account" key={`${account.number}-${index}`}>
        <div className="managed-account-top"><span><WalletCards size={18}/></span><div><b>{account.type}</b><small>USD · •••• {account.number}</small></div><span className="status-pill">Active</span></div>
        <strong>{account.balance}</strong><p>Available balance · {account.rate}</p>
        <div className="account-settings"><div><b>Overdraft protection</b><small>{account.overdraft ? "Transactions may use the configured buffer." : "Transactions fail at zero available balance."}</small></div><button className={`switch ${account.overdraft ? "on" : ""}`} aria-label={`Toggle overdraft for ${account.type}`} onClick={()=>setAccounts(items=>items.map((item,i)=>i===index?{...item,overdraft:!item.overdraft}:item))}><span/></button></div>
      </article>)}
      {!accounts.length&&<div className="empty-ledger">No accounts have been opened for this customer yet.</div>}
    </div>
  </>;
}

type CustomerDepositMethod = {
  id:string;
  methodType:"BANK_TRANSFER"|"CRYPTO";
  label:string;
  bankName:string|null;
  accountName:string|null;
  accountNumber:string|null;
  routingNumber:string|null;
  swiftBic:string|null;
  cryptoAsset:string|null;
  cryptoNetwork:string|null;
  walletAddress:string|null;
  instructions:string;
};

type CustomerDepositRequest = {
  id:string;
  reference:string;
  accountNumber:string;
  methodLabel:string;
  methodType:"BANK_TRANSFER"|"CRYPTO";
  amountMinor:number;
  senderReference:string;
  status:"PENDING"|"COMPLETED"|"REJECTED";
  requestedAt:string;
};

function DepositsWorkspace() {
  const {accounts,refresh}=useBankingData("customer");
  const customerAccounts=accounts;
  const [methods,setMethods]=useState<CustomerDepositMethod[]>([]);
  const [requests,setRequests]=useState<CustomerDepositRequest[]>([]);
  const [selectedMethodId,setSelectedMethodId]=useState("");
  const [notice,setNotice]=useState<Notice>(null);
  const [loading,setLoading]=useState(true);
  const [submitting,setSubmitting]=useState(false);
  const selectedMethod=methods.find((method)=>method.id===selectedMethodId)??methods[0];

  async function load() {
    setLoading(true);
    try {
      const response=await fetch("/api/customer/deposits",{cache:"no-store"});
      const result=await response.json() as {methods?:CustomerDepositMethod[];requests?:CustomerDepositRequest[];error?:string};
      if(!response.ok)throw new Error(result.error??"DEPOSIT_READ_FAILED");
      setMethods(result.methods??[]);
      setRequests(result.requests??[]);
      setSelectedMethodId((current)=>current||(result.methods?.[0]?.id??""));
    } catch(error) {
      setNotice({tone:"warn",text:(error instanceof Error?error.message:"DEPOSIT_READ_FAILED").replaceAll("_"," ")});
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{const timer=window.setTimeout(()=>void load(),0);return()=>window.clearTimeout(timer);},[]);

  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);
    const form=event.currentTarget;
    const values=new FormData(form);
    try {
      const response=await fetch("/api/customer/deposits",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          accountId:String(values.get("accountId")??""),
          methodId:selectedMethodId,
          amountMinor:Math.round(Number(values.get("amount"))*100),
          senderReference:String(values.get("senderReference")??""),
        }),
      });
      const result=await response.json() as {reference?:string;error?:string};
      if(!response.ok)throw new Error(result.error??"DEPOSIT_REQUEST_FAILED");
      setNotice({text:`${result.reference} was submitted for operations review. An email confirmation was sent.`});
      form.reset();
      await Promise.all([load(),refresh()]);
    } catch(error) {
      setNotice({tone:"warn",text:(error instanceof Error?error.message:"DEPOSIT_REQUEST_FAILED").replaceAll("_"," ")});
    } finally {
      setSubmitting(false);
    }
  }

  return <>
    <WorkspaceHeader title="Deposit funds" copy="Use the bank-transfer or digital-asset instructions configured for your account."/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <div className="deposit-method-layout">
      <section className="section-card">
        <div className="section-title"><div><h2>Deposit instructions</h2><p>Choose a funding method and follow the account details shown below.</p></div><span className="status-pill">{methods.length} available</span></div>
        {loading?<div className="live-chat-loading"><LoaderCircle size={20}/>Loading deposit methods…</div>:<>
          <div className="deposit-method-tabs">{methods.map((method)=><button type="button" key={method.id} className={selectedMethod?.id===method.id?"active":""} onClick={()=>setSelectedMethodId(method.id)}>{method.methodType==="BANK_TRANSFER"?<Building2 size={16}/>:<Coins size={16}/>}<span><b>{method.label}</b><small>{method.methodType==="BANK_TRANSFER"?"Bank transfer":"Crypto deposit"}</small></span></button>)}</div>
          {selectedMethod&&<article className="deposit-instruction-card">
            <div className="deposit-instruction-head"><span>{selectedMethod.methodType==="BANK_TRANSFER"?<Building2 size={21}/>:<Coins size={21}/>}</span><div><small>{selectedMethod.methodType==="BANK_TRANSFER"?"BANK TRANSFER DETAILS":"DIGITAL-ASSET DETAILS"}</small><h3>{selectedMethod.label}</h3></div></div>
            <dl>
              {selectedMethod.methodType==="BANK_TRANSFER"?<>
                <div><dt>Bank</dt><dd>{selectedMethod.bankName}</dd></div>
                <div><dt>Account name</dt><dd>{selectedMethod.accountName}</dd></div>
                <div><dt>Account number</dt><dd>{selectedMethod.accountNumber}</dd></div>
                <div><dt>Routing number</dt><dd>{selectedMethod.routingNumber}</dd></div>
                {selectedMethod.swiftBic&&<div><dt>SWIFT / BIC</dt><dd>{selectedMethod.swiftBic}</dd></div>}
              </>:<>
                <div><dt>Asset</dt><dd>{selectedMethod.cryptoAsset}</dd></div>
                <div><dt>Network</dt><dd>{selectedMethod.cryptoNetwork}</dd></div>
                <div className="wide"><dt>Wallet identifier</dt><dd>{selectedMethod.walletAddress}</dd></div>
              </>}
            </dl>
            <p><ShieldCheck size={15}/><span><b>Admin-configured instructions</b>{selectedMethod.instructions}</span></p>
            <button type="button" className="secondary-action" onClick={()=>navigator.clipboard?.writeText(selectedMethod.methodType==="BANK_TRANSFER"?`${selectedMethod.bankName}\n${selectedMethod.accountName}\n${selectedMethod.accountNumber}\n${selectedMethod.routingNumber}`:selectedMethod.walletAddress??"")}><Copy size={14}/>Copy instructions</button>
          </article>}
          {!methods.length&&<div className="empty-ledger">Operations has not configured a customer deposit method yet.</div>}
        </>}
      </section>
      <aside className="section-card">
        <div className="section-title"><div><h2>Confirm your deposit</h2><p>Submit the sender reference or transaction hash for review.</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          <div className="field"><label>DEPOSIT TO</label><select name="accountId" required>{customerAccounts.map((account)=><option value={account.id} key={account.id}>{account.type} · {account.accountNumber.slice(-4)}</option>)}</select></div>
          <div className="field"><label>AMOUNT (USD)</label><input name="amount" type="number" min="1" step="0.01" required placeholder="500.00"/></div>
          <div className="field"><label>{selectedMethod?.methodType==="CRYPTO"?"TRANSACTION HASH":"SENDER / BANK REFERENCE"}</label><input name="senderReference" required placeholder={selectedMethod?.methodType==="CRYPTO"?"Transaction hash":"PAY-REFERENCE-..."}/></div>
          <button className="inline-submit" disabled={submitting||!selectedMethod}>{submitting?"Submitting…":"Submit deposit for review"}</button>
        </form>
      </aside>
    </div>
    <section className="section-card" style={{marginTop:14}}>
      <div className="section-title"><div><h2>Deposit activity</h2><p>Approved deposits are credited to the selected account and appear in statement history.</p></div></div>
      <table className="activity-table"><thead><tr><th>Deposit</th><th>Method</th><th>Status</th><th className="money">Amount</th></tr></thead><tbody>{requests.map((request)=><tr key={request.id}><td><div className="transaction-name"><span className="transaction-icon"><CircleDollarSign size={13}/></span><div><b>{request.reference}</b><small>{new Date(request.requestedAt).toLocaleString()} · •••• {request.accountNumber.slice(-4)}</small></div></div></td><td>{request.methodLabel}<br/><small>{request.senderReference}</small></td><td><span className={`status-pill ${request.status==="PENDING"?"warn":request.status==="REJECTED"?"block":""}`}>{request.status}</span></td><td className="money">{formatMoney(request.amountMinor)}</td></tr>)}</tbody></table>
      {!requests.length&&<div className="empty-ledger">No deposit requests yet.</div>}
    </section>
  </>;
}

function TransfersWorkspace() {
  const { accounts, transactions, transferRequests, scheduledTransfers, transfer, complianceAction } = useBankingData("customer");
  const customerAccounts = accounts;
  const [mode, setMode] = useState<"internal"|"p2p"|"external">("internal");
  const [sourceAccountId,setSourceAccountId] = useState("acct-checking-1842");
  const [destinationAccountId,setDestinationAccountId] = useState("acct-savings-9081");
  const [amount, setAmount] = useState("2500.00");
  const [externalRail,setExternalRail] = useState<BankingTransferRequest["rail"]>("ACH");
  const [executionMode,setExecutionMode]=useState<"IMMEDIATE"|"SCHEDULED">("IMMEDIATE");
  const [scheduledFor,setScheduledFor]=useState(()=>{const date=new Date(Date.now()+24*60*60*1000);const local=new Date(date.getTime()-date.getTimezoneOffset()*60_000);return local.toISOString().slice(0,16);});
  const [minimumTransferTime]=useState(()=>{const now=new Date();return new Date(now.getTime()-now.getTimezoneOffset()*60_000).toISOString().slice(0,16);});
  const [submitting,setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [complianceCode,setComplianceCode] = useState("");
  const [holdNotice,setHoldNotice] = useState("");
  const [holdSubmitting,setHoldSubmitting] = useState(false);
  const [selectedRequest,setSelectedRequest] = useState<BankingTransferRequest | null>(null);
  const [internalConfirmation,setInternalConfirmation] = useState<{
    phase: "review" | "processing" | "success" | "error";
    mode: "internal" | "p2p";
    payload: Parameters<typeof transfer>[0];
    sourceLabel: string;
    destinationLabel: string;
    reference?: string;
    finalStatus?: "SCHEDULED"|"COMPLETED";
    error?: string;
  } | null>(null);
  const [confirmation,setConfirmation] = useState<{
    phase: "review" | "processing" | "hold" | "verifying" | "success" | "error";
    payload: Parameters<typeof transfer>[0];
    reference?: string;
    requestId?: string;
    requestedAt?: string;
    finalStatus?: BankingTransferRequest["status"];
    customerMessage?: string | null;
    error?: string;
  } | null>(null);
  useEffect(() => {
    if (!customerAccounts.length) return;
    const frame=window.requestAnimationFrame(()=>{
      if (!customerAccounts.some((account)=>account.id===sourceAccountId)) setSourceAccountId(customerAccounts[0].id);
      if (!customerAccounts.some((account)=>account.id===destinationAccountId)) setDestinationAccountId(customerAccounts.find((account)=>account.id!==customerAccounts[0].id)?.id ?? "");
    });
    return()=>window.cancelAnimationFrame(frame);
  }, [customerAccounts, sourceAccountId, destinationAccountId]);
  useEffect(()=>{
    if (!selectedRequest) return;
    const current=transferRequests.find((request)=>request.id===selectedRequest.id);
    if (current&&(current.status!==selectedRequest.status||current.holdState!==selectedRequest.holdState)) {
      const frame=window.requestAnimationFrame(()=>setSelectedRequest(current));
      return()=>window.cancelAnimationFrame(frame);
    }
  },[selectedRequest,transferRequests]);
  const scheduledTransactionReferences=new Set(scheduledTransfers.map((item)=>item.transactionReference).filter(Boolean));
  const persistentHistory = transactions
    .filter((transaction)=>transaction.direction==="DEBIT" && transaction.reference.startsWith("TRF-")
      && !Array.from(scheduledTransactionReferences).some((reference)=>transaction.reference.startsWith(reference!))
      && customerAccounts.some((account)=>account.id===transaction.accountId))
    .map((transaction)=>({
      id: transaction.id,
      name: transaction.description,
      rail: "Internal",
      status: transaction.status==="POSTED"?"Completed":"Reversed",
      value: formatMoney(transaction.amountMinor),
      createdAt: transaction.effectiveAt,
      request: null as BankingTransferRequest | null,
    }));
  const externalHistory = transferRequests
    .filter((request)=>customerAccounts.some((account)=>account.id===request.sourceAccountId))
    .map((request)=>({
      id: request.id,
      name: request.recipientName,
      rail: request.rail==="ACH"?"External ACH":request.rail==="DOMESTIC_WIRE"?"Domestic wire":"International wire",
      status: transferRequestStatusLabel(request.status),
      value: formatMoney(request.amountMinor),
      createdAt: request.requestedAt,
      request,
    }));
  const scheduledHistory = scheduledTransfers.map((item)=>({
    id:item.id,
    name:item.description,
    rail:item.transferKind==="INTERNAL"?"Between accounts":"Peer-to-peer",
    status:item.status==="SCHEDULED"?`Scheduled · ${new Date(item.scheduledFor).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}`:item.status.charAt(0)+item.status.slice(1).toLowerCase(),
    value:formatMoney(item.amountMinor),
    createdAt:item.createdAt,
    request:null as BankingTransferRequest|null,
  }));
  const history = [...persistentHistory,...externalHistory,...scheduledHistory]
    .sort((left,right)=>new Date(right.createdAt).getTime()-new Date(left.createdAt).getTime())
    .slice(0,10);

  async function confirmExternalTransfer() {
    if (!confirmation) return;
    setConfirmation({...confirmation,phase:"processing"});
    setSubmitting(true);
    const outcome = await transfer(confirmation.payload)
      .then((result)=>({result,error:null}))
      .catch((error:unknown)=>({result:null,error}));
    await new Promise((resolve)=>setTimeout(resolve,5000));
    if (outcome.result) {
      setConfirmation({
        ...confirmation,
        phase:outcome.result.complianceRequired?"hold":"success",
        reference:outcome.result.reference,
        requestId:outcome.result.id,
        requestedAt:outcome.result.requestedAt,
        finalStatus:outcome.result.complianceRequired?"PROCESSING":"PENDING",
        customerMessage:outcome.result.customerMessage,
      });
    } else {
      const error = outcome.error;
      setConfirmation({
        ...confirmation,
        phase:"error",
        error:(error instanceof Error?error.message:"TRANSFER_FAILED")
          .replaceAll("_"," ").toLowerCase().replace(/^./,(letter)=>letter.toUpperCase()),
      });
    }
    setSubmitting(false);
  }

  async function requestComplianceCode() {
    if (!confirmation?.requestId) return;
    setHoldSubmitting(true);
    setHoldNotice("");
    try {
      await complianceAction({action:"REQUEST_COMPLIANCE_CODE",requestId:confirmation.requestId});
      setComplianceCode("");
      setConfirmation(null);
      setNotice({text:"Compliance code requested. The transfer remains on hold; open it from Recent transfers whenever you are ready to enter the code."});
    } catch (error) {
      setHoldNotice(error instanceof Error?error.message.replaceAll("_"," "):"Unable to request code");
    } finally {
      setHoldSubmitting(false);
    }
  }

  async function releaseComplianceHold() {
    if (!confirmation?.requestId) return;
    if (!complianceCode.trim()) {
      setHoldNotice("Enter the compliance code supplied by operations.");
      return;
    }
    setHoldSubmitting(true);
    setHoldNotice("");
    setConfirmation({...confirmation,phase:"verifying"});
    const outcome = await complianceAction({
        action:"SUBMIT_COMPLIANCE_CODE",
        requestId:confirmation.requestId,
        complianceCode,
      })
      .then((result)=>({result,error:null}))
      .catch((error:unknown)=>({result:null,error}));
    await new Promise((resolve)=>setTimeout(resolve,5000));
    if (outcome.result) {
      const result = outcome.result;
      setConfirmation({...confirmation,phase:"success",reference:result.reference??confirmation.reference,finalStatus:"COMPLETED"});
      setComplianceCode("");
    } else {
      const error = outcome.error;
      setConfirmation({...confirmation,phase:"hold"});
      setHoldNotice(error instanceof Error?error.message.replaceAll("_"," "):"Compliance verification failed");
    }
    setHoldSubmitting(false);
  }

  async function confirmInternalTransfer() {
    if (!internalConfirmation) return;
    setInternalConfirmation({...internalConfirmation,phase:"processing"});
    setSubmitting(true);
    try {
      const result = await transfer(internalConfirmation.payload);
      setInternalConfirmation({...internalConfirmation,phase:"success",reference:result.reference,finalStatus:result.status==="SCHEDULED"?"SCHEDULED":"COMPLETED"});
    } catch (error) {
      setInternalConfirmation({
        ...internalConfirmation,
        phase:"error",
        error:(error instanceof Error?error.message:"TRANSFER_FAILED")
          .replaceAll("_"," ").toLowerCase().replace(/^./,(letter)=>letter.toUpperCase()),
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amountMinor = Math.round(Number(amount) * 100);
    if (!Number.isInteger(amountMinor) || amountMinor <= 0) {
      setNotice({tone:"warn",text:"Enter a valid transfer amount greater than zero."});
      return;
    }
    if (mode==="external") {
      setConfirmation({phase:"review",payload:{
        sourceAccountId,
        amountMinor,
        description: String(form.get("memo") || "External transfer request"),
        effectiveAt: new Date().toISOString(),
        rail: externalRail,
        recipientName: String(form.get("recipientName") || ""),
        bankName: String(form.get("bankName") || ""),
        routingNumber: String(form.get("routingNumber") || ""),
        accountNumber: String(form.get("accountNumber") || ""),
        swiftBic: String(form.get("swiftBic") || ""),
        recipientAddressLine1: String(form.get("recipientAddressLine1") || ""),
        recipientAddressLine2: String(form.get("recipientAddressLine2") || ""),
        recipientCity: String(form.get("recipientCity") || ""),
        recipientStateRegion: String(form.get("recipientStateRegion") || ""),
        recipientPostalCode: String(form.get("recipientPostalCode") || ""),
        recipientCountryCode: String(form.get("recipientCountryCode") || ""),
        bankAddress: String(form.get("bankAddress") || ""),
        scheduledFor: executionMode==="SCHEDULED"?new Date(scheduledFor).toISOString():new Date().toISOString(),
        idempotencyKey:crypto.randomUUID(),
      }});
      return;
    }
    const targetAccountId = mode==="p2p" ? "acct-checking-3321" : destinationAccountId;
    const source = customerAccounts.find((account)=>account.id===sourceAccountId);
    const destination = accounts.find((account)=>account.id===targetAccountId);
    const recipientLookup = String(form.get("recipientLookup") || "Maya Chen").trim();
    setInternalConfirmation({
      phase:"review",
      mode,
      payload:{
        sourceAccountId,
        destinationAccountId: targetAccountId,
        amountMinor,
        description: String(form.get("memo") || (mode==="internal"?"Transfer between my accounts":"P2P transfer to Maya Chen")),
        effectiveAt: new Date().toISOString(),
        scheduledFor: executionMode==="SCHEDULED"?new Date(scheduledFor).toISOString():undefined,
        idempotencyKey:crypto.randomUUID(),
      },
      sourceLabel:`${source?.type ?? "Account"} · ${source?.accountNumber.slice(-4) ?? ""}`,
      destinationLabel:mode==="internal"
        ? `${destination?.type ?? "Account"} · ${destination?.accountNumber.slice(-4) ?? ""}`
        : `${destination?.customerName ?? "Maya Chen"} · ${recipientLookup}`,
    });
  }

  return <>
    <WorkspaceHeader title="Move money" copy="Transfer internally, send P2P funds, or simulate an external ACH or wire."/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <div className="segmented-tabs">{(["internal","p2p","external"] as const).map(item=><button type="button" className={mode===item?"active":""} onClick={()=>setMode(item)} key={item}>{item==="internal"?"Between my accounts":item==="p2p"?"Send to customer":"External ACH / wire"}</button>)}</div>
    <div className="transfer-layout">
      <section className="section-card">
        <div className="section-title"><div><h2>{mode==="internal"?"Internal transfer":mode==="p2p"?"Peer-to-peer transfer":"External transfer request"}</h2><p>{mode==="external"?"ACH and wire instructions remain pending until operations review and settlement.":"Eligible transfers post immediately to your accounts."}</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          <div className="field"><label>FROM ACCOUNT</label><select value={sourceAccountId} onChange={(event)=>{const next=event.target.value;setSourceAccountId(next);if(next===destinationAccountId){setDestinationAccountId(customerAccounts.find((account)=>account.id!==next)?.id ?? "");}}}>{customerAccounts.map((account)=><option key={account.id} value={account.id}>{account.type} · {account.accountNumber.slice(-4)} — {formatMoney(account.balanceMinor)}</option>)}</select></div>
          {mode==="internal" && <div className="field"><label>TO MY ACCOUNT</label><select value={destinationAccountId} onChange={(event)=>setDestinationAccountId(event.target.value)}>{customerAccounts.filter((account)=>account.id!==sourceAccountId).map((account)=><option key={account.id} value={account.id}>{account.type} · {account.accountNumber.slice(-4)} — {formatMoney(account.balanceMinor)}</option>)}</select></div>}
          {mode==="p2p" && <><div className="field"><label>FIND CUSTOMER BY</label><select><option>Email address</option><option>Username</option><option>Account number</option></select></div><div className="field"><label>RECIPIENT</label><input name="recipientLookup" defaultValue="maya@example.test" placeholder="Email, username, or account number" required/></div></>}
          {mode==="external" && <>
            <div className="external-form-heading"><Building2 size={16}/><div><b>Recipient &amp; bank</b><span>Enter the beneficiary&apos;s payment instructions.</span></div></div>
            <div className="form-row"><div className="field"><label>TRANSFER RAIL</label><select value={externalRail} onChange={(event)=>setExternalRail(event.target.value as BankingTransferRequest["rail"])}><option value="ACH">ACH</option><option value="DOMESTIC_WIRE">Domestic wire</option><option value="INTERNATIONAL_WIRE">International wire</option></select></div><div className="field"><label>RECIPIENT NAME</label><input name="recipientName" defaultValue="Northstar Supply LLC" required/></div></div>
            <div className="form-row"><div className="field"><label>BANK NAME</label><input name="bankName" defaultValue="Northstar Correspondent Bank" required/></div><div className="field"><label>BANK ADDRESS</label><input name="bankAddress" defaultValue="100 Market Plaza, New York, NY 10005" required/></div></div>
            <div className="form-row"><div className="field"><label>ROUTING NUMBER</label><input name="routingNumber" defaultValue="021000021" required/></div><div className="field"><label>ACCOUNT NUMBER</label><input name="accountNumber" defaultValue="0007712048" required/></div></div>
            {externalRail==="INTERNATIONAL_WIRE"&&<div className="field"><label>SWIFT / BIC</label><input name="swiftBic" defaultValue="NSSBUS33" required/></div>}
            <div className="external-form-heading"><MapPin size={16}/><div><b>Recipient address</b><span>Included with the payment instruction.</span></div></div>
            <div className="field"><label>STREET ADDRESS</label><input name="recipientAddressLine1" defaultValue="240 Market Street" required/></div>
            <div className="field"><label>ADDRESS LINE 2</label><input name="recipientAddressLine2" placeholder="Suite, floor, or unit (optional)"/></div>
            <div className="form-row"><div className="field"><label>CITY</label><input name="recipientCity" defaultValue="New York" required/></div><div className="field"><label>STATE / REGION</label><input name="recipientStateRegion" defaultValue="NY" required/></div></div>
            <div className="form-row"><div className="field"><label>POSTAL CODE</label><input name="recipientPostalCode" defaultValue="10005" required/></div><div className="field"><label>COUNTRY CODE</label><input name="recipientCountryCode" defaultValue="US" maxLength={2} required/></div></div>
          </>}
          <div className="form-row"><div className="field"><label>AMOUNT (USD)</label><input type="number" min="0.01" step="0.01" value={amount} onChange={(event)=>setAmount(event.target.value)} required/></div><div className="field"><label>EXECUTION</label><select value={executionMode} onChange={event=>setExecutionMode(event.target.value as typeof executionMode)}><option value="IMMEDIATE">{mode==="external"?"Submit immediately":"Send immediately"}</option><option value="SCHEDULED">Schedule for later</option></select></div></div>
          {executionMode==="SCHEDULED"&&<div className="field"><label>SCHEDULED DATE AND TIME</label><input type="datetime-local" value={scheduledFor} min={minimumTransferTime} onChange={event=>setScheduledFor(event.target.value)} required/><small>{mode==="external"?"The request remains scheduled until its selected processing date.":"Balances will not change until the scheduled execution time."}</small></div>}
          <div className="field"><label>MEMO</label><input name="memo" placeholder="Optional statement memo"/></div>
          <button className="inline-submit" disabled={submitting}>{submitting?"Posting transfer…":mode==="external"?"Review external transfer":"Review transfer"}</button>
        </form>
      </section>
      <aside className="panel compact-history"><div className="panel-head"><h3>Recent transfers</h3></div>{history.map((item)=><button type="button" className={`history-row ${item.request?"clickable":""}`} key={item.id} onClick={()=>item.request&&setSelectedRequest(item.request)}><span><ArrowRightLeft size={14}/></span><div><b>{item.name}</b><small>{item.rail} · {item.status}</small></div><strong>{item.value}</strong></button>)}{history.length===0&&<div className="empty-ledger">No transfer activity yet.</div>}</aside>
    </div>
    {internalConfirmation&&<div className="transfer-modal-backdrop" role="presentation">
      <section className={`transfer-confirmation internal-transfer-confirmation ${internalConfirmation.phase}`} role="dialog" aria-modal="true" aria-labelledby="internal-transfer-confirmation-title">
        {internalConfirmation.phase==="review"&&<>
          <button className="modal-close" type="button" aria-label="Close transfer review" onClick={()=>setInternalConfirmation(null)}><X size={18}/></button>
          <div className="confirmation-icon"><ArrowRightLeft size={25}/></div>
          <span className="confirmation-eyebrow">Review before sending</span>
          <h2 id="internal-transfer-confirmation-title">{internalConfirmation.mode==="internal"?"Confirm transfer between accounts":"Confirm customer transfer"}</h2>
          <p>Check the destination and amount carefully. {internalConfirmation.payload.scheduledFor?"The instruction will remain scheduled until the selected date and time.":"Funds post immediately after confirmation."}</p>
          <div className="confirmation-summary internal-confirmation-summary">
            <div><span>From</span><b>{internalConfirmation.sourceLabel}</b></div>
            <div><span>{internalConfirmation.mode==="internal"?"To my account":"Recipient"}</span><b>{internalConfirmation.destinationLabel}</b></div>
            <div><span>Amount</span><b>{formatMoney(internalConfirmation.payload.amountMinor)}</b></div>
            <div><span>Execution</span><b>{new Date(internalConfirmation.payload.scheduledFor??internalConfirmation.payload.effectiveAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</b></div>
            <div className="wide"><span>Statement memo</span><b>{internalConfirmation.payload.description}</b></div>
          </div>
          <div className="internal-confirmation-note"><ShieldCheck size={15}/><span>{internalConfirmation.payload.scheduledFor?"No balance changes occur until the scheduled transfer is executed.":internalConfirmation.mode==="internal"?"Both of your account balances will update together.":"The recipient customer account will be credited immediately."}</span></div>
          <div className="confirmation-actions"><button type="button" className="secondary-action" onClick={()=>setInternalConfirmation(null)}>Go back</button><button type="button" className="inline-submit" onClick={confirmInternalTransfer}>{internalConfirmation.payload.scheduledFor?"Confirm & schedule":"Confirm & send"}</button></div>
        </>}
        {internalConfirmation.phase==="processing"&&<div className="processing-state">
          <LoaderCircle className="processing-spinner" size={42}/>
          <span className="confirmation-eyebrow">Secure transfer</span>
          <h2 id="internal-transfer-confirmation-title">{internalConfirmation.payload.scheduledFor?"Scheduling your transfer":"Posting your transfer"}</h2>
          <p>{internalConfirmation.payload.scheduledFor?"Validating the instruction and saving its future execution time.":"Validating available funds and updating both accounts."}</p>
          <div className="processing-track"><span/></div>
        </div>}
        {internalConfirmation.phase==="success"&&<>
          <div className="confirmation-icon success"><CheckCircle2 size={27}/></div>
          <span className="confirmation-eyebrow">{internalConfirmation.finalStatus==="SCHEDULED"?"Transfer scheduled":"Transfer completed"}</span>
          <h2 id="internal-transfer-confirmation-title">{internalConfirmation.finalStatus==="SCHEDULED"?"Your instruction is saved":"Your funds have been sent"}</h2>
          <p>{internalConfirmation.finalStatus==="SCHEDULED"?`The transfer is scheduled for ${new Date(internalConfirmation.payload.scheduledFor!).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}. Balances remain unchanged until then.`:internalConfirmation.mode==="internal"?"Both of your account balances and transaction histories are now updated.":"The customer account was credited and the transfer is now in your recent activity."}</p>
          <div className="confirmation-summary internal-confirmation-summary">
            <div><span>Reference</span><b>{internalConfirmation.reference}</b></div>
            <div><span>Amount</span><b>{formatMoney(internalConfirmation.payload.amountMinor)}</b></div>
            <div className="wide"><span>Destination</span><b>{internalConfirmation.destinationLabel}</b></div>
          </div>
          <button type="button" className="inline-submit full" onClick={()=>{setInternalConfirmation(null);setNotice({text:internalConfirmation.finalStatus==="SCHEDULED"?`${internalConfirmation.reference} is scheduled.`:`${internalConfirmation.reference} completed successfully.`});}}>Done</button>
        </>}
        {internalConfirmation.phase==="error"&&<>
          <div className="confirmation-icon error"><X size={27}/></div>
          <span className="confirmation-eyebrow">Transfer not completed</span>
          <h2 id="internal-transfer-confirmation-title">Review your transfer</h2>
          <p>{internalConfirmation.error}</p>
          <button type="button" className="inline-submit full" onClick={()=>setInternalConfirmation({...internalConfirmation,phase:"review"})}>Return to review</button>
        </>}
      </section>
    </div>}
    {confirmation&&<div className="transfer-modal-backdrop" role="presentation">
      <section className={`transfer-confirmation ${confirmation.phase}`} role="dialog" aria-modal="true" aria-labelledby="transfer-confirmation-title">
        {confirmation.phase==="review"&&<>
          <button className="modal-close" type="button" aria-label="Close transfer review" onClick={()=>setConfirmation(null)}><X size={18}/></button>
          <div className="confirmation-icon"><ArrowRightLeft size={25}/></div>
          <span className="confirmation-eyebrow">Review before sending</span>
          <h2 id="transfer-confirmation-title">Confirm external transfer</h2>
          <p>Check the payment instructions carefully. Confirming creates a pending transfer request for operations review.</p>
          <div className="confirmation-summary">
            <div><span>Recipient</span><b>{confirmation.payload.recipientName}</b></div>
            <div><span>Rail</span><b>{confirmation.payload.rail==="ACH"?"ACH":confirmation.payload.rail==="DOMESTIC_WIRE"?"Domestic wire":"International wire"}</b></div>
            <div><span>Amount</span><b>{formatMoney(confirmation.payload.amountMinor)}</b></div>
            <div><span>Account</span><b>•••• {confirmation.payload.accountNumber?.slice(-4)}</b></div>
            <div className="wide"><span>Recipient address</span><b>{confirmation.payload.recipientAddressLine1}, {confirmation.payload.recipientCity}, {confirmation.payload.recipientStateRegion} {confirmation.payload.recipientPostalCode}</b></div>
          </div>
          <div className="confirmation-actions"><button type="button" className="secondary-action" onClick={()=>setConfirmation(null)}>Go back</button><button type="button" className="inline-submit" onClick={confirmExternalTransfer}>Confirm & submit</button></div>
        </>}
        {confirmation.phase==="processing"&&<div className="processing-state">
          <LoaderCircle className="processing-spinner" size={42}/>
          <span className="confirmation-eyebrow">Secure transfer request</span>
          <h2 id="transfer-confirmation-title">Processing your instruction</h2>
          <p>Validating recipient details and creating the pending ACH or wire record. This secure check takes five seconds.</p>
          <div className="processing-track"><span/></div>
        </div>}
        {confirmation.phase==="verifying"&&<div className="processing-state">
          <LoaderCircle className="processing-spinner" size={42}/>
          <span className="confirmation-eyebrow">Compliance release</span>
          <h2 id="transfer-confirmation-title">Verifying compliance code</h2>
          <p>Releasing the hold and posting the transfer to clearing. This secure check takes five seconds.</p>
          <div className="processing-track"><span/></div>
        </div>}
        {confirmation.phase==="hold"&&<div className="compliance-hold-screen">
          <div className="hold-shield"><ShieldCheck size={29}/></div>
          <span className="confirmation-eyebrow">Soft compliance hold</span>
          <h2 id="transfer-confirmation-title">A compliance code is required</h2>
          <p>{confirmation.customerMessage || "Operations requires a compliance release code before this transfer can be completed."}</p>
          <div className="hold-transfer-summary"><span>Transfer</span><b>{confirmation.reference}</b><strong>{formatMoney(confirmation.payload.amountMinor)}</strong><small>{confirmation.payload.rail==="ACH"?"External ACH":confirmation.payload.rail==="DOMESTIC_WIRE"?"Domestic wire":"International wire"} · On hold</small></div>
          <div className="field compliance-code-field"><label>COMPLIANCE RELEASE CODE</label><input value={complianceCode} onChange={(event)=>setComplianceCode(event.target.value.toUpperCase())} placeholder="CMP-XXXX-XXXXXX" autoComplete="off"/></div>
          {holdNotice&&<div className="hold-notice">{holdNotice}</div>}
          <button type="button" className="inline-submit full" disabled={holdSubmitting} onClick={releaseComplianceHold}>{holdSubmitting?"Checking code…":"Verify code & complete transfer"}</button>
          <button type="button" className="request-code-button" disabled={holdSubmitting} onClick={requestComplianceCode}>I don’t have a code · Request from operations</button>
          <div className="hold-footnote"><LockKeyhole size={14}/><span>This is a compliance release code, not a one-time password. Never share your banking password.</span></div>
        </div>}
        {confirmation.phase==="success"&&<>
          <div className="receipt-screen-head no-print"><div className="confirmation-icon success"><CheckCircle2 size={27}/></div><div><span className="confirmation-eyebrow">{confirmation.finalStatus==="COMPLETED"?"Transfer completed":"Request received"}</span><h2 id="transfer-confirmation-title">{confirmation.finalStatus==="COMPLETED"?"External transfer completed":"External transfer is pending"}</h2><p>{confirmation.finalStatus==="COMPLETED"?"The compliance hold was released and the transfer posted to clearing.":"Your instruction is saved in Recent activity and awaits settlement."}</p></div></div>
          <ExternalTransferReceipt data={{
            reference:confirmation.reference ?? "Pending reference",
            requestedAt:confirmation.requestedAt ?? new Date().toISOString(),
            scheduledFor:confirmation.payload.scheduledFor??confirmation.payload.effectiveAt,
            rail:confirmation.payload.rail ?? "ACH",
            amountMinor:confirmation.payload.amountMinor,
            recipientName:confirmation.payload.recipientName ?? "",
            bankName:confirmation.payload.bankName ?? "",
            sourceAccountLast4:customerAccounts.find((account)=>account.id===confirmation.payload.sourceAccountId)?.accountNumber.slice(-4) ?? "",
            recipientAccountLast4:confirmation.payload.accountNumber?.slice(-4) ?? "",
            routingNumber:confirmation.payload.routingNumber ?? "",
            swiftBic:confirmation.payload.swiftBic,
            recipientAddress:[confirmation.payload.recipientAddressLine1,confirmation.payload.recipientAddressLine2,confirmation.payload.recipientCity,confirmation.payload.recipientStateRegion,confirmation.payload.recipientPostalCode,confirmation.payload.recipientCountryCode].filter(Boolean).join(", "),
            memo:confirmation.payload.description,
            status:confirmation.finalStatus ?? "PENDING",
          }}/>
          <div className="receipt-actions no-print"><button type="button" className="secondary-action print-receipt" onClick={()=>window.print()}><Printer size={15}/>Print receipt</button><button type="button" className="inline-submit" onClick={()=>setConfirmation(null)}>Done</button></div>
        </>}
        {confirmation.phase==="error"&&<>
          <div className="confirmation-icon error"><X size={27}/></div>
          <span className="confirmation-eyebrow">Request not created</span>
          <h2 id="transfer-confirmation-title">Review the transfer details</h2>
          <p>{confirmation.error}</p>
          <button type="button" className="inline-submit full" onClick={()=>setConfirmation({...confirmation,phase:"review"})}>Return to review</button>
        </>}
      </section>
    </div>}
    {selectedRequest&&<TransferRequestDetails request={selectedRequest} close={()=>setSelectedRequest(null)}/>}
  </>;
}

export function TransferRequestDetails({request,close}:{request:BankingTransferRequest;close:()=>void}) {
  const { complianceAction } = useBankingData("customer");
  const [effectiveStatus,setEffectiveStatus] = useState(request.status);
  const [effectiveHoldState,setEffectiveHoldState] = useState(request.holdState);
  const [verificationPhase,setVerificationPhase] = useState<"details"|"processing"|"success">("details");
  const [complianceCode,setComplianceCode] = useState("");
  const [complianceNotice,setComplianceNotice] = useState("");
  const [complianceSubmitting,setComplianceSubmitting] = useState(false);
  useEffect(()=>{
    const frame=window.requestAnimationFrame(()=>{setEffectiveStatus(request.status);setEffectiveHoldState(request.holdState);});
    return()=>window.cancelAnimationFrame(frame);
  },[request.status,request.holdState]);
  const rail = request.rail==="ACH"?"External ACH":request.rail==="DOMESTIC_WIRE"?"Domestic wire":"International wire";
  const statusCopy = effectiveStatus==="COMPLETED"
    ? "Approved by operations and posted to the clearing ledger."
    :effectiveStatus==="FAILED"
      ? "Rejected by operations. No external-transfer ledger posting was created."
      :effectiveStatus==="PROCESSING"
        ? request.transferMode==="COMPLIANCE_CODE"
          ? "A reusable compliance release code is required. No live rail has been contacted."
          : "Flagged for additional operations review. No live rail has been contacted."
        :"Awaiting operations approval. No live rail has been contacted.";
  async function requestCode() {
    setComplianceSubmitting(true);
    setComplianceNotice("");
    try {
      const result = await complianceAction({action:"REQUEST_COMPLIANCE_CODE",requestId:request.id});
      setEffectiveHoldState(result.holdState ?? "REQUESTED");
      close();
    } catch (error) {
      setComplianceNotice(error instanceof Error?error.message.replaceAll("_"," "):"Unable to request code");
    } finally {
      setComplianceSubmitting(false);
    }
  }
  async function submitCode() {
    if (!complianceCode.trim()) {
      setComplianceNotice("Enter the compliance code supplied by operations.");
      return;
    }
    setComplianceSubmitting(true);
    setComplianceNotice("");
    setVerificationPhase("processing");
    const outcome = await complianceAction({action:"SUBMIT_COMPLIANCE_CODE",requestId:request.id,complianceCode})
      .then((result)=>({result,error:null}))
      .catch((error:unknown)=>({result:null,error}));
    await new Promise((resolve)=>setTimeout(resolve,5000));
    if (outcome.result) {
      setEffectiveStatus("COMPLETED");
      setEffectiveHoldState("RELEASED");
      setComplianceCode("");
      setVerificationPhase("success");
    } else {
      const error = outcome.error;
      setVerificationPhase("details");
      setComplianceNotice(error instanceof Error?error.message.replaceAll("_"," "):"Compliance verification failed");
    }
    setComplianceSubmitting(false);
  }
  const receiptData: TransferReceiptData = {
    reference:request.reference,
    requestedAt:request.requestedAt,
    scheduledFor:request.scheduledFor,
    rail:request.rail,
    amountMinor:request.amountMinor,
    recipientName:request.recipientName,
    bankName:request.bankName,
    sourceAccountLast4:request.sourceAccountNumber.slice(-4),
    recipientAccountLast4:request.accountNumber.slice(-4),
    routingNumber:request.routingNumber,
    swiftBic:request.swiftBic ?? undefined,
    recipientAddress:[request.recipientAddressLine1,request.recipientAddressLine2,request.recipientCity,request.recipientStateRegion,request.recipientPostalCode,request.recipientCountryCode].filter(Boolean).join(", "),
    memo:request.memo ?? undefined,
    status:verificationPhase==="success"?"COMPLETED":effectiveStatus,
  };
  if (verificationPhase==="processing") {
    return <div className="transfer-modal-backdrop" role="presentation"><section className="transfer-confirmation verifying" role="dialog" aria-modal="true" aria-labelledby="transfer-verifying-title">
      <div className="processing-state">
        <LoaderCircle className="processing-spinner" size={42}/>
        <span className="confirmation-eyebrow">Compliance release</span>
        <h2 id="transfer-verifying-title">Verifying compliance code</h2>
        <p>Releasing the hold and posting the transfer to clearing. This secure check takes five seconds.</p>
        <div className="processing-track"><span/></div>
      </div>
    </section></div>;
  }
  if (verificationPhase==="success") {
    return <div className="transfer-modal-backdrop" role="presentation"><section className="transfer-confirmation success" role="dialog" aria-modal="true" aria-labelledby="transfer-success-title">
      <div className="receipt-screen-head no-print"><div className="confirmation-icon success"><CheckCircle2 size={27}/></div><div><span className="confirmation-eyebrow">Transfer completed</span><h2 id="transfer-success-title">Compliance hold released</h2><p>The transfer was posted to clearing and is now complete.</p></div></div>
      <ExternalTransferReceipt data={receiptData}/>
      <div className="receipt-actions no-print"><button type="button" className="secondary-action print-receipt" onClick={()=>window.print()}><Printer size={15}/>Print confirmation</button><button type="button" className="inline-submit" onClick={close}>Done</button></div>
    </section></div>;
  }
  return <div className="transfer-modal-backdrop" role="presentation"><section className="transfer-detail-modal" role="dialog" aria-modal="true" aria-labelledby="transfer-detail-title">
    <button className="modal-close" type="button" aria-label="Close transfer details" onClick={close}><X size={18}/></button>
    <div className="transfer-detail-head"><span><ArrowRightLeft size={21}/></span><div><small>{rail}</small><h2 id="transfer-detail-title">{request.recipientName}</h2><p>{request.reference}</p></div><strong>{formatMoney(request.amountMinor)}</strong></div>
    <div className={`transfer-status-callout ${transferRequestStatusTone(effectiveStatus)}`}><span className={`status-pill ${transferRequestStatusTone(effectiveStatus)}`}>{transferRequestStatusLabel(effectiveStatus)}</span><p>{statusCopy}</p></div>
    <dl className="transfer-detail-grid">
      <div><dt>Requested</dt><dd>{new Date(request.requestedAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</dd></div>
      <div><dt>Scheduled</dt><dd>{new Date(request.scheduledFor).toLocaleDateString("en-US",{dateStyle:"medium"})}</dd></div>
      <div><dt>From account</dt><dd>•••• {request.sourceAccountNumber.slice(-4)}</dd></div>
      <div><dt>Recipient account</dt><dd>•••• {request.accountNumber.slice(-4)}</dd></div>
      <div><dt>Bank</dt><dd>{request.bankName}</dd></div>
      <div><dt>Routing</dt><dd>{request.routingNumber}</dd></div>
      {request.swiftBic&&<div><dt>SWIFT / BIC</dt><dd>{request.swiftBic}</dd></div>}
      <div className="wide"><dt>Bank address</dt><dd>{request.bankAddress}</dd></div>
      <div className="wide"><dt>Recipient address</dt><dd>{request.recipientAddressLine1}{request.recipientAddressLine2?`, ${request.recipientAddressLine2}`:""}, {request.recipientCity}, {request.recipientStateRegion} {request.recipientPostalCode}, {request.recipientCountryCode}</dd></div>
      {request.memo&&<div className="wide"><dt>Memo</dt><dd>{request.memo}</dd></div>}
    </dl>
    {request.transferMode==="COMPLIANCE_CODE"&&effectiveHoldState!=="RELEASED"&&effectiveStatus!=="FAILED"&&<section className="detail-compliance-box no-print">
      <div><ShieldCheck size={18}/><span><b>Compliance soft hold</b>{request.customerMessage || "Enter the reusable compliance code supplied by operations."}</span></div>
      <div className="detail-code-entry"><input value={complianceCode} onChange={(event)=>setComplianceCode(event.target.value.toUpperCase())} placeholder="CMP-XXXX-XXXXXX" autoComplete="off"/><button type="button" disabled={complianceSubmitting} onClick={submitCode}>Verify code</button></div>
      {complianceNotice&&<p>{complianceNotice}</p>}
      <button type="button" className="detail-request-code" disabled={complianceSubmitting} onClick={requestCode}>{effectiveHoldState==="REQUESTED"?"Code request sent":"Request compliance code"}</button>
    </section>}
    <div className="receipt-print-only"><ExternalTransferReceipt data={receiptData}/></div>
    <div className="receipt-actions no-print"><button type="button" className="secondary-action print-receipt" onClick={()=>window.print()}><Printer size={15}/>Print confirmation</button><button type="button" className="inline-submit" onClick={close}>Close details</button></div>
  </section></div>;
}

type TransferReceiptData = {
  reference: string;
  requestedAt: string;
  scheduledFor: string;
  rail: BankingTransferRequest["rail"];
  amountMinor: number;
  recipientName: string;
  bankName: string;
  sourceAccountLast4: string;
  recipientAccountLast4: string;
  routingNumber: string;
  swiftBic?: string;
  recipientAddress: string;
  memo?: string;
  status: BankingTransferRequest["status"];
};

function ExternalTransferReceipt({data}:{data:TransferReceiptData}) {
  const rail = data.rail==="ACH"?"External ACH":data.rail==="DOMESTIC_WIRE"?"Domestic wire":"International wire";
  const status = transferRequestStatusLabel(data.status);
  return <article className="transfer-receipt receipt-printable">
    <header className="receipt-header">
      <div className="receipt-brand"><span><Sparkles size={17}/></span><div><strong>NORTHSTAR</strong><small>DIGITAL BANKING</small></div></div>
      <div className={`receipt-status ${transferRequestStatusTone(data.status)}`}><CheckCircle2 size={15}/><span>{status}</span></div>
    </header>
    <div className="receipt-title"><span>TRANSFER CONFIRMATION</span><h3>{formatMoney(data.amountMinor)}</h3><p>{rail} · {status}</p></div>
    <dl className="receipt-grid">
      <div><dt>Confirmation reference</dt><dd>{data.reference}</dd></div>
      <div><dt>Requested</dt><dd>{new Date(data.requestedAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</dd></div>
      <div><dt>From account</dt><dd>Northstar Checking · •••• {data.sourceAccountLast4}</dd></div>
      <div><dt>Recipient account</dt><dd>{data.bankName} · •••• {data.recipientAccountLast4}</dd></div>
      <div><dt>Recipient</dt><dd>{data.recipientName}</dd></div>
      <div><dt>Instruction timestamp</dt><dd>{new Date(data.scheduledFor).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</dd></div>
      <div><dt>Routing number</dt><dd>{data.routingNumber}</dd></div>
      {data.swiftBic&&<div><dt>SWIFT / BIC</dt><dd>{data.swiftBic}</dd></div>}
      <div className="wide"><dt>Recipient address</dt><dd>{data.recipientAddress}</dd></div>
      {data.memo&&<div className="wide"><dt>Payment memo</dt><dd>{data.memo}</dd></div>}
    </dl>
    <footer className="receipt-footer"><ShieldCheck size={17}/><p><b>Transfer confirmation</b>Keep this receipt for your records. Contact support if any detail is incorrect.</p></footer>
  </article>;
}

function BillPayWorkspace() {
  const { accounts } = useBankingData("customer");
  const [bills,setBills] = useState<Array<{payee:string;date:string;frequency:string;amount:string}>>([]);
  const [paymentDate,setPaymentDate]=useState(()=>localDateValue(dateDaysFromNow(7)));
  const [notice,setNotice]=useState<Notice>(null);
  function schedule(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const paymentDate = new Date(`${String(form.get("paymentDate"))}T12:00:00`);
    setBills(items=>[...items,{
      payee:String(form.get("payee")),
      date:paymentDate.toLocaleDateString("en-US",{dateStyle:"medium"}),
      frequency:String(form.get("frequency")),
      amount:formatMoney(Math.round(Number(form.get("amount"))*100)),
    }]);
    setNotice({text:"Bill payment scheduled successfully."});
  }
  return <>
    <WorkspaceHeader title="Bill pay" copy="Schedule one-time or recurring payments to saved billers."/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <div className="two-column-workspace">
      <section className="section-card"><div className="section-title"><div><h2>Schedule payment</h2><p>Choose a biller, payment account, date, and frequency.</p></div></div><form className="form-grid" onSubmit={schedule}><div className="field"><label>PAYEE</label><select name="payee"><option>Northstar Electric</option><option>Northstar Utilities</option><option>Metro Telecom</option><option>Harbor Insurance Co.</option></select></div><div className="form-row"><div className="field"><label>AMOUNT</label><input name="amount" type="number" min="0.01" step="0.01" defaultValue="120.00" required/></div><div className="field"><label>PAY FROM</label><select required>{accounts.map((account)=><option key={account.id} value={account.id}>{account.type} · {account.accountNumber.slice(-4)}</option>)}</select></div></div><div className="form-row"><div className="field"><label>PAYMENT DATE</label><input name="paymentDate" type="date" value={paymentDate} min={paymentDate ? localDateValue() : undefined} onChange={(event)=>setPaymentDate(event.target.value)} required/></div><div className="field"><label>FREQUENCY</label><select name="frequency"><option>One time</option><option>Monthly</option><option>Every two weeks</option></select></div></div><button className="inline-submit" disabled={!accounts.length}>Schedule payment</button></form></section>
      <aside className="section-card"><div className="section-title"><div><h2>Scheduled payments</h2><p>{bills.length} upcoming instructions</p></div></div><div className="scheduled-list">{bills.map((bill,index)=><div key={`${bill.payee}-${index}`}><span><ReceiptText size={16}/></span><div><b>{bill.payee}</b><small>{bill.date} · {bill.frequency}</small></div><strong>{bill.amount}</strong><button aria-label={`Delete ${bill.payee}`} onClick={()=>setBills(items=>items.filter((_,i)=>i!==index))}><Trash2 size={13}/></button></div>)}</div></aside>
    </div>
  </>;
}

function BeneficiariesWorkspace() {
  type Beneficiary = {
    id:string;
    beneficiaryName:string;
    email:string;
    addressLine1:string;
    addressLine2:string|null;
    city:string;
    stateRegion:string;
    postalCode:string;
    countryCode:string;
    paymentMethod:"BANK_ACCOUNT"|"E_CURRENCY";
    accountNumber:string|null;
    routingNumber:string|null;
    eCurrencyAsset:string|null;
    eCurrencyNetwork:string|null;
    walletIdentifier:string|null;
  };
  const [people,setPeople]=useState<Beneficiary[]>([]);
  const [paymentMethod,setPaymentMethod]=useState<Beneficiary["paymentMethod"]>("BANK_ACCOUNT");
  const [loading,setLoading]=useState(true);
  const [submitting,setSubmitting]=useState(false);
  const [notice,setNotice]=useState<Notice>(null);
  const [confirmedBeneficiary,setConfirmedBeneficiary]=useState<Beneficiary|null>(null);

  useEffect(()=>{
    let active=true;
    fetch("/api/customer/beneficiaries",{cache:"no-store"})
      .then(async(response)=>{
        const result=await response.json() as {beneficiaries?:Beneficiary[];error?:string};
        if(!response.ok)throw new Error(result.error??"BENEFICIARY_READ_FAILED");
        if(active)setPeople(result.beneficiaries??[]);
      })
      .catch((error)=>active&&setNotice({tone:"warn",text:error instanceof Error?error.message.replaceAll("_"," "):"Beneficiaries could not be loaded."}))
      .finally(()=>active&&setLoading(false));
    return()=>{active=false;};
  },[]);

  async function addBeneficiary(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);
    const form=event.currentTarget;
    const values=Object.fromEntries(new FormData(form).entries());
    try {
      const response=await fetch("/api/customer/beneficiaries",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({...values,paymentMethod}),
      });
      const result=await response.json() as Beneficiary&{error?:string};
      if(!response.ok)throw new Error(result.error??"BENEFICIARY_CREATE_FAILED");
      setPeople((items)=>[...items,result].sort((left,right)=>left.beneficiaryName.localeCompare(right.beneficiaryName)));
      form.reset();
      setPaymentMethod("BANK_ACCOUNT");
      setConfirmedBeneficiary(result);
    } catch(error) {
      setNotice({tone:"warn",text:(error instanceof Error?error.message:"BENEFICIARY_CREATE_FAILED").replaceAll("_"," ").toLowerCase().replace(/^./,(letter)=>letter.toUpperCase())});
    } finally {
      setSubmitting(false);
    }
  }

  return <><WorkspaceHeader title="Beneficiaries" copy="Save bank-account or digital-asset recipient instructions."/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <section className="section-card beneficiary-create-card">
      <div className="section-title"><div><h2>Add a beneficiary</h2><p>Enter the recipient&apos;s bank-account or wallet details carefully.</p></div></div>
      <form className="form-grid" onSubmit={addBeneficiary}>
        <div className="form-row"><div className="field"><label>BENEFICIARY NAME</label><input name="beneficiaryName" placeholder="Northstar Supply LLC" required/></div><div className="field"><label>EMAIL ADDRESS</label><input name="email" type="email" placeholder="vendor@example.test" required/></div></div>
        <div className="field"><label>COUNTRY CODE</label><input name="countryCode" defaultValue="US" maxLength={2} required/></div>
        <div className="field"><label>PAYMENT METHOD</label><select value={paymentMethod} onChange={(event)=>setPaymentMethod(event.target.value as Beneficiary["paymentMethod"])}><option value="BANK_ACCOUNT">Bank account</option><option value="E_CURRENCY">Digital asset / crypto wallet</option></select></div>
        {paymentMethod==="BANK_ACCOUNT"
          ? <div className="form-row beneficiary-method-fields"><div className="field"><label>ACCOUNT NUMBER</label><input name="accountNumber" inputMode="numeric" placeholder="0007712048" required/></div><div className="field"><label>ROUTING NUMBER</label><input name="routingNumber" inputMode="numeric" placeholder="021000021" required/></div></div>
          : <div className="e-currency-beneficiary-fields"><div className="e-currency-disclosure"><Coins size={17}/><span><b>Digital-asset beneficiary</b>Confirm the asset, network, and wallet address before saving.</span></div><div className="form-row"><div className="field"><label>ASSET</label><select name="eCurrencyAsset" defaultValue="USDC"><option>USDC</option><option>BTC</option><option>ETH</option><option>USDT</option></select></div><div className="field"><label>NETWORK</label><select name="eCurrencyNetwork" defaultValue="SIM-ETHEREUM"><option value="SIM-ETHEREUM">Ethereum</option><option value="SIM-BITCOIN">Bitcoin</option><option value="SIM-TRON">Tron</option><option value="SIM-SOLANA">Solana</option></select></div></div><div className="field"><label>WALLET ADDRESS</label><input name="walletIdentifier" placeholder="Wallet address" required/></div></div>}
        <button className="inline-submit beneficiary-submit" disabled={submitting}>{submitting?"Saving beneficiary…":"Add beneficiary"}</button>
      </form>
    </section>
    <div className="beneficiary-grid">{people.map((person)=><article className={`beneficiary-card ${person.paymentMethod==="E_CURRENCY"?"e-currency":""}`} key={person.id}><span>{person.paymentMethod==="E_CURRENCY"?<Coins size={18}/>:<UserRound size={18}/>}</span><div><b>{person.beneficiaryName}</b><small>{person.email} · {person.countryCode}</small><small className="beneficiary-instructions">{person.paymentMethod==="BANK_ACCOUNT"?`Account •••• ${person.accountNumber?.slice(-4)} · Routing ${person.routingNumber}`:`${person.eCurrencyAsset} · ${person.eCurrencyNetwork} · ${person.walletIdentifier}`}</small></div><span className="status-pill">{person.paymentMethod==="BANK_ACCOUNT"?"Bank":"E-currency"}</span></article>)}{!loading&&people.length===0&&<div className="empty-ledger">No saved beneficiaries yet.</div>}</div>
    {confirmedBeneficiary&&<div className="transfer-modal-backdrop" role="presentation"><section className="beneficiary-confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="beneficiary-confirmation-title">
      <button className="modal-close" type="button" aria-label="Close beneficiary confirmation" onClick={()=>setConfirmedBeneficiary(null)}><X size={18}/></button>
      <div className="beneficiary-confirmation-icon"><CheckCircle2 size={29}/></div>
      <span className="confirmation-eyebrow">Beneficiary saved</span>
      <h2 id="beneficiary-confirmation-title">{confirmedBeneficiary.beneficiaryName} is ready</h2>
      <p>The recipient was securely added to your beneficiary directory.</p>
      <div className="beneficiary-confirmation-profile">
        <span>{confirmedBeneficiary.paymentMethod==="E_CURRENCY"?<Coins size={21}/>:<UserRound size={21}/>}</span>
        <div><b>{confirmedBeneficiary.beneficiaryName}</b><small>{confirmedBeneficiary.email}</small></div>
        <em>{confirmedBeneficiary.countryCode}</em>
      </div>
      <dl className="beneficiary-confirmation-details">
        <div><dt>Payment method</dt><dd>{confirmedBeneficiary.paymentMethod==="BANK_ACCOUNT"?"Bank account":"Digital asset"}</dd></div>
        {confirmedBeneficiary.paymentMethod==="BANK_ACCOUNT"
          ? <><div><dt>Account</dt><dd>•••• {confirmedBeneficiary.accountNumber?.slice(-4)}</dd></div><div className="wide"><dt>Routing number</dt><dd>{confirmedBeneficiary.routingNumber}</dd></div></>
          : <><div><dt>Asset</dt><dd>{confirmedBeneficiary.eCurrencyAsset}</dd></div><div><dt>Network</dt><dd>{confirmedBeneficiary.eCurrencyNetwork}</dd></div><div className="wide"><dt>Wallet identifier</dt><dd>{confirmedBeneficiary.walletIdentifier}</dd></div></>}
      </dl>
      <div className="beneficiary-confirmation-note"><ShieldCheck size={15}/><span>{confirmedBeneficiary.paymentMethod==="E_CURRENCY"?"Verify the selected network before sending digital assets.":"This beneficiary is ready for bank transfers."}</span></div>
      <div className="confirmation-actions"><button type="button" className="secondary-action" onClick={()=>setConfirmedBeneficiary(null)}>Add another</button><button type="button" className="inline-submit" onClick={()=>setConfirmedBeneficiary(null)}>Done</button></div>
    </section></div>}
  </>;
}

function LoansWorkspace() {
  const [type,setType]=useState("Personal");
  const [amount,setAmount]=useState(25000);
  const [term,setTerm]=useState(36);
  const [notice,setNotice]=useState<Notice>(null);
  const rate = type==="Mortgage"?6.25:type==="Auto"?5.8:8.4;
  const monthly = useMemo(()=>{const r=rate/1200; return amount*r*Math.pow(1+r,term)/(Math.pow(1+r,term)-1);},[amount,term,rate]);
  const total = monthly*term;
  const firstPaymentDate = useMemo(()=>dateDaysFromNow(30).toLocaleDateString("en-US",{dateStyle:"long"}),[]);
  return <>
    <WorkspaceHeader title="Loan application center" copy="Explore personal, auto, or mortgage borrowing and review the amortization schedule."/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <div className="loan-application-grid">
      <section className="section-card"><div className="section-title"><div><h2>Configure a loan</h2><p>Review the estimated rate, term, and monthly payment before applying.</p></div></div><div className="form-grid"><div className="field"><label>LOAN TYPE</label><select value={type} onChange={e=>setType(e.target.value)}><option>Personal</option><option>Auto</option><option>Mortgage</option></select></div><div className="field"><label>REQUESTED AMOUNT · ${amount.toLocaleString()}</label><input type="range" min="5000" max={type==="Mortgage"?"750000":"100000"} step="1000" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></div><div className="field"><label>TERM</label><select value={term} onChange={e=>setTerm(Number(e.target.value))}><option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option><option value="60">60 months</option><option value="360">30 years</option></select></div><button className="inline-submit" onClick={()=>setNotice({text:`${type} loan application submitted for underwriting.`})}>Submit application</button></div></section>
      <aside className="loan-calculator"><small>ESTIMATED MONTHLY PAYMENT</small><strong>${monthly.toLocaleString("en-US",{maximumFractionDigits:2})}</strong><span>{rate.toFixed(2)}% APR · {term} payments</span><div className="amortization-bar"><i style={{width:`${amount/total*100}%`}}/><b/></div><div className="amortization-legend"><p><i/>Principal <b>${amount.toLocaleString()}</b></p><p><i/>Interest <b>${(total-amount).toLocaleString("en-US",{maximumFractionDigits:0})}</b></p></div><div className="next-payment"><CalendarClock size={17}/><span><b>First payment</b>{firstPaymentDate}</span></div></aside>
    </div>
    <section className="section-card" style={{marginTop:14}}><div className="section-title"><div><h2>Active loan amortization</h2><p>Approved loans and repayment progress will appear here.</p></div></div><div className="empty-ledger">No active loans for this customer.</div></section>
  </>;
}

function StatementsWorkspace() {
  const { customers,accounts,transactions }=useBankingData("customer");
  const customerAccounts=accounts;
  const statementPeriods=useMemo(()=>Array.from({length:24},(_,index)=>monthDescriptor(index)),[]);
  const [period,setPeriod]=useState(()=>monthDescriptor(0).label);
  const [selectedAccountId,setSelectedAccountId]=useState("acct-checking-1842");
  const [notice,setNotice]=useState<Notice>(null);
  useEffect(()=>{
    if (customerAccounts.length && !customerAccounts.some((account)=>account.id===selectedAccountId)) {
      const frame=window.requestAnimationFrame(()=>setSelectedAccountId(customerAccounts[0].id));
      return()=>window.cancelAnimationFrame(frame);
    }
  },[customerAccounts,selectedAccountId]);
  const periodPrefixes=Object.fromEntries(statementPeriods.map((item)=>[item.label,item.prefix])) as Record<string,string>;
  const countFor=(accountId:string,statement:string)=>transactions.filter((transaction)=>transaction.accountId===accountId&&transaction.effectiveAt.startsWith(periodPrefixes[statement])).length;
  const statements=customerAccounts.flatMap((account)=>statementPeriods
    .filter(({label},index)=>index===0||countFor(account.id,label)>0)
    .map(({label:statement})=>({
    statement,
    account,
    activity:countFor(account.id,statement),
    latestActivity:transactions
      .filter((transaction)=>transaction.accountId===account.id&&transaction.effectiveAt.startsWith(periodPrefixes[statement]))
      .reduce((latest,transaction)=>transaction.effectiveAt>latest?transaction.effectiveAt:latest,""),
  }))).sort((left,right)=>{
    const periodOrder=periodPrefixes[right.statement].localeCompare(periodPrefixes[left.statement]);
    return periodOrder!==0?periodOrder:right.latestActivity.localeCompare(left.latestActivity);
  });
  const visibleLedger=transactions
    .filter((transaction)=>customerAccounts.some((account)=>account.id===transaction.accountId))
    .sort((left,right)=>{
      const postedOrder=new Date(right.createdAt).getTime()-new Date(left.createdAt).getTime();
      if(postedOrder!==0)return postedOrder;
      const effectiveOrder=new Date(right.effectiveAt).getTime()-new Date(left.effectiveAt).getTime();
      return effectiveOrder!==0?effectiveOrder:right.id.localeCompare(left.id);
    })
    .slice(0,20);
  function download(statement:string,accountId:string) {
    const account=customerAccounts.find((item)=>item.id===accountId);
    if(!account)return;
    const entries=transactions.filter((transaction)=>transaction.accountId===accountId&&transaction.effectiveAt.startsWith(periodPrefixes[statement]));
    const url=URL.createObjectURL(makeStyledStatementPdf({
      period:statement,
      customerName:customers[0] ? `${customers[0].firstName} ${customers[0].lastName}`.trim() : account.customerName,
      accountType:account.type,
      accountNumber:account.accountNumber,
      currentBalanceMinor:account.balanceMinor,
      generatedAt:new Date().toISOString(),
      entries:entries.map((transaction)=>({
        reference:transaction.reference,
        direction:transaction.direction,
        amountMinor:transaction.amountMinor,
        description:transaction.description,
        effectiveAt:transaction.effectiveAt,
      })),
    }));
    const anchor=document.createElement("a");anchor.href=url;anchor.download=`northstar-${statement.toLowerCase().replace(" ","-")}.pdf`;anchor.click();URL.revokeObjectURL(url);
    setNotice({text:`${statement} statement PDF generated successfully.`});
  }
  return <><WorkspaceHeader title="Document vault" copy="Generate monthly PDF statements dynamically from posted ledger activity."/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <section className="section-card statement-generator"><div><FileText size={23}/><div><h2>Generate a custom statement</h2><p>Select an account and month to render its persistent ledger entries.</p></div></div><div className="field"><label>ACCOUNT</label><select value={selectedAccountId} onChange={e=>setSelectedAccountId(e.target.value)}>{customerAccounts.map((account)=><option key={account.id} value={account.id}>{account.type} · {account.accountNumber.slice(-4)}</option>)}</select></div><div className="field"><label>PERIOD</label><select value={period} onChange={e=>setPeriod(e.target.value)}>{statementPeriods.map((item)=><option key={item.prefix}>{item.label}</option>)}</select></div><button className="inline-submit" onClick={()=>download(period,selectedAccountId)}><Download size={14}/>Generate PDF</button></section>
    <section className="section-card"><div className="section-title"><div><h2>Available statements</h2><p>Counts and balances are read from the persistent ledger after every refresh.</p></div></div><table className="activity-table"><thead><tr><th>Period</th><th>Activity</th><th className="money">Current balance</th><th></th></tr></thead><tbody>{statements.map(({statement,account,activity})=><tr key={`${statement}-${account.id}`}><td><div className="transaction-name"><span className="transaction-icon"><FileText size={13}/></span><div><b>{statement}</b><small>{account.type} · {account.accountNumber.slice(-4)}</small></div></div></td><td>{activity} transaction{activity===1?"":"s"}</td><td className="money">{formatMoney(account.balanceMinor)}</td><td className="row-action"><button onClick={()=>download(statement,account.id)}><Download size={12}/> PDF</button></td></tr>)}</tbody></table></section>
    <section className="section-card"><div className="section-title"><div><h2>Posted statement activity</h2><p>Last posted payment first · effective date remains visible for statement accuracy.</p></div><span className="status-pill">{visibleLedger.length} entries</span></div><table className="activity-table"><thead><tr><th>Description</th><th>Effective / posted</th><th>Account</th><th className="money">Amount</th></tr></thead><tbody>{visibleLedger.map((transaction)=><tr key={transaction.id}><td><div className="transaction-name"><span className="transaction-icon"><ArrowRightLeft size={13}/></span><div><b>{transaction.description}</b><small>{transaction.reference}</small></div></div></td><td><div className="statement-date"><b>{new Date(transaction.effectiveAt).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"})}</b><small>Posted {new Date(transaction.effectiveAt).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",second:"2-digit"})}</small></div></td><td>•••• {transaction.accountNumber.slice(-4)}</td><td className={`money ${transaction.direction==="CREDIT"?"credit":""}`}>{transaction.direction==="CREDIT"?"+":"−"}{formatMoney(transaction.amountMinor)}</td></tr>)}</tbody></table>{visibleLedger.length===0&&<div className="empty-ledger">No posted activity for this customer yet.</div>}</section>
  </>;
}

function SupportWorkspace() {
  const [tickets,setTickets]=useState<string[][]>([]);
  const [subject,setSubject]=useState("Unauthorized transaction");
  const [message,setMessage]=useState("");
  const [notice,setNotice]=useState<Notice>(null);
  function send(event:React.FormEvent){event.preventDefault();setTickets(items=>[[`SUP-${10483+items.length}`,subject,"Open",message],...items]);setMessage("");setNotice({text:"Support ticket opened and sent to the help desk queue."});}
  return <><WorkspaceHeader title="Support center" copy="Report transactions, request fee waivers, and message our support team."/>
    <NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <LiveChatPanel realm="customer"/>
    <div className="two-column-workspace"><section className="section-card"><div className="section-title"><div><h2>Open a support ticket</h2><p>A staff member can claim and reply from the admin console.</p></div></div><form className="form-grid" onSubmit={send}><div className="field"><label>TOPIC</label><select value={subject} onChange={e=>setSubject(e.target.value)}><option>Unauthorized transaction</option><option>Fee waiver request</option><option>Account question</option><option>Transfer issue</option></select></div><div className="field"><label>MESSAGE</label><textarea value={message} onChange={e=>setMessage(e.target.value)} required placeholder="Describe the issue and include any relevant transaction reference."/></div><button className="inline-submit">Send message</button></form></section><aside className="section-card"><div className="section-title"><div><h2>Your conversations</h2><p>{tickets.length} total tickets</p></div></div><div className="ticket-list">{tickets.map(([id,title,status,last])=><div key={id}><span><Headphones size={15}/></span><div><b>{title}</b><small>{id} · {last}</small></div><span className={`status-pill ${status==="Open"?"warn":""}`}>{status}</span></div>)}</div></aside></div>
  </>;
}

function SecurityWorkspace() {
  const { customers } = useBankingData("customer");
  const customer = customers[0];
  type LoginSession = {
    sessionId:string;
    ipAddress:string;
    userAgent:string;
    deviceType:string;
    browserName:string;
    operatingSystem:string;
    createdAt:string;
    lastSeenAt:string;
    expiresAt:string;
    revokedAt:string|null;
    current:boolean;
    active:boolean;
  };
  const [totp,setTotp]=useState(true);
  const [webauthn,setWebauthn]=useState(false);
  const [loginAlerts,setLoginAlerts]=useState(true);
  const [transferAlerts,setTransferAlerts]=useState(true);
  const [paperless,setPaperless]=useState(true);
  const [notice,setNotice]=useState<Notice>(null);
  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [passwordSaving,setPasswordSaving]=useState(false);
  const [sessions,setSessions]=useState<LoginSession[]>([]);
  const [sessionsLoading,setSessionsLoading]=useState(true);

  async function loadSessions() {
    try {
      const response=await fetch("/api/customer/security/sessions",{cache:"no-store"});
      const result=await response.json() as {sessions?:LoginSession[];error?:string};
      if(!response.ok)throw new Error(result.error??"SESSION_HISTORY_FAILED");
      setSessions(result.sessions??[]);
    } catch(error) {
      setNotice({tone:"warn",text:(error instanceof Error?error.message:"SESSION_HISTORY_FAILED").replaceAll("_"," ").toLowerCase().replace(/^./,(letter)=>letter.toUpperCase())});
    } finally {
      setSessionsLoading(false);
    }
  }

  useEffect(()=>{
    const timer=window.setTimeout(()=>{void loadSessions();if(new URLSearchParams(window.location.search).get("password-reset")==="required")setNotice({tone:"warn",text:"Account services issued a temporary password. Change it now to finish securing your account."});},0);
    return()=>window.clearTimeout(timer);
  },[]);

  async function changePassword(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();setPasswordSaving(true);setNotice(null);
    try {
      const response=await fetch("/api/customer/session",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"CHANGE_PASSWORD",currentPassword,newPassword})});
      const result=await response.json() as {error?:string};
      if(!response.ok)throw new Error(result.error??"PASSWORD_CHANGE_FAILED");
      setCurrentPassword("");setNewPassword("");
      window.history.replaceState({},"","/app/security");
      setNotice({text:"Password updated successfully. Other login sessions were revoked."});
      await loadSessions();
    } catch(error) {
      setNotice({tone:"warn",text:(error instanceof Error?error.message:"PASSWORD_CHANGE_FAILED").replaceAll("_"," ").toLowerCase().replace(/^./,(letter)=>letter.toUpperCase())});
    } finally { setPasswordSaving(false); }
  }

  async function revokeSession(sessionId:string) {
    try {
      const response=await fetch("/api/customer/security/sessions",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({sessionId}),
      });
      const result=await response.json() as {error?:string};
      if(!response.ok)throw new Error(result.error??"SESSION_REVOKE_FAILED");
      await loadSessions();
      setNotice({text:"The selected login session was revoked immediately."});
    } catch(error) {
      setNotice({tone:"warn",text:(error instanceof Error?error.message:"SESSION_REVOKE_FAILED").replaceAll("_"," ").toLowerCase().replace(/^./,(letter)=>letter.toUpperCase())});
    }
  }

  return <><WorkspaceHeader title="Security & settings" copy="Manage sign-in protection, alerts, passwords, and trusted sessions."/><NoticeBar notice={notice} clear={()=>setNotice(null)}/>
    <section className="security-health-card"><div className="security-health-icon"><ShieldCheck size={25}/></div><div><span>ACCOUNT PROTECTION</span><h2>Your security settings are up to date</h2><p>Email OTP is required at every customer login. Account alerts are sent to {customer?.email ?? "your verified email"}.</p></div><div className="security-health-score"><strong>Strong</strong><span>3 of 3 protections active</span></div></section>
    <div className="security-grid"><section className="section-card"><div className="section-title"><div><h2>Multi-factor authentication</h2><p>Strengthen access to your customer portal.</p></div></div><div className="security-options"><div><span><Smartphone size={17}/></span><div><b>Authenticator app</b><small>Time-based one-time code</small></div><button className={`switch ${totp?"on":""}`} onClick={()=>setTotp(!totp)}><span/></button></div><div><span><KeyRound size={17}/></span><div><b>Security key</b><small>WebAuthn-compatible device</small></div><button className={`switch ${webauthn?"on":""}`} onClick={()=>setWebauthn(!webauthn)}><span/></button></div></div></section>
      <section className="section-card"><div className="section-title"><div><h2>Reset password</h2><p>Use a strong password that you do not use elsewhere.</p></div></div><form className="form-grid" onSubmit={changePassword}><div className="field"><label>CURRENT OR TEMPORARY PASSWORD</label><input type="password" value={currentPassword} onChange={(event)=>setCurrentPassword(event.target.value)} autoComplete="current-password" required/></div><div className="field"><label>NEW PASSWORD</label><input type="password" value={newPassword} onChange={(event)=>setNewPassword(event.target.value)} minLength={12} autoComplete="new-password" required/></div><small className="password-policy">Use at least 12 characters with uppercase, lowercase, number, and symbol.</small><button className="inline-submit" disabled={passwordSaving}>{passwordSaving?"Updating password…":"Update password"}</button></form></section></div>
    <section className="section-card security-preferences"><div className="section-title"><div><h2>Communication preferences</h2><p>Choose which account updates should be delivered by email.</p></div><Mail size={18}/></div><div className="preference-grid"><div><span><b>New login alerts</b><small>Email me whenever a new session is verified</small></span><button className={`switch ${loginAlerts?"on":""}`} onClick={()=>setLoginAlerts(!loginAlerts)}><span/></button></div><div><span><b>Transfer updates</b><small>Approval, hold, rejection, and completion notices</small></span><button className={`switch ${transferAlerts?"on":""}`} onClick={()=>setTransferAlerts(!transferAlerts)}><span/></button></div><div><span><b>Paperless statements</b><small>Receive statement-ready notifications electronically</small></span><button className={`switch ${paperless?"on":""}`} onClick={()=>setPaperless(!paperless)}><span/></button></div></div></section>
    <section className="section-card" style={{marginTop:14}}><div className="section-title"><div><h2>Login session history</h2><p>Server-observed device, browser, operating system, IP address, and activity timestamps.</p></div><span className="status-pill">{sessions.filter((session)=>session.active).length} active</span></div><div className="session-privacy-note"><ShieldCheck size={15}/><span>Device details come from the browser user-agent and proxy-observed IP. Modern browsers may intentionally limit exact hardware identification.</span></div><div className="session-history-list">{sessionsLoading?<div className="live-chat-loading"><LoaderCircle size={21}/>Loading real session history…</div>:sessions.map((session)=><article className={`session-history-card ${session.current?"current":""}`} key={session.sessionId}><div className="session-device-icon">{session.deviceType==="Mobile"?<Smartphone size={18}/>:<Monitor size={18}/>}</div><div className="session-device-detail"><div><b>{session.browserName} on {session.operatingSystem}</b>{session.current&&<span className="status-pill">Current session</span>}{!session.active&&<span className="status-pill block">{session.revokedAt?"Revoked":"Expired"}</span>}</div><small>{session.deviceType} · Session {session.sessionId.slice(0,8)}</small><details><summary>Full device information</summary><code>{session.userAgent}</code></details></div><dl className="session-network-detail"><div><dt>Observed IP</dt><dd>{session.ipAddress}</dd></div><div><dt>Signed in</dt><dd>{new Date(session.createdAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</dd></div><div><dt>Last active</dt><dd>{new Date(session.lastSeenAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</dd></div><div><dt>Expires</dt><dd>{new Date(session.expiresAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</dd></div></dl><button className="session-revoke-button" type="button" disabled={session.current||!session.active} onClick={()=>revokeSession(session.sessionId)}>{session.current?"This device":session.active?"Revoke":"Inactive"}</button></article>)}{!sessionsLoading&&sessions.length===0&&<div className="empty-ledger">No recorded login sessions yet. Sign out and sign in again to create the first detailed record.</div>}</div></section>
  </>;
}
