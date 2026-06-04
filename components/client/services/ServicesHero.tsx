export default function ServicesHero({
  title = "Nos services",
  description = "Fluxion accompagne les marques, entrepreneurs et organisations dans la creation de supports visuels, plateformes web, contenus video et solutions techniques.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-white pt-28 md:pt-36 pb-16 md:pb-20 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-heading font-normal tracking-tight text-fluxion-rose">
          {title}
        </h1>
        <p className="max-w-5xl mx-auto text-sm md:text-base text-slate-800 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </section>
  );
}
