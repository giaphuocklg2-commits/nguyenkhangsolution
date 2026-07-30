import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductsGrid } from "@/components/products/products-grid";
import { ProductsFilter } from "@/components/products/products-filter";
import type { Metadata } from "next";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm | NKS Electric",
  description: "Khám phá đầy đủ danh mục đèn điện dân dụng, đèn hàng hải, năng lượng mặt trời, inverter và pin lưu trữ chính hãng tại NKS Electric.",
  keywords: ["đèn LED", "đèn hàng hải", "inverter", "pin lưu trữ", "năng lượng mặt trời"],
};

async function getCategories() {
  try {
    return await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    sale?: string;
    featured?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const categories = await getCategories();

  return (
    <div className="bg-[#F0F4FA] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-black text-slate-900">
                {resolvedParams.search
                  ? `Kết quả tìm kiếm: "${resolvedParams.search}"`
                  : resolvedParams.category
                  ? "Danh Mục Sản Phẩm"
                  : "Tất Cả Sản Phẩm"}
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Đèn điện · NLMT · Inverter · Pin lưu trữ · Dịch vụ lắp đặt
              </p>
            </div>
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <a
                href="/products"
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 border transition-all ${
                  !resolvedParams.category
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                Tất cả
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 border transition-all ${
                    resolvedParams.category === cat.slug
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {cat.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <ProductsFilter
              categories={categories}
              currentCategory={resolvedParams.category}
              currentSearch={resolvedParams.search}
              currentMinPrice={resolvedParams.minPrice}
              currentMaxPrice={resolvedParams.maxPrice}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<ProductsGridSkeleton />}>
              <ProductsGrid searchParams={resolvedParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div>
      <div className="h-8 bg-white rounded-xl border border-slate-200 w-48 mb-4 shimmer" />
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
            <div className="aspect-square shimmer" />
            <div className="p-4 space-y-2.5">
              <div className="h-3 shimmer rounded w-1/3" />
              <div className="h-4 shimmer rounded w-full" />
              <div className="h-4 shimmer rounded w-2/3" />
              <div className="h-5 shimmer rounded w-1/2 mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
