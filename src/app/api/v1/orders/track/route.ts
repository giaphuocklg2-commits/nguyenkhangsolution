import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/v1/orders/track?code=NKS-xxx OR ?phone=09xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const phone = searchParams.get("phone");

    if (!code && !phone) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập mã đơn hoặc số điện thoại" },
        { status: 400 }
      );
    }

    if (code) {
      const order = await prisma.order.findUnique({
        where: { orderCode: code.toUpperCase() },
        include: {
          items: { include: { product: true } },
          trackingHistory: { orderBy: { createdAt: "asc" } },
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Không tìm thấy đơn hàng với mã này" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: [order] });
    }

    if (phone) {
      const orders = await prisma.order.findMany({
        where: { phone },
        include: {
          items: { include: { product: true } },
          trackingHistory: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!orders.length) {
        return NextResponse.json(
          {
            success: false,
            error: "Không tìm thấy đơn hàng với số điện thoại này",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: orders });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
