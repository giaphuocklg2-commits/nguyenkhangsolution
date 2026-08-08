import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCheckoutMac } from "@/lib/zalo-checkout";

type NotifyData = {
  appId: string;
  orderId: string;
  method: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = body?.data as NotifyData;
    if (!data?.appId || !data?.orderId || !data?.method || !verifyCheckoutMac(data, body.mac)) {
      return NextResponse.json({ returnCode: 0, returnMessage: "Invalid MAC" }, { status: 401 });
    }

    if (data.method !== "COD" && data.method !== "BANK") {
      return NextResponse.json({ returnCode: 0, returnMessage: "Unsupported payment method" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { zmpOrderId: data.orderId } });
    if (!order) {
      return NextResponse.json({ returnCode: 0, returnMessage: "Order not found" }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: data.method,
        paymentStatus: data.method === "COD" ? "COD_PENDING" : "BANK_PENDING",
      },
    });

    return NextResponse.json({ returnCode: 1, returnMessage: "Success" });
  } catch (error) {
    console.error("Zalo Checkout notify error", error);
    return NextResponse.json({ returnCode: 0, returnMessage: "Internal error" }, { status: 500 });
  }
}
