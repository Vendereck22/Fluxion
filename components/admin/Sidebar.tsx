"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LuLayoutDashboard,
  LuTerminal,
  LuUsers,
  LuBriefcase,
  LuHandshake,
  LuInbox,
  LuArchive,
  LuMail,
  LuFileText,
  LuShieldAlert,
  LuSlidersHorizontal,
  LuLogOut,
  LuPackage,
  LuLayers,
} from "react-icons/lu";
import { cn } from "@/lib/utils";
import Logo from "@/components/client/Logo";
import { logout } from "@/app/actions/auth";
import type { IconType } from "react-icons";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
  icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Tableau de bord", href: "/admin", icon: LuLayoutDashboard },
  { name: "Audit des actions", href: "/admin/audit", icon: LuTerminal },
  { name: "Équipe", href: "/admin/team", icon: LuUsers },
  { name: "Services", href: "/admin/services", icon: LuBriefcase },
  { name: "Partenaires", href: "/admin/partners", icon: LuHandshake },
  { name: "Produits", href: "/admin/products", icon: LuPackage },
  { name: "Projets", href: "/admin/projects", icon: LuLayers },
  { name: "Contenu du site", href: "/admin/content", icon: LuFileText },
  { name: "Boîte de réception", href: "/admin/inbox", icon: LuInbox },
  { name: "Archives", href: "/admin/archives", icon: LuArchive },
  { name: "Newsletter", href: "/admin/newsletter", icon: LuMail },
  { name: "Sécurité", href: "/admin/security", icon: LuShieldAlert },
  { name: "Config", href: "/admin/config", icon: LuSlidersHorizontal },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="w-64 h-screen border-r border-slate-200 bg-white flex flex-col antialiased sticky top-0 overflow-y-auto z-30">
      <div className="flex flex-col items-start justify-center px-7 py-5 border-b border-slate-100 mb-4 bg-slate-50/50">
        <Logo size="md" href="/admin/login" className="-ml-3" />
      </div>

      <nav className="flex-1 w-full px-4 flex flex-col gap-1 pb-6">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));
          const isLoading = loadingHref === item.href && !isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-busy={isLoading}
              onClick={() => {
                if (!isActive) setLoadingHref(item.href);
              }}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm border border-transparent",
                isActive
                  ? "bg-slate-50 text-fluxion-pink-neon border-slate-200/60 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50",
                isLoading && "pointer-events-none bg-slate-50 text-slate-900 border-slate-200",
              )}
            >
              {isLoading ? (
                <span className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-slate-300 border-t-fluxion-pink-neon animate-spin" />
              ) : (
                <item.icon
                  size={20}
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive
                      ? "text-fluxion-pink-neon"
                      : "text-slate-400 group-hover:text-fluxion-pink-neon",
                  )}
                />
              )}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Button
          type="button"
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
          {isLoggingOut ? (
            <span className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
          ) : (
            <LuLogOut
              size={20}
              className="flex-shrink-0 text-slate-400 group-hover:text-red-600 transition-colors"
            />
          )}
          <span>{isLoggingOut ? "Déconnexion..." : "Quitter l'admin"}</span>
        </Button>
      </div>
    </div>
  );
}
