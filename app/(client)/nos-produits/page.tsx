import ProductsHero from "@/components/client/products/ProductsHero";
import ProductShowcase from "@/components/client/products/ProductShowcase";
import ProductValueCards from "@/components/client/products/ProductValueCards";
import ProductsFinalSection from "@/components/client/products/ProductsFinalSection";
import { UtensilsCrossed, Type } from "lucide-react";
import { getPublicProducts } from "@/lib/server/public-content";

export const revalidate = 300;

export default async function NosProduit() {
  const items = await getPublicProducts();

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <ProductsHero />

      {items.map((product, idx) => {
        const slug = product.slug;
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
                    "Des outils pensés pour structurer l'activité, gagner du temps et soutenir une croissance durable.",
                },
                {
                  title: "Évolution",
                  description:
                    "Une base digitale évolutive, capable de s'adapter aux nouveaux usages et aux ambitions du projet.",
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
