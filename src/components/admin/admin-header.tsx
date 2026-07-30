"use client";

import { Bell, ExternalLink, Download, LogOut, ChevronDown, Megaphone, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";
import { formatDate } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Quản Lý Sản Phẩm",
  "/admin/products/new": "Thêm Sản Phẩm Mới",
  "/admin/orders": "Quản Lý Đơn Hàng",
  "/admin/warranty": "Quản Lý Bảo Hành",
  "/admin/analytics": "Analytics & Thống Kê",
  "/admin/staff": "Quản Lý Nhân Sự",
  "/admin/coupons": "Mã Giảm Giá",
  "/admin/announcements": "Quản Lý Thông Báo",
  "/admin/apikeys": "API Keys",
  "/admin/settings": "Cài Đặt",
};

export function AdminHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [unread, setUnread] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/v1/announcements?type=COMPANY_BELL")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAnnouncements(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/staff/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      toast({ title: "Lỗi đăng xuất", variant: "error" });
    }
  };

  const handleBackup = () => {
    window.open("/api/v1/admin/backup", "_blank");
  };

  const title = breadcrumbMap[pathname] ?? "Admin Panel";

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
      {/* Breadcrumb Navigation */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Admin</span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">{title}</span>
        </div>
        <h1 className="font-heading font-bold text-lg text-slate-900 leading-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 font-medium border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          id="view-site-btn"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Xem trang web
        </Link>

        {/* Company Announcements Bell Icon Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
              setUnread(false);
            }}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Thông báo"
            id="admin-notifications-btn"
          >
            <Bell className="h-4 w-4" />
            {unread && announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50 animate-fade-in p-2">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-1">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Thông Báo Công Ty</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {announcements.length} thông báo
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {announcements.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-medium">
                    Chưa có thông báo công ty nào
                  </div>
                ) : (
                  announcements.map((item) => (
                    <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <span className="text-[10px] text-slate-400">{formatDate(item.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.content}</p>
                      <p className="text-[10px] font-medium text-slate-400">Người đăng: {item.createdBy ?? "Ban Giám Đốc"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/60 shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              A
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden md:block">Quản trị viên</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50 animate-fade-in p-1.5">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">Admin Account</p>
                <p className="text-[11px] text-slate-500">NKS Electric ERP</p>
              </div>
              <button
                onClick={handleBackup}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Download className="h-4 w-4 text-slate-400" />
                Sao lưu cơ sở dữ liệu
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                Đăng xuất hệ thống
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
