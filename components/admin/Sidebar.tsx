import Link from "next/link";
import Logo from "@/components/client/Logo";

export function Sidebar() {
  return (
    <div className="w-64 h-screen border-r border-slate-200 bg-white flex flex-col antialiased sticky top-0">
      <div className="flex flex-col items-center justify-center p-6 border-b border-slate-100 mb-4 bg-slate-50/50">
        <Logo size="md" />
        <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">Admin</span>
      </div>
      <p className="text-lg text-gray-700 text-center px-4">Ici, nous allons gérer les contenus, les utilisateurs et les paramètres du site.</p>
    </div>
  );
}
