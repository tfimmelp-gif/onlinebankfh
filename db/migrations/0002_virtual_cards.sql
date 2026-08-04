-- Profile-linked virtual cards for the closed-loop simulation.
-- PAN and CVV values are synthetic, encrypted application-side, and never sent to live rails.

CREATE TYPE virtual_card_status AS ENUM ('ACTIVE', 'FROZEN', 'TERMINATED');
CREATE TYPE card_authorization_status AS ENUM ('APPROVED', 'DECLINED', 'REVERSED');

CREATE TABLE virtual_cards (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  funding_account_id     UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  card_reference         VARCHAR(32) NOT NULL UNIQUE,
  display_name           VARCHAR(50) NOT NULL,
  pan_ciphertext         BYTEA NOT NULL,
  pan_last4              CHAR(4) NOT NULL CHECK (pan_last4 ~ '^[0-9]{4}$'),
  cvv_ciphertext         BYTEA NOT NULL,
  expiry_month           SMALLINT NOT NULL CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year            SMALLINT NOT NULL CHECK (expiry_year BETWEEN 2026 AND 2200),
  status                 virtual_card_status NOT NULL DEFAULT 'ACTIVE',
  monthly_limit_minor    BIGINT NOT NULL CHECK (monthly_limit_minor > 0),
  single_use             BOOLEAN NOT NULL DEFAULT FALSE,
  issued_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  frozen_at              TIMESTAMPTZ,
  terminated_at          TIMESTAMPTZ,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (status = 'ACTIVE' AND frozen_at IS NULL AND terminated_at IS NULL)
    OR (status = 'FROZEN' AND frozen_at IS NOT NULL AND terminated_at IS NULL)
    OR (status = 'TERMINATED' AND terminated_at IS NOT NULL)
  )
);

CREATE INDEX virtual_cards_profile_idx
  ON virtual_cards(user_id, status, issued_at DESC);

CREATE TABLE card_authorizations (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id                UUID NOT NULL REFERENCES virtual_cards(id) ON DELETE RESTRICT,
  authorization_reference VARCHAR(32) NOT NULL UNIQUE,
  merchant_name          VARCHAR(160) NOT NULL,
  merchant_category      VARCHAR(80),
  amount_minor           BIGINT NOT NULL CHECK (amount_minor > 0),
  currency               CHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'),
  status                 card_authorization_status NOT NULL,
  decline_code           VARCHAR(80),
  ledger_transaction_id  UUID UNIQUE REFERENCES ledger_transactions(id) ON DELETE RESTRICT,
  authorized_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  reversed_at            TIMESTAMPTZ,
  metadata               JSONB NOT NULL DEFAULT '{}'::jsonb,
  CHECK (status <> 'DECLINED' OR decline_code IS NOT NULL),
  CHECK (status <> 'REVERSED' OR reversed_at IS NOT NULL)
);

CREATE INDEX card_authorizations_card_activity_idx
  ON card_authorizations(card_id, authorized_at DESC);

-- Issuance, reveal, freeze, limit change, termination, and simulated
-- authorization decisions must each append an audit_events record.
