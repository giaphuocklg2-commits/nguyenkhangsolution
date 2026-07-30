"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  X,
  Zap,
  Search,
  Phone,
  User,
  List,
  ChevronDown
} from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";
import { CartSidebar } from "@/components/cart/cart-sidebar";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Tất cả sản phẩm" },
  { href: "/products?sale=true", label: "⚡ Flash Sales" },
  { href: "/warranty", label: "Chính sách bảo hành" },
  { href: "/order/track", label: "Tra cứu đơn hàng" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { getTotalItems, openCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
    fetch("/api/v1/categories")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
      })
      .catch(() => {});
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery, router]);

  return (
    <>
      <header className="w-full bg-white shadow-sm z-40 relative border-b border-gray-100">
        {/* Top Header - White Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-[#1D4ED8] rounded-lg flex items-center justify-center shadow-md">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-2xl leading-none tracking-tight text-[#1D4ED8]">
                NKS
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Electric
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="w-full flex border-2 border-[#1D4ED8] rounded-lg overflow-hidden">
              <div className="hidden lg:flex items-center gap-1 bg-gray-50 px-3 border-r border-gray-200 text-sm text-gray-600 font-medium">
                Tất cả danh mục <ChevronDown className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Hôm nay bạn cần tìm gì?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-none focus:outline-none text-sm text-gray-900"
              />
              <button 
                type="submit"
                className="bg-[#1D4ED8] hover:bg-blue-800 text-white px-6 transition-colors flex items-center justify-center"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            
            {/* LIVE Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full border border-red-100">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-600">LIVE</span>
            </div>

            {/* Account */}
            <Link href="/admin" className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="hidden lg:block text-sm">
                <p className="text-gray-500 text-[11px] leading-none mb-1">Tài khoản</p>
                <p className="font-bold text-gray-900 leading-none">Đăng nhập</p>
              </div>
            </Link>

            {/* Cart */}
            <button
              onClick={() => openCart()}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity relative group"
            >
              <div className="relative w-9 h-9 flex items-center justify-center bg-[#EF4444] rounded-lg shadow-sm">
                <ShoppingCart className="h-5 w-5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#F59E0B] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-bold text-gray-900">
                Giỏ hàng
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Bar - Royal Blue */}
        <div className="hidden md:block bg-[#1D4ED8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-[52px]">
            
            {/* Danh mục dropdown */}
            <div 
              className="relative h-full"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="flex items-center gap-3 bg-blue-900/40 h-full px-5 cursor-pointer hover:bg-blue-800 transition-colors mr-6 border-l border-r border-blue-700/50">
                <List className="h-5 w-5" />
                <span className="font-bold text-sm uppercase">Danh mục sản phẩm</span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </div>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 z-50 animate-fade-in text-gray-800 rounded-b-xl overflow-hidden">
                  <div className="flex flex-col py-2">
                    {categories.length > 0 ? categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className="px-5 py-3 hover:bg-blue-50 hover:text-[#1D4ED8] transition-colors text-sm font-semibold border-b border-gray-50 last:border-0 flex items-center justify-between"
                      >
                        {cat.name}
                      </Link>
                    )) : (
                      <div className="px-5 py-3 text-sm text-gray-500">Đang tải...</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Nav Links */}
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold hover:text-[#F59E0B] transition-colors flex items-center gap-1.5",
                    pathname === link.href ? "text-[#F59E0B]" : "text-white"
                  )}
                >
                  {link.label === "⚡ Flash Sales" ? (
                    <span className="flex items-center gap-1 bg-[#F59E0B] text-white px-2 py-0.5 rounded text-xs">
                      <Zap className="h-3 w-3 fill-white" /> Flash Sales
                    </span>
                  ) : link.label}
                </Link>
              ))}
            </nav>

            {/* Hotline */}
            <div className="ml-auto flex items-center gap-2 h-full">
              <div className="flex items-center gap-2 bg-[#EF4444] px-4 py-1.5 rounded-full shadow-sm text-sm font-bold animate-pulse-slow">
                <Phone className="h-4 w-4" />
                Hotline: 0567810709
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="flex border-2 border-[#1D4ED8] rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Hôm nay bạn cần tìm gì?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white border-none focus:outline-none text-sm"
            />
            <button type="submit" className="bg-[#1D4ED8] text-white px-4">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl z-50 animate-slide-down">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-4 border-b border-gray-50 text-sm font-bold text-gray-800 flex items-center gap-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="px-6 py-4 text-sm font-bold text-blue-600"
              >
                Đăng nhập Admin
              </Link>
            </nav>
          </div>
        )}
      </header>

      <CartSidebar />
    </>
  );
};

export default Header;
