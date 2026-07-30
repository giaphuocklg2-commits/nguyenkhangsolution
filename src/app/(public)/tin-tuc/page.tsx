import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper, Radio } from "lucide-react";
import { articleSlug, getLatestNews } from "@/lib/gnews";

export const metadata: Metadata = {
  title: "Tin tức năng lượng mới nhất",
  description: "Cập nhật tự động những tin tức mới nhất về điện, năng lượng mặt trời, pin lưu trữ và lưới điện.",
  alternates: { canonical: "/tin-tuc" },
  openGraph: {
    type: "website", url: "/tin-tuc", locale: "vi_VN", siteName: "NKS Electric",
    title: "Tin tức năng lượng mới nhất | NKS Electric",
    description: "Tin mới về điện, năng lượng mặt trời và công nghệ lưu trữ.",
  },
};

export default async function NewsPage() {
  const articles = await getLatestNews();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#071a3d] px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[.18em] text-amber-400"><Radio className="h-5 w-5" /> Cập nhật mỗi giờ</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">Tin tức điện và năng lượng mới nhất</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/80">Theo dõi chuyển động mới của ngành điện, năng lượng tái tạo và công nghệ lưu trữ trên thế giới.</p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {articles.length ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.url} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <Link href={`/tin-tuc/${articleSlug(article.title)}`} className="flex h-full flex-col">
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-900 to-amber-500">
                    {article.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.image} alt={article.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <time dateTime={article.publishedAt} className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarDays className="h-4 w-4 text-blue-600" />{new Date(article.publishedAt).toLocaleDateString("vi-VN")} · {article.source.name}</time>
                    <h2 className="mt-3 line-clamp-3 text-xl font-black leading-snug group-hover:text-blue-700">{article.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.description || "Xem nội dung mới nhất từ nguồn tin."}</p>
                    <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-blue-700">Đọc tin <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border bg-white py-20 text-center"><Newspaper className="mx-auto h-12 w-12 text-blue-600" /><h2 className="mt-4 text-2xl font-black">Bản tin đang được đồng bộ</h2><p className="mt-2 text-slate-500">Vui lòng quay lại sau ít phút.</p></div>
        )}
      </main>
    </div>
  );
}
