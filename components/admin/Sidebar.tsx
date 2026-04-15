import Link from "next/link";

export function Sidebar() {
  return (
    <div className="w-64 h-screen border-r border-slate-200 bg-white flex flex-col antialiased sticky top-0">
      <h1 className="text-2xl font-bold mb-4 text-center">Fluxion Admin</h1>
      <p className="text-lg text-gray-700 text-center">Ici, nous  allons  gérer les contenus, les utilisateurs et les paramètres du site.</p>
    </div>
  );
}
