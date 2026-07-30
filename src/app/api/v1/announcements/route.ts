import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET /api/v1/announcements?type=USER_POPUP|STAFF_POPUP|COMPANY_BELL
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const where: any = { isActive: true };
    if (type) {
      where.type = type;
    }

    const announcements = await (prisma as any).announcement.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    console.error("GET Announcements Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/announcements (Restricted to SUPER_ADMIN, GENERAL_DIRECTOR, DIRECTOR)
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "GENERAL_DIRECTOR", "DIRECTOR"].includes(user.role)) {
      return NextResponse.json({
        success: false,
        error: "Chỉ có Super Admin và Giám Đốc mới có quyền phát hành thông báo hệ thống"
      }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, type } = body;

    if (!title || !content || !type) {
      return NextResponse.json({ success: false, error: "Vui lòng nhập đầy đủ Tiêu đề, Nội dung và Loại thông báo" }, { status: 400 });
    }

    const validTypes = ["USER_POPUP", "STAFF_POPUP", "COMPANY_BELL"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ success: false, error: "Loại thông báo không hợp lệ" }, { status: 400 });
    }

    const announcement = await (prisma as any).announcement.create({
      data: {
        title,
        content,
        type,
        isActive: true,
        createdBy: `${user.name} (${user.role})`,
      },
    });

    return NextResponse.json({ success: true, data: announcement }, { status: 201 });
  } catch (error) {
    console.error("POST Announcement Error:", error);
    return NextResponse.json({
      success: false,
      error: "Lỗi tạo thông báo: " + (error instanceof Error ? error.message : "Internal server error")
    }, { status: 500 });
  }
}
