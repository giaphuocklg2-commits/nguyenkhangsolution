"use client";

import Link from "next/link";
import { ArrowRight, Gift, ChevronRight, ChevronLeft, Ticket, Copy, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { formatCurrency } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountPercent: number | null;
  discountAmount: number | null;
  minOrderValue: number | null;
  maxDiscount: number | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

const slides = [
  {
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1400&h=500",
    tag: "🌞 Năng Lượng Xanh",
    title: "HỆ THỐNG ĐIỆN",
    highlight: "NĂNG LƯỢNG MẶT TRỜI",
    subtitle: "Tiết kiệm đến 80% điện phí · Bảo hành 25 năm · Lắp đặt toàn quốc",
    cta: "Khám phá ngay",
    ctaHref: "/products?category=nang-luong-mat-troi",
    color: "from-blue-900/80 via-blue-800/60 to-transparent",
  },
  {
    image: "https://images.unsplash.com/photo-1563906267088-b029e7101114?auto=format&fit=crop&q=80&w=1400&h=500",
    tag: "⚡ Siêu Ưu Đãi",
    title: "INVERTER CAO CẤP",
    highlight: "GIẢM ĐẾN 30%",
    subtitle: "Bộ chuyển đổi điện đa năng · Công suất từ 1KW đến 100KW · Hàng chính hãng",
    cta: "Xem ưu đãi",
    ctaHref: "/products?category=inverter&sale=true",
    color: "from-amber-900/80 via-orange-800/60 to-transparent",
  },
  {
    image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&q=80&w=1400&h=500",
    tag: "💡 Hàng Chính Hãng",
    title: "THIẾT BỊ ĐIỆN",
    highlight: "DÂN DỤNG & HÀNG HẢI",
    subtitle: "Đèn LED · Đèn hải đăng · Bảo hành 1 đổi 1 · Giao hàng toàn quốc",
    cta: "Mua ngay",
    ctaHref: "/products",
    color: "from-indigo-900/80 via-purple-800/60 to-transparent",
  }
];

export const HomeHero: React.FC = () => {

  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(idx);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slides.length;
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/v1/coupons/active")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setCoupons(data); })
      .catch(() => {});
  }, []);

  const copyCoupon = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast({ title: "✅ Đã sao chép mã!", description: code, variant: "success" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="bg-[#F0F4FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8 space-y-5">

        {/* Premium Slider */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/60 aspect-[16/6] bg-slate-900 group">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
              }`}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-20 text-white">
                {/* Tag */}
                <div className="animate-fade-in delay-100">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full mb-3 shadow">
                    {slide.tag}
                  </span>
                </div>
                {/* Title */}
                {index === 0 ? (
                  <h1 className="animate-fade-in delay-200 text-2xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-lg">
                    {slide.title}<br />
                    <span className="text-yellow-400">{slide.highlight}</span>
                  </h1>
                ) : (
                  <h2 className="animate-fade-in delay-200 text-2xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-lg">
                    {slide.title}<br />
                    <span className="text-yellow-400">{slide.highlight}</span>
                  </h2>
                )}
                {/* Subtitle */}
                <p className="animate-fade-in delay-300 text-sm md:text-base text-white/80 mt-2 max-w-xl font-medium">
                  {slide.subtitle}
                </p>
                {/* CTA */}
                <div className="animate-fade-in delay-400 mt-5">
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all"
                  >
                    {slide.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Prev / Next */}
          <button
            onClick={() => goToSlide((currentSlide === 0 ? slides.length - 1 : currentSlide - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => goToSlide((currentSlide + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? "w-6 h-2 bg-white shadow-sm"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute top-3 right-4 text-white/60 text-xs font-mono z-30">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 rounded-2xl px-5 py-3 shadow-md shadow-blue-500/20">
          <div className="marquee-wrapper">
            <div className="marquee-track flex items-center gap-10 text-white text-xs font-semibold">
              {[
                { icon: "⚡", text: "Giao hàng toàn quốc" },
                { icon: "🔒", text: "Bảo hành chính hãng" },
                { icon: "💳", text: "Thanh toán COD - Chuyển khoản" },
                { icon: "📞", text: "Hỗ trợ 24/7" },
                { icon: "🏆", text: "10+ năm kinh nghiệm" },
                { icon: "🌟", text: "1000+ khách hàng tin tưởng" },
                { icon: "⚡", text: "Giao hàng toàn quốc" },
                { icon: "🔒", text: "Bảo hành chính hãng" },
                { icon: "💳", text: "Thanh toán COD - Chuyển khoản" },
                { icon: "📞", text: "Hỗ trợ 24/7" },
                { icon: "🏆", text: "10+ năm kinh nghiệm" },
                { icon: "🌟", text: "1000+ khách hàng tin tưởng" },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2 flex-shrink-0">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                  {i < 11 && <span className="text-blue-400 ml-4">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Coupons Row */}
        {coupons.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center shadow-sm">
                <Ticket className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Mã Giảm Giá Hôm Nay</h3>
              <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200 animate-bounce-subtle">
                {coupons.length} mã
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {coupons.map((coupon) => {
                const titleText = coupon.discountPercent
                  ? `Giảm ${coupon.discountPercent}%`
                  : `Giảm ${formatCurrency(coupon.discountAmount || 0)}`;
                const descText = coupon.minOrderValue
                  ? `Đơn từ ${formatCurrency(coupon.minOrderValue)}`
                  : (coupon.description || "Áp dụng cho mọi đơn hàng");
                const dateText = coupon.endDate
                  ? `HSD: ${new Date(coupon.endDate).toLocaleDateString("vi-VN")}`
                  : "HSD: Vô hạn";
                const isCopied = copiedId === coupon.id;

                return (
                  <div
                    key={coupon.id}
                    className="flex-shrink-0 flex w-[280px] bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    {/* Left colored strip */}
                    <div className="bg-gradient-to-b from-blue-600 to-blue-700 w-20 flex flex-col items-center justify-center p-3 text-white relative">
                      <Gift className="h-5 w-5 mb-1.5 opacity-90" />
                      <span className="font-mono font-bold text-[11px] leading-tight text-center break-all">{coupon.code}</span>
                      {/* Perforation dots */}
                      <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-around py-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-[#F0F4FA] rounded-full" />
                        ))}
                      </div>
                    </div>
                    {/* Right content */}
                    <div className="flex-1 p-3 flex flex-col justify-between pl-5">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{titleText}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{descText}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">{dateText}</p>
                      </div>
                      <button
                        onClick={() => copyCoupon(coupon.code, coupon.id)}
                        className={`mt-2 flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-xl w-full border transition-all ${
                          isCopied
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200/60"
                        }`}
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {isCopied ? "Đã sao chép!" : "Sao chép mã"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center shadow-sm flex items-center justify-center gap-2">
            <Ticket className="h-4 w-4 text-slate-300" />
            <span className="text-xs font-medium text-slate-400">Chưa có mã giảm giá. Quay lại sau bạn nhé!</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeHero;
