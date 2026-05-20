"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const SUBSCRIBERS_PATH = path.join(process.cwd(), "constants", "subscribers.json");
const LOGS_PATH = path.join(process.cwd(), "constants", "newsletter-logs.json");

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

// Read subscribers
export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const content = await fs.readFile(SUBSCRIBERS_PATH, "utf-8");
    return JSON.parse(content) as Subscriber[];
  } catch (error) {
    console.error("Failed to read subscribers, returning empty list:", error);
    return [];
  }
}

// Subscribe from client-side
export async function subscribeNewsletter(email: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, error: "Adresse email invalide." };
    }

    const subscribers = await getSubscribers();
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

    await fs.writeFile(SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2), "utf-8");
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe email:", error);
    return { success: false, error: "Erreur serveur lors de l'abonnement." };
  }
}

// Toggle subscriber status (active/unsubscribed)
export async function toggleSubscriberStatus(id: string, status: "active" | "unsubscribed") {
  try {
    const subscribers = await getSubscribers();
    const idx = subscribers.findIndex((s) => s.id === id);
    if (idx === -1) return { success: false, error: "Abonné introuvable." };

    subscribers[idx].status = status;
    await fs.writeFile(SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2), "utf-8");
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle subscriber status:", error);
    return { success: false, error: "Erreur serveur." };
  }
}

// Delete subscriber
export async function deleteSubscriber(id: string) {
  try {
    let subscribers = await getSubscribers();
    subscribers = subscribers.filter((s) => s.id !== id);
    await fs.writeFile(SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2), "utf-8");
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return { success: false, error: "Erreur serveur." };
  }
}

// Read newsletter send logs
export async function getNewsletterLogs(): Promise<NewsletterLog[]> {
  try {
    const content = await fs.readFile(LOGS_PATH, "utf-8");
    return JSON.parse(content) as NewsletterLog[];
  } catch (error) {
    console.error("Failed to read newsletter logs, returning empty list:", error);
    return [];
  }
}

// Dispatch / Save campaign log
export async function sendNewsletter(subject: string, message: string, recipientEmails: string[]) {
  try {
    if (!subject.trim() || !message.trim()) {
      return { success: false, error: "Le sujet et le message ne peuvent pas être vides." };
    }
    if (recipientEmails.length === 0) {
      return { success: false, error: "Aucun destinataire sélectionné." };
    }

    const logs = await getNewsletterLogs();
    const newCampaignLog: NewsletterLog = {
      id: "campaign-" + Math.random().toString(36).substring(2, 11),
      subject: subject.trim(),
      message: message.trim(),
      recipients: recipientEmails,
      sentAt: new Date().toISOString(),
    };

    logs.push(newCampaignLog);
    // Keep logs sorted chronologically descending
    logs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    await fs.writeFile(LOGS_PATH, JSON.stringify(logs, null, 2), "utf-8");
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    return { success: false, error: "Erreur serveur lors de l'envoi." };
  }
}
