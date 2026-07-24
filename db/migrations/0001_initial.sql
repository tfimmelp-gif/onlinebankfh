CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE principal_kind AS ENUM ('CUSTOMER','STAFF');
CREATE TYPE user_status AS ENUM ('PENDING_KYC','ACTIVE','SUSPENDED','LOCKED','CLOSED');
CREATE TYPE kyc_status AS ENUM ('DRAFT','SUBMITTED','APPROVED','REJECTED');
CREATE TYPE account_type AS ENUM ('CHECKING','SAVINGS','SYSTEM_TREASURY','SYSTEM_DOMESTIC_CLEARING','SYSTEM_INTERNATIONAL_CLEARING','LOAN_RECEIVABLE','FEE_INCOME');
CREATE TYPE account_status AS ENUM ('PENDING','ACTIVE','FROZEN','CLOSED');
CREATE TYPE ledger_side AS ENUM ('CREDIT','DEBIT');
CREATE TYPE ledger_status AS ENUM ('DRAFT','POSTED','REVERSED');
CREATE TYPE ledger_kind AS ENUM ('FUNDING','INTERNAL_TRANSFER','DOMESTIC_TRANSFER','INTERNATIONAL_TRANSFER','LOAN_DISBURSEMENT','LOAN_PAYMENT','FEE','CORRECTION','REVERSAL');
CREATE TYPE transfer_rail AS ENUM ('INTERNAL','DOMESTIC','INTERNATIONAL');
CREATE TYPE transfer_status AS ENUM ('PENDING','PROCESSING','COMPLETED','BLOCKED','FAILED','CANCELLED');
CREATE TYPE loan_status AS ENUM ('PENDING','APPROVED','REJECTED','ACTIVE','PAID','DEFAULTED');
CREATE TYPE ticket_status AS ENUM ('OPEN','WAITING_FOR_CUSTOMER','WAITING_FOR_STAFF','RESOLVED','CLOSED');
CREATE TYPE stop_scope AS ENUM ('SYSTEM','USER','ACCOUNT');
CREATE TYPE stop_restriction AS ENUM ('ALL_ACTIVITY','ALL_DEBITS','ALL_CREDITS','ALL_TRANSFERS','INTERNAL_TRANSFERS','DOMESTIC_TRANSFERS','INTERNATIONAL_TRANSFERS','LOAN_DISBURSEMENT');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind principal_kind NOT NULL,
  email citext NOT NULL UNIQUE,
  status user_status NOT NULL DEFAULT 'PENDING_KYC',
  email_verified_at timestamptz,
  failed_login_count integer NOT NULL DEFAULT 0 CHECK (failed_login_count >= 0),
  locked_until timestamptz,
  password_changed_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  CHECK (closed_at IS NULL OR status = 'CLOSED')
);

CREATE TABLE auth_credentials (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  password_hash text NOT NULL,
  password_algorithm text NOT NULL DEFAULT 'argon2id',
  password_version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  realm principal_kind NOT NULL,
  token_hash bytea NOT NULL UNIQUE,
  csrf_secret_hash bytea NOT NULL,
  ip_address inet,
  user_agent text,
  mfa_verified_at timestamptz,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE TABLE mfa_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  method text NOT NULL CHECK (method IN ('TOTP','WEBAUTHN')),
  label varchar(100) NOT NULL,
  encrypted_secret bytea,
  webauthn_credential_id bytea UNIQUE,
  webauthn_public_key bytea,
  webauthn_sign_count bigint CHECK (webauthn_sign_count >= 0),
  enabled_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((method='TOTP' AND encrypted_secret IS NOT NULL) OR (method='WEBAUTHN' AND webauthn_credential_id IS NOT NULL AND webauthn_public_key IS NOT NULL))
);

CREATE TABLE roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code varchar(50) NOT NULL UNIQUE, name varchar(100) NOT NULL, description text);
CREATE TABLE permissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code varchar(100) NOT NULL UNIQUE, description text NOT NULL);
CREATE TABLE role_permissions (role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE, permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE, PRIMARY KEY(role_id,permission_id));
CREATE TABLE user_roles (user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT, assigned_by uuid REFERENCES users(id), assigned_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,role_id));

