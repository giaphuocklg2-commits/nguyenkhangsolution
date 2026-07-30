"use client";

import Link from "next/link";
import { ArrowRight, Gift, ChevronRight, ChevronLeft, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
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

export function HomeHero() {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200&h=400",
      title: "HỆ THỐNG ĐIỆN NLMT",
      subtitle: "Tiết kiệm chi phí - Bảo vệ môi trường"
    },
    {
      image: "https://images.unsplash.com/photo-1563906267088-b029e7101114?auto=format&fit=crop&q=80&w=1200&h=400",
      title: "SIÊU ƯU ĐÃI INVERTER",
      subtitle: "Giảm đến 30% trong tháng này"
    },
    {
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&q=80&w=1200&h=400",
      title: "THIẾT BỊ ĐIỆN DÂN DỤNG",
      subtitle: "Hàng chính hãng - Bảo hành 1 đổi 1"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    fetch("/api/v1/coupons/active")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCoupons(data);
        }
      })
      .catch(() => {});
  }, []);

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Đã sao chép mã giảm giá", description: code, variant: "success" });
  };

  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8 space-y-6">
        
        {/* Banner Slider */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 aspect-[3/1] bg-gray-200 group">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 bg-black/30 z-10" />
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-24 text-white">
                <h2 className="text-3xl md:text-5xl font-black italic drop-shadow-lg mb-2 transform -skew-x-12">{slide.title}</h2>
                <p className="text-lg md:text-xl font-medium drop-shadow-md">{slide.subtitle}</p>
                <Link href="/products?sale=true" className="mt-6 inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-yellow-600 text-white px-6 py-2.5 rounded-full font-bold w-fit shadow-md transition-colors">
                  Khám phá ngay <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md z-30 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md z-30 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {slides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Real Coupons Row */}
        {coupons.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
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

              return (
                <div key={coupon.id} className="flex-shrink-0 flex w-[290px] bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden relative">
                  <div className="bg-[#1D4ED8] w-24 flex flex-col items-center justify-center p-3 text-white relative">
                    <Gift className="h-6 w-6 mb-1 opacity-80" />
                    <span className="font-mono font-bold text-base leading-tight text-center break-all">{coupon.code}</span>
                    {/* Dotted border effect */}
                    <div className="absolute -right-1.5 top-0 bottom-0 w-3 flex flex-col justify-between py-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-white rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between pl-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{titleText}</h4>
                      <p className="text-xs text-gray-500 mb-1 line-clamp-1">{descText}</p>
                      <p className="text-[10px] font-medium text-slate-400">{dateText}</p>
                    </div>
                    <button 
                      onClick={() => copyCoupon(coupon.code)}
                      className="mt-2 text-xs font-bold bg-blue-50 text-[#1D4ED8] hover:bg-blue-100 py-1.5 rounded-xl w-full transition-colors border border-blue-200/60"
                    >
                      Sao chép mã
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center text-xs font-semibold text-slate-500 shadow-sm flex items-center justify-center gap-2">
            <Ticket className="h-4 w-4 text-slate-400" />
            <span>Hiện tại chưa có mã giảm giá nào. Vui lòng quay lại sau!</span>
          </div>
        )}

      </div>
    </section>
  );
}
