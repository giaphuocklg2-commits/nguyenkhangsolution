import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/v1/orders/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: (await params).id },
          { orderCode: (await params).id },
          { qrToken: (await params).id },
        ],
      },
      include: {
        items: { include: { product: true } },
        trackingHistory: { orderBy: { createdAt: "asc" } },
        warrantyRequests: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/orders/:id/status — Update status (Admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { status, note, updatedBy } = body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPING",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Trạng thái không hợp lệ" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: (await params).id },
      data: {
        status,
        trackingHistory: {
          create: {
            status,
            note: note ?? `Cập nhật trạng thái: ${status}`,
            updatedBy: updatedBy ?? "Admin",
          },
        },
      },
      include: {
        items: true,
        trackingHistory: { orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/orders/:id — Cancel order
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json().catch(() => ({}));
    const { reason, updatedBy } = body;

    const order = await prisma.order.update({
      where: { id: (await params).id },
      data: {
        status: "CANCELLED",
        trackingHistory: {
          create: {
            status: "CANCELLED",
            note: reason ?? "Đơn hàng đã bị hủy",
            updatedBy: updatedBy ?? "Admin",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: "Đã hủy đơn hàng",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
