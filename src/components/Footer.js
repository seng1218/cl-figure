"use client";
import Link from "next/link";
import { useCMS } from "@/context/CMSContext";

const LINKS = [
  { label: "About Us",        href: "/about" },
  { label: "Contact",         href: "/contact" },
  { label: "Drops",           href: "/drops" },
  { label: "Privacy Policy",  href: "/privacy-policy" },
  { label: "Terms",           href: "/terms" },
  { label: "Payment Policy",  href: "/payment-policy" },
  { label: "Shipping",        href: "/shipping" },
  { label: "Return Policy",   href: "/return-policy" },
];

export default function Footer() {
  const { contact } = useCMS();
  const whatsapp = contact?.whatsapp;
  const email = contact?.email;
  const address = contact?.address;

  return (
    <footer
      className="w-full mt-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d" }}
    >
      {/* Left: wordmark + legal */}
      <div className="space-y-1.5">
        <p className="text-[9px] tracking-[0.4em] uppercase text-white/20">
          Kuala Lumpur, Malaysia · Ships SEA-Wide
        </p>
        {email && (
          <a
            href={`mailto:${email}`}
            className="block text-[9px] tracking-[0.25em] text-white/20 hover:text-white transition-colors duration-200"
          >
            {email}
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[9px] tracking-[0.25em] text-white/20 hover:text-white transition-colors duration-200"
          >
            WA {whatsapp}
          </a>
        )}
        {address && (
          <span className="block text-[9px] tracking-[0.2em] text-white/15">{address}</span>
        )}
        <p className="text-[9px] tracking-[0.2em] text-white/15">
          © {new Date().getFullYear()} Vault 6 Studios · All figures authenticated
        </p>
      </div>

      {/* Right: nav links */}
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[9px] tracking-[0.3em] uppercase text-white/25 hover:text-white transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
