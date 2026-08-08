"use client";

import { useCallback, useEffect, useState } from "react";
import { Headphones, LoaderCircle, MessageSquareText, Send, ShieldCheck, UserRound } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

type ChatMessage = {
  id: string;
  conversationId: string;
  senderKind: "CUSTOMER" | "STAFF" | "SYSTEM";
  senderName: string;
  body: string;
  createdAt: string;
};

type ChatResult = {
  conversation: {
    id: string;
    userId: string;
    status: "OPEN" | "WAITING" | "CLOSED";
    assignedTo: string | null;
  };
  messages: ChatMessage[];
};

type ChatCustomer = {
  userId: string;
  customerName: string;
  email: string;
  conversationId: string | null;
  status: "NEW" | "OPEN" | "WAITING" | "CLOSED";
  assignedTo: string | null;
  updatedAt: string;
  lastMessage: string | null;
};

function ChatMessages({chat,ownKind}:{chat:ChatResult|null;ownKind:"CUSTOMER"|"STAFF"}) {
  const {localeTag,t}=useLanguage();
  return <div className="live-chat-messages" aria-live="polite">
    {!chat&&<div className="live-chat-loading"><LoaderCircle size={22}/>{t("Connecting to support…")}</div>}
    {chat?.messages.map((message)=>{
      const own=message.senderKind===ownKind;
      if(message.senderKind==="SYSTEM")return <div className="live-chat-system" key={message.id}>{message.body}</div>;
      return <div className={`live-chat-message ${own?"own":""}`} key={message.id}><div><b>{own?t("You"):message.senderName}</b><span data-no-translate>{message.body}</span><small>{new Date(message.createdAt).toLocaleTimeString(localeTag,{hour:"numeric",minute:"2-digit"})}</small></div></div>;
    })}
  </div>;
}

