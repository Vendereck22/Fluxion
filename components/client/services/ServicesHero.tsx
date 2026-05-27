const HERO_COPY =
  "Lorem ipsum dolor sit amet, consectetuerLorem ipsum dolor sit amet, consectetuer Lorem ipsum\n" +
  "dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet,\n" +
  "consectetuer Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consectetuer\n" +
  "Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consectetuer Lorem ipsum\n" +
  "dolor sit amet, consectetuer";

export default function ServicesHero() {
  return (
    <section className="bg-white pt-28 md:pt-36 pb-16 md:pb-20 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-heading font-normal tracking-tight text-fluxion-rose">
          Nos services
        </h1>
        <p className="max-w-5xl mx-auto text-sm md:text-base text-slate-800 leading-relaxed whitespace-pre-line">
          {HERO_COPY}
        </p>
      </div>
    </section>
  );
}