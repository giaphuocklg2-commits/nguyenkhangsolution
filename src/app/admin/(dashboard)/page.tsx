import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import {
  ShoppingCart, Package, Shield, TrendingUp,
  DollarSign, Users, ArrowUpRight, ChevronRight
} from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const [
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    pendingWarranty,
    recentOrders,
    totalStaff,
  ] = await Promise.all([
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { totalAmount: true },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.warrantyRequest.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.staff.count({ where: { isActive: true } }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.totalAmount ?? 0,
    totalProducts,
    pendingWarranty,
    recentOrders,
    totalStaff,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    {
      label: "Tổng Đơn Hàng",
      value: data.totalOrders.toLocaleString("vi-VN"),
      subtext: `${data.pendingOrders} đơn cần xử lý`,
      trend: "+12.5%",
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/orders",
    },
    {
      label: "Tổng Doanh Thu",
      value: formatCurrency(data.totalRevenue),
      subtext: "Tích lũy toàn thời gian",
      trend: "+18.2%",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/admin/analytics",
    },
    {
      label: "Sản Phẩm Đang Bán",
      value: data.totalProducts.toLocaleString("vi-VN"),
      subtext: "Hoạt động trên hệ thống",
      trend: "+4 SP mới",
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/admin/products",
    },
    {
      label: "Bảo Hành Chờ Xử Lý",
      value: data.pendingWarranty.toLocaleString("vi-VN"),
      subtext: "Yêu cầu từ khách hàng",
      trend: "Cần duyệt",
      icon: Shield,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/warranty",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Enterprise ERP Dashboard</span>
          <h2 className="text-2xl font-bold font-heading mt-1">Xin chào, Quản Trị Viên!</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Tổng quan tình hình kinh doanh, đơn hàng và các hoạt động bảo hành của NKS Electric hôm nay.
          </p>
        </div>
        <Link
          href="/admin/staff"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Users className="h-4 w-4" />
          Quản Lý Nhân Sự ({data.totalStaff})
        </Link>
      </div>

      {/* Stats Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              </div>
              <div className="font-heading text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-700">{stat.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{stat.subtext}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Đơn Hàng Mới Nhất
              </h3>
              <p className="text-xs text-slate-500">Các đơn hàng phát sinh gần đây</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {data.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm font-medium">Chưa có đơn hàng nào</div>
            ) : (
              data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      #
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">
                        {order.orderCode}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {order.customerName} · {order.phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Thao Tác Nhanh
            </h3>
            <div className="space-y-2">
              {[
                { label: "Thêm sản phẩm mới", href: "/admin/products/new", color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60" },
                { label: "Xem đơn chờ xử lý", href: "/admin/orders?status=PENDING", color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60" },
                { label: "Yêu cầu bảo hành", href: "/admin/warranty?status=PENDING", color: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60" },
                { label: "Quản lý nhân viên", href: "/admin/staff", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-xs font-bold transition-all ${action.color}`}
                >
                  <span>{action.label}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-70" />
                </Link>
              ))}
            </div>
          </div>

          {/* API Keys Banner */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-sm border border-slate-800">
            <p className="font-bold text-sm mb-1 text-amber-400">📊 Tích hợp API Keys</p>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Tạo và quản lý các khóa API để kết nối ứng dụng Mobile hoặc POS bán hàng.
            </p>
            <Link
              href="/admin/apikeys"
              className="inline-block px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold transition-colors"
              id="api-docs-link"
            >
              Quản lý API Keys
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
