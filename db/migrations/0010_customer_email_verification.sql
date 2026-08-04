CREATE TABLE IF NOT EXISTS sim_customer_directory (
  user_id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  status TEXT NOT NULL CHECK (status IN ('PENDING','ACTIVE','SUSPENDED','BANNED')),
  email_verified_at TEXT,
  created_source TEXT NOT NULL CHECK (created_source IN ('CUSTOMER','ADMIN')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS sim_customer_directory_status_idx
ON sim_customer_directory(status, created_at DESC);

CREATE TABLE IF NOT EXISTS sim_email_verification_challenges (
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
);

CREATE INDEX IF NOT EXISTS sim_email_challenges_lookup_idx
ON sim_email_verification_challenges(email, purpose, created_at DESC);
