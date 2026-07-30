"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { useToast } from "@/components/providers/toast-provider";
import { formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";
import Link from "next/link";
import {
  ShoppingCart, ArrowLeft, Shield, Truck, Award,
  ChevronLeft, ChevronRight, ZoomIn, Tag, Clock, Check, Copy, Gift
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  detail?: string | null;
  price: number;
  salePrice?: number | null;
  saleEndDate?: Date | null;
  images: string;
  stock: number;
  isFeatured: boolean;
  category: { name: string; slug: string };
}

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

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addItem, openCart } = useCartStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "detail">("desc");
  const [coupons, setCoupons] = useState<Coupon[]>([]);

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

  const images = (() => {
    try { return JSON.parse(product.images) as string[]; } catch { return []; }
  })();

  const currentPrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const hasSale =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    (!product.saleEndDate || new Date(product.saleEndDate) > new Date());

  function handleAddToCart() {
    if (product.stock === 0) return;
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: images[0] ?? "",
      slug: product.slug,
      quantity,
    });
    toast({ title: "Đã thêm vào giỏ hàng", description: `${quantity} × ${product.name}`, variant: "success" });
    setTimeout(() => openCart(), 300);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900 transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-900 transition-colors">Sản phẩm</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-gray-900 transition-colors">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden">
            {images[activeImg] ? (
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-gray-300" />
              </div>
            )}
            {hasSale && discount > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl shadow-md">
                -{discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImg
                      ? "border-blue-600 scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#1D4ED8] text-xs font-semibold rounded-full mb-4 border border-blue-200">
              <Tag className="h-3 w-3" />
              {product.category.name}
            </span>

            <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-5">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1D4ED8]">
                {formatCurrency(currentPrice)}
              </span>
              {hasSale && (
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : "Hết hàng"}
              </span>
            </div>

            {/* Real DB Coupons */}
            {coupons.length > 0 && (
              <div className="mb-6 bg-blue-50/60 rounded-2xl border border-blue-100 p-4">
                <div className="flex items-center gap-2 mb-3 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <Gift className="h-4 w-4 text-blue-600" /> Mã Giảm Giá Ưu Đãi
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {coupons.map((coupon) => {
                    const titleText = coupon.discountPercent
                      ? `Giảm ${coupon.discountPercent}%`
                      : `Giảm ${formatCurrency(coupon.discountAmount || 0)}`;

                    const descText = coupon.minOrderValue
                      ? `Đơn từ ${formatCurrency(coupon.minOrderValue)}`
                      : (coupon.description || "Mọi đơn hàng");

                    const dateText = coupon.endDate
                      ? `${new Date(coupon.endDate).toLocaleDateString("vi-VN")}`
                      : "Không giới hạn";

                    return (
                      <div key={coupon.id} className="min-w-[210px] bg-white border border-blue-200/80 rounded-xl p-3 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-mono font-bold text-[#1D4ED8] text-sm">{coupon.code}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 leading-tight mb-1">{titleText}</p>
                          <p className="text-[11px] text-gray-500 mb-2 line-clamp-1">{descText}</p>
                          <p className="text-[10px] text-gray-400">HSD: {dateText}</p>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(coupon.code);
                            toast({ title: "Đã sao chép mã", description: coupon.code, variant: "success" });
                          }}
                          className="mt-2 text-xs font-bold bg-[#1D4ED8] text-white py-1.5 rounded-lg w-full hover:bg-blue-800 transition-colors shadow-sm"
                        >
                          Sao chép mã
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                id="product-add-cart-btn"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white rounded-xl font-bold transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock === 0 ? "Hết hàng" : "Thêm Vào Giỏ Hàng"}
              </button>
              <Link
                href="/cart"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-md"
                onClick={handleAddToCart}
                id="product-buy-now-btn"
              >
                Mua Ngay
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: "Bảo hành chính hãng" },
                { icon: Truck, text: "Giao hàng toàn quốc" },
                { icon: Award, text: "Chất lượng đảm bảo" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Icon className="h-5 w-5 text-amber-500 mb-1.5" />
                  <span className="text-xs text-gray-600 leading-tight font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {(product.description || product.detail) && (
        <div className="mb-12">
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: "desc" as const, label: "Mô Tả" },
              { id: "detail" as const, label: "Thông Số Kỹ Thuật" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-[#1D4ED8] text-[#1D4ED8]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 prose prose-sm max-w-none shadow-sm">
            {activeTab === "desc" ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
                {product.description ?? "Chưa có mô tả chi tiết."}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-xs">
                {product.detail ?? "Chưa có thông số kỹ thuật."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
            Sản Phẩm Liên Quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
