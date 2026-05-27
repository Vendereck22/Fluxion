"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

const ROUTE_NAMES: Record<string, string> = {
  admin: "Dashboard",
  logs: "Logs du Flux",
  team: "Équipe",
  services: "Services",
  portfolio: "Portfolio",
  inbox: "Boîte de réception",
  archives: "Archives",
  config: "Configuration",
  security: "Sécurité",
};

export default function Topbar() {
  const pathname = usePathname() || "/admin";
  const [ping, setPing] = useState(14);
  const [status, setStatus] = useState<"connected" | "syncing">("connected");

  // Simulate server connection heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 8) + 10); // 10ms - 18ms
      setStatus(prev => prev === "connected" ? "syncing" : "connected");
      setTimeout(() => setStatus("connected"), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-20 sticky top-0 select-none">
      
      {/* Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link 
          href="/admin/login" 
          className="hover:text-slate-900 transition-colors duration-200"
        >
          FLUXION
        </Link>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const name = ROUTE_NAMES[segment] || segment;
          const isLast = index === segments.length - 1;

          return (
            <div key={href} className="flex items-center gap-2">
              <ChevronRight size={12} className="text-slate-400" />
              {isLast ? (
                <span className="text-slate-900 font-semibold">{name}</span>
              ) : (
                <Link 
                  href={href} 
                  className="hover:text-slate-900 transition-colors duration-200"
                >
                  {name}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Server Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              status === "syncing" ? "bg-amber-400" : "bg-fluxion-cobalt"
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              status === "syncing" ? "bg-amber-400" : "bg-[#343D91]"
            }`} />
          </div>
          <span className="text-[10px] font-bold font-inter tracking-[0.1em] text-slate-500 uppercase">
            {status === "syncing" ? "SYNC EN COURS" : `LATENCE : ${ping}ms`}
          </span>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-slate-500 text-xs">
          <Wifi size={14} className="text-slate-400" />
          <span className="font-semibold text-slate-500">Production v1.0.2</span>
        </div>
      </div>

    </header>
  );
}
