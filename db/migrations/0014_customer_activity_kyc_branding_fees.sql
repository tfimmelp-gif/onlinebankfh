CREATE TABLE IF NOT EXISTS sim_kyc_documents (
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
);
CREATE INDEX IF NOT EXISTS sim_kyc_documents_user_uploaded_idx ON sim_kyc_documents(user_id,uploaded_at DESC);

CREATE TABLE IF NOT EXISTS sim_brand_profiles (
  id TEXT PRIMARY KEY,
  bank_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  support_email TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0,1)),
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS sim_brand_one_active_idx ON sim_brand_profiles(active) WHERE active=1;

CREATE TABLE IF NOT EXISTS sim_processing_fee_rules (
  rail TEXT PRIMARY KEY CHECK (rail IN ('INTERNAL','P2P','ACH','DOMESTIC_WIRE','INTERNATIONAL_WIRE')),
  percentage_bps INTEGER NOT NULL DEFAULT 0 CHECK (percentage_bps BETWEEN 0 AND 10000),
  fixed_minor INTEGER NOT NULL DEFAULT 0 CHECK (fixed_minor >= 0),
  minimum_minor INTEGER NOT NULL DEFAULT 0 CHECK (minimum_minor >= 0),
  maximum_minor INTEGER CHECK (maximum_minor IS NULL OR maximum_minor >= minimum_minor),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
