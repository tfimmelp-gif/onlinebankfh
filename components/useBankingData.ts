"use client";

import { useCallback, useEffect, useState } from "react";

export type BankingAccount = {
  id: string;
  userId: string;
  customerName: string;
  type: string;
  accountNumber: string;
  balanceMinor: number;
};

export type BankingCustomer = {
  userId:string;
  firstName:string;
  lastName:string;
  email:string;
  status:"PENDING"|"ACTIVE"|"SUSPENDED"|"BANNED";
  accountStatus:"ACTIVE"|"INACTIVE"|"IN_REVIEW";
  passwordResetRequired:number;
  emailVerifiedAt:string|null;
  createdSource:"CUSTOMER"|"ADMIN";
  requestedAccountType:"CHECKING"|"SAVINGS"|"INVESTMENT";
  dateOfBirth:string|null;
  phone:string|null;
  idType:string|null;
  idNumber:string|null;
  addressLine1:string|null;
  addressLine2:string|null;
  city:string|null;
  stateRegion:string|null;
  postalCode:string|null;
  countryCode:string|null;
  occupation:string|null;
  createdAt:string;
};

export type BankingTransaction = {
  id: string;
  reference: string;
  accountId: string;
  customerName: string;
  accountNumber: string;
  direction: "CREDIT" | "DEBIT";
  amountMinor: number;
  description: string;
  effectiveAt: string;
  createdAt: string;
  status: "POSTED" | "REVERSED";
  correctionOf: string | null;
};

export type BankingTransferRequest = {
  id: string;
  reference: string;
  userId: string;
  sourceAccountId: string;
  sourceAccountNumber: string;
  rail: "ACH" | "DOMESTIC_WIRE" | "INTERNATIONAL_WIRE";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  amountMinor: number;
  recipientName: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  swiftBic: string | null;
  recipientAddressLine1: string;
  recipientAddressLine2: string | null;
  recipientCity: string;
  recipientStateRegion: string;
  recipientPostalCode: string;
  recipientCountryCode: string;
  bankAddress: string;
  memo: string | null;
  requestedAt: string;
  scheduledFor: string;
  transferMode: "STANDARD_APPROVAL" | "COMPLIANCE_CODE";
  complianceStopCode: string | null;
  holdState: "AWAITING_CODE" | "REQUESTED" | "CODE_ISSUED" | "RELEASED" | null;
  codeHint: string | null;
  customerMessage: string | null;
};

export type BankingStopCode = {
  code: string;
  name: string;
  customerMessage: string;
  active: number;
  createdAt: string;
};

export type BankingTransferControl = {
  userId: string;
  externalMode: "STANDARD_APPROVAL" | "COMPLIANCE_CODE";
  preferredStopCode: string | null;
  updatedAt: string;
};

export type BankingDepositMethod = {
  id: string;
  userId: string;
  methodType: "BANK_TRANSFER" | "CRYPTO";
  label: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  swiftBic: string | null;
  cryptoAsset: string | null;
  cryptoNetwork: string | null;
  walletAddress: string | null;
  instructions: string;
  active: number;
  updatedAt: string;
};

export type BankingDepositRequest = {
  id: string;
  reference: string;
  userId: string;
  customerName: string;
  accountId: string;
  accountNumber: string;
  methodId: string;
  methodLabel: string;
  methodType: "BANK_TRANSFER" | "CRYPTO";
  amountMinor: number;
  senderReference: string;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  requestedAt: string;
  decidedAt: string | null;
  decisionReason: string | null;
};

