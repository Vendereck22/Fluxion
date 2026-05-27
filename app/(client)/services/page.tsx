import ServicesHero from "@/components/client/services/ServicesHero";
import ServiceSpacer from "@/components/client/services/ServiceSpacer";
import DesignSection from "@/components/client/services/sections/DesignSection";
import ProgrammationSection from "@/components/client/services/sections/ProgrammationSection";
import VideoGraphieSection from "@/components/client/services/sections/VideoGraphieSection";
import ElectroniqueSection from "@/components/client/services/sections/ElectroniqueSection";

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <ServicesHero />
      <DesignSection />
      <ServiceSpacer />
      <ProgrammationSection />
      <ServiceSpacer />
      <VideoGraphieSection />
      <ServiceSpacer />
      <ElectroniqueSection />
      <ServiceSpacer />
      <div className="h-6 md:h-10 bg-white" />
    </div>
  );
}
