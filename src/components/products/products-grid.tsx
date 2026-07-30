import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/product-card";

interface SearchParams {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

export async function ProductsGrid({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page ?? "1");
  const limit = 12;

  const where: any = { isActive: true };
  if (searchParams.category) where.category = { slug: searchParams.category };
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ];
  }
  if (searchParams.minPrice) {
    where.price = { ...(where.price ?? {}), gte: parseFloat(searchParams.minPrice) };
  }
  if (searchParams.maxPrice) {
    where.price = { ...(where.price ?? {}), lte: parseFloat(searchParams.maxPrice) };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="font-heading font-semibold text-lg text-gray-900  mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-500  text-sm">
          Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 ">
          Hiển thị {products.length} / {total} sản phẩm
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({
                ...Object.fromEntries(
                  Object.entries(searchParams).filter(([, v]) => v !== undefined)
                ) as Record<string, string>,
                page: String(p),
              }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-yellow-500 text-white"
                  : "bg-white  border border-gray-200  text-gray-700  hover:bg-gray-50 :bg-gray-800"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
