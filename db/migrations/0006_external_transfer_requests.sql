CREATE TABLE IF NOT EXISTS sim_transfer_requests (
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
);

CREATE INDEX IF NOT EXISTS sim_transfer_requests_user_date_idx
  ON sim_transfer_requests(user_id, requested_at DESC);
