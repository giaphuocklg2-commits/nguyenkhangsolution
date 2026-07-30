"use client";

import { useState, useRef } from "react";
import { Settings, Download, Upload, ShieldAlert, Database, RefreshCw, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    window.open("/api/v1/admin/backup", "_blank");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith(".db") && !file.name.endsWith(".sqlite")) {
        toast({ title: "File không hợp lệ", description: "Vui lòng chọn file có định dạng .db hoặc .sqlite", variant: "error" });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRestoreDatabase = async () => {
    if (!selectedFile) return;

    if (!confirm(`⚠️ CẢNH BÁO QUAN TRỌNG!\n\nBạn đang chuẩn bị thay thế toàn bộ Cơ sở dữ liệu hiện tại bằng file "${selectedFile.name}".\n\nDữ liệu cũ sẽ bị đè hoàn toàn. Bạn có chắc chắn muốn thực hiện?`)) {
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/v1/admin/restore", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Khôi phục thành công", description: data.message, variant: "success" });
        setSelectedFile(null);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({ title: "Lỗi khôi phục", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-slate-900">
            Cài Đặt & Quản Trị Hệ Thống
          </h1>
          <p className="text-xs text-slate-500">
            Sao lưu, khôi phục cơ sở dữ liệu và quản lý tham số cấu hình ERP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Backup Database */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Sao Lưu Cơ Sở Dữ Liệu
                </h3>
                <p className="text-xs text-slate-500">Xuất file dữ liệu SQLite (.db) lưu về máy</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              Tải file cơ sở dữ liệu dự phòng về máy cá nhân. File này chứa đầy đủ thông tin đơn hàng, tài khoản nhân sự, sản phẩm và cấu hình hệ thống.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            Tải File Sao Lưu (.db) Ngay
          </button>
        </div>

        {/* Card 2: Restore / Replace Database (Superadmin only) */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="h-1.5 bg-amber-500 absolute top-0 left-0 right-0" />
          
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
                  DÀNH CHO SUPER ADMIN
                </span>
                <h3 className="font-heading font-bold text-slate-900 text-base mt-0.5">
                  Phục Hồi / Thay Thế Cơ Sở Dữ Liệu
                </h3>
              </div>
            </div>

            <p className="text-xs text-amber-800 leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Tải file `.db` sao lưu để thay thế Database bị lỗi/hỏng. Hệ thống sẽ tự tạo 1 bản tự sao lưu dự phòng trước khi thay thế.
              </span>
            </p>

            {/* File Picker */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".db,.sqlite"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer hover:bg-amber-50/30 transition-all space-y-1"
            >
              <Database className="h-6 w-6 text-slate-400 mx-auto" />
              {selectedFile ? (
                <p className="text-xs font-bold text-amber-700 truncate">
                  📄 Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              ) : (
                <p className="text-xs font-semibold text-slate-700">
                  Nhấn để chọn file backup (.db) thay thế CSDL
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleRestoreDatabase}
            disabled={!selectedFile || uploading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-95"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang Phục Hồi Dữ Liệu...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Xác Nhận Thay Thế Cơ Sở Dữ Liệu
              </>
            )}
          </button>
        </div>
      </div>

      {/* System Diagnostics Info */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-600" />
          Thông Tin Kỹ Thuật Hệ Thống (System Status)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-400 text-[11px] block">Cơ sở dữ liệu Engine</span>
            <span className="font-bold text-slate-900 text-sm block">SQLite 3 (Prisma ORM)</span>
            <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Hoạt động bình thường
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-400 text-[11px] block">Đường dẫn File Database</span>
            <span className="font-mono text-slate-800 text-xs block truncate">prisma/dev.db</span>
            <span className="text-slate-500 text-[11px]">Tự động đồng bộ hóa</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-400 text-[11px] block">Phiên bản Framework</span>
            <span className="font-bold text-slate-900 text-sm block">Next.js 16 (Turbopack)</span>
            <span className="text-slate-500 text-[11px]">React 19 Server Components</span>
          </div>
        </div>
      </div>
    </div>
  );
}
