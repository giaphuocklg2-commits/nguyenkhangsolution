"use client";

import { useState, useEffect } from "react";
import { Search, Eye, RefreshCw, ShoppingCart } from "lucide-react";
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import Link from "next/link";

const ORDER_STATUSES = [
  { value: "", label: "Tất cả đơn hàng" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PROCESSING", label: "Đang đóng gói" },
  { value: "SHIPPING", label: "Đang vận chuyển" },
  { value: "DELIVERED", label: "Giao thành công" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/v1/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch {
      toast({ title: "Lỗi tải dữ liệu", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  async function updateStatus(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/v1/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, updatedBy: "Admin" }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Cập nhật trạng thái đơn thành công", variant: "success" });
        fetchOrders();
      }
    } catch {
      toast({ title: "Lỗi cập nhật", variant: "error" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-slate-900">
                Quản Lý Đơn Hàng
              </h1>
              <p className="text-xs text-slate-500">
                {orders.length} đơn hàng trong danh sách
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
          title="Làm mới"
          id="refresh-orders-btn"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
        </button>
      </div>

      {/* Filters & Status Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
              placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              id="admin-order-search"
            />
          </div>
        </div>

        {/* Status Pills Filter */}
        <div className="flex gap-2 flex-wrap pt-2 border-t border-slate-100">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                statusFilter === s.value
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-slate-100 border border-slate-200/60 text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mã Đơn
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Khách Hàng
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Sản Phẩm
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Tổng Tiền
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Trạng Thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ngày Đặt
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                        {order.orderCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                        {order.items?.length ?? 0} sản phẩm
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border-0 cursor-pointer focus:outline-none shadow-sm ${getOrderStatusColor(order.status)}`}
                      >
                        {ORDER_STATUSES.filter(s => s.value).map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/order/${order.qrToken}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors inline-flex"
                        title="Xem chi tiết đơn"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
