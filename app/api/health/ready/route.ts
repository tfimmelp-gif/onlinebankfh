import { NextResponse } from "next/server";
import { initializeSimulationBank } from "../../../../server/d1/sim-bank";
import { databaseHealthcheck } from "../../../../server/runtime/database";
import { objectStorageHealthcheck } from "../../../../server/runtime/object-storage";

export async function GET() {
  try {
    await initializeSimulationBank();
    const [database, storage] = await Promise.all([databaseHealthcheck(), objectStorageHealthcheck()]);
    if (!database || !storage) throw new Error("DEPENDENCY_UNAVAILABLE");
    return NextResponse.json({ status: "ready", database: "ok", objectStorage: "ok" }, {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json({ status: "not-ready" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}

