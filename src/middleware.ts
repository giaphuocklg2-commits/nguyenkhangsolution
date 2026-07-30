import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "super-secret-jwt-key-nks-electric-2024"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("nks_admin_token")?.value;

  // 1. Bảo vệ tất cả các route /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const verified = await jwtVerify(token, JWT_SECRET);

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", (verified.payload.id as string) || "");
      requestHeaders.set("x-user-role", (verified.payload.role as string) || "");

      // FIX CỐT LÕI TẠI ĐÂY: encodeURIComponent để tránh lỗi ByteString với Tiếng Việt
      const safeName = encodeURIComponent((verified.payload.name as string) || "");
      requestHeaders.set("x-user-name", safeName);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      console.error("Middleware Auth Error:", err);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("nks_admin_token");
      return response;
    }
  }

  // 2. Nếu đã login thành công mà vào /login -> Chuyển hướng sang /admin
  if (pathname === "/login" && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.redirect(new URL("/admin", request.url));
    } catch (err) {
      const response = NextResponse.next();
      response.cookies.delete("nks_admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};