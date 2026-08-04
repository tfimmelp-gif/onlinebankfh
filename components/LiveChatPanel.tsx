"use client";

import { useCallback, useEffect, useState } from "react";
import { Headphones, LoaderCircle, Send, ShieldCheck } from "lucide-react";

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
    status: "OPEN" | "WAITING" | "CLOSED";
    assignedTo: string | null;
  };
  messages: ChatMessage[];
};

export function LiveChatPanel({ realm }: { realm: "customer" | "admin" }) {
  const endpoint = realm === "customer" ? "/api/customer/live-chat" : "/admin/api/live-chat";
  const [chat,setChat] = useState<ChatResult|null>(null);
  const [draft,setDraft] = useState("");
  const [error,setError] = useState("");
  const [sending,setSending] = useState(false);

  const refresh = useCallback(async()=>{
    try {
      const response=await fetch(endpoint,{cache:"no-store"});
      const result=await response.json() as ChatResult&{error?:string};
      if(!response.ok)throw new Error(result.error??"LIVE_CHAT_READ_FAILED");
      setChat(result);
      setError("");
    } catch(readError) {
      setError(readError instanceof Error?readError.message.replaceAll("_"," "):"Live chat could not be loaded.");
    }
  },[endpoint]);

  useEffect(()=>{
    const initial=window.setTimeout(()=>void refresh(),0);
    const timer=window.setInterval(()=>{if(document.visibilityState==="visible")void refresh();},10_000);
    return()=>{window.clearTimeout(initial);window.clearInterval(timer);};
  },[refresh]);

  async function sendMessage(event:React.FormEvent) {
    event.preventDefault();
    if(!draft.trim())return;
    setSending(true);
    setError("");
    try {
      const response=await fetch(endpoint,{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({body:draft}),
      });
      const result=await response.json() as {error?:string};
      if(!response.ok)throw new Error(result.error??"LIVE_CHAT_SEND_FAILED");
      setDraft("");
      await refresh();
    } catch(sendError) {
      setError(sendError instanceof Error?sendError.message.replaceAll("_"," "):"Message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  const ownKind=realm==="customer"?"CUSTOMER":"STAFF";
  return <section className={`section-card live-chat-panel ${realm}`}>
    <div className="live-chat-head">
      <div className="live-chat-agent"><span><Headphones size={18}/><i/></span><div><h2>{realm==="customer"?"Live support":"Customer live chat"}</h2><p>{realm==="customer"?"Operations team · usually replies within minutes":"Alex Morgan · Customer C-882104"}</p></div></div>
      <span className="live-chat-status"><i/>Online</span>
    </div>
    <div className="live-chat-security"><ShieldCheck size={14}/><span>Secure support channel. Never share passwords, one-time codes, or full account credentials.</span></div>
    <div className="live-chat-messages" aria-live="polite">
      {!chat&&!error&&<div className="live-chat-loading"><LoaderCircle size={22}/>Connecting to support…</div>}
      {chat?.messages.map((message)=>{
        const own=message.senderKind===ownKind;
        if(message.senderKind==="SYSTEM")return <div className="live-chat-system" key={message.id}>{message.body}</div>;
        return <div className={`live-chat-message ${own?"own":""}`} key={message.id}><div><b>{own?(realm==="customer"?"You":"You · Operations"):message.senderName}</b><span>{message.body}</span><small>{new Date(message.createdAt).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}</small></div></div>;
      })}
    </div>
    {error&&<div className="live-chat-error" role="alert">{error}</div>}
    <form className="live-chat-composer" onSubmit={sendMessage}><textarea value={draft} onChange={(event)=>setDraft(event.target.value)} maxLength={2000} placeholder={realm==="customer"?"Type your message to support…":"Reply to Alex Morgan…"} aria-label="Live chat message"/><button disabled={sending||!draft.trim()}>{sending?<LoaderCircle className="live-chat-spinner" size={16}/>:<Send size={16}/>}<span>{sending?"Sending":"Send"}</span></button></form>
  </section>;
}
