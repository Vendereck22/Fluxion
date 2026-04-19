"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { siteContent } from "@/constants/site-content";

interface NewsletterProps {
  className?: string;
  variant?: "full" | "compact";
}

export default function Newsletter({
  className,
  variant = "full",
}: NewsletterProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
  };

  if (variant === "compact") {
    return (
      <div className={cn("space-y-4 text-center md:text-left", className)}>
        <h3 className="font-heading text-xl font-bold relative inline-block md:block">
          {siteContent.newsletter.title}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-8 h-1 bg-fluxion-rose rounded-full" />
        </h3>
        <p className="text-sm text-blue-100/60 leading-relaxed max-w-xs mx-auto md:mx-0">
          {siteContent.newsletter.description.replace(/\*\*/g, "")}
        </p>
        {status === "success" ? (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl animate-in fade-in zoom-in">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-xs text-green-400 font-bold">{siteContent.newsletter.statusSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <Input
                required
                type="email"
                placeholder={siteContent.newsletter.placeholder}
                className="bg-white/5 border-white/10 pl-10 h-11 rounded-xl text-xs focus-visible:ring-fluxion-rose text-white placeholder:text-white/20"
              />
            </div>
            <Button
              disabled={status === "loading"}
              className="h-11 rounded-xl bg-fluxion-rose hover:bg-white hover:text-fluxion-rose font-bold text-xs transition-all group"
            >
              {status === "loading" ? siteContent.newsletter.statusLoading : siteContent.newsletter.button}
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className={cn("relative py-12 px-6", className)}>
      <div className="container mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-fluxion-blue p-8 md:p-12 shadow-2xl border border-white/5">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-fluxion-rose/20 rounded-full blur-[100px]" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-fluxion-blue/40 rounded-full blur-[100px]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left space-y-4 max-w-md">
              <h3 className="text-3xl md:text-4xl font-heading font-black text-white leading-tight">
                {siteContent.newsletter.title.split(" ").slice(0, 2).join(" ")} <br />{" "}
                <span className="text-fluxion-rose italic">{siteContent.newsletter.title.split(" ").slice(2).join(" ")}</span>
              </h3>
              <p className="text-white/60 font-medium">
                {siteContent.newsletter.description}
              </p>
            </div>
            <div className="w-full lg:w-auto min-w-[320px] md:min-w-[450px]">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-green-500/30 animate-in fade-in zoom-in duration-500">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
                  <p className="text-white font-bold">
                    {siteContent.newsletter.successTitle}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {siteContent.newsletter.successMessage}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="relative flex flex-col sm:flex-row gap-4"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <Input
                      required
                      type="email"
                      placeholder={siteContent.newsletter.placeholder}
                      className="bg-white/10 border-white/10 pl-12 h-16 rounded-2xl focus-visible:ring-fluxion-rose text-white placeholder:text-white/30 text-lg"
                    />
                  </div>
                  <Button
                    disabled={status === "loading"}
                    className={cn(
                      "h-16 px-8 rounded-2xl bg-fluxion-rose hover:bg-white hover:text-fluxion-rose font-bold text-lg transition-all group",
                      status === "loading" && "opacity-70 cursor-not-allowed",
                    )}
                  >
                    {status === "loading" ? siteContent.newsletter.statusLoading : siteContent.newsletter.button}
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              )}
              <p className="text-[10px] text-white/30 mt-4 text-center lg:text-left uppercase tracking-widest">
                {siteContent.newsletter.spamNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
