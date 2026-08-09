"use client";

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";

export type PublicBrand = {
  id: string;
  bankName: string;
  shortName: string;
  supportEmail: string;
  logoUrl: string | null;
  primaryColor: string;
};

const PublicBrandContext=createContext<PublicBrand|null>(null);

export function PublicBrandProvider({initialBrand,children}:{initialBrand:PublicBrand|null;children:ReactNode}) {
  const [brand,setBrand]=useState<PublicBrand | null>(initialBrand);

  useEffect(()=>{
    let active=true;
    const load=async()=>{
      try {
        const response=await fetch("/api/brand",{cache:"no-store"});
        if(!response.ok)return;
        const result=await response.json() as {brand?:PublicBrand | null};
        if(active&&result.brand)setBrand(result.brand);
      } catch {
        // Branded screens retain their safe defaults while configuration is unavailable.
      }
    };
    void load();
    const channel=new BroadcastChannel("northstar-brand");
    channel.onmessage=()=>void load();
    return()=>{active=false;channel.close();};
  },[]);

  return createElement(PublicBrandContext.Provider,{value:brand},children);
}

export function usePublicBrand() { return useContext(PublicBrandContext); }
