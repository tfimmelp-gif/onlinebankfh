import { NextResponse } from "next/server";
import {
  CUSTOMER_COOKIE,
  readCustomerSessionToken,
  verifyCustomerSessionToken,
} from "../../../../server/auth/customer-session";
import {
  createSimulationDepositRequest,
  getSimulationCustomerDeposits,
} from "../../../../server/d1/sim-bank";
import { validateMutationRequest } from "../../../../server/security/request";

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
  return NextResponse.json(await getSimulationCustomerDeposits(session.userId), {
    headers: { "cache-control": "no-store" },
  });
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const session = await claims(request);
  if (!session) return NextResponse.json({ error: "CUSTOMER_AUTH_REQUIRED" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as {
    accountId?: string;
    methodId?: string;
    amountMinor?: number;
    senderReference?: string;
  };
  try {
    return NextResponse.json(await createSimulationDepositRequest({
      userId: session.userId,
      accountId: body.accountId ?? "",
      methodId: body.methodId ?? "",
      amountMinor: Number(body.amountMinor ?? 0),
      senderReference: body.senderReference ?? "",
    }));
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "DEPOSIT_REQUEST_FAILED",
    }, { status: 422 });
  }
}
