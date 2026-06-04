import ServiceBand from "../ServiceBand";

const COPY =
  "Nous produisons des contenus photo et video capables de valoriser vos produits, vos services et votre equipe. Du cadrage a la post-production, chaque image est construite pour transmettre confiance, energie et professionnalisme.";

export default function VideoGraphieSection() {
  return (
    <ServiceBand
      tone="violet"
      title="Vidéo Graphie"
      accent="Photographie"
      description={COPY}
      rightImage={{
        src: "/images/services/new/video.jpg",
        alt: "Video Graphie - camera",
        fit: "cover",
      }}
    />
  );
}
