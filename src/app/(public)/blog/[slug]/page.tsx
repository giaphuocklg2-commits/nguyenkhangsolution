import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import { getPublishedPost } from "@/lib/blog";
import { ShareButtons } from "@/components/blog/share-buttons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return { title: "Không tìm thấy bài viết", robots: { index: false } };
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    authors: [{ name: post.authorName }],
    openGraph: {
      type: "article", url, title: post.title, description: post.excerpt,
      publishedTime: post.publishedAt?.toISOString(), modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorName], images: post.featuredImage ? [{ url: post.featuredImage, alt: post.title }] : undefined,
      locale: "vi_VN", siteName: "NKS Electric",
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: post.featuredImage ? [post.featuredImage] : undefined },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const canonical = `https://xaywebgiare.shop/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org", "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: post.title, description: post.excerpt,
    image: post.featuredImage ? [new URL(post.featuredImage, "https://xaywebgiare.shop").toString()] : undefined,
    datePublished: post.publishedAt?.toISOString(), dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: "NKS Electric", url: "https://xaywebgiare.shop" },
    inLanguage: "vi-VN",
  };

  return (
    <main className="bg-slate-50 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
          <Link href="/">Trang chủ</Link> <span className="mx-2">/</span>
          <Link href="/blog">Blog</Link>
        </nav>
        <header>
          <h1 className="text-3xl font-black leading-tight text-slate-950 sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5 border-y border-slate-200 py-4 text-sm text-slate-600">
            <span className="flex items-center gap-2"><UserRound className="h-4 w-4" />{post.authorName}</span>
            <time dateTime={post.publishedAt?.toISOString()} className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{post.publishedAt?.toLocaleDateString("vi-VN")}</time>
            <ShareButtons url={canonical} title={post.title} />
          </div>
        </header>
        {post.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.featuredImage} alt={post.title} fetchPriority="high" className="mt-8 aspect-video w-full rounded-3xl object-cover shadow-lg" />
        )}
        <div className="blog-content mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-10" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}
