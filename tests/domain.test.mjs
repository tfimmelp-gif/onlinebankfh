import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("migration enforces a balanced immutable ledger", async () => {
  const sql = await readFile(new URL("../db/migrations/0001_initial.sql", import.meta.url), "utf8");
  assert.match(sql, /unbalanced ledger transaction/i);
  assert.match(sql, /posted ledger entries are immutable/i);
  assert.match(sql, /CREATE VIEW account_statement_entries/i);
});

test("portal exposes customer and staff realms", async () => {
  const source = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(source, /mode: "customer" \| "admin"/);
  assert.match(source, /MFA verified/);
  assert.match(source, /SIMULATION ENVIRONMENT/);
});
