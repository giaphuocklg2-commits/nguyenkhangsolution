import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "super-secret-jwt-key-nks-electric-2024"
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập email và mật khẩu" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. HARDCODED ROOT SUPERADMIN ACCOUNT CHECK
    if (trimmedEmail === "nguyenkhang@shop" && password === "Kgg@123456") {
      const rootPayload = {
        id: "root-superadmin-001",
        email: "nguyenkhang@shop",
        name: "Super Admin (Root)",
        role: "SUPER_ADMIN",
      };

      const token = await new SignJWT(rootPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

      const response = NextResponse.json({
        success: true,
        data: rootPayload,
      });

      response.cookies.set("nks_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    }

    // 2. DATABASE ACCOUNTS CHECK FOR CREATED STAFF MEMBERS
    const staff = await prisma.staff.findUnique({
      where: { email: trimmedEmail },
    });

    if (!staff || !staff.isActive) {
      return NextResponse.json(
        { success: false, error: "Tài khoản không tồn tại hoặc bị khóa" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Sai mật khẩu" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: staff.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      data: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
      },
    });

    response.cookies.set("nks_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}