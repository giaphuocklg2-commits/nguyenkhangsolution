import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const slug = (await params).slug;
    const product = await prisma.product.findFirst({
      where: { slug: slug, isActive: true },
    });
    if (!product) return { title: "Không tìm thấy sản phẩm" };
    return {
      title: product.name,
      description: product.description ?? product.name,
    };
  } catch {
    return { title: "Sản phẩm | NKS Electric" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const slug = (await params).slug;
    const product = await prisma.product.findFirst({
      where: { slug: slug, isActive: true },
      include: { category: true },
    });

    if (!product) notFound();

    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: { not: product.id },
      },
      include: { category: true },
      take: 4,
    });

    return <ProductDetailClient product={product as any} related={related as any} />;
  } catch {
    notFound();
  }
}
