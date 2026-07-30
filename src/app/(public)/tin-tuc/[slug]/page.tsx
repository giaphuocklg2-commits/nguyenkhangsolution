import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ExternalLink } from "lucide-react";
import { getArticleBySlug } from "@/lib/gnews";
import { ShareButtons } from "@/components/blog/share-buttons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Không tìm thấy tin", robots: { index: false } };
  const url = `/tin-tuc/${slug}`;
  return {
    title: article.title, description: article.description, alternates: { canonical: url },
    openGraph: { type: "article", url, title: article.title, description: article.description || undefined, publishedTime: article.publishedAt, images: article.image ? [article.image] : undefined },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const canonical = `https://xaywebgiare.shop/tin-tuc/${slug}`;
  return (
    <main className="bg-slate-50 py-12">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-slate-500"><Link href="/">Trang chủ</Link> <span className="mx-2">/</span><Link href="/tin-tuc">Tin tức</Link></nav>
        <h1 className="text-3xl font-black leading-tight sm:text-5xl">{article.title}</h1>
        <div className="mt-6 flex flex-wrap items-center gap-4 border-y py-4 text-sm text-slate-600"><strong>{article.source.name}</strong><time dateTime={article.publishedAt} className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{new Date(article.publishedAt).toLocaleDateString("vi-VN")}</time><ShareButtons url={canonical} title={article.title} /></div>
        {article.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image} alt={article.title} className="mt-8 aspect-video w-full rounded-3xl object-cover" />
        )}
        <div className="blog-content mt-8 rounded-3xl bg-white p-6 sm:p-10"><p className="text-lg font-semibold">{article.description}</p><p>{article.content?.replace(/\s*\[\+\d+\s+chars\]\s*$/, "")}</p><a href={article.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white no-underline">Đọc đầy đủ tại nguồn <ExternalLink className="h-4 w-4" /></a></div>
      </article>
    </main>
  );
}
