import fs from "fs/promises";
import path from "path";
import ProductsManager from "./ProductsManager";
import { LuPackage } from "react-icons/lu";

export const revalidate = 0;

export default async function ProductsCMSPage() {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  let products = [];

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    products = data.productsPage?.items || [];
  } catch (error) {
    console.error("Failed to read site-content.json for products CMS:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <LuPackage className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              GESTION DES PRODUITS
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            CMS Dynamique : Modifiez les descriptions, images, liens et thèmes des produits de l'agence.
          </p>
        </div>
      </div>

      <ProductsManager initialProducts={products} />
    </div>
  );
}
