"use client";

import { useState, useEffect } from "react";
import { Key, Plus, Trash2, Copy, RefreshCw, X, Shield, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

export default function AdminApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newKeyData, setNewKeyData] = useState<any>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", staffId: "", permissions: "read" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchKeys() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/apikeys");
      const data = await res.json();
      if (data.success) setApiKeys(data.data);
    } catch {
      toast({ title: "Lỗi tải danh sách API Keys", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function fetchStaff() {
    try {
      const res = await fetch("/api/v1/staff");
      const data = await res.json();
      if (data.success) {
        setStaffList(data.data);
        if (data.data.length > 0) {
          setForm(f => ({ ...f, staffId: data.data[0].id }));
        }
      }
    } catch {}
  }

  useEffect(() => {
    fetchKeys();
    fetchStaff();
  }, []);

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.staffId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          staffId: form.staffId,
          permissions: [form.permissions],
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Tạo API Key thành công", variant: "success" });
        setNewKeyData(data.data);
        setShowAdd(false);
        setForm({ name: "", staffId: staffList[0]?.id || "", permissions: "read" });
        fetchKeys();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Bạn có chắc chắn muốn thu hồi API Key này? Các ứng dụng dùng key này sẽ bị ngắt kết nối.")) return;
    try {
      const res = await fetch(`/api/v1/apikeys?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Đã thu hồi API Key", variant: "success" });
        fetchKeys();
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
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-slate-900">
              Quản Lý API Keys
            </h1>
            <p className="text-xs text-slate-500">Tạo và phân quyền khóa API kết nối Mobile App / POS / Hệ thống ngoài</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchKeys}
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
            Tạo API Key Mới
          </button>
        </div>
      </div>

      {/* Newly Created Key Alert Banner */}
      {newKeyData && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 shadow-sm space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-amber-600" /> API KEY VỪA TẠO (LƯU LẠI NGAY)
            </span>
            <button onClick={() => setNewKeyData(null)} className="text-amber-600 hover:text-amber-800">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-amber-700">Khóa API đầy đủ này chỉ xuất hiện 1 lần duy nhất để bảo mật:</p>
          <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl text-amber-300 font-mono text-xs break-all select-all">
            <span className="flex-1">{newKeyData.key}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newKeyData.key);
                toast({ title: "Đã sao chép API Key", variant: "success" });
              }}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold transition-colors flex-shrink-0"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-heading font-bold text-slate-900 text-base">
              Tạo Khóa API Key Mới
            </h2>
            <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreateKey} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên gợi nhớ API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                placeholder="VD: App Mobile Android / POS Kho"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gán cho Nhân viên phụ trách <span className="text-red-500">*</span>
              </label>
              <select
                value={form.staffId}
                onChange={(e) => setForm({ ...form, staffId: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quyền truy cập
              </label>
              <select
                value={form.permissions}
                onChange={(e) => setForm({ ...form, permissions: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                <option value="read">Chỉ đọc (Read Only)</option>
                <option value="write">Đọc & Ghi (Read/Write)</option>
                <option value="admin">Quản trị toàn phần (Full Admin)</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Hủy bỏ
              </button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">
                {submitting ? "Đang tạo..." : "Tạo Khóa API"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* API Keys Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên Khóa API</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Khóa (Masked)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nhân Viên Phụ Trách</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày Tạo</th>
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
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                    Chưa có API Key nào hoạt động
                  </td>
                </tr>
              ) : (
                apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                          <Key className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{k.name}</p>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            Hoạt động
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="font-mono text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        {k.key}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                      {k.staff?.name ?? "Hệ thống"} ({k.staff?.email ?? "N/A"})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(k.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleRevoke(k.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Thu hồi API Key"
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
