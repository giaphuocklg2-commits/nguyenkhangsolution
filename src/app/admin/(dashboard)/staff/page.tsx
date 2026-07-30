"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Power, RefreshCw, X, KeyRound, ShieldCheck, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin", color: "bg-red-50 text-red-700 border border-red-200/60" },
  { value: "GENERAL_DIRECTOR", label: "Tổng Giám Đốc", color: "bg-purple-50 text-purple-700 border border-purple-200/60" },
  { value: "DIRECTOR", label: "Giám Đốc", color: "bg-purple-50 text-purple-700 border border-purple-200/60" },
  { value: "WAREHOUSE", label: "Quản Lý Kho", color: "bg-amber-50 text-amber-700 border border-amber-200/60" },
  { value: "ACCOUNTANT", label: "Kế Toán", color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
  { value: "CSKH", label: "CSKH", color: "bg-cyan-50 text-cyan-700 border border-cyan-200/60" },
  { value: "SELLER", label: "Nhân Viên Sales", color: "bg-blue-50 text-blue-700 border border-blue-200/60" },
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const { toast } = useToast();

  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "SELLER" });
  const [editForm, setEditForm] = useState({ name: "", role: "SELLER", isActive: true, newPassword: "" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchStaff() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/staff");
      const data = await res.json();
      if (data.success) setStaff(data.data);
    } catch {
      toast({ title: "Lỗi tải dữ liệu", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStaff(); }, []);

  async function handleAddStaff(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Thêm nhân sự thành công", variant: "success" });
        setShowAdd(false);
        setAddForm({ name: "", email: "", password: "", role: "SELLER" });
        fetchStaff();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStaff) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/staff/${editingStaff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          role: editForm.role,
          isActive: editForm.isActive,
          password: editForm.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Cập nhật nhân sự thành công", variant: "success" });
        setEditingStaff(null);
        fetchStaff();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(s: any) {
    try {
      const res = await fetch(`/api/v1/staff/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: s.isActive ? "Đã vô hiệu hóa tài khoản" : "Đã kích hoạt tài khoản",
          variant: "success",
        });
        fetchStaff();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    }
  }

  async function handleDeleteStaff(id: string, name: string) {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản nhân sự "${name}"?`)) return;
    try {
      const res = await fetch(`/api/v1/staff/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Xóa tài khoản thành công", variant: "success" });
        fetchStaff();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-slate-900">
                Quản Lý Nhân Sự
              </h1>
              <p className="text-xs text-slate-500">Quản lý danh sách nhân viên, phân quyền và cấp tài khoản</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStaff}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Thêm Nhân Sự Mới
          </button>
        </div>
      </div>

      {/* Add Staff Form Card */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-heading font-bold text-slate-900 text-base">
              Thêm Nhân Sự Mới Vào Hệ Thống
            </h2>
            <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="seller@nks-electric.vn"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chức vụ / Phân quyền
              </label>
              <select
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Hủy bỏ
              </button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">
                {submitting ? "Đang tạo..." : "Xác nhận thêm"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Edit className="h-4 w-4" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Chỉnh Sửa Nhân Sự
                </h3>
              </div>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chức vụ / Phân quyền
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trạng thái tài khoản
                </label>
                <div className="flex gap-4 p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={editForm.isActive === true}
                      onChange={() => setEditForm({ ...editForm, isActive: true })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-emerald-700">Đang hoạt động</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={editForm.isActive === false}
                      onChange={() => setEditForm({ ...editForm, isActive: false })}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-600">Vô hiệu hóa</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đổi mật khẩu mới <span className="text-slate-400 font-normal">(để trống nếu giữ nguyên)</span>
                </label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="Nhập mật khẩu mới nếu cần đổi"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enterprise Staff Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nhân Viên
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Chức Vụ / Phân Quyền
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ngày Khởi Tạo
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    Chưa có nhân viên nào trong danh sách
                  </td>
                </tr>
              ) : (
                staff.map((s) => {
                  const roleInfo = ROLES.find(r => r.value === s.role);
                  const firstChar = s.name?.[0]?.toUpperCase() ?? "N";

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm flex-shrink-0">
                            {firstChar}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{s.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{s.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${roleInfo?.color ?? "bg-slate-100 text-slate-700"}`}>
                          {roleInfo?.label ?? s.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.isActive ? (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            <span className="inline-block h-2 w-2 rounded-full bg-slate-400 mr-1.5" />
                            Vô hiệu hóa
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {formatDate(s.createdAt)}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setEditingStaff(s);
                              setEditForm({
                                name: s.name,
                                role: s.role,
                                isActive: s.isActive,
                                newPassword: "",
                              });
                            }}
                            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Chỉnh sửa tài khoản"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Toggle Active Button */}
                          <button
                            onClick={() => handleToggleStatus(s)}
                            className={`p-2 rounded-xl transition-colors ${
                              s.isActive
                                ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                                : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={s.isActive ? "Vô hiệu hóa tài khoản" : "Kích hoạt lại tài khoản"}
                          >
                            <Power className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteStaff(s.id, s.name)}
                            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa tài khoản"
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
