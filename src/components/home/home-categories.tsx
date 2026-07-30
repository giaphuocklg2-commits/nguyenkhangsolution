"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

export interface HomeCategoriesProps {
  categories: Category[];
}

const categoryIcons: Record<string, string> = {
  "den-dien-dan-dung": "💡",
  "den-hang-hai": "🚢",
  "nang-luong-mat-troi": "☀️",
  "inverter": "⚡",
  "pin-luu-tru": "🔋",
  "dich-vu-lap-dat": "🔧",
};

const categoryColors: Record<string, { from: string; to: string; shadow: string }> = {
  "den-dien-dan-dung": { from: "from-yellow-400", to: "to-orange-500", shadow: "shadow-orange-200" },
  "den-hang-hai":      { from: "from-blue-500", to: "to-cyan-600", shadow: "shadow-blue-200" },
  "nang-luong-mat-troi": { from: "from-amber-400", to: "to-yellow-600", shadow: "shadow-yellow-200" },
  "inverter":          { from: "from-violet-500", to: "to-purple-700", shadow: "shadow-purple-200" },
  "pin-luu-tru":       { from: "from-green-400", to: "to-emerald-600", shadow: "shadow-green-200" },
  "dich-vu-lap-dat":   { from: "from-slate-500", to: "to-blue-700", shadow: "shadow-slate-200" },
};

export const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-blue-700" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Danh Mục</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Sản Phẩm <span className="gradient-text-blue">Nổi Bật</span>
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
        >
          Xem tất cả
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat, index) => {
          const icon = categoryIcons[cat.slug] || "📦";
          const color = categoryColors[cat.slug] || { from: "from-blue-500", to: "to-blue-700", shadow: "shadow-blue-200" };

          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-4 border border-slate-200/70 hover:border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Icon circle */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center text-2xl shadow-lg ${color.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {icon}
              </div>
              {/* Name */}
              <span className="text-xs font-bold text-slate-700 text-center leading-snug group-hover:text-blue-700 transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Mobile "View All" */}
      <div className="mt-4 text-center sm:hidden">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          Xem tất cả danh mục <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default HomeCategories;
