"use client";

import { useCartStore } from "@/store/cart.store";
import Link from "next/link";
import { ShoppingCart, Eye, Tag, Clock, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
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

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const { toast } = useToast();
  const [addedEffect, setAddedEffect] = useState(false);

  const images = (() => {
    try {
      return JSON.parse(product.images) as string[];
    } catch {
      return [];
    }
  })();

  const image = images[0] ?? "";
  const currentPrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock === 0;
  const hasSale =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    (!product.saleEndDate || new Date(product.saleEndDate) > new Date());

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image,
      slug: product.slug,
    });
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 600);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
      variant: "success",
    });
  }

  return (
    <Link href={`/products/${product.slug}`} className="group bg-white  rounded-xl border border-gray-100  hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden block">
      {/* Top Badges */}
      <div className="absolute top-2 left-2 z-10">
        {product.isFeatured && (
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-center leading-tight shadow-md border-2 border-white ">
            <span className="text-[9px] font-black text-white uppercase drop-shadow-md">
              Sản phẩm<br />cao cấp
            </span>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square p-4 bg-white ">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50  rounded-lg">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Bottom image tags (Flash Sale & Freeship) */}
        {hasSale && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Zap className="h-3 w-3 fill-white" />
              ƯU ĐÃI<br />ĐẾN {discount}%
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center">
              BONUS FREESHIP 2H
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-900  line-clamp-2 mb-2 group-hover:text-[#1c3b87] :text-blue-400 transition-colors leading-snug h-10">
          {product.name}
        </h3>

        {/* Price & Cart button */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-red-600  font-bold text-lg leading-none mb-1">
              {formatCurrency(currentPrice)}
            </div>
            {hasSale && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="line-through">{formatCurrency(product.price)}</span>
                <span className="bg-red-100 text-red-600 px-1 rounded font-semibold">-{discount}%</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : addedEffect
                ? "bg-green-500 text-white scale-95"
                : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Promo text */}
        <div className="mt-3 bg-gray-50  rounded-lg p-2">
          <p className="text-[11px] text-gray-600  text-center line-clamp-2">
            Gói Gia đình tiêu chuẩn trải nghiệm CLIP TV 12 tháng
          </p>
        </div>
        
        {/* Fake stock bar */}
        {hasSale && (
          <div className="mt-3 relative w-full h-4 bg-red-100  rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-400 w-2/3 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
              Chỉ còn 2 sản phẩm
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
