import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// PUT /api/v1/announcements/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "GENERAL_DIRECTOR", "DIRECTOR"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Bạn không có quyền chỉnh sửa thông báo" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, isActive, type } = body;

    const updated = await (prisma as any).announcement.update({
      where: { id },
      data: {
        title: title || undefined,
        content: content || undefined,
        type: type || undefined,
        isActive: typeof isActive === "boolean" ? isActive : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT Announcement Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/announcements/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "GENERAL_DIRECTOR", "DIRECTOR"].includes(user.role)) {
      return NextResponse.json({ success: false, error: "Bạn không có quyền xóa thông báo" }, { status: 403 });
    }

    const { id } = await params;
    await (prisma as any).announcement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa thông báo" });
  } catch (error) {
    console.error("DELETE Announcement Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
