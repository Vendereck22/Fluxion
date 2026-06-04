"use server";

import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AuditActionType } from "@/lib/generated/prisma/client";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  actionType:
    | "LOGIN"
    | "LOGOUT"
    | "CMS_UPDATE"
    | "USER_CREATE"
    | "USER_DELETE"
    | "MEDIA_UPLOAD"
    | "LEAD_UPDATE"
    | "NEWSLETTER_SEND";
  message: string;
  details?: string;
  ipAddress?: string;
}

function actionTypeFromInput(actionType: AuditLogEntry["actionType"]): AuditActionType {
  return AuditActionType[actionType];
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const list = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 1000,
    });

    return list.map((entry) => ({
      id: entry.id,
      timestamp: entry.timestamp.toISOString(),
      userEmail: entry.userEmail,
      actionType: entry.actionType,
      message: entry.message,
      details: entry.details ?? undefined,
      ipAddress: entry.ipAddress ?? undefined,
    }));
  } catch (error) {
    console.error("Failed to read audit logs:", error);
    return [];
  }
}

export async function logAuditEvent(
  actionType: AuditLogEntry["actionType"],
  message: string,
  details?: string,
  overrideEmail?: string
) {
  try {
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get("fluxion_user_email");
    const userEmail = overrideEmail || emailCookie?.value || process.env.FLUXION_ADMIN_EMAIL || "admin@fluxion.cd";

    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const user = await prisma.adminUser.findUnique({
      where: { email: userEmail.toLowerCase() },
      select: { id: true },
    });

    await prisma.auditLog.create({
      data: {
        userEmail,
        actionType: actionTypeFromInput(actionType),
        message,
        details,
        ipAddress,
        userId: user?.id,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log entry:", error);
  }
}
