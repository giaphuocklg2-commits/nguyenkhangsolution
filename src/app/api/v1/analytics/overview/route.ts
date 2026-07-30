import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/v1/analytics/overview
export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalOrders,
      totalRevenue,
      ordersThisMonth,
      revenueThisMonth,
      ordersLastMonth,
      revenueLastMonth,
      totalProducts,
      totalWarranty,
      pendingOrders,
      recentOrders,
      ordersByStatus,
      monthlyRevenue,
      totalPageViews,
    ] = await Promise.all([
      prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          status: { not: "CANCELLED" },
        },
        _sum: { totalAmount: true },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.warrantyRequest.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
      // Monthly revenue for last 6 months
      prisma.$queryRaw`
        SELECT 
          strftime('%Y-%m', createdAt) as month,
          SUM(totalAmount) as revenue,
          COUNT(*) as orders
        FROM "Order"
        WHERE status != 'CANCELLED'
          AND createdAt >= date('now', '-6 months')
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY month ASC
      `,
      prisma.pageView.count(),
    ]);

    const ordersGrowth =
      ordersLastMonth > 0
        ? (((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(1)
        : "0";
    const revenueGrowth =
      (revenueLastMonth._sum.totalAmount ?? 0) > 0
        ? ((((revenueThisMonth._sum.totalAmount ?? 0) -
              (revenueLastMonth._sum.totalAmount ?? 0)) /
              (revenueLastMonth._sum.totalAmount ?? 1)) *
            100).toFixed(1)
        : "0";

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalRevenue: totalRevenue._sum.totalAmount ?? 0,
          totalProducts,
          pendingWarranty: totalWarranty,
          pendingOrders,
          totalPageViews,
        },
        thisMonth: {
          orders: ordersThisMonth,
          revenue: revenueThisMonth._sum.totalAmount ?? 0,
          ordersGrowth: parseFloat(ordersGrowth),
          revenueGrowth: parseFloat(revenueGrowth),
        },
        recentOrders,
        ordersByStatus,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
