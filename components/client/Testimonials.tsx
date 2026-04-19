"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";
import Image from "next/image";
import { siteContent } from "@/constants/site-content";

const reviews = siteContent.testimonials.reviews;

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-fluxion-blue/5">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block p-3 rounded-full bg-fluxion-rose/10 text-fluxion-rose mb-4">
            <Quote size={24} />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">
            {siteContent.process.title}
          </h2>
          <p className="opacity-70 text-lg">
            {siteContent.process.description}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/10 relative"
              >
                <p className="text-slate-600 dark:text-slate-400 italic mb-8 leading-relaxed">
                  "{review.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-fluxion-gradient p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <span className="text-fluxion-blue font-bold">
                        {review.name[0]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-fluxion-blue dark:text-white text-sm">
                      {review.name}
                    </h4>
                    <p className="text-xs text-fluxion-rose font-medium">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
