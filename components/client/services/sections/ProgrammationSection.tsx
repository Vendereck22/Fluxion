import ServiceBand from "../ServiceBand";

const COPY =
  "Nous developpons des sites web, interfaces admin et produits numeriques rapides, responsives et faciles a faire evoluer. L'objectif est simple: une experience fluide pour vos utilisateurs et une base technique fiable pour votre activite.";

export default function ProgrammationSection() {
  return (
    <ServiceBand
      tone="violet"
      title="Programmation"
      accent="Site-Web"
      description={COPY}
      rightImage={{
        src: "/images/services/new/programming.jpg",
        alt: "Programmation - code",
        fit: "cover",
      }}
    />
  );
}
