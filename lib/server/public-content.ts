import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import siteContent from "@/constants/site-content.json";
import type { SiteContent } from "@/constants/site-content";

export type PublicProduct = {
  slug: string;
  name: string;
  onlineUrl?: string;
  shortDescription?: string;
  description: string;
  theme: "red" | "purple";
  imageSrc: string;
  rightImageSrc?: string;
  gallery: { src: string; alt: string }[];
};

export type PublicProject = {
  slug: string;
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags: string[];
  href?: string;
};

export type PublicPartner = {
  name: string;
  logoSrc: string;
  website?: string;
};

export type PublicTeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  img: string;
  socials: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
};

export type PublicServiceFeature = {
  title: string;
  description: string;
  moreLabel?: string;
  imageSrc?: string;
  gallery: { src: string; alt: string }[];
};

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

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

async function loadPublicSiteContent(): Promise<SiteContent> {
  try {
    const sections = await prisma.cmsSection.findMany();
    const merged = sections.reduce<Record<string, unknown>>(
      (content, section) => {
        content[section.key] = mergeContentValue(content[section.key], section.data);
        return content;
      },
      { ...(siteContent as Record<string, unknown>) }
    );

    return merged as SiteContent;
  } catch {
    return siteContent as SiteContent;
  }
}

function fallbackPublicProducts(): PublicProduct[] {
  const items = Array.isArray(siteContent.productsPage?.items)
    ? siteContent.productsPage.items
    : [];

  return items.map((product) => ({
    slug: stringValue(product.slug, "produit"),
    name: stringValue(product.name, "Produit Fluxion"),
    onlineUrl: stringValue(product.onlineUrl) || undefined,
    shortDescription: stringValue(product.shortDescription) || undefined,
    description: stringValue(product.description, "Produit digital conçu par Fluxion."),
    theme: product.theme === "purple" ? "purple" : "red",
    imageSrc: stringValue(product.imageSrc, "/images/products/setly.jpg"),
    rightImageSrc: stringValue(product.rightImageSrc) || undefined,
    gallery: Array.isArray(product.gallery)
      ? product.gallery.map((image) => ({
          src: stringValue(image.src, "/images/products/setly.jpg"),
          alt: stringValue(image.alt, stringValue(product.name, "Produit Fluxion")),
        }))
      : [],
  }));
}

function fallbackPublicProjects(): PublicProject[] {
  const items = Array.isArray(siteContent.projectsPage?.items)
    ? siteContent.projectsPage.items
    : [];

  return items.map((project) => ({
    slug: stringValue(project.slug, "projet"),
    title: stringValue(project.title, "Projet Fluxion"),
    description: stringValue(project.description, "Réalisation Fluxion."),
    category: stringValue(project.category, "Fluxion"),
    imageSrc: stringValue(project.imageSrc, "/images/projects/team-collab.jpg"),
    tags: Array.isArray(project.tags) ? project.tags.map((tag) => String(tag)) : [],
    href: stringValue(project.href) || `/nos-projets/${stringValue(project.slug, "projet")}`,
  }));
}

function fallbackPublicPartners() {
  const logos = Array.isArray(siteContent.partners?.logos)
    ? siteContent.partners.logos
    : [];

  return {
    badge: stringValue(siteContent.partners?.badge, "Ils propulsent leur vision avec nous"),
    logos: logos
      .map((partner) => ({
        name: stringValue(partner.name, "Partenaire"),
        logoSrc: stringValue(partner.logoSrc),
        website: stringValue(partner.website) || undefined,
      }))
      .filter((partner) => partner.logoSrc),
  };
}

function fallbackPublicTeam() {
  const members = Array.isArray(siteContent.team?.members)
    ? siteContent.team.members
    : [];

  return {
    title: stringValue(siteContent.team?.title, "NOTRE EQUIPE"),
    members: members
      .map<PublicTeamMember>((member, index) => ({
        id: typeof member.id === "number" ? member.id : index + 1,
        name: stringValue(member.name, "Membre Fluxion"),
        role: stringValue(member.role, "Equipe Fluxion"),
        bio: stringValue(member.bio),
        img: stringValue(member.img),
        socials: {
          linkedin: stringValue(member.socials?.linkedin),
          twitter: stringValue(member.socials?.twitter),
          instagram: stringValue(member.socials?.instagram),
        },
      }))
      .filter((member) => member.img),
  };
}

function fallbackPublicServiceFeatures() {
  const items = Array.isArray(siteContent.features?.items)
    ? siteContent.features.items
    : [];

  return {
    badge: stringValue(siteContent.features?.badge, "Nos Piliers"),
    title: stringValue(siteContent.features?.title, "Nos services"),
    description:
      "Fluxion accompagne les marques, entrepreneurs et organisations dans la creation de supports visuels, plateformes web, contenus video et solutions techniques.",
    more: stringValue(siteContent.features?.more, "En savoir plus"),
    items: items.map<PublicServiceFeature>((feature) => ({
      title: stringValue(feature.title, "Service Fluxion"),
      description: stringValue(feature.description, "Expertise Fluxion."),
      imageSrc: undefined,
      gallery: [],
    })),
  };
}

