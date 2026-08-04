import { NextResponse } from "next/server";
import {
  createSimulationBeneficiary,
  listSimulationBeneficiaries,
} from "../../../../server/d1/sim-bank";
import {
  CUSTOMER_COOKIE,
  readCustomerSessionToken,
  verifyCustomerSessionToken,
} from "../../../../server/auth/customer-session";
import { validateMutationRequest } from "../../../../server/security/request";

function cookieValue(request: Request) {
  const rawCookie = request.headers.get("cookie") ?? "";
  return rawCookie.split(";").map((item) => item.trim())
    .find((item) => item.startsWith(`${CUSTOMER_COOKIE}=`))
    ?.slice(CUSTOMER_COOKIE.length + 1);
}

async function customerClaims(request: Request) {
  const token = cookieValue(request);
  const claims = await readCustomerSessionToken(token);
  return claims && await verifyCustomerSessionToken(token) ? claims : null;
}

export async function GET(request: Request) {
  const claims = await customerClaims(request);
  if (!claims) return NextResponse.json({ error: "CUSTOMER_AUTH_REQUIRED" }, { status: 401 });
  try {
    return NextResponse.json({ beneficiaries: await listSimulationBeneficiaries(claims.userId) }, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "BENEFICIARY_READ_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const claims = await customerClaims(request);
  if (!claims) return NextResponse.json({ error: "CUSTOMER_AUTH_REQUIRED" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as Record<string, string>;
  try {
    return NextResponse.json(await createSimulationBeneficiary({
      userId: claims.userId,
      beneficiaryName: body.beneficiaryName ?? "",
      email: body.email ?? "",
      addressLine1: body.addressLine1 ?? "",
      addressLine2: body.addressLine2,
      city: body.city ?? "",
      stateRegion: body.stateRegion ?? "",
      postalCode: body.postalCode ?? "",
      countryCode: body.countryCode ?? "",
      paymentMethod: body.paymentMethod === "E_CURRENCY" ? "E_CURRENCY" : "BANK_ACCOUNT",
      accountNumber: body.accountNumber,
      routingNumber: body.routingNumber,
      eCurrencyAsset: body.eCurrencyAsset,
      eCurrencyNetwork: body.eCurrencyNetwork,
      walletIdentifier: body.walletIdentifier,
    }), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "BENEFICIARY_CREATE_FAILED" }, { status: 422 });
  }
}
