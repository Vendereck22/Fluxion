"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import {
  LuUser,
  LuLock,
  LuRefreshCw,
  LuCamera,
  LuCheck,
  LuShieldAlert,
  LuMail,
  LuShieldCheck,
} from "react-icons/lu";
import { uploadImage } from "@/app/actions/upload";
import { updateProfile } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentEmail: string;
  currentAvatarUrl: string;
  currentFirstName?: string;
  currentMiddleName?: string;
  currentLastName?: string;
  onSuccess: (
    newName: string,
    newAvatarUrl: string,
    newEmail?: string,
    newFirstName?: string,
    newMiddleName?: string,
    newLastName?: string
  ) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentEmail,
  currentAvatarUrl,
  currentFirstName = "",
  currentMiddleName = "",
  currentLastName = "",
  onSuccess,
}: EditProfileModalProps) {
  // Identity fields
  const [firstName, setFirstName] = useState(currentFirstName);
  const [middleName, setMiddleName] = useState(currentMiddleName);
  const [lastName, setLastName] = useState(currentLastName);
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);

  // Security fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"identity" | "security">("identity");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFirstName(currentFirstName);
      setMiddleName(currentMiddleName);
      setLastName(currentLastName);
      setName(currentName);
      setEmail(currentEmail);
      setAvatarUrl(currentAvatarUrl);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccessMsg("");
      setActiveTab("identity");
    }
  }, [isOpen, currentFirstName, currentMiddleName, currentLastName, currentName, currentEmail, currentAvatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImage(formData);
      if (res.success && res.url) {
        setAvatarUrl(res.url);
      } else {
        setError(res.error || "Erreur lors du téléchargement de l'image.");
      }
    } catch {
      setError("Erreur de communication avec le serveur.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name.trim()) {
      setError("Le nom d'affichage est obligatoire.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("L'adresse email n'est pas valide.");
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setError("Le mot de passe actuel est requis pour définir un nouveau mot de passe.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await updateProfile({
        name,
        firstName,
        middleName,
        lastName,
        newEmail: email !== currentEmail ? email : undefined,
        avatarUrl,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      });

      if (res.success) {
        setSuccessMsg("Profil mis à jour avec succès !");
        setTimeout(() => {
          onSuccess(name, avatarUrl, res.newEmail, firstName, middleName, lastName);
          onClose();
        }, 1200);
      } else {
        setError(res.error || "Une erreur s'est produite.");
      }
    } catch {
      setError("Erreur de communication avec le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-xl gap-0 overflow-hidden p-0" showCloseButton>
        <div className="bg-slate-950 px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wide text-white">
              Modifier mon profil
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300">
              {currentEmail}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-6">
          <div className="relative group">
            <Avatar className="size-24 border-4 border-white ring-1 ring-slate-200">
              <AvatarImage src={avatarUrl} alt="Photo de profil" />
              <AvatarFallback className="bg-slate-900 text-xl font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <Button
              type="button"
              size="icon-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -right-1 -bottom-1 size-9 rounded-full bg-fluxion-pink-neon text-white hover:bg-fluxion-pink-neon/90"
              aria-label="Changer la photo de profil"
            >
              {isUploading ? (
                <LuRefreshCw size={16} className="animate-spin" />
              ) : (
                <LuCamera size={16} />
              )}
            </Button>
          </div>

          <p className="text-[10px] text-slate-500">
            {isUploading ? "Téléchargement en cours..." : "JPG, PNG ou WEBP - Max 5 Mo"}
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "identity" | "security")}
            className="min-h-0 gap-0"
          >
            <div className="border-b border-slate-100 px-6 py-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="identity">
                  <LuUser size={13} />
                  Identité
                </TabsTrigger>
                <TabsTrigger value="security">
                  <LuShieldCheck size={13} />
                  Sécurité
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="max-h-[360px] overflow-y-auto px-6 py-5">
              <TabsContent value="identity" className="mt-0">
              <div className="space-y-4">
                {/* Row: Prénom + Post-nom */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex : Jean"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="middleName" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Post-nom
                    </Label>
                    <Input
                      id="middleName"
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="Ex : Pierre"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Nom de famille */}
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Nom de famille
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex : Dupont"
                    className="h-9 text-sm"
                  />
                </div>

                {/* Nom d'affichage */}
                <div className="space-y-1.5">
                  <Label htmlFor="displayName" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Nom d&apos;affichage <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom affiché dans l'admin"
                    className="h-9 text-sm"
                    required
                  />
                  <p className="text-[10px] text-slate-400">Ce nom s&apos;affiche dans la barre de navigation</p>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <LuMail size={10} /> Adresse Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@fluxion.cd"
                    className="h-9 text-sm"
                  />
                  {email !== currentEmail && (
                    <p className="text-[10px] text-amber-600 flex items-center gap-1">
                      <LuShieldAlert size={10} /> Vous serez reconnecté avec ce nouvel email
                    </p>
                  )}
                </div>
              </div>
              </TabsContent>

            {/* Security Tab */}
              <TabsContent value="security" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <LuLock size={14} className="text-slate-500 shrink-0" />
                  <p className="text-[11px] text-slate-500">
                    Laissez vide si vous ne souhaitez pas changer votre mot de passe.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Mot de passe actuel
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Votre mot de passe actuel"
                    className="h-9 text-sm"
                    autoComplete="current-password"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Nouveau mot de passe
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 caractères"
                    className="h-9 text-sm"
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez le nouveau mot de passe"
                    className={`h-9 text-sm ${
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200"
                        : confirmPassword && newPassword === confirmPassword
                        ? "border-emerald-400 focus-visible:border-emerald-400"
                        : ""
                    }`}
                    autoComplete="new-password"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[10px] text-red-500 flex items-center gap-1">
                      <LuShieldAlert size={10} /> Les mots de passe ne correspondent pas
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                      <LuCheck size={10} /> Les mots de passe correspondent
                    </p>
                  )}
                </div>
              </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* ── Feedback Messages ── */}
          {(error || successMsg) && (
            <div className="px-6 pb-2">
              {error && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-[11px] font-medium animate-in fade-in">
                  <LuShieldAlert size={13} className="shrink-0" />
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[11px] font-medium animate-in fade-in">
                  <LuCheck size={13} className="shrink-0" />
                  {successMsg}
                </div>
              )}
            </div>
          )}

          {/* ── Footer Buttons ── */}
          <DialogFooter className="gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:justify-stretch">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-9 text-xs"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isSubmitting ? (
                <>
                  <LuRefreshCw size={12} className="animate-spin mr-1.5" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <LuCheck size={13} className="mr-1.5" />
                  Sauvegarder
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
