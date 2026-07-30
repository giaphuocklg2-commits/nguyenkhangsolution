import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
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

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        description: description !== undefined ? (description ? String(description).trim() : null) : undefined,
        discountPercent: discountPercent !== undefined ? parseNum(discountPercent) : undefined,
        discountAmount: discountAmount !== undefined ? parseNum(discountAmount) : undefined,
        minOrderValue: minOrderValue !== undefined ? parseNum(minOrderValue) : undefined,
        maxDiscount: maxDiscount !== undefined ? parseNum(maxDiscount) : undefined,
        startDate: startDate !== undefined ? parseDate(startDate) : undefined,
        endDate: endDate !== undefined ? parseDate(endDate) : undefined,
        isActive: typeof isActive === "boolean" ? isActive : undefined,
      },
    });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.coupon.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
