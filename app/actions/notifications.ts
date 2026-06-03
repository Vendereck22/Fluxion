"use server";

import path from "path";
import { verifySession } from "@/app/actions/auth";
import {
  readJsonPreferFallback,
  tmpDataPath,
  writeJsonWithFallback,
} from "@/lib/server/json-store";
import type { Lead } from "@/app/actions/leads";
import type { Subscriber } from "@/app/actions/newsletter";

const LEADS_PATH = path.join(process.cwd(), "constants", "leads.json");
const LEADS_FALLBACK_PATH = tmpDataPath("leads.json");

const SUBSCRIBERS_PATH = path.join(process.cwd(), "constants", "subscribers.json");
const SUBSCRIBERS_FALLBACK_PATH = tmpDataPath("subscribers.json");

export interface NotificationItem {
  id: string;
  type: "lead" | "newsletter";
  title: string;
  message: string;
  email: string;
  timestamp: string;
  unread: boolean;
}

export async function getTopbarNotifications(): Promise<NotificationItem[]> {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return [];

    const leads = await readJsonPreferFallback<Lead[]>(LEADS_PATH, LEADS_FALLBACK_PATH, []);
    const subscribers = await readJsonPreferFallback<Subscriber[]>(
      SUBSCRIBERS_PATH,
      SUBSCRIBERS_FALLBACK_PATH,
      []
    );

    const items: NotificationItem[] = [];

    // Process unread leads
    leads.forEach((l) => {
      if (l.status === "new") {
        items.push({
          id: l.id,
          type: "lead",
          title: "Nouveau message de contact",
          message: `${l.name} (${l.company || "Particulier"}) a envoyé un message pour le service : ${l.service}`,
          email: l.email,
          timestamp: l.createdAt,
          unread: true,
        });
      }
    });

    // Process recent newsletter subscribers
    // Sort active subscribers descending by subscribedAt
    const sortedSubscribers = [...subscribers]
      .filter((s) => s.status === "active")
      .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());

    // We present the 5 most recent subscribers
    const recentSubs = sortedSubscribers.slice(0, 5);

    recentSubs.forEach((s) => {
      // Mark as unread if they subscribed within the last 3 days
      const subDate = new Date(s.subscribedAt);
      const isRecent = Date.now() - subDate.getTime() < 3 * 24 * 60 * 60 * 1000;

      items.push({
        id: s.id,
        type: "newsletter",
        title: "Nouvel abonné Newsletter",
        message: `${s.email} s'est abonné aux actualités de Fluxion.`,
        email: s.email,
        timestamp: s.subscribedAt,
        unread: isRecent,
      });
    });

    // Sort notifications by timestamp descending (newest first)
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Failed to fetch topbar notifications:", error);
    return [];
  }
}

export async function markNotificationsAsReadAction(): Promise<{ success: boolean }> {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false };

    const leads = await readJsonPreferFallback<Lead[]>(LEADS_PATH, LEADS_FALLBACK_PATH, []);
    let modified = false;

    const updatedLeads = leads.map((l) => {
      if (l.status === "new") {
        modified = true;
        return { ...l, status: "contacted" as const };
      }
      return l;
    });

    if (modified) {
      await writeJsonWithFallback(LEADS_PATH, LEADS_FALLBACK_PATH, updatedLeads);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return { success: false };
  }
}
