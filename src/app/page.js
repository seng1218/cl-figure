"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TrackingModule from "@/components/TrackingModule";
import VaultHero from "@/components/VaultHero";

/* ─── DATA (unchanged) ───────────────────────────────────── */

const BRANDS = ["FuRyu", "Banpresto", "Taito", "Bear Panda", "Alter", "Animester"];

const ETHOS = [
  {
    title: "CURATION",
    desc: "Every piece is hand-selected. If it isn't S-tier, it doesn't enter the Vault.",
  },
  {
    title: "AUTHENTICITY",
    desc: "Direct sourcing and multi-stage verification. Every authenticity grade disclosed — no exceptions.",
  },
  {
    title: "INTEGRITY",
    desc: "Accurate condition reporting. What you see in the Archive is what reaches your hands.",
  },
];

const KITS_FEATURES = [
  {
    title: "Merchant Licensed",
    desc: "Officially licensed to print and sell. Every kit is an authorized physical reproduction — not a bootleg.",
  },
  {
    title: "Pre-Printed Parts",
    desc: "We handle the printing. Parts arrive clean, measured, and ready for your assembly session.",
  },
  {
    title: "Yours to Build",
    desc: "Assemble with CA glue, sand, prime, and paint. Full creative control over finish and display.",
  },
];

const MARQUEE_ITEMS = [
  { label: "SYNDICATE",           bright: true  },
  { label: "847 MEMBERS ACTIVE",  bright: false },
  { label: "NEXT DROP",           bright: true  },
  { label: "WEEKLY",              bright: false },
  { label: "ORIGIN",              bright: true  },
  { label: "EACH PIECE VERIFIED", bright: false },
  { label: "VAULT STATUS",        bright: true  },
  { label: "OPERATIONAL",         bright: false },
];

/* ─── HELPERS ─────────────────────────────────────────────── */

function Divider() {
  return <div style={{ height: "1px", background: "#111", margin: "0 24px" }} />;
}

