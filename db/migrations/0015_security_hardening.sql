CREATE TABLE IF NOT EXISTS sim_security_rate_limits (
  bucket_key TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL CHECK (request_count > 0),
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sim_idempotency_records (
  scope TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  reference TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (scope, idempotency_key)
);

CREATE TRIGGER IF NOT EXISTS sim_accounts_customer_nonnegative_balance
BEFORE UPDATE OF balance_minor ON sim_accounts
WHEN NEW.user_id <> 'SYSTEM' AND NEW.balance_minor < 0
BEGIN
  SELECT RAISE(ABORT, 'CUSTOMER_BALANCE_CANNOT_BE_NEGATIVE');
END;
