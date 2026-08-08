"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { usePublicBrand } from "./usePublicBrand";

export function ManagedBrandLink({className="brand"}:{className?:string}) {
  const brand=usePublicBrand();
  const bankName=brand?.bankName??"Northstar Bank";
  return <Link href="/" className={className} aria-label={`${bankName} home`}>
    <span className="brand-mark" style={brand?{background:brand.primaryColor}:undefined}>
      {brand?.logoUrl?<img src={brand.logoUrl} alt=""/>:<Sparkles size={17}/>} 
    </span>
    {brand?.shortName??"NORTHSTAR"}
  </Link>;
}
