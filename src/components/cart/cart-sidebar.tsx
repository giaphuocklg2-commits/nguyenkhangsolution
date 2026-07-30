"use client";

import { useCartStore } from "@/store/cart.store";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { addVat, VAT_PERCENT } from "@/lib/pricing";

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white  shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        id="cart-sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 ">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-yellow-600" />
            <h2 className="font-heading font-semibold text-lg text-gray-900 ">
              Giỏ Hàng
            </h2>
            {getTotalItems() > 0 && (
              <span className="px-2 py-0.5 bg-yellow-100  text-yellow-800  text-xs font-medium rounded-full">
                {getTotalItems()} sản phẩm
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            id="close-cart-btn"
            className="p-2 hover:bg-gray-100 :bg-gray-800 rounded-lg transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-20 h-20 bg-gray-100  rounded-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900  mb-1">
                  Giỏ hàng trống
                </p>
                <p className="text-sm text-gray-500 ">
                  Hãy thêm sản phẩm vào giỏ hàng
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium text-sm transition-colors"
                id="shop-now-btn"
              >
                Mua Sắm Ngay
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 p-3 bg-gray-50  rounded-xl"
              >
                {/* Image */}
                <div className="w-16 h-16 bg-white  rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-medium text-gray-900  hover:text-yellow-600 :text-yellow-400 line-clamp-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-yellow-600  font-semibold text-sm mt-1">
                    {formatCurrency(addVat(item.salePrice ?? item.price))}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200  rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="p-1.5 hover:bg-gray-200 :bg-gray-700 transition-colors"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-medium text-gray-900  min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-gray-200 :bg-gray-700 transition-colors"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 :bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-200  space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600  font-medium">
                Tổng cộng ({getTotalItems()} sp)
              </span>
              <span className="text-xl font-bold text-yellow-600 ">
                {formatCurrency(getTotalPrice())}
              </span>
            </div>
            <p className="text-xs text-gray-500  text-center">
              Giá sản phẩm đã bao gồm VAT {VAT_PERCENT}%
            </p>
            <p className="text-xs text-gray-500  text-center">
              * Giá chưa bao gồm phí vận chuyển. Seller sẽ liên hệ xác nhận.
            </p>
            <Link
              href="/cart"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-yellow-500/30"
              id="checkout-btn"
            >
              Tiến Hành Đặt Hàng
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={closeCart}
              className="w-full py-2.5 border border-gray-200  rounded-xl text-sm font-medium text-gray-700  hover:bg-gray-50 :bg-gray-800 transition-colors"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
}
