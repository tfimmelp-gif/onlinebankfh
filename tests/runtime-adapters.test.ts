import test from "node:test";
import assert from "node:assert/strict";
import { toPostgresSql } from "../server/runtime/database";

test("D1 placeholders and camel-case aliases translate to PostgreSQL", () => {
  assert.equal(
    toPostgresSql("SELECT user_id AS userId, balance_minor AS balanceMinor FROM sim_accounts WHERE id=? AND user_id=?"),
    'SELECT user_id AS "userId", balance_minor AS "balanceMinor" FROM sim_accounts WHERE id=$1 AND user_id=$2',
  );
});

test("SQLite insert-or-ignore becomes an idempotent PostgreSQL insert", () => {
  assert.equal(
    toPostgresSql("INSERT OR IGNORE INTO sim_accounts (id,user_id) VALUES (?,?)"),
    "INSERT INTO sim_accounts (id,user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
  );
});

test("money columns use 64-bit PostgreSQL integers", () => {
  assert.match(toPostgresSql("CREATE TABLE sample (amount_minor INTEGER NOT NULL)"), /amount_minor BIGINT NOT NULL/);
});

test("the SQLite balance trigger becomes a PostgreSQL trigger function", () => {
  const translated = toPostgresSql("CREATE TRIGGER IF NOT EXISTS sim_accounts_customer_nonnegative_balance BEFORE UPDATE OF balance_minor ON sim_accounts BEGIN SELECT RAISE(ABORT,'CUSTOMER_BALANCE_CANNOT_BE_NEGATIVE'); END");
  assert.match(translated, /LANGUAGE plpgsql/);
  assert.match(translated, /CUSTOMER_BALANCE_CANNOT_BE_NEGATIVE/);
  assert.match(translated, /CREATE TRIGGER sim_accounts_customer_nonnegative_balance/);
});