export type BankingStatementBatch = {
  id: string;
  accountId: string;
  customerName: string;
  accountNumber: string;
  entryCount: number;
  netChangeMinor: number;
  reason: string;
  createdBy: string;
  createdAt: string;
};
export type BankingVirtualCardRequest={id:string;userId:string;customerName:string;fundingAccountId:string;fundingAccountNumber:string;displayName:string;monthlyLimitMinor:number;status:"PENDING"|"APPROVED"|"REJECTED";panLast4:string|null;expiryMonth:number|null;expiryYear:number|null;cvv:string|null;requestedAt:string;decidedBy:string|null;decidedAt:string|null;decisionReason:string|null};
export type BankingScheduledTransfer={id:string;reference:string;userId:string;sourceAccountId:string;sourceAccountNumber:string;destinationAccountId:string;destinationAccountNumber:string;destinationCustomerName:string;transferKind:"INTERNAL"|"P2P";amountMinor:number;description:string;scheduledFor:string;status:"SCHEDULED"|"COMPLETED"|"FAILED"|"CANCELLED";createdAt:string;completedAt:string|null;transactionReference:string|null};
export type BankingKycDocument={id:string;userId:string;customerName:string;documentType:string;originalFilename:string;mediaType:string;byteSize:number;objectKey:string;status:"UPLOADED"|"REVIEWED"|"REJECTED";uploadedAt:string;reviewedAt:string|null;reviewedBy:string|null};
export type BankingCustomerActivity={id:string;userId:string;customerName:string;actionType:string;summary:string;occurredAt:string;status:string};
export type BankingBrandProfile={id:string;bankName:string;shortName:string;supportEmail:string;logoUrl:string|null;primaryColor:string;active:number;updatedAt:string;updatedBy:string};
export type BankingProcessingFeeRule={rail:"INTERNAL"|"P2P"|"ACH"|"DOMESTIC_WIRE"|"INTERNATIONAL_WIRE";percentageBps:number;fixedMinor:number;minimumMinor:number;maximumMinor:number|null;active:number;updatedAt:string;updatedBy:string};
export type BankingAdminSettings={identity:{displayName:string;email:string;updatedAt:string;updatedBy:string};discordEnabled:boolean;discordConfigured:boolean;lastDeliveryAt:string|null;lastError:string|null;updatedAt:string};

const fallbackAccounts: BankingAccount[] = [
  { id: "acct-checking-1842", userId: "C-882104", customerName: "Alex Morgan", type: "CHECKING", accountNumber: "7730191842", balanceMinor: 2568040 },
  { id: "acct-savings-9081", userId: "C-882104", customerName: "Alex Morgan", type: "SAVINGS", accountNumber: "7730199081", balanceMinor: 7834022 },
  { id: "acct-checking-3321", userId: "C-882088", customerName: "Maya Chen", type: "CHECKING", accountNumber: "7730193321", balanceMinor: 0 },
  { id: "acct-checking-7730", userId: "C-881972", customerName: "Daniel Foster", type: "CHECKING", accountNumber: "7730197730", balanceMinor: 3280210 },
];

export function formatMoney(minor: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100);
}

