import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Multipart Form Data Upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: "Không tìm thấy file tải lên" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const sanitizeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${Date.now()}-${sanitizeName}`;
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
      });
    }

    // JSON Base64 Upload fallback
    const body = await req.json();
    const { imageBase64, filename: originalName } = body;

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: "Dữ liệu ảnh không hợp lệ" }, { status: 400 });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ success: false, error: "Base64 string không hợp lệ" }, { status: 400 });
    }

    const buffer = Buffer.from(matches[2], "base64");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeName = (originalName || "image.png").replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("File Upload Error:", error);
    return NextResponse.json({
      success: false,
      error: "Lỗi tải ảnh: " + (error instanceof Error ? error.message : "Internal server error")
    }, { status: 500 });
  }
}
