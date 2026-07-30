import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BLOG_PAGE_SIZE } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Kiến thức điện & năng lượng",
  description: "Kiến thức chuyên sâu về điện dân dụng, điện mặt trời, inverter và pin lưu trữ từ NKS Electric.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    locale: "vi_VN",
    siteName: "NKS Electric",
    title: "Kiến thức điện & năng lượng | NKS Electric",
    description: "Cẩm nang và bài viết chuyên sâu về điện và năng lượng.",
  },
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const requestedPage = Number((await searchParams).page);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const where = { status: "PUBLISHED", publishedAt: { lte: new Date() } };
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * BLOG_PAGE_SIZE,
      take: BLOG_PAGE_SIZE,
    }),
    prisma.blogPost.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#071a3d] px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[.18em] text-amber-400">
            <Newspaper className="h-5 w-5" /> NKS Knowledge
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Kiến thức điện và năng lượng
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/80">
            Cẩm nang thực tế giúp bạn lựa chọn, sử dụng và tối ưu hệ thống điện an toàn, hiệu quả.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {posts.length ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <Link href={`/blog/${post.slug}`} className="flex w-full flex-col">
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-900 to-amber-500">
                    {post.featuredImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.featuredImage} alt={post.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <time dateTime={post.publishedAt?.toISOString()} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <CalendarDays className="h-4 w-4 text-blue-600" />
                      {post.publishedAt?.toLocaleDateString("vi-VN")}
                    </time>
                    <h2 className="mt-3 line-clamp-2 text-xl font-black leading-snug group-hover:text-blue-700">{post.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                    <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-blue-700">
                      Đọc bài viết <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center">
            <Newspaper className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-4 text-2xl font-black">Chưa có bài viết được xuất bản</h2>
            <p className="mt-2 text-slate-500">Các bài viết mới sẽ sớm xuất hiện tại đây.</p>
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Phân trang bài viết" className="mt-12 flex items-center justify-center gap-2">
            <Link aria-disabled={page === 1} href={`/blog?page=${Math.max(1, page - 1)}`} className={`rounded-xl border p-3 ${page === 1 ? "pointer-events-none opacity-40" : "bg-white hover:border-blue-500"}`}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
              <Link key={item} href={`/blog?page=${item}`} aria-current={item === page ? "page" : undefined} className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold ${item === page ? "bg-blue-700 text-white" : "border bg-white hover:border-blue-500"}`}>
                {item}
              </Link>
            ))}
            <Link aria-disabled={page === totalPages} href={`/blog?page=${Math.min(totalPages, page + 1)}`} className={`rounded-xl border p-3 ${page === totalPages ? "pointer-events-none opacity-40" : "bg-white hover:border-blue-500"}`}>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </nav>
        )}
      </main>
    </div>
  );
}
