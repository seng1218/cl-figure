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
      className="w-full mt-auto"
      style={{ borderTop: "1px solid var(--v6-border)", background: "var(--v6-deep)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: wordmark + legal */}
        <div className="space-y-2">
          <p
            className="text-[9px] tracking-[0.4em] uppercase font-black"
            style={{ color: "var(--v6-text-muted)" }}
          >
            Vault 6 Studios · Kuala Lumpur, Malaysia
          </p>
          {email && (
            <a
              href={`mailto:${email}`}
              className="block text-[9px] tracking-[0.25em] transition-colors duration-300"
              style={{ color: "var(--v6-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--v6-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--v6-text-muted)")}
            >
              {email}
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[9px] tracking-[0.25em] transition-colors duration-300"
              style={{ color: "var(--v6-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--v6-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--v6-text-muted)")}
            >
              WA {whatsapp}
            </a>
          )}
          {address && (
            <span className="block text-[9px] tracking-[0.2em]" style={{ color: "var(--v6-text-muted)" }}>
              {address}
            </span>
          )}
          <p className="text-[9px] tracking-[0.25em]" style={{ color: "var(--v6-text-muted)" }}>
            © {new Date().getFullYear()} · All figures authenticated · No bootlegs
          </p>
        </div>

        {/* Right: nav links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[9px] tracking-[0.3em] uppercase font-black transition-colors duration-300"
              style={{ color: "var(--v6-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--v6-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--v6-text-muted)")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
