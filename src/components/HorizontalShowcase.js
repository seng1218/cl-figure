"use client";
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function HorizontalShowcase({ products, title = 'The Vault', subtitle = 'Full Collection' }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!products?.length || products.length < 2) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx;

    (async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const panels = gsap.utils.toArray('.showcase-panel', trackRef.current);
          if (panels.length < 2) return;

          gsap.to(trackRef.current, {
            xPercent: -100 * (panels.length - 1),
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              pin: true,
              scrub: 1,
              snap: {
                snapTo: 1 / (panels.length - 1),
                duration: { min: 0.2, max: 0.4 },
                ease: 'power1.inOut',
              },
              end: () => '+=' + containerRef.current.offsetWidth * (panels.length - 1),
              invalidateOnRefresh: true,
            },
          });

          ScrollTrigger.refresh();
        }, containerRef);
      } catch (err) {
        console.error('GSAP HorizontalShowcase init failed:', err);
      }
    })();

    return () => ctx?.revert();
  }, [products]);

  if (!products?.length) return null;

  return (
    <section className="border-b border-gray-900">
      {/* Section header — outside pinned area, scrolls away normally */}
      <div className="px-6 md:px-12 py-6 flex justify-between items-center border-b border-gray-900">
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-600 block">{title}</span>
          <p className="text-white font-black italic tracking-tighter text-xl">{subtitle}</p>
        </div>
        <span className="hidden md:block text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">
          Scroll to explore &rarr;
        </span>
      </div>

      {/* Mobile: CSS snap scroll */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-4 px-6 py-12 no-scrollbar">
        {products.map((product) =>
          product.comingSoon ? (
            <div
              key={product.id}
              className="snap-center shrink-0 w-[72vw] relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-blue-900/30"
            >
              <img
                src={product.image}
                alt="Classified"
                className="w-full h-full object-cover blur-xl brightness-50 scale-110 saturate-50"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={24} className="text-blue-500/30" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">Incoming</p>
                </div>
                <p className="text-white font-black text-sm italic truncate">{product.name}</p>
                <p className="text-gray-600 text-xs font-bold mt-1 tracking-widest">— —</p>
              </div>
            </div>
          ) : (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="snap-center shrink-0 w-[72vw] relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-gray-800"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover brightness-75 contrast-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1">{product.series || ''}</p>
                <p className="text-white font-black text-sm italic truncate">{product.name}</p>
                <p className="text-gray-400 text-xs font-bold mt-1">RM {product.price.toFixed(2)}</p>
              </div>
            </Link>
          )
        )}
      </div>

      {/* Desktop: GSAP pinned horizontal scroll */}
      <div ref={containerRef} className="hidden md:block overflow-hidden">
        <div ref={trackRef} className="flex will-change-transform">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="showcase-panel min-w-[100vw] h-screen flex items-center justify-center px-16 xl:px-24 relative"
            >
              {/* Panel counter */}
              <span className="absolute top-8 right-12 text-[9px] font-mono font-black uppercase tracking-[0.4em] text-gray-700">
                {String(i + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(products.length).padStart(2, '0')}
              </span>

              <div className="grid grid-cols-2 gap-12 xl:gap-20 items-center max-w-6xl w-full">
                {/* Text side */}
                <div className="space-y-8">
                  <div>
                    <span className="text-blue-600 font-black text-[9px] uppercase tracking-[0.5em] block mb-3">
                      {product.series || 'Vault Collection'}
                    </span>
                    <h3 className="text-4xl xl:text-6xl font-black text-white italic tracking-tighter leading-none">
                      {product.name}
                    </h3>
                  </div>

                  {product.comingSoon ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.9)]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Coming Soon</span>
                      </div>
                      <div className="flex items-center gap-6 pt-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="bg-blue-600 text-white px-8 py-4 font-black text-[9px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 group"
                        >
                          Get Notified <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <span className="text-gray-700 font-black italic text-xl tracking-widest">— —</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-blue-500 shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Origin Verified</span>
                      </div>
                      <div className="flex items-center gap-6 pt-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="bg-white text-black px-8 py-4 font-black text-[9px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                        >
                          View <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <span className="text-white font-black italic text-xl">RM {product.price.toFixed(2)}</span>
                      </div>
                      {product.stock <= 0 && (
                        <span className="inline-block text-[8px] font-black uppercase tracking-[0.3em] text-red-500 border border-red-900 px-3 py-1 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Image side */}
                <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border ${product.comingSoon ? 'border-blue-900/30' : 'border-gray-800'} group`}>
                  <img
                    src={product.image}
                    alt={product.comingSoon ? 'Classified' : product.name}
                    className={`w-full h-full object-cover transition-all duration-[1.5s] ease-out ${
                      product.comingSoon
                        ? 'blur-2xl brightness-[0.3] scale-110 saturate-50'
                        : 'brightness-90 contrast-110 group-hover:scale-105 group-hover:brightness-100'
                    }`}
                  />
                  {product.comingSoon && (
                    <>
                      <div className="absolute inset-0 bg-black/40" />
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock size={40} className="text-blue-500/20" />
                      </div>
                      <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-900/40">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">Incoming</span>
                      </div>
                    </>
                  )}
                  {!product.comingSoon && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(251,146,60,0.08) 0%, transparent 75%)' }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
