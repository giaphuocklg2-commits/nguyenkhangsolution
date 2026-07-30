import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Phone, User, Calendar, ArrowRight, CheckCircle, Clock, Truck, Package, X } from "lucide-react";

interface Order {
  id: string;
  orderCode: string;
  qrToken: string;
  customerName: string;
  phone: string;
  address: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  trackingHistory: Array<{
    id: string;
    status: string;
    note?: string;
    updatedBy?: string;
    createdAt: string;
  }>;
}

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="h-4 w-4" />,
  CONFIRMED: <CheckCircle className="h-4 w-4" />,
  PROCESSING: <Package className="h-4 w-4" />,
  SHIPPING: <Truck className="h-4 w-4" />,
  DELIVERED: <CheckCircle className="h-4 w-4" />,
  CANCELLED: <X className="h-4 w-4" />,
};

export function OrderTrackingResult({ order }: { order: Order }) {
  return (
    <div className="bg-white  rounded-2xl border border-gray-200  overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-gray-50  p-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 ">
        <div>
          <p className="text-xs text-gray-500  mb-1">Mã đơn hàng</p>
          <p className="font-heading font-bold text-xl text-yellow-600 ">
            {order.orderCode}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`status-badge ${getOrderStatusColor(order.status)}`}>
            {statusIcons[order.status]}
            <span className="ml-1">{getOrderStatusLabel(order.status)}</span>
          </span>
          <Link
            href={`/order/${order.qrToken}`}
            className="flex items-center gap-1 text-sm text-yellow-600  hover:text-yellow-700 :text-yellow-300 font-medium"
          >
            Chi tiết
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Customer info */}
        <div>
          <h3 className="font-semibold text-gray-900  mb-3 text-sm">
            Thông tin giao hàng
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 ">
              <User className="h-4 w-4 text-gray-400" />
              {order.customerName}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 ">
              <Phone className="h-4 w-4 text-gray-400" />
              {order.phone}
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600 ">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              {order.address}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 ">
              <Calendar className="h-4 w-4 text-gray-400" />
              {formatDate(order.createdAt)}
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="font-semibold text-gray-900  mb-3 text-sm">
            Sản phẩm ({order.items.length})
          </h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 ">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-gray-900 ">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100  flex justify-between">
              <span className="font-semibold text-gray-900  text-sm">Tổng</span>
              <span className="font-bold text-yellow-600 ">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {order.trackingHistory && order.trackingHistory.length > 0 && (
        <div className="px-5 pb-5">
          <h3 className="font-semibold text-gray-900  mb-3 text-sm">
            Lịch sử cập nhật
          </h3>
          <div className="relative pl-5">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200 " />
            <div className="space-y-4">
              {[...order.trackingHistory].reverse().map((history, i) => (
                <div key={history.id} className="relative flex gap-3">
                  <div className={`absolute -left-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    i === 0
                      ? "bg-yellow-500 border-yellow-500"
                      : "bg-white  border-gray-300 "
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-gray-400"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getOrderStatusColor(history.status)}`}>
                        {getOrderStatusLabel(history.status)}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(history.createdAt)}</span>
                    </div>
                    {history.note && (
                      <p className="text-xs text-gray-500  mt-1">{history.note}</p>
                    )}
                    {history.updatedBy && (
                      <p className="text-xs text-gray-400">bởi {history.updatedBy}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
