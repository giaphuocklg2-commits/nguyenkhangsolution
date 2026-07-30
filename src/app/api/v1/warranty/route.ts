import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSystemNotification } from "@/lib/announcement-helper";

// GET /api/v1/warranty
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderCode: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [warranties, total] = await Promise.all([
      prisma.warrantyRequest.findMany({
        where,
        include: { order: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.warrantyRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: warranties.map((w) => ({
        ...w,
        images: (() => { try { return JSON.parse(w.images); } catch { return []; } })(),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/warranty — Public submit warranty request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderCode, phone, reason, description, images } = body;

    if (!phone || !reason) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập số điện thoại và lý do bảo hành" },
        { status: 400 }
      );
    }

    // Find order if code provided
    let orderId: string | undefined;
    if (orderCode) {
      const order = await prisma.order.findUnique({
        where: { orderCode: orderCode.toUpperCase() },
      });
      if (order) orderId = order.id;
    }

    const warranty = await prisma.warrantyRequest.create({
      data: {
        orderCode: orderCode?.toUpperCase(),
        orderId,
        phone,
        reason,
        description,
        images: JSON.stringify(images ?? []),
        status: "PENDING",
      },
    });

    // Auto-create STAFF_POPUP notification for all Admin & Staff members
    await createSystemNotification({
      title: `🚨 YÊU CẦU BẢO HÀNH MỚI #${orderCode?.toUpperCase() || warranty.id.slice(-6).toUpperCase()}`,
      content: `Khách hàng (SĐT: ${phone}) vừa gửi một yêu cầu bảo hành mới ${orderCode ? `cho đơn hàng #${orderCode.toUpperCase()}` : ""}.\n• Lý do: ${reason}\n• Nội dung chi tiết: ${description || "Không có ghi chú thêm"}. Vui lòng vào mục Quản Lý Bảo Hành để xử lý.`,
      type: "STAFF_POPUP",
      createdBy: "Hệ thống (Yêu cầu Bảo hành)",
    });

    return NextResponse.json(
      {
        success: true,
        data: warranty,
        message: "Yêu cầu bảo hành đã được gửi. Chúng tôi sẽ liên hệ bạn sớm nhất.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Warranty Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
