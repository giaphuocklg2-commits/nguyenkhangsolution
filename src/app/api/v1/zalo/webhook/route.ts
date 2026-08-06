import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Health check and challenge response used while registering the webhook URL.
 * Supports both `challenge` and the common `hub.challenge` query parameter.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge =
    searchParams.get("challenge") ?? searchParams.get("hub.challenge");

  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.json({
    success: true,
    service: "NKS Electric Zalo webhook",
    status: "ready",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Temporary Zalo event receiver.
 * It acknowledges events immediately so Zalo does not retry them. Business
 * processing can be added later once the exact OA/ZNS event types are known.
 */
export async function POST(request: NextRequest) {
  let event: unknown;

  try {
    event = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  // Log only the event type and timestamp. Do not log phone numbers, message
  // contents, access tokens, or the complete user payload.
  const payload = event as Record<string, unknown>;
  console.info("[Zalo webhook] Event received", {
    eventName: payload.event_name ?? payload.event ?? "unknown",
    timestamp: payload.timestamp ?? Date.now(),
  });

  return NextResponse.json(
    { success: true, error: 0, message: "received" },
    { status: 200 },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
