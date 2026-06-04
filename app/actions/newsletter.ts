"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { NewsletterRecipientStatus, SubscriberStatus } from "@/lib/generated/prisma/client";
import { logAuditEvent } from "@/app/actions/audit";

export interface Subscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  subscribedAt: string;
}

export interface NewsletterLog {
  id: string;
  subject: string;
  message: string;
  recipients: string[];
  sentAt: string;
}

function statusToUi(status: SubscriberStatus): Subscriber["status"] {
  return status === SubscriberStatus.UNSUBSCRIBED ? "unsubscribed" : "active";
}

function statusFromUi(status: Subscriber["status"]): SubscriberStatus {
  return status === "unsubscribed" ? SubscriberStatus.UNSUBSCRIBED : SubscriberStatus.ACTIVE;
}

function mapSubscriber(subscriber: {
  id: string;
  email: string;
  status: SubscriberStatus;
  subscribedAt: Date;
}): Subscriber {
  return {
    id: subscriber.id,
    email: subscriber.email,
    status: statusToUi(subscriber.status),
    subscribedAt: subscriber.subscribedAt.toISOString(),
  };
}

function revalidateNewsletterPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/newsletter");
  revalidatePath("/client");
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const isAdmin = await verifySession();
  if (!isAdmin) return [];

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return subscribers.map(mapSubscriber);
}

export async function subscribeNewsletter(email: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (
      !cleanEmail ||
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return { success: false, error: "Adresse email invalide." };
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing?.status === SubscriberStatus.ACTIVE) {
      return { success: true, alreadySubscribed: true };
    }

    if (existing) {
      await prisma.subscriber.update({
        where: { id: existing.id },
        data: {
          status: SubscriberStatus.ACTIVE,
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });
    } else {
      await prisma.subscriber.create({
        data: {
          email: cleanEmail,
          status: SubscriberStatus.ACTIVE,
        },
      });
    }

    revalidateNewsletterPaths();
    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe email:", error);
    return { success: false, error: "Erreur serveur lors de l'abonnement." };
  }
}

export async function toggleSubscriberStatus(id: string, status: Subscriber["status"]) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    const subscriber = await prisma.subscriber.findUnique({ where: { id } });
    if (!subscriber) return { success: false, error: "Abonné introuvable." };

    const nextStatus = statusFromUi(status);
    await prisma.subscriber.update({
      where: { id },
      data: {
        status: nextStatus,
        unsubscribedAt: nextStatus === SubscriberStatus.UNSUBSCRIBED ? new Date() : null,
      },
    });

    revalidateNewsletterPaths();
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle subscriber status:", error);
    return { success: false, error: "Erreur serveur." };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    const subscriber = await prisma.subscriber.findUnique({ where: { id } });
    if (!subscriber) return { success: false, error: "Abonné introuvable." };

    await prisma.subscriber.delete({ where: { id } });

    revalidateNewsletterPaths();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return { success: false, error: "Erreur serveur." };
  }
}

export async function getNewsletterLogs(): Promise<NewsletterLog[]> {
  const isAdmin = await verifySession();
  if (!isAdmin) return [];

  const campaigns = await prisma.newsletterCampaign.findMany({
    include: {
      recipients: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { sentAt: "desc" },
  });

  return campaigns.map((campaign) => ({
    id: campaign.id,
    subject: campaign.subject,
    message: campaign.message,
    recipients: campaign.recipients.map((recipient) => recipient.email),
    sentAt: campaign.sentAt.toISOString(),
  }));
}

export async function sendNewsletter(subject: string, message: string, recipientEmails: string[]) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();
    const cleanRecipients = Array.from(
      new Set(recipientEmails.map((email) => email.trim().toLowerCase()).filter(Boolean))
    );

    if (!cleanSubject || !cleanMessage) {
      return { success: false, error: "Le sujet et le message ne peuvent pas être vides." };
    }
    if (cleanRecipients.length === 0) {
      return { success: false, error: "Aucun destinataire sélectionné." };
    }

    const subscribers = await prisma.subscriber.findMany({
      where: {
        email: { in: cleanRecipients },
        status: SubscriberStatus.ACTIVE,
      },
    });
    const subscriberByEmail = new Map(subscribers.map((subscriber) => [subscriber.email, subscriber]));

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject: cleanSubject,
        message: cleanMessage,
        recipients: {
          create: cleanRecipients.map((email) => ({
            email,
            subscriberId: subscriberByEmail.get(email)?.id,
            status: subscriberByEmail.has(email)
              ? NewsletterRecipientStatus.SENT
              : NewsletterRecipientStatus.SKIPPED,
            error: subscriberByEmail.has(email) ? null : "Destinataire non actif ou introuvable.",
          })),
        },
      },
      include: { recipients: true },
    });

    await logAuditEvent(
      "NEWSLETTER_SEND",
      `Newsletter envoyée: ${cleanSubject}`,
      `${campaign.recipients.length} destinataire(s)`
    );

    revalidateNewsletterPaths();
    return {
      success: true,
      log: {
        id: campaign.id,
        subject: campaign.subject,
        message: campaign.message,
        recipients: campaign.recipients.map((recipient) => recipient.email),
        sentAt: campaign.sentAt.toISOString(),
      } satisfies NewsletterLog,
    };
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    return { success: false, error: "Erreur serveur lors de l'envoi." };
  }
}
