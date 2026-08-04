CREATE TABLE IF NOT EXISTS sim_stop_code_definitions (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  customer_message TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sim_customer_transfer_controls (
  user_id TEXT PRIMARY KEY,
  external_mode TEXT NOT NULL CHECK (external_mode IN ('STANDARD_APPROVAL','COMPLIANCE_CODE')),
  preferred_stop_code TEXT REFERENCES sim_stop_code_definitions(code),
  updated_at TEXT NOT NULL,
  CHECK (external_mode = 'STANDARD_APPROVAL' OR preferred_stop_code IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS sim_transfer_compliance_holds (
  request_id TEXT PRIMARY KEY REFERENCES sim_transfer_requests(id),
  stop_code TEXT NOT NULL REFERENCES sim_stop_code_definitions(code),
  state TEXT NOT NULL CHECK (state IN ('AWAITING_CODE','REQUESTED','CODE_ISSUED','RELEASED')),
  code_hash TEXT,
  code_hint TEXT,
  requested_at TEXT NOT NULL,
  code_requested_at TEXT,
  issued_at TEXT,
  released_at TEXT
);

CREATE TABLE IF NOT EXISTS sim_customer_compliance_codes (
  user_id TEXT NOT NULL,
  stop_code TEXT NOT NULL REFERENCES sim_stop_code_definitions(code),
  code_hash TEXT NOT NULL,
  code_hint TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  generated_by TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, stop_code)
);
