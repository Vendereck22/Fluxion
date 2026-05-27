import ProductsHero from "@/components/client/products/ProductsHero";
import ProductShowcase from "@/components/client/products/ProductShowcase";
import ProductValueCards from "@/components/client/products/ProductValueCards";
import ProductsFinalSection from "@/components/client/products/ProductsFinalSection";
import { UtensilsCrossed, Type } from "lucide-react";
import { siteContent } from "@/constants/site-content";

export default function NosProduit() {
  const setlyOnlineUrl =
    siteContent.productsPage?.items?.find((p) => p.slug === "setly")?.onlineUrl || "";
  const trimOnlineUrl =
    siteContent.productsPage?.items?.find((p) => p.slug === "trim")?.onlineUrl || "";

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <ProductsHero />

      {/* Produit 1: Setly */}
      <ProductShowcase
        name="Setly"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel"
        imageSrc="/images/products/setly-restaurant-1.jpg"
        rightImageSrc="/images/products/setly-restaurant-2.jpg"
        theme="red"
        layout="split"
        icon={<UtensilsCrossed className="w-6 h-6" />}
        ctas={[
          { label: "Découvrir", href: "/nos-produits/setly" },
          ...(setlyOnlineUrl
            ? [
                {
                  label: "Explorer le systeme",
                  href: setlyOnlineUrl,
                  external: true,
                },
              ]
            : []),
        ]}
      />
      <ProductValueCards
        theme="red"
        cards={[
          {
            title: "Croissance",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh",
          },
          {
            title: "Evolution",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh",
          },
        ]}
      />

      {/* Produit 2: Trim */}
      <ProductShowcase
        name="Trim"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel"
        imageSrc="/images/products/trim.jpg"
        theme="purple"
        layout="split"
        rightVariant="panel"
        icon={<Type className="w-6 h-6" />}
        ctas={[
          { label: "Découvrir", href: "/nos-produits/trim" },
          ...(trimOnlineUrl
            ? [
                {
                  label: "Explorer le systeme",
                  href: trimOnlineUrl,
                  external: true,
                },
              ]
            : []),
        ]}
      />
      <ProductValueCards
        theme="purple"
        cards={[
          {
            title: "Croissance",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh",
          },
          {
            title: "Evolution",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh",
          },
        ]}
      />

      <ProductsFinalSection />
    </div>
  );
}
