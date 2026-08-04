import { NextResponse } from "next/server";
import {
  createFreshCustomerProfile,
  consumeSimulationRateLimit,
  queueSimulationEmailAlert,
  requestCustomerEmailOtp,
  verifyCustomerEmailOtp,
} from "../../../../server/d1/sim-bank";
import { observedRequestIp, validateMutationRequest } from "../../../../server/security/request";

export async function POST(request: Request) {
  const guard=validateMutationRequest(request);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const body = await request.json().catch(() => ({})) as {
    action?: "REQUEST_VERIFICATION" | "VERIFY_EMAIL";
    challengeId?: string;
    code?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: string;
    phone?: string;
    idType?: string;
  };
  if (body.action === "VERIFY_EMAIL") {
    try {
      const verified = await verifyCustomerEmailOtp({
        challengeId: body.challengeId ?? "",
        purpose: "SIGNUP",
        code: body.code ?? "",
      });
      const firstName = String(verified.payload.firstName ?? "");
      const lastName = String(verified.payload.lastName ?? "");
      const profile = await createFreshCustomerProfile({
        firstName,
        lastName,
        email: verified.email,
        source: "CUSTOMER",
        emailVerifiedAt: verified.verifiedAt,
      });
      const reference = `KYC-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${profile.userId.slice(-6)}`;
      await queueSimulationEmailAlert({
        userId: profile.userId,
        email: profile.email,
        eventType: "SIGNUP",
        subject: `Northstar application ${reference} received`,
        body: `Hello ${profile.firstName}, your verified account application has been received for manual review. We will notify you when the review is complete.`,
      });
      return NextResponse.json({
        userId: profile.userId,
        applicationId: profile.userId,
        reference,
        status: "SUBMITTED",
        freshProfile: true,
        accountCount: 0,
        transactionCount: 0,
        balanceMinor: 0,
      });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "EMAIL_VERIFICATION_FAILED" }, { status: 422 });
    }
  }
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "APPLICATION_DETAILS_INVALID" }, { status: 422 });
  }

  try {
    await consumeSimulationRateLimit({scope:"CUSTOMER_SIGNUP",key:`${observedRequestIp(request)}:${email}`,limit:5,windowSeconds:3600});
    const challenge = await requestCustomerEmailOtp({
      purpose: "SIGNUP",
      email,
      payload: {
        firstName,
        lastName,
        dateOfBirth: body.dateOfBirth ?? "",
        phone: body.phone ?? "",
        idType: body.idType ?? "",
      },
    });
    return NextResponse.json({ ...challenge, status: "EMAIL_VERIFICATION_REQUIRED" });
  } catch (error) {
    const code=error instanceof Error?error.message:"EMAIL_VERIFICATION_REQUEST_FAILED";
    return NextResponse.json({error:code},{status:code==="RATE_LIMIT_EXCEEDED"?429:422});
  }
}
