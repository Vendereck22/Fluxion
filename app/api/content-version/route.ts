import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TimestampInput = Date | string | null | undefined;

function timestamp(value: TimestampInput) {
  if (!value) return 0;
  return new Date(value).getTime();
}

async function getLatestSiteVersion() {
  const [cms, leads, subscribers, campaigns, partners, services, team, projects, products, media] =
    await Promise.all([
      prisma.cmsSection.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.lead.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.subscriber.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.newsletterCampaign.findFirst({ orderBy: { sentAt: "desc" }, select: { sentAt: true } }),
      prisma.partner.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.serviceFeature.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.teamMember.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.project.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.product.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.mediaAsset.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    ]);

  const latest = Math.max(
    timestamp(cms?.updatedAt),
    timestamp(leads?.updatedAt),
    timestamp(subscribers?.updatedAt),
    timestamp(campaigns?.sentAt),
    timestamp(partners?.updatedAt),
    timestamp(services?.updatedAt),
    timestamp(team?.updatedAt),
    timestamp(projects?.updatedAt),
    timestamp(products?.updatedAt),
    timestamp(media?.createdAt),
  );

  return latest || Date.now();
}

export async function GET() {
  try {
    const version = await getLatestSiteVersion();

    return NextResponse.json(
      { version },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Failed to read content version:", error);

    return NextResponse.json(
      { version: Date.now(), degraded: true },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    );
  }
}
