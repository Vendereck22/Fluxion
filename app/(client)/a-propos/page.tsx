import AboutHero from "@/components/client/about/AboutHero";
import AboutPillars from "@/components/client/about/AboutPillars";
import AboutVisual from "@/components/client/about/AboutVisual";

export default function APropos() {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <AboutHero />
      <AboutPillars />
      <AboutVisual />

    </div>
  );
}