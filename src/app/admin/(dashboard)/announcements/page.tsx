"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, Power, RefreshCw, X, ShieldAlert, Bell } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

const ANNOUNCEMENT_TYPES = [
  { value: "USER_POPUP", label: "Popup Khách Hàng (Trang Chủ)", icon: Megaphone, color: "bg-blue-50 text-blue-700 border-blue-200/60" },
  { value: "STAFF_POPUP", label: "Popup Nhân Viên (Admin Panel)", icon: ShieldAlert, color: "bg-amber-50 text-amber-700 border-amber-200/60" },
  { value: "COMPANY_BELL", label: "Thông Báo Quả Chuông (Toàn Công Ty)", icon: Bell, color: "bg-purple-50 text-purple-700 border-purple-200/60" },
];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({ title: "", content: "", type: "USER_POPUP" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchAnnouncements() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/announcements");
      const data = await res.json();
      if (data.success) setAnnouncements(data.data);
    } catch {
      toast({ title: "Lỗi tải dữ liệu", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAnnouncements(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Phát hành thông báo thành công", variant: "success" });
        setShowAdd(false);
        setForm({ title: "", content: "", type: "USER_POPUP" });
        fetchAnnouncements();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(item: any) {
    try {
      const res = await fetch(`/api/v1/announcements/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: item.isActive ? "Đã tắt thông báo" : "Đã bật thông báo", variant: "success" });
        fetchAnnouncements();
      }
    } catch {
      toast({ title: "Lỗi cập nhật", variant: "error" });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    try {
      const res = await fetch(`/api/v1/announcements/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Xóa thông báo thành công", variant: "success" });
        fetchAnnouncements();
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-slate-900">
              Quản Lý Thông Báo Hệ Thống
            </h1>
            <p className="text-xs text-slate-500">
              Phát hành Popup thông báo cho Khách Hàng, Nhân Viên hoặc Toàn Công Ty (Quả Chuông)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnnouncements}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Tạo Thông Báo Mới
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-heading font-bold text-slate-900 text-base">
              Tạo Thông Báo Hệ Thống Mới
            </h2>
            <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loại Thông Báo <span className="text-red-500">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
              >
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiêu Đề Thông Báo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
                placeholder="VD: Chương trình khuyến mãi Pin NLMT tháng 8"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nội Dung Chi Tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 resize-none leading-relaxed"
                placeholder="Nhập nội dung thông báo hiển thị cho người dùng hoặc nhân viên..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Hủy bỏ
              </button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">
                {submitting ? "Đang tạo..." : "Xác nhận phát hành"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tiêu Đề & Nội Dung</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loại Thông Báo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người Tạo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                    Chưa có thông báo nào được tạo
                  </td>
                </tr>
              ) : (
                announcements.map((item) => {
                  const typeInfo = ANNOUNCEMENT_TYPES.find(t => t.value === item.type);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-md space-y-0.5">
                          <p className="text-sm font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.content}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${typeInfo?.color ?? "bg-slate-100 text-slate-700"}`}>
                          {typeInfo?.label ?? item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                        {item.createdBy ?? "Hệ thống"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.isActive ? (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                            Đang hiển thị
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            Tạm ẩn
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`p-2 rounded-xl transition-colors ${
                              item.isActive ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={item.isActive ? "Ẩn thông báo" : "Hiện thông báo"}
                          >
                            <Power className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Xóa thông báo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
