import ServiceBand from "../ServiceBand";

const COPY =
  "Nous developpons des sites web, interfaces admin et produits numeriques rapides, responsives et faciles a faire evoluer. L'objectif est simple: une experience fluide pour vos utilisateurs et une base technique fiable pour votre activite.";

export default function ProgrammationSection({
  title = "Programmation",
  accent = "Site-Web",
  description = COPY,
  imageSrc = "/images/services/new/programming.jpg",
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
        alt: "Programmation Fluxion",
        fit: "cover",
      }}
    />
  );
}
