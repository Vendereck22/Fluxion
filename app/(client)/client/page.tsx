import Approach from "@/components/client/Approach";
import VideoSection from "@/components/client/VideoSection";
import Testimonials from "@/components/client/Testimonials";
import Partners from "@/components/client/Partners";
import FinalCTA from "@/components/client/FinalCTA";
import WhyUs from "@/components/client/WhyUs";
import TeamGrid from "@/components/client/TeamGrid";
import { getPublicPartners, getPublicTeam } from "@/lib/server/public-content";

export const revalidate = 1;

export default async function ClientPage() {
  const [partners, team] = await Promise.all([
    getPublicPartners(),
    getPublicTeam(),
  ]);

  return (
    <div className="relative">
      <div className="relative">
        <VideoSection />
      </div>
      <Approach />
      <Partners badge={partners.badge} logos={partners.logos} />

      <WhyUs />
      <Testimonials />
      <TeamGrid title={team.title} members={team.members} />
      <FinalCTA />
    </div>
  );
}