function FadeUp({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function FigureCard({ name, brand, price, image, tag, delay, href }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={href || "#"}>
        <div
          className="relative w-full overflow-hidden mb-4 transition-all duration-500"
          style={{
            aspectRatio: "2/3",
            background: "#0a0a0a",
            border: `1px solid ${hover ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.06)"}`,
            boxShadow: hover ? "0 0 40px rgba(37,99,235,0.15)" : "none",
          }}
        >
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{
                filter: hover
                  ? "grayscale(0) brightness(0.9) contrast(1.05)"
                  : "grayscale(0.6) brightness(0.75) contrast(1.15)",
                transition: "filter 1200ms cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(5,5,5,0.75) 0%, transparent 50%)",
            }}
          />
          {/* Hover shine */}
          {hover && (
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
          )}
          {tag && (
            <div className="absolute top-3 left-3 px-2 py-1 border border-white/10 text-[9px] tracking-[0.3em] uppercase text-white/50">
              {tag}
            </div>
          )}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(37,99,235,0.08)" }}
          >
            <span
              className="text-[10px] tracking-[0.35em] uppercase text-white font-black px-5 py-2.5 backdrop-blur-sm"
              style={{ border: "1px solid rgba(37,99,235,0.5)", background: "rgba(5,5,5,0.7)" }}
            >
              View Details
            </span>
          </div>
        </div>
        <div className="flex items-start justify-between">
          <div>
            {brand && (
              <p className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: "#2563eb" }}>
                {brand}
              </p>
            )}
            <h3 className="text-sm font-medium text-white/90 leading-snug">{name}</h3>
          </div>
          <p className="text-sm font-medium text-white/70 shrink-0 pt-5">
            RM {typeof price === "number" ? price.toFixed(2) : price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── PAGE ────────────────────────────────────────────────── */

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products/", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {});
  }, []);

  const visible = products.filter((p) => !p.comingSoon).slice(0, 3);

  return (
    <div style={{ background: "#050505" }}>

      {/* ── HERO — full V6 animated treatment ── */}
      <VaultHero />

      {/* ── INTEL FEED MARQUEE ── */}
      <section
        className="py-4 overflow-hidden whitespace-nowrap relative"
        style={{
          borderTop:    "1px solid rgba(37,99,235,0.15)",
          borderBottom: "1px solid rgba(37,99,235,0.15)",
          background:   "rgba(37,99,235,0.04)",
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #050505, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #050505, transparent)" }} />
        <div className="flex items-center animate-marquee">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex items-center min-w-max">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="flex items-center">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.4em] px-6"
                    style={{ color: item.bright ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}
                  >
                    {item.label}
                  </span>
                  <span style={{ color: "#2563eb", opacity: 0.7 }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── THE COLLECTION ── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <FadeUp className="flex items-baseline justify-between mb-12">
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] tracking-[0.4em] uppercase font-black" style={{ color: "#60a5fa" }}>
              The Collection
            </span>
            <span className="text-[10px]" style={{ color: "#2563eb" }}>
              {String(visible.length).padStart(2, "0")}
            </span>
          </div>
          <Link
            href="/shop"
            className="text-[9px] tracking-[0.35em] uppercase font-black transition-colors duration-200"
            style={{ color: "#6b7280" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; }}
          >
            All →
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {visible.length > 0 ? (
            visible.map((p, i) => (
              <FigureCard
                key={p.id}
                name={p.name}
                brand={p.brand}
                price={p.price}
                image={p.image}
                tag={p.comingSoon ? "Coming Soon" : "In Stock"}
                href={`/product/${p.id}`}
                delay={i * 0.12}
              />
            ))
          ) : (
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full"
                style={{ aspectRatio: "2/3", background: "#0a0a0a", border: "1px solid #111" }}
              />
            ))
          )}
        </div>
      </section>

      <Divider />

      {/* ── VAULT STANDARDS / ETHOS ── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <FadeUp className="mb-2">
          <span className="text-[10px] tracking-[0.4em] uppercase font-black" style={{ color: "#60a5fa" }}>
            Vault Standards
          </span>
        </FadeUp>
        <FadeUp delay={0.05} className="mb-12">
          <h2
            className="font-black italic leading-[0.9] tracking-[-0.03em] text-white mt-3"
            style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}
          >
            OUR ETHOS<span style={{ color: "#2563eb" }}>.</span>
          </h2>
          <p className="text-[10px] tracking-[0.4em] uppercase mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
            UNCOMPROMISING STANDARDS.
          </p>
        </FadeUp>

        <div>
          {ETHOS.map((v, i) => (
            <FadeUp
              key={v.title}
              delay={i * 0.08}
              className="flex gap-6 items-start py-8"
              style={{ borderBottom: "1px solid #111" }}
            >
              <span className="text-[9px] shrink-0 w-5 pt-0.5 font-black" style={{ color: "#2563eb", opacity: 0.5 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-white/80 mb-2">
                  {v.title}
                </h3>
                <p className="text-[11px] tracking-[0.1em] text-white/40 max-w-lg leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── AUTHENTICATED BRANDS ── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <FadeUp className="mb-12">
          <span className="text-[10px] tracking-[0.4em] uppercase font-black" style={{ color: "#60a5fa" }}>
            Authenticated Brands
          </span>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {BRANDS.map((brand, i) => (
            <FadeUp
              key={brand}
              delay={i * 0.07}
              className="flex items-center justify-between py-5"
              style={{ borderBottom: "1px solid #111" }}
            >
              <div className="flex items-baseline gap-5">
                <span className="text-[9px] w-4 font-black" style={{ color: "#2563eb", opacity: 0.4 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-medium tracking-tight text-white/80">
                  {brand}
                </span>
              </div>
              <span className="text-[9px] tracking-[0.3em] uppercase font-black" style={{ color: "#2563eb", opacity: 0.5 }}>
                Verified
              </span>
            </FadeUp>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── ARTIFACT TRACKING ── */}
      <section id="tracking" className="px-6 md:px-12 py-20 md:py-28">
        <FadeUp className="mb-10">
          <span className="text-[10px] tracking-[0.4em] uppercase font-black" style={{ color: "#60a5fa" }}>
            Artifact Tracking
          </span>
        </FadeUp>
        <TrackingModule />
      </section>

      <Divider />

      {/* ── 3D PRINT KITS ── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <FadeUp className="flex items-baseline justify-between mb-12">
          <div className="flex items-baseline gap-4">
            <span className="text-[10px] tracking-[0.4em] uppercase font-black" style={{ color: "#60a5fa" }}>
              3D Print Kits
            </span>
            <span
              className="text-[9px] tracking-[0.3em] uppercase px-2 py-0.5 font-black"
              style={{ border: "1px solid rgba(37,99,235,0.3)", color: "#2563eb" }}
            >
              Coming Soon
            </span>
          </div>
          <Link
            href="/model-kits"
            className="text-[9px] tracking-[0.35em] uppercase font-black transition-colors duration-200"
            style={{ color: "#6b7280" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; }}
          >
            Explore →
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {KITS_FEATURES.map((f, i) => (
            <FadeUp
              key={f.title}
              delay={i * 0.1}
              className="py-8 pr-8 group"
              style={{ borderBottom: "1px solid #111" }}
            >
              <p className="text-[9px] tracking-[0.3em] uppercase mb-3 font-black" style={{ color: "#2563eb", opacity: 0.5 }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200 leading-snug mb-3">
                {f.title}
              </h3>
              <p className="text-[11px] text-white/35 leading-relaxed">{f.desc}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── JOIN THE SYNDICATE ── */}
      <section className="px-6 md:px-12 py-24 md:py-36">
        <FadeUp className="mb-3">
          <span
            className="text-[9px] tracking-[0.4em] uppercase px-2 py-1 font-black"
            style={{ border: "1px solid rgba(37,99,235,0.3)", color: "#2563eb" }}
          >
            Secured
          </span>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h2
            className="font-black italic leading-[0.9] tracking-[-0.03em] text-white mt-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
          >
            JOIN THE SYNDICATE<span style={{ color: "#2563eb" }}>.</span>
          </h2>
        </FadeUp>
        <FadeUp
          delay={0.15}
          className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8"
          style={{ borderTop: "1px solid #111", paddingTop: "1.5rem" }}
        >
          <p className="text-[11px] tracking-[0.2em] text-white/40 max-w-sm leading-relaxed">
            The highest-tier drops go fast. Submit your email to get early access to
            new drops before they go public.
          </p>
          <Link
            href="/join"
            className="group flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase font-black transition-colors duration-200"
            style={{ color: "#2563eb" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#2563eb"; }}
          >
            Request Access
            <ArrowUpRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </FadeUp>
      </section>

      <Divider />

    </div>
  );
}
