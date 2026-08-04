import type { Pool, PoolClient, QueryResult } from "pg";

export type DatabaseResult<T> = { results: T[]; meta?: { changes?: number } };

export interface PreparedStatement {
  readonly sql: string;
  readonly values: readonly unknown[];
  bind(...values: unknown[]): PreparedStatement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<DatabaseResult<T>>;
}

export interface ApplicationDatabase {
  prepare(query: string): PreparedStatement;
  batch(statements: PreparedStatement[]): Promise<DatabaseResult<unknown>[]>;
}

type CloudflareDatabase = {
  prepare(query: string): {
    bind(...values: unknown[]): unknown;
    first<T>(): Promise<T | null>;
    all<T>(): Promise<{ results: T[] }>;
  };
  batch(statements: unknown[]): Promise<Array<{ results?: unknown[]; meta?: { changes?: number } }>>;
};

let postgresPoolPromise: Promise<Pool> | null = null;
let cloudflareDatabasePromise: Promise<CloudflareDatabase> | null = null;

function usesPostgres() {
  return Boolean(process.env.DATABASE_URL);
}

async function postgresPool() {
  if (!postgresPoolPromise) {
    postgresPoolPromise = (async () => {
      const moduleName = "pg";
      const pg = await import(/* @vite-ignore */ moduleName) as typeof import("pg");
      pg.types.setTypeParser(20, (value) => Number(value));
      const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        max: Number(process.env.DATABASE_POOL_MAX ?? 12),
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 10_000,
        statement_timeout: 15_000,
        query_timeout: 20_000,
        ssl: process.env.DATABASE_SSL === "require" ? { rejectUnauthorized: true } : undefined,
      });
      return pool;
    })();
  }
  return postgresPoolPromise;
}

async function cloudflareDatabase() {
  if (!cloudflareDatabasePromise) {
    cloudflareDatabasePromise = (async () => {
      const moduleName = "cloudflare:workers";
      const workerRuntime = await import(/* @vite-ignore */ moduleName) as { env?: { DB?: CloudflareDatabase } };
      if (!workerRuntime.env?.DB) throw new Error("D1 binding DB is unavailable");
      return workerRuntime.env.DB;
    })();
  }
  return cloudflareDatabasePromise;
}

function quoteCamelCaseAliases(sql: string) {
  return sql.replace(/\bAS\s+([a-z_][a-z0-9_]*[A-Z][a-zA-Z0-9_]*)\b/g, 'AS "$1"');
}

function postgresTriggerSql() {
  return `CREATE OR REPLACE FUNCTION enforce_sim_customer_nonnegative_balance()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF NEW.user_id <> 'SYSTEM' AND NEW.balance_minor < 0 THEN
        RAISE EXCEPTION 'CUSTOMER_BALANCE_CANNOT_BE_NEGATIVE';
      END IF;
      RETURN NEW;
    END $$;
    DROP TRIGGER IF EXISTS sim_accounts_customer_nonnegative_balance ON sim_accounts;
    CREATE TRIGGER sim_accounts_customer_nonnegative_balance
      BEFORE UPDATE OF balance_minor ON sim_accounts
      FOR EACH ROW EXECUTE FUNCTION enforce_sim_customer_nonnegative_balance()`;
}

export function toPostgresSql(input: string) {
  if (input.includes("CREATE TRIGGER IF NOT EXISTS sim_accounts_customer_nonnegative_balance")) {
    return postgresTriggerSql();
  }
  let sql = input.trim().replace(/;+\s*$/, "");
  const ignoreConflict = /^INSERT\s+OR\s+IGNORE\s+/i.test(sql);
  sql = sql
    .replace(/^INSERT\s+OR\s+IGNORE\s+/i, "INSERT ")
    .replace(/^INSERT\s+OR\s+REPLACE\s+/i, "INSERT ")
    .replace(/\s+COLLATE\s+NOCASE\b/gi, "")
    .replace(/\b([a-z_][a-z0-9_]*_minor)\s+INTEGER\b/gi, "$1 BIGINT");
  sql = quoteCamelCaseAliases(sql);
  let parameter = 0;
  sql = sql.replace(/\?/g, () => `$${++parameter}`);
  if (ignoreConflict && !/\bON\s+CONFLICT\b/i.test(sql)) sql += " ON CONFLICT DO NOTHING";
  return sql;
}

async function executePostgres(statement: PreparedStatement, client?: PoolClient) {
  const runner = client ?? await postgresPool();
  return runner.query(toPostgresSql(statement.sql), [...statement.values]);
}

function pgResult<T>(input: QueryResult | QueryResult[]) : DatabaseResult<T> {
  const results = Array.isArray(input) ? input : [input];
  const last = results.at(-1);
  return {
    results: (last?.rows ?? []) as T[],
    meta: { changes: results.reduce((total, result) => total + (result.rowCount ?? 0), 0) },
  };
}

class UniversalPreparedStatement implements PreparedStatement {
  constructor(public readonly sql: string, public readonly values: readonly unknown[] = []) {}

  bind(...values: unknown[]) { return new UniversalPreparedStatement(this.sql, values); }

  async first<T>(): Promise<T | null> {
    if (usesPostgres()) return (await executePostgres(this)).rows[0] as T | undefined ?? null;
    const db = await cloudflareDatabase();
    const statement = db.prepare(this.sql).bind(...this.values) as ReturnType<CloudflareDatabase["prepare"]>;
    return statement.first<T>();
  }

  async all<T>(): Promise<DatabaseResult<T>> {
    if (usesPostgres()) return pgResult<T>(await executePostgres(this));
    const db = await cloudflareDatabase();
    const statement = db.prepare(this.sql).bind(...this.values) as ReturnType<CloudflareDatabase["prepare"]>;
    return statement.all<T>();
  }
}

class UniversalDatabase implements ApplicationDatabase {
  prepare(query: string): PreparedStatement { return new UniversalPreparedStatement(query); }

  async batch(statements: PreparedStatement[]) {
    if (!usesPostgres()) {
      const db = await cloudflareDatabase();
      const prepared = statements.map((statement) => db.prepare(statement.sql).bind(...statement.values));
      return db.batch(prepared) as Promise<DatabaseResult<unknown>[]>;
    }
    const pool = await postgresPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const results: DatabaseResult<unknown>[] = [];
      for (const statement of statements) results.push(pgResult(await executePostgres(statement, client)));
      await client.query("COMMIT");
      return results;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

const applicationDatabase = new UniversalDatabase();

export function database() { return applicationDatabase; }

export async function databaseHealthcheck() {
  if (usesPostgres()) {
    const result = await (await postgresPool()).query<{ healthy: number }>("SELECT 1 AS healthy");
    return result.rows[0]?.healthy === 1;
  }
  const result = await (await cloudflareDatabase()).prepare("SELECT 1 AS healthy").first<{ healthy: number }>();
  return result?.healthy === 1;
}
