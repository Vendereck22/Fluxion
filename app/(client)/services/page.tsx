import ServicesHero from "@/components/client/services/ServicesHero";
import ServiceSpacer from "@/components/client/services/ServiceSpacer";
import DesignSection from "@/components/client/services/sections/DesignSection";
import ElectroniqueSection from "@/components/client/services/sections/ElectroniqueSection";
import ProgrammationSection from "@/components/client/services/sections/ProgrammationSection";
import VideoGraphieSection from "@/components/client/services/sections/VideoGraphieSection";
import { getPublicServiceFeatures } from "@/lib/server/public-content";

export const revalidate = 1;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function Services() {
  const services = await getPublicServiceFeatures();
  const getService = (keywords: string[]) =>
    services.items.find((item) => {
      const title = normalize(item.title);
      return keywords.some((keyword) => title.includes(keyword));
    });

  const design = getService(["design", "graph"]);
  const programmation = getService(["programmation", "site", "web", "code"]);
  const video = getService(["video", "photo", "production"]);
  const electronique = getService(["electronique", "technique"]);

  return (
    <div className="min-h-screen bg-white">
      <ServicesHero title="Nos services" description={services.description} />
      <DesignSection
        title={design?.title}
        accent={design?.moreLabel}
        description={design?.description}
        gallery={design?.gallery}
      />
      <ServiceSpacer />
      <ProgrammationSection
        title={programmation?.title}
        accent={programmation?.moreLabel}
        description={programmation?.description}
        imageSrc={programmation?.imageSrc}
      />
      <ServiceSpacer />
      <VideoGraphieSection
        title={video?.title}
        accent={video?.moreLabel}
        description={video?.description}
        imageSrc={video?.imageSrc}
      />
      <ServiceSpacer />
      <ElectroniqueSection
        title={electronique?.title}
        accent={electronique?.moreLabel}
        description={electronique?.description}
        imageSrc={electronique?.imageSrc}
      />
      <ServiceSpacer />
      <div className="h-6 md:h-10 bg-white" />
    </div>
  );
}
