import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/v1/warranty/:id — Update warranty status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { status, response } = body;
    const validStatuses = ["PENDING", "PROCESSING", "RESOLVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Trạng thái không hợp lệ" }, { status: 400 });
    }
    const warranty = await prisma.warrantyRequest.update({
      where: { id: (await params).id },
      data: { status, ...(response !== undefined && { response }) },
    });
    return NextResponse.json({ success: true, data: warranty });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/v1/warranty/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const warranty = await prisma.warrantyRequest.findUnique({
      where: { id: (await params).id },
      include: { order: true },
    });
    if (!warranty) {
      return NextResponse.json({ success: false, error: "Không tìm thấy" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: {
        ...warranty,
        images: (() => { try { return JSON.parse(warranty.images); } catch { return []; } })(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
