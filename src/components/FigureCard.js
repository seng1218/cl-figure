"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bell, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import styles from "./FigureCard.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function FigureCard({
  item,
  index = 0,
  animationDelay = 0,
  onAdd,
  onNotify,
}) {
  const cardRef = useRef(null);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isAvailable = !item.comingSoon && item.stock > 0;
  const isSoldOut = !item.comingSoon && item.stock <= 0;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Set initial hidden state via GSAP (not CSS) so SSR renders visible
    gsap.set(el, {
      clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
      opacity: 0,
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      onEnter: () => {
        gsap.delayedCall(animationDelay, () => {
          gsap.to(el, {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
          });
        });
      },
      once: true,
    });

    return () => {
      st.kill();
      gsap.killTweensOf(el);
    };
  }, [animationDelay]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isAvailable || added) return;
    setAdded(true);
    onAdd?.();
    setTimeout(() => setAdded(false), 2500);
  };

  const brand = item.manufacturer || item.brand || "";
  const price = typeof item.price === "number" ? item.price.toFixed(2) : "—";

  if (item.comingSoon) {
    return (
      <article
        ref={cardRef}
        className={`${styles.card} flex flex-col`}
        onClick={() => onNotify?.(item)}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.imageWrap} data-cursor-target>
          {/* Blurred silhouette */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: imgLoaded ? 1 : 0 }}
          >
            <Image
              src={item.image}
              alt="Coming Soon"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover blur-xl brightness-40 scale-110 saturate-50"
              onLoad={() => setImgLoaded(true)}
            />
          </div>

          {/* Scanline */}
          <div
            className="absolute inset-0 z-[1] opacity-20 pointer-events-none"
            style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)" }}
          />
          <div className="absolute inset-0 bg-black/50 z-[2]" />

          {/* Light sweep */}
          <div className={`${styles.lightSweep} z-[3]`} />

          {/* INCOMING badge */}
          <div className="absolute top-3 left-3 z-[4] flex items-center gap-2 px-2.5 py-1"
            style={{ border: "1px solid var(--v6-border)", background: "rgba(5,5,5,0.8)", backdropFilter: "blur(8px)" }}>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.9)]" />
            <span className="text-[8px] tracking-[0.4em] uppercase font-black" style={{ color: "var(--v6-accent)" }}>Incoming</span>
          </div>

          {/* Lock icon */}
          <div className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none">
            <Lock size={26} className="text-blue-500/25" />
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-x-3 bottom-3 z-[5]">
            <div
              className={`${styles.vaultBtn} w-full py-3 text-[9px] tracking-[0.4em] uppercase text-center flex items-center justify-center gap-2 font-black`}
              style={{ border: "1px solid var(--v6-border-active)", background: "rgba(5,5,5,0.85)", backdropFilter: "blur(10px)", color: "var(--v6-accent)" }}
            >
              <Bell size={10} /> Get Notified
            </div>
          </div>
        </div>

        <div className="pt-4 pb-1 space-y-1.5">
          <p className="text-[8px] tracking-[0.4em] uppercase font-black"
            style={{ color: "var(--v6-text-muted)" }}>
            {brand} {item.scale ? `· ${item.scale}` : ""}
          </p>
          <h3 className={`${styles.nameLine} text-sm font-black uppercase italic tracking-tighter leading-snug`}
            style={{ color: "var(--v6-text-primary)" }}>
            {item.name}
          </h3>
          <p className="text-[10px] truncate font-medium" style={{ color: "var(--v6-text-secondary)" }}>
            {item.series || ""}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-gray-900">
            <span className="text-[8px] tracking-[0.3em] uppercase font-black text-blue-500 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Coming Soon
            </span>
            <span className="text-sm font-black italic text-gray-700 tracking-widest">— —</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article ref={cardRef} className={`${styles.card} flex flex-col`}>
      <div className={styles.imageWrap} data-cursor-target>
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        >
          <Image
            src={item.image}
            alt={`${item.name} — ${item.series || ""}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`${styles.image} object-cover object-top brightness-90 contrast-110`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-[1]"
          style={{ background: "linear-gradient(to top, var(--v6-void) 0%, transparent 100%)" }}
        />

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 z-[2] flex items-center justify-center bg-black/60">
            <span className="text-[10px] tracking-[0.4em] uppercase font-black text-gray-500">Sold Out</span>
          </div>
        )}

        {/* Add to Vault — hover reveal */}
        {isAvailable && (
          <div className="absolute inset-x-3 bottom-3 z-[2]">
            <button
              onClick={handleAdd}
              className={`${styles.vaultBtn} w-full py-3 text-[9px] tracking-[0.4em] uppercase font-black transition-colors duration-300 flex items-center justify-center gap-2`}
              style={{
                border: added ? "1px solid var(--v6-accent)" : "1px solid var(--v6-border-active)",
                color: added ? "var(--v6-accent)" : "var(--v6-text-primary)",
                background: added ? "var(--v6-accent-soft)" : "rgba(5,5,5,0.88)",
                backdropFilter: "blur(10px)",
              }}
            >
              {added ? "✓ Added to Vault" : (<><ArrowRight size={10} /> Add to Vault</>)}
            </button>
          </div>
        )}
      </div>

      <Link href={`/product/${item.id}`} className="pt-4 pb-1 space-y-1.5 block group/info">
        <p className="text-[8px] tracking-[0.4em] uppercase font-black"
          style={{ color: "var(--v6-text-muted)" }}>
          {brand} {item.scale ? `· ${item.scale}` : ""}
        </p>

        <h3
          className={`${styles.nameLine} text-sm font-black uppercase italic tracking-tighter leading-snug group-hover/info:text-blue-400 transition-colors`}
          style={{ color: "var(--v6-text-primary)" }}
        >
          {item.name}
        </h3>

        <p className="text-[10px] truncate font-medium" style={{ color: "var(--v6-text-secondary)" }}>
          {item.series || ""}
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-gray-900">
          <span className="flex items-center gap-1.5 text-[8px] tracking-[0.3em] uppercase font-black"
            style={{ color: isAvailable ? "var(--v6-accent)" : "var(--v6-text-muted)" }}>
            <ShieldCheck size={10} />
            {isAvailable ? "In Stock" : "Sold Out"}
          </span>
          <span className="text-sm font-black italic text-white tracking-widest">
            <span className="text-[10px] font-medium text-gray-500 mr-0.5">RM</span>
            {price}
          </span>
        </div>
      </Link>
    </article>
  );
}
