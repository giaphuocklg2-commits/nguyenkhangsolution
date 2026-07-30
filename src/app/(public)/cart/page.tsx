"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, User, Phone, Mail, MapPin, FileText, CheckCircle, QrCode, Copy } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import QRCode from "react-qr-code";
import Link from "next/link";

interface OrderResult {
  orderCode: string;
  qrToken: string;
  totalAmount: number;
  trackingUrl: string;
  message: string;
}

export default function CartPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { toast } = useToast();
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  const images = (item: (typeof items)[0]) => {
    try { return JSON.parse(item.image as any); } catch { return item.image; }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.address) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ thông tin", variant: "error" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Giỏ hàng trống", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderResult(data.data);
        clearCart();
        toast({ title: "Đặt hàng thành công!", variant: "success" });
      } else {
        toast({ title: "Lỗi đặt hàng", description: data.error, variant: "error" });
      }
    } catch (err) {
      toast({ title: "Lỗi kết nối", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  if (orderResult) {
    const trackingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/order/${orderResult.qrToken}`;
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
        <div className="bg-white  rounded-3xl border border-gray-200  p-8 text-center">
          <div className="w-16 h-16 bg-green-100  rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900  mb-2">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-gray-500  mb-8">{orderResult.message}</p>

          {/* Order code */}
          <div className="bg-gray-50  rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">Mã đơn hàng của bạn</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-heading text-2xl font-bold text-yellow-600 ">
                {orderResult.orderCode}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(orderResult.orderCode);
                  toast({ title: "Đã sao chép mã đơn", variant: "success" });
                }}
                className="p-1.5 hover:bg-gray-200 :bg-gray-700 rounded-lg transition-colors"
                id="copy-order-code-btn"
              >
                <Copy className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Lưu mã này để tra cứu đơn hàng</p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <QRCode
              value={trackingUrl}
              size={160}
              className="rounded-xl p-2 bg-white"
            />
            <p className="text-xs text-gray-500 ">
              Quét QR để xem chi tiết & cập nhật đơn hàng
            </p>
          </div>

          <div className="bg-blue-50  border border-blue-200  rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-blue-800  font-medium mb-1">📞 Lưu ý:</p>
            <p className="text-sm text-blue-700 ">
              Seller của chúng tôi sẽ liên hệ với bạn qua số{" "}
              <strong>{form.phone}</strong> để xác nhận đơn hàng trong thời gian sớm nhất.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/order/${orderResult.qrToken}`}
              className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-colors text-center"
              id="view-order-btn"
            >
              Xem Đơn Hàng
            </Link>
            <Link
              href="/products"
              className="flex-1 py-3 border border-gray-200  text-gray-700  rounded-xl font-semibold hover:bg-gray-50 :bg-gray-800 transition-colors text-center"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="font-heading text-2xl font-bold text-gray-900  mb-2">
          Giỏ hàng trống
        </h1>
        <p className="text-gray-500  mb-8">
          Hãy thêm sản phẩm vào giỏ hàng để tiến hành đặt hàng
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          Xem Sản Phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-gray-900  mb-8">
        Giỏ Hàng & Đặt Hàng
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer info */}
            <div className="bg-white  rounded-2xl border border-gray-200  p-6">
              <h2 className="font-heading font-semibold text-lg text-gray-900  mb-5 flex items-center gap-2">
                <User className="h-5 w-5 text-yellow-600" />
                Thông Tin Người Mua
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      id="customer-name-input"
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
                      id="customer-phone-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      id="customer-email-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Số nhà, đường, phường/xã, tỉnh/thành"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      id="customer-address-input"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Ghi chú đơn hàng
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Ghi chú cho seller (thời gian giao, yêu cầu đặc biệt...)"
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm resize-none"
                    id="order-notes-input"
                  />
                </div>
              </div>
            </div>

            {/* Cart items */}
            <div className="bg-white  rounded-2xl border border-gray-200  p-6">
              <h2 className="font-heading font-semibold text-lg text-gray-900  mb-5 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-yellow-600" />
                Sản Phẩm Đặt Mua ({getTotalItems()})
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-3 bg-gray-50  rounded-xl"
                  >
                    <div className="w-16 h-16 bg-white  rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 ">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Số lượng: {item.quantity}</p>
                      <p className="text-sm font-semibold text-yellow-600  mt-1">
                        {formatCurrency((item.salePrice ?? item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white  rounded-2xl border border-gray-200  p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-lg text-gray-900  mb-5">
                Tóm Tắt Đơn Hàng
              </h2>

              <div className="space-y-3 mb-5 pb-5 border-b border-gray-100 ">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600  truncate mr-2 max-w-[160px]">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900  flex-shrink-0">
                      {formatCurrency((item.salePrice ?? item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 ">Tạm tính</span>
                <span className="font-medium text-gray-900 ">
                  {formatCurrency(getTotalPrice())}
                </span>
              </div>
              <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-100 ">
                <span className="text-gray-600 ">Phí vận chuyển</span>
                <span className="text-green-600  font-medium">Thỏa thuận</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-gray-900 ">Tổng cộng</span>
                <span className="text-xl font-bold text-yellow-600 ">
                  {formatCurrency(getTotalPrice())}
                </span>
              </div>

              <div className="bg-blue-50  border border-blue-200  rounded-xl p-3 mb-5">
                <p className="text-xs text-blue-700 ">
                  💬 Không thanh toán online. Seller sẽ liên hệ xác nhận đơn và hướng dẫn thanh toán.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="place-order-btn"
                className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Xác Nhận Đặt Hàng</>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Bằng cách đặt hàng, bạn đồng ý với chính sách của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
