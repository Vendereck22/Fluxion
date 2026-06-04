import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import { SiteContentProvider } from "@/components/client/SiteContentProvider";
import { getPublicSiteContent } from "@/lib/server/public-content";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await getPublicSiteContent();

  return (
    <SiteContentProvider content={siteContent}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SiteContentProvider>
  );
}
