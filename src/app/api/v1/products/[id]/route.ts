import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// GET /api/v1/products/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: (await params).id }, { slug: (await params).id }],
        isActive: true,
      },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: (() => {
          try { return JSON.parse(product.images); } catch { return []; }
        })(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/v1/products/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { name, description, detail, price, salePrice, saleEndDate, images, stock, categoryId, isFeatured, isActive } = body;

    const existing = await prisma.product.findUnique({ where: { id: (await params).id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id: (await params).id },
      data: {
        ...(name && { name, slug: `${slugify(name)}-${(await params).id.slice(-6)}` }),
        ...(description !== undefined && { description }),
        ...(detail !== undefined && { detail }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(salePrice !== undefined && { salePrice: salePrice ? parseFloat(salePrice) : null }),
        ...(saleEndDate !== undefined && { saleEndDate: saleEndDate ? new Date(saleEndDate) : null }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryId && { categoryId }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isActive !== undefined && { isActive }),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/products/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.product.update({
      where: { id: (await params).id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
