import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />  
    </>
  );
}