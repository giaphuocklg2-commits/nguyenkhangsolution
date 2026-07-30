"use client";

import { useState, useEffect } from "react";
import { Ticket, Plus, Trash2, Tag, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountPercent: number | null;
  discountAmount: number | null;
  minOrderValue: number | null;
  maxDiscount: number | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercent: "",
    discountAmount: "",
    minOrderValue: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/v1/admin/coupons");
      const data = await res.json();
      if (Array.isArray(data)) setCoupons(data);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({ title: "Tạo mã giảm giá thành công", variant: "success" });
        setShowForm(false);
        setFormData({
          code: "",
          description: "",
          discountPercent: "",
          discountAmount: "",
          minOrderValue: "",
          maxDiscount: "",
          startDate: "",
          endDate: "",
          isActive: true,
        });
        fetchCoupons();
      } else {
        const err = await res.json();
        toast({ title: "Lỗi", description: err.error, variant: "error" });
      }
    } catch {
      toast({ title: "Đã xảy ra lỗi", variant: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;
    try {
      const res = await fetch(`/api/v1/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Xóa thành công", variant: "success" });
        fetchCoupons();
      }
    } catch {
      toast({ title: "Đã xảy ra lỗi", variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-slate-900">
              Quản Lý Mã Giảm Giá
            </h1>
            <p className="text-xs text-slate-500">Tạo và quản lý các chương trình khuyến mãi cho khách hàng</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Đóng Form" : "Thêm Mã Giảm Giá Mới"}
        </button>
      </div>

      {/* Add Coupon Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-heading font-bold text-slate-900 text-base">
              Tạo Mã Khuyến Mãi Mới
            </h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mã (Code) *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm uppercase font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="VD: FREESHIP50K"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả hiển thị</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="VD: Giảm 15% cho đơn hàng pin lithium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phần trăm giảm (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                placeholder="VD: 10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hoặc số tiền giảm (VNĐ)</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.discountAmount}
                onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                placeholder="VD: 50000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giá trị đơn hàng tối thiểu (VNĐ)</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="VD: 500000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giảm tối đa (VNĐ)</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="VD: 200000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày bắt đầu (Tùy chọn)</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày kết thúc (Tùy chọn)</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex justify-end pt-2 border-t border-slate-100">
              <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm">
                Lưu Mã Giảm Giá
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Khuyến Mãi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mức Giảm</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Điều Kiện</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thời Hạn</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                    Chưa có mã giảm giá nào trong hệ thống
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <Ticket className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-bold text-slate-900">{coupon.code}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{coupon.description ?? "Không có mô tả"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200/60">
                        {coupon.discountPercent ? `-${coupon.discountPercent}%` : `-${formatCurrency(coupon.discountAmount || 0)}`}
                      </span>
                      {coupon.maxDiscount && (
                        <span className="block text-[11px] text-slate-400 mt-1">Tối đa {formatCurrency(coupon.maxDiscount)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                      {coupon.minOrderValue ? `Đơn từ ${formatCurrency(coupon.minOrderValue)}` : "Tất cả đơn hàng"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString("vi-VN") : "Bất kỳ"}
                      {" - "}
                      {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString("vi-VN") : "Vô hạn"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                          Đang diễn ra
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          Tạm dừng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Xóa mã giảm giá"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
