"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  saleEndDate?: Date | null;
  images: string;
  stock: number;
  isFeatured: boolean;
  category: { name: string; slug: string };
}

function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 57, m: 8, s: 4 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1.5 mt-4 sm:mt-0">
      <span className="text-gray-600 text-sm font-medium mr-2">Kết thúc sau</span>
      <div className="bg-blue-400 text-white font-bold px-2 py-1 rounded text-sm min-w-[32px] text-center">{String(timeLeft.h).padStart(2, '0')}</div>
      <span className="font-bold text-gray-400">:</span>
      <div className="bg-blue-400 text-white font-bold px-2 py-1 rounded text-sm min-w-[32px] text-center">{String(timeLeft.m).padStart(2, '0')}</div>
      <span className="font-bold text-gray-400">:</span>
      <div className="bg-blue-400 text-white font-bold px-2 py-1 rounded text-sm min-w-[32px] text-center">{String(timeLeft.s).padStart(2, '0')}</div>
    </div>
  );
}

export function HomeFeatured({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="py-10 bg-[#f5f7fd] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white  rounded-2xl p-6 shadow-sm border border-gray-100 ">
          
          {/* Flash Sale Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-gray-100 ">
            <div className="flex items-center gap-3 text-[#1c3b87] ">
              <Zap className="h-8 w-8 fill-yellow-500 text-yellow-500" />
              <h2 className="font-heading text-3xl font-black italic uppercase tracking-wider">
                Khuyến Mãi Online
              </h2>
            </div>
          </div>

          {/* Banner Tabs */}
          <div className="mb-8 rounded-xl overflow-hidden border-2 border-[#1c3b87] bg-[#1c3b87] text-white">
            <div className="bg-gradient-to-r from-[#1c3b87] to-blue-600 p-6 flex flex-col md:flex-row items-center justify-between">
               <h3 className="text-4xl font-black italic drop-shadow-md mb-2 md:mb-0">DẪN ĐẦU GIÁ RẺ</h3>
               <div className="text-center">
                 <p className="text-xl font-bold text-yellow-400 mb-1">GIẢM ĐẾN</p>
                 <p className="text-5xl font-black text-yellow-400 drop-shadow-md">50%</p>
               </div>
            </div>
            <div className="flex bg-white text-gray-600 font-semibold text-center divide-x divide-gray-200">
              <div className="flex-1 py-3 border-b-4 border-blue-500 text-blue-600 bg-blue-50">
                01/02 - 30/04<br/><span className="text-xs font-normal">Đang diễn ra</span>
              </div>
              <div className="flex-1 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                01/05 - 31/07<br/><span className="text-xs font-normal">Sắp diễn ra</span>
              </div>
              <div className="flex-1 py-3 hover:bg-gray-50 cursor-pointer transition-colors hidden sm:block">
                01/08 - 31/12<br/><span className="text-xs font-normal">Sắp diễn ra</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <FlashSaleTimer />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/products?sale=true"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#1c3b87] hover:bg-[#1c3b87] hover:text-white text-[#1c3b87] rounded-full font-bold transition-colors shadow-sm"
            >
              Xem Thêm Khuyến Mãi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