CREATE TABLE customer_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE RESTRICT,
  customer_number varchar(20) NOT NULL UNIQUE,
  first_name varchar(100) NOT NULL,
  middle_name varchar(100),
  last_name varchar(100) NOT NULL,
  date_of_birth date NOT NULL,
  phone varchar(32) NOT NULL,
  address_line1 varchar(200) NOT NULL,
  address_line2 varchar(200),
  city varchar(100) NOT NULL,
  state_region varchar(100) NOT NULL,
  postal_code varchar(20) NOT NULL,
  country_code char(2) NOT NULL,
  occupation varchar(150),
  simulated_id_type varchar(50),
  simulated_id_number varchar(100),
  is_transfer_enabled boolean NOT NULL DEFAULT true,
  is_loan_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE kyc_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status kyc_status NOT NULL DEFAULT 'DRAFT',
  form_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz,
  reviewed_by uuid REFERENCES users(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE RESTRICT,
  account_number varchar(20) NOT NULL UNIQUE,
  type account_type NOT NULL,
  display_name varchar(100) NOT NULL,
  currency char(3) NOT NULL DEFAULT 'USD' CHECK(currency='USD'),
  normal_balance ledger_side NOT NULL,
  status account_status NOT NULL DEFAULT 'PENDING',
  posted_balance_minor bigint NOT NULL DEFAULT 0,
  available_balance_minor bigint NOT NULL DEFAULT 0,
  overdraft_limit_minor bigint NOT NULL DEFAULT 0 CHECK(overdraft_limit_minor>=0),
  version bigint NOT NULL DEFAULT 0 CHECK(version>=0),
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((type IN ('CHECKING','SAVINGS') AND user_id IS NOT NULL AND normal_balance='CREDIT') OR (type NOT IN ('CHECKING','SAVINGS') AND user_id IS NULL))
);

CREATE TABLE account_holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  reference_type varchar(40) NOT NULL,
  reference_id uuid NOT NULL,
  amount_minor bigint NOT NULL CHECK(amount_minor>0),
  reason text NOT NULL,
  expires_at timestamptz,
  released_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX account_holds_active_reference_uq ON account_holds(account_id,reference_type,reference_id) WHERE released_at IS NULL;

CREATE TABLE ledger_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference varchar(32) NOT NULL UNIQUE,
  kind ledger_kind NOT NULL,
  status ledger_status NOT NULL DEFAULT 'DRAFT',
  description varchar(280) NOT NULL,
  initiated_by uuid REFERENCES users(id),
  correction_group_id uuid,
  corrects_transaction_id uuid REFERENCES ledger_transactions(id),
  reverses_transaction_id uuid REFERENCES ledger_transactions(id),
  idempotency_scope varchar(100) NOT NULL,
  idempotency_key varchar(200) NOT NULL,
  effective_at timestamptz NOT NULL,
  posted_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(idempotency_scope,idempotency_key),
  CHECK ((status='DRAFT' AND posted_at IS NULL) OR (status IN ('POSTED','REVERSED') AND posted_at IS NOT NULL))
);

CREATE TABLE ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES ledger_transactions(id) ON DELETE RESTRICT,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  side ledger_side NOT NULL,
  amount_minor bigint NOT NULL CHECK(amount_minor>0),
  statement_description varchar(280) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION protect_posted_ledger() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target_transaction_id uuid;
BEGIN
  target_transaction_id := CASE WHEN TG_OP='DELETE' THEN OLD.transaction_id ELSE NEW.transaction_id END;
  IF EXISTS (SELECT 1 FROM ledger_transactions WHERE id=target_transaction_id AND status IN ('POSTED','REVERSED')) THEN
    RAISE EXCEPTION 'posted ledger entries are immutable';
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
CREATE TRIGGER ledger_entries_immutable BEFORE INSERT OR UPDATE OR DELETE ON ledger_entries FOR EACH ROW EXECUTE FUNCTION protect_posted_ledger();

CREATE OR REPLACE FUNCTION validate_balanced_transaction() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE debit_total bigint; credit_total bigint;
BEGIN
  IF NEW.status IN ('POSTED','REVERSED') AND (TG_OP='INSERT' OR OLD.status='DRAFT') THEN
    SELECT COALESCE(sum(amount_minor) FILTER(WHERE side='DEBIT'),0), COALESCE(sum(amount_minor) FILTER(WHERE side='CREDIT'),0)
      INTO debit_total,credit_total FROM ledger_entries WHERE transaction_id=NEW.id;
    IF debit_total=0 OR debit_total<>credit_total THEN RAISE EXCEPTION 'unbalanced ledger transaction %',NEW.id; END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER ledger_transaction_balance BEFORE INSERT OR UPDATE OF status ON ledger_transactions FOR EACH ROW EXECUTE FUNCTION validate_balanced_transaction();

CREATE OR REPLACE FUNCTION post_ledger_transaction(p_transaction_id uuid)
RETURNS ledger_transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path=public
AS $$
DECLARE
  posted ledger_transactions;
  debit_total bigint;
  credit_total bigint;
  entry_count integer;
