import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

const categoryIcons: Record<string, string> = {
  "den-dien-dan-dung": "💡",
  "den-hang-hai": "🚢",
  "nang-luong-mat-troi": "☀️",
  inverter: "⚡",
  "pin-luu-tru": "🔋",
  "dich-vu-lap-dat": "🔧",
};

export function HomeCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-black text-gray-900 uppercase">
            Danh Mục Sản Phẩm
          </h2>
          <div className="w-16 h-1 bg-[#1D4ED8] mx-auto mt-2 rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center w-[110px] md:w-[130px]"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
                {/* 3D Pedestal Base */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-6 md:w-20 md:h-8 bg-gray-200 rounded-[100%] shadow-[0_5px_15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-shadow duration-300" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-5 md:w-16 md:h-6 bg-white rounded-[100%] border border-gray-100" />
                
                {/* Icon Container */}
                <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center border-4 border-gray-50 shadow-sm group-hover:-translate-y-2 group-hover:border-blue-100 transition-all duration-300 z-10">
                  <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                    {categoryIcons[category.slug] ?? "📦"}
                  </span>
                </div>
              </div>
              <span className="font-semibold text-[13px] md:text-sm text-gray-700 text-center leading-tight group-hover:text-[#1D4ED8] transition-colors line-clamp-2">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
