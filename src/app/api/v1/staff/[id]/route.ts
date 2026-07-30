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

// PUT /api/v1/staff/[id] - Edit staff member
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await verifyAuth();
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
    }

    const targetStaff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!targetStaff) {
      return NextResponse.json({ success: false, error: "Tài khoản không tồn tại" }, { status: 404 });
    }

    const body = await req.json();
    const { name, role, isActive, password } = body;

    const callerRole = currentUser.role;
    const targetRole = targetStaff.role;

    // CSKH, Accountant, Seller, Warehouse cannot manage any staff accounts
    if (["CSKH", "ACCOUNTANT", "SELLER", "WAREHOUSE"].includes(callerRole)) {
      return NextResponse.json({
        success: false,
        error: "Bạn không có quyền quản lý hay chỉnh sửa tài khoản nhân sự"
      }, { status: 403 });
    }

    // Directors can only manage lower-level staff (< 80)
    if (["GENERAL_DIRECTOR", "DIRECTOR"].includes(callerRole)) {
      if (roleLevels[targetRole] >= 80) {
        return NextResponse.json({
          success: false,
          error: "Giám đốc chỉ có quyền quản lý cấp dưới, không được sửa tài khoản Đồng cấp hoặc Super Admin"
        }, { status: 403 });
      }
      if (role && roleLevels[role] >= 80) {
        return NextResponse.json({
          success: false,
          error: "Bạn không có quyền thăng chức lên cấp Giám đốc hoặc Super Admin"
        }, { status: 403 });
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.staff.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT Staff Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/staff/[id] - Delete staff member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await verifyAuth();
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });
    }

    if (currentUser.id === id) {
      return NextResponse.json({ success: false, error: "Không thể tự xóa tài khoản của chính mình" }, { status: 400 });
    }

    const targetStaff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!targetStaff) {
      return NextResponse.json({ success: false, error: "Tài khoản không tồn tại" }, { status: 404 });
    }

    const callerRole = currentUser.role;
    const targetRole = targetStaff.role;

    if (["CSKH", "ACCOUNTANT", "SELLER", "WAREHOUSE"].includes(callerRole)) {
      return NextResponse.json({
        success: false,
        error: "Bạn không có quyền xóa tài khoản nhân sự"
      }, { status: 403 });
    }

    if (["GENERAL_DIRECTOR", "DIRECTOR"].includes(callerRole)) {
      if (roleLevels[targetRole] >= 80) {
        return NextResponse.json({
          success: false,
          error: "Giám đốc không có quyền xóa tài khoản Đồng cấp hoặc Super Admin"
        }, { status: 403 });
      }
    }

    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa nhân sự thành công" });
  } catch (error) {
    console.error("DELETE Staff Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
