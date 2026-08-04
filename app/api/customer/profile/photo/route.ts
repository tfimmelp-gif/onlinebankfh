import { NextResponse } from "next/server";
import {
  getSimulationProfilePhoto,
  saveSimulationProfilePhoto,
} from "../../../../../server/d1/sim-bank";
import {
  CUSTOMER_COOKIE,
  readCustomerSessionToken,
  verifyCustomerSessionToken,
} from "../../../../../server/auth/customer-session";
import { validateMutationRequest } from "../../../../../server/security/request";

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
    return NextResponse.json(await getSimulationProfilePhoto(claims.userId), {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PROFILE_PHOTO_READ_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request,1_200_000);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const claims = await customerClaims(request);
  if (!claims) return NextResponse.json({ error: "CUSTOMER_AUTH_REQUIRED" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { profilePhotoDataUrl?: string };
  try {
    return NextResponse.json(await saveSimulationProfilePhoto(
      claims.userId,
      body.profilePhotoDataUrl ?? "",
    ));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PROFILE_PHOTO_SAVE_FAILED" },
      { status: 422 },
    );
  }
}