BEGIN
  SELECT * INTO posted
  FROM ledger_transactions
  WHERE id=p_transaction_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'ledger transaction not found'; END IF;
  IF posted.status<>'DRAFT' THEN RAISE EXCEPTION 'ledger transaction is not draft'; END IF;

  SELECT count(*),
         COALESCE(sum(amount_minor) FILTER(WHERE side='DEBIT'),0),
         COALESCE(sum(amount_minor) FILTER(WHERE side='CREDIT'),0)
  INTO entry_count,debit_total,credit_total
  FROM ledger_entries WHERE transaction_id=p_transaction_id;

  IF entry_count<2 OR debit_total=0 OR debit_total<>credit_total THEN
    RAISE EXCEPTION 'unbalanced ledger transaction %',p_transaction_id;
  END IF;

  PERFORM 1
  FROM accounts
  WHERE id IN (SELECT account_id FROM ledger_entries WHERE transaction_id=p_transaction_id)
  ORDER BY id
  FOR UPDATE;

  IF EXISTS (
    SELECT 1 FROM accounts
    WHERE id IN (SELECT account_id FROM ledger_entries WHERE transaction_id=p_transaction_id)
      AND status IN ('FROZEN','CLOSED')
  ) AND posted.kind NOT IN ('REVERSAL','CORRECTION') THEN
    RAISE EXCEPTION 'account unavailable for posting';
  END IF;

  WITH deltas AS (
    SELECT le.account_id,
      sum(CASE WHEN le.side=a.normal_balance THEN le.amount_minor ELSE -le.amount_minor END) AS delta
    FROM ledger_entries le JOIN accounts a ON a.id=le.account_id
    WHERE le.transaction_id=p_transaction_id
    GROUP BY le.account_id
  )
  UPDATE accounts a
  SET posted_balance_minor=a.posted_balance_minor+d.delta,
      available_balance_minor=a.available_balance_minor+d.delta,
      version=a.version+1,
      updated_at=now()
  FROM deltas d WHERE a.id=d.account_id;

  UPDATE ledger_transactions
  SET status='POSTED',posted_at=now()
  WHERE id=p_transaction_id
  RETURNING * INTO posted;

  RETURN posted;
END $$;

CREATE TABLE stop_code_definitions (
  code varchar(50) PRIMARY KEY,
  name varchar(100) NOT NULL,
  restriction stop_restriction NOT NULL,
  customer_message varchar(280) NOT NULL,
  internal_description text NOT NULL,
  hard_block boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE stop_code_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(50) NOT NULL REFERENCES stop_code_definitions(code),
  scope stop_scope NOT NULL,
  user_id uuid REFERENCES users(id),
  account_id uuid REFERENCES accounts(id),
  reason text NOT NULL,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_by uuid REFERENCES users(id),
  revoked_at timestamptz,
  revoke_reason text,
  CHECK ((scope='SYSTEM' AND user_id IS NULL AND account_id IS NULL) OR (scope='USER' AND user_id IS NOT NULL AND account_id IS NULL) OR (scope='ACCOUNT' AND user_id IS NULL AND account_id IS NOT NULL))
);

CREATE TABLE beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind transfer_rail NOT NULL,
  nickname varchar(100),
  beneficiary_name varchar(200) NOT NULL,
  internal_account_id uuid REFERENCES accounts(id),
  bank_name varchar(200),
  account_identifier varchar(100),
  routing_number varchar(50),
  swift_bic varchar(20),
  iban varchar(50),
  country_code char(2),
  currency char(3) NOT NULL DEFAULT 'USD' CHECK(currency='USD'),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference varchar(32) NOT NULL UNIQUE,
  rail transfer_rail NOT NULL,
  status transfer_status NOT NULL DEFAULT 'PENDING',
  source_account_id uuid NOT NULL REFERENCES accounts(id),
  destination_account_id uuid REFERENCES accounts(id),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  amount_minor bigint NOT NULL CHECK(amount_minor>0),
  fee_minor bigint NOT NULL DEFAULT 0 CHECK(fee_minor>=0),
  currency char(3) NOT NULL DEFAULT 'USD' CHECK(currency='USD'),
  memo varchar(280),
  requested_by uuid NOT NULL REFERENCES users(id),
  approved_by uuid REFERENCES users(id),
  ledger_transaction_id uuid UNIQUE REFERENCES ledger_transactions(id),
  stop_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,
  idempotency_scope varchar(100) NOT NULL,
  idempotency_key varchar(200) NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  scheduled_for timestamptz,
  executed_at timestamptz,
  failure_code varchar(80),
  failure_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(idempotency_scope,idempotency_key),
  CHECK ((rail='INTERNAL' AND destination_account_id IS NOT NULL) OR (rail<>'INTERNAL' AND beneficiary_id IS NOT NULL)),
  CHECK(source_account_id<>destination_account_id)
);

