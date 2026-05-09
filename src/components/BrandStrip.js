"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRANDS = [
  { name: "FuRyu",      note: "BiCute Bunnies" },
  { name: "Banpresto",  note: "Prize Figures" },
  { name: "FREEing",    note: "Scale Figures" },
  { name: "Taito",      note: "Coreful Series" },
  { name: "Kotobukiya", note: "Scale & Bishoujo" },
  { name: "Alter",      note: "High-End Scale" },
];

export default function BrandStrip() {
  const wrapRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: 15 });

    const ctx = gsap.context(() => {
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 92%",
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="px-6 md:px-16 py-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-14"
      style={{ borderTop: "1px solid var(--v6-border)", borderBottom: "1px solid var(--v6-border)" }}
    >
      <p
        className="text-[8px] tracking-[0.5em] uppercase shrink-0"
        style={{ color: "var(--v6-text-muted)", fontFamily: "var(--font-body)" }}
      >
        Authenticated Brands
      </p>

      <div className="flex flex-wrap gap-x-10 gap-y-3">
        {BRANDS.map((brand, i) => (
          <div
            key={brand.name}
            ref={(el) => { if (el) itemRefs.current[i] = el; }}
            className="flex flex-col"
          >
            <span
              className="text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 cursor-default"
              style={{ color: "var(--v6-text-secondary)", fontFamily: "var(--font-body)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--v6-text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--v6-text-secondary)")}
            >
              {brand.name}
            </span>
            <span
              className="text-[8px] tracking-[0.2em]"
              style={{ color: "var(--v6-text-muted)", fontFamily: "var(--font-body)" }}
            >
              {brand.note}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
