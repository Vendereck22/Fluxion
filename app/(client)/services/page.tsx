import ServicesHero from "@/components/client/services/ServicesHero";
import ServiceSpacer from "@/components/client/services/ServiceSpacer";
import ServiceBand from "@/components/client/services/ServiceBand";
import { getPublicServiceFeatures } from "@/lib/server/public-content";

export const revalidate = 300;

const visualPresets = [
  {
    tone: "violet" as const,
    accent: "Design",
    rightImage: {
      src: "/images/services/design-collage.png",
      alt: "Design Fluxion",
      fit: "cover" as const,
      priority: true,
    },
  },
  {
    tone: "violet" as const,
    accent: "Site-Web",
    rightImage: {
      src: "/images/services/program-visual.png",
      alt: "Programmation Fluxion",
      fit: "cover" as const,
    },
  },
  {
    tone: "navy" as const,
    accent: "Production",
    rightImage: {
      src: "/images/services/video-camera.png",
      alt: "Production video Fluxion",
      fit: "cover" as const,
    },
  },
];

export default async function Services() {
  const services = await getPublicServiceFeatures();

  return (
    <div className="min-h-screen bg-white">
      <ServicesHero title="Nos services" description={services.description} />
      {services.items.map((item, index) => {
        const preset = visualPresets[index % visualPresets.length];

        return (
          <div key={`${item.title}-${index}`}>
            <ServiceBand
              tone={preset.tone}
              title={item.title}
              accent={item.moreLabel ?? preset.accent}
              description={item.description}
              rightImage={preset.rightImage}
            />
            <ServiceSpacer />
          </div>
        );
      })}
      <ServiceSpacer />
      <div className="h-6 md:h-10 bg-white" />
    </div>
  );
}
