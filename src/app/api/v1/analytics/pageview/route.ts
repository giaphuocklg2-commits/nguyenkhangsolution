import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/v1/analytics/pageview — Track page view
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer } = body;
    const userAgent = req.headers.get("user-agent") ?? "";

    await prisma.pageView.create({
      data: { path, referrer, userAgent },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
