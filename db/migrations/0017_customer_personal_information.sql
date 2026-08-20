CREATE TABLE IF NOT EXISTS sim_customer_personal_information (
  user_id TEXT PRIMARY KEY,
  date_of_birth TEXT,
  phone TEXT,
  id_type TEXT,
  id_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state_region TEXT,
  postal_code TEXT,
  country_code TEXT,
  occupation TEXT,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sim_customer_profile_changes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  before_state TEXT NOT NULL,
  after_state TEXT NOT NULL,
  reason TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS sim_customer_profile_changes_user_idx
  ON sim_customer_profile_changes(user_id, changed_at DESC);
