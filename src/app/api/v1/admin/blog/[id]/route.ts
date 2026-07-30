import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { createSlug, sanitizeBlogHtml } from "@/lib/blog";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Context) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
  const post = await prisma.blogPost.findUnique({ where: { id: (await params).id } });
  if (!post) return NextResponse.json({ success: false, error: "Không tìm thấy bài viết" }, { status: 404 });
  return NextResponse.json({ success: true, data: post });
}

export async function PUT(req: NextRequest, { params }: Context) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
  const id = (await params).id;
  const current = await prisma.blogPost.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ success: false, error: "Không tìm thấy bài viết" }, { status: 404 });

  const body = await req.json();
  const title = String(body.title || "").trim();
  const excerpt = String(body.excerpt || "").trim();
  const content = sanitizeBlogHtml(String(body.content || "").trim());
  const status = body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  if (!title || !excerpt || !content) {
    return NextResponse.json({ success: false, error: "Tiêu đề, mô tả và nội dung là bắt buộc" }, { status: 400 });
  }

  const desiredSlug = createSlug(String(body.slug || title)) || current.slug;
  const duplicate = await prisma.blogPost.findFirst({ where: { slug: desiredSlug, NOT: { id } }, select: { id: true } });
  if (duplicate) return NextResponse.json({ success: false, error: "Đường dẫn slug đã tồn tại" }, { status: 409 });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug: desiredSlug,
      excerpt,
      content,
      featuredImage: body.featuredImage || null,
      authorName: String(body.authorName || current.authorName),
      status,
      publishedAt: status === "PUBLISHED" ? current.publishedAt || new Date() : null,
    },
  });
  return NextResponse.json({ success: true, data: post });
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
  await prisma.blogPost.delete({ where: { id: (await params).id } });
  return NextResponse.json({ success: true });
}
