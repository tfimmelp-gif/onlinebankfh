CREATE TABLE IF NOT EXISTS sim_scheduled_transfers (
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
);

CREATE INDEX IF NOT EXISTS sim_scheduled_transfers_user_due_idx
  ON sim_scheduled_transfers(user_id, status, scheduled_for);
