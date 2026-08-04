CREATE TABLE IF NOT EXISTS sim_transfer_decisions (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES sim_transfer_requests(id),
  decision TEXT NOT NULL CHECK (decision IN ('APPROVE','REJECT','FLAG_REVIEW')),
  reason TEXT NOT NULL,
  decided_by TEXT NOT NULL,
  decided_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS sim_transfer_decisions_request_idx
  ON sim_transfer_decisions(request_id, decided_at DESC);
