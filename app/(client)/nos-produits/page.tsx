import { siteContent } from "@/constants/site-content";

export default function NosProduit() {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-heading font-black text-fluxion-blue mb-4">
        {siteContent.products.title}
      </h1>
    </div>
  );
}
