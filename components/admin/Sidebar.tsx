"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Terminal,
  Users,
  Briefcase,
  FolderGit,
  Inbox,
  Archive,
  Sliders,
  ShieldAlert,
  LogOut,
  Mail,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/client/Logo";
import { logout } from "@/app/actions/auth";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface Group {
  items: NavItem[];
}

const NAV_GROUPS: Group[] = [
  {

    items: [
      { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
      { name: "Logs du Flux", href: "/admin/logs", icon: Terminal },

    ]
  },
  {
    items: [
      { name: "Équipe", href: "/admin/team", icon: Users },
      { name: "Services", href: "/admin/services", icon: Briefcase },
      { name: "Portfolio", href: "/admin/portfolio", icon: FolderGit },
    ]
  },



  {
    items: [
      { name: "Boîte de réception", href: "/admin/inbox", icon: Inbox },
      { name: "Archives", href: "/admin/archives", icon: Archive },
      { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ]
  },

  {
    items: [

      { name: "Sécurité", href: "/admin/security", icon: ShieldAlert },
      { name: "Config", href: "/admin/config", icon: Sliders },

    ]
  },





];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="w-64 h-screen border-r border-slate-200 bg-white flex flex-col antialiased sticky top-0 overflow-y-auto z-30">
      <div className="flex flex-col items-center justify-center p-6 border-b border-slate-100 mb-4 bg-slate-50/50">
        <Logo size="md" />
        <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Admin Control</span>
      </div>

      <div className="flex-1 w-full px-4 flex flex-col gap-6 pb-6">
        {NAV_GROUPS.map((group, index) => (
          <div key={index} className="flex flex-col gap-1">

            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm border border-transparent",
                    isActive
                      ? "bg-slate-50 text-fluxion-pink-neon border-slate-200/60 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                  )}
                >
                  <item.icon size={18} className={cn(isActive ? "text-fluxion-pink-neon" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 text-sm font-medium transition-colors text-left"
        >
          <LogOut size={18} />
          Quitter l'admin
        </button>
      </div>
    </div>
  );
}
