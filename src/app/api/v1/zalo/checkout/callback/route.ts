import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCheckoutMac } from "@/lib/zalo-checkout";

type CallbackData = { appId: string; orderId: string; transId: string; method?: string; amount: number; description: string; resultCode: number; message: string; extradata?: string; [key: string]: string | number | boolean | null | undefined };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = body?.data as CallbackData;
    if (!data || !verifyCheckoutMac(data, body.overallMac)) {
      return NextResponse.json({ returnCode: 0, returnMessage: "Invalid MAC" }, { status: 401 });
    }
    let merchantOrderId: string | undefined;
    if (data.extradata) {
      try { merchantOrderId = JSON.parse(decodeURIComponent(data.extradata)).orderId; } catch { /* use zmpOrderId */ }
    }
    const order = await prisma.order.findFirst({
      where: { OR: [{ zmpOrderId: data.orderId }, ...(merchantOrderId ? [{ id: merchantOrderId }] : [])] },
    });
    if (!order || Math.round(order.totalAmount) !== Number(data.amount)) {
      return NextResponse.json({ returnCode: 0, returnMessage: "Order or amount mismatch" }, { status: 400 });
    }
    if (order.paymentTransId === data.transId) {
      return NextResponse.json({ returnCode: 2, returnMessage: "Duplicate transaction" });
    }
    await prisma.order.update({ where: { id: order.id }, data: {
      zmpOrderId: data.orderId, paymentTransId: data.transId, paymentMethod: data.method,
      paymentStatus: data.resultCode === 1 ? "PAID" : "FAILED", paidAt: data.resultCode === 1 ? new Date() : null,
    }});
    return NextResponse.json({ returnCode: 1, returnMessage: "Success" });
  } catch (error) {
    console.error("Zalo Checkout callback error", error);
    return NextResponse.json({ returnCode: 0, returnMessage: "Internal error" }, { status: 500 });
  }
}
