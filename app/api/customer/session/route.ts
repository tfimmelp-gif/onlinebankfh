import { NextResponse } from "next/server";
import {
  CUSTOMER_COOKIE,
  createCustomerSessionToken,
  readCustomerSessionToken,
  verifyCustomerSessionToken,
} from "../../../../server/auth/customer-session";
import {
  authenticateSimulationCustomer,
  changeSimulationCustomerPassword,
  completeCustomerPasswordReset,
  consumeSimulationRateLimit,
  recordSimulationCustomerSession,
  queueSimulationEmailAlert,
  requestCustomerEmailOtp,
  requestCustomerPasswordResetOtp,
  revokeSimulationCustomerSession,
  verifyCustomerEmailOtp,
  getSimulationCustomerBank,
} from "../../../../server/d1/sim-bank";
import { observedRequestIp, validateMutationRequest } from "../../../../server/security/request";

function cookieValue(request: Request) {
  const rawCookie = request.headers.get("cookie") ?? "";
  return rawCookie.split(";").map((item) => item.trim())
    .find((item) => item.startsWith(`${CUSTOMER_COOKIE}=`))
    ?.slice(CUSTOMER_COOKIE.length + 1);
}

function observedIp(request: Request) {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "Unavailable";
}

function deviceDetails(userAgent: string) {
  const browserMatch = userAgent.match(/(?:Edg|EdgiOS)\/([\d.]+)/i)
    ?? userAgent.match(/OPR\/([\d.]+)/i)
    ?? userAgent.match(/(?:Chrome|CriOS)\/([\d.]+)/i)
    ?? userAgent.match(/(?:Firefox|FxiOS)\/([\d.]+)/i)
    ?? userAgent.match(/Version\/([\d.]+).*Safari\//i);
  const browserFamily = /Edg|EdgiOS/i.test(userAgent) ? "Microsoft Edge"
    : /OPR\//i.test(userAgent) ? "Opera"
      : /Chrome|CriOS/i.test(userAgent) ? "Google Chrome"
        : /Firefox|FxiOS/i.test(userAgent) ? "Mozilla Firefox"
          : /Version\/[\d.]+.*Safari\//i.test(userAgent) ? "Safari"
            : "Unknown browser";
  const browserName = browserMatch ? `${browserFamily} ${browserMatch[1]}` : browserFamily;
  const androidVersion = userAgent.match(/Android ([\d.]+)/i)?.[1];
  const appleVersion = userAgent.match(/(?:CPU (?:iPhone )?OS|CPU OS|Mac OS X) ([\d_]+)/i)?.[1]?.replaceAll("_",".");
  const operatingSystem = /Windows NT 10/i.test(userAgent) ? "Windows 10/11"
    : androidVersion ? `Android ${androidVersion}`
      : /iPhone|iPad|iPod/i.test(userAgent) ? `iOS/iPadOS${appleVersion?` ${appleVersion}`:""}`
        : /Mac OS X/i.test(userAgent) ? `macOS${appleVersion?` ${appleVersion}`:""}`
          : /Linux/i.test(userAgent) ? "Linux"
            : "Unknown operating system";
  const deviceType = /iPad|Tablet/i.test(userAgent) ? "Tablet"
    : /Mobi|Android|iPhone|iPod/i.test(userAgent) ? "Mobile"
      : "Desktop";
  return { browserName, operatingSystem, deviceType };
}

export async function GET(request: Request) {
  const token = cookieValue(request);
  const claims = await readCustomerSessionToken(token);
  if (!claims || !await verifyCustomerSessionToken(token)) {
    return NextResponse.json({ authenticated: false });
  }
  const customer = (await getSimulationCustomerBank(claims.userId)).customers[0];
  return NextResponse.json({ authenticated: true, userId: claims.userId, email: claims.email,
    firstName: customer?.firstName ?? "Customer", lastName: customer?.lastName ?? "",
    accountStatus: customer?.accountStatus ?? "IN_REVIEW",
    passwordResetRequired: Boolean(customer?.passwordResetRequired),
  }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const body = await request.json().catch(() => ({})) as {
    action?: "REQUEST_OTP" | "VERIFY_OTP" | "CHANGE_PASSWORD" | "REQUEST_PASSWORD_RESET" | "COMPLETE_PASSWORD_RESET";
    email?: string;
    password?: string;
    challengeId?: string;
    code?: string;
    currentPassword?: string;
    newPassword?: string;
    rememberMe?: boolean;
  };
  if (body.action === "CHANGE_PASSWORD") {
    const claims = await readCustomerSessionToken(cookieValue(request));
    if (!claims || !await verifyCustomerSessionToken(cookieValue(request))) {
      return NextResponse.json({ error:"CUSTOMER_AUTH_REQUIRED" },{ status:401 });
    }
    try {
      return NextResponse.json(await changeSimulationCustomerPassword({
        userId:claims.userId,
        currentSessionId:claims.sessionId,
        currentPassword:body.currentPassword ?? "",
        newPassword:body.newPassword ?? "",
      }));
    } catch (error) {
      return NextResponse.json({ error:error instanceof Error?error.message:"PASSWORD_CHANGE_FAILED" },{ status:422 });
    }
  }
  if (body.action === "REQUEST_PASSWORD_RESET") {
    try {
      await consumeSimulationRateLimit({scope:"PASSWORD_RESET",key:`${observedRequestIp(request)}:${body.email??""}`,limit:5,windowSeconds:3600});
      const challenge = await requestCustomerPasswordResetOtp(body.email ?? "");
      return NextResponse.json({ ...challenge, status:"RESET_CODE_SENT" });
    } catch (error) {
      const code=error instanceof Error?error.message:"PASSWORD_RESET_REQUEST_FAILED";
      return NextResponse.json({error:code},{status:code==="RATE_LIMIT_EXCEEDED"?429:422});
    }
  }
  if (body.action === "COMPLETE_PASSWORD_RESET") {
    try {
      return NextResponse.json(await completeCustomerPasswordReset({
        challengeId:body.challengeId ?? "",
        code:body.code ?? "",
        newPassword:body.newPassword ?? "",
      }));
    } catch (error) {
      return NextResponse.json({ error:error instanceof Error?error.message:"PASSWORD_RESET_FAILED" },{ status:422 });
    }
  }
  if (body.action !== "VERIFY_OTP") {
    try {
      await consumeSimulationRateLimit({scope:"CUSTOMER_LOGIN",key:`${observedRequestIp(request)}:${body.email??""}`,limit:10,windowSeconds:900});
      const customer = await authenticateSimulationCustomer(body.email ?? "", body.password ?? "");
      const challenge = await requestCustomerEmailOtp({
        purpose: "LOGIN",
        email: customer.email,
        userId: customer.userId,
        payload: { passwordResetRequired:customer.passwordResetRequired, rememberMe:Boolean(body.rememberMe) },
      });
      return NextResponse.json({ ...challenge, status: "OTP_REQUIRED" });
    } catch (error) {
      const code = error instanceof Error ? error.message : "LOGIN_OTP_REQUEST_FAILED";
      const status = code === "INVALID_CUSTOMER_CREDENTIALS" ? 401 : code === "RATE_LIMIT_EXCEEDED" ? 429 : 422;
      return NextResponse.json({ error: code }, { status });
    }
  }

  let verified;
  try {
    verified = await verifyCustomerEmailOtp({
      challengeId: body.challengeId ?? "",
      purpose: "LOGIN",
      code: body.code ?? "",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "LOGIN_OTP_INVALID" }, { status: 422 });
  }
  if (!verified.userId) {
    return NextResponse.json({ error: "LOGIN_OTP_INVALID" }, { status: 401 });
  }

  const session = await createCustomerSessionToken(verified.email, verified.userId, verified.payload.rememberMe === true);
  const userAgent = request.headers.get("user-agent") ?? "Unavailable";
  const details = deviceDetails(userAgent);
  const now = new Date().toISOString();
  await recordSimulationCustomerSession({
    sessionId: session.sessionId,
    userId: verified.userId,
    email: verified.email,
    ipAddress: observedIp(request),
    userAgent,
    ...details,
    createdAt: now,
    lastSeenAt: now,
    expiresAt: new Date(session.expiresAt).toISOString(),
    revokedAt: null,
  });
  await queueSimulationEmailAlert({
    userId: verified.userId,
    email: verified.email,
    eventType: "LOGIN",
    subject: "New Northstar online banking login",
    body: `A login to your customer portal was recorded from ${details.browserName} on ${details.operatingSystem} at ${now}. Observed IP: ${observedIp(request)}.`,
  });
  const response = NextResponse.json({
    ok: true,
    passwordResetRequired:Boolean(verified.payload.passwordResetRequired),
  });
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const secureRequest = forwardedProtocol === "https" || new URL(request.url).protocol === "https:";
  response.cookies.set(CUSTOMER_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "strict",
    secure: secureRequest,
    path: "/",
    maxAge: session.maxAgeSeconds,
  });
  return response;
}

export async function DELETE(request: Request) {
  const guard=validateMutationRequest(request,16_384);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const claims = await readCustomerSessionToken(cookieValue(request));
  if (claims) await revokeSimulationCustomerSession(claims.userId, claims.sessionId).catch(()=>undefined);
  const response = NextResponse.json({ ok: true });
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const secureRequest = forwardedProtocol === "https" || new URL(request.url).protocol === "https:";
  response.cookies.set(CUSTOMER_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: secureRequest,
    path: "/",
    maxAge: 0,
  });
  return response;
}
