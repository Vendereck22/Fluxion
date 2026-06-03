"use server";

import { cookies, headers } from "next/headers";
import path from "path";
import {
  readJsonPreferFallback,
  tmpDataPath,
  writeJsonWithFallback,
} from "@/lib/server/json-store";

const AUDIT_PATH = path.join(process.cwd(), "constants", "audit-logs.json");
const AUDIT_FALLBACK_PATH = tmpDataPath("audit-logs.json");

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  actionType: "LOGIN" | "LOGOUT" | "CMS_UPDATE" | "USER_CREATE" | "USER_DELETE";
  message: string;
  details?: string;
  ipAddress?: string;
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const list = await readJsonPreferFallback<AuditLogEntry[]>(
      AUDIT_PATH,
      AUDIT_FALLBACK_PATH,
      []
    );
    // Sort logs by timestamp descending (newest first)
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
    const userEmail = overrideEmail || emailCookie?.value || "admin@fluxion.cd";

    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const logs = await readJsonPreferFallback<AuditLogEntry[]>(
      AUDIT_PATH,
      AUDIT_FALLBACK_PATH,
      []
    );

    const newEntry: AuditLogEntry = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      userEmail,
      actionType,
      message,
      details,
      ipAddress,
    };

    logs.push(newEntry);

    // Limit logs length to 1000 items to avoid file bloating
    if (logs.length > 1000) {
      logs.shift();
    }

    await writeJsonWithFallback(AUDIT_PATH, AUDIT_FALLBACK_PATH, logs);
  } catch (error) {
    console.error("Failed to write audit log entry:", error);
  }
}
