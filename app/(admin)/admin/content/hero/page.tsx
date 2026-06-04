import { getContentSection } from "@/app/actions/content";
import { siteContent } from "@/constants/site-content";
import HeroEditorClient from "./HeroEditorClient";

type HeroData = {
  badge?: unknown;
  title?: unknown;
  description?: unknown;
  cta?: unknown;
};

function text(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export default async function HeroEditorPage() {
  const result = await getContentSection("hero");
  const data = (result.success ? result.data : {}) as HeroData;

  return (
    <HeroEditorClient
      initialData={{
        badge: text(data.badge, siteContent.hero.badge),
        title: text(data.title, siteContent.hero.title),
        description: text(data.description, siteContent.hero.description),
        cta: text(data.cta, siteContent.hero.cta),
      }}
    />
  );
}
