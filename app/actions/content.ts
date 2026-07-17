"use server";

import path from "path";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifySession } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, ProductTheme } from "@/lib/generated/prisma/client";
import {
  readJsonPreferFallback,
  tmpDataPath,
  writeJsonWithFallback,
} from "@/lib/server/json-store";
import { logAuditEvent } from "@/app/actions/audit";

const CONTENT_PATH = path.join(process.cwd(), "constants", "site-content.json");
const CONTENT_FALLBACK_PATH = tmpDataPath("site-content.json");

const ALLOWED_SECTIONS = new Set([
  "brand",
  "navigation",
  "hero",
  "features",
  "approach",
  "partners",
  "whyUs",
  "process",
  "testimonials",
  "faq",
  "newsletter",
  "finalCta",
  "video",
  "pages",
  "products",
  "aboutPage",
  "footer",
  "social",
  "team",
  "productsPage",
  "projectsPage",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeContentValue(fallback: unknown, override: unknown): unknown {
  if (Array.isArray(fallback) || Array.isArray(override)) {
    return override ?? fallback;
  }

  if (isPlainObject(fallback) && isPlainObject(override)) {
    const merged: Record<string, unknown> = { ...fallback };

    for (const [key, value] of Object.entries(override)) {
      merged[key] = mergeContentValue(fallback[key], value);
    }

    return merged;
  }

  return override ?? fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return isPlainObject(value) ? value : {};
}

async function readContentJson() {
  return readJsonPreferFallback<Record<string, unknown>>(
    CONTENT_PATH,
    CONTENT_FALLBACK_PATH,
    {}
  );
}

async function mergeCmsSectionsIntoContent(content: Record<string, unknown>) {
  const sections = await prisma.cmsSection.findMany();
  const merged: Record<string, unknown> = { ...content };

  for (const section of sections) {
    if (!ALLOWED_SECTIONS.has(section.key)) continue;
    merged[section.key] = mergeContentValue(merged[section.key], section.data);
  }

  return merged;
}

export async function getContentSection(section: string) {
  const isAdmin = await verifySession();
  if (!isAdmin) {
    return { success: false, error: "Non autorisé.", data: null };
  }

  if (!ALLOWED_SECTIONS.has(section)) {
    return { success: false, error: "Section invalide.", data: null };
  }

  const [content, dbSection] = await Promise.all([
    readContentJson(),
    prisma.cmsSection.findUnique({ where: { key: section } }),
  ]);

  const fallbackSection = asRecord(content[section]);
  const dbData = asRecord(dbSection?.data);

  return {
    success: true,
    data: mergeContentValue(fallbackSection, dbData) as Record<string, unknown>,
  };
}

type PartnerLogoInput = {
  name?: string;
  logoSrc?: string;
  website?: string;
};

type ServiceFeatureInput = {
  title?: string;
  description?: string;
  moreLabel?: string;
  imageSrc?: string;
  gallery?: { src?: string; alt?: string }[];
};

type ProjectInput = {
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  imageSrc?: string;
  href?: string;
  tags?: string[];
};

type ProductInput = {
  slug?: string;
  name?: string;
  onlineUrl?: string;
  shortDescription?: string;
  description?: string;
  theme?: "red" | "purple";
  imageSrc?: string;
  rightImageSrc?: string;
  gallery?: { src?: string; alt?: string }[];
};

type TeamMemberInput = {
  name?: string;
  role?: string;
  bio?: string;
  img?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
};

function cleanOptional(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function syncSectionToPrisma(section: string, data: Record<string, unknown>) {
  const jsonData = data as Prisma.InputJsonValue;

  await prisma.cmsSection.upsert({
    where: { key: section },
    create: {
      key: section,
      title: section,
      data: jsonData,
    },
    update: {
      data: jsonData,
    },
  });

  if (section === "features") {
    const items = Array.isArray(data.items)
      ? (data.items as ServiceFeatureInput[])
      : [];

    await prisma.serviceFeature.deleteMany({});

    for (const [position, item] of items.entries()) {
      if (!item.title?.trim() || !item.description?.trim()) continue;

      await prisma.serviceFeature.create({
        data: {
          id: `feature-${position + 1}`,
          title: item.title.trim(),
          description: item.description.trim(),
          moreLabel: cleanOptional(item.moreLabel) ?? cleanOptional(data.more),
          imageSrc: cleanOptional(item.imageSrc),
          gallery: Array.isArray(item.gallery)
            ? item.gallery
                .filter((image) => image.src?.trim())
                .map((image, galleryPosition) => ({
                  src: image.src?.trim(),
                  alt:
                    image.alt?.trim() ||
                    `${item.title?.trim()} - image ${galleryPosition + 1}`,
                }))
            : Prisma.JsonNull,
          position,
          isActive: true,
        },
      });
    }
  }

  if (section === "partners") {
    const logos = Array.isArray(data.logos)
      ? (data.logos as PartnerLogoInput[])
      : [];

    await prisma.partner.deleteMany({});

    for (const [position, partner] of logos.entries()) {
      if (!partner.name?.trim() || !partner.logoSrc?.trim()) continue;

      await prisma.partner.create({
        data: {
          id: `partner-${slugify(partner.name) || position + 1}`,
          name: partner.name.trim(),
          logoSrc: partner.logoSrc.trim(),
          website: cleanOptional(partner.website),
          position,
          isActive: true,
        },
      });
    }
  }

  if (section === "projectsPage") {
    const items = Array.isArray(data.items) ? (data.items as ProjectInput[]) : [];

    await prisma.project.deleteMany({});

    for (const [position, project] of items.entries()) {
      const slug = project.slug?.trim() || slugify(project.title ?? "");
      if (!slug || !project.title?.trim() || !project.description?.trim()) continue;

      await prisma.project.create({
        data: {
          slug,
          title: project.title.trim(),
          description: project.description.trim(),
          category: project.category?.trim() || "UI/UX",
          imageSrc: project.imageSrc?.trim() || "/images/projects/workspace.jpg",
          href: cleanOptional(project.href) ?? `/nos-projets/${slug}`,
          tags: Array.isArray(project.tags) ? project.tags.filter(Boolean) : [],
          position,
          isPublished: true,
        },
      });
    }
  }

  if (section === "productsPage") {
    const items = Array.isArray(data.items) ? (data.items as ProductInput[]) : [];

    await prisma.productGalleryImage.deleteMany({});
    await prisma.product.deleteMany({});

    for (const [position, product] of items.entries()) {
      const slug = product.slug?.trim() || slugify(product.name ?? "");
      if (!slug || !product.name?.trim() || !product.description?.trim()) continue;

      const savedProduct = await prisma.product.create({
        data: {
          slug,
          name: product.name.trim(),
          onlineUrl: cleanOptional(product.onlineUrl),
          shortDescription: cleanOptional(product.shortDescription),
          description: product.description.trim(),
          theme: product.theme === "purple" ? ProductTheme.PURPLE : ProductTheme.RED,
          imageSrc: product.imageSrc?.trim() || "/images/products/setly.jpg",
          rightImageSrc: cleanOptional(product.rightImageSrc),
          position,
          isPublished: true,
        },
      });

      for (const [galleryPosition, image] of (product.gallery ?? []).entries()) {
        if (!image.src?.trim()) continue;

        await prisma.productGalleryImage.create({
          data: {
            productId: savedProduct.id,
            src: image.src.trim(),
            alt: image.alt?.trim() || `${product.name} - aperçu ${galleryPosition + 1}`,
            position: galleryPosition,
          },
        });
      }
    }
  }

  if (section === "team") {
    const members = Array.isArray(data.members) ? (data.members as TeamMemberInput[]) : [];

    await prisma.teamMember.deleteMany({});

    for (const [position, member] of members.entries()) {
      if (!member.name?.trim() || !member.role?.trim()) continue;

      await prisma.teamMember.create({
        data: {
          id: `team-${position + 1}`,
          name: member.name.trim(),
          role: member.role.trim(),
          bio: cleanOptional(member.bio),
          imageSrc: cleanOptional(member.img),
          linkedin: cleanOptional(member.socials?.linkedin),
          twitter: cleanOptional(member.socials?.twitter),
          instagram: cleanOptional(member.socials?.instagram),
          position,
          isActive: true,
        },
      });
    }
  }
}

export async function updateContent(section: string, data: unknown) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) {
      return { success: false, error: "Non autorisé." };
    }

    if (!ALLOWED_SECTIONS.has(section)) {
      return { success: false, error: "Section invalide." };
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { success: false, error: "Données invalides pour la mise à jour." };
    }


    const [content, dbSection] = await Promise.all([
      readContentJson(),
      prisma.cmsSection.findUnique({ where: { key: section } }),
    ]);

    const currentSection = mergeContentValue(
      asRecord(content[section]),
      asRecord(dbSection?.data)
    ) as Record<string, unknown>;
    content[section] = mergeContentValue(currentSection, data) as Record<string, unknown>;

    await syncSectionToPrisma(section, content[section] as Record<string, unknown>);

    const syncedContent = await mergeCmsSectionsIntoContent(content);

    const { used } = await writeJsonWithFallback(
      CONTENT_PATH,
      CONTENT_FALLBACK_PATH,
      syncedContent
    );


    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/content");
    revalidatePath("/admin/partners");
    revalidatePath("/admin/products");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/team");
    revalidatePath("/admin/services");
    revalidatePath("/client");
    revalidatePath("/a-propos");
    revalidatePath("/contact");
    revalidatePath("/nos-produits");
    revalidatePath("/nos-projets");
    revalidatePath("/privacy");
    revalidatePath("/services");
    revalidatePath("/terms");
    revalidateTag("public-products", "max");
    revalidateTag("public-projects", "max");
    revalidateTag("public-partners", "max");
    revalidateTag("public-team", "max");
    revalidateTag("public-services", "max");
    revalidateTag("public-site-content", "max");

    await logAuditEvent("CMS_UPDATE", `Mise à jour de la section CMS : ${section}`, `Clé de section: ${section}`);

    return { success: true, storage: used };
  } catch (error) {
    console.error("Failed to update content:", error);
    return { success: false, error: "Erreur lors de la sauvegarde du contenu." };
  }
}
