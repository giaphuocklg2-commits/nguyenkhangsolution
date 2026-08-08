import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderCode, formatCurrency } from "@/lib/utils";
import { createSystemNotification } from "@/lib/announcement-helper";
import { addVat } from "@/lib/pricing";
import { createCheckoutMac } from "@/lib/zalo-checkout";

// POST /api/v1/orders
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, email, address, notes, items, couponCode } = body;

    if (!customerName || !phone || !address || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Validate products exist and get prices
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: "Một số sản phẩm không tồn tại" },
        { status: 400 }
      );
    }

    const orderCode = generateOrderCode();
    let totalAmount = 0;

    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId)!;
      const basePrice =
        product.salePrice &&
        (!product.saleEndDate || new Date(product.saleEndDate) > new Date())
          ? product.salePrice
          : product.price;
      const price = addVat(basePrice);
      totalAmount += price * item.quantity;
      return {
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        price,
      };
    });

    if (couponCode) {
      const now = new Date();
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: String(couponCode).trim().toUpperCase(),
          isActive: true,
          OR: [{ startDate: null }, { startDate: { lte: now } }],
          AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
        },
      });

      if (!coupon) {
        return NextResponse.json(
          { success: false, error: "Mã giảm giá không hợp lệ hoặc đã hết hạn" },
          { status: 400 }
        );
      }

      if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
        return NextResponse.json(
          {
            success: false,
            error: `Đơn hàng tối thiểu ${formatCurrency(coupon.minOrderValue)} để dùng mã này`,
          },
          { status: 400 }
        );
      }

      let discount = coupon.discountPercent
        ? (totalAmount * coupon.discountPercent) / 100
        : coupon.discountAmount || 0;

      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }

      totalAmount = Math.max(0, Math.round(totalAmount - discount));
    }

    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName,
        phone,
        email,
        address,
        notes,
        totalAmount,
        status: "PENDING",
        items: { create: orderItems },
        trackingHistory: {
          create: [
            {
              status: "PENDING",
              note: "Đơn hàng được tạo thành công. Seller sẽ liên hệ xác nhận.",
              updatedBy: "Hệ thống",
            },
          ],
        },
      },
      include: {
        items: { include: { product: true } },
        trackingHistory: true,
      },
    });

    // The server is the source of truth for prices and signs the exact payload
    // passed to Checkout SDK. The private key never reaches the Mini App.
    const checkoutParams = {
      amount: Math.round(order.totalAmount),
      desc: `Thanh toan don hang ${order.orderCode}`,
      item: order.items.map((item) => ({
        id: item.productId,
        name: item.name,
        amount: Math.round(item.price * item.quantity),
        quantity: item.quantity,
      })),
      extradata: JSON.stringify({ orderId: order.id, orderCode: order.orderCode }),
    };

    // Auto-create COMPANY_BELL notification for Admin
    await createSystemNotification({
      title: `Đơn Hàng Mới #${order.orderCode}`,
      content: `Khách hàng ${customerName} (SĐT: ${phone}) vừa đặt hàng thành công với tổng giá trị ${formatCurrency(totalAmount)}. Địa chỉ: ${address}`,
      type: "COMPANY_BELL",
      createdBy: "Hệ thống (Đặt hàng tự động)",
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: order.id,
          orderCode: order.orderCode,
          qrToken: order.qrToken,
          totalAmount: order.totalAmount,
          status: order.status,
          trackingUrl: `/order/${order.qrToken}`,
          checkout: {
            ...checkoutParams,
            mac: createCheckoutMac(checkoutParams),
          },
          message:
            "Đặt hàng thành công! Seller sẽ liên hệ bạn để xác nhận đơn.",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/v1/orders — Admin list
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderCode: { contains: search } },
        { customerName: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true } },
          trackingHistory: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
