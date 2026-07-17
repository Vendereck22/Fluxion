import ServiceBand from "../ServiceBand";

const COPY =
  "Nous accompagnons les besoins techniques lies aux installations, prototypes et integrations electroniques. Notre approche privilegie la fiabilite, la simplicite d'utilisation et une execution adaptee au contexte de chaque projet.";

export default function ElectroniqueSection({
  title = "Electronique",
  accent = "Photographie",
  description = COPY,
  imageSrc = "/images/services/new/electronics.jpg",
}: {
  title?: string;
  accent?: string;
  description?: string;
  imageSrc?: string;
}) {
  return (
    <ServiceBand
      tone="navy"
      title={title}
      accent={accent}
      description={description}
      rightImage={{
        src: imageSrc,
        alt: "Electronique Fluxion",
        fit: "cover",
      }}
    />
  );
}
