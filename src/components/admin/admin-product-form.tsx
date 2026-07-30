"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, Trash2, Plus, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";
import Link from "next/link";
import { addVat, VAT_PERCENT } from "@/lib/pricing";

export default function AdminProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!productId);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    salePrice: "",
    saleEndDate: "",
    stock: "0",
    categoryId: "",
    isFeatured: false,
    isActive: true,
    description: "",
    detail: "",
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [imgInput, setImgInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetch("/api/v1/categories")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0 && !productId) {
            setForm(f => ({ ...f, categoryId: data.data[0].id }));
          }
        }
      });

    if (productId) {
      fetch(`/api/v1/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const p = data.data;
            setForm({
              name: p.name,
              price: p.price.toString(),
              salePrice: p.salePrice ? p.salePrice.toString() : "",
              saleEndDate: p.saleEndDate ? new Date(p.saleEndDate).toISOString().slice(0, 16) : "",
              stock: p.stock.toString(),
              categoryId: p.categoryId,
              isFeatured: p.isFeatured,
              isActive: p.isActive,
              description: p.description || "",
              detail: p.detail || "",
            });
            setImages(p.images || []);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [productId]);

  async function handleFileUpload(files: FileList | File[]) {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          return data.url;
        } else {
          toast({ title: "Lỗi tải file", description: data.error || file.name, variant: "error" });
          return null;
        }
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      if (uploadedUrls.length > 0) {
        setImages(prev => [...prev, ...uploadedUrls]);
        toast({ title: `Đã tải lên ${uploadedUrls.length} hình ảnh`, variant: "success" });
      }
    } catch {
      toast({ title: "Lỗi kết nối khi tải ảnh", variant: "error" });
    } finally {
      setUploading(false);
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }

  function handleAddUrlImage() {
    if (!imgInput.trim()) return;
    setImages([...images, imgInput.trim()]);
    setImgInput("");
  }

  function handleRemoveImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast({ title: "Vui lòng điền các trường bắt buộc (*)", variant: "error" });
      return;
    }
    
    setSubmitting(true);
    try {
      const url = productId ? `/api/v1/products/${productId}` : "/api/v1/products";
      const method = productId ? "PUT" : "POST";
      
      const payload = {
        ...form,
        images,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (data.success) {
        toast({ title: "Lưu sản phẩm thành công", variant: "success" });
        router.push("/admin/products");
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch {
      toast({ title: "Lỗi kết nối", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-bold text-slate-900">
              {productId ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
            </h1>
            <p className="text-xs text-slate-500">Cập nhật thông tin, hình ảnh và phân loại sản phẩm</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Thông Tin Cơ Bản
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Gói Lắp Đặt NLMT Hộ Gia Đình 5KWp"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá niêm yết chưa VAT (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
                  />
                  {form.price && (
                    <p className="mt-1 text-[11px] text-blue-600">
                      Giá bán gồm VAT {VAT_PERCENT}%: {addVat(Number(form.price)).toLocaleString("vi-VN")} ₫
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá khuyến mãi chưa VAT (tùy chọn)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold text-red-600"
                  />
                  {form.salePrice && (
                    <p className="mt-1 text-[11px] text-red-600">
                      Giá bán gồm VAT {VAT_PERCENT}%: {addVat(Number(form.salePrice)).toLocaleString("vi-VN")} ₫
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hạn khuyến mãi
                  </label>
                  <input
                    type="datetime-local"
                    value={form.saleEndDate}
                    onChange={(e) => setForm({ ...form, saleEndDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số lượng kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả ngắn sản phẩm
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 resize-y leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thông số kỹ thuật & Chi tiết
                </label>
                <textarea
                  value={form.detail}
                  onChange={(e) => setForm({ ...form, detail: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 resize-y leading-relaxed"
                  placeholder="- Công suất: 5KWp&#10;- Bảo hành: 12 năm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Phân Loại & Trạng Thái
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Danh mục sản phẩm <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Sản phẩm Nổi bật (HOT)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Hiển thị bán trên Website</span>
                </label>
              </div>
            </div>
          </div>

          {/* Drag & Drop Image Upload Dropzone */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-blue-600" />
              Hình Ảnh Sản Phẩm
            </h2>
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFileUpload(e.target.files);
              }}
            />

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                dragActive
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-300 hover:border-blue-500 hover:bg-slate-50/80"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-blue-600 py-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-xs font-bold">Đang tải ảnh lên...</p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Kéo thả ảnh vào đây hoặc bấm tải lên</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Hỗ trợ JPG, PNG, WEBP</p>
                  </div>
                </>
              )}
            </div>

            {/* Fallback URL Input */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <LinkIcon className="h-3 w-3" /> Hoặc thêm bằng link URL:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imgInput}
                  onChange={(e) => setImgInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrlImage();
                    }
                  }}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-xs font-bold"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 bg-slate-900/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lưu Sản Phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