CREATE TABLE loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  reference varchar(32) NOT NULL UNIQUE,
  status loan_status NOT NULL DEFAULT 'PENDING',
  requested_amount_minor bigint NOT NULL CHECK(requested_amount_minor>0),
  approved_amount_minor bigint CHECK(approved_amount_minor>0),
  annual_interest_bps integer CHECK(annual_interest_bps BETWEEN 0 AND 100000),
  term_months integer CHECK(term_months BETWEEN 1 AND 600),
  purpose text NOT NULL,
  terms_snapshot jsonb,
  applied_at timestamptz NOT NULL DEFAULT now(),
  decided_by uuid REFERENCES users(id),
  decided_at timestamptz,
  rejection_reason text,
  disbursement_account_id uuid REFERENCES accounts(id),
  disbursement_transaction_id uuid UNIQUE REFERENCES ledger_transactions(id),
  activated_at timestamptz,
  matured_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number varchar(24) NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES users(id),
  subject varchar(200) NOT NULL,
  message text NOT NULL,
  admin_reply text,
  status ticket_status NOT NULL DEFAULT 'OPEN',
  priority text NOT NULL DEFAULT 'NORMAL' CHECK(priority IN ('LOW','NORMAL','HIGH','URGENT')),
  assigned_to uuid REFERENCES users(id),
  last_message_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid REFERENCES users(id),
  actor_session_id uuid REFERENCES auth_sessions(id),
  action varchar(100) NOT NULL,
  resource_type varchar(80) NOT NULL,
  resource_id uuid,
  ip_address inet,
  user_agent text,
  request_id uuid NOT NULL,
  reason text,
  before_state jsonb,
  after_state jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  prev_hash bytea,
  event_hash bytea NOT NULL
);

CREATE TABLE outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic varchar(100) NOT NULL,
  aggregate_type varchar(80) NOT NULL,
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL,
  attempts integer NOT NULL DEFAULT 0 CHECK(attempts>=0),
  available_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE VIEW account_statement_entries AS
SELECT le.id,le.account_id,lt.reference,lt.effective_at,lt.posted_at,le.statement_description,le.side,le.amount_minor,
  sum(CASE WHEN le.side=a.normal_balance THEN le.amount_minor ELSE -le.amount_minor END)
  OVER(PARTITION BY le.account_id ORDER BY lt.effective_at,lt.posted_at,lt.id,le.id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_balance_minor
FROM ledger_entries le JOIN ledger_transactions lt ON lt.id=le.transaction_id JOIN accounts a ON a.id=le.account_id
WHERE lt.status IN ('POSTED','REVERSED');

INSERT INTO roles(code,name) VALUES
 ('SUPER_ADMIN','Super Administrator'),('OPERATIONS','Operations'),('LOAN_OFFICER','Loan Officer'),('SUPPORT_AGENT','Support Agent'),('AUDITOR','Auditor');
INSERT INTO permissions(code,description) VALUES
 ('CUSTOMER_READ','Read customer records'),('CUSTOMER_WRITE','Edit customer profiles'),('KYC_DECIDE','Approve or reject KYC'),
 ('ACCOUNT_OPEN','Open accounts'),('ACCOUNT_FUND','Fund accounts'),('ACCOUNT_FREEZE','Freeze accounts'),
 ('TRANSFER_CREATE','Create staff transfers'),('TRANSFER_REVIEW','Review transfers'),('LOAN_DECIDE','Decide loans'),
 ('TICKET_REPLY','Reply to support'),('TRANSACTION_CORRECT','Correct posted transactions'),('AUDIT_READ','Read audit log'),('ROLE_MANAGE','Manage roles');
INSERT INTO stop_code_definitions(code,name,restriction,customer_message,internal_description) VALUES
 ('ACCOUNT_FREEZE','Account freeze','ALL_ACTIVITY','This account is temporarily unavailable.','Block all activity.'),
 ('DEBIT_STOP','Debit stop','ALL_DEBITS','Debit activity is temporarily unavailable.','Block debit postings.'),
 ('TRANSFER_STOP','Transfer stop','ALL_TRANSFERS','Transfers are temporarily unavailable.','Block all transfers.'),
 ('DOMESTIC_STOP','Domestic stop','DOMESTIC_TRANSFERS','Domestic transfers are temporarily unavailable.','Block domestic transfers.'),
 ('INTERNATIONAL_STOP','International stop','INTERNATIONAL_TRANSFERS','International transfers are temporarily unavailable.','Block international transfers.'),
 ('CREDIT_ONLY','Credit only','ALL_DEBITS','Debit activity is temporarily unavailable.','Permit credits only.');
