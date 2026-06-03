import { getUsersList } from "@/app/actions/auth";
import SecurityManager from "./SecurityManager";
import { LuShieldAlert } from "react-icons/lu";

export const revalidate = 0;

export default async function SecurityPage() {
  const users = await getUsersList();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <LuShieldAlert className="text-[#343D91]" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              SÉCURITÉ & ACCÈS
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Surveillance des sessions actives, audits de sécurité et gestion des accès sensibles.
          </p>
        </div>
      </div>

      <SecurityManager initialUsers={users} />
    </div>
  );
}