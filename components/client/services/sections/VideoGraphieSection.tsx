import ServiceBand from "../ServiceBand";

const COPY =
  "Nous produisons des contenus photo et video capables de valoriser vos produits, vos services et votre equipe. Du cadrage a la post-production, chaque image est construite pour transmettre confiance, energie et professionnalisme.";

export default function VideoGraphieSection({
  title = "Vidéo Graphie",
  accent = "Photographie",
  description = COPY,
  imageSrc = "/images/services/new/video.jpg",
}: {
  title?: string;
  accent?: string;
  description?: string;
  imageSrc?: string;
}) {
  return (
    <ServiceBand
      tone="violet"
      title={title}
      accent={accent}
      description={description}
      rightImage={{
        src: imageSrc,
        alt: "Video Graphie Fluxion",
        fit: "cover",
      }}
    />
  );
}
