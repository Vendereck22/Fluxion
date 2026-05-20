import { getSubscribers, getNewsletterLogs } from "@/app/actions/newsletter";
import NewsletterManager from "./NewsletterManager";
import { Mail } from "lucide-react";

export const revalidate = 0; // Disable caching

export default async function NewsletterCMSPage() {
  const subscribers = await getSubscribers();
  const logs = await getNewsletterLogs();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              Newsletter
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Gérez vos abonnés, composez et envoyez des emails de campagne.
          </p>
        </div>
      </div>

      <NewsletterManager initialSubscribers={subscribers} initialLogs={logs} />
    </div>
  );
}
