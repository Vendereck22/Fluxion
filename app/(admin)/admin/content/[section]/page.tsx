import { notFound } from "next/navigation";
import { getContentSection } from "@/app/actions/content";
import GenericContentEditor, { type JsonValue } from "./GenericContentEditor";

const SECTION_META: Record<string, { title: string; description: string }> = {
  brand: {
    title: "Marque",
    description: "Modifiez le nom, la tagline, la description et les textes légaux.",
  },
  navigation: {
    title: "Navigation",
    description: "Modifiez les libellés et liens du menu principal.",
  },
  approach: {
    title: "Méthode",
    description: "Modifiez les textes des étapes de l'approche Fluxion.",
  },
  whyUs: {
    title: "Pourquoi nous",
    description: "Modifiez les chiffres clés et arguments de réassurance.",
  },
  process: {
    title: "Processus",
    description: "Modifiez les étapes de processus affichées sur le site.",
  },
  testimonials: {
    title: "Témoignages",
    description: "Modifiez les avis et citations affichés sur le site.",
  },
  faq: {
    title: "FAQ",
    description: "Modifiez les questions et réponses fréquentes.",
  },
  newsletter: {
    title: "Newsletter",
    description: "Modifiez les textes du bloc d'inscription newsletter.",
  },
  finalCta: {
    title: "CTA final",
    description: "Modifiez le dernier appel à l'action du site.",
  },
  video: {
    title: "Section vidéo",
    description: "Modifiez les textes de la section vidéo immersive.",
  },
  pages: {
    title: "Pages",
    description: "Modifiez les titres et descriptions des pages principales.",
  },
  products: {
    title: "Textes produits",
    description: "Modifiez les textes généraux de la page produits.",
  },
  aboutPage: {
    title: "À propos",
    description: "Modifiez les textes Qui sommes-nous, mission et vision.",
  },
  footer: {
    title: "Footer",
    description: "Modifiez les coordonnées et textes du pied de page.",
  },
  social: {
    title: "Réseaux sociaux",
    description: "Modifiez les textes et plateformes sociales.",
  },
};

export default async function GenericContentPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const meta = SECTION_META[section];

  if (!meta) notFound();

  const result = await getContentSection(section);

  if (!result.success || !result.data) notFound();

  return (
    <GenericContentEditor
      section={section}
      meta={meta}
      initialData={result.data as JsonValue}
    />
  );
}
