import { redirect } from "next/navigation";
import { verifySession } from "@/app/actions/auth";
import { getAuditLogs } from "@/app/actions/audit";
import AuditLogsManager from "./AuditLogsManager";

export const revalidate = 0; // Disable server caching for this route

export default async function AuditPage() {
  const isAdmin = await verifySession();
  if (!isAdmin) {
    redirect("/admin/login");
  }

  const logs = await getAuditLogs();

  return <AuditLogsManager initialLogs={logs} />;
}
