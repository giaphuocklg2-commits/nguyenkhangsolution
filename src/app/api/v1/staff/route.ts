import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyAuth } from "@/lib/auth";

const roleLevels: Record<string, number> = {
  SUPER_ADMIN: 100,
  GENERAL_DIRECTOR: 80,
  DIRECTOR: 80,
  WAREHOUSE: 50,
  ACCOUNTANT: 50,
  CSKH: 30,
  SELLER: 20
};

// Root hardcoded Superadmin object for staff list display
const ROOT_SUPER_ADMIN = {
  id: "root-superadmin-001",
  name: "Super Admin (Root)",
  email: "nguyenkhang@shop",
  role: "SUPER_ADMIN",
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

// GET /api/v1/staff
export async function GET(req: NextRequest) {
  try {
    const dbStaff = await prisma.staff.findMany({
      select: {
        id: true, name: true, email: true, role: true, isActive: true, createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Merge hardcoded root superadmin at the top
    const staffList = [
      ROOT_SUPER_ADMIN,
      ...dbStaff.filter(s => s.email !== "nguyenkhang@shop")
    ];

    return NextResponse.json({ success: true, data: staffList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/staff — Create staff in MySQL Database
export async function POST(req: NextRequest) {
  try {
    const currentUser = await verifyAuth();
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
    }

    const callerRole = currentUser.role;

    if (["CSKH", "ACCOUNTANT", "SELLER", "WAREHOUSE"].includes(callerRole)) {
      return NextResponse.json({
        success: false,
        error: "Bạn không có quyền tạo tài khoản nhân sự"
      }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    const validRoles = ["SUPER_ADMIN", "GENERAL_DIRECTOR", "DIRECTOR", "WAREHOUSE", "ACCOUNTANT", "CSKH", "SELLER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ success: false, error: "Chức vụ không hợp lệ" }, { status: 400 });
    }

    if (["GENERAL_DIRECTOR", "DIRECTOR"].includes(callerRole)) {
      if (roleLevels[role] >= 80) {
        return NextResponse.json({
          success: false,
          error: "Giám đốc chỉ có quyền tạo tài khoản cho cấp dưới, không được tạo tài khoản Giám đốc hoặc Super Admin"
        }, { status: 403 });
      }
    }

    if (email.trim().toLowerCase() === "nguyenkhang@shop") {
      return NextResponse.json({ success: false, error: "Email này đã được dùng cho tài khoản Root Super Admin hệ thống" }, { status: 409 });
    }

    const existing = await prisma.staff.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email đã tồn tại trong cơ sở dữ liệu" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const staff = await prisma.staff.create({
      data: { name, email, password: hashed, role },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });

    return NextResponse.json({ success: true, data: staff }, { status: 201 });
  } catch (error) {
    console.error("POST Staff Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
