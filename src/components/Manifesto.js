"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  "Every figure", "authenticated.", "Every collector",
  "respected.", "Every piece", "a statement.",
  "No bootlegs.", "No compromises.", "Ships from Malaysia.",
];

export default function Manifesto() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      if (bodyRef.current) {
        gsap.set(bodyRef.current, { opacity: 0, y: 25 });
        gsap.to(bodyRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bodyRef.current,
            start: "top 92%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 overflow-hidden border-b border-gray-900">
      {/* Horizontal drifting text */}
      <div
        ref={trackRef}
        className="flex items-baseline gap-10 md:gap-16 mb-16 md:mb-24 will-change-transform"
        style={{ paddingLeft: "4rem" }}
      >
        {WORDS.map((word, i) => (
          <span
            key={i}
            className="shrink-0 whitespace-nowrap leading-none font-black tracking-tighter italic uppercase"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 5rem)",
              color: i % 2 === 0 ? "var(--v6-text-primary)" : "var(--v6-text-muted)",
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Body copy */}
      <div ref={bodyRef} className="px-6 md:px-16 max-w-lg">
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--v6-text-secondary)", fontWeight: 400 }}
        >
          Vault 6 Studios sources exclusively from Japan&apos;s authenticated
          prize and scale manufacturers. Based in Malaysia, we ship
          across Southeast Asia. We exist at the intersection of collector
          culture and honest commerce.
        </p>

        <a
          href="/about"
          className="inline-block mt-6 text-[9px] tracking-[0.4em] uppercase pb-0.5 transition-all duration-300 font-black"
          style={{ color: "var(--v6-text-secondary)", borderBottom: "1px solid var(--v6-text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--v6-accent)";
            e.currentTarget.style.borderBottomColor = "var(--v6-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--v6-text-secondary)";
            e.currentTarget.style.borderBottomColor = "var(--v6-text-muted)";
          }}
        >
          Our Story →
        </a>
      </div>
    </section>
  );
}
