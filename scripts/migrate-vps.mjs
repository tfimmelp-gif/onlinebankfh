process.env.NODE_ENV = "production";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for VPS migrations");
}

const { initializeSimulationBank } = await import("../server/d1/sim-bank.ts");
await initializeSimulationBank();
process.stdout.write("Northstar PostgreSQL schema is ready.\n");

