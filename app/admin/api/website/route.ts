import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSessionToken } from "../../../../server/auth/admin-session";
import { validateMutationRequest } from "../../../../server/security/request";
import {
  getSimulationWebsiteAdminState,
  getSimulationAdminSettings,
  saveSimulationWebsiteRevision,
  type SimWebsiteContent,
} from "../../../../server/d1/sim-bank";

function adminToken(request: Request) {
  const rawCookie = request.headers.get("cookie") ?? "";
  return rawCookie.split(";").map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
}

async function authorized(request: Request) {
  return verifyAdminSessionToken(adminToken(request));
}

export async function GET(request: Request) {
  if (!await authorized(request)) {
    return NextResponse.json({ error: "STAFF_AUTH_REQUIRED" }, { status: 401 });
  }
  try {
    return NextResponse.json(await getSimulationWebsiteAdminState(), {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "WEBSITE_SETTINGS_READ_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  if (!await authorized(request)) {
    return NextResponse.json({ error: "STAFF_AUTH_REQUIRED" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({})) as {
    content?: SimWebsiteContent;
    publicationStatus?: "PUBLISHED" | "DRAFT" | "SCHEDULED";
    scheduledFor?: string | null;
    changeReason?: string;
  };
  if (!body.content || !["PUBLISHED", "DRAFT", "SCHEDULED"].includes(body.publicationStatus ?? "")) {
    return NextResponse.json({ error: "WEBSITE_SETTINGS_PAYLOAD_INVALID" }, { status: 400 });
  }
  try {
    return NextResponse.json(await saveSimulationWebsiteRevision({
      content: body.content,
      publicationStatus: body.publicationStatus!,
      scheduledFor: body.scheduledFor,
      changeReason: body.changeReason ?? "",
      createdBy: (await getSimulationAdminSettings()).identity.displayName,
    }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "WEBSITE_SETTINGS_SAVE_FAILED" }, { status: 422 });
  }
}
