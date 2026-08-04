import { NextResponse } from "next/server";
import {
  CUSTOMER_COOKIE,
  readCustomerSessionToken,
  verifyCustomerSessionToken,
} from "../../../../server/auth/customer-session";
import { getSimulationCustomerBank } from "../../../../server/d1/sim-bank";

function cookieValue(request: Request) {
  const rawCookie = request.headers.get("cookie") ?? "";
  return rawCookie.split(";").map((item) => item.trim())
    .find((item) => item.startsWith(`${CUSTOMER_COOKIE}=`))
    ?.slice(CUSTOMER_COOKIE.length + 1);
}

export async function GET(request: Request) {
  const token = cookieValue(request);
  const claims = await readCustomerSessionToken(token);
  if (!claims || !await verifyCustomerSessionToken(token)) {
    return NextResponse.json({ error: "CUSTOMER_AUTH_REQUIRED" }, { status: 401 });
  }
  return NextResponse.json(await getSimulationCustomerBank(claims.userId), {
    headers: { "cache-control": "no-store" },
  });
}
