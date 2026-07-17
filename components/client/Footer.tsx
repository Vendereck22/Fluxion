"use client";

import SocialMedia from "./SocialMedia";
import Link from "next/link";
import { useSiteContent } from "@/components/client/SiteContentProvider";
import Newsletter from "./Newsletter";
import Logo from "./Logo";

export default function Footer() {
  const siteContent = useSiteContent();
  const NavLinks = siteContent.navigation.links;

  return (
    <footer className="bg-fluxion-blue text-white pt-16 md:pt-24 pb-12 overflow-hidden relative">
      <div className="fluxion-container">
        <div className="grid grid-cols-1 gap-12 mb-16 text-center md:grid-cols-4 md:items-start md:text-left">
          <div className="space-y-6">
            <div>
              <div className="flex justify-center md:justify-start mb-6">
                <Logo size="md" light />
              </div>
              <p className="text-blue-100/70 text-sm font-sans leading-relaxed">
                {siteContent.brand.tagline}
              </p>
            </div>
          </div>
          <div className="space-y-8">
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
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-heading text-xl font-bold mb-6 relative inline-block md:block">
              Liens
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-1 bg-fluxion-rose rounded-full" />
            </h3>
            <nav className="flex w-full max-w-xs flex-col items-center gap-3 md:items-start">
              {NavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex w-full items-center justify-center gap-2 text-sm text-blue-100/70 transition-all hover:text-white md:justify-start md:hover:translate-x-1"
                >
                  <span className="h-1 w-1 rounded-full bg-fluxion-rose opacity-70 transition-opacity group-hover:opacity-100" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col items-center md:items-start">
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
