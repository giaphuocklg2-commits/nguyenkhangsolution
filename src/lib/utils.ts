import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function generateOrderCode(): string {
  const numbers = Math.floor(10000 + Math.random() * 90000).toString();
  const letters = Array.from({ length: 5 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  return `NKS-${numbers}${letters}`;
}

export function generateApiKey(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const key = Array.from({ length: 48 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
  return `nks_${key}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao hàng",
    CANCELLED: "Đã hủy",
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800  ",
    CONFIRMED: "bg-blue-100 text-blue-800  ",
    PROCESSING: "bg-purple-100 text-purple-800  ",
    SHIPPING: "bg-orange-100 text-orange-800  ",
    DELIVERED: "bg-green-100 text-green-800  ",
    CANCELLED: "bg-red-100 text-red-800  ",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getWarrantyStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Chờ xử lý",
    PROCESSING: "Đang xử lý",
    RESOLVED: "Đã giải quyết",
    REJECTED: "Từ chối",
  };
  return labels[status] || status;
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    GENERAL_DIRECTOR: "Tổng Giám Đốc",
    DIRECTOR: "Giám Đốc",
    WAREHOUSE: "Quản Lý Kho",
    ACCOUNTANT: "Kế Toán",
    CSKH: "Chăm Sóc Khách Hàng",
    SELLER: "Seller",
  };
  return labels[role] || role;
}

// Role permissions
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ["dashboard", "products", "orders", "warranty", "analytics", "staff", "apikeys", "settings"],
  GENERAL_DIRECTOR: ["dashboard", "products", "orders", "warranty", "analytics", "staff", "apikeys", "settings"],
  DIRECTOR: ["dashboard", "products", "orders", "warranty", "analytics", "staff", "settings"],
  WAREHOUSE: ["dashboard", "products", "orders", "warranty"],
  ACCOUNTANT: ["dashboard", "orders", "analytics"],
  CSKH: ["dashboard", "orders", "warranty"],
  SELLER: ["dashboard", "products_view", "orders"],
};

export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes("*");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
