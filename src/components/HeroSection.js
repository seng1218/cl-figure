"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCMS } from "@/context/CMSContext";

const VaultAtmosphere = dynamic(() => import("./VaultAtmosphere"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({ onExplore }) {
  const { hero, site } = useCMS();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const headlineRef = useRef(null);
  const metaRef = useRef(null);
  const ctaRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // ── Entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(
        headlineRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }
      )
        .fromTo(
          metaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        );

      // ── Background parallax
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ── Marquee counter-scroll drift
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      // ── Text fade-out on scroll
      gsap.to([headlineRef.current, metaRef.current, ctaRef.current], {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "20% top",
          end: "60% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex items-end bg-[#050505]"
      style={{ height: "100svh", minHeight: "600px" }}
    >
      {/* Full-bleed background image */}
      <div ref={imageRef} className="absolute inset-0 z-0 will-change-transform">
        <Image
          src="/banner.png"
          alt="Vault Artifact"
          fill
          priority
          className="object-cover object-top brightness-50 contrast-110"
          sizes="100vw"
          data-cursor-target
        />
        {/* Atmospheric gradients */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.08) 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(5,5,5,0.75) 0%, transparent 60%)" }}
        />
      </div>

      {/* VaultAtmosphere overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <VaultAtmosphere />
      </div>

      {/* Large marquee text — drifts on scroll */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden whitespace-nowrap z-0 pointer-events-none opacity-[0.07] hidden md:block">
        <div
          ref={marqueeRef}
          className="flex gap-8 items-center will-change-transform"
          style={{ WebkitTextStroke: "2px rgba(255,255,255,0.7)", fontSize: "12vw", fontWeight: 900, fontStyle: "italic", lineHeight: 1, textTransform: "uppercase", color: "transparent" }}
        >
          <span>CURATED.</span>
          <span>EXCLUSIVE.</span>
          <span>S-TIER.</span>
          <span>ARCHIVED.</span>
          <span>CURATED.</span>
          <span>EXCLUSIVE.</span>
          <span>S-TIER.</span>
        </div>
      </div>

      {/* Hero content — bottom left */}
      <div className="relative z-10 px-6 md:px-16 pb-16 md:pb-24 max-w-4xl">
        {/* Drop label */}
        <p
          className="text-[10px] tracking-[0.5em] uppercase mb-5 font-black"
          style={{ color: "var(--v6-accent)", fontFamily: "var(--font-body)" }}
        >
          {hero?.tagline || "Established 2023"}
        </p>

        {/* Brand name headline */}
        <h1
          ref={headlineRef}
          className="font-black italic tracking-tighter leading-none mb-6 text-white opacity-0"
          style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
        >
          {site?.name || "Vault 6 Studios"}
          <span style={{ color: "var(--v6-accent)" }}>.</span>
        </h1>

        {/* Meta */}
        <p
          ref={metaRef}
          className="text-gray-400 text-sm font-medium max-w-sm leading-relaxed mb-8 opacity-0"
        >
          Authenticated Japanese collectible figures — curated for serious collectors.
        </p>

        {/* CTA row */}
        <div ref={ctaRef} className="flex flex-wrap items-center gap-6 opacity-0">
          <button
            onClick={onExplore}
            className="group flex items-center gap-3 px-8 py-4 text-[10px] tracking-[0.35em] uppercase font-black transition-all duration-300"
            style={{ border: "1px solid var(--v6-accent)", color: "var(--v6-accent)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--v6-accent)";
              e.currentTarget.style.color = "#050505";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--v6-accent)";
            }}
          >
            {hero?.ctaLabel || "Enter Vault"}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>

          <a
            href="/shop"
            className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
          >
            Browse the Archive
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-3">
        <span
          className="text-[8px] tracking-[0.5em] uppercase font-black"
          style={{ color: "var(--v6-text-muted)", writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <div className="w-px h-12 overflow-hidden" style={{ background: "var(--v6-text-muted)" }}>
          <div
            className="w-full h-full"
            style={{ background: "var(--v6-accent)", animation: "scrollLine 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