function CustomerLiveChatPanel() {
  const {t}=useLanguage();
  const [chat,setChat]=useState<ChatResult|null>(null);
  const [draft,setDraft]=useState("");
  const [error,setError]=useState("");
  const [sending,setSending]=useState(false);

  const refresh=useCallback(async()=>{
    try {
      const response=await fetch("/api/customer/live-chat",{cache:"no-store"});
      const result=await response.json() as ChatResult&{error?:string};
      if(!response.ok)throw new Error(result.error??"LIVE_CHAT_READ_FAILED");
      setChat(result);setError("");
    } catch(readError) {
      setError(readError instanceof Error?readError.message.replaceAll("_"," "):"Live chat could not be loaded.");
    }
  },[]);

  useEffect(()=>{const initial=window.setTimeout(()=>void refresh(),0);const timer=window.setInterval(()=>{if(document.visibilityState==="visible")void refresh();},10_000);return()=>{window.clearTimeout(initial);window.clearInterval(timer);};},[refresh]);

  async function sendMessage(event:React.FormEvent){event.preventDefault();if(!draft.trim())return;setSending(true);setError("");try{const response=await fetch("/api/customer/live-chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({body:draft})});const result=await response.json() as {error?:string};if(!response.ok)throw new Error(result.error??"LIVE_CHAT_SEND_FAILED");setDraft("");await refresh();}catch(sendError){setError(sendError instanceof Error?sendError.message.replaceAll("_"," "):"Message could not be sent.");}finally{setSending(false);}}

  return <section className="section-card live-chat-panel customer">
    <div className="live-chat-head"><div className="live-chat-agent"><span><Headphones size={18}/><i/></span><div><h2>{t("Live support")}</h2><p>{t("Operations team · usually replies within minutes")}</p></div></div><span className="live-chat-status"><i/>{t("Online")}</span></div>
    <div className="live-chat-security"><ShieldCheck size={14}/><span>{t("Secure support channel. Never share passwords, one-time codes, or full account credentials.")}</span></div>
    <ChatMessages chat={chat} ownKind="CUSTOMER"/>
    {error&&<div className="live-chat-error" role="alert">{error}</div>}
    <form className="live-chat-composer" onSubmit={sendMessage}><textarea value={draft} onChange={(event)=>setDraft(event.target.value)} maxLength={2000} placeholder={t("Type your message to support…")} aria-label={t("Live chat message")}/><button disabled={sending||!draft.trim()}>{sending?<LoaderCircle className="live-chat-spinner" size={16}/>:<Send size={16}/>}<span>{t(sending?"Sending":"Send")}</span></button></form>
  </section>;
}

function AdminLiveChatPanel() {
  const {localeTag,t}=useLanguage();
  const [customers,setCustomers]=useState<ChatCustomer[]>([]);
  const [selectedUserId,setSelectedUserId]=useState("");
  const [chat,setChat]=useState<ChatResult|null>(null);
  const [draft,setDraft]=useState("");
  const [error,setError]=useState("");
  const [sending,setSending]=useState(false);

  const refreshCustomers=useCallback(async()=>{
    try {
      const response=await fetch("/admin/api/live-chat",{cache:"no-store"});
      const result=await response.json() as {customers?:ChatCustomer[];error?:string};
      if(!response.ok)throw new Error(result.error??"LIVE_CHAT_READ_FAILED");
      const rows=result.customers??[];
      setCustomers(rows);
      setSelectedUserId((current)=>rows.some((customer)=>customer.userId===current)?current:rows[0]?.userId??"");
      setError("");
    } catch(readError) {
      setError(readError instanceof Error?readError.message.replaceAll("_"," "):"Support inbox could not be loaded.");
    }
  },[]);

  const refreshChat=useCallback(async()=>{
    if(!selectedUserId){setChat(null);return;}
    try {
      const response=await fetch(`/admin/api/live-chat?userId=${encodeURIComponent(selectedUserId)}`,{cache:"no-store"});
      const result=await response.json() as ChatResult&{error?:string};
      if(!response.ok)throw new Error(result.error??"LIVE_CHAT_READ_FAILED");
      setChat(result);setError("");
    } catch(readError) {
      setChat(null);setError(readError instanceof Error?readError.message.replaceAll("_"," "):"Customer conversation could not be loaded.");
    }
  },[selectedUserId]);

  useEffect(()=>{const initial=window.setTimeout(()=>void refreshCustomers(),0);const timer=window.setInterval(()=>{if(document.visibilityState==="visible")void refreshCustomers();},10_000);return()=>{window.clearTimeout(initial);window.clearInterval(timer);};},[refreshCustomers]);
  useEffect(()=>{const initial=window.setTimeout(()=>void refreshChat(),0);const timer=window.setInterval(()=>{if(document.visibilityState==="visible")void refreshChat();},10_000);return()=>{window.clearTimeout(initial);window.clearInterval(timer);};},[refreshChat]);

  async function sendMessage(event:React.FormEvent){event.preventDefault();if(!selectedUserId||!draft.trim())return;setSending(true);setError("");try{const response=await fetch("/admin/api/live-chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({userId:selectedUserId,body:draft})});const result=await response.json() as {error?:string};if(!response.ok)throw new Error(result.error??"LIVE_CHAT_SEND_FAILED");setDraft("");await Promise.all([refreshChat(),refreshCustomers()]);}catch(sendError){setError(sendError instanceof Error?sendError.message.replaceAll("_"," "):"Message could not be sent.");}finally{setSending(false);}}

  const selectedCustomer=customers.find((customer)=>customer.userId===selectedUserId)??null;
  return <section className="admin-support-inbox">
    <aside className="section-card support-customer-list">
      <div className="support-list-heading"><div><MessageSquareText size={18}/><span><b>{t("Customer conversations")}</b><small>{customers.length} {t("customers")}</small></span></div><span className="status-pill warn">{customers.filter((customer)=>customer.status==="WAITING").length} {t("waiting")}</span></div>
      <div className="support-customer-scroll">{customers.map((customer)=><button type="button" className={customer.userId===selectedUserId?"active":""} key={customer.userId} onClick={()=>{setSelectedUserId(customer.userId);setDraft("");setError("");}}><span className="support-customer-avatar"><UserRound size={16}/></span><span><b>{customer.customerName}</b><small>{customer.lastMessage??t("No messages yet")}</small><em>{customer.userId} · {new Date(customer.updatedAt).toLocaleString(localeTag,{dateStyle:"short",timeStyle:"short"})}</em></span><i className={`support-chat-state ${customer.status.toLowerCase()}`}>{t(customer.status==="NEW"?"New":customer.status==="WAITING"?"Needs reply":customer.status==="CLOSED"?"Closed":"Open")}</i></button>)}</div>
      {!customers.length&&!error&&<div className="empty-ledger">{t("No customer profiles are available for support.")}</div>}
    </aside>
    <section className="section-card live-chat-panel admin">
      <div className="live-chat-head"><div className="live-chat-agent"><span><Headphones size={18}/><i/></span><div><h2>{selectedCustomer?.customerName??t("Select a customer")}</h2><p>{selectedCustomer?`${selectedCustomer.email} · ${selectedCustomer.userId}`:t("Choose a customer conversation from the inbox")}</p></div></div>{selectedCustomer&&<span className="live-chat-status"><i/>{t(selectedCustomer.status==="WAITING"?"Needs reply":"Online")}</span>}</div>
      <div className="live-chat-security"><ShieldCheck size={14}/><span>{t("Secure support channel. Never request passwords, one-time codes, or full account credentials.")}</span></div>
      {selectedCustomer?<ChatMessages chat={chat} ownKind="STAFF"/>:<div className="live-chat-messages"><div className="live-chat-loading"><MessageSquareText size={22}/>{t("Select a customer to open their conversation")}</div></div>}
      {error&&<div className="live-chat-error" role="alert">{error}</div>}
      <form className="live-chat-composer" onSubmit={sendMessage}><textarea value={draft} onChange={(event)=>setDraft(event.target.value)} maxLength={2000} disabled={!selectedCustomer} placeholder={selectedCustomer?t("Reply to customer…"):t("Select a customer first")} aria-label={t("Live chat message")}/><button disabled={sending||!selectedCustomer||!draft.trim()}>{sending?<LoaderCircle className="live-chat-spinner" size={16}/>:<Send size={16}/>}<span>{t(sending?"Sending":"Send")}</span></button></form>
    </section>
  </section>;
}

export function LiveChatPanel({realm}:{realm:"customer"|"admin"}) {
  return realm==="admin"?<AdminLiveChatPanel/>:<CustomerLiveChatPanel/>;
}
