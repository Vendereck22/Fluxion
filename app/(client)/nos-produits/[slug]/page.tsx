import { notFound } from "next/navigation";
import ProductDetail from "@/components/client/products/ProductDetail";
import { getPublicProducts } from "@/lib/server/public-content";

export const revalidate = 1;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const items = await getPublicProducts();
  const { slug } = await params;

  const product = items.find((p) => p.slug === slug);

  if (!product) notFound();

  return (
    <ProductDetail
      product={{
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        theme: product.theme,
        imageSrc: product.imageSrc,
        rightImageSrc: product.rightImageSrc,
        gallery: product.gallery,
      }}
    />
  );
}

export async function generateStaticParams() {
  const items = await getPublicProducts();
  return items.map((p) => ({
    slug: p.slug,
  }));
}
