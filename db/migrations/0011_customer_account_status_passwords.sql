CREATE TABLE IF NOT EXISTS sim_customer_account_statuses (
  user_id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE','INACTIVE','IN_REVIEW')),
  updated_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS sim_customer_account_statuses_status_idx
ON sim_customer_account_statuses(status, updated_at DESC);

CREATE TABLE IF NOT EXISTS sim_customer_credentials (
  user_id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_reset_required INTEGER NOT NULL DEFAULT 1
    CHECK (password_reset_required IN (0,1)),
  changed_by TEXT NOT NULL,
  changed_at TEXT NOT NULL
);
