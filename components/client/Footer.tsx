
import SocialMedia from "./SocialMedia";
import Link from "next/link";

export default function Footer() {

  const NavLinks = [
    { name: "À propos", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];  

  return (
    <footer className="bg-fluxion-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div>
              <h2 className="font-heading text-3xl font-black mb-2">FLUXION</h2>
              <p className="text-blue-100/70 max-w-sm font-sans">
                Propulser l&apos;innovation via une identité technologique forte et cohérente.
              </p>
            </div>
            
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest text-fluxion-rose font-bold mb-4">Suivez-nous</p>
              <SocialMedia />
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h3 className="font-heading text-xl font-bold mb-2">Liens </h3>
            {NavLinks.map(linkSync => (
              <Link 
                key={linkSync.name}
                href={linkSync.href} 
                className="text-blue-100/70 hover:text-fluxion-rose transition-colors block"
              >
                {linkSync.name}
              </Link>
            ))}
          </div>  
        </div>
      </div>
    </footer>
  );
}