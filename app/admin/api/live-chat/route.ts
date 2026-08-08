import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSessionToken } from "../../../../server/auth/admin-session";
import { validateMutationRequest } from "../../../../server/security/request";
import { getSimulationLiveChat, listSimulationLiveChatCustomers, postSimulationLiveChatMessage } from "../../../../server/d1/sim-bank";

function cookieValue(request: Request) {
  const rawCookie = request.headers.get("cookie") ?? "";
  return rawCookie.split(";").map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
}

async function authorized(request: Request) {
  return verifyAdminSessionToken(cookieValue(request));
}

export async function GET(request: Request) {
  if (!await authorized(request)) return NextResponse.json({ error: "STAFF_AUTH_REQUIRED" }, { status: 401 });
  try {
    const userId=new URL(request.url).searchParams.get("userId")?.trim();
    const result=userId?await getSimulationLiveChat(userId):{customers:await listSimulationLiveChatCustomers()};
    return NextResponse.json(result, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "LIVE_CHAT_READ_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard=validateMutationRequest(request);
  if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  if (!await authorized(request)) return NextResponse.json({ error: "STAFF_AUTH_REQUIRED" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { userId?: string; body?: string };
  if(!body.userId?.trim())return NextResponse.json({error:"CUSTOMER_REQUIRED"},{status:400});
  try {
    return NextResponse.json(await postSimulationLiveChatMessage({
      userId: body.userId.trim(),
      senderKind: "STAFF",
      senderName: "Sarah Okafor",
      body: body.body ?? "",
    }), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "LIVE_CHAT_SEND_FAILED" }, { status: 422 });
  }
}
