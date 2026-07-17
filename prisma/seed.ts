import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient, ProductTheme } from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

type SiteContent = {
  features?: {
    items?: Array<{
      title: string;
      description: string;
      moreLabel?: string;
      imageSrc?: string;
      gallery?: Array<{ src: string; alt: string }>;
    }>;
    more?: string;
  };
  partners?: {
    logos?: Array<{ name: string; logoSrc: string; website?: string }>;
  };
  projectsPage?: {
    items?: Array<{
      slug: string;
      title: string;
      description: string;
      category: string;
      imageSrc: string;
      href?: string;
      tags?: string[];
    }>;
  };
  productsPage?: {
    items?: Array<{
      slug: string;
      name: string;
      onlineUrl?: string;
      shortDescription?: string;
      description: string;
      theme?: "red" | "purple";
      imageSrc: string;
      rightImageSrc?: string;
      gallery?: Array<{ src: string; alt: string }>;
    }>;
  };
  team?: {
    members?: Array<{
      name: string;
      role: string;
      bio?: string;
      img?: string;
      socials?: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
      };
    }>;
  };
  [key: string]: unknown;
};

const siteContentPath = path.join(process.cwd(), "constants", "site-content.json");
const siteContent = JSON.parse(fs.readFileSync(siteContentPath, "utf8")) as SiteContent;

function cleanNullable(value?: string | null) {
  const clean = value?.trim();
  return clean ? clean : null;
}

function toProductTheme(theme?: "red" | "purple") {
  return theme === "purple" ? ProductTheme.PURPLE : ProductTheme.RED;
}

async function seedAdminUser() {
  const email = cleanNullable(process.env.FLUXION_ADMIN_EMAIL)?.toLowerCase();
  const password = cleanNullable(process.env.FLUXION_ADMIN_PASSWORD);

  if (!email || !password) {
    console.warn("Admin seed skipped: FLUXION_ADMIN_EMAIL or FLUXION_ADMIN_PASSWORD is missing.");
    return null;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.adminUser.upsert({
    where: { email },
    create: {
      email,
      name: "Fluxion Admin",
      role: "SUPER_ADMIN",
      salt: "bcrypt",
      passwordHash,
    },
    update: {
      name: "Fluxion Admin",
      role: "SUPER_ADMIN",
      salt: "bcrypt",
      passwordHash,
      deletedAt: null,
    },
  });
}

async function seedCmsSections(adminId?: string) {
  const entries = Object.entries(siteContent);

  for (const [key, data] of entries) {
    await prisma.cmsSection.upsert({
      where: { key },
      create: {
        key,
        title: key,
        data: data as object,
        updatedById: adminId,
      },
      update: {
        title: key,
        data: data as object,
        updatedById: adminId,
      },
    });
  }
}

async function seedServiceFeatures() {
  const items = siteContent.features?.items ?? [];

  for (const [position, item] of items.entries()) {
    await prisma.serviceFeature.upsert({
      where: { id: `seed-feature-${position + 1}` },
      create: {
        id: `seed-feature-${position + 1}`,
        title: item.title,
        description: item.description,
        moreLabel: item.moreLabel ?? siteContent.features?.more,
        imageSrc: cleanNullable(item.imageSrc),
        gallery: item.gallery ?? [],
        position,
        isActive: true,
      },
      update: {
        title: item.title,
        description: item.description,
        moreLabel: item.moreLabel ?? siteContent.features?.more,
        imageSrc: cleanNullable(item.imageSrc),
        gallery: item.gallery ?? [],
        position,
        isActive: true,
      },
    });
  }
}

async function seedPartners() {
  const logos = siteContent.partners?.logos ?? [];

  for (const [position, partner] of logos.entries()) {
    await prisma.partner.upsert({
      where: { id: `seed-partner-${partner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
      create: {
        id: `seed-partner-${partner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: partner.name,
        logoSrc: partner.logoSrc,
        website: cleanNullable(partner.website),
        position,
        isActive: true,
      },
      update: {
        name: partner.name,
        logoSrc: partner.logoSrc,
        website: cleanNullable(partner.website),
        position,
        isActive: true,
      },
    });
  }
}

async function seedProjects() {
  const projects = siteContent.projectsPage?.items ?? [];

  for (const [position, project] of projects.entries()) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      create: {
        slug: project.slug,
        title: project.title,
        description: project.description,
        category: project.category,
        imageSrc: project.imageSrc,
        href: cleanNullable(project.href),
        tags: project.tags ?? [],
        position,
        isPublished: true,
      },
      update: {
        title: project.title,
        description: project.description,
        category: project.category,
        imageSrc: project.imageSrc,
        href: cleanNullable(project.href),
        tags: project.tags ?? [],
        position,
        isPublished: true,
      },
    });
  }
}

async function seedProducts() {
  const products = siteContent.productsPage?.items ?? [];

  for (const [position, product] of products.entries()) {
    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        slug: product.slug,
        name: product.name,
        onlineUrl: cleanNullable(product.onlineUrl),
        shortDescription: cleanNullable(product.shortDescription),
        description: product.description,
        theme: toProductTheme(product.theme),
        imageSrc: product.imageSrc,
        rightImageSrc: cleanNullable(product.rightImageSrc),
        position,
        isPublished: true,
      },
      update: {
        name: product.name,
        onlineUrl: cleanNullable(product.onlineUrl),
        shortDescription: cleanNullable(product.shortDescription),
        description: product.description,
        theme: toProductTheme(product.theme),
        imageSrc: product.imageSrc,
        rightImageSrc: cleanNullable(product.rightImageSrc),
        position,
        isPublished: true,
      },
    });

    await prisma.productGalleryImage.deleteMany({
      where: { productId: savedProduct.id },
    });

    for (const [galleryPosition, image] of (product.gallery ?? []).entries()) {
      await prisma.productGalleryImage.create({
        data: {
          productId: savedProduct.id,
          src: image.src,
          alt: image.alt,
          position: galleryPosition,
        },
      });
    }
  }
}

async function seedTeamMembers() {
  const members = siteContent.team?.members ?? [];

  for (const [position, member] of members.entries()) {
    await prisma.teamMember.upsert({
      where: { id: `seed-team-${position + 1}` },
      create: {
        id: `seed-team-${position + 1}`,
        name: member.name,
        role: member.role,
        bio: cleanNullable(member.bio),
        imageSrc: cleanNullable(member.img),
        linkedin: cleanNullable(member.socials?.linkedin),
        twitter: cleanNullable(member.socials?.twitter),
        instagram: cleanNullable(member.socials?.instagram),
        position,
        isActive: true,
      },
      update: {
        name: member.name,
        role: member.role,
        bio: cleanNullable(member.bio),
        imageSrc: cleanNullable(member.img),
        linkedin: cleanNullable(member.socials?.linkedin),
        twitter: cleanNullable(member.socials?.twitter),
        instagram: cleanNullable(member.socials?.instagram),
        position,
        isActive: true,
      },
    });
  }
}

async function main() {
  const admin = await seedAdminUser();
  await seedCmsSections(admin?.id);
  await seedServiceFeatures();
  await seedPartners();
  await seedProjects();
  await seedProducts();
  await seedTeamMembers();

  const counts = {
    admins: await prisma.adminUser.count(),
    cmsSections: await prisma.cmsSection.count(),
    serviceFeatures: await prisma.serviceFeature.count(),
    partners: await prisma.partner.count(),
    projects: await prisma.project.count(),
    products: await prisma.product.count(),
    galleryImages: await prisma.productGalleryImage.count(),
    teamMembers: await prisma.teamMember.count(),
  };

  console.log("Fluxion seed completed", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
