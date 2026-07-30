import { NextRequest, NextResponse } from "next/server";
import { writeFile, copyFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Only SUPER_ADMIN can restore database
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({
        success: false,
        error: "Chỉ duy nhất Super Admin mới có quyền phục hồi cơ sở dữ liệu"
      }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Vui lòng chọn file backup (.db)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length < 100) {
      return NextResponse.json({ success: false, error: "File cơ sở dữ liệu không hợp lệ hoặc bị rỗng" }, { status: 400 });
    }

    // Check SQLite header signature: "SQLite format 3"
    const headerString = buffer.toString("utf8", 0, 16);
    if (!headerString.startsWith("SQLite format 3")) {
      return NextResponse.json({
        success: false,
        error: "File tải lên không phải là file cơ sở dữ liệu SQLite hợp lệ (.db)"
      }, { status: 400 });
    }

    const prismaDir = path.join(process.cwd(), "prisma");
    const dbPath = path.join(prismaDir, "dev.db");
    const autoBackupPath = path.join(prismaDir, `dev.db.auto_backup_${Date.now()}`);

    // Create an emergency backup of current DB before replacing
    try {
      await copyFile(dbPath, autoBackupPath);
    } catch {}

    // Overwrite dev.db with uploaded backup file
    await writeFile(dbPath, buffer);

    return NextResponse.json({
      success: true,
      message: "Khôi phục cơ sở dữ liệu thành công! Dữ liệu cũ đã được khôi phục nguyên vẹn.",
    });
  } catch (error) {
    console.error("Database Restore Error:", error);
    return NextResponse.json({
      success: false,
      error: "Lỗi phục hồi CSDL: " + (error instanceof Error ? error.message : "Internal server error")
    }, { status: 500 });
  }
}
