import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/utils";

// GET /api/v1/apikeys
export async function GET(req: NextRequest) {
  try {
    const keys = await prisma.apiKey.findMany({
      where: { isActive: true },
      include: { staff: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      success: true,
      data: keys.map((k) => ({
        ...k,
        key: `${k.key.slice(0, 12)}...${k.key.slice(-6)}`, // Mask key
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/apikeys — Generate new API key
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, staffId, permissions } = body;

    if (!name || !staffId) {
      return NextResponse.json({ success: false, error: "Thiếu thông tin" }, { status: 400 });
    }

    const key = generateApiKey();
    const apiKey = await prisma.apiKey.create({
      data: {
        key,
        name,
        staffId,
        permissions: JSON.stringify(permissions ?? ["read"]),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { ...apiKey, key }, // Return full key only on creation
        message: "API Key được tạo thành công. Lưu lại key này vì sẽ không hiển thị lại.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/apikeys/:id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Thiếu ID" }, { status: 400 });

    await prisma.apiKey.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: "Đã thu hồi API key" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
