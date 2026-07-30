"use client";

import React, { useState, useEffect, useCallback } from "react";

import Link from "next/link";
import { ShoppingCart, ArrowRight, Star, Flame, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { addVat, VAT_PERCENT } from "@/lib/pricing";
import { useToast } from "@/components/providers/toast-provider";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  saleEndDate?: Date | string | null;
  images: string;
  isFeatured?: boolean;
  category?: { name: string; slug: string } | null;
}

export interface HomeFeaturedProps {
  products: Product[];
}

const CountdownTimer: React.FC<{ endDate: Date | string }> = ({ endDate }) => {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 text-[10px]">
        <span className="bg-red-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">00</span>
        <span className="font-bold text-red-600">:</span>
        <span className="bg-red-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">00</span>
        <span className="font-bold text-red-600">:</span>
        <span className="bg-red-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">00</span>
      </div>
    );
  }


  return (
    <div className="flex items-center gap-1 text-[10px]">
      <span className="bg-red-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">
        {String(time.h).padStart(2, "0")}
      </span>
      <span className="font-bold text-red-600">:</span>
      <span className="bg-red-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">
        {String(time.m).padStart(2, "0")}
      </span>
      <span className="font-bold text-red-600">:</span>
      <span className="bg-red-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">
        {String(time.s).padStart(2, "0")}
      </span>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const images = (() => {
    try { return JSON.parse(product.images); } catch { return []; }
  })();
  const imgSrc = images[0] || null;
  const hasDiscount =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    product.salePrice < product.price &&
    (!product.saleEndDate || new Date(product.saleEndDate) > new Date());
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;
  const currentPrice = hasDiscount ? product.salePrice! : product.price;

  const handleAddCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: hasDiscount ? product.salePrice : null,
      image: imgSrc || "",
      slug: product.slug,
      quantity: 1,
    });
    toast({ title: "🛒 Đã thêm vào giỏ hàng!", description: product.name, variant: "success" });
    setTimeout(() => setAdding(false), 800);
  }, [product, currentPrice, imgSrc, addItem, toast]);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="badge-sale shadow-sm">-{discountPct}%</span>
          )}
          {product.isFeatured && !hasDiscount && (
            <span className="badge-hot shadow-sm flex items-center gap-0.5">
              <Flame className="h-2.5 w-2.5" /> HOT
            </span>
          )}
        </div>

        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddCart}
            className={`w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-white transition-all ${
              adding
                ? "bg-green-500"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {adding ? "Đã thêm!" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category */}
        {product.category && (
          <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[10px] text-slate-400 ml-1">(5.0)</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          {hasDiscount && product.saleEndDate && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px] text-red-500 font-semibold">Kết thúc sau:</span>
              <CountdownTimer endDate={product.saleEndDate} />
            </div>
          )}
          <div className="flex items-end gap-2">
            <span className="text-base font-black text-blue-700">
              {formatCurrency(addVat(currentPrice))}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatCurrency(addVat(product.price))}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500">Đã gồm VAT {VAT_PERCENT}%</span>
        </div>
      </div>
    </Link>
  );
};

export const HomeFeatured: React.FC<HomeFeaturedProps> = ({ products }) => {
  if (products.length === 0) return null;

  return (
    <section className="bg-[#F8FAFF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-orange-400 to-red-600" />
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1">
                <Flame className="h-3 w-3" /> Bán Chạy
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Sản Phẩm <span className="gradient-text">Nổi Bật</span>
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All mobile */}
        <div className="mt-5 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-blue-700 shadow-md"
          >
            Xem tất cả sản phẩm <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFeatured;
