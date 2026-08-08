import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function createSystemNotification({
  title,
  content,
  type,
  createdBy = "Hệ thống Tự động",
}: {
  title: string;
  content: string;
  type: "USER_POPUP" | "STAFF_POPUP" | "COMPANY_BELL";
  createdBy?: string;
}) {
  try {
    if ((prisma as any).announcement) {
      await (prisma as any).announcement.create({
        data: {
          title,
          content,
          type,
          isActive: true,
          createdBy,
        },
      });
    } else {
      const id = "ann_" + crypto.randomUUID();
      const now = new Date().toISOString();
      await prisma.$executeRawUnsafe(
        `INSERT INTO Announcement (id, title, content, type, isActive, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, 1, ?, ?, ?)`,
        id,
        title,
        content,
        type,
        createdBy,
        now,
        now
      );
    }
  } catch (error) {
    console.error("Failed to create system notification automatically:", error);
  }
}
