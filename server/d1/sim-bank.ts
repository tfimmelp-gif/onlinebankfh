import { database } from "../runtime/database";

export type SimAccount = {
  id: string;
  userId: string;
  customerName: string;
  type: string;
  accountNumber: string;
  balanceMinor: number;
};

export type SimTransaction = {
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

export type SimTransferRequest = {
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

export type SimStopCodeDefinition = {
  code: string;
  name: string;
  customerMessage: string;
  active: number;
  createdAt: string;
};

export type SimTransferControl = {
  userId: string;
  externalMode: "STANDARD_APPROVAL" | "COMPLIANCE_CODE";
  preferredStopCode: string | null;
  updatedAt: string;
};

export type SimCustomerProfilePhoto = {
  userId: string;
  profilePhotoDataUrl: string | null;
  updatedAt: string;
};

export type SimBeneficiary = {
  id: string;
  userId: string;
  beneficiaryName: string;
  email: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateRegion: string;
  postalCode: string;
  countryCode: string;
  paymentMethod: "BANK_ACCOUNT" | "E_CURRENCY";
  accountNumber: string | null;
  routingNumber: string | null;
  eCurrencyAsset: string | null;
  eCurrencyNetwork: string | null;
  walletIdentifier: string | null;
  createdAt: string;
};

export type SimLiveChatMessage = {
  id: string;
  conversationId: string;
  senderKind: "CUSTOMER" | "STAFF" | "SYSTEM";
  senderName: string;
  body: string;
  createdAt: string;
};

export type SimCustomerLoginSession = {
  sessionId: string;
  userId: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  browserName: string;
  operatingSystem: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  revokedAt: string | null;
};

export type SimCustomerDirectoryEntry = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";
  accountStatus: "ACTIVE" | "INACTIVE" | "IN_REVIEW";
  passwordResetRequired: number;
  emailVerifiedAt: string | null;
  createdSource: "CUSTOMER" | "ADMIN";
  createdAt: string;
};

export type SimDepositMethod = {
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

export type SimDepositRequest = {
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

export type SimVirtualCardRequest = {
  id:string; userId:string; customerName:string; fundingAccountId:string;
  fundingAccountNumber:string; displayName:string; monthlyLimitMinor:number;
  status:"PENDING"|"APPROVED"|"REJECTED"; panLast4:string|null;
  expiryMonth:number|null; expiryYear:number|null; cvv:string|null;
  requestedAt:string; decidedBy:string|null; decidedAt:string|null; decisionReason:string|null;
};

export type SimScheduledTransfer = {
  id:string; reference:string; userId:string; sourceAccountId:string;
  sourceAccountNumber:string; destinationAccountId:string;
  destinationAccountNumber:string; destinationCustomerName:string;
  transferKind:"INTERNAL"|"P2P"; amountMinor:number; description:string;
  scheduledFor:string; status:"SCHEDULED"|"COMPLETED"|"FAILED"|"CANCELLED";
  createdAt:string; completedAt:string|null; transactionReference:string|null;
};

export type SimKycDocument={id:string;userId:string;customerName:string;documentType:string;originalFilename:string;mediaType:string;byteSize:number;objectKey:string;status:"UPLOADED"|"REVIEWED"|"REJECTED";uploadedAt:string;reviewedAt:string|null;reviewedBy:string|null};
export type SimCustomerActivity={id:string;userId:string;customerName:string;actionType:string;summary:string;occurredAt:string;status:string};
export type SimBrandProfile={id:string;bankName:string;shortName:string;supportEmail:string;logoUrl:string|null;primaryColor:string;active:number;updatedAt:string;updatedBy:string};
export type SimProcessingFeeRule={rail:"INTERNAL"|"P2P"|"ACH"|"DOMESTIC_WIRE"|"INTERNATIONAL_WIRE";percentageBps:number;fixedMinor:number;minimumMinor:number;maximumMinor:number|null;active:number;updatedAt:string;updatedBy:string};

export type SimWebsiteContent = {
  heroHeading: string;
  heroMessage: string;
  simulationBanner: string;
  supportEmail: string;
  showChecking: boolean;
  showSavings: boolean;
  showLoans: boolean;
  maintenanceMode: boolean;
};

export type SimWebsiteRevision = {
  id: string;
  revisionNumber: number;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  content: SimWebsiteContent;
  changeReason: string;
  createdBy: string;
  scheduledFor: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export const DEFAULT_SIM_WEBSITE_CONTENT: SimWebsiteContent = {
  heroHeading: "Build today. Plan for what comes next.",
  heroMessage: "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.",
  simulationBanner: "COMPLIANCE INFORMATION IS AVAILABLE IN THE DISCLOSURE SECTION",
  supportEmail: "support@northstar.test",
  showChecking: true,
  showSavings: true,
  showLoans: true,
  maintenanceMode: false,
};

const PASSWORD_ITERATIONS = 120_000;

function randomBase64(byteLength: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return btoa(String.fromCharCode(...bytes));
}

async function derivePasswordHash(password: string, saltBase64 = randomBase64(16)) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const salt = Uint8Array.from(atob(saltBase64), (character)=>character.charCodeAt(0));
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: PASSWORD_ITERATIONS },
    key,
    256,
  );
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(derived)));
  return `pbkdf2-sha256$${PASSWORD_ITERATIONS}$${saltBase64}$${hashBase64}`;
}

async function passwordMatches(password: string, stored: string) {
  const [algorithm, iterations, salt, expected] = stored.split("$");
  if (algorithm !== "pbkdf2-sha256" || Number(iterations) !== PASSWORD_ITERATIONS || !salt || !expected) return false;
  const actual = (await derivePasswordHash(password, salt)).split("$")[3];
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
  return difference === 0;
}

let simulationBankInitialization:Promise<void>|null=null;

