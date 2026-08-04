import { NextResponse } from "next/server";
import {
  createSimulationExternalTransfer,
  postSimulationTransfer,
  scheduleSimulationTransfer,
  requestSimulationComplianceCode,
  submitSimulationComplianceCode,
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

export async function POST(request: Request) {
  const guard=validateMutationRequest(request);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const token = cookieValue(request);
  const claims = await readCustomerSessionToken(token);
  if (!claims || !await verifyCustomerSessionToken(token)) {
    return NextResponse.json({ error: "CUSTOMER_AUTH_REQUIRED" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({})) as {
    sourceAccountId?: string;
    destinationAccountId?: string;
    amountMinor?: number;
    description?: string;
    effectiveAt?: string;
    rail?: "ACH" | "DOMESTIC_WIRE" | "INTERNATIONAL_WIRE";
    recipientName?: string;
    bankName?: string;
    routingNumber?: string;
    accountNumber?: string;
    swiftBic?: string;
    recipientAddressLine1?: string;
    recipientAddressLine2?: string;
    recipientCity?: string;
    recipientStateRegion?: string;
    recipientPostalCode?: string;
    recipientCountryCode?: string;
    bankAddress?: string;
    action?: "REQUEST_COMPLIANCE_CODE" | "SUBMIT_COMPLIANCE_CODE";
    requestId?: string;
    complianceCode?: string;
    scheduledFor?: string;
  };
  const idempotencyKey=request.headers.get("idempotency-key")?.trim()||crypto.randomUUID();
  if(!/^[A-Za-z0-9._:-]{8,200}$/.test(idempotencyKey))return NextResponse.json({error:"IDEMPOTENCY_KEY_INVALID"},{status:422});
  try {
    if (body.action === "REQUEST_COMPLIANCE_CODE") {
      return NextResponse.json(await requestSimulationComplianceCode(
        body.requestId ?? "",
        claims.userId,
      ));
    }
    if (body.action === "SUBMIT_COMPLIANCE_CODE") {
      return NextResponse.json(await submitSimulationComplianceCode({
        requestId: body.requestId ?? "",
        userId: claims.userId,
        complianceCode: body.complianceCode ?? "",
      }));
    }
    if (body.rail) {
      const requestedSchedule = body.scheduledFor ? new Date(body.scheduledFor) : new Date();
      if (Number.isNaN(requestedSchedule.getTime()) || requestedSchedule.getTime() < Date.now() - 60_000) {
        return NextResponse.json({error:"TRANSFER_SCHEDULE_INVALID"},{status:422});
      }
      return NextResponse.json(await createSimulationExternalTransfer({
        userId: claims.userId,
        sourceAccountId: body.sourceAccountId ?? "",
        rail: body.rail,
        amountMinor: Number(body.amountMinor ?? 0),
        recipientName: body.recipientName ?? "",
        bankName: body.bankName ?? "",
        routingNumber: body.routingNumber ?? "",
        accountNumber: body.accountNumber ?? "",
        swiftBic: body.swiftBic,
        recipientAddressLine1: body.recipientAddressLine1 ?? "",
        recipientAddressLine2: body.recipientAddressLine2,
        recipientCity: body.recipientCity ?? "",
        recipientStateRegion: body.recipientStateRegion ?? "",
        recipientPostalCode: body.recipientPostalCode ?? "",
        recipientCountryCode: body.recipientCountryCode ?? "",
        bankAddress: body.bankAddress ?? "",
        memo: body.description,
        // Customer transfers are timestamped by the server. Never trust a
        // browser-supplied timestamp for the ledger or transfer timeline.
        scheduledFor: requestedSchedule.toISOString(),
        idempotencyKey,
      }));
    }
    if (body.scheduledFor) {
      const scheduled = new Date(body.scheduledFor);
      if (Number.isNaN(scheduled.getTime()) || scheduled.getTime() <= Date.now() + 30_000) {
        return NextResponse.json({error:"TRANSFER_SCHEDULE_MUST_BE_FUTURE"},{status:422});
      }
      return NextResponse.json(await scheduleSimulationTransfer({
        userId:claims.userId,
        sourceAccountId:body.sourceAccountId??"",
        destinationAccountId:body.destinationAccountId??"",
        amountMinor:Number(body.amountMinor??0),
        description:body.description??"Scheduled transfer",
        scheduledFor:scheduled.toISOString(),
        idempotencyKey,
      }));
    }
    return NextResponse.json(await postSimulationTransfer({
      userId: claims.userId,
      sourceAccountId: body.sourceAccountId ?? "",
      destinationAccountId: body.destinationAccountId ?? "",
      amountMinor: Number(body.amountMinor ?? 0),
      description: body.description ?? "Internal account transfer",
      effectiveAt: new Date().toISOString(),
      idempotencyKey,
    }));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "TRANSFER_FAILED" },
      { status: 422 },
    );
  }
}
