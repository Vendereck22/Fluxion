"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Trash2, Edit2, Save, Upload, Link as LinkIcon } from "lucide-react";
import { updateContent } from "@/app/actions/content";
import { uploadImage } from "@/app/actions/upload";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";

interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags?: string[];
  href?: string;
}

interface ProjectsManagerProps {
  initialProjects: ProjectItem[];
  filters: string[];
}

export default function ProjectsManager({ initialProjects, filters }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [selectedPreviewSlug, setSelectedPreviewSlug] = useState<string | null>(
    initialProjects.length > 0 ? initialProjects[0].slug : null
  );

  // Edit form state
  const [editForm, setEditForm] = useState<ProjectItem>({
    slug: "",
    title: "",
    description: "",
    category: filters[0] || "UI/UX",
    imageSrc: "",
    tags: [],
    href: "",
  });

  // State to manage tags input as a comma-separated string
  const [tagsInput, setTagsInput] = useState("");

  const handleEditClick = (project: ProjectItem) => {
    setEditingSlug(project.slug);
    setEditForm({
      ...project,
      tags: project.tags || [],
      href: project.href || `/nos-projets/${project.slug}`,
    });
    setTagsInput((project.tags || []).join(", "));
    setSelectedPreviewSlug(project.slug);
    setStatus("idle");
  };

  const handleCancelEdit = () => {
    setEditingSlug(null);
    setStatus("idle");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" && !editingSlug) {
        // Auto-generate slug on new project creation
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        updated.href = `/nos-projets/${updated.slug}`;
      }
      return updated;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImage(formData);
      if (res.success && res.url) {
        setEditForm((prev) => ({ ...prev, imageSrc: res.url }));
      } else {
        alert(res.error || "Une erreur s'est produite lors du téléchargement.");
      }
    } catch {
      alert("Une erreur de communication est survenue.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProject = () => {
    if (!editForm.title || !editForm.description) {
      alert("Le titre et la description sont obligatoires.");
      return;
    }

    if (!editForm.slug) {
      editForm.slug = editForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      editForm.href = `/nos-projets/${editForm.slug}`;
    }

    const exists = projects.some((p) => p.slug === editForm.slug && editingSlug !== p.slug);
    if (exists) {
      alert("Un projet avec ce slug existe déjà.");
      return;
    }

    // Process tags from tagsInput string
    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedForm = { ...editForm, tags: tagsArray };

    let updated: ProjectItem[];
    if (editingSlug === "NEW_PROJECT") {
      updated = [...projects, updatedForm];
      setSelectedPreviewSlug(updatedForm.slug);
    } else {
      updated = projects.map((p) => (p.slug === editingSlug ? updatedForm : p));
    }

    setProjects(updated);
    setEditingSlug(null);
    setStatus("idle");
  };

  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    const updated = projects.filter((p) => p.slug !== projectToDelete.slug);
    setProjects(updated);
    setStatus("idle");
    if (selectedPreviewSlug === projectToDelete.slug) {
      setSelectedPreviewSlug(updated.length > 0 ? updated[0].slug : null);
    }
    setProjectToDelete(null);
  };

  const handleAddProject = () => {
    const newProject: ProjectItem = {
      slug: "",
      title: "",
      description: "",
      category: filters[0] || "UI/UX",
      imageSrc: "",
      tags: [],
      href: "",
    };

    setEditingSlug("NEW_PROJECT");
    setEditForm(newProject);
    setTagsInput("");
    setSelectedPreviewSlug("NEW_PROJECT");
    setStatus("idle");
  };

  const handleSaveChangesToDisk = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const res = await updateContent("projectsPage", { items: projects });
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

  const selectedProject = editingSlug === "NEW_PROJECT" ? editForm : projects.find((p) => p.slug === selectedPreviewSlug);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
            Changements en attente (Projets)
          </h4>
          <p className="text-[10px] text-slate-500 font-inter mt-0.5">
            Ajoutez, modifiez les tags et images de vos réalisations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddProject}
            className="h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            Créer un projet
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
              "Publié avec succès !"
            ) : (
              <>
                <Save size={14} />
                Publier les projets
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Projects List & Editor */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            Projets / Réalisations ({projects.length})
          </h3>

          {editingSlug === "NEW_PROJECT" && (
            <div className="border rounded-xl p-5 bg-slate-50 border-fluxion-pink-neon/50 shadow-sm animate-in fade-in duration-300">
              <div className="space-y-4 font-inter text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-bold text-fluxion-pink-neon uppercase text-[10px] tracking-wider">Nouveau Projet</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProject}
                      className="px-3 py-1 rounded bg-[#FF007F] hover:bg-opacity-90 text-white font-bold text-[10px] uppercase tracking-wider transition-colors"
                    >
                      Ajouter
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
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Titre du Projet</label>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleFormChange}
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Catégorie</label>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleFormChange}
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    >
                      {filters.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Slug URL</label>
                    <input
                      name="slug"
                      value={editForm.slug}
                      onChange={handleFormChange}
                      placeholder="genere-automatiquement"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Mots-clés / Tags (séparés par des virgules)</label>
                    <input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Branding, UI, Next.js"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[10px] uppercase font-bold">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded p-3 text-slate-900 resize-none focus:border-fluxion-pink-neon focus:outline-none"
                  />
                </div>

                {/* Upload Image */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[10px] uppercase font-bold">Image de couverture</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-slate-200 rounded-lg bg-white">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                      {editForm.imageSrc ? (
                        <Image src={editForm.imageSrc} alt="Preview" fill sizes="80px" className="object-cover" />
                      ) : (
                        <Upload className="text-slate-300" size={20} />
                      )}
                      {isUploadingImage && (
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
                          disabled={isUploadingImage}
                        />
                      </label>
                      <input
                        name="imageSrc"
                        value={editForm.imageSrc}
                        onChange={handleFormChange}
                        placeholder="Ou coller un lien direct d'image"
                        className="w-full h-8 bg-white border border-slate-200 rounded px-2.5 text-[10px] focus:border-fluxion-pink-neon focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {projects.map((project) => {
            const isEditing = editingSlug === project.slug;

            return (
              <div
                key={project.slug}
                className={`border rounded-xl p-5 bg-white shadow-sm transition-all duration-300 ${
                  isEditing
                    ? "border-fluxion-pink-neon/50 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {isEditing ? (
                  /* Edit Form */
                  <div className="space-y-4 font-inter text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-bold text-fluxion-pink-neon uppercase text-[10px] tracking-wider">Mode Édition</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProject}
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
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Titre du Projet</label>
                        <input
                          name="title"
                          value={editForm.title}
                          onChange={handleFormChange}
                          className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Catégorie</label>
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleFormChange}
                          className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                        >
                          {filters.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Slug URL</label>
                        <input
                          name="slug"
                          value={editForm.slug}
                          onChange={handleFormChange}
                          className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none font-mono bg-slate-50"
                          disabled
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Mots-clés / Tags (séparés par des virgules)</label>
                        <input
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[10px] uppercase font-bold">Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleFormChange}
                        rows={3}
                        className="w-full bg-white border border-slate-200 rounded p-3 text-slate-900 resize-none focus:border-fluxion-pink-neon focus:outline-none"
                      />
                    </div>

                    {/* Cover image field */}
                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[10px] uppercase font-bold">Image de couverture</label>
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-slate-200 rounded-lg bg-white">
                        <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                          {editForm.imageSrc ? (
                            <Image src={editForm.imageSrc} alt="Preview" fill sizes="80px" className="object-cover" />
                          ) : (
                            <Upload className="text-slate-300" size={20} />
                          )}
                          {isUploadingImage && (
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
                              disabled={isUploadingImage}
                            />
                          </label>
                          <input
                            name="imageSrc"
                            value={editForm.imageSrc}
                            onChange={handleFormChange}
                            placeholder="Ou coller un lien direct d'image"
                            className="w-full h-8 bg-white border border-slate-200 rounded px-2.5 text-[10px] focus:border-fluxion-pink-neon focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard display */
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:opacity-85"
                        onClick={() => setSelectedPreviewSlug(project.slug)}
                      >
                        <Image src={project.imageSrc} alt={project.title} fill sizes="64px" className="object-cover" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-black text-sm text-slate-900 tracking-tight uppercase">
                            {project.title}
                          </h4>
                          {project.href && (
                            <a
                              href={project.href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <LinkIcon size={12} />
                            </a>
                          )}
                        </div>
                        <p className="text-[10px] text-fluxion-pink-neon font-inter font-bold tracking-wider uppercase mt-0.5">
                          {project.category}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 max-w-md">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="p-2 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setProjectToDelete(project)}
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
          })}
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            Prévisualisation Projet
          </h3>

          {selectedProject ? (
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-[10px] font-bold text-fluxion-pink-neon uppercase tracking-[0.2em] font-inter">
                  RÉALISATION FLUXION
                </span>
                <h4 className="text-lg font-heading font-black text-slate-900 uppercase tracking-tight mt-1">
                  {selectedProject.title}
                </h4>
              </div>

              <div className="space-y-4">
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 shadow">
                  <Image src={selectedProject.imageSrc} alt={selectedProject.title} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 uppercase font-bold block">Catégorie</span>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 border text-[9px] font-bold uppercase text-slate-700">
                    {selectedProject.category}
                  </span>
                </div>

                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-slate-400 uppercase font-bold block">Mots-clés / Badges</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-pink-50/50 border border-pink-100 text-fluxion-pink-neon text-[9px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 uppercase font-bold block">Description</span>
                  <p className="text-[10px] text-slate-600 leading-relaxed font-inter bg-slate-50 border border-slate-100 rounded-lg p-3 max-h-[120px] overflow-y-auto">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {selectedProject.href && (
                <a
                  href={selectedProject.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-10 rounded-xl flex items-center justify-center text-[10px] font-bold tracking-wider uppercase bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-colors"
                >
                  Ouvrir la fiche projet
                </a>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 text-center text-slate-400 text-[10px]">
              Sélectionnez un projet à gauche pour voir sa prévisualisation détaillée.
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={Boolean(projectToDelete)}
        title="Supprimer ce projet ?"
        description={`Le projet ${projectToDelete?.title ?? "sélectionné"} sera retiré de la liste. Pensez à publier les modifications pour l'appliquer au site.`}
        onOpenChange={(open) => {
          if (!open) setProjectToDelete(null);
        }}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
}
