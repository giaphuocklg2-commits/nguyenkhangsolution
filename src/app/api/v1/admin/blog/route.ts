import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { createSlug, sanitizeBlogHtml } from "@/lib/blog";

export async function GET(req: NextRequest) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });

  const page = Math.max(1, Number(new URL(req.url).searchParams.get("page")) || 1);
  const limit = 15;
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count(),
  ]);
  return NextResponse.json({ success: true, data: posts, meta: { page, total, totalPages: Math.ceil(total / limit) } });
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });

  const body = await req.json();
  const title = String(body.title || "").trim();
  const excerpt = String(body.excerpt || "").trim();
  const content = sanitizeBlogHtml(String(body.content || "").trim());
  const status = body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  if (!title || !excerpt || !content) {
    return NextResponse.json({ success: false, error: "Tiêu đề, mô tả và nội dung là bắt buộc" }, { status: 400 });
  }

  const baseSlug = createSlug(String(body.slug || title)) || `bai-viet-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;
  while (await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      featuredImage: body.featuredImage || null,
      authorName: String(body.authorName || user.name || "NKS Electric"),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  return NextResponse.json({ success: true, data: post }, { status: 201 });
}
