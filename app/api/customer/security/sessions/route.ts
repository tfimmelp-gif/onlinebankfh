import { NextResponse } from "next/server";
import {
  CUSTOMER_COOKIE,
  readCustomerSessionToken,
  verifyCustomerSessionToken,
} from "../../../../../server/auth/customer-session";
import {
  listSimulationCustomerSessions,
  revokeSimulationCustomerSession,
} from "../../../../../server/d1/sim-bank";
import { validateMutationRequest } from "../../../../../server/security/request";

function cookieValue(request: Request) {
  const rawCookie = request.headers.get("cookie") ?? "";
  return rawCookie.split(";").map((item) => item.trim())
    .find((item) => item.startsWith(`${CUSTOMER_COOKIE}=`))
    ?.slice(CUSTOMER_COOKIE.length + 1);
}

async function claims(request: Request) {
  const token = cookieValue(request);
  if (!await verifyCustomerSessionToken(token)) return null;
  return readCustomerSessionToken(token);
}

export async function GET(request: Request) {
  const session = await claims(request);
  if (!session) return NextResponse.json({ error: "CUSTOMER_AUTH_REQUIRED" }, { status: 401 });
  return NextResponse.json({
    sessions: await listSimulationCustomerSessions(session.userId, session.sessionId),
  }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request,32_768);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const session = await claims(request);
  if (!session) return NextResponse.json({ error: "CUSTOMER_AUTH_REQUIRED" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { sessionId?: string };
  if (!body.sessionId || body.sessionId === session.sessionId) {
    return NextResponse.json({ error: "SESSION_REVOKE_INVALID" }, { status: 422 });
  }
  try {
    return NextResponse.json(await revokeSimulationCustomerSession(session.userId, body.sessionId));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "SESSION_REVOKE_FAILED" }, { status: 422 });
  }
}
