import ServiceBand from "../ServiceBand";

const COPY =
  "Nous accompagnons les besoins techniques lies aux installations, prototypes et integrations electroniques. Notre approche privilegie la fiabilite, la simplicite d'utilisation et une execution adaptee au contexte de chaque projet.";

export default function ElectroniqueSection() {
  return (
    <ServiceBand
      tone="navy"
      title="Electronique"
      accent="Photographie"
      description={COPY}
    />
  );
}
