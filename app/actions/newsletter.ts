"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/actions/auth";
import {
  readJsonPreferFallback,
  tmpDataPath,
  writeJsonWithFallback,
} from "@/lib/server/json-store";

const SUBSCRIBERS_PATH = path.join(process.cwd(), "constants", "subscribers.json");
const LOGS_PATH = path.join(process.cwd(), "constants", "newsletter-logs.json");
const SUBSCRIBERS_FALLBACK_PATH = tmpDataPath("subscribers.json");
const LOGS_FALLBACK_PATH = tmpDataPath("newsletter-logs.json");

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

async function readSubscribers(): Promise<Subscriber[]> {
  return readJsonPreferFallback<Subscriber[]>(
    SUBSCRIBERS_PATH,
    SUBSCRIBERS_FALLBACK_PATH,
    []
  );
}

async function readLogs(): Promise<NewsletterLog[]> {
  return readJsonPreferFallback<NewsletterLog[]>(LOGS_PATH, LOGS_FALLBACK_PATH, []);
}


export async function getSubscribers(): Promise<Subscriber[]> {
  const isAdmin = await verifySession();
  if (!isAdmin) return [];
  return readSubscribers();
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

    const subscribers = await readSubscribers();
    const existing = subscribers.find((s) => s.email === cleanEmail);

    if (existing) {
      if (existing.status === "active") {
        return { success: true, alreadySubscribed: true };
      }
      existing.status = "active";
      existing.subscribedAt = new Date().toISOString();
    } else {
      const newSub: Subscriber = {
        id: "sub-" + Math.random().toString(36).substring(2, 11),
        email: cleanEmail,
        status: "active",
        subscribedAt: new Date().toISOString(),
      };
      subscribers.push(newSub);
    }

    await writeJsonWithFallback(
      SUBSCRIBERS_PATH,
      SUBSCRIBERS_FALLBACK_PATH,
      subscribers
    );
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe email:", error);
    return { success: false, error: "Erreur serveur lors de l'abonnement." };
  }
}


export async function toggleSubscriberStatus(id: string, status: "active" | "unsubscribed") {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    const subscribers = await readSubscribers();
    const idx = subscribers.findIndex((s) => s.id === id);
    if (idx === -1) return { success: false, error: "Abonné introuvable." };

    subscribers[idx].status = status;
    await writeJsonWithFallback(
      SUBSCRIBERS_PATH,
      SUBSCRIBERS_FALLBACK_PATH,
      subscribers
    );
    revalidatePath("/admin/newsletter");
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

    let subscribers = await readSubscribers();
    subscribers = subscribers.filter((s) => s.id !== id);
    await writeJsonWithFallback(
      SUBSCRIBERS_PATH,
      SUBSCRIBERS_FALLBACK_PATH,
      subscribers
    );
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return { success: false, error: "Erreur serveur." };
  }
}


export async function getNewsletterLogs(): Promise<NewsletterLog[]> {
  const isAdmin = await verifySession();
  if (!isAdmin) return [];
  return readLogs();
}


export async function sendNewsletter(subject: string, message: string, recipientEmails: string[]) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    if (!subject.trim() || !message.trim()) {
      return { success: false, error: "Le sujet et le message ne peuvent pas être vides." };
    }
    if (recipientEmails.length === 0) {
      return { success: false, error: "Aucun destinataire sélectionné." };
    }

    const logs = await readLogs();
    const newCampaignLog: NewsletterLog = {
      id: "campaign-" + Math.random().toString(36).substring(2, 11),
      subject: subject.trim(),
      message: message.trim(),
      recipients: recipientEmails,
      sentAt: new Date().toISOString(),
    };

    logs.push(newCampaignLog);

    logs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    await writeJsonWithFallback(LOGS_PATH, LOGS_FALLBACK_PATH, logs);
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    return { success: false, error: "Erreur serveur lors de l'envoi." };
  }
}