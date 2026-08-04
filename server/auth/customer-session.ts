import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSimulationCustomerSessionActive } from "../d1/sim-bank";

export const CUSTOMER_COOKIE = "northstar_customer_session";
const encoder = new TextEncoder();

export type CustomerSessionClaims = {
  email: string;
  userId: string;
  sessionId: string;
  realm: "CUSTOMER";
  exp: number;
};

function secret() {
  const value=process.env.CUSTOMER_SESSION_SECRET;
  if(value&&value.length>=32)return value;
  if(process.env.NODE_ENV==="production")throw new Error("CUSTOMER_SESSION_SECRET_REQUIRED");
  return "northstar-local-customer-session-secret-change-me";
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

export async function createCustomerSessionToken(email: string, userId: string, rememberMe = false) {
  const sessionId = crypto.randomUUID();
  const maxAgeSeconds = rememberMe ? 30 * 24 * 60 * 60 : 8 * 60 * 60;
  const expiresAt = Date.now() + maxAgeSeconds * 1000;
  const payload = btoa(JSON.stringify({
    email,
    userId,
    sessionId,
    realm: "CUSTOMER",
    exp: expiresAt,
  })).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  return { token: `${payload}.${await signature(payload)}`, sessionId, expiresAt, maxAgeSeconds };
}

export async function readCustomerSessionToken(token: string | undefined): Promise<CustomerSessionClaims|null> {
  if (!token||token.length>4096) return null;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature || !secureEqual(await signature(payload),suppliedSignature)) return null;
  try {
    const raw = payload.replaceAll("-", "+").replaceAll("_", "/");
    const normalized = raw.padEnd(Math.ceil(raw.length / 4) * 4, "=");
    const data = JSON.parse(atob(normalized)) as Partial<CustomerSessionClaims>;
    return data.realm === "CUSTOMER"
      && typeof data.userId === "string"
      && /^C-[A-Z0-9]+$/.test(data.userId)
      && typeof data.email === "string"
      && typeof data.sessionId === "string"
      && typeof data.exp === "number"
      && data.exp > Date.now()
      ? data as CustomerSessionClaims
      : null;
  } catch {
    return null;
  }
}

export async function verifyCustomerSessionToken(token: string | undefined) {
  const claims = await readCustomerSessionToken(token);
  return Boolean(claims && await isSimulationCustomerSessionActive(claims.userId, claims.sessionId));
}

export async function requireCustomerSession() {
  const store = await cookies();
  const requestHeaders = await headers();
  const rawCookie = requestHeaders.get("cookie") ?? "";
  const headerToken = rawCookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CUSTOMER_COOKIE}=`))
    ?.slice(CUSTOMER_COOKIE.length + 1);
  const token = store.get(CUSTOMER_COOKIE)?.value ?? headerToken;
  if (!await verifyCustomerSessionToken(token)) redirect("/login");
}
