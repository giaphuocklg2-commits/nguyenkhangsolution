import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export function HomeBanner() {
  return (
    <section className="py-12 bg-[#1D4ED8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 p-8 md:p-12">
          {/* Background glow */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                🔧 Nhận Lắp Đặt Hệ Thống NLMT
              </h2>
              <p className="text-gray-300 text-base leading-relaxed max-w-lg">
                Miễn phí khảo sát tại nhà. Tư vấn giải pháp tối ưu, tiết kiệm
                điện năng tối đa. Hỗ trợ thủ tục kết nối lưới EVN.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                {["Miễn phí khảo sát", "Bảo hành 25 năm", "Hỗ trợ EVN"].map(
                  (item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 text-sm text-yellow-400"
                    >
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products?category=dich-vu-lap-dat"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:-translate-y-0.5"
                id="banner-service-btn"
              >
                Xem Dịch Vụ
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:1900xxxx"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-600 hover:border-yellow-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-all"
                id="banner-call-btn"
              >
                <Phone className="h-4 w-4" />
                Gọi Ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
