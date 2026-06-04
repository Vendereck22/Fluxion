import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-20 pt-32 text-slate-800">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-fluxion-rose">
          Fluxion
        </p>
        <h1 className="mt-3 font-heading text-4xl font-black tracking-tight text-fluxion-blue md:text-5xl">
          Politique de confidentialité
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
          <p>
            Fluxion collecte uniquement les informations nécessaires pour répondre aux demandes envoyées via le site :
            nom, post-nom, prénom, téléphone, email et message.
          </p>
          <p>
            Ces données servent à traiter les demandes de contact, suivre les échanges avec les visiteurs et améliorer
            la qualité de nos services. Elles ne sont pas revendues à des tiers.
          </p>
          <p>
            Vous pouvez demander la correction ou la suppression de vos informations en nous écrivant à l'adresse de
            contact indiquée sur le site.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-10 inline-flex h-11 items-center justify-center rounded-xl bg-fluxion-blue px-5 text-sm font-bold text-white transition-colors hover:bg-fluxion-rose"
        >
          Nous contacter
        </Link>
      </section>
    </main>
  );
}
