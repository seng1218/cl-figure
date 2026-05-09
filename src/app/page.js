"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BRANDS = ["FuRyu", "Banpresto", "Taito", "Bear Panda", "Alter", "Animester"];

const DROPS = [
  { date: "May 2026", title: "FREEing 1/4 Bunny Girl Series — New Arrivals", tag: "Scale" },
  { date: "Apr 2026", title: "BiCute Bunnies Drop 001 — Rem & Ram", tag: "Prize" },
  { date: "Mar 2026", title: "Banpresto Prize Restock — Aqua & Darkness", tag: "Prize" },
];

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
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={href || "#"}>
        <div
          className="relative w-full overflow-hidden mb-4"
          style={{ aspectRatio: "2/3", background: "#141414" }}
        >
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : null}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 50%)" }}
          />
          {tag && (
            <div className="absolute top-3 left-3 px-2 py-1 border border-white/10 text-[9px] tracking-[0.3em] uppercase text-white/50">
              {tag}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <span className="border border-white/30 px-5 py-2.5 text-[10px] tracking-[0.35em] uppercase text-white bg-black/60 backdrop-blur-sm">
              View Details
            </span>
          </div>
        </div>
        <div className="flex items-start justify-between">
          <div>
            {brand && (
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1">{brand}</p>
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
    <div style={{ background: "#0d0d0d" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      {/* -mt-20 cancels layout.js pt-20 so hero fills full 100svh */}
      <section
        className="-mt-20 flex flex-col justify-end px-6 md:px-12 pb-12 md:pb-16"
        style={{ height: "100svh" }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[10px] tracking-[0.45em] uppercase text-white/30 mb-6"
        >
          Est. 2023 · Kuala Lumpur
        </motion.p>

        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-[0.88] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
          >
            Collect
            <br />
            <span className="text-white/20">What</span>
            <br />
            Matters.
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}
        >
          <p className="text-[11px] tracking-[0.2em] text-white/40 max-w-sm leading-relaxed">
            Authenticated anime figures from Japan's top brands.
            Ships across Southeast Asia from Kuala Lumpur.
          </p>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-white/60 hover:text-white transition-colors duration-200"
          >
            View Collection
            <ArrowUpRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

      {/* ── THE COLLECTION ───────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <FadeUp className="flex items-baseline justify-between mb-12">
          <div className="flex items-baseline gap-6">
            <span className="text-[10px] tracking-[0.4em] uppercase text-white/30">The Collection</span>
            <span className="text-[10px] text-white/20">{String(visible.length).padStart(2, "0")}</span>
          </div>
          <Link
            href="/shop"
            className="text-[9px] tracking-[0.35em] uppercase text-white/30 hover:text-white transition-colors duration-200"
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
              <div key={i} className="w-full" style={{ aspectRatio: "2/3", background: "#141414" }} />
            ))
          )}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

      {/* ── AUTHENTICATED BRANDS ─────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <FadeUp className="mb-12">
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/30">Authenticated Brands</span>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {BRANDS.map((brand, i) => (
            <FadeUp
              key={brand}
              delay={i * 0.07}
              className="flex items-center justify-between py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-baseline gap-5">
                <span className="text-[9px] text-white/20 w-4">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-base font-medium tracking-tight text-white/80">{brand}</span>
              </div>
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/20">Verified</span>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

      {/* ── STATEMENT ────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 md:py-36">
        <FadeUp>
          <h2
            className="font-black leading-[0.9] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
          >
            No bootlegs.
            <br />
            <span className="text-white/20">No compromises.</span>
            <br />
            Only the real thing.
          </h2>
        </FadeUp>
        <FadeUp delay={0.2} className="mt-10 flex flex-col md:flex-row md:items-center gap-6">
          <p className="text-[11px] tracking-[0.15em] text-white/40 max-w-sm leading-relaxed">
            Every figure in the Vault is sourced directly from Japan's top
            manufacturers. We authenticate every piece before it ships.
          </p>
          <Link
            href="/about"
            className="group flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-white/50 hover:text-white transition-colors duration-200"
          >
            Our Story
            <ArrowUpRight
              size={12}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </FadeUp>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

      {/* ── LATEST DROPS ─────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <FadeUp className="flex items-baseline justify-between mb-10">
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/30">Latest Drops</span>
          <Link
            href="/drops"
            className="text-[9px] tracking-[0.35em] uppercase text-white/30 hover:text-white transition-colors duration-200"
          >
            All →
          </Link>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {DROPS.map((drop, i) => (
            <FadeUp
              key={i}
              delay={i * 0.1}
              className="py-7 pr-8 cursor-pointer group"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[9px] tracking-[0.3em] uppercase text-white/25 mb-3">
                {drop.date} · {drop.tag}
              </p>
              <h3 className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200 leading-snug mb-3">
                {drop.title}
              </h3>
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/25 group-hover:text-white/50 transition-colors duration-200">
                View →
              </span>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

    </div>
  );
}
