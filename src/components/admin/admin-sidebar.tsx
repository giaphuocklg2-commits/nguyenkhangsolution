"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Shield, BarChart3,
  Users, Key, Settings, LogOut, Zap, ChevronLeft, ChevronRight,
  ExternalLink, Tag, Megaphone, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { href: "/admin/products", label: "Sản Phẩm", icon: Package, permission: "products" },
  { href: "/admin/orders", label: "Đơn Hàng", icon: ShoppingCart, permission: "orders" },
  { href: "/admin/warranty", label: "Bảo Hành", icon: Shield, permission: "warranty" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, permission: "analytics" },
  { href: "/admin/staff", label: "Nhân Sự", icon: Users, permission: "staff" },
  { href: "/admin/coupons", label: "Mã Giảm Giá", icon: Tag, permission: "coupons" },
  { href: "/admin/announcements", label: "Thông Báo", icon: Megaphone, permission: "announcements" },
  { href: "/admin/blog", label: "Quản Trị Blog", icon: FileText, permission: "blog" },
  { href: "/admin/settings", label: "Cài Đặt", icon: Settings, permission: "settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const demoApiKey = "nks_demoApiKey123456789abcdef";

  return (
    <>
      <aside
        className={cn(
          "flex flex-col bg-[#0F172A] text-slate-100 h-full transition-all duration-300 flex-shrink-0 relative z-20 shadow-xl border-r border-slate-800/80",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/80">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-heading font-bold text-base leading-tight tracking-tight text-white">
                NKS Electric
              </p>
              <p className="text-[11px] font-medium text-slate-400">Admin Control Center</p>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shadow-md z-30"
          id="sidebar-collapse-btn"
          title={collapsed ? "Mở rộng Sidebar" : "Thu gọn Sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 py-5 overflow-y-auto space-y-1.5 px-3">
          {!collapsed && (
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Chức năng chính
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                )}
                title={collapsed ? item.label : undefined}
                id={`admin-nav-${item.permission}`}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/80 p-3 space-y-1 bg-slate-950/40">
          {/* API Key Modal Button */}
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-amber-500/10 transition-colors font-medium"
            title={collapsed ? "API Key" : undefined}
            id="get-api-key-btn"
          >
            <Key className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Lấy API Key</span>}
          </button>

          {/* API Key Display Box */}
          {showApiKey && !collapsed && (
            <div className="mx-1 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 mb-1">🔑 API Key hệ thống:</p>
              <code className="text-xs text-amber-300 break-all font-mono select-all block bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                {demoApiKey}
              </code>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => navigator.clipboard.writeText(demoApiKey)}
                  className="flex-1 py-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-medium transition-colors"
                >
                  Sao chép
                </button>
                <Link
                  href="/admin/apikeys"
                  className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors text-center"
                >
                  Quản lý
                </Link>
              </div>
            </div>
          )}

          {/* Visit public website */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title={collapsed ? "Xem website" : undefined}
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0 text-slate-400" />
            {!collapsed && <span>Xem trang chủ</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
