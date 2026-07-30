"use client";

import { useState, useEffect } from "react";
import { Shield, RefreshCw, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { formatDate, getWarrantyStatusLabel } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

export default function AdminWarrantyPage() {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();

  async function fetchWarranties() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/v1/warranty?${params.toString()}`);
      const data = await res.json();
      if (data.success) setWarranties(data.data);
    } catch {
      toast({ title: "Lỗi tải dữ liệu", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchWarranties(); }, [statusFilter]);

  async function updateStatus(id: string, status: string, response?: string) {
    try {
      const res = await fetch(`/api/v1/warranty/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, response }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Cập nhật yêu cầu bảo hành thành công", variant: "success" });
        fetchWarranties();
      }
    } catch {
      toast({ title: "Lỗi cập nhật", variant: "error" });
    }
  }

  const WARRANTY_STATUSES = [
    { value: "", label: "Tất cả yêu cầu" },
    { value: "PENDING", label: "Chờ xử lý" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "RESOLVED", label: "Đã giải quyết" },
    { value: "REJECTED", label: "Từ chối" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-slate-900">
                Quản Lý Bảo Hành & Khiếu Nại
              </h1>
              <p className="text-xs text-slate-500">
                {warranties.length} phiếu yêu cầu bảo hành
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchWarranties}
          className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
          title="Làm mới"
          id="refresh-warranty-btn"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {WARRANTY_STATUSES.map((s) => (
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

      {/* Warranty List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/4 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))
        ) : warranties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
            <Shield className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Không có yêu cầu bảo hành nào phù hợp</p>
          </div>
        ) : (
          warranties.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                      Mã Đơn: {w.orderCode ?? "Không có"}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                      w.status === "RESOLVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                      w.status === "REJECTED" ? "bg-red-50 text-red-700 border-red-200/60" :
                      w.status === "PROCESSING" ? "bg-blue-50 text-blue-700 border-blue-200/60" :
                      "bg-amber-50 text-amber-700 border-amber-200/60"
                    }`}>
                      {getWarrantyStatusLabel(w.status)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    Số điện thoại liên hệ: <strong className="text-slate-800">{w.phone}</strong> · Gửi ngày: {formatDate(w.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {w.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(w.id, "PROCESSING")}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                    >
                      Tiếp nhận xử lý
                    </button>
                  )}
                  {w.status === "PROCESSING" && (
                    <>
                      <button
                        onClick={() => {
                          const resp = prompt("Nhập phản hồi kết quả cho khách:");
                          if (resp !== null) updateStatus(w.id, "RESOLVED", resp);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Đã giải quyết
                      </button>
                      <button
                        onClick={() => {
                          const resp = prompt("Lý do từ chối bảo hành:");
                          if (resp !== null) updateStatus(w.id, "REJECTED", resp);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200/60 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-800 font-medium leading-relaxed">
                  <strong className="text-slate-900 font-bold">Lý do khiếu nại:</strong> {w.reason}
                </p>
                {w.description && (
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                    {w.description}
                  </p>
                )}
                {w.response && (
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100">
                    <p className="font-bold text-blue-900 mb-0.5">Phản hồi từ Ban Quản Lý NKS:</p>
                    <p className="text-blue-800 leading-relaxed">{w.response}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