export function useBankingData(mode: "admin" | "customer" = "admin") {
  const [customers,setCustomers]=useState<BankingCustomer[]>([]);
  const [accounts, setAccounts] = useState<BankingAccount[]>(mode === "admin" ? fallbackAccounts : []);
  const [transactions, setTransactions] = useState<BankingTransaction[]>([]);
  const [transferRequests, setTransferRequests] = useState<BankingTransferRequest[]>([]);
  const [stopCodes, setStopCodes] = useState<BankingStopCode[]>([]);
  const [transferControls, setTransferControls] = useState<BankingTransferControl[]>([]);
  const [depositMethods, setDepositMethods] = useState<BankingDepositMethod[]>([]);
  const [depositRequests, setDepositRequests] = useState<BankingDepositRequest[]>([]);
  const [statementBatches, setStatementBatches] = useState<BankingStatementBatch[]>([]);
  const [virtualCardRequests,setVirtualCardRequests]=useState<BankingVirtualCardRequest[]>([]);
  const [scheduledTransfers,setScheduledTransfers]=useState<BankingScheduledTransfer[]>([]);
  const [kycDocuments,setKycDocuments]=useState<BankingKycDocument[]>([]);
  const [customerActivity,setCustomerActivity]=useState<BankingCustomerActivity[]>([]);
  const [brandProfiles,setBrandProfiles]=useState<BankingBrandProfile[]>([]);
  const [processingFeeRules,setProcessingFeeRules]=useState<BankingProcessingFeeRule[]>([]);
  const [adminSettings,setAdminSettings]=useState<BankingAdminSettings|null>(null);
  const [loading, setLoading] = useState(true);
  const [error,setError]=useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(mode === "customer" ? "/api/customer/banking" : "/admin/api/banking", { cache: "no-store" });
      if (!response.ok) {
        const failure=await response.json().catch(()=>({error:"BANKING_READ_FAILED"})) as {error?:string};
        setError(failure.error??"BANKING_READ_FAILED");
        return;
      }
      const data = await response.json() as {
        customers?: BankingCustomer[];
        accounts: BankingAccount[];
        transactions: BankingTransaction[];
        transferRequests?: BankingTransferRequest[];
        stopCodes?: BankingStopCode[];
        transferControls?: BankingTransferControl[];
        depositMethods?: BankingDepositMethod[];
        depositRequests?: BankingDepositRequest[];
        statementBatches?: BankingStatementBatch[];
        virtualCardRequests?: BankingVirtualCardRequest[];
        scheduledTransfers?: BankingScheduledTransfer[];
        kycDocuments?:BankingKycDocument[];
        customerActivity?:BankingCustomerActivity[];
        brandProfiles?:BankingBrandProfile[];
        processingFeeRules?:BankingProcessingFeeRule[];
        adminSettings?:BankingAdminSettings;
      };
      setCustomers(data.customers??[]);
      setAccounts(data.accounts);
      setTransactions(data.transactions);
      setTransferRequests(data.transferRequests ?? []);
      setStopCodes(data.stopCodes ?? []);
      setTransferControls(data.transferControls ?? []);
      setDepositMethods(data.depositMethods ?? []);
      setDepositRequests(data.depositRequests ?? []);
      setStatementBatches(data.statementBatches ?? []);
      setVirtualCardRequests(data.virtualCardRequests??[]);
      setScheduledTransfers(data.scheduledTransfers??[]);
      setKycDocuments(data.kycDocuments??[]);
      setCustomerActivity(data.customerActivity??[]);
      setBrandProfiles(data.brandProfiles??[]);
      setProcessingFeeRules(data.processingFeeRules??[]);
      setAdminSettings(data.adminSettings??null);
      setError("");
    } catch {
      setError("BANKING_READ_FAILED");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    const initialRefresh=window.setTimeout(() => void refresh(),0);
    const channel = new BroadcastChannel("northstar-banking");
    channel.onmessage = () => refresh();
    const refreshTimer = window.setInterval(() => {
      if(document.visibilityState==="visible")void refresh();
    }, mode === "admin" ? 5_000 : 30_000);
    return () => {
      window.clearTimeout(initialRefresh);
      channel.close();
      window.clearInterval(refreshTimer);
    };
  }, [mode, refresh]);

  const mutate = useCallback(async (payload: Record<string, unknown>) => {
    const response = await fetch("/admin/api/banking", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json() as {
      error?: string;
      id?: string;
      reference?: string;
      generatedCode?: string;
      codeHint?: string;
      externalMode?: BankingTransferControl["externalMode"];
      preferredStopCode?: string | null;
      userId?: string;
      accountCreated?: boolean;
      passwordResetRequired?: boolean;
      sessionsRevoked?:boolean;
    };
    if (!response.ok) throw new Error(result.error ?? "TRANSACTION_FAILED");
    await refresh();
    const channel = new BroadcastChannel("northstar-banking");
    channel.postMessage({ updated: true });
    channel.close();
    return result;
  }, [refresh]);

  const transfer = useCallback(async (payload: {
    sourceAccountId: string;
    destinationAccountId?: string;
    amountMinor: number;
    description: string;
    effectiveAt: string;
    rail?: BankingTransferRequest["rail"];
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
    scheduledFor?: string;
    idempotencyKey?: string;
  }) => {
    const response = await fetch("/api/customer/transfers", {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key":payload.idempotencyKey??crypto.randomUUID() },
      body: JSON.stringify(payload),
    });
    const result = await response.json() as {
      error?: string;
      id?: string;
      reference?: string;
      status?: BankingTransferRequest["status"] | "SCHEDULED";
      requestedAt?: string;
      transferMode?: BankingTransferControl["externalMode"];
      complianceRequired?: boolean;
      customerMessage?: string | null;
      scheduledFor?: string;
    };
    if (!response.ok) throw new Error(result.error ?? "TRANSFER_FAILED");
    await refresh();
    const channel = new BroadcastChannel("northstar-banking");
    channel.postMessage({ updated: true });
    channel.close();
    return result;
  }, [refresh]);

  const complianceAction = useCallback(async (payload: {
    action: "REQUEST_COMPLIANCE_CODE" | "SUBMIT_COMPLIANCE_CODE";
    requestId: string;
    complianceCode?: string;
  }) => {
    const response = await fetch("/api/customer/transfers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json() as {
      error?: string;
      reference?: string;
      status?: BankingTransferRequest["status"];
      holdState?: BankingTransferRequest["holdState"];
    };
    if (!response.ok) throw new Error(result.error ?? "COMPLIANCE_ACTION_FAILED");
    await refresh();
    const channel = new BroadcastChannel("northstar-banking");
    channel.postMessage({ updated: true });
    channel.close();
    return result;
  }, [refresh]);

  return {
    error,
    customers,
    accounts,
    transactions,
    transferRequests,
    stopCodes,
    transferControls,
    depositMethods,
    depositRequests,
    statementBatches,
    virtualCardRequests,
    scheduledTransfers,
    kycDocuments,
    customerActivity,
    brandProfiles,
    processingFeeRules,
    adminSettings,
    loading,
    refresh,
    mutate,
    transfer,
    complianceAction,
  };
}
