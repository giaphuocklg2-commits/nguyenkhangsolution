"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export function ProductsFilter({
  categories,
  currentCategory,
  currentSearch,
  currentMinPrice,
  currentMaxPrice,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch ?? "");
  const [minPrice, setMinPrice] = useState(currentMinPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice ?? "");

  const updateFilter = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      if (currentCategory) params.set("category", currentCategory);
      if (search) params.set("search", search);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, currentCategory, search, minPrice, maxPrice]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search });
  };

  const clearAll = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  const hasFilters = currentCategory || currentSearch || currentMinPrice || currentMaxPrice;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="bg-white  rounded-2xl border border-gray-200  p-4">
        <h3 className="font-semibold text-gray-900  mb-3 flex items-center gap-2">
          <Search className="h-4 w-4 text-yellow-600" />
          Tìm Kiếm
        </h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tên sản phẩm..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            id="products-search"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="bg-white  rounded-2xl border border-gray-200  p-4">
        <h3 className="font-semibold text-gray-900  mb-3 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-yellow-600" />
          Danh Mục
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter({ category: undefined })}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
              !currentCategory
                ? "bg-yellow-50  text-yellow-700  font-medium"
                : "text-gray-600  hover:bg-gray-50 :bg-gray-800"
            }`}
          >
            Tất cả sản phẩm
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter({ category: cat.slug })}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                currentCategory === cat.slug
                  ? "bg-yellow-50  text-yellow-700  font-medium"
                  : "text-gray-600  hover:bg-gray-50 :bg-gray-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white  rounded-2xl border border-gray-200  p-4">
        <h3 className="font-semibold text-gray-900  mb-3">
          Khoảng Giá
        </h3>
        <div className="space-y-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Giá từ (VND)"
            className="w-full px-3 py-2 text-sm border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500"
            id="min-price-input"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Giá đến (VND)"
            className="w-full px-3 py-2 text-sm border border-gray-200  rounded-xl bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-yellow-500"
            id="max-price-input"
          />
          <button
            onClick={() => updateFilter({ minPrice, maxPrice })}
            className="w-full py-2 bg-gray-900  text-white  rounded-xl text-sm font-medium hover:bg-gray-700 :bg-gray-100 transition-colors"
          >
            Áp dụng
          </button>
        </div>

        {/* Quick price filters */}
        <div className="mt-3 space-y-1">
          {[
            { label: "Dưới 500.000đ", min: "", max: "500000" },
            { label: "500K - 2 triệu", min: "500000", max: "2000000" },
            { label: "2 - 10 triệu", min: "2000000", max: "10000000" },
            { label: "Trên 10 triệu", min: "10000000", max: "" },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setMinPrice(range.min);
                setMaxPrice(range.max);
                updateFilter({ minPrice: range.min, maxPrice: range.max });
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-500  hover:text-yellow-600 :text-yellow-400 hover:bg-yellow-50 :bg-yellow-900/20 rounded-lg transition-colors"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200  text-red-600  rounded-xl text-sm font-medium hover:bg-red-50 :bg-red-900/20 transition-colors"
          id="clear-filters-btn"
        >
          <X className="h-4 w-4" />
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
