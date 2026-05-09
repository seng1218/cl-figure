"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence } from "framer-motion";
import FigureCard from "@/components/FigureCard";
import NotifyDropModal from "@/components/NotifyDropModal";
import { Bell } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function DropsPage() {
  const [comingSoon, setComingSoon] = useState([]);
  const [notifyProduct, setNotifyProduct] = useState(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const headingRef = useRef(null);
  const captureRef = useRef(null);

  useEffect(() => {
    fetch("/api/products/", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComingSoon(data.filter((p) => p.comingSoon));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.set(headingRef.current, { opacity: 0, y: 50 });
    const ctx = gsap.context(() => {
      gsap.to(headingRef.current, { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!captureRef.current) return;
    gsap.set(captureRef.current, { opacity: 0, y: 30 });
    const ctx = gsap.context(() => {
      gsap.to(captureRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: captureRef.current, start: "top 92%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  const handleNotifyAll = async (e) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/notify-drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId: "all-drops" }),
      });
      setSubmitted(true);
    } catch {
      // fail silently — user sees success state
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* Header */}
        <div ref={headingRef} className="mb-16">
          <p
            className="text-[10px] tracking-[0.5em] uppercase font-black mb-4 flex items-center gap-2"
            style={{ color: "var(--v6-accent)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.9)]" />
            Incoming Drops
          </p>
          <h1
            className="font-black italic tracking-tighter leading-none text-white mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            Classified<span style={{ color: "var(--v6-accent)" }}>.</span>
          </h1>
          <p className="text-sm font-medium leading-relaxed max-w-md" style={{ color: "var(--v6-text-secondary)" }}>
            These pieces aren&apos;t available yet. Get notified the moment they drop.
          </p>
        </div>

        {/* Drops grid */}
        {comingSoon.length > 0 ? (
          <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-14 mb-32">
            {comingSoon.map((item, i) => (
              <FigureCard
                key={item.id}
                item={item}
                index={i}
                animationDelay={(i % 4) * 0.12}
                onNotify={setNotifyProduct}
              />
            ))}
          </section>
        ) : (
          <div className="py-24 text-center mb-32">
            <p
              className="font-black uppercase tracking-widest text-sm"
              style={{ color: "var(--v6-text-muted)" }}
            >
              No classified drops at this time. Check back soon.
            </p>
          </div>
        )}

        {/* Email capture */}
        <div
          ref={captureRef}
          className="max-w-xl mx-auto text-center py-16 px-8"
          style={{ border: "1px solid var(--v6-border)", background: "var(--v6-surface)" }}
        >
          <Bell size={24} className="mx-auto mb-4 text-blue-500" />
          <h2
            className="font-black italic tracking-tighter leading-none mb-4 text-white"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Get First Access
          </h2>
          <p className="text-sm font-medium leading-relaxed mb-8" style={{ color: "var(--v6-text-secondary)" }}>
            Drop notifications before they go public. No spam — only when something actually drops.
          </p>

          {submitted ? (
            <p
              className="text-[10px] tracking-[0.4em] uppercase font-black py-4"
              style={{ color: "var(--v6-accent)" }}
            >
              ✓ You&apos;re on the list.
            </p>
          ) : (
            <form onSubmit={handleNotifyAll} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-[10px] tracking-[0.2em] text-white placeholder-gray-600 outline-none font-black"
                style={{ border: "1px solid var(--v6-border-active)" }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 text-[10px] tracking-[0.35em] uppercase font-black transition-all duration-300 shrink-0"
                style={{
                  border: "1px solid var(--v6-accent)",
                  color: "#050505",
                  background: "var(--v6-accent)",
                  opacity: submitting ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--v6-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--v6-accent)";
                  e.currentTarget.style.color = "#050505";
                }}
              >
                {submitting ? "Submitting..." : "Notify Me"}
              </button>
            </form>
          )}
        </div>
      </div>

      <AnimatePresence>
        {notifyProduct && (
          <NotifyDropModal product={notifyProduct} onClose={() => setNotifyProduct(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
