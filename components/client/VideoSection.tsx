"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteContent } from "@/constants/site-content";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoId = "XC_VytVqLXI";
  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (iframeRef.current?.contentWindow) {
      const command = nextState
        ? '{"event":"command","func":"playVideo","args":""}'
        : '{"event":"command","func":"pauseVideo","args":""}';

      iframeRef.current.contentWindow.postMessage(command, "*");

      if (nextState) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"unMute","args":""}',
          "*",
        );
      }
    }
  };

  return (
    <section
      onClick={handleTogglePlay}
      className="relative h-[65vh] md:h-[85vh] w-full flex items-center justify-center overflow-hidden bg-[#71717a] cursor-pointer antialiased"
    >
      <div
        className={cn(
          "absolute inset-0 w-full h-full transition-opacity duration-1000 overflow-hidden pointer-events-none",
          isPlaying ? "opacity-100" : "opacity-40",
        )}
      >
        <iframe
          ref={iframeRef}
          className="w-[310%] h-[310%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          title="Background Video"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-fluxion-blue/90 via-transparent to-fluxion-blue/90 z-10 pointer-events-none"></div>
      {!isPlaying && (
        <div className="absolute inset-0 bg-fluxion-blue/20 backdrop-blur-[2px] z-10 pointer-events-none transition-all duration-700"></div>
      )}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto space-y-6">
        <span className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 block">
          {siteContent.video.badge}
        </span>
        <h2 className="text-4xl md:text-7xl font-heading font-black text-white leading-[1.1] md:leading-tight tracking-tighter">
          {siteContent.video.title.split("votre")[0]} <br />
          de votre <span className="text-fluxion-rose">{siteContent.video.title.split("votre")[1]}</span>
        </h2>
        <p className="text-white/80 max-w-xl mx-auto text-base md:text-xl font-medium leading-relaxed">
          {siteContent.video.description}
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Button className="h-14 px-10 rounded-2xl bg-fluxion-rose text-white font-bold text-lg shadow-xl shadow-fluxion-rose/20 hover:scale-105 transition-all border-none">
            {siteContent.video.ctaProject}
          </Button>

          <Button
            variant="outline"
            className="h-14 px-10 rounded-2xl border-white/40 text-white hover:bg-white hover:text-fluxion-blue font-bold text-lg backdrop-blur-md transition-colors"
          >
            {isPlaying ? (
              <span className="flex items-center gap-2">
                <Pause className="w-5 h-5 fill-current" /> {siteContent.video.ctaPause}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" /> {siteContent.video.ctaWatch}
              </span>
            )}
          </Button>
        </div>
      </div>
      <div className="absolute bottom-8 left-8 z-30 flex items-center gap-3 opacity-50 text-[10px] font-black uppercase tracking-widest text-white pointer-events-none">
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            isPlaying ? "bg-fluxion-rose animate-pulse" : "bg-white",
          )}
        />
        {isPlaying ? siteContent.video.statusStream : siteContent.video.statusStandby}
      </div>
    </section>
  );
}
