import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

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
};

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

async function loadPublicProducts(): Promise<PublicProduct[]> {
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
}

async function loadPublicProjects(): Promise<PublicProject[]> {
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
}

async function loadPublicPartners() {
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
    })),
  };
}

async function loadPublicTeam() {
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
      img: member.imageSrc ?? "/images/about/team.jpg",
      socials: {
        linkedin: member.linkedin ?? "",
        twitter: member.twitter ?? "",
        instagram: member.instagram ?? "",
      },
    })),
  };
}

async function loadPublicServiceFeatures() {
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
    })),
  };
}

export const getPublicProducts = unstable_cache(
  loadPublicProducts,
  ["public-products"],
  { revalidate: 300, tags: ["public-products"] }
);

export const getPublicProjects = unstable_cache(
  loadPublicProjects,
  ["public-projects"],
  { revalidate: 300, tags: ["public-projects"] }
);

export const getPublicPartners = unstable_cache(
  loadPublicPartners,
  ["public-partners"],
  { revalidate: 300, tags: ["public-partners"] }
);

export const getPublicTeam = unstable_cache(
  loadPublicTeam,
  ["public-team"],
  { revalidate: 300, tags: ["public-team"] }
);

export const getPublicServiceFeatures = unstable_cache(
  loadPublicServiceFeatures,
  ["public-services"],
  { revalidate: 300, tags: ["public-services"] }
);
