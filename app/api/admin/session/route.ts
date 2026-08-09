import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSessionToken, verifyAdminMfaCode, verifyAdminSessionToken } from "../../../../server/auth/admin-session";
import { authenticateSimulationAdmin, consumeSimulationRateLimit } from "../../../../server/d1/sim-bank";
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
  catch (error) {
    if(error instanceof Error&&error.message==="RATE_LIMIT_EXCEEDED"){
      return NextResponse.json({error:"Too many sign-in attempts. Try again later."},{status:429});
    }
    console.error("Admin sign-in rate limiter unavailable",error);
    return NextResponse.json({error:"SIGN_IN_SECURITY_SERVICE_UNAVAILABLE"},{status:503});
  }
  let validMfa=false;
  try { validMfa=await verifyAdminMfaCode(body.otp); }
  catch { return NextResponse.json({error:"STAFF_AUTH_NOT_CONFIGURED"},{status:503}); }
  const identity=await authenticateSimulationAdmin(body.email??"",body.password??"");
  if (!identity||!validMfa) {
    return NextResponse.json({ error: "Invalid staff credentials or verification code." }, { status: 401 });
  }

  const token = await createAdminSessionToken(identity.email);
  const response = NextResponse.json({ ok: true,displayName:identity.displayName });
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
