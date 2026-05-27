export default function ServiceSpacer({ size = "lg" }: { size?: "md" | "lg" }) {
  return (
    <div className={size === "lg" ? "h-10 md:h-14 bg-white" : "h-6 md:h-10 bg-white"} />
  );
}