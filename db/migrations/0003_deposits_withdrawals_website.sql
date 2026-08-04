-- Administrative deposit, withdrawal, and website-management capabilities.
-- All money movement remains closed-loop and posts through approved ledger functions.

CREATE TYPE deposit_schedule_status AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
CREATE TYPE withdrawal_method_status AS ENUM ('ACTIVE', 'PAUSED', 'RETIRED');
CREATE TYPE withdrawal_request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');
CREATE TYPE website_revision_status AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE deposit_schedules (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  destination_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  source_account_id      UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  amount_minor           BIGINT NOT NULL CHECK (amount_minor > 0),
  frequency              VARCHAR(20) NOT NULL CHECK (frequency IN ('WEEKLY','BIWEEKLY','MONTHLY','QUARTERLY')),
  statement_description  VARCHAR(280) NOT NULL,
  status                 deposit_schedule_status NOT NULL DEFAULT 'ACTIVE',
  next_run_at             TIMESTAMPTZ NOT NULL,
  last_run_at             TIMESTAMPTZ,
  created_by              UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (source_account_id <> destination_account_id)
);

CREATE INDEX deposit_schedules_due_idx
  ON deposit_schedules(next_run_at)
  WHERE status = 'ACTIVE';

CREATE TABLE withdrawal_methods (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                   VARCHAR(50) NOT NULL UNIQUE,
  name                   VARCHAR(100) NOT NULL,
  customer_instructions  TEXT NOT NULL,
  settlement_account_id  UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  minimum_minor          BIGINT NOT NULL CHECK (minimum_minor > 0),
  maximum_minor          BIGINT NOT NULL CHECK (maximum_minor >= minimum_minor),
  processing_time        VARCHAR(60) NOT NULL,
  status                 withdrawal_method_status NOT NULL DEFAULT 'ACTIVE',
  created_by              UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE withdrawal_requests (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference              VARCHAR(32) NOT NULL UNIQUE,
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  source_account_id      UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  method_id              UUID NOT NULL REFERENCES withdrawal_methods(id) ON DELETE RESTRICT,
  amount_minor           BIGINT NOT NULL CHECK (amount_minor > 0),
  status                 withdrawal_request_status NOT NULL DEFAULT 'PENDING',
  requested_by           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  decided_by             UUID REFERENCES users(id) ON DELETE RESTRICT,
  decision_reason        TEXT,
  ledger_transaction_id  UUID UNIQUE REFERENCES ledger_transactions(id) ON DELETE RESTRICT,
  idempotency_key        VARCHAR(200) NOT NULL UNIQUE,
  requested_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at             TIMESTAMPTZ,
  completed_at           TIMESTAMPTZ,
  CHECK (
    (status = 'PENDING' AND decided_by IS NULL AND decided_at IS NULL)
    OR (status <> 'PENDING' AND decided_by IS NOT NULL AND decided_at IS NOT NULL)
  )
);

CREATE TABLE website_content_revisions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key            VARCHAR(100) NOT NULL,
  revision_number        INTEGER NOT NULL CHECK (revision_number > 0),
  status                 website_revision_status NOT NULL DEFAULT 'DRAFT',
  content                JSONB NOT NULL,
  change_reason          TEXT NOT NULL,
  created_by             UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  published_by           UUID REFERENCES users(id) ON DELETE RESTRICT,
  scheduled_for          TIMESTAMPTZ,
  published_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_key, revision_number),
  CHECK (status <> 'PUBLISHED' OR (published_by IS NOT NULL AND published_at IS NOT NULL))
);

CREATE UNIQUE INDEX website_one_published_revision_idx
  ON website_content_revisions(content_key)
  WHERE status = 'PUBLISHED';
