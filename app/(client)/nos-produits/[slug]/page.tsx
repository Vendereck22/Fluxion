import { notFound } from "next/navigation";
import { slugify } from "@/lib/slug";
import ProductDetail from "@/components/client/products/ProductDetail";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductItem = {
  slug?: string;
  name: string;
  onlineUrl?: string;
  shortDescription?: string;
  description: string;
  theme: "red" | "purple";
  imageSrc: string;
  rightImageSrc?: string;
  gallery?: { src: string; alt: string }[];
};

async function readSiteContent(): Promise<{ productsPage?: { items?: ProductItem[] } }> {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as { productsPage?: { items?: ProductItem[] } };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const content = await readSiteContent();
  const items = content.productsPage?.items ?? [];
  const { slug } = await params;

  const product = items.find((p) => {
    const s = p.slug ?? slugify(p.name ?? "");
    return s === slug;
  });

  if (!product) notFound();

  return (
    <ProductDetail
      product={{
        slug: product.slug ?? slugify(product.name),
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        theme: product.theme,
        imageSrc: product.imageSrc,
        rightImageSrc: product.rightImageSrc,
        gallery: product.gallery ?? [],
      }}
    />
  );
}

export async function generateStaticParams() {
  const content = await readSiteContent();
  const items = content.productsPage?.items ?? [];
  return items.map((p) => ({
    slug: p.slug ?? slugify(p.name ?? ""),
  }));
}
