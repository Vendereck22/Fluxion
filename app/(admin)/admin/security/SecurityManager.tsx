"use client";

import { useState } from "react";
import {
  LuShieldAlert,
  LuFingerprint,
  LuLock,
  LuShieldCheck,
  LuActivity,
  LuUserPlus,
  LuTrash2,
  LuUser,
  LuCalendar
} from "react-icons/lu";
import { createUserAction, deleteUserAction, type UserAccount } from "@/app/actions/auth";

interface SecurityManagerProps {
  initialUsers: UserAccount[];
}

export default function SecurityManager({ initialUsers }: SecurityManagerProps) {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus("idle");
    setMessage("");
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setStatus("error");
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    setStatus("idle");

    const actionData = new FormData();
    actionData.append("name", formData.name);
    actionData.append("email", formData.email);
    actionData.append("password", formData.password);
    actionData.append("role", formData.role);

    try {
      const res = await createUserAction(actionData);
      if (res.success) {
        setStatus("success");
        setMessage("Compte administrateur créé avec succès.");
        // Reload list client-side
        const newUser: UserAccount = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email.toLowerCase(),
          role: formData.role,
          salt: "",
          passwordHash: "",
          createdAt: new Date().toISOString(),
        };
        setUsers((prev) => [...prev, newUser]);
        setFormData({ name: "", email: "", password: "", role: "admin" });
        setIsCreating(false);
      } else {
        setStatus("error");
        setMessage(res.error || "Une erreur s'est produite lors de la création.");
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur de communication est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: string, email: string) => {
    if (confirm(`Voulez-vous vraiment supprimer le compte de ${email} ?`)) {
      setLoading(true);
      try {
        const res = await deleteUserAction(id);
        if (res.success) {
          setUsers((prev) => prev.filter((u) => u.id !== id));
          setStatus("success");
          setMessage("Utilisateur supprimé avec succès.");
        } else {
          setStatus("error");
          setMessage(res.error || "Une erreur est survenue lors de la suppression.");
        }
      } catch {
        setStatus("error");
        setMessage("Une erreur de communication est survenue.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: System status & Admin list */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* User management card */}
          <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
                  Comptes Administrateurs
                </h3>
                <p className="text-[10px] text-slate-500 font-inter mt-0.5">
                  Liste des profils autorisés à se connecter sur l'interface d'administration.
                </p>
              </div>

              <button
                onClick={() => setIsCreating(!isCreating)}
                className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors self-start sm:self-center"
              >
                <LuUserPlus size={14} />
                Nouveau compte
              </button>
            </div>

            {status !== "idle" && (
              <div className={`p-3 rounded-lg text-xs font-medium border ${
                status === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                {message}
              </div>
            )}

            {/* Account Creation Form */}
            {isCreating && (
              <form onSubmit={handleCreateAccount} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 font-inter text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="font-bold text-fluxion-pink-neon uppercase text-[10px] tracking-wider block border-b border-slate-100 pb-2">
                  Création de compte administrateur
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Nom Complet *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: John Doe"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Adresse Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@fluxion.cd"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Mot de Passe *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Rôle Administrateur</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    >
                      <option value="admin">Administrateur (Accès complet)</option>
                      <option value="editor">Éditeur (Modifications uniquement)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded bg-fluxion-pink-neon hover:bg-opacity-95 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow-md"
                  >
                    {loading ? "Création..." : "Enregistrer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {/* List of accounts */}
            <div className="space-y-3 font-inter text-xs">
              {/* Hardcoded Super Admin display */}
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border flex items-center justify-center text-slate-500 flex-shrink-0">
                    <LuUser size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Super Administrateur</h5>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">admin@fluxion.cd</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-pink-50 border border-pink-100 text-fluxion-pink-neon font-bold text-[8px] uppercase tracking-wider">
                    Système
                  </span>
                </div>
              </div>

              {/* Dynamic list */}
              {users.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400 font-inter text-[11px]">
                  Aucun autre administrateur configuré.
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border flex items-center justify-center text-slate-500 flex-shrink-0">
                        <LuUser size={16} />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">{user.name}</h5>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-50 border text-[8px] font-bold uppercase text-slate-600">
                          {user.role}
                        </span>
                        <p className="text-[8px] text-slate-400 mt-1 flex items-center gap-1">
                          <LuCalendar size={9} /> Créé le {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteAccount(user.id, user.email)}
                        disabled={loading}
                        className="p-2 rounded bg-red-50 border border-red-100 hover:bg-red-100 text-red-500 transition-colors"
                        title="Supprimer le compte"
                      >
                        <LuTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Sessions UI */}
          <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
                Sessions Actives
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-inter font-bold text-[8px] uppercase tracking-wider border border-emerald-200">
                Actuel
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border border-slate-200 text-[#343D91]">
                    <LuFingerprint size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 font-inter">Administrateur Actif (Votre session)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">IP: 192.168.1.1 (Kinshasa, CD)</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En ligne
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Security info panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
                État du Système
              </h3>
              <LuActivity className="text-slate-400 animate-pulse" size={16} />
            </div>

            <div className="space-y-4 font-inter text-xs">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded bg-slate-50">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <LuShieldCheck size={14} className="text-emerald-500" /> Authentification PBKDF2
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-100 rounded bg-slate-50">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <LuLock size={14} className="text-emerald-500" /> Next.js API Routes CSRF
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">SÉCURISÉ</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-100 rounded bg-slate-50">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <LuShieldAlert size={14} className="text-amber-500" /> Télémétrie IP
                </span>
                <span className="text-[10px] text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-200">Alerte Faible</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed pt-2">
              💡 Les mots de passe des comptes créés sont salés individuellement et hachés de manière asymétrique via l'algorithme sécurisé **PBKDF2-SHA512** à 1000 itérations.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
