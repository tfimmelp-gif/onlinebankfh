CREATE TABLE IF NOT EXISTS sim_statement_onboarding_batches (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES sim_accounts(id),
  entry_count INTEGER NOT NULL CHECK (entry_count > 0),
  net_change_minor INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sim_statement_onboarding_entries (
  batch_id TEXT NOT NULL REFERENCES sim_statement_onboarding_batches(id),
  transaction_id TEXT NOT NULL UNIQUE REFERENCES sim_transactions(id),
  row_index INTEGER NOT NULL CHECK (row_index >= 0),
  PRIMARY KEY (batch_id, row_index)
);

CREATE TABLE IF NOT EXISTS sim_customer_deposit_methods (
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
    (method_type = 'BANK_TRANSFER'
      AND bank_name IS NOT NULL
      AND account_name IS NOT NULL
      AND account_number IS NOT NULL
      AND routing_number IS NOT NULL
      AND crypto_asset IS NULL
      AND crypto_network IS NULL
      AND wallet_address IS NULL)
    OR
    (method_type = 'CRYPTO'
      AND bank_name IS NULL
      AND account_name IS NULL
      AND account_number IS NULL
      AND routing_number IS NULL
      AND swift_bic IS NULL
      AND crypto_asset IS NOT NULL
      AND crypto_network IS NOT NULL
      AND wallet_address IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS sim_customer_deposit_methods_user_idx
  ON sim_customer_deposit_methods(user_id, active, method_type);

CREATE TABLE IF NOT EXISTS sim_customer_deposit_requests (
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
);

CREATE INDEX IF NOT EXISTS sim_customer_deposit_requests_user_idx
  ON sim_customer_deposit_requests(user_id, requested_at DESC);

CREATE TABLE IF NOT EXISTS sim_email_alerts (
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
);

CREATE INDEX IF NOT EXISTS sim_email_alerts_user_date_idx
  ON sim_email_alerts(user_id, created_at DESC);
