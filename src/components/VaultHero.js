"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

// Actual product images from your inventory
const HERO_CARDS = [
  { img: "/uploads/1774604461442-kurumi.png",          x: -44, y: -18, rZ: -8,  rX: 12,  rY: -16, w: 150, drift: 0, delay: 0   },
  { img: "/uploads/1774592946275-rem.png",              x:  44, y: -22, rZ:  6,  rX: -8,  rY:  14, w: 130, drift: 1, delay: 0.8 },
  { img: "/uploads/1774595963136-haruhi_suzumiya.png",  x: -46, y:  24, rZ:  10, rX:  6,  rY:  20, w: 140, drift: 2, delay: 1.2 },
  { img: "/uploads/1774604407729-megumi.png",           x:  46, y:  20, rZ: -6,  rX: -10, rY: -22, w: 160, drift: 0, delay: 0.4 },
];

/* ── Wireframe cubes ── */
function FloatingCubes() {
  const seeds = Array.from({ length: 7 }, (_, i) => ({
    x: 8  + (i * 13.7) % 90,
    y: 12 + (i * 21.3) % 75,
    s: 60 + (i * 17)   % 80,
    d: i * 0.9,
    r: (i * 47) % 360,
  }));

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ perspective: 1200 }}>
      {seeds.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top:  `${s.y}%`,
            width:  s.s,
            height: s.s,
            animation: `v6-float-${i % 3} ${10 + (i % 5)}s ease-in-out ${s.d}s infinite`,
          }}
        >
          <svg
            viewBox="-50 -50 100 100"
            width="100%"
            height="100%"
            style={{ filter: "drop-shadow(0 0 18px rgba(37,99,235,0.3))" }}
          >
            <g transform={`rotate(${s.r})`}>
              <polygon
                points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
                fill="rgba(37,99,235,0.04)"
                stroke="rgba(37,99,235,0.55)"
                strokeWidth="0.8"
              />
              <line x1="0" y1="-30" x2="0"   y2="0"  stroke="rgba(37,99,235,0.4)" strokeWidth="0.6" />
              <line x1="0" y1="0"   x2="26"  y2="15" stroke="rgba(37,99,235,0.4)" strokeWidth="0.6" />
              <line x1="0" y1="0"   x2="-26" y2="15" stroke="rgba(37,99,235,0.4)" strokeWidth="0.6" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ── Main hero ── */
export default function VaultHero() {
  const [ready, setReady] = useState(false);
  const { scrollY } = useScroll();

  // Parallax: content fades + cards drift down on scroll
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const contentScale   = useTransform(scrollY, [0, 500], [1, 0.94]);
  const cardsY         = useTransform(scrollY, [0, 600], [0, 200]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="-mt-20 relative overflow-hidden flex items-center justify-center"
      style={{
        height: "100svh",
        background: "radial-gradient(ellipse at center, #0a0a14 0%, #050505 60%, #020202 100%)",
      }}
    >
      {/* ── Isometric grid ── */}
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0"
        style={{ opacity: 0.45 }}
      >
        <defs>
          <pattern id="hero-iso" x="0" y="0" width="160" height="278" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 160 139 L 80 278 L 0 139 Z" fill="none" stroke="rgba(37,99,235,0.28)" strokeWidth="0.7" />
          </pattern>
          <radialGradient id="hero-fade" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
        </defs>
        <rect width="1600" height="1000" fill="url(#hero-iso)" />
        <rect width="1600" height="1000" fill="url(#hero-fade)" />
      </svg>

      {/* ── Central amber + blue glow ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          bottom: "18%",
          width: 700,
          height: 240,
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at center, rgba(251,191,36,0.45) 0%, rgba(37,99,235,0.2) 35%, transparent 70%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Floating wireframe cubes ── */}
      <FloatingCubes />

      {/* ── Floating figure cards ── */}
      <motion.div
        aria-hidden="true"
        style={{ y: cardsY, perspective: "1400px" }}
        className="absolute inset-0 pointer-events-none"
      >
        {HERO_CARDS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: c.w,
              aspectRatio: "3/4",
              transform: `translate(-50%,-50%) translate(${c.x}vw, ${c.y}vh) rotateX(${c.rX}deg) rotateY(${c.rY}deg) rotateZ(${c.rZ}deg)`,
              transformStyle: "preserve-3d",
              animation: `v6-drift-${c.drift} ${14 + i * 2}s ease-in-out ${c.delay}s infinite`,
              opacity: 0.65,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                background: "#0a0a0a",
                border: "1px solid rgba(37,99,235,0.35)",
                boxShadow: "0 0 40px rgba(37,99,235,0.25), inset 0 0 30px rgba(0,0,0,0.6)",
                overflow: "hidden",
              }}
            >
              <Image
                src={c.img}
                alt=""
                fill
                sizes="200px"
                className="object-cover object-top"
                style={{ filter: "grayscale(0.85) brightness(0.55) contrast(1.3)" }}
              />
              {/* Scanline overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "repeating-linear-gradient(0deg, rgba(37,99,235,0.06), rgba(37,99,235,0.06) 1px, transparent 1px, transparent 3px)",
                }}
              />
              {/* Corner ticks */}
              {[[0,0],[100,0],[0,100],[100,100]].map(([x, y], k) => (
                <span
                  key={k}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    width: 12,
                    height: 12,
                    borderLeft:   x === 0   ? "1px solid #2563eb" : "none",
                    borderRight:  x === 100 ? "1px solid #2563eb" : "none",
                    borderTop:    y === 0   ? "1px solid #2563eb" : "none",
                    borderBottom: y === 100 ? "1px solid #2563eb" : "none",
                    transform: `translate(${x === 100 ? "-100%" : "0"}, ${y === 100 ? "-100%" : "0"})`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Hero copy (fades + scales on scroll) ── */}
      <motion.div
        style={{ opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 text-center px-8"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-[10px] tracking-[0.45em] uppercase mb-6 font-black"
          style={{ color: "#60a5fa" }}
        >
          Established 2023
        </motion.p>

        {/* Headline — kept exactly as original */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: ready ? "0%" : "100%" }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-black italic leading-[0.88] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
          >
            Collect
            <br />
            <span style={{ color: "rgba(255,255,255,0.2)" }}>What</span>
            <br />
            Matters<span style={{ color: "#2563eb" }}>.</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm leading-relaxed max-w-sm mx-auto mb-8"
          style={{ color: "#9ca3af" }}
        >
          Authenticated Japanese collectible figures — curated for serious collectors.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-8"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-2 px-8 py-4 text-[10px] tracking-[0.35em] uppercase font-black border transition-all duration-300"
            style={{ borderColor: "#2563eb", color: "#2563eb" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2563eb"; }}
          >
            Enter Vault
            <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/shop"
            className="text-[9px] tracking-[0.3em] uppercase font-black pb-0.5 transition-colors duration-200"
            style={{ color: "#6b7280", borderBottom: "1px solid #262626" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderBottomColor = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderBottomColor = "#262626"; }}
          >
            Browse the Archive
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 0.5 : 0 }}
        transition={{ duration: 1.2, delay: 1.8 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, #fff)" }} />
        <span className="text-[8px] tracking-[0.4em] uppercase font-black" style={{ color: "#6b7280" }}>
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
