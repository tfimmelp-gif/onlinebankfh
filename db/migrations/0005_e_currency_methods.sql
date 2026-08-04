-- Closed-loop E-currency simulation. No blockchain or external wallet integration.
CREATE TYPE e_currency_method_status AS ENUM ('ACTIVE', 'PAUSED', 'RETIRED');
CREATE TYPE e_currency_direction AS ENUM ('DEPOSIT', 'WITHDRAWAL');
CREATE TYPE e_currency_instruction_status AS ENUM ('PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED');

CREATE TABLE e_currency_methods (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                   VARCHAR(50) NOT NULL UNIQUE,
  name                   VARCHAR(100) NOT NULL,
  synthetic_currency     VARCHAR(20) NOT NULL,
  allows_deposits        BOOLEAN NOT NULL DEFAULT TRUE,
  allows_withdrawals     BOOLEAN NOT NULL DEFAULT TRUE,
  mock_usd_rate          NUMERIC(24,8) NOT NULL CHECK (mock_usd_rate > 0),
  fee_minor              BIGINT NOT NULL DEFAULT 0 CHECK (fee_minor >= 0),
  minimum_usd_minor      BIGINT NOT NULL CHECK (minimum_usd_minor > 0),
  maximum_usd_minor      BIGINT NOT NULL CHECK (maximum_usd_minor >= minimum_usd_minor),
  wallet_prefix          VARCHAR(80) NOT NULL,
  customer_instructions  TEXT NOT NULL,
  status                 e_currency_method_status NOT NULL DEFAULT 'ACTIVE',
  created_by             UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (allows_deposits OR allows_withdrawals)
);

CREATE TABLE customer_e_currency_wallets (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  method_id              UUID NOT NULL REFERENCES e_currency_methods(id) ON DELETE RESTRICT,
  wallet_identifier      VARCHAR(160) NOT NULL UNIQUE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  disabled_at            TIMESTAMPTZ,
  UNIQUE (user_id, method_id)
);

CREATE TABLE e_currency_instructions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference              VARCHAR(32) NOT NULL UNIQUE,
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  account_id             UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  method_id              UUID NOT NULL REFERENCES e_currency_methods(id) ON DELETE RESTRICT,
  wallet_id              UUID NOT NULL REFERENCES customer_e_currency_wallets(id) ON DELETE RESTRICT,
  direction              e_currency_direction NOT NULL,
  synthetic_amount       NUMERIC(30,10) NOT NULL CHECK (synthetic_amount > 0),
  usd_amount_minor       BIGINT NOT NULL CHECK (usd_amount_minor > 0),
  mock_rate_snapshot     NUMERIC(24,8) NOT NULL CHECK (mock_rate_snapshot > 0),
  fee_minor              BIGINT NOT NULL DEFAULT 0 CHECK (fee_minor >= 0),
  status                 e_currency_instruction_status NOT NULL DEFAULT 'PENDING',
  ledger_transaction_id  UUID UNIQUE REFERENCES ledger_transactions(id) ON DELETE RESTRICT,
  idempotency_key        VARCHAR(200) NOT NULL UNIQUE,
  requested_by           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  requested_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at           TIMESTAMPTZ,
  metadata               JSONB NOT NULL DEFAULT '{"simulation_only":true}'::jsonb
);
