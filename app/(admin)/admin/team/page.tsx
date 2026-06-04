import TeamManager from "./TeamManager";
import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function TeamCMSPage() {
  const teamMembers = (
    await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
    })
  ).map((member, index) => ({
    id: index + 1,
    name: member.name,
    role: member.role,
    bio: member.bio ?? "",
    img: member.imageSrc ?? "",
    socials: {
      linkedin: member.linkedin ?? "",
      twitter: member.twitter ?? "",
      instagram: member.instagram ?? "",
    },
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Users className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              GESTION DE L'ÉQUIPE
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            CMS Dynamique : Modifiez les biographies, les rôles et ajoutez des collaborateurs à l'agence.
          </p>
        </div>
      </div>


      <TeamManager initialMembers={teamMembers} />
    </div>
  );
}
