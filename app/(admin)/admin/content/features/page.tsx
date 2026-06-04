import { getContentSection } from "@/app/actions/content";
import { siteContent } from "@/constants/site-content";
import FeaturesEditorClient from "./FeaturesEditorClient";

type FeatureItem = {
  title: string;
  description: string;
};

type FeaturesData = {
  badge?: unknown;
  title?: unknown;
  more?: unknown;
  items?: unknown;
};

function text(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function items(value: unknown): FeatureItem[] {
  if (!Array.isArray(value)) return siteContent.features.items;

  return value.map((item, index) => {
    const fallback = siteContent.features.items[index] ?? {
      title: "Service Fluxion",
      description: "Expertise Fluxion.",
    };

    return {
      title:
        item && typeof item === "object" && "title" in item && typeof item.title === "string"
          ? item.title
          : fallback.title,
      description:
        item && typeof item === "object" && "description" in item && typeof item.description === "string"
          ? item.description
          : fallback.description,
    };
  });
}

export default async function FeaturesEditorPage() {
  const result = await getContentSection("features");
  const data = (result.success ? result.data : {}) as FeaturesData;

  return (
    <FeaturesEditorClient
      initialData={{
        badge: text(data.badge, siteContent.features.badge),
        title: text(data.title, siteContent.features.title),
        more: text(data.more, siteContent.features.more),
        items: items(data.items),
      }}
    />
  );
}
