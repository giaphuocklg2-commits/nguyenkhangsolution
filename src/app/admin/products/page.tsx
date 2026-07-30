"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit, Trash2, Eye, Package, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
  createdAt: string;
  images: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/products?limit=50${search ? `&search=${encodeURIComponent(search)}` : ""}`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {
      toast({ title: "Lỗi tải dữ liệu", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;
    try {
      const res = await fetch(`/api/v1/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Đã xóa sản phẩm thành công", variant: "success" });
        fetchProducts();
      }
    } catch {
      toast({ title: "Lỗi xóa sản phẩm", variant: "error" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-slate-900">
                Quản Lý Sản Phẩm
              </h1>
              <p className="text-xs text-slate-500">
                Tổng số {products.length} sản phẩm trên toàn hệ thống
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all active:scale-95"
          id="add-product-btn"
        >
          <Plus className="h-4 w-4" />
          Thêm Sản Phẩm Mới
        </Link>
      </div>

      {/* Search & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              placeholder="Tìm kiếm sản phẩm theo tên..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              id="admin-product-search"
            />
          </div>
          <button
            onClick={fetchProducts}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            aria-label="Refresh"
            id="refresh-products-btn"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Enterprise Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Sản Phẩm
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Danh Mục
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Đơn Giá
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center hidden sm:table-cell">
                  Tồn Kho
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center hidden lg:table-cell">
                  Trạng Thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">Không tìm thấy sản phẩm nào phù hợp</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const images = (() => {
                    try { return JSON.parse(product.images); } catch { return []; }
                  })();

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/60">
                            {images[0] ? (
                              <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[240px]">
                              {product.name}
                            </p>
                            {product.isFeatured && (
                              <span className="inline-block mt-0.5 text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                                ★ HOT DEAL
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          {product.category?.name ?? "Chưa phân loại"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {formatCurrency(product.salePrice ?? product.price)}
                          </p>
                          {product.salePrice && (
                            <p className="text-xs text-slate-400 line-through">
                              {formatCurrency(product.price)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center hidden sm:table-cell whitespace-nowrap">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          product.stock === 0 ? "bg-red-50 text-red-700 border-red-200/60" :
                          product.stock < 10 ? "bg-amber-50 text-amber-700 border-amber-200/60" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}>
                          {product.stock} SP
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center hidden lg:table-cell whitespace-nowrap">
                        {product.isActive ? (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                            Đang bán
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            Ẩn sản phẩm
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Xem chi tiết trên web"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