async function initializeSimulationBankOnce() {
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      type TEXT NOT NULL,
      account_number TEXT NOT NULL UNIQUE,
      balance_minor INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_transactions (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      account_id TEXT NOT NULL REFERENCES sim_accounts(id),
      direction TEXT NOT NULL CHECK (direction IN ('CREDIT','DEBIT')),
      amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
      description TEXT NOT NULL,
      effective_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('POSTED','REVERSED')),
      correction_of TEXT REFERENCES sim_transactions(id)
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_transactions_account_date_idx ON sim_transactions(account_id, effective_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_transfer_requests (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      source_account_id TEXT NOT NULL REFERENCES sim_accounts(id),
      rail TEXT NOT NULL CHECK (rail IN ('ACH','DOMESTIC_WIRE','INTERNATIONAL_WIRE')),
      status TEXT NOT NULL CHECK (status IN ('PENDING','PROCESSING','COMPLETED','FAILED','CANCELLED')),
      amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
      recipient_name TEXT NOT NULL,
      bank_name TEXT NOT NULL,
      routing_number TEXT NOT NULL,
      account_number TEXT NOT NULL,
      swift_bic TEXT,
      recipient_address_line1 TEXT NOT NULL,
      recipient_address_line2 TEXT,
      recipient_city TEXT NOT NULL,
      recipient_state_region TEXT NOT NULL,
      recipient_postal_code TEXT NOT NULL,
      recipient_country_code TEXT NOT NULL,
      bank_address TEXT NOT NULL,
      memo TEXT,
      requested_at TEXT NOT NULL,
      scheduled_for TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_transfer_requests_user_date_idx ON sim_transfer_requests(user_id, requested_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_transfer_decisions (
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL REFERENCES sim_transfer_requests(id),
      decision TEXT NOT NULL CHECK (decision IN ('APPROVE','REJECT','FLAG_REVIEW')),
      reason TEXT NOT NULL,
      decided_by TEXT NOT NULL,
      decided_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_transfer_decisions_request_idx ON sim_transfer_decisions(request_id, decided_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_stop_code_definitions (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      customer_message TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_transfer_controls (
      user_id TEXT PRIMARY KEY,
      external_mode TEXT NOT NULL CHECK (external_mode IN ('STANDARD_APPROVAL','COMPLIANCE_CODE')),
      preferred_stop_code TEXT REFERENCES sim_stop_code_definitions(code),
      updated_at TEXT NOT NULL,
      CHECK (
        external_mode = 'STANDARD_APPROVAL'
        OR preferred_stop_code IS NOT NULL
      )
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_transfer_compliance_holds (
      request_id TEXT PRIMARY KEY REFERENCES sim_transfer_requests(id),
      stop_code TEXT NOT NULL REFERENCES sim_stop_code_definitions(code),
      state TEXT NOT NULL CHECK (state IN ('AWAITING_CODE','REQUESTED','CODE_ISSUED','RELEASED')),
      code_hash TEXT,
      code_hint TEXT,
      requested_at TEXT NOT NULL,
      code_requested_at TEXT,
      issued_at TEXT,
      released_at TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_compliance_codes (
      user_id TEXT NOT NULL,
      stop_code TEXT NOT NULL REFERENCES sim_stop_code_definitions(code),
      code_hash TEXT NOT NULL,
      code_hint TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
      generated_by TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, stop_code)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_profiles (
      user_id TEXT PRIMARY KEY,
      profile_photo_data_url TEXT,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_directory (
      user_id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      status TEXT NOT NULL CHECK (status IN ('PENDING','ACTIVE','SUSPENDED','BANNED')),
      email_verified_at TEXT,
      created_source TEXT NOT NULL CHECK (created_source IN ('CUSTOMER','ADMIN')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_customer_directory_status_idx ON sim_customer_directory(status, created_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_account_statuses (
      user_id TEXT PRIMARY KEY,
      status TEXT NOT NULL CHECK (status IN ('ACTIVE','INACTIVE','IN_REVIEW')),
      updated_by TEXT NOT NULL,
      reason TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS sim_customer_account_statuses_status_idx
      ON sim_customer_account_statuses(status, updated_at DESC)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_credentials (
      user_id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      password_reset_required INTEGER NOT NULL DEFAULT 1
        CHECK (password_reset_required IN (0,1)),
      changed_by TEXT NOT NULL,
      changed_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_email_verification_challenges (
      id TEXT PRIMARY KEY,
      purpose TEXT NOT NULL CHECK (purpose IN ('SIGNUP','LOGIN')),
      email TEXT NOT NULL COLLATE NOCASE,
      user_id TEXT,
      code_hash TEXT NOT NULL,
      payload_json TEXT NOT NULL DEFAULT '{}',
      attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
      max_attempts INTEGER NOT NULL DEFAULT 5 CHECK (max_attempts BETWEEN 1 AND 10),
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_email_challenges_lookup_idx ON sim_email_verification_challenges(email, purpose, created_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_security_rate_limits (
      bucket_key TEXT PRIMARY KEY,
      request_count INTEGER NOT NULL CHECK (request_count > 0),
      expires_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_idempotency_records (
      scope TEXT NOT NULL,
      idempotency_key TEXT NOT NULL,
      reference TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (scope,idempotency_key)
    )`),
    db.prepare(`CREATE TRIGGER IF NOT EXISTS sim_accounts_customer_nonnegative_balance
      BEFORE UPDATE OF balance_minor ON sim_accounts
      WHEN NEW.user_id <> 'SYSTEM' AND NEW.balance_minor < 0
      BEGIN SELECT RAISE(ABORT,'CUSTOMER_BALANCE_CANNOT_BE_NEGATIVE'); END`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_password_reset_challenges (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL COLLATE NOCASE,
      user_id TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
      max_attempts INTEGER NOT NULL DEFAULT 5 CHECK (max_attempts BETWEEN 1 AND 10),
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_password_reset_lookup_idx ON sim_password_reset_challenges(email, created_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_beneficiaries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      beneficiary_name TEXT NOT NULL,
      email TEXT NOT NULL,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      city TEXT NOT NULL,
      state_region TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country_code TEXT NOT NULL,
      payment_method TEXT NOT NULL CHECK (payment_method IN ('BANK_ACCOUNT','E_CURRENCY')),
      account_number TEXT,
      routing_number TEXT,
      e_currency_asset TEXT,
      e_currency_network TEXT,
      wallet_identifier TEXT,
      created_at TEXT NOT NULL,
      CHECK (
        (payment_method = 'BANK_ACCOUNT'
          AND account_number IS NOT NULL
          AND routing_number IS NOT NULL
          AND e_currency_asset IS NULL
          AND e_currency_network IS NULL
          AND wallet_identifier IS NULL)
        OR
        (payment_method = 'E_CURRENCY'
          AND account_number IS NULL
          AND routing_number IS NULL
          AND e_currency_asset IS NOT NULL
          AND e_currency_network IS NOT NULL
          AND wallet_identifier IS NOT NULL)
      )
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_beneficiaries_user_name_idx ON sim_beneficiaries(user_id, beneficiary_name)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_live_chat_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL CHECK (status IN ('OPEN','WAITING','CLOSED')),
      assigned_to TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_live_chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES sim_live_chat_conversations(id),
      sender_kind TEXT NOT NULL CHECK (sender_kind IN ('CUSTOMER','STAFF','SYSTEM')),
      sender_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_live_chat_messages_thread_idx ON sim_live_chat_messages(conversation_id, created_at)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_login_sessions (
      session_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      user_agent TEXT NOT NULL,
      device_type TEXT NOT NULL,
      browser_name TEXT NOT NULL,
      operating_system TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_customer_sessions_user_seen_idx ON sim_customer_login_sessions(user_id, last_seen_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_statement_onboarding_batches (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES sim_accounts(id),
      entry_count INTEGER NOT NULL CHECK (entry_count > 0),
      net_change_minor INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_statement_onboarding_entries (
      batch_id TEXT NOT NULL REFERENCES sim_statement_onboarding_batches(id),
      transaction_id TEXT NOT NULL UNIQUE REFERENCES sim_transactions(id),
      row_index INTEGER NOT NULL CHECK (row_index >= 0),
      PRIMARY KEY (batch_id, row_index)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_deposit_methods (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      method_type TEXT NOT NULL CHECK (method_type IN ('BANK_TRANSFER','CRYPTO')),
      label TEXT NOT NULL,
      bank_name TEXT,
      account_name TEXT,
      account_number TEXT,
      routing_number TEXT,
      swift_bic TEXT,
      crypto_asset TEXT,
      crypto_network TEXT,
      wallet_address TEXT,
      instructions TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
      updated_by TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      CHECK (
        (method_type = 'BANK_TRANSFER' AND bank_name IS NOT NULL
          AND account_name IS NOT NULL AND account_number IS NOT NULL
          AND routing_number IS NOT NULL AND crypto_asset IS NULL
          AND crypto_network IS NULL AND wallet_address IS NULL)
        OR
        (method_type = 'CRYPTO' AND bank_name IS NULL AND account_name IS NULL
          AND account_number IS NULL AND routing_number IS NULL AND swift_bic IS NULL
          AND crypto_asset IS NOT NULL AND crypto_network IS NOT NULL
          AND wallet_address IS NOT NULL)
      )
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_customer_deposit_methods_user_idx ON sim_customer_deposit_methods(user_id, active, method_type)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_deposit_requests (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      account_id TEXT NOT NULL REFERENCES sim_accounts(id),
      method_id TEXT NOT NULL REFERENCES sim_customer_deposit_methods(id),
      amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
      sender_reference TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('PENDING','COMPLETED','REJECTED')),
      requested_at TEXT NOT NULL,
      decided_by TEXT,
      decided_at TEXT,
      decision_reason TEXT,
      transaction_id TEXT REFERENCES sim_transactions(id)
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_customer_deposit_requests_user_idx ON sim_customer_deposit_requests(user_id, requested_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_virtual_card_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      funding_account_id TEXT NOT NULL REFERENCES sim_accounts(id),
      display_name TEXT NOT NULL,
      monthly_limit_minor INTEGER NOT NULL CHECK (monthly_limit_minor > 0),
      status TEXT NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED')),
      pan_last4 TEXT,
      expiry_month INTEGER,
      expiry_year INTEGER,
      cvv TEXT,
      requested_at TEXT NOT NULL,
      decided_by TEXT,
      decided_at TEXT,
      decision_reason TEXT
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_virtual_cards_user_status_idx ON sim_virtual_card_requests(user_id, status, requested_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_customer_hidden_transactions (
      transaction_id TEXT PRIMARY KEY REFERENCES sim_transactions(id),
      hidden_reason TEXT NOT NULL,
      hidden_at TEXT NOT NULL
    )`),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_hidden_transactions
      (transaction_id, hidden_reason, hidden_at)
      SELECT id, 'ADMIN_ACCOUNT_FUNDING', created_at
      FROM sim_transactions
      WHERE description = 'Administrative account funding'`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_scheduled_transfers (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      source_account_id TEXT NOT NULL REFERENCES sim_accounts(id),
      destination_account_id TEXT NOT NULL REFERENCES sim_accounts(id),
      amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
      description TEXT NOT NULL,
      scheduled_for TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('SCHEDULED','COMPLETED','FAILED','CANCELLED')),
      created_at TEXT NOT NULL,
      completed_at TEXT,
      transaction_reference TEXT
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_scheduled_transfers_user_due_idx ON sim_scheduled_transfers(user_id, status, scheduled_for)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_kyc_documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      document_type TEXT NOT NULL,
      original_filename TEXT NOT NULL,
      media_type TEXT NOT NULL,
      byte_size INTEGER NOT NULL CHECK (byte_size > 0),
      object_key TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL CHECK (status IN ('UPLOADED','REVIEWED','REJECTED')),
      uploaded_at TEXT NOT NULL,
      reviewed_at TEXT,
      reviewed_by TEXT
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_kyc_documents_user_uploaded_idx ON sim_kyc_documents(user_id,uploaded_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_brand_profiles (
      id TEXT PRIMARY KEY,
      bank_name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      support_email TEXT NOT NULL,
      logo_url TEXT,
      primary_color TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0,1)),
      updated_at TEXT NOT NULL,
      updated_by TEXT NOT NULL
    )`),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS sim_brand_one_active_idx ON sim_brand_profiles(active) WHERE active=1"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_processing_fee_rules (
      rail TEXT PRIMARY KEY CHECK (rail IN ('INTERNAL','P2P','ACH','DOMESTIC_WIRE','INTERNATIONAL_WIRE')),
      percentage_bps INTEGER NOT NULL DEFAULT 0 CHECK (percentage_bps BETWEEN 0 AND 10000),
      fixed_minor INTEGER NOT NULL DEFAULT 0 CHECK (fixed_minor >= 0),
      minimum_minor INTEGER NOT NULL DEFAULT 0 CHECK (minimum_minor >= 0),
      maximum_minor INTEGER CHECK (maximum_minor IS NULL OR maximum_minor >= minimum_minor),
      active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
      updated_at TEXT NOT NULL,
      updated_by TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_email_alerts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      event_type TEXT NOT NULL CHECK (event_type IN ('SIGNUP','LOGIN','TRANSFER','DEPOSIT')),
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('QUEUED','SENT','FAILED')),
      provider_message_id TEXT,
      failure_message TEXT,
      created_at TEXT NOT NULL,
      sent_at TEXT
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS sim_email_alerts_user_date_idx ON sim_email_alerts(user_id, created_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS sim_website_content_revisions (
      id TEXT PRIMARY KEY,
      content_key TEXT NOT NULL,
      revision_number INTEGER NOT NULL CHECK (revision_number > 0),
      status TEXT NOT NULL CHECK (status IN ('DRAFT','SCHEDULED','PUBLISHED','ARCHIVED')),
      content_json TEXT NOT NULL,
      change_reason TEXT NOT NULL,
      created_by TEXT NOT NULL,
      scheduled_for TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL,
      UNIQUE (content_key, revision_number)
    )`),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS sim_website_one_published_idx
      ON sim_website_content_revisions(content_key) WHERE status = 'PUBLISHED'`),
    db.prepare(`CREATE INDEX IF NOT EXISTS sim_website_scheduled_idx
      ON sim_website_content_revisions(content_key, scheduled_for) WHERE status = 'SCHEDULED'`),
  ]);

  const existing = await db.prepare("SELECT COUNT(*) AS count FROM sim_accounts").first<{ count: number }>();
  const seedDemoData = process.env.NODE_ENV !== "production" || process.env.SEED_DEMO_DATA === "true";
  if (seedDemoData && Number(existing?.count ?? 0) === 0) {
    const now = new Date().toISOString();
    await db.batch([
      db.prepare("INSERT INTO sim_accounts VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind("acct-checking-1842", "C-882104", "Alex Morgan", "CHECKING", "7730191842", 2568040, now),
      db.prepare("INSERT INTO sim_accounts VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind("acct-savings-9081", "C-882104", "Alex Morgan", "SAVINGS", "7730199081", 7834022, now),
      db.prepare("INSERT INTO sim_accounts VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind("acct-checking-3321", "C-882088", "Maya Chen", "CHECKING", "7730193321", 0, now),
      db.prepare("INSERT INTO sim_accounts VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind("acct-checking-7730", "C-881972", "Daniel Foster", "CHECKING", "7730197730", 3280210, now),
    ]);
  }
  const now = new Date().toISOString();
  const seedStatements = [
    db.prepare("INSERT OR IGNORE INTO sim_accounts VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind("system-domestic-clearing", "SYSTEM", "Domestic clearing", "SYSTEM_DOMESTIC_CLEARING", "9000000001", 0, now),
    db.prepare("INSERT OR IGNORE INTO sim_accounts VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind("system-international-clearing", "SYSTEM", "International clearing", "SYSTEM_INTERNATIONAL_CLEARING", "9000000002", 0, now),
    db.prepare(`INSERT OR IGNORE INTO sim_stop_code_definitions
      (code, name, customer_message, active, created_at) VALUES (?, ?, ?, 1, ?)`)
      .bind("SOFT_COMPLIANCE_HOLD", "Soft compliance verification", "A reusable compliance release code is required to complete this transfer.", now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_transfer_controls
      (user_id, external_mode, preferred_stop_code, updated_at)
      VALUES (?, 'STANDARD_APPROVAL', NULL, ?)`).bind("C-882104", now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_transfer_controls
      (user_id, external_mode, preferred_stop_code, updated_at)
      VALUES (?, 'STANDARD_APPROVAL', NULL, ?)`).bind("C-882088", now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_transfer_controls
      (user_id, external_mode, preferred_stop_code, updated_at)
      VALUES (?, 'STANDARD_APPROVAL', NULL, ?)`).bind("C-881972", now),
    db.prepare(`INSERT OR IGNORE INTO sim_brand_profiles
      (id,bank_name,short_name,support_email,logo_url,primary_color,active,updated_at,updated_by)
      VALUES ('brand-northstar','Northstar Bank','NORTHSTAR','support@northstar.test',NULL,'#2855d9',1,?,'System')`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_processing_fee_rules
      (rail,percentage_bps,fixed_minor,minimum_minor,maximum_minor,active,updated_at,updated_by)
      VALUES ('INTERNAL',0,0,0,NULL,1,?,'System')`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_processing_fee_rules
      (rail,percentage_bps,fixed_minor,minimum_minor,maximum_minor,active,updated_at,updated_by)
      VALUES ('P2P',0,0,0,NULL,1,?,'System')`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_processing_fee_rules
      (rail,percentage_bps,fixed_minor,minimum_minor,maximum_minor,active,updated_at,updated_by)
      VALUES ('ACH',25,50,50,2500,1,?,'System')`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_processing_fee_rules
      (rail,percentage_bps,fixed_minor,minimum_minor,maximum_minor,active,updated_at,updated_by)
      VALUES ('DOMESTIC_WIRE',0,2500,2500,2500,1,?,'System')`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_processing_fee_rules
      (rail,percentage_bps,fixed_minor,minimum_minor,maximum_minor,active,updated_at,updated_by)
      VALUES ('INTERNATIONAL_WIRE',10,4500,4500,15000,1,?,'System')`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_website_content_revisions
      (id, content_key, revision_number, status, content_json, change_reason,
       created_by, scheduled_for, published_at, created_at)
      VALUES ('website-public-default', 'PUBLIC_SITE', 1, 'PUBLISHED', ?,
       'Initial public website configuration', 'System', NULL, ?, ?)`)
      .bind(JSON.stringify(DEFAULT_SIM_WEBSITE_CONTENT), now, now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_profiles
      (user_id, profile_photo_data_url, updated_at) VALUES (?, NULL, ?)`)
      .bind("C-882104", now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_directory
      (user_id, first_name, last_name, email, status, email_verified_at,
       created_source, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'ACTIVE', ?, 'ADMIN', ?, ?)`)
      .bind("C-882104", "Alex", "Morgan", "alex@example.test", now, now, now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_directory
      (user_id, first_name, last_name, email, status, email_verified_at,
       created_source, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'PENDING', NULL, 'ADMIN', ?, ?)`)
      .bind("C-882088", "Maya", "Chen", "maya@example.test", now, now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_directory
      (user_id, first_name, last_name, email, status, email_verified_at,
       created_source, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'SUSPENDED', ?, 'ADMIN', ?, ?)`)
      .bind("C-881972", "Daniel", "Foster", "daniel@example.test", now, now, now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_account_statuses
      (user_id, status, updated_by, reason, updated_at)
      VALUES ('C-882104', 'ACTIVE', 'SYSTEM', 'Seeded active customer', ?)`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_account_statuses
      (user_id, status, updated_by, reason, updated_at)
      VALUES ('C-882088', 'IN_REVIEW', 'SYSTEM', 'Awaiting KYC decision', ?)`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_account_statuses
      (user_id, status, updated_by, reason, updated_at)
      VALUES ('C-881972', 'INACTIVE', 'SYSTEM', 'Seeded inactive customer', ?)`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_beneficiaries
      (id, user_id, beneficiary_name, email, address_line1, address_line2, city,
       state_region, postal_code, country_code, payment_method, account_number,
       routing_number, e_currency_asset, e_currency_network, wallet_identifier, created_at)
      VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, 'BANK_ACCOUNT', ?, ?, NULL, NULL, NULL, ?)`)
      .bind("BEN-MAYA-001", "C-882104", "Maya Chen", "maya@example.test", "85 Northstar Avenue",
        "Austin", "TX", "78701", "US", "7730193321", "021000021", now),
    db.prepare(`INSERT OR IGNORE INTO sim_beneficiaries
      (id, user_id, beneficiary_name, email, address_line1, address_line2, city,
       state_region, postal_code, country_code, payment_method, account_number,
       routing_number, e_currency_asset, e_currency_network, wallet_identifier, created_at)
      VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, 'E_CURRENCY', NULL, NULL, ?, ?, ?, ?)`)
      .bind("BEN-ECUR-001", "C-882104", "Digital Asset Treasury", "treasury@example.test",
        "10 Market Plaza", "New York", "NY", "10005", "US", "USDC", "SIM-ETHEREUM",
        "sim_wallet_7f94b2c81e", now),
    db.prepare(`INSERT OR IGNORE INTO sim_live_chat_conversations
      (id, user_id, status, assigned_to, created_at, updated_at)
      VALUES ('CHAT-882104', 'C-882104', 'OPEN', 'Sarah Okafor', ?, ?)`).bind(now, now),
    db.prepare(`INSERT OR IGNORE INTO sim_live_chat_messages
      (id, conversation_id, sender_kind, sender_name, body, created_at)
      VALUES ('CHAT-MSG-WELCOME', 'CHAT-882104', 'SYSTEM', 'Northstar Support',
        'Welcome to Northstar live support. How can our support team help?', ?)`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_deposit_methods
      (id, user_id, method_type, label, bank_name, account_name, account_number,
       routing_number, swift_bic, crypto_asset, crypto_network, wallet_address,
       instructions, active, updated_by, updated_at)
      VALUES ('DEP-BANK-882104', 'C-882104', 'BANK_TRANSFER', 'Northstar inbound bank transfer',
        'Northstar Clearing', 'Alex Morgan', '9900882104', '021000021',
        'NSTRUS33', NULL, NULL, NULL,
        'Use your customer number as the payment reference.', 1, 'SYSTEM', ?)`).bind(now),
    db.prepare(`INSERT OR IGNORE INTO sim_customer_deposit_methods
      (id, user_id, method_type, label, bank_name, account_name, account_number,
       routing_number, swift_bic, crypto_asset, crypto_network, wallet_address,
       instructions, active, updated_by, updated_at)
      VALUES ('DEP-CRYPTO-882104', 'C-882104', 'CRYPTO', 'USDC deposit',
        NULL, NULL, NULL, NULL, NULL, 'USDC', 'SIM-ETHEREUM',
        'northstar_sim_usdc_882104',
        'Send USDC on the selected network and include your customer reference.', 1, 'SYSTEM', ?)`).bind(now),
    db.prepare("UPDATE sim_stop_code_definitions SET customer_message = ? WHERE code = 'SOFT_COMPLIANCE_HOLD'")
      .bind("A reusable compliance release code is required to complete this transfer."),
    db.prepare("UPDATE sim_live_chat_messages SET body = ? WHERE id = 'CHAT-MSG-WELCOME'")
      .bind("Welcome to Northstar live support. How can our support team help?"),
    db.prepare("UPDATE sim_customer_deposit_methods SET label = ?, bank_name = ?, instructions = ? WHERE id = 'DEP-BANK-882104'")
      .bind("Northstar inbound bank transfer", "Northstar Clearing", "Use your customer number as the payment reference."),
    db.prepare("UPDATE sim_customer_deposit_methods SET label = ?, instructions = ? WHERE id = 'DEP-CRYPTO-882104'")
      .bind("USDC deposit", "Send USDC on the selected network and include your customer reference."),
  ];
  const demoMarkers = ["C-882104", "C-882088", "C-881972", "CHAT-", "DEP-BANK-", "DEP-CRYPTO-", "BEN-MAYA-", "BEN-ECUR-"];
  await db.batch(seedDemoData ? seedStatements : seedStatements.filter((statement) => {
    const searchable = `${statement.sql} ${statement.values.map(String).join(" ")}`;
    return !demoMarkers.some((marker) => searchable.includes(marker));
  }));
  const seededCredential = seedDemoData
    ? await db.prepare("SELECT user_id FROM sim_customer_credentials WHERE user_id = 'C-882104'").first<{ user_id: string }>()
    : null;
  if (seedDemoData && !seededCredential) {
    await db.batch([db.prepare(`INSERT INTO sim_customer_credentials
      (user_id, password_hash, password_reset_required, changed_by, changed_at)
      VALUES ('C-882104', ?, 0, 'SYSTEM', ?)`)
      .bind(await derivePasswordHash(process.env.CUSTOMER_PASSWORD ?? (process.env.NODE_ENV==="production"?randomBase64(32):"Northstar!2026")), now)]);
  }
}

export function initializeSimulationBank() {
  simulationBankInitialization ??= initializeSimulationBankOnce().catch((error)=>{
    simulationBankInitialization=null;
    throw error;
  });
  return simulationBankInitialization;
}

async function sha256Hex(value:string) {
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest),(byte)=>byte.toString(16).padStart(2,"0")).join("");
}

export async function consumeSimulationRateLimit(input:{scope:string;key:string;limit:number;windowSeconds:number}) {
  await initializeSimulationBank();
  const db=database();
  const now=Date.now();
  const windowNumber=Math.floor(now/(input.windowSeconds*1000));
  if(windowNumber%32===0)await db.batch([db.prepare("DELETE FROM sim_security_rate_limits WHERE expires_at < ?").bind(new Date(now).toISOString())]);
  const bucketKey=await sha256Hex(`${input.scope}:${input.key.toLowerCase()}:${windowNumber}`);
  const expiresAt=new Date((windowNumber+1)*input.windowSeconds*1000).toISOString();
  const row=await db.prepare(`INSERT INTO sim_security_rate_limits (bucket_key,request_count,expires_at)
    VALUES (?,1,?) ON CONFLICT(bucket_key) DO UPDATE
    SET request_count=sim_security_rate_limits.request_count+1
    RETURNING request_count AS requestCount`).bind(bucketKey,expiresAt).first<{requestCount:number}>();
  const requestCount=Number(row?.requestCount);
  if(!Number.isFinite(requestCount)||requestCount<1)throw new Error("RATE_LIMIT_STORAGE_FAILED");
  if(requestCount>input.limit)throw new Error("RATE_LIMIT_EXCEEDED");
}

export async function recordSimulationCustomerSession(session: SimCustomerLoginSession) {
  await initializeSimulationBank();
  const db = database();
  await db.batch([
    db.prepare(`INSERT INTO sim_customer_login_sessions
      (session_id, user_id, email, ip_address, user_agent, device_type,
       browser_name, operating_system, created_at, last_seen_at, expires_at, revoked_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
      ON CONFLICT(session_id) DO UPDATE SET user_id=excluded.user_id,email=excluded.email,
        ip_address=excluded.ip_address,user_agent=excluded.user_agent,device_type=excluded.device_type,
        browser_name=excluded.browser_name,operating_system=excluded.operating_system,
        last_seen_at=excluded.last_seen_at,expires_at=excluded.expires_at,revoked_at=NULL`)
      .bind(session.sessionId, session.userId, session.email, session.ipAddress,
        session.userAgent, session.deviceType, session.browserName,
        session.operatingSystem, session.createdAt, session.lastSeenAt, session.expiresAt),
  ]);
  return session;
}

export async function listSimulationCustomerSessions(userId: string, currentSessionId: string) {
  await initializeSimulationBank();
  const db = database();
  const now = new Date().toISOString();
  await db.batch([
    db.prepare(`UPDATE sim_customer_login_sessions SET last_seen_at = ?
      WHERE session_id = ? AND user_id = ? AND revoked_at IS NULL`)
      .bind(now, currentSessionId, userId),
  ]);
  const sessions = await db.prepare(`SELECT session_id AS sessionId, user_id AS userId,
    email, ip_address AS ipAddress, user_agent AS userAgent, device_type AS deviceType,
    browser_name AS browserName, operating_system AS operatingSystem,
    created_at AS createdAt, last_seen_at AS lastSeenAt, expires_at AS expiresAt,
    revoked_at AS revokedAt
    FROM sim_customer_login_sessions WHERE user_id = ?
    ORDER BY last_seen_at DESC LIMIT 30`).bind(userId).all<SimCustomerLoginSession>();
  return sessions.results.map((session)=>({
    ...session,
    current: session.sessionId === currentSessionId,
    active: !session.revokedAt && session.expiresAt > now,
  }));
}

export async function revokeSimulationCustomerSession(userId: string, sessionId: string) {
  await initializeSimulationBank();
  const db = database();
  const existing = await db.prepare(`SELECT session_id AS sessionId
    FROM sim_customer_login_sessions WHERE session_id = ? AND user_id = ?`)
    .bind(sessionId, userId).first<{ sessionId: string }>();
  if (!existing) throw new Error("SESSION_NOT_FOUND");
  const revokedAt = new Date().toISOString();
  await db.batch([
    db.prepare(`UPDATE sim_customer_login_sessions SET revoked_at = ?
      WHERE session_id = ? AND user_id = ?`).bind(revokedAt, sessionId, userId),
  ]);
  return { sessionId, revokedAt };
}

export async function isSimulationCustomerSessionActive(userId: string, sessionId: string) {
  await initializeSimulationBank();
  const db = database();
  const session = await db.prepare(`SELECT expires_at AS expiresAt,
    revoked_at AS revokedAt, last_seen_at AS lastSeenAt FROM sim_customer_login_sessions
    WHERE session_id = ? AND user_id = ?`).bind(sessionId, userId)
    .first<{ expiresAt: string; revokedAt: string | null; lastSeenAt: string }>();
  const active = Boolean(session && !session.revokedAt && session.expiresAt > new Date().toISOString());
  if (active && session && Date.now() - new Date(session.lastSeenAt).getTime() > 60_000) {
    await db.batch([
      db.prepare(`UPDATE sim_customer_login_sessions SET last_seen_at = ?
        WHERE session_id = ? AND user_id = ? AND revoked_at IS NULL`)
        .bind(new Date().toISOString(), sessionId, userId),
    ]);
  }
  return active;
}

async function ensureSimulationLiveChatConversation(userId:string) {
  const db = database();
  const existing=await db.prepare("SELECT id FROM sim_live_chat_conversations WHERE user_id=?")
    .bind(userId).first<{id:string}>();
  if (existing) return existing.id;
  const customer=await db.prepare(`SELECT first_name AS firstName,last_name AS lastName
    FROM sim_customer_directory WHERE user_id=?`).bind(userId)
    .first<{firstName:string;lastName:string}>();
  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  const now=new Date().toISOString();
  const conversationId=`CHAT-${userId}`;
  await db.batch([
    db.prepare(`INSERT OR IGNORE INTO sim_live_chat_conversations
      (id,user_id,status,assigned_to,created_at,updated_at)
      VALUES (?,?,'OPEN','Support queue',?,?)`).bind(conversationId,userId,now,now),
    db.prepare(`INSERT OR IGNORE INTO sim_live_chat_messages
      (id,conversation_id,sender_kind,sender_name,body,created_at)
      VALUES (?,?,'SYSTEM','Northstar Support',?,?)`)
      .bind(`WELCOME-${userId}`,conversationId,
        `Welcome ${customer.firstName}. You are connected to Northstar live support. How can we help?`,now),
  ]);
  return conversationId;
}

export async function getSimulationLiveChat(userId: string) {
  await initializeSimulationBank();
  const db = database();
  await ensureSimulationLiveChatConversation(userId);
  const conversation = await db.prepare(`SELECT id, user_id AS userId, status,
    assigned_to AS assignedTo, created_at AS createdAt, updated_at AS updatedAt
    FROM sim_live_chat_conversations WHERE user_id = ?`).bind(userId)
    .first<{ id: string; userId: string; status: "OPEN" | "WAITING" | "CLOSED"; assignedTo: string | null; createdAt: string; updatedAt: string }>();
  if (!conversation) throw new Error("LIVE_CHAT_UNAVAILABLE");
  const messages = await db.prepare(`SELECT id, conversation_id AS conversationId,
    sender_kind AS senderKind, sender_name AS senderName, body, created_at AS createdAt
    FROM sim_live_chat_messages WHERE conversation_id = ?
    ORDER BY created_at, id LIMIT 200`).bind(conversation.id).all<SimLiveChatMessage>();
  return { conversation, messages: messages.results };
}

export async function postSimulationLiveChatMessage(input: {
  userId: string;
  senderKind: "CUSTOMER" | "STAFF";
  senderName: string;
  body: string;
}) {
  const body = input.body.trim();
  if (!body || body.length > 2000) throw new Error("LIVE_CHAT_MESSAGE_INVALID");
  await initializeSimulationBank();
  const db = database();
  await ensureSimulationLiveChatConversation(input.userId);
  const conversation = await db.prepare("SELECT id FROM sim_live_chat_conversations WHERE user_id = ?")
    .bind(input.userId).first<{ id: string }>();
  if (!conversation) throw new Error("LIVE_CHAT_UNAVAILABLE");
  const message: SimLiveChatMessage = {
    id: crypto.randomUUID(),
    conversationId: conversation.id,
    senderKind: input.senderKind,
    senderName: input.senderName,
    body,
    createdAt: new Date().toISOString(),
  };
  await db.batch([
    db.prepare(`INSERT INTO sim_live_chat_messages
      (id, conversation_id, sender_kind, sender_name, body, created_at)
      VALUES (?, ?, ?, ?, ?, ?)`).bind(message.id, message.conversationId,
        message.senderKind, message.senderName, message.body, message.createdAt),
    db.prepare(`UPDATE sim_live_chat_conversations SET status = ?, assigned_to = ?,
      updated_at = ? WHERE id = ?`).bind(
        input.senderKind === "CUSTOMER" ? "WAITING" : "OPEN",
        input.senderKind === "STAFF" ? input.senderName : "Sarah Okafor",
        message.createdAt,
        conversation.id,
      ),
  ]);
  return message;
}

export async function listSimulationBeneficiaries(userId: string) {
  await initializeSimulationBank();
  const result = await database().prepare(`SELECT id, user_id AS userId,
    beneficiary_name AS beneficiaryName, email, address_line1 AS addressLine1,
    address_line2 AS addressLine2, city, state_region AS stateRegion,
    postal_code AS postalCode, country_code AS countryCode,
    payment_method AS paymentMethod, account_number AS accountNumber,
    routing_number AS routingNumber, e_currency_asset AS eCurrencyAsset,
    e_currency_network AS eCurrencyNetwork, wallet_identifier AS walletIdentifier,
    created_at AS createdAt
    FROM sim_beneficiaries WHERE user_id = ?
    ORDER BY beneficiary_name`).bind(userId).all<SimBeneficiary>();
  return result.results;
}

export async function createSimulationBeneficiary(input: {
  userId: string;
  beneficiaryName: string;
  email: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateRegion?: string;
  postalCode?: string;
  countryCode: string;
  paymentMethod: "BANK_ACCOUNT" | "E_CURRENCY";
  accountNumber?: string;
  routingNumber?: string;
  eCurrencyAsset?: string;
  eCurrencyNetwork?: string;
  walletIdentifier?: string;
}) {
  const beneficiaryName = input.beneficiaryName.trim();
  const email = input.email.trim().toLowerCase();
  const countryCode = input.countryCode.trim().toUpperCase();
  if (beneficiaryName.length < 2 || beneficiaryName.length > 200) throw new Error("BENEFICIARY_NAME_INVALID");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("BENEFICIARY_EMAIL_INVALID");
  if (!/^[A-Z]{2}$/.test(countryCode)) throw new Error("COUNTRY_CODE_INVALID");
  if (input.paymentMethod === "BANK_ACCOUNT") {
    if (!input.accountNumber?.trim() || !input.routingNumber?.trim()) throw new Error("BANK_DETAILS_REQUIRED");
  } else if (!input.eCurrencyAsset?.trim() || !input.eCurrencyNetwork?.trim() || !input.walletIdentifier?.trim()) {
    throw new Error("E_CURRENCY_DETAILS_REQUIRED");
  }

  await initializeSimulationBank();
  const created: SimBeneficiary = {
    id: crypto.randomUUID(),
    userId: input.userId,
    beneficiaryName,
    email,
    addressLine1: input.addressLine1?.trim() ?? "",
    addressLine2: input.addressLine2?.trim() || null,
    city: input.city?.trim() ?? "",
    stateRegion: input.stateRegion?.trim() ?? "",
    postalCode: input.postalCode?.trim() ?? "",
    countryCode,
    paymentMethod: input.paymentMethod,
    accountNumber: input.paymentMethod === "BANK_ACCOUNT" ? input.accountNumber!.trim() : null,
    routingNumber: input.paymentMethod === "BANK_ACCOUNT" ? input.routingNumber!.trim() : null,
    eCurrencyAsset: input.paymentMethod === "E_CURRENCY" ? input.eCurrencyAsset!.trim().toUpperCase() : null,
    eCurrencyNetwork: input.paymentMethod === "E_CURRENCY" ? input.eCurrencyNetwork!.trim() : null,
    walletIdentifier: input.paymentMethod === "E_CURRENCY" ? input.walletIdentifier!.trim() : null,
    createdAt: new Date().toISOString(),
  };
  const db = database();
  await db.batch([
    db.prepare(`INSERT INTO sim_beneficiaries
      (id, user_id, beneficiary_name, email, address_line1, address_line2, city,
       state_region, postal_code, country_code, payment_method, account_number,
       routing_number, e_currency_asset, e_currency_network, wallet_identifier, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(created.id, created.userId, created.beneficiaryName, created.email,
        created.addressLine1, created.addressLine2, created.city, created.stateRegion,
        created.postalCode, created.countryCode, created.paymentMethod,
        created.accountNumber, created.routingNumber, created.eCurrencyAsset,
        created.eCurrencyNetwork, created.walletIdentifier, created.createdAt),
  ]);
  return created;
}

export async function getSimulationProfilePhoto(userId: string) {
  await initializeSimulationBank();
  const profile = await database().prepare(`SELECT user_id AS userId,
    profile_photo_data_url AS profilePhotoDataUrl, updated_at AS updatedAt
    FROM sim_customer_profiles WHERE user_id = ?`).bind(userId).first<SimCustomerProfilePhoto>();
  return profile ?? { userId, profilePhotoDataUrl: null, updatedAt: new Date(0).toISOString() };
}

export async function saveSimulationProfilePhoto(userId: string, profilePhotoDataUrl: string) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(profilePhotoDataUrl);
  if (!match) throw new Error("PROFILE_PHOTO_TYPE_INVALID");
  const approximateBytes = Math.floor(match[2].length * 0.75);
  if (approximateBytes > 800_000) throw new Error("PROFILE_PHOTO_TOO_LARGE");

  await initializeSimulationBank();
  const updatedAt = new Date().toISOString();
  const db = database();
  await db.batch([
    db.prepare(`INSERT INTO sim_customer_profiles
      (user_id, profile_photo_data_url, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        profile_photo_data_url = excluded.profile_photo_data_url,
        updated_at = excluded.updated_at`)
      .bind(userId, profilePhotoDataUrl, updatedAt),
  ]);
  return { userId, profilePhotoDataUrl, updatedAt };
}

async function ensureActiveCustomersHaveInitialAccounts() {
  const db = database();
  const missing = await db.prepare(`SELECT d.user_id AS userId, d.first_name AS firstName,
    d.last_name AS lastName FROM sim_customer_directory d
    LEFT JOIN sim_accounts a ON a.user_id = d.user_id
    WHERE d.status = 'ACTIVE' AND a.id IS NULL`).all<{
      userId:string; firstName:string; lastName:string;
    }>();
  if (!missing.results.length) return 0;
  const now = new Date().toISOString();
  await db.batch(missing.results.map((customer)=>{
    const accountId = `acct-${crypto.randomUUID()}`;
    const accountNumber = `77${String(Math.floor(Math.random()*100_000_000)).padStart(8,"0")}`;
    return db.prepare(`INSERT INTO sim_accounts
      (id, user_id, customer_name, type, account_number, balance_minor, updated_at)
      SELECT ?, ?, ?, 'CHECKING', ?, 0, ?
      WHERE NOT EXISTS (SELECT 1 FROM sim_accounts WHERE user_id = ?)`)
      .bind(accountId,customer.userId,`${customer.firstName} ${customer.lastName}`,accountNumber,now,customer.userId);
  }));
  return missing.results.length;
}

async function ensureActiveCustomersHaveDepositMethods() {
  const db = database();
  await db.batch([db.prepare(`DELETE FROM sim_customer_deposit_methods
    WHERE id NOT IN (SELECT MIN(id) FROM sim_customer_deposit_methods
      GROUP BY user_id,method_type,label)
      AND NOT EXISTS (SELECT 1 FROM sim_customer_deposit_requests r
        WHERE r.method_id=sim_customer_deposit_methods.id)`)]);
  const templates = await db.prepare(`SELECT method_type AS methodType, label,
    bank_name AS bankName, account_name AS accountName, account_number AS accountNumber,
    routing_number AS routingNumber, swift_bic AS swiftBic, crypto_asset AS cryptoAsset,
    crypto_network AS cryptoNetwork, wallet_address AS walletAddress, instructions
    FROM sim_customer_deposit_methods WHERE active = 1
    GROUP BY method_type ORDER BY updated_at DESC`).all<SimDepositMethod>();
  if (!templates.results.length) return 0;
  const missing = await db.prepare(`SELECT d.user_id AS userId, d.first_name AS firstName,
    d.last_name AS lastName FROM sim_customer_directory d
    WHERE d.status = 'ACTIVE' AND EXISTS (SELECT 1 FROM sim_accounts a WHERE a.user_id = d.user_id)
      AND NOT EXISTS (SELECT 1 FROM sim_customer_deposit_methods m WHERE m.user_id = d.user_id AND m.active = 1)`)
    .all<{userId:string;firstName:string;lastName:string}>();
  if (!missing.results.length) return 0;
  const now = new Date().toISOString();
  const statements = missing.results.flatMap((customer)=>templates.results.map((template)=>
    db.prepare(`INSERT INTO sim_customer_deposit_methods
      (id,user_id,method_type,label,bank_name,account_name,account_number,routing_number,
       swift_bic,crypto_asset,crypto_network,wallet_address,instructions,active,updated_by,updated_at)
      SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,1,'SYSTEM_TEMPLATE',?
      WHERE NOT EXISTS (SELECT 1 FROM sim_customer_deposit_methods
        WHERE user_id=? AND method_type=? AND label=? AND active=1)`)
      .bind(crypto.randomUUID(),customer.userId,template.methodType,template.label,
        template.bankName,template.methodType==="BANK_TRANSFER"?`${customer.firstName} ${customer.lastName}`:null,
        template.accountNumber,template.routingNumber,template.swiftBic,template.cryptoAsset,
        template.cryptoNetwork,template.walletAddress,template.instructions,now,
        customer.userId,template.methodType,template.label)
  ));
  await db.batch(statements);
  return missing.results.length;
}

export async function getSimulationBank() {
  await initializeSimulationBank();
  await ensureActiveCustomersHaveInitialAccounts();
  await ensureActiveCustomersHaveDepositMethods();
  await processDueSimulationTransfers();
  const db = database();
  const customers = await db.prepare(`SELECT d.user_id AS userId, d.first_name AS firstName,
    d.last_name AS lastName, d.email, d.status, d.email_verified_at AS emailVerifiedAt,
    d.created_source AS createdSource, d.created_at AS createdAt,
    COALESCE(s.status, 'IN_REVIEW') AS accountStatus,
    COALESCE(c.password_reset_required, 1) AS passwordResetRequired
    FROM sim_customer_directory d
    LEFT JOIN sim_customer_account_statuses s ON s.user_id = d.user_id
    LEFT JOIN sim_customer_credentials c ON c.user_id = d.user_id
    ORDER BY d.created_at DESC`).all<SimCustomerDirectoryEntry>();
  const accounts = await db.prepare(`SELECT
    id, user_id AS userId, customer_name AS customerName, type,
    account_number AS accountNumber, balance_minor AS balanceMinor
    FROM sim_accounts ORDER BY customer_name, type`).all<SimAccount>();
  const transactions = await db.prepare(`SELECT
    t.id, t.reference, t.account_id AS accountId, a.customer_name AS customerName,
    a.account_number AS accountNumber, t.direction, t.amount_minor AS amountMinor,
    t.description, t.effective_at AS effectiveAt, t.created_at AS createdAt,
    t.status, t.correction_of AS correctionOf
    FROM sim_transactions t JOIN sim_accounts a ON a.id = t.account_id
    ORDER BY t.effective_at DESC, t.created_at DESC LIMIT 250`).all<SimTransaction>();
  const transferRequests = await db.prepare(`SELECT
    r.id, r.reference, r.user_id AS userId, r.source_account_id AS sourceAccountId,
    a.account_number AS sourceAccountNumber, r.rail, r.status,
    r.amount_minor AS amountMinor, r.recipient_name AS recipientName,
    r.bank_name AS bankName, r.routing_number AS routingNumber,
    r.account_number AS accountNumber, r.swift_bic AS swiftBic,
    r.recipient_address_line1 AS recipientAddressLine1,
    r.recipient_address_line2 AS recipientAddressLine2,
    r.recipient_city AS recipientCity, r.recipient_state_region AS recipientStateRegion,
    r.recipient_postal_code AS recipientPostalCode,
    r.recipient_country_code AS recipientCountryCode,
    r.bank_address AS bankAddress, r.memo,
    r.requested_at AS requestedAt, r.scheduled_for AS scheduledFor,
    CASE WHEN h.request_id IS NULL THEN 'STANDARD_APPROVAL' ELSE 'COMPLIANCE_CODE' END AS transferMode,
    h.stop_code AS complianceStopCode, h.state AS holdState, h.code_hint AS codeHint,
    d.customer_message AS customerMessage
    FROM sim_transfer_requests r JOIN sim_accounts a ON a.id = r.source_account_id
    LEFT JOIN sim_transfer_compliance_holds h ON h.request_id = r.id
    LEFT JOIN sim_stop_code_definitions d ON d.code = h.stop_code
    ORDER BY r.requested_at DESC LIMIT 100`).all<SimTransferRequest>();
  const stopCodes = await db.prepare(`SELECT code, name, customer_message AS customerMessage,
    active, created_at AS createdAt FROM sim_stop_code_definitions ORDER BY created_at DESC`)
    .all<SimStopCodeDefinition>();
  const transferControls = await db.prepare(`SELECT user_id AS userId, external_mode AS externalMode,
    preferred_stop_code AS preferredStopCode, updated_at AS updatedAt
    FROM sim_customer_transfer_controls ORDER BY user_id`).all<SimTransferControl>();
  const depositMethods = await db.prepare(`SELECT id, user_id AS userId,
    method_type AS methodType, label, bank_name AS bankName,
    account_name AS accountName, account_number AS accountNumber,
    routing_number AS routingNumber, swift_bic AS swiftBic,
    crypto_asset AS cryptoAsset, crypto_network AS cryptoNetwork,
    wallet_address AS walletAddress, instructions, active,
    updated_at AS updatedAt
    FROM sim_customer_deposit_methods ORDER BY user_id, method_type, label`)
    .all<SimDepositMethod>();
  const depositRequests = await db.prepare(`SELECT r.id, r.reference,
    r.user_id AS userId, a.customer_name AS customerName,
    r.account_id AS accountId, a.account_number AS accountNumber,
    r.method_id AS methodId, m.label AS methodLabel,
    m.method_type AS methodType, r.amount_minor AS amountMinor,
    r.sender_reference AS senderReference, r.status,
    r.requested_at AS requestedAt, r.decided_at AS decidedAt,
    r.decision_reason AS decisionReason
    FROM sim_customer_deposit_requests r
    JOIN sim_accounts a ON a.id = r.account_id
    JOIN sim_customer_deposit_methods m ON m.id = r.method_id
    ORDER BY r.requested_at DESC LIMIT 100`).all<SimDepositRequest>();
  const statementBatches = await db.prepare(`SELECT b.id,
    b.account_id AS accountId, a.customer_name AS customerName,
    a.account_number AS accountNumber, b.entry_count AS entryCount,
    b.net_change_minor AS netChangeMinor, b.reason,
    b.created_by AS createdBy, b.created_at AS createdAt
    FROM sim_statement_onboarding_batches b
    JOIN sim_accounts a ON a.id = b.account_id
    ORDER BY b.created_at DESC LIMIT 50`).all<{
      id: string; accountId: string; customerName: string; accountNumber: string;
      entryCount: number; netChangeMinor: number; reason: string;
      createdBy: string; createdAt: string;
    }>();
  const virtualCardRequests = await db.prepare(`SELECT r.id,r.user_id AS userId,
    a.customer_name AS customerName,r.funding_account_id AS fundingAccountId,
    a.account_number AS fundingAccountNumber,r.display_name AS displayName,
    r.monthly_limit_minor AS monthlyLimitMinor,r.status,r.pan_last4 AS panLast4,
    r.expiry_month AS expiryMonth,r.expiry_year AS expiryYear,r.cvv,
    r.requested_at AS requestedAt,r.decided_by AS decidedBy,r.decided_at AS decidedAt,
    r.decision_reason AS decisionReason FROM sim_virtual_card_requests r
    JOIN sim_accounts a ON a.id=r.funding_account_id ORDER BY r.requested_at DESC`)
    .all<SimVirtualCardRequest>();
  const scheduledTransfers = await db.prepare(`SELECT s.id,s.reference,s.user_id AS userId,
    s.source_account_id AS sourceAccountId,source.account_number AS sourceAccountNumber,
    s.destination_account_id AS destinationAccountId,
    destination.account_number AS destinationAccountNumber,
    destination.customer_name AS destinationCustomerName,
    CASE WHEN source.user_id=destination.user_id THEN 'INTERNAL' ELSE 'P2P' END AS transferKind,
    s.amount_minor AS amountMinor,s.description,s.scheduled_for AS scheduledFor,s.status,
    s.created_at AS createdAt,s.completed_at AS completedAt,
    s.transaction_reference AS transactionReference
    FROM sim_scheduled_transfers s
    JOIN sim_accounts source ON source.id=s.source_account_id
    JOIN sim_accounts destination ON destination.id=s.destination_account_id
    ORDER BY s.created_at DESC LIMIT 100`).all<SimScheduledTransfer>();
  const kycDocuments=await db.prepare(`SELECT k.id,k.user_id AS userId,
    d.first_name||' '||d.last_name AS customerName,k.document_type AS documentType,
    k.original_filename AS originalFilename,k.media_type AS mediaType,k.byte_size AS byteSize,
    k.object_key AS objectKey,k.status,k.uploaded_at AS uploadedAt,k.reviewed_at AS reviewedAt,
    k.reviewed_by AS reviewedBy FROM sim_kyc_documents k
    JOIN sim_customer_directory d ON d.user_id=k.user_id ORDER BY k.uploaded_at DESC LIMIT 200`)
    .all<SimKycDocument>();
  const brandProfiles=await db.prepare(`SELECT id,bank_name AS bankName,short_name AS shortName,
    support_email AS supportEmail,logo_url AS logoUrl,primary_color AS primaryColor,active,
    updated_at AS updatedAt,updated_by AS updatedBy FROM sim_brand_profiles ORDER BY active DESC,updated_at DESC`)
    .all<SimBrandProfile>();
  const processingFeeRules=await db.prepare(`SELECT rail,percentage_bps AS percentageBps,
    fixed_minor AS fixedMinor,minimum_minor AS minimumMinor,maximum_minor AS maximumMinor,
    active,updated_at AS updatedAt,updated_by AS updatedBy FROM sim_processing_fee_rules ORDER BY rail`)
    .all<SimProcessingFeeRule>();
  const activityResults=await Promise.all([
    db.prepare(`SELECT s.session_id AS id,s.user_id AS userId,d.first_name||' '||d.last_name AS customerName,
      'LOGIN' AS actionType,'Signed in from '||s.browser_name||' on '||s.operating_system AS summary,
      s.created_at AS occurredAt,CASE WHEN s.revoked_at IS NULL THEN 'ACTIVE' ELSE 'ENDED' END AS status
      FROM sim_customer_login_sessions s JOIN sim_customer_directory d ON d.user_id=s.user_id ORDER BY s.created_at DESC LIMIT 100`).all<SimCustomerActivity>(),
    db.prepare(`SELECT r.id,r.user_id AS userId,d.first_name||' '||d.last_name AS customerName,
      'EXTERNAL_TRANSFER' AS actionType,r.rail||' transfer '||r.reference AS summary,r.requested_at AS occurredAt,r.status
      FROM sim_transfer_requests r JOIN sim_customer_directory d ON d.user_id=r.user_id ORDER BY r.requested_at DESC LIMIT 100`).all<SimCustomerActivity>(),
    db.prepare(`SELECT r.id,r.user_id AS userId,d.first_name||' '||d.last_name AS customerName,
      'DEPOSIT_REQUEST' AS actionType,'Deposit request '||r.reference AS summary,r.requested_at AS occurredAt,r.status
      FROM sim_customer_deposit_requests r JOIN sim_customer_directory d ON d.user_id=r.user_id ORDER BY r.requested_at DESC LIMIT 100`).all<SimCustomerActivity>(),
    db.prepare(`SELECT t.id,a.user_id AS userId,a.customer_name AS customerName,'LEDGER_ACTIVITY' AS actionType,
      t.description AS summary,t.created_at AS occurredAt,t.status FROM sim_transactions t JOIN sim_accounts a ON a.id=t.account_id
      WHERE a.user_id<>'SYSTEM' ORDER BY t.created_at DESC LIMIT 150`).all<SimCustomerActivity>(),
    db.prepare(`SELECT s.id,s.user_id AS userId,d.first_name||' '||d.last_name AS customerName,
      'SCHEDULED_TRANSFER' AS actionType,'Scheduled transfer '||s.reference AS summary,s.created_at AS occurredAt,s.status
      FROM sim_scheduled_transfers s JOIN sim_customer_directory d ON d.user_id=s.user_id ORDER BY s.created_at DESC LIMIT 100`).all<SimCustomerActivity>(),
    db.prepare(`SELECT r.id,r.user_id AS userId,d.first_name||' '||d.last_name AS customerName,
      'VIRTUAL_CARD' AS actionType,'Virtual card request: '||r.display_name AS summary,r.requested_at AS occurredAt,r.status
      FROM sim_virtual_card_requests r JOIN sim_customer_directory d ON d.user_id=r.user_id ORDER BY r.requested_at DESC LIMIT 100`).all<SimCustomerActivity>(),
    db.prepare(`SELECT m.id,c.user_id AS userId,d.first_name||' '||d.last_name AS customerName,
      'LIVE_CHAT' AS actionType,'Sent a live support message' AS summary,m.created_at AS occurredAt,c.status
      FROM sim_live_chat_messages m JOIN sim_live_chat_conversations c ON c.id=m.conversation_id
      JOIN sim_customer_directory d ON d.user_id=c.user_id WHERE m.sender_kind='CUSTOMER' ORDER BY m.created_at DESC LIMIT 100`).all<SimCustomerActivity>(),
    db.prepare(`SELECT k.id,k.user_id AS userId,d.first_name||' '||d.last_name AS customerName,
      'KYC_UPLOAD' AS actionType,'Uploaded '||k.original_filename AS summary,k.uploaded_at AS occurredAt,k.status
      FROM sim_kyc_documents k JOIN sim_customer_directory d ON d.user_id=k.user_id ORDER BY k.uploaded_at DESC LIMIT 100`).all<SimCustomerActivity>(),
  ]);
  const customerActivity=activityResults.flatMap(result=>result.results)
    .sort((left,right)=>right.occurredAt.localeCompare(left.occurredAt)).slice(0,300);
  return {
    customers: customers.results,
    accounts: accounts.results,
    transactions: transactions.results,
    transferRequests: transferRequests.results,
    stopCodes: stopCodes.results,
    transferControls: transferControls.results,
    depositMethods: depositMethods.results,
    depositRequests: depositRequests.results,
    statementBatches: statementBatches.results,
    virtualCardRequests: virtualCardRequests.results,
    scheduledTransfers: scheduledTransfers.results,
    kycDocuments:kycDocuments.results,
    brandProfiles:brandProfiles.results,
    processingFeeRules:processingFeeRules.results,
    customerActivity,
  };
}

/** Customer-safe projection of the banking dataset. The filtering happens on
 * the server so a customer browser never receives another customer's records
 * or administrative controls. */
export async function getSimulationCustomerBank(userId: string) {
  const bank = await getSimulationBank();
  const hidden = await database().prepare(`SELECT transaction_id AS transactionId
    FROM sim_customer_hidden_transactions`).all<{transactionId:string}>();
  const hiddenIds = new Set(hidden.results.map((item)=>item.transactionId));
  const accounts = bank.accounts.filter((account) => account.userId === userId);
  const accountIds = new Set(accounts.map((account) => account.id));
  return {
    customers: bank.customers.filter((customer) => customer.userId === userId),
    accounts,
    transactions: bank.transactions.filter((transaction) => accountIds.has(transaction.accountId) && !hiddenIds.has(transaction.id)),
    transferRequests: bank.transferRequests.filter((request) => request.userId === userId),
    stopCodes: [],
    transferControls: [],
    depositMethods: bank.depositMethods.filter((method) => method.userId === userId),
    depositRequests: bank.depositRequests.filter((request) => request.userId === userId),
    statementBatches: bank.statementBatches.filter((batch) => accountIds.has(batch.accountId)),
    virtualCardRequests: bank.virtualCardRequests.filter((request)=>request.userId===userId),
    scheduledTransfers: bank.scheduledTransfers.filter((transfer)=>transfer.userId===userId),
    kycDocuments:bank.kycDocuments.filter((document)=>document.userId===userId),
    brandProfiles:bank.brandProfiles.filter((brand)=>brand.active),
    processingFeeRules:bank.processingFeeRules.filter((rule)=>rule.active),
    customerActivity:bank.customerActivity.filter((activity)=>activity.userId===userId),
  };
}

export async function saveSimulationKycDocument(input:{userId:string;documentType:string;originalFilename:string;mediaType:string;byteSize:number;objectKey:string}) {
  await initializeSimulationBank();
  const customer=await database().prepare("SELECT user_id FROM sim_customer_directory WHERE user_id=?")
    .bind(input.userId).first<{user_id:string}>();
  if(!customer)throw new Error("CUSTOMER_NOT_FOUND");
  if(!input.documentType.trim()||!input.originalFilename.trim()||input.byteSize<=0)throw new Error("KYC_DOCUMENT_INVALID");
  const id=crypto.randomUUID();const uploadedAt=new Date().toISOString();
  await database().batch([database().prepare(`INSERT INTO sim_kyc_documents
    (id,user_id,document_type,original_filename,media_type,byte_size,object_key,status,uploaded_at,reviewed_at,reviewed_by)
    VALUES (?,?,?,?,?,?,?,'UPLOADED',?,NULL,NULL)`)
    .bind(id,input.userId,input.documentType.trim(),input.originalFilename.trim(),input.mediaType,input.byteSize,input.objectKey,uploadedAt)]);
  return {id,status:"UPLOADED" as const,uploadedAt};
}

export async function getSimulationKycDocument(documentId:string) {
  await initializeSimulationBank();
  const document=await database().prepare(`SELECT id,user_id AS userId,original_filename AS originalFilename,
    media_type AS mediaType,object_key AS objectKey FROM sim_kyc_documents WHERE id=?`).bind(documentId)
    .first<{id:string;userId:string;originalFilename:string;mediaType:string;objectKey:string}>();
  if(!document)throw new Error("KYC_DOCUMENT_NOT_FOUND");
  return document;
}

export async function reviewSimulationKycDocument(input:{documentId:string;decision:"REVIEWED"|"REJECTED";reviewedBy:string}) {
  await initializeSimulationBank();
  const reviewedAt=new Date().toISOString();
  await database().batch([database().prepare(`UPDATE sim_kyc_documents SET status=?,reviewed_at=?,reviewed_by=?
    WHERE id=?`).bind(input.decision,reviewedAt,input.reviewedBy,input.documentId)]);
  return {id:input.documentId,status:input.decision,reviewedAt};
}

export async function getActiveSimulationBrand() {
  await initializeSimulationBank();
  return database().prepare(`SELECT id,bank_name AS bankName,short_name AS shortName,
    support_email AS supportEmail,logo_url AS logoUrl,primary_color AS primaryColor,active,
    updated_at AS updatedAt,updated_by AS updatedBy FROM sim_brand_profiles WHERE active=1 LIMIT 1`)
    .first<SimBrandProfile>();
}

export async function saveSimulationBrand(input:{id?:string;bankName:string;shortName:string;supportEmail:string;logoUrl?:string|null;primaryColor:string;updatedBy:string}) {
  await initializeSimulationBank();
  if(!input.bankName.trim()||!input.shortName.trim()||!/^\S+@\S+\.\S+$/.test(input.supportEmail))throw new Error("BRAND_DETAILS_INVALID");
  if(!/^#[0-9a-fA-F]{6}$/.test(input.primaryColor))throw new Error("BRAND_COLOR_INVALID");
  const id=input.id||`brand-${crypto.randomUUID()}`;const updatedAt=new Date().toISOString();
  await database().batch([database().prepare(`INSERT INTO sim_brand_profiles
    (id,bank_name,short_name,support_email,logo_url,primary_color,active,updated_at,updated_by)
    VALUES (?,?,?,?,?,?,0,?,?) ON CONFLICT(id) DO UPDATE SET bank_name=excluded.bank_name,
    short_name=excluded.short_name,support_email=excluded.support_email,logo_url=excluded.logo_url,
    primary_color=excluded.primary_color,updated_at=excluded.updated_at,updated_by=excluded.updated_by`)
    .bind(id,input.bankName.trim(),input.shortName.trim(),input.supportEmail.trim().toLowerCase(),input.logoUrl?.trim()||null,input.primaryColor,updatedAt,input.updatedBy)]);
  return {id,updatedAt};
}

export async function activateSimulationBrand(id:string,updatedBy:string) {
  await initializeSimulationBank();const updatedAt=new Date().toISOString();
  const brand=await database().prepare("SELECT id FROM sim_brand_profiles WHERE id=?").bind(id).first<{id:string}>();
  if(!brand)throw new Error("BRAND_NOT_FOUND");
  await database().batch([
    database().prepare("UPDATE sim_brand_profiles SET active=0 WHERE active=1"),
    database().prepare("UPDATE sim_brand_profiles SET active=1,updated_at=?,updated_by=? WHERE id=?").bind(updatedAt,updatedBy,id),
  ]);
  return {id,active:true,updatedAt};
}

export async function saveSimulationProcessingFeeRule(input:Omit<SimProcessingFeeRule,"updatedAt"|"updatedBy">&{updatedBy:string}) {
  await initializeSimulationBank();
  if(input.percentageBps<0||input.percentageBps>10000||input.fixedMinor<0||input.minimumMinor<0||input.maximumMinor!==null&&input.maximumMinor<input.minimumMinor)throw new Error("FEE_RULE_INVALID");
  const updatedAt=new Date().toISOString();
  await database().batch([database().prepare(`INSERT INTO sim_processing_fee_rules
    (rail,percentage_bps,fixed_minor,minimum_minor,maximum_minor,active,updated_at,updated_by)
    VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(rail) DO UPDATE SET percentage_bps=excluded.percentage_bps,
    fixed_minor=excluded.fixed_minor,minimum_minor=excluded.minimum_minor,maximum_minor=excluded.maximum_minor,
    active=excluded.active,updated_at=excluded.updated_at,updated_by=excluded.updated_by`)
    .bind(input.rail,input.percentageBps,input.fixedMinor,input.minimumMinor,input.maximumMinor,input.active,updatedAt,input.updatedBy)]);
  return {...input,updatedAt};
}

export function calculateSimulationProcessingFee(rule:Pick<SimProcessingFeeRule,"percentageBps"|"fixedMinor"|"minimumMinor"|"maximumMinor"|"active">,amountMinor:number) {
  if(!rule.active||amountMinor<=0)return 0;
  const calculated=Math.round(amountMinor*rule.percentageBps/10000)+rule.fixedMinor;
  return Math.min(rule.maximumMinor??Number.MAX_SAFE_INTEGER,Math.max(rule.minimumMinor,calculated));
}

type SimWebsiteRevisionRow = {
  id: string;
  revisionNumber: number;
  status: SimWebsiteRevision["status"];
  contentJson: string;
  changeReason: string;
  createdBy: string;
  scheduledFor: string | null;
  publishedAt: string | null;
  createdAt: string;
};

function websiteContentFromJson(value: string): SimWebsiteContent {
  try {
    const parsed = JSON.parse(value) as Partial<SimWebsiteContent>;
    return {
      heroHeading: typeof parsed.heroHeading === "string" ? parsed.heroHeading : DEFAULT_SIM_WEBSITE_CONTENT.heroHeading,
      heroMessage: typeof parsed.heroMessage === "string" ? parsed.heroMessage : DEFAULT_SIM_WEBSITE_CONTENT.heroMessage,
      simulationBanner: typeof parsed.simulationBanner === "string" ? parsed.simulationBanner : DEFAULT_SIM_WEBSITE_CONTENT.simulationBanner,
      supportEmail: typeof parsed.supportEmail === "string" ? parsed.supportEmail : DEFAULT_SIM_WEBSITE_CONTENT.supportEmail,
      showChecking: typeof parsed.showChecking === "boolean" ? parsed.showChecking : true,
      showSavings: typeof parsed.showSavings === "boolean" ? parsed.showSavings : true,
      showLoans: typeof parsed.showLoans === "boolean" ? parsed.showLoans : true,
      maintenanceMode: typeof parsed.maintenanceMode === "boolean" ? parsed.maintenanceMode : false,
    };
  } catch {
    return DEFAULT_SIM_WEBSITE_CONTENT;
  }
}

function websiteRevisionFromRow(row: SimWebsiteRevisionRow): SimWebsiteRevision {
  return {
    id: row.id,
    revisionNumber: Number(row.revisionNumber),
    status: row.status,
    content: websiteContentFromJson(row.contentJson),
    changeReason: row.changeReason,
    createdBy: row.createdBy,
    scheduledFor: row.scheduledFor,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
  };
}

async function publishDueSimulationWebsiteRevision() {
  const db = database();
  const now = new Date().toISOString();
  const due = await db.prepare(`SELECT id FROM sim_website_content_revisions
    WHERE content_key = 'PUBLIC_SITE' AND status = 'SCHEDULED'
      AND scheduled_for IS NOT NULL AND scheduled_for <= ?
    ORDER BY scheduled_for DESC, revision_number DESC LIMIT 1`)
    .bind(now).first<{ id: string }>();
  if (!due) return;
  await db.batch([
    db.prepare(`UPDATE sim_website_content_revisions SET status = 'ARCHIVED'
      WHERE content_key = 'PUBLIC_SITE' AND status = 'PUBLISHED'`),
    db.prepare(`UPDATE sim_website_content_revisions
      SET status = 'PUBLISHED', published_at = ? WHERE id = ? AND status = 'SCHEDULED'`)
      .bind(now, due.id),
  ]);
}

async function websiteRevisionRows(limit = 25) {
  const result = await database().prepare(`SELECT id,
    revision_number AS revisionNumber, status, content_json AS contentJson,
    change_reason AS changeReason, created_by AS createdBy,
    scheduled_for AS scheduledFor, published_at AS publishedAt,
    created_at AS createdAt
    FROM sim_website_content_revisions WHERE content_key = 'PUBLIC_SITE'
    ORDER BY revision_number DESC LIMIT ?`).bind(limit).all<SimWebsiteRevisionRow>();
  return result.results.map(websiteRevisionFromRow);
}

export async function getPublicSimulationWebsite() {
  await initializeSimulationBank();
  await publishDueSimulationWebsiteRevision();
  const row = await database().prepare(`SELECT id,
    revision_number AS revisionNumber, status, content_json AS contentJson,
    change_reason AS changeReason, created_by AS createdBy,
    scheduled_for AS scheduledFor, published_at AS publishedAt,
    created_at AS createdAt
    FROM sim_website_content_revisions
    WHERE content_key = 'PUBLIC_SITE' AND status = 'PUBLISHED' LIMIT 1`)
    .first<SimWebsiteRevisionRow>();
  const revision = row ? websiteRevisionFromRow(row) : null;
  return {
    content: revision?.content ?? DEFAULT_SIM_WEBSITE_CONTENT,
    revisionNumber: revision?.revisionNumber ?? 1,
    publishedAt: revision?.publishedAt ?? null,
  };
}

export async function getSimulationWebsiteAdminState() {
  await initializeSimulationBank();
  await publishDueSimulationWebsiteRevision();
  const revisions = await websiteRevisionRows();
  const published = revisions.find((revision) => revision.status === "PUBLISHED") ?? null;
  return {
    published: published?.content ?? DEFAULT_SIM_WEBSITE_CONTENT,
    publishedRevision: published,
    revisions,
  };
}

export async function saveSimulationWebsiteRevision(input: {
  content: SimWebsiteContent;
  publicationStatus: "PUBLISHED" | "DRAFT" | "SCHEDULED";
  scheduledFor?: string | null;
  changeReason: string;
  createdBy: string;
}) {
  const content: SimWebsiteContent = {
    heroHeading: input.content.heroHeading?.trim(),
    heroMessage: input.content.heroMessage?.trim(),
    simulationBanner: input.content.simulationBanner?.trim(),
    supportEmail: input.content.supportEmail?.trim().toLowerCase(),
    showChecking: Boolean(input.content.showChecking),
    showSavings: Boolean(input.content.showSavings),
    showLoans: Boolean(input.content.showLoans),
    maintenanceMode: Boolean(input.content.maintenanceMode),
  };
  const reason = input.changeReason?.trim();
  if (content.heroHeading.length < 5 || content.heroHeading.length > 120) throw new Error("WEBSITE_HEADING_INVALID");
  if (content.heroMessage.length < 10 || content.heroMessage.length > 500) throw new Error("WEBSITE_MESSAGE_INVALID");
  if (content.simulationBanner.length < 10 || content.simulationBanner.length > 160) throw new Error("WEBSITE_BANNER_INVALID");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.supportEmail)) throw new Error("WEBSITE_SUPPORT_EMAIL_INVALID");
  if (reason.length < 8 || reason.length > 500) throw new Error("WEBSITE_CHANGE_REASON_INVALID");

  let scheduledFor: string | null = null;
  if (input.publicationStatus === "SCHEDULED") {
    const scheduled = new Date(input.scheduledFor ?? "");
    if (!Number.isFinite(scheduled.getTime()) || scheduled.getTime() <= Date.now()) throw new Error("WEBSITE_SCHEDULE_INVALID");
    scheduledFor = scheduled.toISOString();
  }

  await initializeSimulationBank();
  const db = database();
  const latest = await db.prepare(`SELECT COALESCE(MAX(revision_number), 0) AS revisionNumber
    FROM sim_website_content_revisions WHERE content_key = 'PUBLIC_SITE'`)
    .first<{ revisionNumber: number }>();
  const revisionNumber = Number(latest?.revisionNumber ?? 0) + 1;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const publishedAt = input.publicationStatus === "PUBLISHED" ? now : null;
  const statements = [];
  if (input.publicationStatus === "PUBLISHED") {
    statements.push(db.prepare(`UPDATE sim_website_content_revisions SET status = 'ARCHIVED'
      WHERE content_key = 'PUBLIC_SITE' AND status = 'PUBLISHED'`));
  }
  statements.push(db.prepare(`INSERT INTO sim_website_content_revisions
    (id, content_key, revision_number, status, content_json, change_reason,
     created_by, scheduled_for, published_at, created_at)
    VALUES (?, 'PUBLIC_SITE', ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, revisionNumber, input.publicationStatus, JSON.stringify(content), reason,
      input.createdBy, scheduledFor, publishedAt, now));
  await db.batch(statements);
  const state = await getSimulationWebsiteAdminState();
  return { id, revisionNumber, status: input.publicationStatus, state };
}

function simulationEmailForUser(userId: string) {
  return userId === "C-882088" ? "maya@example.test"
    : userId === "C-881972" ? "daniel@example.test"
      : "alex@example.test";
}

function escapeEmailHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderNorthstarEmail(subject: string, body: string) {
  const safeSubject = escapeEmailHtml(subject);
  const safeBody = escapeEmailHtml(body).replaceAll("\n", "<br/>");
  return `<!doctype html><html><body style="margin:0;background:#f3f6f9;font-family:Arial,sans-serif;color:#20364a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background:#ffffff;border:1px solid #dbe4ec"><tr><td style="padding:22px 28px;background:#102d49;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:.08em">NORTHSTAR</td></tr><tr><td style="padding:30px 28px"><h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#17324a">${safeSubject}</h1><p style="margin:0;font-size:15px;line-height:1.7;color:#52677a">${safeBody}</p></td></tr><tr><td style="padding:18px 28px;border-top:1px solid #e4eaf0;color:#7b8997;font-size:12px">This automated message was sent by Northstar. Do not reply with passwords or verification codes.</td></tr></table></td></tr></table></body></html>`;
}

export async function queueSimulationEmailAlert(input: {
  userId: string;
  email?: string;
  eventType: "SIGNUP" | "LOGIN" | "TRANSFER" | "DEPOSIT";
  subject: string;
  body: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const email = input.email?.trim().toLowerCase() || simulationEmailForUser(input.userId);
  await db.batch([
    db.prepare(`INSERT INTO sim_email_alerts
      (id, user_id, email, event_type, subject, body, status, provider_message_id,
       failure_message, created_at, sent_at)
      VALUES (?, ?, ?, ?, ?, ?, 'QUEUED', NULL, NULL, ?, NULL)`)
      .bind(id, input.userId, email, input.eventType, input.subject, input.body, createdAt),
  ]);

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (!resendApiKey) return { id, status: "QUEUED" as const };
  const resendFrom = process.env.RESEND_FROM_EMAIL?.trim();
  if (!resendFrom) {
    await db.batch([db.prepare(`UPDATE sim_email_alerts SET status = 'FAILED',
      failure_message = ? WHERE id = ?`).bind("RESEND_FROM_EMAIL_MISSING", id)]);
    return { id, status: "FAILED" as const };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${resendApiKey}`,
        "user-agent": "northstar-banking/1.0",
        "idempotency-key": `northstar-email-${id}`,
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [email],
        subject: input.subject,
        text: input.body,
        html: renderNorthstarEmail(input.subject, input.body),
        ...(process.env.RESEND_REPLY_TO?.trim()
          ? { reply_to: process.env.RESEND_REPLY_TO.trim() }
          : {}),
        tags: [{ name: "event_type", value: input.eventType.toLowerCase() }],
      }),
    });
    const result = await response.json().catch(() => ({})) as { id?: string; message?: string; name?: string };
    if (!response.ok) throw new Error(`RESEND_${response.status}_${result.name ?? result.message ?? "DELIVERY_FAILED"}`);
    if (!result.id) throw new Error("RESEND_RESPONSE_ID_MISSING");
    const sentAt = new Date().toISOString();
    await db.batch([
      db.prepare(`UPDATE sim_email_alerts SET status = 'SENT',
        provider_message_id = ?, sent_at = ? WHERE id = ?`)
        .bind(result.id ?? null, sentAt, id),
    ]);
    return { id, status: "SENT" as const };
  } catch (error) {
    await db.batch([
      db.prepare(`UPDATE sim_email_alerts SET status = 'FAILED',
        failure_message = ? WHERE id = ?`)
        .bind(error instanceof Error ? error.message : "EMAIL_DELIVERY_FAILED", id),
    ]);
    return { id, status: "FAILED" as const };
  }
}

async function hashEmailOtp(challengeId: string, email: string, code: string) {
  const configured=process.env.EMAIL_OTP_SECRET;
  if(!configured&&process.env.NODE_ENV==="production")throw new Error("EMAIL_OTP_SECRET_REQUIRED");
  const secret = configured ?? "northstar-local-email-otp-secret-change-me";
  const payload = `${challengeId}:${email.trim().toLowerCase()}:${code}:${secret}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createSixDigitOtp() {
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);
  return String(100000 + (random[0] % 900000));
}

export async function requestCustomerEmailOtp(input: {
  purpose: "SIGNUP" | "LOGIN";
  email: string;
  userId?: string;
  payload?: Record<string, unknown>;
}) {
  await initializeSimulationBank();
  const db = database();
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("EMAIL_INVALID");
  const latest = await db.prepare(`SELECT created_at AS createdAt
    FROM sim_email_verification_challenges
    WHERE email = ? AND purpose = ? AND used_at IS NULL
    ORDER BY created_at DESC LIMIT 1`).bind(email, input.purpose).first<{ createdAt: string }>();
  if (latest && Date.now() - new Date(latest.createdAt).getTime() < 60_000) {
    throw new Error("EMAIL_OTP_RATE_LIMITED");
  }
  const id = crypto.randomUUID();
  const code = createSixDigitOtp();
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString();
  await db.batch([
    db.prepare(`UPDATE sim_email_verification_challenges SET used_at = ?
      WHERE email = ? AND purpose = ? AND used_at IS NULL`).bind(createdAt, email, input.purpose),
    db.prepare(`INSERT INTO sim_email_verification_challenges
      (id, purpose, email, user_id, code_hash, payload_json, attempts,
       max_attempts, expires_at, used_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, 5, ?, NULL, ?)`)
      .bind(id, input.purpose, email, input.userId ?? null,
        await hashEmailOtp(id, email, code), JSON.stringify(input.payload ?? {}), expiresAt, createdAt),
  ]);
  await queueSimulationEmailAlert({
    userId: input.userId ?? `APPLICANT-${id}`,
    email,
    eventType: input.purpose,
    subject: input.purpose === "LOGIN" ? "Your Northstar login verification code" : "Verify your Northstar email address",
    body: `Your Northstar verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
  });
  return {
    challengeId: id,
    expiresAt,
    emailHint: email.replace(/^(.{2}).*(@.*)$/, "$1••••$2"),
    ...(process.env.NODE_ENV === "production" ? {} : { developmentOtp: code }),
  };
}

export async function verifyCustomerEmailOtp(input: {
  challengeId: string;
  purpose: "SIGNUP" | "LOGIN";
  code: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const challenge = await db.prepare(`SELECT id, purpose, email, user_id AS userId,
      code_hash AS codeHash, payload_json AS payloadJson, attempts, max_attempts AS maxAttempts,
      expires_at AS expiresAt, used_at AS usedAt
    FROM sim_email_verification_challenges WHERE id = ?`).bind(input.challengeId).first<{
      id: string; purpose: "SIGNUP" | "LOGIN"; email: string; userId: string | null;
      codeHash: string; payloadJson: string; attempts: number; maxAttempts: number;
      expiresAt: string; usedAt: string | null;
    }>();
  if (!challenge || challenge.purpose !== input.purpose || challenge.usedAt) throw new Error("EMAIL_OTP_INVALID");
  if (new Date(challenge.expiresAt).getTime() <= Date.now()) throw new Error("EMAIL_OTP_EXPIRED");
  if (challenge.attempts >= challenge.maxAttempts) throw new Error("EMAIL_OTP_ATTEMPTS_EXCEEDED");
  const suppliedHash = await hashEmailOtp(challenge.id, challenge.email, input.code.trim());
  if (suppliedHash !== challenge.codeHash) {
    await db.batch([db.prepare("UPDATE sim_email_verification_challenges SET attempts = attempts + 1 WHERE id = ?")
      .bind(challenge.id)]);
    throw new Error("EMAIL_OTP_INVALID");
  }
  const usedAt = new Date().toISOString();
  const [claimResult] = await db.batch([db.prepare(`UPDATE sim_email_verification_challenges
    SET used_at = ? WHERE id = ? AND used_at IS NULL AND attempts < max_attempts`)
    .bind(usedAt, challenge.id)]);
  const claimed = claimResult as { meta?: { changes?: number } };
  if (Number(claimed.meta?.changes ?? 0) !== 1) throw new Error("EMAIL_OTP_INVALID");
  return {
    email: challenge.email,
    userId: challenge.userId,
    payload: JSON.parse(challenge.payloadJson) as Record<string, unknown>,
    verifiedAt: usedAt,
  };
}

export async function requestCustomerPasswordResetOtp(emailInput: string) {
  await initializeSimulationBank();
  const db = database();
  const email = emailInput.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("EMAIL_INVALID");
  const customer = await db.prepare(`SELECT d.user_id AS userId
    FROM sim_customer_directory d
    JOIN sim_customer_credentials c ON c.user_id = d.user_id
    LEFT JOIN sim_customer_account_statuses s ON s.user_id = d.user_id
    WHERE d.email = ? AND COALESCE(s.status, 'IN_REVIEW') = 'ACTIVE'`)
    .bind(email).first<{ userId:string }>();

  // Return the same shaped response for unknown/inactive addresses to avoid account discovery.
  if (!customer) {
    return {
      challengeId: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
      emailHint: email.replace(/^(.{2}).*(@.*)$/, "$1••••$2"),
    };
  }

  const latest = await db.prepare(`SELECT created_at AS createdAt
    FROM sim_password_reset_challenges WHERE email = ? AND used_at IS NULL
    ORDER BY created_at DESC LIMIT 1`).bind(email).first<{ createdAt:string }>();
  if (latest && Date.now() - new Date(latest.createdAt).getTime() < 60_000) {
    throw new Error("EMAIL_OTP_RATE_LIMITED");
  }
  const id = crypto.randomUUID();
  const code = createSixDigitOtp();
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString();
  await db.batch([
    db.prepare("UPDATE sim_password_reset_challenges SET used_at = ? WHERE email = ? AND used_at IS NULL")
      .bind(createdAt, email),
    db.prepare(`INSERT INTO sim_password_reset_challenges
      (id, email, user_id, code_hash, attempts, max_attempts, expires_at, used_at, created_at)
      VALUES (?, ?, ?, ?, 0, 5, ?, NULL, ?)`)
      .bind(id, email, customer.userId, await hashEmailOtp(id, email, code), expiresAt, createdAt),
  ]);
  await queueSimulationEmailAlert({
    userId: customer.userId,
    email,
    eventType: "LOGIN",
    subject: "Reset your Northstar online banking password",
    body: `Your Northstar password reset code is ${code}. It expires in 10 minutes. If you did not request a password reset, you can ignore this email.`,
  });
  return {
    challengeId: id,
    expiresAt,
    emailHint: email.replace(/^(.{2}).*(@.*)$/, "$1••••$2"),
    ...(process.env.NODE_ENV === "production" ? {} : { developmentOtp: code }),
  };
}

export async function completeCustomerPasswordReset(command: {
  challengeId:string;
  code:string;
  newPassword:string;
}) {
  await initializeSimulationBank();
  const db = database();
  if (command.newPassword.length < 12 || !/[A-Z]/.test(command.newPassword)
    || !/[a-z]/.test(command.newPassword) || !/\d/.test(command.newPassword)
    || !/[^A-Za-z0-9]/.test(command.newPassword)) throw new Error("NEW_PASSWORD_TOO_WEAK");
  const challenge = await db.prepare(`SELECT r.id, r.email, r.user_id AS userId, r.code_hash AS codeHash,
      r.attempts, r.max_attempts AS maxAttempts, r.expires_at AS expiresAt, r.used_at AS usedAt,
      c.password_hash AS passwordHash
    FROM sim_password_reset_challenges r
    JOIN sim_customer_credentials c ON c.user_id = r.user_id
    WHERE r.id = ?`).bind(command.challengeId).first<{
      id:string; email:string; userId:string; codeHash:string; attempts:number;
      maxAttempts:number; expiresAt:string; usedAt:string|null; passwordHash:string;
    }>();
  if (!challenge || challenge.usedAt) throw new Error("PASSWORD_RESET_CODE_INVALID");
  if (new Date(challenge.expiresAt).getTime() <= Date.now()) throw new Error("PASSWORD_RESET_CODE_EXPIRED");
  if (challenge.attempts >= challenge.maxAttempts) throw new Error("PASSWORD_RESET_ATTEMPTS_EXCEEDED");
  const suppliedHash = await hashEmailOtp(challenge.id, challenge.email, command.code.trim());
  if (suppliedHash !== challenge.codeHash) {
    await db.batch([db.prepare("UPDATE sim_password_reset_challenges SET attempts = attempts + 1 WHERE id = ?")
      .bind(challenge.id)]);
    throw new Error("PASSWORD_RESET_CODE_INVALID");
  }
  if (await passwordMatches(command.newPassword, challenge.passwordHash)) throw new Error("NEW_PASSWORD_MUST_DIFFER");
  const now = new Date().toISOString();
  const claimMarker = `${now}#${crypto.randomUUID()}`;
  const passwordHash = await derivePasswordHash(command.newPassword);
  const [claim] = await db.batch([
    db.prepare(`UPDATE sim_password_reset_challenges SET used_at = ?
      WHERE id = ? AND used_at IS NULL AND attempts < max_attempts`).bind(claimMarker, challenge.id),
    db.prepare(`UPDATE sim_customer_credentials SET password_hash = ?, password_reset_required = 0,
      changed_by = 'CUSTOMER_RECOVERY', changed_at = ?
      WHERE user_id = ? AND EXISTS (
        SELECT 1 FROM sim_password_reset_challenges WHERE id = ? AND used_at = ?
      )`).bind(passwordHash, now, challenge.userId, challenge.id, claimMarker),
    db.prepare(`UPDATE sim_customer_login_sessions SET revoked_at = ?
      WHERE user_id = ? AND revoked_at IS NULL AND EXISTS (
        SELECT 1 FROM sim_password_reset_challenges WHERE id = ? AND used_at = ?
      )`).bind(now, challenge.userId, challenge.id, claimMarker),
  ]);
  const claimed = claim as { meta?: { changes?:number } };
  if (Number(claimed.meta?.changes ?? 0) !== 1) throw new Error("PASSWORD_RESET_CODE_INVALID");
  await queueSimulationEmailAlert({
    userId: challenge.userId,
    email: challenge.email,
    eventType: "LOGIN",
    subject: "Your Northstar password was changed",
    body: `Your online banking password was changed at ${now}. All existing customer sessions were signed out. If this was not you, contact support immediately.`,
  });
  return { ok:true, changedAt:now };
}

export async function createFreshCustomerProfile(input: {
  firstName: string;
  lastName: string;
  email: string;
  source: "CUSTOMER" | "ADMIN";
  emailVerifiedAt?: string | null;
}) {
  await initializeSimulationBank();
  const db = database();
  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("CUSTOMER_DETAILS_INVALID");
  const existing = await db.prepare("SELECT user_id AS userId FROM sim_customer_directory WHERE email = ?")
    .bind(email).first<{ userId: string }>();
  if (existing) throw new Error("CUSTOMER_EMAIL_ALREADY_EXISTS");
  const idPart = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  const userId = `C-${idPart}`;
  const now = new Date().toISOString();
  await db.batch([
    db.prepare(`INSERT INTO sim_customer_directory
      (user_id, first_name, last_name, email, status, email_verified_at,
       created_source, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'PENDING', ?, ?, ?, ?)`)
      .bind(userId, firstName, lastName, email, input.emailVerifiedAt ?? null, input.source, now, now),
    db.prepare(`INSERT INTO sim_customer_profiles
      (user_id, profile_photo_data_url, updated_at) VALUES (?, NULL, ?)`)
      .bind(userId, now),
    db.prepare(`INSERT INTO sim_customer_transfer_controls
      (user_id, external_mode, preferred_stop_code, updated_at)
      VALUES (?, 'STANDARD_APPROVAL', NULL, ?)`).bind(userId, now),
    db.prepare(`INSERT INTO sim_customer_account_statuses
      (user_id, status, updated_by, reason, updated_at)
      VALUES (?, 'IN_REVIEW', ?, 'New customer awaiting KYC approval', ?)`)
      .bind(userId, input.source, now),
  ]);
  return {
    userId,
    firstName,
    lastName,
    email,
    status: "PENDING" as const,
    accountStatus: "IN_REVIEW" as const,
    emailVerifiedAt: input.emailVerifiedAt ?? null,
    createdSource: input.source,
    createdAt: now,
    accountCount: 0,
    transactionCount: 0,
    balanceMinor: 0,
  };
}

export async function decideSimulationCustomerKyc(command: {
  userId: string;
  decision: "APPROVE" | "REJECT";
  reason: string;
  decidedBy: string;
}) {
  await initializeSimulationBank();
  const db = database();
  if (!command.reason.trim()) throw new Error("KYC_DECISION_REASON_REQUIRED");
  const customer = await db.prepare(`SELECT user_id AS userId, first_name AS firstName,
    last_name AS lastName, email FROM sim_customer_directory WHERE user_id = ?`)
    .bind(command.userId).first<{ userId:string; firstName:string; lastName:string; email:string }>();
  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  const now = new Date().toISOString();
  if (command.decision === "REJECT") {
    await db.batch([
      db.prepare("UPDATE sim_customer_directory SET status = 'PENDING', updated_at = ? WHERE user_id = ?")
        .bind(now, customer.userId),
      db.prepare(`INSERT INTO sim_customer_account_statuses
        (user_id, status, updated_by, reason, updated_at) VALUES (?, 'INACTIVE', ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET status = excluded.status,
          updated_by = excluded.updated_by, reason = excluded.reason, updated_at = excluded.updated_at`)
        .bind(customer.userId, command.decidedBy, command.reason.trim(), now),
      db.prepare("UPDATE sim_customer_login_sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL")
        .bind(now, customer.userId),
    ]);
    await queueSimulationEmailAlert({
      userId: customer.userId, email: customer.email, eventType: "LOGIN",
      subject: "Northstar application review update",
      body: "Your account application was not approved. Contact support if you need more information.",
    });
    return { userId: customer.userId, status: "INACTIVE" as const, accountCreated: false };
  }

  const existingAccount = await db.prepare("SELECT id FROM sim_accounts WHERE user_id = ? LIMIT 1")
    .bind(customer.userId).first<{ id:string }>();
  const accountId = existingAccount?.id ?? `acct-${crypto.randomUUID()}`;
  const accountNumber = `77${String(Math.floor(Math.random() * 100_000_000)).padStart(8,"0")}`;
  const credential = await db.prepare("SELECT user_id FROM sim_customer_credentials WHERE user_id = ?")
    .bind(customer.userId).first<{ user_id:string }>();
  const statements = [
    db.prepare("UPDATE sim_customer_directory SET status = 'ACTIVE', updated_at = ? WHERE user_id = ?")
      .bind(now, customer.userId),
    db.prepare(`INSERT INTO sim_customer_account_statuses
      (user_id, status, updated_by, reason, updated_at) VALUES (?, 'ACTIVE', ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET status = excluded.status,
        updated_by = excluded.updated_by, reason = excluded.reason, updated_at = excluded.updated_at`)
      .bind(customer.userId, command.decidedBy, command.reason.trim(), now),
  ];
  if (!existingAccount) {
    statements.push(db.prepare(`INSERT INTO sim_accounts
      (id, user_id, customer_name, type, account_number, balance_minor, updated_at)
      VALUES (?, ?, ?, 'CHECKING', ?, 0, ?)`)
      .bind(accountId, customer.userId, `${customer.firstName} ${customer.lastName}`, accountNumber, now));
  }
  if (!credential) {
    statements.push(db.prepare(`INSERT INTO sim_customer_credentials
      (user_id, password_hash, password_reset_required, changed_by, changed_at)
      VALUES (?, ?, 1, ?, ?)`)
      .bind(customer.userId, await derivePasswordHash(randomBase64(24)), command.decidedBy, now));
  }
  await db.batch(statements);
  await queueSimulationEmailAlert({
    userId: customer.userId, email: customer.email, eventType: "LOGIN",
    subject: "Your Northstar account is active",
    body: "Your application was approved and your checking account is now active. Contact account services to establish your initial password.",
  });
  return { userId: customer.userId, status: "ACTIVE" as const, accountCreated: !existingAccount, accountId };
}

export async function updateSimulationCustomerAccountStatus(command: {
  userId: string;
  status: "ACTIVE" | "INACTIVE" | "IN_REVIEW";
  reason: string;
  updatedBy: string;
}) {
  await initializeSimulationBank();
  const db = database();
  if (!command.reason.trim()) throw new Error("STATUS_REASON_REQUIRED");
  const customer = await db.prepare(`SELECT email, first_name AS firstName,
    last_name AS lastName FROM sim_customer_directory WHERE user_id = ?`)
    .bind(command.userId).first<{ email:string; firstName:string; lastName:string }>();
  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  const directoryStatus = command.status === "ACTIVE" ? "ACTIVE" : command.status === "INACTIVE" ? "SUSPENDED" : "PENDING";
  const now = new Date().toISOString();
  const statements = [
    db.prepare("UPDATE sim_customer_directory SET status = ?, updated_at = ? WHERE user_id = ?")
      .bind(directoryStatus, now, command.userId),
    db.prepare(`INSERT INTO sim_customer_account_statuses
      (user_id, status, updated_by, reason, updated_at) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET status = excluded.status,
        updated_by = excluded.updated_by, reason = excluded.reason, updated_at = excluded.updated_at`)
      .bind(command.userId, command.status, command.updatedBy, command.reason.trim(), now),
  ];
  let accountCreated = false;
  if (command.status === "ACTIVE") {
    const existingAccount = await db.prepare("SELECT id FROM sim_accounts WHERE user_id = ? LIMIT 1")
      .bind(command.userId).first<{id:string}>();
    if (!existingAccount) {
      accountCreated = true;
      statements.push(db.prepare(`INSERT INTO sim_accounts
        (id, user_id, customer_name, type, account_number, balance_minor, updated_at)
        VALUES (?, ?, ?, 'CHECKING', ?, 0, ?)`)
        .bind(`acct-${crypto.randomUUID()}`,command.userId,`${customer.firstName} ${customer.lastName}`,
          `77${String(Math.floor(Math.random()*100_000_000)).padStart(8,"0")}`,now));
    }
  }
  if (command.status !== "ACTIVE") {
    statements.push(db.prepare("UPDATE sim_customer_login_sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL")
      .bind(now, command.userId));
  }
  await db.batch(statements);
  await queueSimulationEmailAlert({
    userId: command.userId, email: customer.email, eventType: "LOGIN",
    subject: "Northstar account status updated",
    body: `Your account status is now ${command.status === "IN_REVIEW" ? "In review" : command.status.toLowerCase()}.`,
  });
  return { userId: command.userId, status: command.status, updatedAt: now, accountCreated };
}

export async function resetSimulationCustomerPassword(command: {
  userId: string;
  temporaryPassword: string;
  reason: string;
  changedBy: string;
}) {
  await initializeSimulationBank();
  const db = database();
  if (command.temporaryPassword.length < 12 || !/[A-Z]/.test(command.temporaryPassword)
    || !/[a-z]/.test(command.temporaryPassword) || !/\d/.test(command.temporaryPassword)
    || !/[^A-Za-z0-9]/.test(command.temporaryPassword)) throw new Error("TEMPORARY_PASSWORD_TOO_WEAK");
  if (!command.reason.trim()) throw new Error("PASSWORD_RESET_REASON_REQUIRED");
  const customer = await db.prepare("SELECT email FROM sim_customer_directory WHERE user_id = ?")
    .bind(command.userId).first<{ email:string }>();
  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  const now = new Date().toISOString();
  await db.batch([
    db.prepare(`INSERT INTO sim_customer_credentials
      (user_id, password_hash, password_reset_required, changed_by, changed_at)
      VALUES (?, ?, 1, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET password_hash = excluded.password_hash,
        password_reset_required = 1, changed_by = excluded.changed_by, changed_at = excluded.changed_at`)
      .bind(command.userId, await derivePasswordHash(command.temporaryPassword), command.changedBy, now),
    db.prepare("UPDATE sim_customer_login_sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL")
      .bind(now, command.userId),
  ]);
  await queueSimulationEmailAlert({
    userId: command.userId, email: customer.email, eventType: "LOGIN",
    subject: "Northstar password reset initiated",
    body: "Account services reset your password and signed out existing sessions. Use the temporary password supplied through the approved support channel, then change it in Security settings.",
  });
  return { userId: command.userId, passwordResetRequired: true, sessionsRevokedAt: now };
}

export async function authenticateSimulationCustomer(emailInput: string, password: string) {
  await initializeSimulationBank();
  const db = database();
  const email = emailInput.trim().toLowerCase();
  const customer = await db.prepare(`SELECT d.user_id AS userId, d.email,
    COALESCE(s.status, 'IN_REVIEW') AS accountStatus,
    c.password_hash AS passwordHash, c.password_reset_required AS passwordResetRequired
    FROM sim_customer_directory d
    LEFT JOIN sim_customer_account_statuses s ON s.user_id = d.user_id
    LEFT JOIN sim_customer_credentials c ON c.user_id = d.user_id
    WHERE d.email = ?`).bind(email).first<{
      userId:string; email:string; accountStatus:"ACTIVE"|"INACTIVE"|"IN_REVIEW";
      passwordHash:string|null; passwordResetRequired:number|null;
    }>();
  if (!customer?.passwordHash || !await passwordMatches(password, customer.passwordHash)) throw new Error("INVALID_CUSTOMER_CREDENTIALS");
  if (customer.accountStatus !== "ACTIVE") throw new Error(customer.accountStatus === "IN_REVIEW" ? "ACCOUNT_IN_REVIEW" : "ACCOUNT_INACTIVE");
  return { userId:customer.userId, email:customer.email, passwordResetRequired:Boolean(customer.passwordResetRequired) };
}

export async function changeSimulationCustomerPassword(command: {
  userId:string; currentPassword:string; newPassword:string; currentSessionId:string;
}) {
  await initializeSimulationBank();
  const db = database();
  const credential = await db.prepare("SELECT password_hash AS passwordHash FROM sim_customer_credentials WHERE user_id = ?")
    .bind(command.userId).first<{ passwordHash:string }>();
  if (!credential || !await passwordMatches(command.currentPassword, credential.passwordHash)) throw new Error("CURRENT_PASSWORD_INVALID");
  if (command.newPassword.length < 12 || !/[A-Z]/.test(command.newPassword)
    || !/[a-z]/.test(command.newPassword) || !/\d/.test(command.newPassword)
    || !/[^A-Za-z0-9]/.test(command.newPassword)) throw new Error("NEW_PASSWORD_TOO_WEAK");
  if (await passwordMatches(command.newPassword, credential.passwordHash)) throw new Error("NEW_PASSWORD_MUST_DIFFER");
  const now = new Date().toISOString();
  await db.batch([
    db.prepare(`UPDATE sim_customer_credentials SET password_hash = ?,
      password_reset_required = 0, changed_by = 'CUSTOMER', changed_at = ? WHERE user_id = ?`)
      .bind(await derivePasswordHash(command.newPassword), now, command.userId),
    db.prepare(`UPDATE sim_customer_login_sessions SET revoked_at = ?
      WHERE user_id = ? AND session_id <> ? AND revoked_at IS NULL`)
      .bind(now, command.userId, command.currentSessionId),
  ]);
  return { passwordResetRequired:false, changedAt:now };
}

export async function onboardSimulationStatement(command: {
  accountId: string;
  reason: string;
  createdBy: string;
  entries: Array<{
    direction: "CREDIT" | "DEBIT";
    amountMinor: number;
    description: string;
    effectiveAt: string;
  }>;
}) {
  await initializeSimulationBank();
  const db = database();
  const account = await db.prepare(`SELECT balance_minor AS balanceMinor
    FROM sim_accounts WHERE id = ? AND user_id <> 'SYSTEM'`)
    .bind(command.accountId).first<{ balanceMinor: number }>();
  if (!account) throw new Error("CUSTOMER_ACCOUNT_NOT_FOUND");
  if (!command.reason.trim()) throw new Error("AUDIT_REASON_REQUIRED");
  if (!command.createdBy.trim()) throw new Error("STAFF_ACTOR_REQUIRED");
  if (!Array.isArray(command.entries) || command.entries.length < 1 || command.entries.length > 100) {
    throw new Error("STATEMENT_ENTRY_COUNT_INVALID");
  }

  const normalized = command.entries.map((entry, index) => {
    if (!["CREDIT", "DEBIT"].includes(entry.direction)) throw new Error(`ROW_${index + 1}_DIRECTION_INVALID`);
    if (!Number.isInteger(entry.amountMinor) || entry.amountMinor <= 0) throw new Error(`ROW_${index + 1}_AMOUNT_INVALID`);
    const description = entry.description.trim();
    if (!description || description.length > 280) throw new Error(`ROW_${index + 1}_DESCRIPTION_INVALID`);
    const parsedDate = new Date(entry.effectiveAt);
    if (Number.isNaN(parsedDate.getTime())) throw new Error(`ROW_${index + 1}_DATE_INVALID`);
    return { ...entry, description, effectiveAt: parsedDate.toISOString() };
  });
  const netChangeMinor = normalized.reduce(
    (total, entry) => total + (entry.direction === "CREDIT" ? entry.amountMinor : -entry.amountMinor),
    0,
  );
  if (Number(account.balanceMinor) + netChangeMinor < 0) throw new Error("ONBOARDING_WOULD_OVERDRAW_ACCOUNT");

  const batchId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const statements = [
    db.prepare(`INSERT INTO sim_statement_onboarding_batches
      (id, account_id, entry_count, net_change_minor, reason, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(batchId, command.accountId, normalized.length, netChangeMinor,
        command.reason.trim(), command.createdBy.trim(), createdAt),
  ];
  const references: string[] = [];
  normalized.forEach((entry, index) => {
    const transactionId = crypto.randomUUID();
    const reference = `HIS-${entry.effectiveAt.slice(2, 10).replaceAll("-", "")}-${transactionId.slice(0, 6).toUpperCase()}`;
    references.push(reference);
    statements.push(
      db.prepare(`INSERT INTO sim_transactions
        (id, reference, account_id, direction, amount_minor, description,
         effective_at, created_at, status, correction_of)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'POSTED', NULL)`)
        .bind(transactionId, reference, command.accountId, entry.direction,
          entry.amountMinor, entry.description, entry.effectiveAt, createdAt),
      db.prepare(`INSERT INTO sim_statement_onboarding_entries
        (batch_id, transaction_id, row_index) VALUES (?, ?, ?)`)
        .bind(batchId, transactionId, index),
    );
  });
  statements.push(
    db.prepare(`UPDATE sim_accounts SET balance_minor = balance_minor + ?,
      updated_at = ? WHERE id = ?`)
      .bind(netChangeMinor, createdAt, command.accountId),
  );
  await db.batch(statements);
  return { id: batchId, reference: `STMT-${batchId.slice(0, 8).toUpperCase()}`, entryCount: normalized.length, netChangeMinor, references };
}

export async function saveSimulationDepositMethod(command: {
  id?: string;
  userId: string;
  methodType: "BANK_TRANSFER" | "CRYPTO";
  label: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  swiftBic?: string;
  cryptoAsset?: string;
  cryptoNetwork?: string;
  walletAddress?: string;
  instructions: string;
  updatedBy: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const customer = await db.prepare("SELECT id FROM sim_accounts WHERE user_id = ? LIMIT 1")
    .bind(command.userId).first();
  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  if (!command.label.trim() || !command.instructions.trim()) throw new Error("DEPOSIT_METHOD_DETAILS_REQUIRED");
  if (command.methodType === "BANK_TRANSFER"
    && [command.bankName, command.accountName, command.accountNumber, command.routingNumber].some((value) => !value?.trim())) {
    throw new Error("BANK_DEPOSIT_DETAILS_REQUIRED");
  }
  if (command.methodType === "CRYPTO"
    && [command.cryptoAsset, command.cryptoNetwork, command.walletAddress].some((value) => !value?.trim())) {
    throw new Error("CRYPTO_DEPOSIT_DETAILS_REQUIRED");
  }
  const id = command.id?.trim() || crypto.randomUUID();
  const updatedAt = new Date().toISOString();
  await db.batch([db.prepare(`INSERT INTO sim_customer_deposit_methods
    (id, user_id, method_type, label, bank_name, account_name, account_number,
     routing_number, swift_bic, crypto_asset, crypto_network, wallet_address,
     instructions, active, updated_by, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    ON CONFLICT(id) DO UPDATE SET user_id = excluded.user_id,
      method_type = excluded.method_type, label = excluded.label,
      bank_name = excluded.bank_name, account_name = excluded.account_name,
      account_number = excluded.account_number, routing_number = excluded.routing_number,
      swift_bic = excluded.swift_bic, crypto_asset = excluded.crypto_asset,
      crypto_network = excluded.crypto_network, wallet_address = excluded.wallet_address,
      instructions = excluded.instructions, active = 1,
      updated_by = excluded.updated_by, updated_at = excluded.updated_at`)
    .bind(
      id, command.userId, command.methodType, command.label.trim(),
      command.methodType === "BANK_TRANSFER" ? command.bankName!.trim() : null,
      command.methodType === "BANK_TRANSFER" ? command.accountName!.trim() : null,
      command.methodType === "BANK_TRANSFER" ? command.accountNumber!.trim() : null,
      command.methodType === "BANK_TRANSFER" ? command.routingNumber!.trim() : null,
      command.methodType === "BANK_TRANSFER" ? command.swiftBic?.trim() || null : null,
      command.methodType === "CRYPTO" ? command.cryptoAsset!.trim().toUpperCase() : null,
      command.methodType === "CRYPTO" ? command.cryptoNetwork!.trim() : null,
      command.methodType === "CRYPTO" ? command.walletAddress!.trim() : null,
      command.instructions.trim(), command.updatedBy, updatedAt,
    )]);
  return { id, reference: `DPM-${id.slice(0, 8).toUpperCase()}` };
}

export async function getSimulationCustomerDeposits(userId: string) {
  await initializeSimulationBank();
  await ensureActiveCustomersHaveDepositMethods();
  const db = database();
  const methods = await db.prepare(`SELECT id, user_id AS userId,
    method_type AS methodType, label, bank_name AS bankName,
    account_name AS accountName, account_number AS accountNumber,
    routing_number AS routingNumber, swift_bic AS swiftBic,
    crypto_asset AS cryptoAsset, crypto_network AS cryptoNetwork,
    wallet_address AS walletAddress, instructions, active,
    updated_at AS updatedAt
    FROM sim_customer_deposit_methods WHERE user_id = ? AND active = 1
    ORDER BY method_type, label`).bind(userId).all<SimDepositMethod>();
  const requests = await db.prepare(`SELECT r.id, r.reference,
    r.user_id AS userId, a.customer_name AS customerName,
    r.account_id AS accountId, a.account_number AS accountNumber,
    r.method_id AS methodId, m.label AS methodLabel,
    m.method_type AS methodType, r.amount_minor AS amountMinor,
    r.sender_reference AS senderReference, r.status,
    r.requested_at AS requestedAt, r.decided_at AS decidedAt,
    r.decision_reason AS decisionReason
    FROM sim_customer_deposit_requests r
    JOIN sim_accounts a ON a.id = r.account_id
    JOIN sim_customer_deposit_methods m ON m.id = r.method_id
    WHERE r.user_id = ? ORDER BY r.requested_at DESC LIMIT 50`)
    .bind(userId).all<SimDepositRequest>();
  return { methods: methods.results, requests: requests.results };
}

export async function createSimulationDepositRequest(command: {
  userId: string;
  accountId: string;
  methodId: string;
  amountMinor: number;
  senderReference: string;
}) {
  await initializeSimulationBank();
  const db = database();
  if (!Number.isInteger(command.amountMinor) || command.amountMinor <= 0) throw new Error("INVALID_AMOUNT");
  if (!command.senderReference.trim()) throw new Error("PAYMENT_REFERENCE_REQUIRED");
  const account = await db.prepare("SELECT id FROM sim_accounts WHERE id = ? AND user_id = ?")
    .bind(command.accountId, command.userId).first();
  if (!account) throw new Error("CUSTOMER_ACCOUNT_NOT_FOUND");
  const method = await db.prepare(`SELECT id, label FROM sim_customer_deposit_methods
    WHERE id = ? AND user_id = ? AND active = 1`)
    .bind(command.methodId, command.userId).first<{ id: string; label: string }>();
  if (!method) throw new Error("DEPOSIT_METHOD_NOT_AVAILABLE");

  const id = crypto.randomUUID();
  const requestedAt = new Date().toISOString();
  const reference = `DEP-${requestedAt.slice(2, 10).replaceAll("-", "")}-${id.slice(0, 6).toUpperCase()}`;
  await db.batch([db.prepare(`INSERT INTO sim_customer_deposit_requests
    (id, reference, user_id, account_id, method_id, amount_minor,
     sender_reference, status, requested_at, decided_by, decided_at,
     decision_reason, transaction_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, NULL, NULL, NULL, NULL)`)
    .bind(id, reference, command.userId, command.accountId, command.methodId,
      command.amountMinor, command.senderReference.trim(), requestedAt)]);
  await queueSimulationEmailAlert({
    userId: command.userId,
    eventType: "DEPOSIT",
    subject: `Deposit request ${reference} received`,
    body: `Your ${method.label} deposit request for $${(command.amountMinor / 100).toFixed(2)} is pending operations review.`,
  });
  return { id, reference, status: "PENDING" as const };
}

export async function decideSimulationDepositRequest(command: {
  requestId: string;
  decision: "APPROVE" | "REJECT";
  reason: string;
  decidedBy: string;
}) {
  await initializeSimulationBank();
  const db = database();
  if (!command.reason.trim()) throw new Error("DECISION_REASON_REQUIRED");
  const request = await db.prepare(`SELECT r.id, r.reference, r.user_id AS userId,
    r.account_id AS accountId, r.amount_minor AS amountMinor, r.status,
    m.label AS methodLabel FROM sim_customer_deposit_requests r
    JOIN sim_customer_deposit_methods m ON m.id = r.method_id
    WHERE r.id = ?`).bind(command.requestId).first<{
      id: string; reference: string; userId: string; accountId: string;
      amountMinor: number; status: string; methodLabel: string;
    }>();
  if (!request || request.status !== "PENDING") throw new Error("DEPOSIT_REQUEST_NOT_PENDING");
  const decidedAt = new Date().toISOString();

  if (command.decision === "REJECT") {
    await db.batch([
      db.prepare(`UPDATE sim_customer_deposit_requests SET status = 'REJECTED',
        decided_by = ?, decided_at = ?, decision_reason = ? WHERE id = ?`)
        .bind(command.decidedBy, decidedAt, command.reason.trim(), request.id),
    ]);
    await queueSimulationEmailAlert({
      userId: request.userId,
      eventType: "DEPOSIT",
      subject: `Deposit request ${request.reference} was not approved`,
      body: "Your deposit request was rejected. No account balance was changed.",
    });
    return { id: request.id, reference: request.reference, status: "REJECTED" as const };
  }

  const transactionId = crypto.randomUUID();
  const transactionReference = `TXN-${decidedAt.slice(2, 10).replaceAll("-", "")}-${transactionId.slice(0, 6).toUpperCase()}`;
  await db.batch([
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description,
       effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, 'CREDIT', ?, ?, ?, ?, 'POSTED', NULL)`)
      .bind(transactionId, transactionReference, request.accountId, request.amountMinor,
        `${request.methodLabel} deposit`, decidedAt, decidedAt),
    db.prepare(`UPDATE sim_customer_deposit_requests SET status = 'COMPLETED',
      decided_by = ?, decided_at = ?, decision_reason = ?, transaction_id = ?
      WHERE id = ?`).bind(command.decidedBy, decidedAt, command.reason.trim(), transactionId, request.id),
    db.prepare(`UPDATE sim_accounts SET balance_minor = balance_minor + ?,
      updated_at = ? WHERE id = ?`).bind(request.amountMinor, decidedAt, request.accountId),
  ]);
  await queueSimulationEmailAlert({
    userId: request.userId,
    eventType: "DEPOSIT",
    subject: `Deposit ${request.reference} completed`,
    body: `Your deposit of $${(request.amountMinor / 100).toFixed(2)} was approved and credited to your account.`,
  });
  return { id: request.id, reference: request.reference, status: "COMPLETED" as const, transactionReference };
}

export async function listSimulationVirtualCards(userId:string) {
  await initializeSimulationBank();
  const rows=await database().prepare(`SELECT r.id,r.user_id AS userId,
    a.customer_name AS customerName,r.funding_account_id AS fundingAccountId,
    a.account_number AS fundingAccountNumber,r.display_name AS displayName,
    r.monthly_limit_minor AS monthlyLimitMinor,r.status,r.pan_last4 AS panLast4,
    r.expiry_month AS expiryMonth,r.expiry_year AS expiryYear,
    CASE WHEN r.status='APPROVED' THEN r.cvv ELSE NULL END AS cvv,
    r.requested_at AS requestedAt,r.decided_by AS decidedBy,r.decided_at AS decidedAt,
    r.decision_reason AS decisionReason FROM sim_virtual_card_requests r
    JOIN sim_accounts a ON a.id=r.funding_account_id WHERE r.user_id=?
    ORDER BY r.requested_at DESC`).bind(userId).all<SimVirtualCardRequest>();
  return rows.results;
}

export async function requestSimulationVirtualCard(command:{
  userId:string; fundingAccountId:string; displayName:string; monthlyLimitMinor:number;
}) {
  await initializeSimulationBank();
  if (!command.displayName.trim()||command.displayName.trim().length>50) throw new Error("CARD_NAME_INVALID");
  if (!Number.isInteger(command.monthlyLimitMinor)||command.monthlyLimitMinor<5000||command.monthlyLimitMinor>2_500_000) throw new Error("CARD_LIMIT_INVALID");
  const account=await database().prepare(`SELECT id FROM sim_accounts WHERE id=? AND user_id=?`)
    .bind(command.fundingAccountId,command.userId).first();
  if (!account) throw new Error("FUNDING_ACCOUNT_NOT_FOUND");
  const pending=await database().prepare(`SELECT id FROM sim_virtual_card_requests
    WHERE user_id=? AND status='PENDING' LIMIT 1`).bind(command.userId).first();
  if (pending) throw new Error("CARD_REQUEST_ALREADY_PENDING");
  const id=crypto.randomUUID();
  const requestedAt=new Date().toISOString();
  await database().batch([database().prepare(`INSERT INTO sim_virtual_card_requests
    (id,user_id,funding_account_id,display_name,monthly_limit_minor,status,requested_at)
    VALUES (?,?,?,?,?,'PENDING',?)`).bind(id,command.userId,command.fundingAccountId,
      command.displayName.trim(),command.monthlyLimitMinor,requestedAt)]);
  return {id,status:"PENDING" as const,requestedAt};
}

export async function decideSimulationVirtualCard(command:{
  requestId:string; decision:"APPROVE"|"REJECT"; reason:string; decidedBy:string;
}) {
  await initializeSimulationBank();
  if (!command.reason.trim()) throw new Error("CARD_DECISION_REASON_REQUIRED");
  const request=await database().prepare(`SELECT id,status FROM sim_virtual_card_requests WHERE id=?`)
    .bind(command.requestId).first<{id:string;status:string}>();
  if (!request||request.status!=="PENDING") throw new Error("CARD_REQUEST_NOT_PENDING");
  const decidedAt=new Date().toISOString();
  if (command.decision==="REJECT") {
    await database().batch([database().prepare(`UPDATE sim_virtual_card_requests SET status='REJECTED',
      decided_by=?,decided_at=?,decision_reason=? WHERE id=?`).bind(command.decidedBy,decidedAt,
        command.reason.trim(),request.id)]);
    return {id:request.id,status:"REJECTED" as const};
  }
  const digits=crypto.getRandomValues(new Uint32Array(2));
  const panLast4=String(digits[0]%10_000).padStart(4,"0");
  const cvv=String(digits[1]%1_000).padStart(3,"0");
  const expiry=new Date(); expiry.setFullYear(expiry.getFullYear()+3);
  await database().batch([database().prepare(`UPDATE sim_virtual_card_requests SET status='APPROVED',
    pan_last4=?,expiry_month=?,expiry_year=?,cvv=?,decided_by=?,decided_at=?,decision_reason=? WHERE id=?`)
    .bind(panLast4,expiry.getMonth()+1,expiry.getFullYear(),cvv,command.decidedBy,decidedAt,
      command.reason.trim(),request.id)]);
  return {id:request.id,status:"APPROVED" as const,panLast4};
}

type PostCommand = {
  accountId: string;
  direction?: "CREDIT" | "DEBIT";
  amountMinor?: number;
  targetBalanceMinor?: number;
  description: string;
  effectiveAt: string;
  customerVisible?: boolean;
};

export async function postSimulationTransaction(command: PostCommand) {
  await initializeSimulationBank();
  const db = database();
  const account = await db.prepare("SELECT balance_minor AS balanceMinor FROM sim_accounts WHERE id = ?")
    .bind(command.accountId).first<{ balanceMinor: number }>();
  if (!account) throw new Error("ACCOUNT_NOT_FOUND");

  let direction = command.direction;
  let amountMinor = command.amountMinor;
  if (typeof command.targetBalanceMinor === "number") {
    const delta = command.targetBalanceMinor - Number(account.balanceMinor);
    if (delta === 0) throw new Error("BALANCE_ALREADY_AT_TARGET");
    direction = delta > 0 ? "CREDIT" : "DEBIT";
    amountMinor = Math.abs(delta);
  }
  if (!direction || !amountMinor || amountMinor <= 0) throw new Error("INVALID_AMOUNT");
  const signed = direction === "CREDIT" ? amountMinor : -amountMinor;
  if (Number(account.balanceMinor) + signed < 0) throw new Error("INSUFFICIENT_FUNDS");

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const reference = `TXN-${createdAt.slice(2,10).replaceAll("-","")}-${id.slice(0,6).toUpperCase()}`;
  const statements = [
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description, effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'POSTED', NULL)`)
      .bind(id, reference, command.accountId, direction, amountMinor, command.description, command.effectiveAt, createdAt),
    db.prepare("UPDATE sim_accounts SET balance_minor = balance_minor + ?, updated_at = ? WHERE id = ?")
      .bind(signed, createdAt, command.accountId),
  ];
  if (command.customerVisible === false) {
    statements.push(db.prepare(`INSERT INTO sim_customer_hidden_transactions
      (transaction_id,hidden_reason,hidden_at) VALUES (?,'ADMIN_ACCOUNT_FUNDING',?)`)
      .bind(id,createdAt));
  }
  await db.batch(statements);
  return { id, reference };
}

export async function scheduleSimulationTransfer(command: {
  userId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amountMinor: number;
  description: string;
  scheduledFor: string;
  idempotencyKey: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const scope=`${command.userId}:SCHEDULED_TRANSFER`;
  const prior=await db.prepare("SELECT reference FROM sim_idempotency_records WHERE scope=? AND idempotency_key=?")
    .bind(scope,command.idempotencyKey).first<{reference:string}>();
  if(prior){const saved=await db.prepare(`SELECT id,reference,status,scheduled_for AS scheduledFor,created_at AS requestedAt FROM sim_scheduled_transfers WHERE reference=?`).bind(prior.reference).first<{id:string;reference:string;status:"SCHEDULED";scheduledFor:string;requestedAt:string}>();if(saved)return saved;}
  if (command.sourceAccountId === command.destinationAccountId) throw new Error("SAME_ACCOUNT_TRANSFER");
  if (!Number.isInteger(command.amountMinor) || command.amountMinor <= 0) throw new Error("INVALID_AMOUNT");
  const scheduled = new Date(command.scheduledFor);
  if (Number.isNaN(scheduled.getTime()) || scheduled.getTime() <= Date.now() + 30_000) {
    throw new Error("TRANSFER_SCHEDULE_MUST_BE_FUTURE");
  }
  const source = await db.prepare(`SELECT user_id AS userId,balance_minor AS balanceMinor
    FROM sim_accounts WHERE id=?`).bind(command.sourceAccountId)
    .first<{userId:string;balanceMinor:number}>();
  const destination = await db.prepare("SELECT id FROM sim_accounts WHERE id=?")
    .bind(command.destinationAccountId).first<{id:string}>();
  if (!source || !destination) throw new Error("ACCOUNT_NOT_FOUND");
  if (source.userId !== command.userId) throw new Error("SOURCE_ACCOUNT_FORBIDDEN");
  if (Number(source.balanceMinor) < command.amountMinor) throw new Error("INSUFFICIENT_FUNDS");

  const id=crypto.randomUUID();
  const createdAt=new Date().toISOString();
  const reference=`SCH-${createdAt.slice(2,10).replaceAll("-","")}-${id.slice(0,6).toUpperCase()}`;
  try { await db.batch([
    db.prepare("INSERT INTO sim_idempotency_records (scope,idempotency_key,reference,created_at) VALUES (?,?,?,?)")
      .bind(scope,command.idempotencyKey,reference,createdAt),
    db.prepare(`INSERT INTO sim_scheduled_transfers
    (id,reference,user_id,source_account_id,destination_account_id,amount_minor,
     description,scheduled_for,status,created_at,completed_at,transaction_reference)
    VALUES (?,?,?,?,?,?,?,?,'SCHEDULED',?,NULL,NULL)`)
    .bind(id,reference,command.userId,command.sourceAccountId,command.destinationAccountId,
      command.amountMinor,command.description.trim()||"Scheduled transfer",scheduled.toISOString(),createdAt)]); }
  catch(error){const duplicate=await db.prepare("SELECT reference FROM sim_idempotency_records WHERE scope=? AND idempotency_key=?").bind(scope,command.idempotencyKey).first<{reference:string}>();if(duplicate){const saved=await db.prepare(`SELECT id,reference,status,scheduled_for AS scheduledFor,created_at AS requestedAt FROM sim_scheduled_transfers WHERE reference=?`).bind(duplicate.reference).first<{id:string;reference:string;status:"SCHEDULED";scheduledFor:string;requestedAt:string}>();if(saved)return saved;}throw error;}
  return {id,reference,status:"SCHEDULED" as const,scheduledFor:scheduled.toISOString(),requestedAt:createdAt};
}

async function processDueSimulationTransfers() {
  const db=database();
  const now=new Date().toISOString();
  const due=await db.prepare(`SELECT id,user_id AS userId,amount_minor AS amountMinor
    FROM sim_scheduled_transfers WHERE status='SCHEDULED' AND scheduled_for<=?
    ORDER BY scheduled_for LIMIT 25`).bind(now).all<{id:string;userId:string;amountMinor:number}>();
  for (const item of due.results) {
    const completedAt=new Date().toISOString();
    const transactionReference=`TRF-${completedAt.slice(2,10).replaceAll("-","")}-${item.id.slice(0,6).toUpperCase()}`;
    const debitId=crypto.randomUUID();
    const creditId=crypto.randomUUID();
    await db.batch([
      db.prepare(`UPDATE sim_scheduled_transfers SET status='COMPLETED',completed_at=?,transaction_reference=?
        WHERE id=? AND status='SCHEDULED' AND scheduled_for<=?
          AND EXISTS (SELECT 1 FROM sim_accounts source
            WHERE source.id=source_account_id AND source.balance_minor>=amount_minor)
          AND EXISTS (SELECT 1 FROM sim_accounts destination WHERE destination.id=destination_account_id)`)
        .bind(completedAt,transactionReference,item.id,completedAt),
      db.prepare(`INSERT INTO sim_transactions
        (id,reference,account_id,direction,amount_minor,description,effective_at,created_at,status,correction_of)
        SELECT ?,?||'-D',source_account_id,'DEBIT',amount_minor,description,scheduled_for,?,'POSTED',NULL
        FROM sim_scheduled_transfers WHERE id=? AND status='COMPLETED' AND completed_at=?`)
        .bind(debitId,transactionReference,completedAt,item.id,completedAt),
      db.prepare(`INSERT INTO sim_transactions
        (id,reference,account_id,direction,amount_minor,description,effective_at,created_at,status,correction_of)
        SELECT ?,?||'-C',destination_account_id,'CREDIT',amount_minor,description,scheduled_for,?,'POSTED',NULL
        FROM sim_scheduled_transfers WHERE id=? AND status='COMPLETED' AND completed_at=?`)
        .bind(creditId,transactionReference,completedAt,item.id,completedAt),
      db.prepare(`UPDATE sim_accounts SET balance_minor=balance_minor-(SELECT amount_minor FROM sim_scheduled_transfers WHERE id=?),updated_at=?
        WHERE id=(SELECT source_account_id FROM sim_scheduled_transfers WHERE id=?)
          AND EXISTS (SELECT 1 FROM sim_scheduled_transfers WHERE id=? AND status='COMPLETED' AND completed_at=?)`)
        .bind(item.id,completedAt,item.id,item.id,completedAt),
      db.prepare(`UPDATE sim_accounts SET balance_minor=balance_minor+(SELECT amount_minor FROM sim_scheduled_transfers WHERE id=?),updated_at=?
        WHERE id=(SELECT destination_account_id FROM sim_scheduled_transfers WHERE id=?)
          AND EXISTS (SELECT 1 FROM sim_scheduled_transfers WHERE id=? AND status='COMPLETED' AND completed_at=?)`)
        .bind(item.id,completedAt,item.id,item.id,completedAt),
      db.prepare(`UPDATE sim_scheduled_transfers SET status='FAILED',completed_at=?
        WHERE id=? AND status='SCHEDULED' AND scheduled_for<=?`)
        .bind(completedAt,item.id,completedAt),
    ]);
    const result=await db.prepare("SELECT status,reference FROM sim_scheduled_transfers WHERE id=?")
      .bind(item.id).first<{status:SimScheduledTransfer["status"];reference:string}>();
    await queueSimulationEmailAlert({
      userId:item.userId,eventType:"TRANSFER",
      subject:result?.status==="COMPLETED"?`Scheduled transfer ${result.reference} completed`:`Scheduled transfer ${result?.reference??item.id} failed`,
      body:result?.status==="COMPLETED"
        ?`Your scheduled transfer of $${(item.amountMinor/100).toFixed(2)} was posted successfully.`
        :`Your scheduled transfer of $${(item.amountMinor/100).toFixed(2)} could not be completed. Please review your available balance.`,
    });
  }
}

export async function postSimulationTransfer(command: {
  userId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amountMinor: number;
  description: string;
  effectiveAt: string;
  idempotencyKey: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const scope=`${command.userId}:INTERNAL_TRANSFER`;
  const existing=await db.prepare("SELECT reference FROM sim_idempotency_records WHERE scope=? AND idempotency_key=?")
    .bind(scope,command.idempotencyKey).first<{reference:string}>();
  if(existing)return {id:existing.reference,reference:existing.reference};
  if (command.sourceAccountId === command.destinationAccountId) throw new Error("SAME_ACCOUNT_TRANSFER");
  if (!Number.isInteger(command.amountMinor) || command.amountMinor <= 0) throw new Error("INVALID_AMOUNT");

  const source = await db.prepare("SELECT balance_minor AS balanceMinor, user_id AS userId, type FROM sim_accounts WHERE id = ?")
    .bind(command.sourceAccountId).first<{ balanceMinor: number; userId: string; type: string }>();
  const destination = await db.prepare("SELECT user_id AS userId, type FROM sim_accounts WHERE id = ?")
    .bind(command.destinationAccountId).first<{ userId: string; type: string }>();
  if (!source || !destination) throw new Error("ACCOUNT_NOT_FOUND");
  if (source.userId !== command.userId) throw new Error("SOURCE_ACCOUNT_FORBIDDEN");
  if (Number(source.balanceMinor) < command.amountMinor) throw new Error("INSUFFICIENT_FUNDS");

  const transferId = crypto.randomUUID();
  const debitId = crypto.randomUUID();
  const creditId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const effectiveAt = createdAt;
  const reference = `TRF-${createdAt.slice(2,10).replaceAll("-","")}-${transferId.slice(0,6).toUpperCase()}`;
  const description = command.description.trim() || "Internal account transfer";
  try { await db.batch([
    db.prepare("INSERT INTO sim_idempotency_records (scope,idempotency_key,reference,created_at) VALUES (?,?,?,?)")
      .bind(scope,command.idempotencyKey,reference,createdAt),
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description, effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, 'DEBIT', ?, ?, ?, ?, 'POSTED', NULL)`)
      .bind(debitId, `${reference}-D`, command.sourceAccountId, command.amountMinor, description, effectiveAt, createdAt),
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description, effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, 'CREDIT', ?, ?, ?, ?, 'POSTED', NULL)`)
      .bind(creditId, `${reference}-C`, command.destinationAccountId, command.amountMinor, description, effectiveAt, createdAt),
    db.prepare("UPDATE sim_accounts SET balance_minor = balance_minor - ?, updated_at = ? WHERE id = ?")
      .bind(command.amountMinor, createdAt, command.sourceAccountId),
    db.prepare("UPDATE sim_accounts SET balance_minor = balance_minor + ?, updated_at = ? WHERE id = ?")
      .bind(command.amountMinor, createdAt, command.destinationAccountId),
  ]); } catch(error) {
    const duplicate=await db.prepare("SELECT reference FROM sim_idempotency_records WHERE scope=? AND idempotency_key=?")
      .bind(scope,command.idempotencyKey).first<{reference:string}>();
    if(duplicate)return {id:duplicate.reference,reference:duplicate.reference};
    throw error;
  }
  await queueSimulationEmailAlert({
    userId: source.userId,
    eventType: "TRANSFER",
    subject: `Transfer ${reference} completed`,
    body: `Your transfer of $${(command.amountMinor / 100).toFixed(2)} was posted successfully.`,
  });
  return { id: transferId, reference };
}

export async function createSimulationExternalTransfer(command: {
  userId: string;
  sourceAccountId: string;
  rail: "ACH" | "DOMESTIC_WIRE" | "INTERNATIONAL_WIRE";
  amountMinor: number;
  recipientName: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  swiftBic?: string;
  recipientAddressLine1: string;
  recipientAddressLine2?: string;
  recipientCity: string;
  recipientStateRegion: string;
  recipientPostalCode: string;
  recipientCountryCode: string;
  bankAddress: string;
  memo?: string;
  scheduledFor: string;
  idempotencyKey: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const scope=`${command.userId}:EXTERNAL_TRANSFER`;
  const prior=await db.prepare("SELECT reference FROM sim_idempotency_records WHERE scope=? AND idempotency_key=?")
    .bind(scope,command.idempotencyKey).first<{reference:string}>();
  if(prior){
    const saved=await db.prepare(`SELECT id,reference,status,requested_at AS requestedAt
      FROM sim_transfer_requests WHERE reference=?`).bind(prior.reference)
      .first<{id:string;reference:string;status:"PENDING"|"PROCESSING"|"COMPLETED"|"FAILED"|"CANCELLED";requestedAt:string}>();
    if(saved)return {...saved,transferMode:"STANDARD_APPROVAL" as const,complianceRequired:false,customerMessage:null};
  }
  if (!Number.isInteger(command.amountMinor) || command.amountMinor <= 0) throw new Error("INVALID_AMOUNT");
  const source = await db.prepare(`SELECT user_id AS userId, balance_minor AS balanceMinor
    FROM sim_accounts WHERE id = ?`).bind(command.sourceAccountId)
    .first<{ userId: string; balanceMinor: number }>();
  if (!source) throw new Error("ACCOUNT_NOT_FOUND");
  if (source.userId !== command.userId) throw new Error("SOURCE_ACCOUNT_FORBIDDEN");
  if (Number(source.balanceMinor) < command.amountMinor) throw new Error("INSUFFICIENT_FUNDS");

  const required = [
    command.recipientName, command.bankName, command.routingNumber,
    command.accountNumber, command.recipientAddressLine1, command.recipientCity,
    command.recipientStateRegion, command.recipientPostalCode,
    command.recipientCountryCode, command.bankAddress,
  ];
  if (required.some((value) => !value.trim())) throw new Error("PAYMENT_DETAILS_REQUIRED");
  if (command.rail === "INTERNATIONAL_WIRE" && !command.swiftBic?.trim()) {
    throw new Error("SWIFT_BIC_REQUIRED");
  }
  const control = await db.prepare(`SELECT c.external_mode AS externalMode,
    c.preferred_stop_code AS preferredStopCode, d.customer_message AS customerMessage
    FROM sim_customer_transfer_controls c
    LEFT JOIN sim_stop_code_definitions d ON d.code = c.preferred_stop_code
    WHERE c.user_id = ?`).bind(source.userId)
    .first<{
      externalMode: "STANDARD_APPROVAL" | "COMPLIANCE_CODE";
      preferredStopCode: string | null;
      customerMessage: string | null;
    }>();
  const transferMode = control?.externalMode ?? "STANDARD_APPROVAL";
  if (transferMode === "COMPLIANCE_CODE" && !control?.preferredStopCode) {
    throw new Error("COMPLIANCE_STOP_CODE_NOT_CONFIGURED");
  }

  const id = crypto.randomUUID();
  const requestedAt = new Date().toISOString();
  const reference = `EXT-${requestedAt.slice(2,10).replaceAll("-","")}-${id.slice(0,6).toUpperCase()}`;
  const statements = [
    db.prepare("INSERT INTO sim_idempotency_records (scope,idempotency_key,reference,created_at) VALUES (?,?,?,?)")
      .bind(scope,command.idempotencyKey,reference,requestedAt),
    db.prepare(`INSERT INTO sim_transfer_requests (
      id, reference, user_id, source_account_id, rail, status, amount_minor,
      recipient_name, bank_name, routing_number, account_number, swift_bic,
      recipient_address_line1, recipient_address_line2, recipient_city,
      recipient_state_region, recipient_postal_code, recipient_country_code,
      bank_address, memo, requested_at, scheduled_for
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(
        id, reference, source.userId, command.sourceAccountId, command.rail,
        transferMode === "COMPLIANCE_CODE" ? "PROCESSING" : "PENDING",
        command.amountMinor, command.recipientName.trim(), command.bankName.trim(),
        command.routingNumber.trim(), command.accountNumber.trim(),
        command.swiftBic?.trim() || null, command.recipientAddressLine1.trim(),
        command.recipientAddressLine2?.trim() || null, command.recipientCity.trim(),
        command.recipientStateRegion.trim(), command.recipientPostalCode.trim(),
        command.recipientCountryCode.trim().toUpperCase(), command.bankAddress.trim(),
        command.memo?.trim() || null, requestedAt, command.scheduledFor,
      ),
  ];
  if (transferMode === "COMPLIANCE_CODE") {
    statements.push(
      db.prepare(`INSERT INTO sim_transfer_compliance_holds
        (request_id, stop_code, state, code_hash, code_hint, requested_at,
         code_requested_at, issued_at, released_at)
        VALUES (?, ?, 'AWAITING_CODE', NULL, NULL, ?, NULL, NULL, NULL)`)
        .bind(id, control!.preferredStopCode, requestedAt),
    );
  }
  try { await db.batch(statements); } catch(error) {
    const duplicate=await db.prepare("SELECT reference FROM sim_idempotency_records WHERE scope=? AND idempotency_key=?")
      .bind(scope,command.idempotencyKey).first<{reference:string}>();
    if(duplicate){
      const saved=await db.prepare(`SELECT id,reference,status,requested_at AS requestedAt
        FROM sim_transfer_requests WHERE reference=?`).bind(duplicate.reference)
        .first<{id:string;reference:string;status:"PENDING"|"PROCESSING"|"COMPLETED"|"FAILED"|"CANCELLED";requestedAt:string}>();
      if(saved)return {...saved,transferMode,complianceRequired:transferMode==="COMPLIANCE_CODE",customerMessage:transferMode==="COMPLIANCE_CODE"?control?.customerMessage:null};
    }
    throw error;
  }
  await queueSimulationEmailAlert({
    userId: source.userId,
    eventType: "TRANSFER",
    subject: `Transfer request ${reference} received`,
    body: `Your external transfer request for $${(command.amountMinor / 100).toFixed(2)} is ${
      transferMode === "COMPLIANCE_CODE" ? "on a compliance-code hold" : "pending operations approval"
    }.`,
  });
  return {
    id,
    reference,
    status: transferMode === "COMPLIANCE_CODE" ? "PROCESSING" as const : "PENDING" as const,
    requestedAt,
    transferMode,
    complianceRequired: transferMode === "COMPLIANCE_CODE",
    customerMessage: transferMode === "COMPLIANCE_CODE" ? control?.customerMessage : null,
  };
}

async function hashComplianceCode(code: string) {
  const normalized = code.trim().toUpperCase();
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(digest)).map((byte)=>byte.toString(16).padStart(2,"0")).join("");
}

export async function createSimulationStopCode(command: {
  code: string;
  name: string;
  customerMessage: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const code = command.code.trim().toUpperCase().replaceAll(/[^A-Z0-9_]/g,"_");
  if (!/^[A-Z][A-Z0-9_]{2,49}$/.test(code)) throw new Error("INVALID_STOP_CODE");
  if (!command.name.trim() || !command.customerMessage.trim()) throw new Error("STOP_CODE_DETAILS_REQUIRED");
  const createdAt = new Date().toISOString();
  await db.batch([
    db.prepare(`INSERT INTO sim_stop_code_definitions
      (code, name, customer_message, active, created_at)
      VALUES (?, ?, ?, 1, ?)
      ON CONFLICT(code) DO UPDATE SET
        name = excluded.name,
        customer_message = excluded.customer_message,
        active = 1`)
      .bind(code, command.name.trim(), command.customerMessage.trim(), createdAt),
  ]);
  return { code };
}

export async function setSimulationTransferControl(command: {
  userId: string;
  externalMode: "STANDARD_APPROVAL" | "COMPLIANCE_CODE";
  preferredStopCode?: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const customer = await db.prepare("SELECT id FROM sim_accounts WHERE user_id = ? LIMIT 1")
    .bind(command.userId).first<{ id: string }>();
  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  let preferredStopCode: string | null = null;
  if (command.externalMode === "COMPLIANCE_CODE") {
    preferredStopCode = command.preferredStopCode?.trim().toUpperCase() || null;
    if (!preferredStopCode) throw new Error("PREFERRED_STOP_CODE_REQUIRED");
    const definition = await db.prepare("SELECT code FROM sim_stop_code_definitions WHERE code = ? AND active = 1")
      .bind(preferredStopCode).first<{ code: string }>();
    if (!definition) throw new Error("STOP_CODE_NOT_FOUND");
  }
  const updatedAt = new Date().toISOString();
  await db.batch([
    db.prepare(`INSERT INTO sim_customer_transfer_controls
      (user_id, external_mode, preferred_stop_code, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        external_mode = excluded.external_mode,
        preferred_stop_code = excluded.preferred_stop_code,
        updated_at = excluded.updated_at`)
      .bind(command.userId, command.externalMode, preferredStopCode, updatedAt),
  ]);
  return { userId: command.userId, externalMode: command.externalMode, preferredStopCode };
}

export async function requestSimulationComplianceCode(requestId: string, userId: string) {
  await initializeSimulationBank();
  const db = database();
  const hold = await db.prepare(`SELECT h.state, r.user_id AS userId
    FROM sim_transfer_compliance_holds h
    JOIN sim_transfer_requests r ON r.id = h.request_id
    WHERE h.request_id = ?`).bind(requestId).first<{ state: string; userId: string }>();
  if (!hold || hold.userId !== userId) throw new Error("COMPLIANCE_HOLD_NOT_FOUND");
  if (hold.state === "RELEASED") throw new Error("COMPLIANCE_HOLD_ALREADY_RELEASED");
  if (hold.state === "AWAITING_CODE") {
    const requestedAt = new Date().toISOString();
    await db.batch([
      db.prepare(`UPDATE sim_transfer_compliance_holds
        SET state = 'REQUESTED', code_requested_at = ? WHERE request_id = ?`)
        .bind(requestedAt, requestId),
    ]);
  }
  return { requestId, holdState: hold.state === "AWAITING_CODE" ? "REQUESTED" : hold.state };
}

export async function generateSimulationComplianceCode(command: {
  requestId: string;
  generatedBy: string;
  reason: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const hold = await db.prepare(`SELECT h.state, h.stop_code AS stopCode, r.user_id AS userId,
    r.reference FROM sim_transfer_compliance_holds h
    JOIN sim_transfer_requests r ON r.id = h.request_id
    WHERE h.request_id = ?`).bind(command.requestId).first<{
      state: string;
      stopCode: string;
      userId: string;
      reference: string;
    }>();
  if (!hold) throw new Error("COMPLIANCE_HOLD_NOT_FOUND");
  if (!["REQUESTED","CODE_ISSUED"].includes(hold.state)) throw new Error("CUSTOMER_CODE_REQUEST_REQUIRED");
  if (!command.reason.trim()) throw new Error("OPERATION_NOTE_REQUIRED");
  const random = new Uint8Array(6);
  crypto.getRandomValues(random);
  const token = Array.from(random).map((byte)=>(byte % 36).toString(36).toUpperCase()).join("");
  const generatedCode = `CMP-${hold.stopCode.slice(0,4)}-${token}`;
  const codeHash = await hashComplianceCode(generatedCode);
  const codeHint = generatedCode.slice(-4);
  const generatedAt = new Date().toISOString();
  await db.batch([
    db.prepare(`INSERT INTO sim_customer_compliance_codes
      (user_id, stop_code, code_hash, code_hint, active, generated_by, generated_at)
      VALUES (?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT(user_id, stop_code) DO UPDATE SET
        code_hash = excluded.code_hash,
        code_hint = excluded.code_hint,
        active = 1,
        generated_by = excluded.generated_by,
        generated_at = excluded.generated_at`)
      .bind(hold.userId, hold.stopCode, codeHash, codeHint, command.generatedBy, generatedAt),
    db.prepare(`UPDATE sim_transfer_compliance_holds
      SET state = 'CODE_ISSUED', code_hint = ?, issued_at = ? WHERE request_id = ?`)
      .bind(codeHint, generatedAt, command.requestId),
    db.prepare(`INSERT INTO sim_transfer_decisions
      (id, request_id, decision, reason, decided_by, decided_at)
      VALUES (?, ?, 'FLAG_REVIEW', ?, ?, ?)`)
      .bind(crypto.randomUUID(), command.requestId, `Compliance code issued: ${command.reason.trim()}`, command.generatedBy, generatedAt),
  ]);
  return {
    requestId: command.requestId,
    reference: hold.reference,
    generatedCode,
    codeHint,
    reusable: true,
  };
}

export async function generateSimulationStopCodeCredential(command: {
  userId: string;
  stopCode: string;
  generatedBy: string;
  reason: string;
}) {
  await initializeSimulationBank();
  const db = database();
  if (!command.reason.trim()) throw new Error("OPERATION_NOTE_REQUIRED");
  const customer = await db.prepare("SELECT id FROM sim_accounts WHERE user_id = ? LIMIT 1")
    .bind(command.userId).first<{ id: string }>();
  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  const definition = await db.prepare("SELECT code FROM sim_stop_code_definitions WHERE code = ? AND active = 1")
    .bind(command.stopCode).first<{ code: string }>();
  if (!definition) throw new Error("STOP_CODE_NOT_FOUND");
  const random = new Uint8Array(6);
  crypto.getRandomValues(random);
  const token = Array.from(random).map((byte)=>(byte % 36).toString(36).toUpperCase()).join("");
  const generatedCode = `CMP-${definition.code.slice(0,4)}-${token}`;
  const codeHash = await hashComplianceCode(generatedCode);
  const codeHint = generatedCode.slice(-4);
  const generatedAt = new Date().toISOString();
  await db.batch([
    db.prepare(`INSERT INTO sim_customer_compliance_codes
      (user_id, stop_code, code_hash, code_hint, active, generated_by, generated_at)
      VALUES (?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT(user_id, stop_code) DO UPDATE SET
        code_hash = excluded.code_hash,
        code_hint = excluded.code_hint,
        active = 1,
        generated_by = excluded.generated_by,
        generated_at = excluded.generated_at`)
      .bind(command.userId, definition.code, codeHash, codeHint, command.generatedBy, generatedAt),
  ]);
  return {
    userId: command.userId,
    stopCode: definition.code,
    generatedCode,
    codeHint,
    generatedAt,
    reusable: true,
  };
}

export async function submitSimulationComplianceCode(command: {
  requestId: string;
  userId: string;
  complianceCode: string;
}) {
  await initializeSimulationBank();
  const db = database();
  const request = await db.prepare(`SELECT r.id, r.reference, r.user_id AS userId,
    r.source_account_id AS sourceAccountId, r.rail, r.status,
    r.amount_minor AS amountMinor, r.recipient_name AS recipientName,
    r.scheduled_for AS scheduledFor, h.stop_code AS stopCode, h.state AS holdState,
    c.code_hash AS codeHash
    FROM sim_transfer_requests r
    JOIN sim_transfer_compliance_holds h ON h.request_id = r.id
    LEFT JOIN sim_customer_compliance_codes c
      ON c.user_id = r.user_id AND c.stop_code = h.stop_code AND c.active = 1
    WHERE r.id = ?`).bind(command.requestId).first<{
      id: string;
      reference: string;
      userId: string;
      sourceAccountId: string;
      rail: SimTransferRequest["rail"];
      status: SimTransferRequest["status"];
      amountMinor: number;
      recipientName: string;
      scheduledFor: string;
      stopCode: string;
      holdState: string;
      codeHash: string | null;
    }>();
  if (!request || request.userId !== command.userId) throw new Error("COMPLIANCE_HOLD_NOT_FOUND");
  if (request.holdState === "RELEASED") throw new Error("COMPLIANCE_HOLD_ALREADY_RELEASED");
  if (!request.codeHash) throw new Error("COMPLIANCE_CODE_NOT_ISSUED");
  if (await hashComplianceCode(command.complianceCode) !== request.codeHash) throw new Error("INVALID_COMPLIANCE_CODE");
  const source = await db.prepare("SELECT balance_minor AS balanceMinor FROM sim_accounts WHERE id = ?")
    .bind(request.sourceAccountId).first<{ balanceMinor: number }>();
  if (!source || Number(source.balanceMinor) < request.amountMinor) throw new Error("INSUFFICIENT_FUNDS_AT_RELEASE");
  const clearingAccountId = request.rail === "INTERNATIONAL_WIRE"
    ? "system-international-clearing"
    : "system-domestic-clearing";
  const releasedAt = new Date().toISOString();
  const debitId = crypto.randomUUID();
  const creditId = crypto.randomUUID();
  const ledgerReference = `EXTSET-${request.reference}`;
  const description = `${request.rail === "ACH" ? "ACH" : "Wire"} transfer to ${request.recipientName}`;
  await db.batch([
    db.prepare("UPDATE sim_transfer_requests SET status = 'COMPLETED' WHERE id = ?").bind(request.id),
    db.prepare(`UPDATE sim_transfer_compliance_holds
      SET state = 'RELEASED', released_at = ? WHERE request_id = ?`).bind(releasedAt, request.id),
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description, effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, 'DEBIT', ?, ?, ?, ?, 'POSTED', NULL)`)
      .bind(debitId, `${ledgerReference}-D`, request.sourceAccountId, request.amountMinor, description, releasedAt, releasedAt),
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description, effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, 'CREDIT', ?, ?, ?, ?, 'POSTED', NULL)`)
      .bind(creditId, `${ledgerReference}-C`, clearingAccountId, request.amountMinor, description, releasedAt, releasedAt),
    db.prepare("UPDATE sim_accounts SET balance_minor = balance_minor - ?, updated_at = ? WHERE id = ?")
      .bind(request.amountMinor, releasedAt, request.sourceAccountId),
    db.prepare("UPDATE sim_accounts SET balance_minor = balance_minor + ?, updated_at = ? WHERE id = ?")
      .bind(request.amountMinor, releasedAt, clearingAccountId),
  ]);
  return { id: request.id, reference: request.reference, status: "COMPLETED" as const, releasedAt };
}

export async function decideSimulationExternalTransfer(command: {
  requestId: string;
  decision: "APPROVE" | "REJECT" | "FLAG_REVIEW";
  reason: string;
  decidedBy: string;
}) {
  await initializeSimulationBank();
  const db = database();
  if (!command.reason.trim()) throw new Error("DECISION_REASON_REQUIRED");
  const request = await db.prepare(`SELECT id, reference, user_id AS userId,
    source_account_id AS sourceAccountId, rail, status,
    amount_minor AS amountMinor, recipient_name AS recipientName,
    scheduled_for AS scheduledFor
    FROM sim_transfer_requests WHERE id = ?`).bind(command.requestId).first<{
      id: string;
      reference: string;
      userId: string;
      sourceAccountId: string;
      rail: SimTransferRequest["rail"];
      status: SimTransferRequest["status"];
      amountMinor: number;
      recipientName: string;
      scheduledFor: string;
    }>();
  if (!request) throw new Error("TRANSFER_REQUEST_NOT_FOUND");
  if (!["PENDING","PROCESSING"].includes(request.status)) throw new Error("TRANSFER_ALREADY_DECIDED");
  if (command.decision === "APPROVE") {
    const complianceHold = await db.prepare("SELECT request_id FROM sim_transfer_compliance_holds WHERE request_id = ?")
      .bind(request.id).first<{ request_id: string }>();
    if (complianceHold) throw new Error("COMPLIANCE_CODE_RELEASE_REQUIRED");
  }

  const decisionId = crypto.randomUUID();
  const decidedAt = new Date().toISOString();
  if (command.decision === "FLAG_REVIEW") {
    await db.batch([
      db.prepare("UPDATE sim_transfer_requests SET status = 'PROCESSING' WHERE id = ?")
        .bind(request.id),
      db.prepare(`INSERT INTO sim_transfer_decisions
        (id, request_id, decision, reason, decided_by, decided_at)
        VALUES (?, ?, 'FLAG_REVIEW', ?, ?, ?)`)
        .bind(decisionId, request.id, command.reason.trim(), command.decidedBy, decidedAt),
    ]);
    await queueSimulationEmailAlert({
      userId: request.userId,
      eventType: "TRANSFER",
      subject: `Transfer ${request.reference} is under review`,
      body: "Your external transfer was flagged for additional operations review.",
    });
    return { id: request.id, reference: request.reference, status: "PROCESSING" as const };
  }

  if (command.decision === "REJECT") {
    await db.batch([
      db.prepare("UPDATE sim_transfer_requests SET status = 'FAILED' WHERE id = ?")
        .bind(request.id),
      db.prepare(`INSERT INTO sim_transfer_decisions
        (id, request_id, decision, reason, decided_by, decided_at)
        VALUES (?, ?, 'REJECT', ?, ?, ?)`)
        .bind(decisionId, request.id, command.reason.trim(), command.decidedBy, decidedAt),
    ]);
    await queueSimulationEmailAlert({
      userId: request.userId,
      eventType: "TRANSFER",
      subject: `Transfer ${request.reference} was rejected`,
      body: "Your external transfer was rejected. No balance was changed.",
    });
    return { id: request.id, reference: request.reference, status: "FAILED" as const };
  }

  const source = await db.prepare("SELECT balance_minor AS balanceMinor FROM sim_accounts WHERE id = ?")
    .bind(request.sourceAccountId).first<{ balanceMinor: number }>();
  if (!source) throw new Error("SOURCE_ACCOUNT_NOT_FOUND");
  if (Number(source.balanceMinor) < request.amountMinor) throw new Error("INSUFFICIENT_FUNDS_AT_APPROVAL");
  const clearingAccountId = request.rail === "INTERNATIONAL_WIRE"
    ? "system-international-clearing"
    : "system-domestic-clearing";
  const debitId = crypto.randomUUID();
  const creditId = crypto.randomUUID();
  const ledgerReference = `EXTSET-${request.reference}`;
  const description = `${request.rail === "ACH" ? "ACH" : "Wire"} transfer to ${request.recipientName}`;
  await db.batch([
    db.prepare("UPDATE sim_transfer_requests SET status = 'COMPLETED' WHERE id = ?")
      .bind(request.id),
    db.prepare(`INSERT INTO sim_transfer_decisions
      (id, request_id, decision, reason, decided_by, decided_at)
      VALUES (?, ?, 'APPROVE', ?, ?, ?)`)
      .bind(decisionId, request.id, command.reason.trim(), command.decidedBy, decidedAt),
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description, effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, 'DEBIT', ?, ?, ?, ?, 'POSTED', NULL)`)
      .bind(debitId, `${ledgerReference}-D`, request.sourceAccountId, request.amountMinor, description, decidedAt, decidedAt),
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description, effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, 'CREDIT', ?, ?, ?, ?, 'POSTED', NULL)`)
      .bind(creditId, `${ledgerReference}-C`, clearingAccountId, request.amountMinor, description, decidedAt, decidedAt),
    db.prepare("UPDATE sim_accounts SET balance_minor = balance_minor - ?, updated_at = ? WHERE id = ?")
      .bind(request.amountMinor, decidedAt, request.sourceAccountId),
    db.prepare("UPDATE sim_accounts SET balance_minor = balance_minor + ?, updated_at = ? WHERE id = ?")
      .bind(request.amountMinor, decidedAt, clearingAccountId),
  ]);
  await queueSimulationEmailAlert({
    userId: request.userId,
    eventType: "TRANSFER",
    subject: `Transfer ${request.reference} completed`,
    body: `Your external transfer of $${(request.amountMinor / 100).toFixed(2)} was approved and posted to clearing.`,
  });
  return { id: request.id, reference: request.reference, status: "COMPLETED" as const };
}

export async function reverseSimulationTransaction(transactionId: string, reason: string) {
  await initializeSimulationBank();
  const db = database();
  const original = await db.prepare(`SELECT id, account_id AS accountId, direction, amount_minor AS amountMinor,
    description, status FROM sim_transactions WHERE id = ?`).bind(transactionId).first<{
      id: string; accountId: string; direction: "CREDIT" | "DEBIT"; amountMinor: number; description: string; status: string;
    }>();
  if (!original || original.status !== "POSTED") throw new Error("TRANSACTION_NOT_REVERSIBLE");
  const reversalDirection = original.direction === "CREDIT" ? "DEBIT" : "CREDIT";
  const account = await db.prepare("SELECT balance_minor AS balanceMinor FROM sim_accounts WHERE id = ?")
    .bind(original.accountId).first<{ balanceMinor: number }>();
  const signed = reversalDirection === "CREDIT" ? original.amountMinor : -original.amountMinor;
  if (!account || Number(account.balanceMinor) + signed < 0) throw new Error("INSUFFICIENT_FUNDS_FOR_REVERSAL");

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const reference = `REV-${createdAt.slice(2,10).replaceAll("-","")}-${id.slice(0,6).toUpperCase()}`;
  await db.batch([
    db.prepare("UPDATE sim_transactions SET status = 'REVERSED' WHERE id = ?").bind(original.id),
    db.prepare(`INSERT INTO sim_transactions
      (id, reference, account_id, direction, amount_minor, description, effective_at, created_at, status, correction_of)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'POSTED', ?)`)
      .bind(id, reference, original.accountId, reversalDirection, original.amountMinor, `Reversal: ${reason}`, createdAt, createdAt, original.id),
    db.prepare("UPDATE sim_accounts SET balance_minor = balance_minor + ?, updated_at = ? WHERE id = ?")
      .bind(signed, createdAt, original.accountId),
  ]);
  return { id, reference };
}
