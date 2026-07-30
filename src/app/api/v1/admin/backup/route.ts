import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "GENERAL_DIRECTOR", "DIRECTOR"].includes(user.role)) {
      return NextResponse.json({
        success: false,
        error: "Chỉ có Super Admin và Giám Đốc mới có quyền sao lưu cơ sở dữ liệu"
      }, { status: 403 });
    }

    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const fileBuffer = readFileSync(dbPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=nks_backup_${Date.now()}.db`,
      },
    });
  } catch (error) {
    console.error("Backup Error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể đọc file cơ sở dữ liệu" },
      { status: 500 }
    );
  }
}
