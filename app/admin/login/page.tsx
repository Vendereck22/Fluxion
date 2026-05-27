"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight } from "lucide-react";
import Logo from "@/components/client/Logo";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await login(formData);
        if (res.success) {
          const next = searchParams.get("next");
          router.push(next && next.startsWith("/admin") ? next : "/admin");
          router.refresh();
        } else {
          setError(res.error || "Une erreur s'est produite.");
        }
      } catch {
        setError("Erreur réseau. Veuillez réessayer.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Brand / Gradient Panel */}
        <div className="bg-fluxion-gradient text-white flex items-center justify-center p-10 md:p-12 lg:p-14">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <Logo
              size="xl"
              light
              href="/admin/login"
              className="active:scale-95 transition-transform"
            />
            
          </div>
        </div>

        {/* Form Panel */}
        <div className="relative flex items-center justify-center px-6 py-12">
          {/* Subtle light background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(52,61,145,0.08),transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,43,93,0.08),transparent_55%)] pointer-events-none" />

          <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-heading font-black text-slate-900 tracking-tight">
                Se connecter
              </h2>
              <p className="mt-2 text-slate-500 text-sm">
                Entrez vos identifiants pour acceder au tableau de bord.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-inter">

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@fluxion.cd"
                  required
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-800 text-xs placeholder:text-slate-400 focus:border-fluxion-rose focus:bg-white focus:outline-none transition-all focus:ring-1 focus:ring-fluxion-rose/20"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  required
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-11 text-slate-800 text-xs placeholder:text-slate-400 focus:border-fluxion-rose focus:bg-white focus:outline-none transition-all focus:ring-1 focus:ring-fluxion-rose/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Errors */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 animate-in fade-in slide-in-from-top-1">
                <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-wider">Erreur de connexion</p>
                  <p className="text-[10px] mt-0.5 text-red-500/80 leading-normal">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-fluxion-rose hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer border border-transparent"
            >
              {isPending ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authentification...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>


            </div>

            <p className="mt-6 text-center text-[10px] text-slate-400">
              Propulse par le moteur de securite Fluxion Core v3.2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
