import Approach from "@/components/client/Approach";
import FeaturesSection from "@/components/client/FeaturesSection";
import VideoSection from "@/components/client/VideoSection";
import Testimonials from "@/components/client/Testimonials";
import Partners from "@/components/client/Partners";
import FinalCTA from "@/components/client/FinalCTA";
import WhyUs from "@/components/client/WhyUs";
import TeamGrid from "@/components/client/TeamGrid";

export default function ClientPage() {
  return (
    <div className="relative">
      <div className="relative">
        <VideoSection />
      </div>
      <Approach />
      <Partners />
      {/*<FeaturesSection />*/}
      <WhyUs />
      <Testimonials />
      <TeamGrid />
      <FinalCTA />
    </div>
  );
}
