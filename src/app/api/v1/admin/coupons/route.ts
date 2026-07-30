import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      code,
      description,
      discountPercent,
      discountAmount,
      minOrderValue,
      maxDiscount,
      startDate,
      endDate,
      isActive,
    } = body;

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: "Mã giảm giá không được để trống" },
        { status: 400 }
      );
    }

    const upperCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({
      where: { code: upperCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Mã giảm giá đã tồn tại trong hệ thống" },
        { status: 400 }
      );
    }

    const parseNum = (val: any) => {
      if (val === null || val === undefined || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    const parseDate = (val: any) => {
      if (!val || val === "") return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    const coupon = await prisma.coupon.create({
      data: {
        code: upperCode,
        description: description ? String(description).trim() : null,
        discountPercent: parseNum(discountPercent),
        discountAmount: parseNum(discountAmount),
        minOrderValue: parseNum(minOrderValue),
        maxDiscount: parseNum(maxDiscount),
        startDate: parseDate(startDate),
        endDate: parseDate(endDate),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return NextResponse.json(
      { error: "Lỗi tạo mã giảm giá: " + (error instanceof Error ? error.message : "Internal server error") },
      { status: 500 }
    );
  }
}
