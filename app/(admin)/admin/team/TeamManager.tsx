"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Save, Upload } from "lucide-react";
import { updateContent } from "@/app/actions/content";
import { uploadImage } from "@/app/actions/upload";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  img: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface TeamManagerProps {
  initialMembers: TeamMember[];
}

export default function TeamManager({ initialMembers }: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [selectedPreviewId, setSelectedPreviewId] = useState<number | null>(
    initialMembers.length > 0 ? initialMembers[0].id : null
  );


  const [editForm, setEditForm] = useState<TeamMember>({
    id: 0,
    name: "",
    role: "",
    bio: "",
    img: "",
    socials: {
      linkedin: "",
      twitter: "",
      instagram: ""
    }
  });

  const handleEditClick = (member: TeamMember) => {
    setEditingId(member.id);
    setEditForm({
      ...member,
      socials: {
        linkedin: member.socials?.linkedin || "",
        twitter: member.socials?.twitter || "",
        instagram: member.socials?.instagram || ""
      }
    });
    setSelectedPreviewId(member.id);
    setStatus("idle");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setStatus("idle");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImage(formData);
      if (res.success && res.url) {
        setEditForm((prev) => ({ ...prev, img: res.url }));
      } else {
        alert(res.error || "Une erreur s'est produite lors du téléchargement.");
      }
    } catch {
      alert("Une erreur de communication est survenue.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSaveMember = () => {
    if (!editForm.name || !editForm.role) {
      alert("Le nom et le rôle sont obligatoires.");
      return;
    }

    const updated = members.map((m) => (m.id === editForm.id ? editForm : m));
    setMembers(updated);
    setEditingId(null);
    setStatus("idle");
  };

  const handleDeleteMember = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce profil ?")) {
      const updated = members.filter((m) => m.id !== id);
      setMembers(updated);
      setStatus("idle");
      if (selectedPreviewId === id) {
        setSelectedPreviewId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  const handleAddMember = () => {
    const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
    const newMember: TeamMember = {
      id: newId,
      name: "Nouveau Membre",
      role: "Développeur",
      bio: "Nouvelle biographie du membre de l'équipe.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      socials: { linkedin: "#", twitter: "#", instagram: "#" }
    };

    setMembers((prev) => [...prev, newMember]);
    setEditingId(newId);
    setEditForm(newMember);
    setSelectedPreviewId(newId);
    setStatus("idle");
  };

  const handleSaveChangesToDisk = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const res = await updateContent("team", { members });
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedMember = members.find((m) => m.id === selectedPreviewId);

  return (
    <div className="space-y-8 font-sans">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
            Changements en attente
          </h4>
          <p className="text-[10px] text-slate-500 font-inter mt-0.5">
            Ajoutez, éditez ou supprimez des profils, puis appliquez-les sur le site de production.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddMember}
            className="h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            Ajouter un profil
          </button>

          <button
            onClick={handleSaveChangesToDisk}
            disabled={isSaving}
            className={`h-10 px-5 rounded-lg text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              status === "success"
                ? "bg-emerald-600 text-white"
                : status === "error"
                ? "bg-red-600 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white shadow-md"
            }`}
          >
            {isSaving ? (
              <>
                <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sauvegarde...
              </>
            ) : status === "success" ? (
              "Enregistré avec succès !"
            ) : (
              <>
                <Save size={14} />
                Publier les modifications
              </>
            )}
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Membres Actuels ({members.length})</h3>

          {members.length === 0 ? (
            <div className="border border-slate-200 rounded-xl bg-white p-12 text-center text-slate-500 text-xs shadow-sm">
              Aucun membre dans l'équipe. Cliquez sur "Ajouter un profil" pour commencer.
            </div>
          ) : (
            members.map((member) => {
              const isEditing = editingId === member.id;

              return (
                <div
                  key={member.id}
                  className={`border rounded-xl p-5 bg-white shadow-sm transition-all duration-300 ${
                    isEditing
                      ? "border-fluxion-pink-neon/50 bg-slate-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {isEditing ? (
                    /* Edit Form fields */
                    <div className="space-y-4 font-inter text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="font-bold text-fluxion-pink-neon uppercase text-[10px] tracking-wider">Mode Édition</span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveMember}
                            className="px-3 py-1 rounded bg-[#FF007F] hover:bg-opacity-90 text-white font-bold text-[10px] uppercase tracking-wider transition-colors"
                          >
                            Valider
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-slate-500 text-[10px] uppercase font-bold">Nom Complet</label>
                          <input
                            name="name"
                            value={editForm.name}
                            onChange={handleFormChange}
                            className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-slate-500 text-[10px] uppercase font-bold">Rôle / Poste</label>
                          <input
                            name="role"
                            value={editForm.role}
                            onChange={handleFormChange}
                            className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Photo de Profil</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-slate-200 rounded-lg bg-white shadow-inner">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                            {editForm.img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={editForm.img} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <Upload className="text-slate-300" size={20} />
                            )}
                            {isUploadingFile && (
                              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <span className="h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <label className="inline-flex h-9 items-center justify-center px-4 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors w-full sm:w-auto">
                              <Upload size={12} className="mr-1.5" />
                              Télécharger une photo
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isUploadingFile}
                              />
                            </label>

                            <div className="space-y-1">
                              <span className="text-[9px] text-slate-400 block font-inter">Ou coller un lien direct vers l'image :</span>
                              <input
                                name="img"
                                value={editForm.img}
                                onChange={handleFormChange}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full h-8 bg-white border border-slate-200 rounded px-2.5 text-[10px] font-mono text-slate-800 focus:border-fluxion-pink-neon focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Biographie</label>
                        <textarea
                          name="bio"
                          value={editForm.bio}
                          onChange={handleFormChange}
                          rows={3}
                          className="w-full bg-white border border-slate-200 rounded p-3 text-slate-900 resize-none focus:border-fluxion-pink-neon focus:outline-none"
                        />
                      </div>


                      <div className="border-t border-slate-100 pt-4 mt-2">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block mb-3">Réseaux Sociaux</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-slate-500 text-[9px] uppercase font-bold flex items-center gap-1">
                              <LinkedInIcon className="w-3.5 h-3.5" /> LinkedIn URL
                            </label>
                            <input
                              value={editForm.socials?.linkedin || ""}
                              onChange={(e) => setEditForm((prev) => ({
                                ...prev,
                                socials: { ...prev.socials, linkedin: e.target.value }
                              }))}
                              placeholder="#"
                              className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-slate-500 text-[9px] uppercase font-bold flex items-center gap-1">
                              <TwitterIcon className="w-3.5 h-3.5" /> Twitter / X URL
                            </label>
                            <input
                              value={editForm.socials?.twitter || ""}
                              onChange={(e) => setEditForm((prev) => ({
                                ...prev,
                                socials: { ...prev.socials, twitter: e.target.value }
                              }))}
                              placeholder="#"
                              className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-slate-500 text-[9px] uppercase font-bold flex items-center gap-1">
                              <InstagramIcon className="w-3.5 h-3.5" /> Instagram URL
                            </label>
                            <input
                              value={editForm.socials?.instagram || ""}
                              onChange={(e) => setEditForm((prev) => ({
                                ...prev,
                                socials: { ...prev.socials, instagram: e.target.value }
                              }))}
                              placeholder="#"
                              className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">

                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm cursor-pointer hover:opacity-85"
                          onClick={() => setSelectedPreviewId(member.id)}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-black text-sm text-slate-900 tracking-tight uppercase">
                              {member.name}
                            </h4>
                            <div className="flex gap-1.5 ml-1">
                              {member.socials?.linkedin && member.socials.linkedin !== "#" && (
                                <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                                  <LinkedInIcon className="w-3 h-3" />
                                </a>
                              )}
                              {member.socials?.twitter && member.socials.twitter !== "#" && (
                                <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                                  <TwitterIcon className="w-3 h-3" />
                                </a>
                              )}
                              {member.socials?.instagram && member.socials.instagram !== "#" && (
                                <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                                  <InstagramIcon className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="text-[10px] text-fluxion-pink-neon font-inter font-bold tracking-wider uppercase mt-0.5">
                            {member.role}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 max-w-md">
                            {member.bio}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleEditClick(member)}
                          className="p-2 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 rounded bg-red-50 border border-red-100 hover:bg-red-100 text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>


        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Prévisualisation du Site</h3>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold text-fluxion-pink-neon uppercase tracking-[0.2em] font-inter">
                NOTRE ÉQUIPE
              </span>
              <h4 className="text-lg font-heading font-black text-slate-900 uppercase tracking-tight mt-1">
                L'Excellence FLUXION
              </h4>
            </div>


            <div className="grid grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-1">
              {members.map((m) => {
                const isSelected = m.id === selectedPreviewId;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedPreviewId(m.id)}
                    className={`border p-3 text-center space-y-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "border-fluxion-pink-neon/60 ring-1 ring-fluxion-pink-neon/40 bg-pink-50/10"
                        : "bg-slate-50 border-slate-100 hover:border-slate-300"
                    }`}
                  >

                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-12 h-12 rounded-full mx-auto object-cover border border-slate-200 hover:scale-105 transition-transform"
                    />
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-900 uppercase tracking-tight truncate">{m.name}</h5>
                      <p className="text-[8px] text-slate-500 font-medium truncate mt-0.5">{m.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>


            {selectedMember ? (
              <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden shadow-inner p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex gap-4">

                  <img
                    src={selectedMember.img}
                    alt={selectedMember.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="font-heading font-black text-xs text-slate-900 uppercase tracking-tight truncate">
                      {selectedMember.name}
                    </h4>
                    <p className="text-[9px] text-fluxion-pink-neon font-bold font-inter uppercase tracking-wide truncate">
                      {selectedMember.role}
                    </p>
                    <div className="flex gap-1.5 pt-1.5">
                      {selectedMember.socials?.linkedin && selectedMember.socials.linkedin !== "#" && (
                        <a href={selectedMember.socials.linkedin} target="_blank" rel="noreferrer" className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                          <LinkedInIcon className="w-3 h-3" />
                        </a>
                      )}
                      {selectedMember.socials?.twitter && selectedMember.socials.twitter !== "#" && (
                        <a href={selectedMember.socials.twitter} target="_blank" rel="noreferrer" className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                          <TwitterIcon className="w-3 h-3" />
                        </a>
                      )}
                      {selectedMember.socials?.instagram && selectedMember.socials.instagram !== "#" && (
                        <a href={selectedMember.socials.instagram} target="_blank" rel="noreferrer" className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                          <InstagramIcon className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed font-inter bg-white border border-slate-100 rounded-lg p-3 shadow-sm max-h-[100px] overflow-y-auto">
                  {selectedMember.bio || "Aucune biographie fournie."}
                </p>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl bg-slate-50 p-4 text-center text-slate-400 text-[10px]">
                Sélectionnez un membre ci-dessus pour prévisualiser son profil détaillé.
              </div>
            )}

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[10px] text-slate-500 leading-relaxed font-inter">
              💡 Les modifications effectuées ici seront instantanément appliquées à la page d'accueil de l'écosystème web une fois le bouton <strong>"Publier les modifications"</strong> cliqué.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}