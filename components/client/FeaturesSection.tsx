"use client";

import { Shield, Zap, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    title: "Identité Forte",
    description: "Nous forgeons des systèmes de design cohérents qui capturent l'essence unique de votre marque.",
    icon: Shield,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Innovation Tech",
    description: "Utilisation des dernières technologies (Next.js, Tailwind v4) pour une performance foudroyante.",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    title: "Vision Future",
    description: "Anticiper les tendances pour créer des expériences numériques qui durent dans le temps.",
    icon: Sparkles,
    color: "bg-purple-500/10 text-purple-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-24 bg-white antialiased">
      <div className="container mx-auto px-6">
        
        
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-fluxion-rose">
            Nos Piliers
          </h2>
          <p className="text-4xl md:text-5xl font-heading font-black text-fluxion-blue tracking-tighter">
            L'excellence gravée dans <br /> chaque pixel.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="group p-4 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-fluxion-cobalt/5 transition-all duration-500 overflow-visible ring-0"
            >
              <CardHeader className="pt-4 px-4 pb-2">
             
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-7 h-7" />
                </div>
              </CardHeader>

              <CardContent className="px-4 space-y-3">
                <CardTitle className="text-xl font-heading font-black text-fluxion-blue tracking-tight">
                  {feature.title}
                </CardTitle>
                <CardDescription className="font-sans text-slate-500 leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-fluxion-rose opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  En savoir plus <span className="text-lg">→</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
