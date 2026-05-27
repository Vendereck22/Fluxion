"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductGallery, { type ProductGalleryImage } from "./ProductGallery";

export type ProductDetailData = {
  slug: string;
  name: string;
  shortDescription?: string;
  description: string;
  theme: "red" | "purple";
  imageSrc: string;
  rightImageSrc?: string;
  gallery?: ProductGalleryImage[];
};

export default function ProductDetail({ product }: { product: ProductDetailData }) {
  return (
    <div className="w-full bg-slate-50">
      <section className="pt-28 pb-14">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-6">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/nos-produits" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour aux produits
              </Link>
            </Button>
          </div>

          <Card className="overflow-hidden border border-slate-200/70 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[360px] md:min-h-[440px]">
              <div className="relative">
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="relative">
                <Image
                  src={product.rightImageSrc ?? product.imageSrc}
                  alt={`${product.name} preview`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-fluxion-rose text-white flex items-center justify-center shadow-xl shadow-fluxion-rose/20">
                    <ArrowUpRight className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-10 md:p-14">
              <div className="flex items-center gap-3">
                <Badge className="rounded-full bg-fluxion-rose/10 text-fluxion-rose border-fluxion-rose/20">
                  Produit
                </Badge>
                <Badge className="rounded-full bg-slate-50 text-slate-700 border-slate-200">
                  {product.theme.toUpperCase()}
                </Badge>
              </div>

              <h1 className="mt-5 text-4xl md:text-6xl font-heading font-black text-fluxion-blue tracking-tight">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-4 text-slate-600 text-base md:text-lg">
                  {product.shortDescription}
                </p>
              )}
              <p className="mt-6 text-slate-700/90 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-slate-200/70 bg-slate-50">
                  <CardContent className="p-7">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Presentation
                    </p>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                      Un produit concu pour offrir une experience simple, rapide et elegante.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200/70 bg-slate-50">
                  <CardContent className="p-7">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Points forts
                    </p>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                      Interface claire, performance, et mise a l'echelle facile.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200/70 bg-slate-50">
                  <CardContent className="p-7">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Suite
                    </p>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                      Ajout de nouvelles fonctionnalites, tableau de bord et integr. paiements.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <ProductGallery
                images={product.gallery ?? []}
                theme={product.theme}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}