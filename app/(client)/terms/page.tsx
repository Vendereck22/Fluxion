import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-20 pt-32 text-slate-800">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-fluxion-rose">
          Fluxion
        </p>
        <h1 className="mt-3 font-heading text-4xl font-black tracking-tight text-fluxion-blue md:text-5xl">
          Conditions d'utilisation
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
          <p>
            En utilisant ce site, vous acceptez de fournir des informations exactes lorsque vous envoyez une demande de
            contact ou vous inscrivez à la newsletter.
          </p>
          <p>
            Les contenus, visuels, textes et présentations du site Fluxion sont fournis à titre informatif et restent
            liés à l'identité de l'agence.
          </p>
          <p>
            Fluxion se réserve le droit de modifier ses contenus, services et conditions afin d'améliorer l'expérience
            proposée aux visiteurs et clients.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-10 inline-flex h-11 items-center justify-center rounded-xl bg-fluxion-blue px-5 text-sm font-bold text-white transition-colors hover:bg-fluxion-rose"
        >
          Démarrer un projet
        </Link>
      </section>
    </main>
  );
}
