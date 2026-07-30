"use client";

import { useState } from "react";
import { Search, Package, Phone } from "lucide-react";
import { OrderTrackingResult } from "@/components/orders/order-tracking-result";
import type { Metadata } from "next";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState<"code" | "phone">("code");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setOrders([]);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (queryType === "code") params.set("code", query.trim().toUpperCase());
      else params.set("phone", query.trim());

      const res = await fetch(`/api/v1/orders/track?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-yellow-100  rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-yellow-600 " />
        </div>
        <h1 className="font-heading text-3xl font-bold text-gray-900  mb-2">
          Tra Cứu Đơn Hàng
        </h1>
        <p className="text-gray-500 ">
          Nhập mã đơn hàng hoặc số điện thoại để xem trạng thái
        </p>
      </div>

      {/* Search form */}
      <div className="bg-white  rounded-2xl border border-gray-200  p-6 mb-8">
        {/* Toggle */}
        <div className="flex gap-2 mb-5 p-1 bg-gray-100  rounded-xl">
          <button
            onClick={() => setQueryType("code")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              queryType === "code"
                ? "bg-white  text-gray-900  shadow-sm"
                : "text-gray-500  hover:text-gray-700 :text-gray-300"
            }`}
            id="search-by-code-btn"
          >
            <Package className="h-4 w-4" />
            Mã đơn hàng
          </button>
          <button
            onClick={() => setQueryType("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              queryType === "phone"
                ? "bg-white  text-gray-900  shadow-sm"
                : "text-gray-500  hover:text-gray-700 :text-gray-300"
            }`}
            id="search-by-phone-btn"
          >
            <Phone className="h-4 w-4" />
            Số điện thoại
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type={queryType === "phone" ? "tel" : "text"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                queryType === "code"
                  ? "Ví dụ: NKS-12345ABCDE"
                  : "Ví dụ: 0901234567"
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              id="order-search-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
            id="search-order-btn"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Tra cứu
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && !loading && (
        <>
          {error && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="font-semibold text-gray-900  mb-1">{error}</p>
              <p className="text-sm text-gray-500">Kiểm tra lại mã đơn hoặc số điện thoại</p>
            </div>
          )}
          {orders.length > 0 && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 ">
                Tìm thấy {orders.length} đơn hàng
              </p>
              {orders.map((order) => (
                <OrderTrackingResult key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
