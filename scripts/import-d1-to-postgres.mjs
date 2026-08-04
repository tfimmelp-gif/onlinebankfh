import { DatabaseSync } from "node:sqlite";
import { copyFileSync, existsSync, statSync, unlinkSync } from "node:fs";
import pg from "pg";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Usage: import-d1-to-postgres.mjs /path/to/local-d1.sqlite");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (process.env.CONFIRM_EMPTY_TARGET !== "YES") {
  throw new Error("Set CONFIRM_EMPTY_TARGET=YES after confirming the target is a new empty VPS database");
}
if (statSync(sourcePath).size < 4096) throw new Error("The supplied SQLite database is empty or invalid");
const workingCopy = `/tmp/northstar-d1-import-${process.pid}.sqlite`;
copyFileSync(sourcePath, workingCopy);
const copiedSidecars = [];
for (const suffix of ["-wal", "-shm"]) {
  const sourceSidecar = `${sourcePath}${suffix}`;
  if (!existsSync(sourceSidecar)) continue;
  const copiedSidecar = `${workingCopy}${suffix}`;
  copyFileSync(sourceSidecar, copiedSidecar);
  copiedSidecars.push(copiedSidecar);
}

const identifier = (value) => {
  if (!/^sim_[a-z0-9_]+$/.test(value) && !/^[a-z][a-z0-9_]+$/.test(value)) throw new Error(`Unsafe identifier: ${value}`);
  return `"${value}"`;
};

const source = new DatabaseSync(workingCopy, { readOnly: true });
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
const client = await pool.connect();

try {
  const targetCounts = await client.query(`SELECT
    (SELECT count(*)::int FROM sim_customer_directory) AS customers,
    (SELECT count(*)::int FROM sim_transactions) AS transactions`);
  if (targetCounts.rows[0].customers !== 0 || targetCounts.rows[0].transactions !== 0) {
    throw new Error("Target PostgreSQL database is not empty; import was refused");
  }

  const tables = source.prepare(`SELECT name FROM sqlite_master
    WHERE type='table' AND name LIKE 'sim_%' ORDER BY name`).all().map((row) => String(row.name));
  const sourceKycCount = tables.includes("sim_kyc_documents")
    ? Number(source.prepare("SELECT count(*) AS count FROM sim_kyc_documents").get().count)
    : 0;
  if (sourceKycCount > 0 && process.env.CONFIRM_OBJECTS_COPIED !== "YES") {
    throw new Error("KYC metadata exists. Copy the matching R2 objects first, then set CONFIRM_OBJECTS_COPIED=YES");
  }

  const targetTables = await client.query(`SELECT table_name FROM information_schema.tables
    WHERE table_schema='public' AND table_name LIKE 'sim_%'`);
  const allowedTargets = new Set(targetTables.rows.map((row) => row.table_name));
  const importTables = tables.filter((table) => allowedTargets.has(table));
  if (!importTables.includes("sim_accounts") || !importTables.includes("sim_customer_directory")) {
    throw new Error("Source does not contain the required Northstar tables");
  }

  await client.query("BEGIN");
  await client.query("SET LOCAL session_replication_role = replica");
  await client.query(`TRUNCATE TABLE ${targetTables.rows.map((row) => identifier(row.table_name)).join(", ")} CASCADE`);

  const imported = {};
  for (const table of importTables) {
    const columns = source.prepare(`PRAGMA table_info(${identifier(table)})`).all().map((row) => String(row.name));
    const targetColumns = await client.query(`SELECT column_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name=$1`, [table]);
    const targetColumnSet = new Set(targetColumns.rows.map((row) => row.column_name));
    const missing = columns.filter((column) => !targetColumnSet.has(column));
    if (missing.length) throw new Error(`${table} has columns missing from PostgreSQL: ${missing.join(", ")}`);
    const rows = source.prepare(`SELECT * FROM ${identifier(table)}`).all();
    imported[table] = rows.length;
    for (let offset = 0; offset < rows.length; offset += 200) {
      const chunk = rows.slice(offset, offset + 200);
      const values = [];
      const tuples = chunk.map((row) => `(${columns.map((column) => {
        values.push(row[column]);
        return `$${values.length}`;
      }).join(",")})`);
      await client.query(`INSERT INTO ${identifier(table)} (${columns.map(identifier).join(",")}) VALUES ${tuples.join(",")}`, values);
    }
  }
  await client.query("SET LOCAL session_replication_role = origin");
  await client.query("COMMIT");

  const verification = await client.query(`SELECT
    (SELECT count(*)::int FROM sim_customer_directory) AS customers,
    (SELECT count(*)::int FROM sim_accounts WHERE user_id <> 'SYSTEM') AS customer_accounts,
    (SELECT count(*)::int FROM sim_transactions) AS transactions`);
  process.stdout.write(`${JSON.stringify({ imported, verification: verification.rows[0] }, null, 2)}\n`);
  process.stdout.write("D1 rows imported. Run the normal migration once more to restore any new system defaults.\n");
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  client.release();
  await pool.end();
  source.close();
  unlinkSync(workingCopy);
  for (const sidecar of copiedSidecars) unlinkSync(sidecar);
}
