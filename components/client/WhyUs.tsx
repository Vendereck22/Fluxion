"use client";

import { ShieldCheck, Zap, Globe, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { siteContent } from "@/constants/site-content";

const stats = [
  {
    ...siteContent.whyUs.stats[0],
    icon: <Zap className="w-6 h-6 text-fluxion-rose" />,
  },
  {
    ...siteContent.whyUs.stats[1],
    icon: <ShieldCheck className="w-6 h-6 text-fluxion-rose" />,
  },
  {
    ...siteContent.whyUs.stats[2],
    icon: <Users className="w-6 h-6 text-fluxion-rose" />,
  },
  {
    ...siteContent.whyUs.stats[3],
    icon: <Globe className="w-6 h-6 text-fluxion-rose" />,
  },
];

export default function WhyUs() {
  return (
    <section
      id="why-us"
      className="py-24 bg-white dark:bg-fluxion-dark relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-fluxion-rose/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16 text-center md:text-left">
          <h2 className="text-fluxion-rose font-bold uppercase tracking-widest text-sm mb-4">
            {siteContent.whyUs.badge}
          </h2>
          <h3 className="text-4xl md:text-5xl font-heading font-black text-fluxion-blue dark:text-white leading-tight">
            {siteContent.whyUs.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <Card
              key={index}
              className={cn(
                "p-4 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10",
                "hover:border-fluxion-rose/30 transition-all duration-300 group shadow-sm hover:shadow-xl",
                "flex flex-col h-full",
              )}
            >
              <CardHeader className="p-4">
                <div className="mb-2 p-4 bg-white dark:bg-fluxion-blue/20 rounded-2xl w-fit shadow-inner group-hover:scale-110 group-hover:bg-fluxion-rose/10 transition-all duration-500">
                  {item.icon}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-4xl font-black text-fluxion-blue dark:text-white font-heading tracking-tighter">
                    {item.value}
                  </span>
                  <h4 className="text-lg font-bold text-fluxion-rose">
                    {item.label}
                  </h4>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
