"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const LEADS_PATH = path.join(process.cwd(), "constants", "leads.json");

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

// Helper to safely read leads
export async function getLeads(): Promise<Lead[]> {
  try {
    const fileContent = await fs.readFile(LEADS_PATH, "utf-8");
    return JSON.parse(fileContent) as Lead[];
  } catch (error) {
    console.error("Failed to read leads, returning empty list:", error);
    return [];
  }
}

// Server action to submit a lead from the client side
export async function submitLead(formData: {
  name: string;
  email: string;
  company: string;
  message: string;
  budget: string;
  service: string;
}) {
  try {
    const leads = await getLeads();
    
    const newLead: Lead = {
      id: "lead-" + Math.random().toString(36).substr(2, 9),
      ...formData,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    
    leads.push(newLead);
    
    await fs.writeFile(LEADS_PATH, JSON.stringify(leads, null, 2), "utf-8");
    
    // Revalidate related paths
    revalidatePath("/admin");
    revalidatePath("/admin/inbox");
    revalidatePath("/admin/archives");
    
    return { success: true, lead: newLead };
  } catch (error) {
    console.error("Failed to submit lead:", error);
    return { success: false, error: "Une erreur s'est produite lors de l'envoi." };
  }
}

// Server action to update a lead's status
export async function updateLeadStatus(id: string, status: "new" | "contacted" | "archived") {
  try {
    const leads = await getLeads();
    const index = leads.findIndex((l) => l.id === id);
    
    if (index === -1) {
      return { success: false, error: "Lead introuvable." };
    }
    
    leads[index].status = status;
    
    await fs.writeFile(LEADS_PATH, JSON.stringify(leads, null, 2), "utf-8");
    
    revalidatePath("/admin");
    revalidatePath("/admin/inbox");
    revalidatePath("/admin/archives");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: "Erreur de mise à jour." };
  }
}

// Server action to delete a lead
export async function deleteLead(id: string) {
  try {
    let leads = await getLeads();
    leads = leads.filter((l) => l.id !== id);
    
    await fs.writeFile(LEADS_PATH, JSON.stringify(leads, null, 2), "utf-8");
    
    revalidatePath("/admin");
    revalidatePath("/admin/inbox");
    revalidatePath("/admin/archives");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return { success: false, error: "Erreur de suppression." };
  }
}
