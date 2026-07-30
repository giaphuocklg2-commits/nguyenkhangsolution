import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    // Find coupons that are active and within date range
    // If startDate/endDate is null, it means no limit on that end
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [
          { OR: [{ endDate: null }, { endDate: { gte: now } }] }
        ]
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Failed to fetch active coupons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
