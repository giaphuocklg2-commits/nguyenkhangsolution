import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/v1/categories
export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/categories
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, image } = body;
    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Thiếu thông tin" }, { status: 400 });
    }
    const category = await prisma.category.create({
      data: { name, slug, description, image },
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
