CREATE TABLE IF NOT EXISTS sim_customer_account_preferences (
  user_id TEXT PRIMARY KEY,
  requested_account_type TEXT NOT NULL
    CHECK (requested_account_type IN ('CHECKING','SAVINGS','INVESTMENT')),
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sim_admin_identity (
  id TEXT PRIMARY KEY CHECK (id = 'PRIMARY'),
  display_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sim_admin_notification_settings (
  id TEXT PRIMARY KEY CHECK (id = 'PRIMARY'),
  discord_enabled INTEGER NOT NULL DEFAULT 0 CHECK (discord_enabled IN (0,1)),
  discord_webhook_encrypted TEXT,
  last_delivery_at TEXT,
  last_error TEXT,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
