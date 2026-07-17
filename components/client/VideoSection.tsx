"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/components/client/SiteContentProvider";

export default function VideoSection() {
  const siteContent = useSiteContent();
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoId = "XC_VytVqLXI";
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`;

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
      className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden bg-[#71717a] antialiased"
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
          src={videoSrc}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          title="Background Video"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-fluxion-blue/90 via-transparent to-fluxion-blue/90 z-10 pointer-events-none"></div>
      {!isPlaying && (
        <div className="absolute inset-0 bg-fluxion-blue/20 backdrop-blur-[2px] z-10 pointer-events-none transition-all duration-700"></div>
      )}
      <div className="absolute inset-x-0 bottom-5 z-20 md:bottom-12">
        <div className="fluxion-container flex items-end justify-between gap-4 text-left">
          <div className="max-w-[calc(100%-5rem)] md:max-w-2xl">
            <div className="mb-3 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.22em] text-white/55 md:mb-4 md:text-xs md:tracking-[0.28em]">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  isPlaying ? "bg-fluxion-rose animate-pulse" : "bg-white",
                )}
              />
              <span>{siteContent.video.badge}</span>
              <span className="hidden h-px w-10 bg-white/25 md:block" />
              <span className="hidden md:inline">
                {isPlaying ? siteContent.video.statusStream : siteContent.video.statusStandby}
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed text-white/80 sm:text-sm md:text-base lg:text-lg">
              {siteContent.video.description}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Mettre la video en pause" : "Lire la video"}
            className="group h-16 w-16 shrink-0 rounded-full border border-white/25 bg-white/10 p-0 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-fluxion-rose active:scale-95 md:h-24 md:w-24"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-current transition-transform group-hover:scale-110 md:h-9 md:w-9" />
            ) : (
              <Play className="h-6 w-6 translate-x-0.5 fill-current transition-transform group-hover:scale-110 md:h-9 md:w-9" />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
