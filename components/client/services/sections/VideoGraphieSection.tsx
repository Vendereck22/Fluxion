import ServiceBand from "../ServiceBand";

const COPY =
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed " +
  "diam nonummy nibh euismod tincidunt ut laoreet dolore magna " +
  "aliquam erat volutpat. Ut wisi enim ad minim veniam, quis " +
  "nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip " +
  "ex ea commodo consequat. Duis autem vel";

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
