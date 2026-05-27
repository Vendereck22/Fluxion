import ServiceBand from "../ServiceBand";

const COPY =
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed " +
  "diam nonummy nibh euismod tincidunt ut laoreet dolore magna " +
  "aliquam erat volutpat. Ut wisi enim ad minim veniam, quis " +
  "nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip " +
  "ex ea commodo consequat. Duis autem vel";

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