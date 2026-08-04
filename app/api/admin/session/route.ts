import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSessionToken, verifyAdminMfaCode, verifyAdminSessionToken } from "../../../../server/auth/admin-session";
import { consumeSimulationRateLimit } from "../../../../server/d1/sim-bank";
import { observedRequestIp, validateMutationRequest } from "../../../../server/security/request";

export async function GET(request: Request) {
  const rawCookie = request.headers.get("cookie") ?? "";
  const token = rawCookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
  return NextResponse.json({ authenticated: await verifyAdminSessionToken(token) });
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request,32_768);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string; otp?: string };
  try { await consumeSimulationRateLimit({scope:"ADMIN_LOGIN",key:observedRequestIp(request),limit:8,windowSeconds:900}); }
  catch { return NextResponse.json({error:"Too many sign-in attempts. Try again later."},{status:429}); }
  const expectedEmail = process.env.ADMIN_EMAIL ?? (process.env.NODE_ENV==="production"?null:"operations@northstar.test");
  const expectedPassword = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV==="production"?null:"Northstar!2026");

  if(!expectedEmail||!expectedPassword){
    return NextResponse.json({error:"STAFF_AUTH_NOT_CONFIGURED"},{status:503});
  }

  let validMfa=false;
  try { validMfa=await verifyAdminMfaCode(body.otp); }
  catch { return NextResponse.json({error:"STAFF_AUTH_NOT_CONFIGURED"},{status:503}); }

  if (
    body.email?.toLowerCase() !== expectedEmail.toLowerCase() ||
    body.password !== expectedPassword ||
    !validMfa
  ) {
    return NextResponse.json({ error: "Invalid staff credentials or verification code." }, { status: 401 });
  }

  const token = await createAdminSessionToken(expectedEmail);
  const response = NextResponse.json({ ok: true });
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const secureRequest = forwardedProtocol === "https" || new URL(request.url).protocol === "https:";
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: secureRequest,
    path: "/admin",
    maxAge: 8 * 60 * 60,
  });
  return response;
}

export async function DELETE(request: Request) {
  const guard=validateMutationRequest(request,16_384);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const response = NextResponse.json({ ok: true });
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const secureRequest = forwardedProtocol === "https" || new URL(request.url).protocol === "https:";
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: secureRequest,
    path: "/admin",
    maxAge: 0,
  });
  return response;
}
