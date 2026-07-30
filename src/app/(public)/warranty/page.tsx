"use client";

import { useState } from "react";
import { Shield, Search, Send, Phone, Package, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import { formatDate, getWarrantyStatusLabel } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function WarrantyContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"lookup" | "request">(
    searchParams.get("code") ? "request" : "lookup"
  );
  const { toast } = useToast();

  // Lookup state
  const [lookupQuery, setLookupQuery] = useState(searchParams.get("code") ?? "");
  const [lookupType, setLookupType] = useState<"code" | "phone">("code");
  const [lookupResult, setLookupResult] = useState<any[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  // Request form state
  const [form, setForm] = useState({
    orderCode: searchParams.get("code") ?? "",
    phone: "",
    reason: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLookupLoading(true);
    setLookupError("");
    setLookupResult([]);

    try {
      const params = new URLSearchParams();
      if (lookupType === "code") params.set("code", lookupQuery.trim().toUpperCase());
      else params.set("phone", lookupQuery.trim());

      const res = await fetch(`/api/v1/warranty?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.data.length > 0) {
        setLookupResult(data.data);
      } else {
        setLookupError("Không tìm thấy yêu cầu bảo hành nào");
      }
    } catch {
      setLookupError("Lỗi kết nối");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone || !form.reason) {
      toast({ title: "Vui lòng điền đủ thông tin", variant: "error" });
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast({ title: "Gửi yêu cầu thành công!", variant: "success" });
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100  rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-green-600 " />
        </div>
        <h1 className="font-heading text-3xl font-bold text-gray-900  mb-2">
          Bảo Hành & Hỗ Trợ
        </h1>
        <p className="text-gray-500 ">
          Tra cứu yêu cầu bảo hành hoặc gửi yêu cầu mới
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100  rounded-xl mb-8">
        <button
          onClick={() => setActiveTab("lookup")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "lookup"
              ? "bg-white  text-gray-900  shadow-sm"
              : "text-gray-500 hover:text-gray-700 :text-gray-300"
          }`}
          id="warranty-lookup-tab"
        >
          <Search className="h-4 w-4" />
          Tra Cứu Bảo Hành
        </button>
        <button
          onClick={() => setActiveTab("request")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "request"
              ? "bg-white  text-gray-900  shadow-sm"
              : "text-gray-500 hover:text-gray-700 :text-gray-300"
          }`}
          id="warranty-request-tab"
        >
          <Send className="h-4 w-4" />
          Yêu Cầu Bảo Hành
        </button>
      </div>

      {/* Lookup Tab */}
      {activeTab === "lookup" && (
        <div className="space-y-6">
          <div className="bg-white  rounded-2xl border border-gray-200  p-6">
            <div className="flex gap-2 mb-4 p-1 bg-gray-100  rounded-xl">
              {(["code", "phone"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLookupType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    lookupType === type
                      ? "bg-white  text-gray-900  shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  {type === "code" ? "Mã đơn hàng" : "Số điện thoại"}
                </button>
              ))}
            </div>
            <form onSubmit={handleLookup} className="flex gap-3">
              <input
                type={lookupType === "phone" ? "tel" : "text"}
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder={lookupType === "code" ? "NKS-12345ABCDE" : "0901234567"}
                className="flex-1 px-4 py-3 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                id="warranty-lookup-input"
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-colors"
                id="warranty-lookup-btn"
              >
                Tra cứu
              </button>
            </form>
          </div>

          {lookupError && (
            <div className="flex items-center gap-3 p-4 bg-red-50  border border-red-200  rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700 ">{lookupError}</p>
            </div>
          )}

          {lookupResult.map((w) => (
            <div key={w.id} className="bg-white  rounded-2xl border border-gray-200  p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Mã yêu cầu</p>
                  <p className="font-mono font-bold text-gray-900 ">{w.id.slice(-8).toUpperCase()}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  w.status === "RESOLVED" ? "bg-green-100 text-green-700" :
                  w.status === "REJECTED" ? "bg-red-100 text-red-700" :
                  w.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {getWarrantyStatusLabel(w.status)}
                </span>
              </div>
              <p className="text-sm text-gray-700 "><strong>Lý do:</strong> {w.reason}</p>
              {w.description && (
                <p className="text-sm text-gray-600  mt-1">{w.description}</p>
              )}
              {w.response && (
                <div className="mt-3 p-3 bg-blue-50  rounded-xl">
                  <p className="text-xs font-semibold text-blue-700  mb-1">Phản hồi từ NKS:</p>
                  <p className="text-sm text-blue-700 ">{w.response}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">{formatDate(w.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Request Tab */}
      {activeTab === "request" && (
        <div className="bg-white  rounded-2xl border border-gray-200  p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100  rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="font-heading font-bold text-xl text-gray-900  mb-2">
                Gửi Yêu Cầu Thành Công!
              </h2>
              <p className="text-gray-500  text-sm">
                Đội ngũ CSKH của chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ orderCode: "", phone: "", reason: "", description: "" }); }}
                className="mt-6 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-heading font-semibold text-lg text-gray-900  mb-1">
                Gửi Yêu Cầu Bảo Hành
              </h2>
              <p className="text-sm text-gray-500  mb-4">
                Điền thông tin bên dưới, CSKH sẽ liên hệ xử lý trong 24h
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Mã đơn hàng
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={form.orderCode}
                      onChange={(e) => setForm({ ...form, orderCode: e.target.value })}
                      placeholder="NKS-12345ABCDE"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      id="warranty-order-code"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0901234567"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      id="warranty-phone"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Lý do bảo hành <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  id="warranty-reason"
                >
                  <option value="">Chọn lý do...</option>
                  <option value="Sản phẩm bị hỏng">Sản phẩm bị hỏng</option>
                  <option value="Không hoạt động đúng">Không hoạt động đúng</option>
                  <option value="Lỗi kỹ thuật">Lỗi kỹ thuật</option>
                  <option value="Sản phẩm không đúng mô tả">Sản phẩm không đúng mô tả</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Mô tả chi tiết
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                    rows={4}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm resize-none"
                    id="warranty-description"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                id="warranty-submit-btn"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Gửi Yêu Cầu Bảo Hành
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default function WarrantyPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <WarrantyContent />
    </Suspense>
  );
}
