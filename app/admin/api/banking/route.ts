import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSessionToken } from "../../../../server/auth/admin-session";
import { validateMutationRequest } from "../../../../server/security/request";
import {
  decideSimulationExternalTransfer,
  decideSimulationDepositRequest,
  decideSimulationCustomerKyc,
  createSimulationStopCode,
  createFreshCustomerProfile,
  generateSimulationComplianceCode,
  generateSimulationStopCodeCredential,
  getSimulationBank,
  onboardSimulationStatement,
  postSimulationTransaction,
  reverseSimulationTransaction,
  resetSimulationCustomerPassword,
  saveSimulationDepositMethod,
  setSimulationTransferControl,
  updateSimulationCustomerAccountStatus,
  decideSimulationVirtualCard,
  saveSimulationBrand,
  activateSimulationBrand,
  saveSimulationProcessingFeeRule,
} from "../../../../server/d1/sim-bank";

function cookieValue(request: Request) {
  const rawCookie = request.headers.get("cookie") ?? "";
  return rawCookie.split(";").map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
}

export async function GET(request:Request) {
  if (!await verifyAdminSessionToken(cookieValue(request))) {
    return NextResponse.json({ error: "STAFF_AUTH_REQUIRED" }, { status: 401 });
  }
  try {
    return NextResponse.json(await getSimulationBank());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "BANKING_READ_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  if (!await verifyAdminSessionToken(cookieValue(request))) {
    return NextResponse.json({ error: "STAFF_AUTH_REQUIRED" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({})) as {
    action?: string;
    accountId?: string;
    direction?: "CREDIT" | "DEBIT";
    amountMinor?: number;
    targetBalanceMinor?: number;
    description?: string;
    effectiveAt?: string;
    transactionId?: string;
    reason?: string;
    requestId?: string;
    decision?: "APPROVE" | "REJECT" | "FLAG_REVIEW";
    userId?: string;
    externalMode?: "STANDARD_APPROVAL" | "COMPLIANCE_CODE";
    preferredStopCode?: string;
    code?: string;
    name?: string;
    customerMessage?: string;
    stopCode?: string;
    entries?: Array<{
      direction: "CREDIT" | "DEBIT";
      amountMinor: number;
      description: string;
      effectiveAt: string;
    }>;
    methodId?: string;
    methodType?: "BANK_TRANSFER" | "CRYPTO";
    label?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    routingNumber?: string;
    swiftBic?: string;
    cryptoAsset?: string;
    cryptoNetwork?: string;
    walletAddress?: string;
    instructions?: string;
    depositDecision?: "APPROVE" | "REJECT";
    firstName?: string;
    lastName?: string;
    email?: string;
    accountStatus?: "ACTIVE" | "INACTIVE" | "IN_REVIEW";
    temporaryPassword?: string;
    kycDecision?: "APPROVE" | "REJECT";
    customerVisible?: boolean;
    cardDecision?: "APPROVE"|"REJECT";
    brandId?:string;
    shortName?:string;
    supportEmail?:string;
    logoUrl?:string;
    primaryColor?:string;
    rail?:"INTERNAL"|"P2P"|"ACH"|"DOMESTIC_WIRE"|"INTERNATIONAL_WIRE";
    percentageBps?:number;
    fixedMinor?:number;
    minimumMinor?:number;
    maximumMinor?:number|null;
    active?:number;
  };
  try {
    if(body.action==="BRAND_SAVE")return NextResponse.json(await saveSimulationBrand({id:body.brandId,bankName:body.bankName??"",shortName:body.shortName??"",supportEmail:body.supportEmail??"",logoUrl:body.logoUrl,primaryColor:body.primaryColor??"#2855d9",updatedBy:"Sarah Okafor"}));
    if(body.action==="BRAND_ACTIVATE")return NextResponse.json(await activateSimulationBrand(body.brandId??"","Sarah Okafor"));
    if(body.action==="FEE_RULE_SAVE")return NextResponse.json(await saveSimulationProcessingFeeRule({rail:body.rail??"ACH",percentageBps:Number(body.percentageBps??0),fixedMinor:Number(body.fixedMinor??0),minimumMinor:Number(body.minimumMinor??0),maximumMinor:body.maximumMinor===null?null:Number(body.maximumMinor??0),active:Number(body.active??1),updatedBy:"Sarah Okafor"}));
    if(body.action==="VIRTUAL_CARD_DECISION")return NextResponse.json(await decideSimulationVirtualCard({requestId:body.requestId??"",decision:body.cardDecision??"REJECT",reason:body.reason??"",decidedBy:"Sarah Okafor"}));
    if (body.action === "CUSTOMER_STATUS_SET") {
      return NextResponse.json(await updateSimulationCustomerAccountStatus({
        userId:body.userId ?? "",
        status:body.accountStatus ?? "IN_REVIEW",
        reason:body.reason ?? "",
        updatedBy:"Sarah Okafor",
      }));
    }
    if (body.action === "CUSTOMER_PASSWORD_RESET") {
      return NextResponse.json(await resetSimulationCustomerPassword({
        userId:body.userId ?? "",
        temporaryPassword:body.temporaryPassword ?? "",
        reason:body.reason ?? "",
        changedBy:"Sarah Okafor",
      }));
    }
    if (body.action === "KYC_DECISION") {
      return NextResponse.json(await decideSimulationCustomerKyc({
        userId:body.userId ?? "",
        decision:body.kycDecision ?? "REJECT",
        reason:body.reason ?? "",
        decidedBy:"Sarah Okafor",
      }));
    }
    if (body.action === "CUSTOMER_CREATE") {
      return NextResponse.json(await createFreshCustomerProfile({
        firstName: body.firstName ?? "",
        lastName: body.lastName ?? "",
        email: body.email ?? "",
        source: "ADMIN",
        emailVerifiedAt: null,
      }));
    }
    if (body.action === "STATEMENT_ONBOARD") {
      return NextResponse.json(await onboardSimulationStatement({
        accountId: body.accountId ?? "",
        reason: body.reason ?? "",
        createdBy: "Sarah Okafor",
        entries: body.entries ?? [],
      }));
    }
    if (body.action === "DEPOSIT_METHOD_SAVE") {
      return NextResponse.json(await saveSimulationDepositMethod({
        id: body.methodId,
        userId: body.userId ?? "",
        methodType: body.methodType ?? "BANK_TRANSFER",
        label: body.label ?? "",
        bankName: body.bankName,
        accountName: body.accountName,
        accountNumber: body.accountNumber,
        routingNumber: body.routingNumber,
        swiftBic: body.swiftBic,
        cryptoAsset: body.cryptoAsset,
        cryptoNetwork: body.cryptoNetwork,
        walletAddress: body.walletAddress,
        instructions: body.instructions ?? "",
        updatedBy: "Sarah Okafor",
      }));
    }
    if (body.action === "DEPOSIT_REQUEST_DECIDE") {
      return NextResponse.json(await decideSimulationDepositRequest({
        requestId: body.requestId ?? "",
        decision: body.depositDecision ?? "REJECT",
        reason: body.reason ?? "",
        decidedBy: "Sarah Okafor",
      }));
    }
    if (body.action === "STOP_CODE_CREATE") {
      return NextResponse.json(await createSimulationStopCode({
        code: body.code ?? "",
        name: body.name ?? "",
        customerMessage: body.customerMessage ?? "",
      }));
    }
    if (body.action === "TRANSFER_CONTROL_SET") {
      return NextResponse.json(await setSimulationTransferControl({
        userId: body.userId ?? "",
        externalMode: body.externalMode ?? "STANDARD_APPROVAL",
        preferredStopCode: body.preferredStopCode,
      }));
    }
    if (body.action === "COMPLIANCE_CODE_GENERATE") {
      return NextResponse.json(await generateSimulationComplianceCode({
        requestId: body.requestId ?? "",
        generatedBy: "Sarah Okafor",
        reason: body.reason ?? "",
      }));
    }
    if (body.action === "STOP_CODE_CREDENTIAL_GENERATE") {
      return NextResponse.json(await generateSimulationStopCodeCredential({
        userId: body.userId ?? "",
        stopCode: body.stopCode ?? "",
        generatedBy: "Sarah Okafor",
        reason: body.reason ?? "",
      }));
    }
    if (body.action === "TRANSFER_DECISION") {
      return NextResponse.json(await decideSimulationExternalTransfer({
        requestId: body.requestId ?? "",
        decision: body.decision ?? "FLAG_REVIEW",
        reason: body.reason ?? "",
        decidedBy: "Sarah Okafor",
      }));
    }
    if (body.action === "REVERSE") {
      return NextResponse.json(await reverseSimulationTransaction(body.transactionId ?? "", body.reason ?? "Admin correction"));
    }
    return NextResponse.json(await postSimulationTransaction({
      accountId: body.accountId ?? "",
      direction: body.direction,
      amountMinor: body.amountMinor,
      targetBalanceMinor: body.targetBalanceMinor,
      description: body.description?.trim() || "Admin ledger entry",
      effectiveAt: body.effectiveAt || new Date().toISOString(),
      customerVisible: body.customerVisible,
    }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "TRANSACTION_FAILED" }, { status: 422 });
  }
}
