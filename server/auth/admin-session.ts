import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "northstar_admin_session";
const encoder = new TextEncoder();

function secret() {
  const value=process.env.ADMIN_SESSION_SECRET;
  if(value&&value.length>=32)return value;
  if(process.env.NODE_ENV==="production")throw new Error("ADMIN_SESSION_SECRET_REQUIRED");
  return "northstar-local-demo-session-secret-change-me";
}

async function signature(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function secureEqual(left:string,right:string){if(left.length!==right.length)return false;let difference=0;for(let index=0;index<left.length;index+=1)difference|=left.charCodeAt(index)^right.charCodeAt(index);return difference===0;}

function decodeBase32(value:string){
  const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const normalized=value.toUpperCase().replaceAll(/[^A-Z2-7]/g,"");
  let bits="";
  for(const character of normalized){
    const index=alphabet.indexOf(character);
    if(index<0)throw new Error("ADMIN_TOTP_SECRET_INVALID");
    bits+=index.toString(2).padStart(5,"0");
  }
  const bytes:number[]=[];
  for(let offset=0;offset+8<=bits.length;offset+=8)bytes.push(Number.parseInt(bits.slice(offset,offset+8),2));
  if(bytes.length<16)throw new Error("ADMIN_TOTP_SECRET_INVALID");
  return new Uint8Array(bytes);
}

async function totpAt(secretValue:string,counter:number){
  const counterBytes=new Uint8Array(8);
  let remaining=BigInt(counter);
  for(let index=7;index>=0;index-=1){counterBytes[index]=Number(remaining&255n);remaining>>=8n;}
  const key=await crypto.subtle.importKey("raw",decodeBase32(secretValue),{name:"HMAC",hash:"SHA-1"},false,["sign"]);
  const digest=new Uint8Array(await crypto.subtle.sign("HMAC",key,counterBytes));
  const offset=digest[digest.length-1]&15;
  const binary=((digest[offset]&127)<<24)|(digest[offset+1]<<16)|(digest[offset+2]<<8)|digest[offset+3];
  return (binary%1_000_000).toString().padStart(6,"0");
}

export async function verifyAdminMfaCode(code:string|undefined){
  if(!code||!/^[0-9]{6}$/.test(code))return false;
  const totpSecret=process.env.ADMIN_TOTP_SECRET;
  if(totpSecret){
    const counter=Math.floor(Date.now()/30_000);
    const candidates=await Promise.all([-1,0,1].map((drift)=>totpAt(totpSecret,counter+drift)));
    return candidates.some((candidate)=>secureEqual(candidate,code));
  }
  if(process.env.NODE_ENV==="production")throw new Error("ADMIN_TOTP_SECRET_REQUIRED");
  return secureEqual(process.env.ADMIN_OTP??"246810",code);
}

export async function createAdminSessionToken(email: string) {
  const payload = btoa(JSON.stringify({
    email,
    realm: "STAFF",
    mfa: true,
    exp: Date.now() + 8 * 60 * 60 * 1000,
  })).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  return `${payload}.${await signature(payload)}`;
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token||token.length>4096) return false;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature || !secureEqual(await signature(payload),suppliedSignature)) return false;
  try {
    const raw = payload.replaceAll("-", "+").replaceAll("_", "/");
    const normalized = raw.padEnd(Math.ceil(raw.length / 4) * 4, "=");
    const data = JSON.parse(atob(normalized)) as { realm?: string; mfa?: boolean; exp?: number };
    return data.realm === "STAFF" && data.mfa === true && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdminSession() {
  const store = await cookies();
  const requestHeaders = await headers();
  const rawCookie = requestHeaders.get("cookie") ?? "";
  const headerToken = rawCookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
  const token = store.get(ADMIN_COOKIE)?.value ?? headerToken;
  if (!await verifyAdminSessionToken(token)) {
    redirect("/admin/login");
  }
}
