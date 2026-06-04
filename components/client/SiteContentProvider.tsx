"use client";

import { createContext, useContext } from "react";
import { siteContent as fallbackSiteContent, type SiteContent } from "@/constants/site-content";

const SiteContentContext = createContext<SiteContent>(fallbackSiteContent);

export function SiteContentProvider({
  children,
  content,
}: {
  children: React.ReactNode;
  content: SiteContent;
}) {
  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
