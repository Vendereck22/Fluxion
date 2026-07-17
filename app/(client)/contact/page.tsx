"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/app/actions/leads";
import { useSiteContent } from "@/components/client/SiteContentProvider";
import SocialMedia from "@/components/client/SocialMedia";

export default function ContactPage() {
  const siteContent = useSiteContent();
  const [formData, setFormData] = useState({
    lastName: "",
    middleName: "",
    firstName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status !== "idle") setStatus("idle");
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lastName || !formData.firstName || !formData.phone || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMessage("Veuillez remplir les champs obligatoires (*).");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await submitLead(formData);
      if (res.success) {
        setStatus("success");
        setFormData({
          lastName: "",
          middleName: "",
          firstName: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Une erreur s'est produite.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Une erreur de réseau s'est produite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 antialiased pt-28 pb-20 relative overflow-hidden font-sans">

      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fluxion-cobalt/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-fluxion-rose/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="fluxion-container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="px-3 py-1 rounded-full bg-fluxion-cobalt/10 text-fluxion-cobalt text-xs font-bold uppercase tracking-[0.25em]">
            {siteContent.pages.contact.title}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-fluxion-blue tracking-tight">
            Prêt à propulser votre vision ?
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            {siteContent.pages.contact.description || "Parlons de votre projet et concevons ensemble une identité numérique forte."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white/60 backdrop-blur-xl border border-slate-100 rounded-2xl p-6 md:p-10">


          <div className="lg:col-span-5 flex flex-col justify-between bg-fluxion-blue text-white rounded-2xl p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-fluxion-gradient opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold font-heading mb-2">Travaillons ensemble</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Remplissez le formulaire et notre équipe technique vous contactera sous 24 heures ouvrées.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-white">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Email</p>
                    <a href={`mailto:${siteContent.footer.email}`} className="text-sm font-semibold hover:underline">
                      {siteContent.footer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-white">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Téléphone</p>
                    <a href="tel:+24300000000" className="text-sm font-semibold hover:underline">
                      +243 899 999 999
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-white">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Bureau</p>
                    <p className="text-sm font-semibold">{siteContent.footer.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-10 border-t border-white/10 flex items-center justify-center">
              <SocialMedia className="justify-center" />
            </div>
          </div>


          <div className="lg:col-span-7 py-4 px-2">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 font-heading">Message envoyé !</h3>
                <p className="text-slate-500 max-w-sm text-sm">
                  Merci pour votre message. L'équipe FLUXION étudiera vos besoins et vous répondra très rapidement.
                </p>
                <Button
                  onClick={() => setStatus("idle")}
                  className="mt-4 bg-fluxion-blue text-white rounded-xl px-6 font-bold"
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-bold text-slate-700">Nom *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Ex: Kanda"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="border-slate-200 focus:border-fluxion-cobalt rounded-xl h-11 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-xs font-bold text-slate-700">Post-nom</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      placeholder="Ex: Ngandu"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-fluxion-cobalt rounded-xl h-11 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-bold text-slate-700">Prénom *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Ex: Doxel"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="border-slate-200 focus:border-fluxion-cobalt rounded-xl h-11 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Numéro de téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Ex: +243 899 999 999"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="border-slate-200 focus:border-fluxion-cobalt rounded-xl h-11 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">Adresse email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Ex: contact@exemple.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-slate-200 focus:border-fluxion-cobalt rounded-xl h-11 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-bold text-slate-700">Votre Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Expliquez-nous votre besoin, votre projet ou la raison de votre prise de contact..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="border-slate-200 focus:border-fluxion-cobalt rounded-xl resize-none bg-slate-50/50"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-shake">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-fluxion-blue hover:bg-fluxion-rose text-white rounded-xl font-bold shadow-lg shadow-fluxion-blue/20 transition-all gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Envoyer ma demande
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
