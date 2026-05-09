"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import SearchBar from "@/components/SearchBar";
import FigureCard from "@/components/FigureCard";
import Toast from "@/components/Toast";
import LiveActivityToast from "@/components/LiveActivityToast";
import NotifyDropModal from "@/components/NotifyDropModal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function ShopClient() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [selectedSeries, setSelectedSeries] = useState("All");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [notifyProduct, setNotifyProduct] = useState(null);

  const headingRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    fetch("/api/products/", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setSearchTerm(urlQuery);
  }, [urlQuery]);

  // Heading entrance
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  // Spotlight follow
  useEffect(() => {
    let rafId;
    const handle = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
        }
      });
    };
    window.addEventListener("mousemove", handle);
    return () => { window.removeEventListener("mousemove", handle); cancelAnimationFrame(rafId); };
  }, []);

  const handleAddToVault = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} Secured`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const seriesList = [...new Set(products.map((p) => p.series).filter(Boolean))].sort();

  const filteredProducts = products.filter((item) => {
    const term = searchTerm.toLowerCase();
    const searchFields = [item.name, item.manufacturer, item.series].filter(Boolean);
    const matchesSearch = searchFields.some((f) => f.toLowerCase().includes(term));
    const matchesSeries = selectedSeries === "All" || item.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const score = (p) => (p.comingSoon ? 2 : p.stock <= 0 ? 1 : 0);
    return score(a) - score(b);
  });

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-x-hidden">
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[800px] h-[800px] pointer-events-none z-0 rounded-full mix-blend-screen opacity-20 transition-transform duration-75 ease-out"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(0,0,0,0) 70%)" }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16">
        {/* Section header */}
        <div ref={headingRef} className="mb-20 opacity-0">
          <p
            className="text-[9px] tracking-[0.5em] uppercase font-black mb-3"
            style={{ color: "var(--v6-accent)" }}
          >
            Full Catalog · Curated Collectibles
          </p>
          <h1
            className="font-black italic tracking-tighter leading-none text-white"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            The Collection<span style={{ color: "var(--v6-accent)" }}>.</span>
          </h1>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedSeries={setSelectedSeries}
          series={seriesList}
        />

        {/* Figure grid — clip-path stagger */}
        <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-14 mt-12">
          {sortedProducts.map((item, i) => (
            <FigureCard
              key={item.id}
              item={item}
              index={i}
              animationDelay={(i % 4) * 0.12}
              onAdd={() => handleAddToVault(item)}
              onNotify={setNotifyProduct}
            />
          ))}
          {sortedProducts.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p
                className="font-black uppercase tracking-widest text-sm"
                style={{ color: "var(--v6-text-secondary)" }}
              >
                No figures match your search.
              </p>
            </div>
          )}
        </section>
      </div>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
      <LiveActivityToast products={products} />

      <AnimatePresence>
        {notifyProduct && (
          <NotifyDropModal product={notifyProduct} onClose={() => setNotifyProduct(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
