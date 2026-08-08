import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, context: RouteContext<"/api/v1/orders/[id]/payment">) {
  try {
    const { id } = await context.params;
    const { zmpOrderId } = await req.json();
    if (!zmpOrderId || typeof zmpOrderId !== "string") {
      return NextResponse.json({ success: false, error: "Thiếu mã giao dịch Checkout SDK" }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id },
      data: { zmpOrderId, paymentStatus: "PENDING" },
      select: { id: true, orderCode: true, paymentStatus: true },
    });
    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json({ success: false, error: "Không thể cập nhật giao dịch" }, { status: 404 });
  }
}
