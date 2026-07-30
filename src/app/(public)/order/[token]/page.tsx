import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderTrackingResult } from "@/components/orders/order-tracking-result";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  return { title: "Chi Tiết Đơn Hàng" };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ qrToken: (await params).token }, { id: (await params).token }, { orderCode: (await params).token }],
    },
    include: {
      items: { include: { product: true } },
      trackingHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/order/track"
        className="inline-flex items-center gap-2 text-sm text-gray-500  hover:text-gray-900 :text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Tra cứu đơn khác
      </Link>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900 ">
          Chi Tiết Đơn Hàng
        </h1>
        <p className="text-gray-500  mt-1 text-sm">
          Trang này được tạo riêng cho đơn hàng của bạn
        </p>
      </div>

      <OrderTrackingResult order={order as any} />

      {/* Warranty CTA */}
      {order.status === "DELIVERED" && (
        <div className="mt-6 bg-green-50  border border-green-200  rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600  flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800  mb-1">
                Cần hỗ trợ bảo hành?
              </p>
              <p className="text-sm text-green-700  mb-3">
                Sản phẩm của bạn đang trong thời gian bảo hành. Liên hệ ngay nếu cần hỗ trợ.
              </p>
              <Link
                href={`/warranty?code=${order.orderCode}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
                id="warranty-request-btn"
              >
                <Shield className="h-4 w-4" />
                Yêu Cầu Bảo Hành
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
