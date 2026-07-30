import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductsGrid } from "@/components/products/products-grid";
import { ProductsFilter } from "@/components/products/products-filter";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sản Phẩm",
  description: "Danh mục đèn điện, năng lượng mặt trời, inverter, pin lưu trữ",
};

async function getCategories() {
  try {
    return await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
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
  }>;
}) {
  const resolvedParams = await searchParams;
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
          Danh Mục Sản Phẩm
        </h1>
        <p className="text-gray-500 mt-1">
          Đèn điện, NLMT, Inverter, Pin lưu trữ và Dịch vụ lắp đặt
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-64 flex-shrink-0">
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
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
