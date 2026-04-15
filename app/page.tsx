import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 antialiased">
      {/* Section Hero avec le branding Fluxion 
          On utilise 'font-heading' pour le titre (Archivo) 
          et 'text-fluxion-blue' pour la couleur principale
      */}
      <div className="text-center space-y-6 max-w-2xl">
        
        {/* Placeholder pour le logo - Respect de la marge de sécurité (F-space) */}
        <div className="relative w-48 h-20 mx-auto mb-8 flex items-center justify-center">
           {/* Remplacer par ton vrai SVG : <Image src="/logo.svg" alt="Fluxion Logo" width={280} height={100} priority /> */}
           <span className="text-fluxion-dark font-black text-3xl tracking-tighter">FLUXION</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight text-fluxion-blue dark:text-white">
          Bienvenue chez <span className="text-fluxion-rose">Fluxion</span>
        </h1>

        <p className="font-sans text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          L'excellence technologique au service de votre vision. 
          Une identité forte, cohérente et impactante.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {/* Bouton avec le dégradé signature défini dans globals.css */}
          <button className="bg-fluxion-gradient text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-fluxion-cobalt/20">
            Démarrer le projet
          </button>
          
          <button className="border-2 border-fluxion-cobalt text-fluxion-cobalt font-semibold px-8 py-3 rounded-full hover:bg-fluxion-cobalt hover:text-white transition-all">
            Voir la charte
          </button>
        </div>
      </div>

      {/* Section de rappel des couleurs (Utile pour le dev) */}
      <div className="absolute bottom-8 flex gap-2">
        <div className="w-4 h-4 rounded-full bg-fluxion-blue" title="Deep Blue" />
        <div className="w-4 h-4 rounded-full bg-fluxion-cobalt" title="Cobalt" />
        <div className="w-4 h-4 rounded-full bg-fluxion-mauve" title="Mauve" />
        <div className="w-4 h-4 rounded-full bg-fluxion-rose" title="Rose" />
      </div>
    </main>
  );
}