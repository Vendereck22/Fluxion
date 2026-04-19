"use client";

import SocialMedia from "./SocialMedia";
import Link from "next/link";
import { siteContent } from "@/constants/site-content";
import Newsletter from "./Newsletter";
import Logo from "./Logo";

export default function Footer() {
  const NavLinks = siteContent.navigation.links;

  return (
    <footer className="bg-fluxion-blue text-white pt-16 md:pt-24 pb-12 overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 space-y-6 text-center md:text-left">
            <div>
              <div className="flex justify-center md:justify-start mb-6">
                <Logo size="md" light />
              </div>
              <p className="text-blue-100/70 text-sm font-sans leading-relaxed">
                {siteContent.brand.tagline}
              </p>
            </div>
          </div>
          <div className="col-span-1 md:col-span-1 space-y-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-fluxion-rose font-black mb-4">
                {siteContent.footer.socialBadge}
              </p>
              <div className="flex justify-center md:justify-start w-full">
                <SocialMedia />
              </div>
            </div>

            <Newsletter variant="compact" />
          </div>
          <div className="col-span-1 text-center md:text-left">
            <h3 className="font-heading text-xl font-bold mb-6 relative inline-block md:block">
              Liens
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-1 bg-fluxion-rose rounded-full" />
            </h3>
            <nav className="flex flex-row flex-wrap justify-center md:justify-start gap-x-6 gap-y-3">
              {NavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-blue-100/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group text-sm whitespace-nowrap"
                >
                  <span className="w-1 h-1 rounded-full bg-fluxion-rose opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="col-span-1 text-center md:text-left">
            <h3 className="font-heading text-xl font-bold mb-6 relative inline-block md:block">
              Contact
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-1 bg-fluxion-rose rounded-full" />
            </h3>
            <div className="text-sm text-blue-100/70 space-y-4">
              <p>{siteContent.footer.location}</p>
              <p className="text-white font-bold">{siteContent.footer.email}</p>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 tracking-[0.2em] font-bold">
          <p>{siteContent.brand.legal}</p>
          <div className="flex gap-6 uppercase">
            <Link href="/privacy" className="hover:text-fluxion-rose">
              {siteContent.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-fluxion-rose">
              {siteContent.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
