"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Save, Upload, Link as LinkIcon } from "lucide-react";
import { updateContent } from "@/app/actions/content";
import { uploadImage } from "@/app/actions/upload";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ProductItem {
  slug: string;
  name: string;
  onlineUrl?: string;
  shortDescription?: string;
  description: string;
  theme: "red" | "purple";
  imageSrc: string;
  rightImageSrc?: string;
  gallery?: GalleryImage[];
}

interface ProductsManagerProps {
  initialProducts: ProductItem[];
}

export default function ProductsManager({ initialProducts }: ProductsManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<"imageSrc" | "rightImageSrc" | "gallery" | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [selectedPreviewSlug, setSelectedPreviewSlug] = useState<string | null>(
    initialProducts.length > 0 ? initialProducts[0].slug : null
  );

  // Edit form state
  const [editForm, setEditForm] = useState<ProductItem>({
    slug: "",
    name: "",
    onlineUrl: "",
    shortDescription: "",
    description: "",
    theme: "red",
    imageSrc: "",
    rightImageSrc: "",
    gallery: [],
  });

  const handleEditClick = (product: ProductItem) => {
    setEditingSlug(product.slug);
    setEditForm({
      ...product,
      onlineUrl: product.onlineUrl || "",
      shortDescription: product.shortDescription || "",
      rightImageSrc: product.rightImageSrc || "",
      gallery: product.gallery || [],
    });
    setSelectedPreviewSlug(product.slug);
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
      if (name === "name" && !editingSlug) {
        // Only auto-generate slug on new items creation
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "imageSrc" | "rightImageSrc" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(target);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImage(formData);
      if (res.success && res.url) {
        if (target === "gallery") {
          setEditForm((prev) => ({
            ...prev,
            gallery: [...(prev.gallery || []), { src: res.url, alt: `${prev.name} - image ${prev.gallery?.length || 0 + 1}` }],
          }));
        } else {
          setEditForm((prev) => ({ ...prev, [target]: res.url }));
        }
      } else {
        alert(res.error || "Une erreur s'est produite lors du téléchargement.");
      }
    } catch {
      alert("Une erreur de communication est survenue.");
    } finally {
      setIsUploadingImage(null);
    }
  };

  const handleSaveProduct = () => {
    if (!editForm.name || !editForm.description) {
      alert("Le nom et la description sont obligatoires.");
      return;
    }

    if (!editForm.slug) {
      editForm.slug = editForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const exists = products.some((p) => p.slug === editForm.slug && editingSlug !== p.slug);
    if (exists) {
      alert("Un produit avec ce slug (identifiant unique URL) existe déjà.");
      return;
    }

    let updated: ProductItem[];
    if (editingSlug === "NEW_PRODUCT") {
      updated = [...products, editForm];
      setSelectedPreviewSlug(editForm.slug);
    } else {
      updated = products.map((p) => (p.slug === editingSlug ? editForm : p));
    }

    setProducts(updated);
    setEditingSlug(null);
    setStatus("idle");
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    const updated = products.filter((p) => p.slug !== productToDelete.slug);
    setProducts(updated);
    setStatus("idle");
    if (selectedPreviewSlug === productToDelete.slug) {
      setSelectedPreviewSlug(updated.length > 0 ? updated[0].slug : null);
    }
    setProductToDelete(null);
  };

  const handleAddProduct = () => {
    const newProduct: ProductItem = {
      slug: "",
      name: "",
      onlineUrl: "",
      shortDescription: "",
      description: "",
      theme: "red",
      imageSrc: "",
      rightImageSrc: "",
      gallery: [],
    };

    setEditingSlug("NEW_PRODUCT");
    setEditForm(newProduct);
    setSelectedPreviewSlug("NEW_PRODUCT");
    setStatus("idle");
  };

  const handleSaveChangesToDisk = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const res = await updateContent("productsPage", { items: products });
      if (res.success) {
        setStatus("success");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleGalleryAltChange = (index: number, alt: string) => {
    setEditForm((prev) => {
      const updated = [...(prev.gallery || [])];
      updated[index] = { ...updated[index], alt };
      return { ...prev, gallery: updated };
    });
  };

  const selectedProduct = editingSlug === "NEW_PRODUCT" ? editForm : products.find((p) => p.slug === selectedPreviewSlug);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
            Changements en attente (Produits)
          </h4>
          <p className="text-[10px] text-slate-500 font-inter mt-0.5">
            Gérez vos produits, visualisez la galerie d'images et publiez les modifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddProduct}
            className="h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            Créer un produit
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
                Publier les produits
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Products List & Form */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            Produits de l'agence ({products.length})
          </h3>

          {editingSlug === "NEW_PRODUCT" && (
            <div className="border rounded-xl p-5 bg-slate-50 border-fluxion-pink-neon/50 shadow-sm animate-in fade-in duration-300">
              {/* Add/New Product inline form */}
              <div className="space-y-4 font-inter text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-bold text-fluxion-pink-neon uppercase text-[10px] tracking-wider">Nouveau Produit</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProduct}
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
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Nom du Produit</label>
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleFormChange}
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Lien de démo / site web (onlineUrl)</label>
                    <input
                      name="onlineUrl"
                      value={editForm.onlineUrl}
                      onChange={handleFormChange}
                      placeholder="https://..."
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Slug URL</label>
                    <input
                      name="slug"
                      value={editForm.slug}
                      onChange={handleFormChange}
                      placeholder="generé-automatiquement"
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Thème Couleur (Fiche Produit)</label>
                    <select
                      name="theme"
                      value={editForm.theme}
                      onChange={handleFormChange}
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                    >
                      <option value="red">Rouge Néon (Setly Style)</option>
                      <option value="purple">Violet Cobalt (Trim Style)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[10px] uppercase font-bold">Description Courte</label>
                  <input
                    name="shortDescription"
                    value={editForm.shortDescription}
                    onChange={handleFormChange}
                    className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[10px] uppercase font-bold">Description Détaillée</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded p-3 text-slate-900 resize-none focus:border-fluxion-pink-neon focus:outline-none"
                  />
                </div>

                {/* Main Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Image Principale (Gauche/Hero)</label>
                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white">
                      <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center border overflow-hidden flex-shrink-0">
                        {isUploadingImage === "imageSrc" ? (
                          <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        ) : editForm.imageSrc ? (
                          <Image src={editForm.imageSrc} alt="Preview" fill sizes="40px" className="object-cover" />
                        ) : (
                          <Upload size={14} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="inline-flex px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border text-[9px] font-bold uppercase cursor-pointer">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "imageSrc")}
                          />
                        </label>
                        <input
                          name="imageSrc"
                          value={editForm.imageSrc}
                          onChange={handleFormChange}
                          placeholder="Lien de l'image"
                          className="w-full h-6 border-b text-[9px] focus:outline-none mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Image Complémentaire (Droite/Optionnelle)</label>
                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white">
                      <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center border overflow-hidden flex-shrink-0">
                        {isUploadingImage === "rightImageSrc" ? (
                          <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        ) : editForm.rightImageSrc ? (
                          <Image src={editForm.rightImageSrc} alt="Preview" fill sizes="40px" className="object-cover" />
                        ) : (
                          <Upload size={14} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="inline-flex px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border text-[9px] font-bold uppercase cursor-pointer">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "rightImageSrc")}
                          />
                        </label>
                        <input
                          name="rightImageSrc"
                          value={editForm.rightImageSrc}
                          onChange={handleFormChange}
                          placeholder="/images/products/..."
                          className="w-full h-6 border-b text-[9px] focus:outline-none mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Galerie d'images ({editForm.gallery?.length || 0})</span>
                    <label className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors">
                      {isUploadingImage === "gallery" ? (
                        <span className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-1" />
                      ) : (
                        <Plus size={10} />
                      )}
                      Ajouter une photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "gallery")}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {editForm.gallery?.map((img, idx) => (
                      <div key={idx} className="flex gap-2 p-2 border border-slate-200 rounded-lg bg-white">
                        <div className="relative w-12 h-12 rounded overflow-hidden border flex-shrink-0">
                          <Image src={img.src} alt={img.alt} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <input
                            value={img.alt}
                            onChange={(e) => handleGalleryAltChange(idx, e.target.value)}
                            placeholder="Alt text"
                            className="w-full h-6 border-b text-[9px] focus:outline-none"
                          />
                          <button
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="text-[9px] text-red-500 hover:text-red-700 font-bold uppercase flex items-center gap-0.5"
                          >
                            <Trash2 size={8} /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {products.map((product) => {
            const isEditing = editingSlug === product.slug;

            return (
              <div
                key={product.slug}
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
                          onClick={handleSaveProduct}
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
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Nom du Produit</label>
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleFormChange}
                          className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Lien de démo / site web (onlineUrl)</label>
                        <input
                          name="onlineUrl"
                          value={editForm.onlineUrl}
                          onChange={handleFormChange}
                          placeholder="https://..."
                          className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                        />
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
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Thème Couleur (Fiche Produit)</label>
                        <select
                          name="theme"
                          value={editForm.theme}
                          onChange={handleFormChange}
                          className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                        >
                          <option value="red">Rouge Néon (Setly Style)</option>
                          <option value="purple">Violet Cobalt (Trim Style)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[10px] uppercase font-bold">Description Courte</label>
                      <input
                        name="shortDescription"
                        value={editForm.shortDescription}
                        onChange={handleFormChange}
                        className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[10px] uppercase font-bold">Description Détaillée</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full bg-white border border-slate-200 rounded p-3 text-slate-900 resize-none focus:border-fluxion-pink-neon focus:outline-none"
                      />
                    </div>

                    {/* Main Images */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Image Principale (Gauche/Hero)</label>
                        <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white">
                          <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center border overflow-hidden flex-shrink-0">
                            {editForm.imageSrc ? (
                              <Image src={editForm.imageSrc} alt="Preview" fill sizes="40px" className="object-cover" />
                            ) : (
                              <Upload size={14} className="text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="inline-flex px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border text-[9px] font-bold uppercase cursor-pointer">
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "imageSrc")}
                              />
                            </label>
                            <input
                              name="imageSrc"
                              value={editForm.imageSrc}
                              onChange={handleFormChange}
                              placeholder="Lien de l'image"
                              className="w-full h-6 border-b text-[9px] focus:outline-none mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-500 text-[10px] uppercase font-bold">Image Complémentaire (Droite/Optionnelle)</label>
                        <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white">
                          <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center border overflow-hidden flex-shrink-0">
                            {editForm.rightImageSrc ? (
                              <Image src={editForm.rightImageSrc} alt="Preview" fill sizes="40px" className="object-cover" />
                            ) : (
                              <Upload size={14} className="text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="inline-flex px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border text-[9px] font-bold uppercase cursor-pointer">
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "rightImageSrc")}
                              />
                            </label>
                            <input
                              name="rightImageSrc"
                              value={editForm.rightImageSrc}
                              onChange={handleFormChange}
                              placeholder="/images/products/..."
                              className="w-full h-6 border-b text-[9px] focus:outline-none mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gallery */}
                    <div className="border-t border-slate-200 pt-4 mt-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-500 text-[10px] uppercase font-bold">Galerie d'images ({editForm.gallery?.length || 0})</span>
                        <label className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors">
                          <Plus size={10} />
                          Ajouter une photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "gallery")}
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {editForm.gallery?.map((img, idx) => (
                          <div key={idx} className="flex gap-2 p-2 border border-slate-200 rounded-lg bg-white">
                            <div className="relative w-12 h-12 rounded overflow-hidden border flex-shrink-0">
                              <Image src={img.src} alt={img.alt} fill sizes="48px" className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <input
                                value={img.alt}
                                onChange={(e) => handleGalleryAltChange(idx, e.target.value)}
                                placeholder="Alt text"
                                className="w-full h-6 border-b text-[9px] focus:outline-none"
                              />
                              <button
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="text-[9px] text-red-500 hover:text-red-700 font-bold uppercase flex items-center gap-0.5"
                              >
                                <Trash2 size={8} /> Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Card */
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:opacity-85"
                        onClick={() => setSelectedPreviewSlug(product.slug)}
                      >
                        <Image src={product.imageSrc} alt={product.name} fill sizes="64px" className="object-cover" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-black text-sm text-slate-900 tracking-tight uppercase">
                            {product.name}
                          </h4>
                          {product.onlineUrl && (
                            <a
                              href={product.onlineUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <LinkIcon size={12} />
                            </a>
                          )}
                        </div>
                        <p className={`text-[10px] font-inter font-bold tracking-wider uppercase mt-0.5 ${
                          product.theme === "red" ? "text-red-500" : "text-violet-600"
                        }`}>
                          THEME: {product.theme}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 max-w-md">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
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

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            Prévisualisation Produit
          </h3>

          {selectedProduct ? (
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] font-inter ${
                  selectedProduct.theme === "red" ? "text-red-500" : "text-violet-600"
                }`}>
                  PRODUIT FLUXION ({selectedProduct.theme})
                </span>
                <h4 className="text-lg font-heading font-black text-slate-900 uppercase tracking-tight mt-1">
                  {selectedProduct.name}
                </h4>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase font-bold block mb-1">Image Principale</span>
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <Image src={selectedProduct.imageSrc} alt={selectedProduct.name} fill sizes="(max-width: 1024px) 50vw, 180px" className="object-cover" />
                    </div>
                  </div>
                  {selectedProduct.rightImageSrc && (
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase font-bold block mb-1">Image Complémentaire</span>
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <Image src={selectedProduct.rightImageSrc} alt="Complementary" fill sizes="(max-width: 1024px) 50vw, 180px" className="object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 uppercase font-bold block">Description courte</span>
                  <p className="text-xs font-bold text-slate-800">{selectedProduct.shortDescription || "Aucune description courte."}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 uppercase font-bold block">Description complète</span>
                  <p className="text-[10px] text-slate-600 leading-relaxed font-inter bg-slate-50 border border-slate-100 rounded-lg p-3 max-h-[120px] overflow-y-auto">
                    {selectedProduct.description || "Aucune description complète."}
                  </p>
                </div>

                {/* Mini Gallery Preview */}
                {selectedProduct.gallery && selectedProduct.gallery.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-slate-400 uppercase font-bold block">Galerie ({selectedProduct.gallery.length} images)</span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProduct.gallery.map((img, idx) => (
                        <div key={idx} className="relative group flex-shrink-0">
                          <div className="relative w-12 h-12 rounded overflow-hidden border border-slate-200">
                            <Image src={img.src} alt={img.alt} fill sizes="48px" className="object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedProduct.onlineUrl && (
                <a
                  href={selectedProduct.onlineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full h-10 rounded-xl flex items-center justify-center text-[10px] font-bold tracking-wider uppercase border text-white transition-all ${
                    selectedProduct.theme === "red"
                      ? "bg-red-500 border-red-600 hover:bg-red-600"
                      : "bg-violet-600 border-violet-700 hover:bg-violet-700"
                  }`}
                >
                  Visiter le site
                </a>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 text-center text-slate-400 text-[10px]">
              Sélectionnez un produit à gauche pour voir sa prévisualisation détaillée.
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={Boolean(productToDelete)}
        title="Supprimer ce produit ?"
        description={`Le produit ${productToDelete?.name ?? "sélectionné"} sera retiré de la liste. Pensez à publier les modifications pour l'appliquer au site.`}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}
