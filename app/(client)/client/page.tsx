import FeaturesSection from "@/components/client/FeaturesSection";
import VideoSection from "@/components/client/VideoSection";

export default function ClientPage() {
  return (
    <div className="relative">
      <div className="relative">
        <VideoSection />
      </div>
      <FeaturesSection />
    </div>
  );
}
