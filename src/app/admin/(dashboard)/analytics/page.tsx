"use client";

import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, Eye, BarChart3 } from "lucide-react";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/analytics/overview")
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return <div className="text-slate-500 font-medium">Không thể tải dữ liệu thống kê</div>;

  const months = (data.monthlyRevenue as any[])?.map((m: any) => m.month) ?? [];
  const revenues = (data.monthlyRevenue as any[])?.map((m: any) => Number(m.revenue)) ?? [];

  const statusLabels = (data.ordersByStatus as any[])?.map((s: any) => {
    const map: Record<string, string> = {
      PENDING: "Chờ xác nhận", CONFIRMED: "Đã xác nhận", PROCESSING: "Đang đóng gói",
      SHIPPING: "Đang giao", DELIVERED: "Đã giao", CANCELLED: "Đã hủy",
    };
    return map[s.status] ?? s.status;
  }) ?? [];
  const statusCounts = (data.ordersByStatus as any[])?.map((s: any) => s._count) ?? [];

  const statCards = [
    {
      label: "Tổng Đơn Hàng",
      value: data.overview.totalOrders.toLocaleString("vi-VN"),
      subtext: `Tháng này: ${data.thisMonth.orders}`,
      growth: data.thisMonth.ordersGrowth,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Tổng Doanh Thu",
      value: formatCurrency(data.overview.totalRevenue),
      subtext: `Tháng này: ${formatCurrency(data.thisMonth.revenue)}`,
      growth: data.thisMonth.revenueGrowth,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Sản Phẩm Đang Bán",
      value: data.overview.totalProducts.toLocaleString(),
      subtext: "Hoạt động hệ thống",
      growth: null,
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Lượt Truy Cập Trang",
      value: data.overview.totalPageViews.toLocaleString("vi-VN"),
      subtext: "Tất cả thời gian",
      growth: null,
      icon: Eye,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-slate-900">
              Analytics & Thống Kê
            </h1>
            <p className="text-xs text-slate-500">Phân tích hiệu suất doanh thu, lưu lượng và đơn hàng</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.growth !== null && (
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stat.growth >= 0
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                      : "bg-red-50 text-red-700 border-red-200/60"
                  }`}>
                    {stat.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(stat.growth)}%
                  </div>
                )}
              </div>
              <div>
                <div className="font-heading text-xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{stat.label}</div>
                <div className="text-[11px] text-slate-500">{stat.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="font-heading font-bold text-slate-900 text-base mb-4">
            Doanh Thu Các Tháng Gần Nhất
          </h3>
          {months.length > 0 ? (
            <Bar
              data={{
                labels: months,
                datasets: [{
                  label: "Doanh thu (VND)",
                  data: revenues,
                  backgroundColor: "rgba(37, 99, 235, 0.85)",
                  borderRadius: 8,
                  borderSkipped: false,
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => formatCurrency(ctx.raw as number),
                    },
                  },
                },
                scales: {
                  y: { grid: { color: "rgba(0,0,0,0.04)" } },
                  x: { grid: { display: false } },
                },
              }}
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Chưa có dữ liệu doanh thu
            </div>
          )}
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="font-heading font-bold text-slate-900 text-base mb-4">
            Tỉ Lệ Trạng Thái Đơn Hàng
          </h3>
          {statusLabels.length > 0 ? (
            <Doughnut
              data={{
                labels: statusLabels,
                datasets: [{
                  data: statusCounts,
                  backgroundColor: [
                    "#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#ef4444"
                  ],
                  borderWidth: 0,
                }],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Chưa có dữ liệu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
