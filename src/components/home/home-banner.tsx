import React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";

export const HomeBanner: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-12 shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-900/20 blur-3xl" />

        {/* Grid lines decoration */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Tư Vấn Miễn Phí 24/7
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
              Cần Tư Vấn{" "}
              <span className="gradient-text-brand">Hệ Thống</span>
              <br />Điện & NLMT?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
              Đội ngũ kỹ sư chuyên nghiệp của NKS Electric luôn sẵn sàng tư vấn và hỗ trợ bạn lựa chọn giải pháp phù hợp nhất với nhu cầu và ngân sách.
            </p>

            {/* Contact options */}
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:0901234567"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-sm transition-all hover:scale-105"
              >
                <Phone className="h-4 w-4 text-green-400" />
                0901 234 567
              </a>
              <a
                href="mailto:info@nkselectric.vn"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-sm transition-all hover:scale-105"
              >
                <Mail className="h-4 w-4 text-blue-400" />
                Email tư vấn
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                Chat Zalo
              </a>
            </div>
          </div>

          {/* Right - CTA card */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-bold text-lg mb-4">🎁 Ưu đãi đặc biệt</h3>
            <ul className="space-y-3 mb-6">
              {[
                "✅ Khảo sát & tư vấn hoàn toàn miễn phí",
                "✅ Báo giá chi tiết trong 24 giờ",
                "✅ Bảo hành thi công 12 tháng",
                "✅ Hỗ trợ thủ tục EVN toàn diện",
                "✅ Trả góp 0% lãi suất qua ngân hàng",
              ].map((item) => (
                <li key={item} className="text-slate-200 text-sm flex items-start gap-2">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all text-sm"
            >
              Xem ngay sản phẩm <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
