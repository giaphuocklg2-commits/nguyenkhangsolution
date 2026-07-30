"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, X } from "lucide-react";

export function StaffPopupModal() {
  const [announcement, setAnnouncement] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/v1/announcements?type=STAFF_POPUP")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const latest = data.data[0];
          const dismissedId = sessionStorage.getItem("dismissed_staff_popup");
          if (dismissedId !== latest.id) {
            setAnnouncement(latest);
            setIsOpen(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleClose = () => {
    if (announcement) {
      sessionStorage.setItem("dismissed_staff_popup", announcement.id);
    }
    setIsOpen(false);
  };

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative overflow-hidden space-y-4">
        {/* Top Amber Accent Line */}
        <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500 absolute top-0 left-0 right-0" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200/60">
                THÔNG BÁO NỘI BỘ NHÂN VIÊN
              </span>
              <h3 className="font-heading font-bold text-slate-900 text-lg leading-snug mt-0.5">
                {announcement.title}
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60 max-h-60 overflow-y-auto">
          {announcement.content}
        </div>

        {/* Metadata & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-[11px] font-medium text-slate-400">
            Người phát hành: {announcement.createdBy ?? "Ban Giám Đốc"}
          </p>
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-95"
          >
            Đã đọc & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
