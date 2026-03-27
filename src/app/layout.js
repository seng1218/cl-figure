import Navbar from "@/components/Navbar";
import CommsPortal from "@/components/CommsPortal";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata = {
  title: "Vault 6 Studios. | The Vault",
  description: "Exclusive S-Tier figurines. Highly curated. Zero filler.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // handles iPhone notch & Android cutouts
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overscroll-none flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="pt-20 flex-grow">
            {children}
          </main>
          <Footer />
          <CommsPortal />
        </CartProvider>
      </body>
    </html>
  );
}