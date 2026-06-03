import ProductsHero from "@/components/client/products/ProductsHero";
import ProductShowcase from "@/components/client/products/ProductShowcase";
import ProductValueCards from "@/components/client/products/ProductValueCards";
import ProductsFinalSection from "@/components/client/products/ProductsFinalSection";
import { UtensilsCrossed, Type } from "lucide-react";
import path from "path";
import { readJsonPreferFallback, tmpDataPath } from "@/lib/server/json-store";

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
  return readJsonPreferFallback<{ productsPage?: { items?: ProductItem[] } }>(
    filePath,
    tmpDataPath("site-content.json"),
    {}
  );
}

export default async function NosProduit() {
  const content = await readSiteContent();
  const items = content.productsPage?.items ?? [];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <ProductsHero />

      {items.map((product, idx) => {
        const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-");
        const isRed = product.theme === "red";
        
        return (
          <div key={slug}>
            <ProductShowcase
              name={product.name}
              description={product.description}
              imageSrc={product.imageSrc}
              rightImageSrc={product.rightImageSrc}
              theme={product.theme}
              layout="split"
              rightVariant={idx % 2 === 1 ? "panel" : undefined}
              icon={isRed ? <UtensilsCrossed className="w-6/6 text-slate-700" /> : <Type className="w-6/6 text-slate-700" />}
              ctas={[
                { label: "Découvrir", href: `/nos-produits/${slug}` },
                ...(product.onlineUrl
                  ? [
                      {
                        label: "Explorer le système",
                        href: product.onlineUrl,
                        external: true,
                      },
                    ]
                  : []),
              ]}
            />
            <ProductValueCards
              theme={product.theme}
              cards={[
                {
                  title: "Croissance",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh",
                },
                {
                  title: "Évolution",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh",
                },
              ]}
            />
          </div>
        );
      })}

      <ProductsFinalSection />
    </div>
  );
}