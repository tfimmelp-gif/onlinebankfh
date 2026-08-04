import { NextResponse } from "next/server";
import { getPublicSimulationWebsite } from "../../../server/d1/sim-bank";

export async function GET() {
  try {
    return NextResponse.json(await getPublicSimulationWebsite(), {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "WEBSITE_SETTINGS_READ_FAILED" }, { status: 500 });
  }
}
