import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { removeVat } from "@/lib/pricing";

// GET /api/v1/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const sale = searchParams.get("sale");
    const sort = searchParams.get("sort") ?? "default";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "12"), 50);
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (minPrice) where.price = { ...(where.price ?? {}), gte: removeVat(parseFloat(minPrice)) };
    if (maxPrice) where.price = { ...(where.price ?? {}), lte: removeVat(parseFloat(maxPrice)) };
    if (featured === "true") where.isFeatured = true;
    if (sale === "true") where.salePrice = { not: null };

    let orderBy: any = [{ isFeatured: "desc" }, { createdAt: "desc" }];
    if (sort === "price_asc") orderBy = [{ price: "asc" }];
    else if (sort === "price_desc") orderBy = [{ price: "desc" }];
    else if (sort === "newest") orderBy = [{ createdAt: "desc" }];
    else if (sort === "name") orderBy = [{ name: "asc" }];

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const parsed = products.map((p) => ({
      ...p,
      images: (() => {
        try { return JSON.parse(p.images); } catch { return []; }
      })(),
    }));

    return NextResponse.json({
      success: true,
      data: parsed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/products — Admin only
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, description, detail, price, salePrice, saleEndDate,
      images, stock, categoryId, isFeatured
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const slug = slugify(name);
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`,
        description,
        detail,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        saleEndDate: saleEndDate ? new Date(saleEndDate) : null,
        images: JSON.stringify(images ?? []),
        stock: parseInt(stock ?? "0"),
        categoryId,
        isFeatured: isFeatured ?? false,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
