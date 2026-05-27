"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/actions/auth";
import {
  readJsonPreferFallback,
  tmpDataPath,
  writeJsonWithFallback,
} from "@/lib/server/json-store";

const LEADS_PATH = path.join(process.cwd(), "constants", "leads.json");
const LEADS_FALLBACK_PATH = tmpDataPath("leads.json");

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  budget: string;
  service: string;
  status: "new" | "contacted" | "archived";
  createdAt: string;
}

async function readLeads(): Promise<Lead[]> {
  return readJsonPreferFallback<Lead[]>(LEADS_PATH, LEADS_FALLBACK_PATH, []);
}


export async function getLeads(): Promise<Lead[]> {
  const isAdmin = await verifySession();
  if (!isAdmin) return [];
  return readLeads();
}


export async function submitLead(formData: {
  name: string;
  email: string;
  company: string;
  message: string;
  budget: string;
  service: string;
}) {
  try {
    const name = formData.name?.trim() ?? "";
    const email = formData.email?.trim().toLowerCase() ?? "";
    const company = formData.company?.trim() ?? "";
    const message = formData.message?.trim() ?? "";
    const budget = formData.budget?.trim() ?? "";
    const service = formData.service?.trim() ?? "";

    if (!name || !email || !message) {
      return { success: false, error: "Veuillez remplir les champs obligatoires." };
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Adresse email invalide." };
    }
    if (name.length > 120 || company.length > 160 || message.length > 5000) {
      return { success: false, error: "Votre message est trop long." };
    }

    const leads = await readLeads();

    const newLead: Lead = {
      id: "lead-" + Math.random().toString(36).substring(2, 11),
      name,
      email,
      company,
      message,
      budget,
      service,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);

    await writeJsonWithFallback(LEADS_PATH, LEADS_FALLBACK_PATH, leads);


    revalidatePath("/admin");
    revalidatePath("/admin/inbox");
    revalidatePath("/admin/archives");

    return { success: true, lead: newLead };
  } catch (error) {
    console.error("Failed to submit lead:", error);
    return { success: false, error: "Une erreur s'est produite lors de l'envoi." };
  }
}


export async function updateLeadStatus(id: string, status: "new" | "contacted" | "archived") {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    const leads = await readLeads();
    const index = leads.findIndex((l) => l.id === id);

    if (index === -1) {
      return { success: false, error: "Lead introuvable." };
    }

    leads[index].status = status;

    await writeJsonWithFallback(LEADS_PATH, LEADS_FALLBACK_PATH, leads);

    revalidatePath("/admin");
    revalidatePath("/admin/inbox");
    revalidatePath("/admin/archives");

    return { success: true };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: "Erreur de mise à jour." };
  }
}


export async function deleteLead(id: string) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    let leads = await readLeads();
    leads = leads.filter((l) => l.id !== id);

    await writeJsonWithFallback(LEADS_PATH, LEADS_FALLBACK_PATH, leads);

    revalidatePath("/admin");
    revalidatePath("/admin/inbox");
    revalidatePath("/admin/archives");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return { success: false, error: "Erreur de suppression." };
  }
}