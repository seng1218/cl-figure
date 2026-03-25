import Navbar from "@/components/Navbar"; // Check this path!
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {/* THE NAVBAR MUST BE HERE */}
          <Navbar /> 
          
          <main className="pt-24">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}