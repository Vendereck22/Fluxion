"use server";

import { verifySession } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { LeadStatus, SubscriberStatus } from "@/lib/generated/prisma/client";

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

    const [leads, subscribers] = await Promise.all([
      prisma.lead.findMany({
        where: { status: LeadStatus.NEW },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.subscriber.findMany({
        where: { status: SubscriberStatus.ACTIVE },
        orderBy: { subscribedAt: "desc" },
        take: 5,
      }),
    ]);

    const items: NotificationItem[] = [];

    leads.forEach((lead) => {
      items.push({
        id: lead.id,
        type: "lead",
        title: "Nouveau message de contact",
        message: `${lead.name} a envoyé un message. Téléphone : ${lead.phone || "Non renseigné"}`,
        email: lead.email,
        timestamp: lead.createdAt.toISOString(),
        unread: true,
      });
    });

    subscribers.forEach((subscriber) => {
      const isRecent = Date.now() - subscriber.subscribedAt.getTime() < 3 * 24 * 60 * 60 * 1000;

      items.push({
        id: subscriber.id,
        type: "newsletter",
        title: "Nouvel abonné Newsletter",
        message: `${subscriber.email} s'est abonné aux actualités de Fluxion.`,
        email: subscriber.email,
        timestamp: subscriber.subscribedAt.toISOString(),
        unread: isRecent,
      });
    });

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

    await prisma.lead.updateMany({
      where: { status: LeadStatus.NEW },
      data: { status: LeadStatus.CONTACTED },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return { success: false };
  }
}