async function loadPublicProducts(): Promise<PublicProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      include: { gallery: { orderBy: { position: "asc" } } },
      orderBy: { position: "asc" },
    });

    return products.map((product) => ({
      slug: product.slug,
      name: product.name,
      onlineUrl: product.onlineUrl ?? undefined,
      shortDescription: product.shortDescription ?? undefined,
      description: product.description,
      theme: product.theme === "PURPLE" ? "purple" : "red",
      imageSrc: product.imageSrc,
      rightImageSrc: product.rightImageSrc ?? undefined,
      gallery: product.gallery.map((image) => ({ src: image.src, alt: image.alt })),
    }));
  } catch {
    return fallbackPublicProducts();
  }
}

async function loadPublicProjects(): Promise<PublicProject[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { position: "asc" },
    });

    return projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      category: project.category,
      imageSrc: project.imageSrc,
      tags: project.tags,
      href: project.href ?? `/nos-projets/${project.slug}`,
    }));
  } catch {
    return fallbackPublicProjects();
  }
}

async function loadPublicPartners() {
  try {
    const [section, partners] = await Promise.all([
      prisma.cmsSection.findUnique({ where: { key: "partners" } }),
      prisma.partner.findMany({ where: { isActive: true }, orderBy: { position: "asc" } }),
    ]);
    const data = asRecord(section?.data);

    return {
      badge: stringValue(data.badge, "Ils propulsent leur vision avec nous"),
      logos: partners.map((partner) => ({
        name: partner.name,
        logoSrc: partner.logoSrc,
        website: partner.website ?? undefined,
      })).filter((partner) => partner.logoSrc),
    };
  } catch {
    return fallbackPublicPartners();
  }
}

async function loadPublicTeam() {
  try {
    const [section, members] = await Promise.all([
      prisma.cmsSection.findUnique({ where: { key: "team" } }),
      prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { position: "asc" } }),
    ]);
    const data = asRecord(section?.data);

    return {
      title: stringValue(data.title, "NOTRE EQUIPE"),
      members: members.map<PublicTeamMember>((member, index) => ({
        id: index + 1,
        name: member.name,
        role: member.role,
        bio: member.bio ?? "",
        img: member.imageSrc ?? "",
        socials: {
          linkedin: member.linkedin ?? "",
          twitter: member.twitter ?? "",
          instagram: member.instagram ?? "",
        },
      })).filter((member) => member.img),
    };
  } catch {
    return fallbackPublicTeam();
  }
}

async function loadPublicServiceFeatures() {
  try {
    const [section, features] = await Promise.all([
      prisma.cmsSection.findUnique({ where: { key: "features" } }),
      prisma.serviceFeature.findMany({ where: { isActive: true }, orderBy: { position: "asc" } }),
    ]);
    const data = asRecord(section?.data);

    return {
      badge: stringValue(data.badge, "Nos Piliers"),
      title: stringValue(data.title, "Nos services"),
      description:
        "Fluxion accompagne les marques, entrepreneurs et organisations dans la creation de supports visuels, plateformes web, contenus video et solutions techniques.",
      more: stringValue(data.more, "En savoir plus"),
      items: features.map<PublicServiceFeature>((feature) => ({
        title: feature.title,
        description: feature.description,
        moreLabel: feature.moreLabel ?? undefined,
        imageSrc: feature.imageSrc ?? undefined,
        gallery: Array.isArray(feature.gallery)
          ? feature.gallery
              .map((image) => {
                const record = asRecord(image);
                return {
                  src: stringValue(record.src),
                  alt: stringValue(record.alt, feature.title),
                };
              })
              .filter((image) => image.src)
          : [],
      })),
    };
  } catch {
    return fallbackPublicServiceFeatures();
  }
}

export const getPublicProducts = unstable_cache(
  loadPublicProducts,
  ["public-products"],
  { revalidate: 1, tags: ["public-products"] }
);

export const getPublicProjects = unstable_cache(
  loadPublicProjects,
  ["public-projects"],
  { revalidate: 1, tags: ["public-projects"] }
);

export const getPublicPartners = unstable_cache(
  loadPublicPartners,
  ["public-partners"],
  { revalidate: 1, tags: ["public-partners"] }
);

export const getPublicTeam = unstable_cache(
  loadPublicTeam,
  ["public-team"],
  { revalidate: 1, tags: ["public-team"] }
);

export const getPublicServiceFeatures = unstable_cache(
  loadPublicServiceFeatures,
  ["public-services"],
  { revalidate: 1, tags: ["public-services"] }
);

export const getPublicSiteContent = unstable_cache(
  loadPublicSiteContent,
  ["public-site-content"],
  { revalidate: 1, tags: ["public-site-content"] }
);
