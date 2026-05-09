import Navbar from "@/components/Navbar";
import CommsPortal from "@/components/CommsPortal";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import GSAPCleanup from "@/components/GSAPCleanup";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import { CMSProvider } from "@/context/CMSContext";
import AdminShortcut from "@/components/AdminShortcut";
import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://www.vault6studios.com'),
  title: {
    default: "Vault 6 Studios. | The Vault",
    template: "%s | Vault 6 Studios",
  },
  description: "Exclusive S-Tier figurines. Highly curated. Zero filler.",
  openGraph: {
    siteName: "Vault 6 Studios",
    title: "Vault 6 Studios. | The Vault",
    description: "Exclusive S-Tier figurines. Highly curated. Zero filler.",
    type: "website",
    locale: "en_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vault 6 Studios. | The Vault",
    description: "Exclusive S-Tier figurines. Highly curated. Zero filler.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overscroll-none flex flex-col min-h-screen">
        <CustomCursor />
        <SmoothScroll />
        <CMSProvider>
          <CartProvider>
            <ScrollProgress />
            <GSAPCleanup />
            <AdminShortcut />
            <AnnouncementBanner />
            <Navbar />
            <main className="pt-20 flex-grow">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <CommsPortal />
          </CartProvider>
        </CMSProvider>
      </body>
    </html>
  );
}