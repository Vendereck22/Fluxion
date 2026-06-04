"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, verifySession } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@/lib/generated/prisma/client";
import { logAuditEvent } from "@/app/actions/audit";

export interface LeadNoteItem {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorEmail: string;
}

export interface Lead {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  budget: string;
  service: string;
  status: "new" | "contacted" | "archived";
  createdAt: string;
  notes: LeadNoteItem[];
}

function statusToUi(status: LeadStatus): Lead["status"] {
  if (status === LeadStatus.CONTACTED) return "contacted";
  if (status === LeadStatus.ARCHIVED) return "archived";
  return "new";
}

function statusFromUi(status: Lead["status"]): LeadStatus {
  if (status === "contacted") return LeadStatus.CONTACTED;
  if (status === "archived") return LeadStatus.ARCHIVED;
  return LeadStatus.NEW;
}

function mapLead(lead: {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  budget: string | null;
  service: string | null;
  status: LeadStatus;
  createdAt: Date;
  notes?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author?: {
      name: string;
      email: string;
    } | null;
  }>;
}): Lead {
  return {
    id: lead.id,
    name: lead.name,
    firstName: lead.firstName ?? "",
    lastName: lead.lastName ?? "",
    middleName: lead.middleName ?? "",
    email: lead.email,
    phone: lead.phone ?? "",
    company: lead.company ?? "",
    message: lead.message,
    budget: lead.budget ?? "",
    service: lead.service ?? "",
    status: statusToUi(lead.status),
    createdAt: lead.createdAt.toISOString(),
    notes: (lead.notes ?? []).map((note) => ({
      id: note.id,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      authorName: note.author?.name ?? "Admin Fluxion",
      authorEmail: note.author?.email ?? "",
    })),
  };
}

function revalidateLeadPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/inbox");
  revalidatePath("/admin/archives");
}

export async function getLeads(): Promise<Lead[]> {
  const isAdmin = await verifySession();
  if (!isAdmin) return [];

  const leads = await prisma.lead.findMany({
    include: {
      notes: {
        include: {
          author: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return leads.map(mapLead);
}

export async function submitLead(formData: {
  name?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  budget?: string;
  service?: string;
}) {
  try {
    const firstName = formData.firstName?.trim() ?? "";
    const lastName = formData.lastName?.trim() ?? "";
    const middleName = formData.middleName?.trim() ?? "";
    const legacyName = formData.name?.trim() ?? "";
    const name = [lastName, middleName, firstName].filter(Boolean).join(" ") || legacyName;
    const email = formData.email?.trim().toLowerCase() ?? "";
    const phone = formData.phone?.trim() ?? "";
    const company = formData.company?.trim() ?? "";
    const message = formData.message?.trim() ?? "";
    const budget = formData.budget?.trim() ?? "";
    const service = formData.service?.trim() ?? "";

    if (!lastName || !firstName || !email || !phone || !message) {
      return { success: false, error: "Veuillez remplir les champs obligatoires." };
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Adresse email invalide." };
    }
    if (!/^[+()\d\s.-]{7,25}$/.test(phone)) {
      return { success: false, error: "Numéro de téléphone invalide." };
    }
    if (
      name.length > 180 ||
      firstName.length > 80 ||
      lastName.length > 80 ||
      middleName.length > 80 ||
      phone.length > 25 ||
      company.length > 160 ||
      message.length > 5000
    ) {
      return { success: false, error: "Votre message est trop long." };
    }

    const newLead = await prisma.lead.create({
      data: {
        name,
        firstName,
        lastName,
        middleName: middleName || null,
        email,
        phone,
        company: company || null,
        message,
        budget: budget || null,
        service: service || null,
        status: LeadStatus.NEW,
      },
      include: {
        notes: {
          include: {
            author: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    revalidateLeadPaths();

    return { success: true, lead: mapLead(newLead) };
  } catch (error) {
    console.error("Failed to submit lead:", error);
    return { success: false, error: "Une erreur s'est produite lors de l'envoi." };
  }
}

export async function addLeadNote(id: string, content: string) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    const cleanContent = content.trim();
    if (!cleanContent) {
      return { success: false, error: "La note ne peut pas être vide." };
    }
    if (cleanContent.length > 2000) {
      return { success: false, error: "La note est trop longue." };
    }

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return { success: false, error: "Lead introuvable." };
    }

    const currentUser = await getCurrentUser();
    const authorId =
      currentUser?.id && currentUser.id !== "env-super-admin"
        ? currentUser.id
        : undefined;

    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        authorId,
        content: cleanContent,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    await logAuditEvent("LEAD_UPDATE", `Note ajoutée au lead: ${lead.email}`, cleanContent);

    revalidateLeadPaths();

    return {
      success: true,
      note: {
        id: note.id,
        content: note.content,
        createdAt: note.createdAt.toISOString(),
        authorName: note.author?.name ?? currentUser?.name ?? "Admin Fluxion",
        authorEmail: note.author?.email ?? currentUser?.email ?? "",
      } satisfies LeadNoteItem,
    };
  } catch (error) {
    console.error("Failed to add lead note:", error);
    return { success: false, error: "Erreur lors de l'ajout de la note." };
  }
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return { success: false, error: "Non autorisé." };

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return { success: false, error: "Lead introuvable." };
    }

    const nextStatus = statusFromUi(status);
    await prisma.lead.update({
      where: { id },
      data: {
        status: nextStatus,
        archivedAt: nextStatus === LeadStatus.ARCHIVED ? new Date() : null,
      },
    });

    await logAuditEvent("LEAD_UPDATE", `Mise à jour du lead: ${lead.email}`, `Statut: ${status}`);

    revalidateLeadPaths();

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

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return { success: false, error: "Lead introuvable." };
    }

    await prisma.lead.delete({ where: { id } });

    await logAuditEvent("LEAD_UPDATE", `Suppression du lead: ${lead.email}`, `ID: ${id}`);

    revalidateLeadPaths();

    return { success: true };
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return { success: false, error: "Erreur de suppression." };
  }
}
