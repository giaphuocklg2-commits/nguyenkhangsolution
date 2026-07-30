"use client";

import React, { useState, useCallback } from "react";
import { useCartStore } from "@/store/cart.store";
import Link from "next/link";
import { ShoppingCart, Star, Flame, Zap, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import { addVat, VAT_PERCENT } from "@/lib/pricing";

export interface ProductCardProps {
  product: {
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
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  const images = (() => {
    try { return JSON.parse(product.images) as string[]; } catch { return []; }
  })();

  const image = images[0] ?? "";
  const hasSale =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    (!product.saleEndDate || new Date(product.saleEndDate) > new Date());
  const currentPrice = hasSale ? product.salePrice! : product.price;
  const discount = hasSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: hasSale ? product.salePrice : null,
      image,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    toast({ title: "🛒 Đã thêm vào giỏ!", description: product.name, variant: "success" });
  }, [isOutOfStock, addItem, product, image, toast, hasSale]);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border border-slate-200/70 hover:border-blue-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col gap-2 text-slate-300">
            <Package className="h-12 w-12" />
            <span className="text-xs">Chưa có ảnh</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {hasSale && discount > 0 && (
            <span className="badge-sale shadow flex items-center gap-0.5">
              <Zap className="h-2.5 w-2.5" /> -{discount}%
            </span>
          )}
          {product.isFeatured && !hasSale && (
            <span className="badge-hot shadow flex items-center gap-0.5">
              <Flame className="h-2.5 w-2.5" /> HOT
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-bold bg-slate-700 text-white px-2 py-0.5 rounded-full">
              Hết hàng
            </span>
          )}
        </div>

        {/* Add to cart on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-white transition-colors ${
              added ? "bg-green-500" : isOutOfStock ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added ? "✓ Đã thêm!" : isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1 gap-2">
        {/* Category */}
        <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">
          {product.category.name}
        </span>

        {/* Name */}
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors flex-1">
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
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="text-base font-black text-blue-700">
              {formatCurrency(addVat(currentPrice))}
            </div>
            {hasSale && (
              <div className="text-xs text-slate-400 line-through">
                {formatCurrency(addVat(product.price))}
              </div>
            )}
            <div className="text-[10px] text-slate-500">Đã gồm VAT {VAT_PERCENT}%</div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isOutOfStock
                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : added
                ? "bg-green-500 text-white scale-90"
                : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-500/30"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Low stock bar */}
        {hasSale && product.stock > 0 && product.stock <= 20 && (
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Đã bán nhiều</span>
              <span className="text-red-500 font-semibold">Còn {product.stock}</span>
            </div>
            <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full"
                style={{ width: `${Math.min((20 - product.stock) / 20 * 100 + 30, 90)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
