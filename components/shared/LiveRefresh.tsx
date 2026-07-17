"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const DEFAULT_INTERVAL_MS = 5000;

type VersionResponse = {
  version?: number;
};

export default function LiveRefresh({
  intervalMs = DEFAULT_INTERVAL_MS,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const lastVersionRef = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function checkVersion() {
      if (!isMounted || isRefreshingRef.current) return;
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;

      try {
        const response = await fetch(`/api/content-version?path=${encodeURIComponent(pathname)}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as VersionResponse;
        if (typeof data.version !== "number") return;

        if (lastVersionRef.current === null) {
          lastVersionRef.current = data.version;
          return;
        }

        if (data.version !== lastVersionRef.current) {
          lastVersionRef.current = data.version;
          isRefreshingRef.current = true;
          router.refresh();
          window.setTimeout(() => {
            isRefreshingRef.current = false;
          }, 1200);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.warn("Live refresh check skipped:", error);
        }
      }
    }

    checkVersion();
    const interval = window.setInterval(checkVersion, intervalMs);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(interval);
    };
  }, [intervalMs, pathname, router]);

  return null;
}
