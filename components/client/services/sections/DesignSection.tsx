import ServiceBand from "../ServiceBand";
import ServiceImageCarousel from "../ServiceImageCarousel";

const COPY =
  "Nous concevons des identites visuelles, flyers, affiches et supports digitaux qui donnent une direction claire a votre marque. Chaque creation respecte votre positionnement, votre audience et les usages reels de vos canaux de communication.";

const fallbackImages = [
  "/images/services/new/design-1.jpg",
  "/images/services/new/design-2.jpg",
  "/images/services/new/design-3.jpg",
  "/images/services/new/design-4.jpg",
  "/images/services/new/design-5.jpg",
  "/images/services/new/design-6.jpg",
].map((src, index) => ({
  src,
  alt: `Design Fluxion ${index + 1}`,
}));

export default function DesignSection({
  title = "Design",
  accent = "Flyer",
  description = COPY,
  gallery,
}: {
  title?: string;
  accent?: string;
  description?: string;
  gallery?: { src: string; alt: string }[];
}) {
  const images = gallery && gallery.length >= 4 ? gallery : fallbackImages;

  return (
    <ServiceBand
      tone="violet"
      title={title}
      accent={accent}
      description={description}
      right={<ServiceImageCarousel images={images} priority />}
    />
  );
}
