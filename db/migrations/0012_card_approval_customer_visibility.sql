CREATE TABLE IF NOT EXISTS sim_customer_hidden_transactions (
  transaction_id TEXT PRIMARY KEY REFERENCES sim_transactions(id),
  hidden_reason TEXT NOT NULL,
  hidden_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sim_virtual_card_requests (
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
);

CREATE INDEX IF NOT EXISTS sim_virtual_cards_user_status_idx
  ON sim_virtual_card_requests(user_id,status,requested_at DESC);
