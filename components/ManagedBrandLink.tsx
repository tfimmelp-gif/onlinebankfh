"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { usePublicBrand } from "./usePublicBrand";

export function ManagedBrandLink({className="brand"}:{className?:string}) {
  const brand=usePublicBrand();
  const bankName=brand?.bankName??"Northstar Bank";
  return <Link href="/" className={className} aria-label={`${bankName} home`}>
    {brand?.logoUrl?<span className="brand-mark uploaded-brand-logo"><img src={brand.logoUrl} alt=""/></span>:<><span className="brand-mark"><Sparkles size={17}/></span>{brand?.shortName??"NORTHSTAR"}</>}
  </Link>;
}
