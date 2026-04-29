"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCMS } from '@/context/CMSContext';
import HeroSection from '@/components/HeroSection';
import ProductCards from '@/components/ProductCards';
import VaultEntrance from '@/components/VaultEntrance';
import Toast from '@/components/Toast';
import TrackingModule from '@/components/TrackingModule';
import LiveActivityToast from '@/components/LiveActivityToast';
import { Lock, ArrowRight, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { brands, ethos, home: cmsHome } = useCMS();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    fetch('/api/products/', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); else setProductsError(true); })
      .catch(() => setProductsError(true));
  }, []);

  const spotlightRef = useRef(null);

  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleAddToVault = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} Secured`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };


  const grailProduct = products[0];
  const recentDrops = products.slice(1, 4);

  if (productsError) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 text-center px-6">
        <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Vault Temporarily Offline</p>
        <button
          onClick={() => { setProductsError(false); fetch('/api/products/', { cache: 'no-store' }).then(r => r.json()).then(data => { if (Array.isArray(data)) setProducts(data); }).catch(() => setProductsError(true)); }}
          className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-32 relative overflow-x-hidden">

      {/* Provocative Dynamic Spotlight attached to mouse */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[800px] h-[800px] pointer-events-none z-0 rounded-full mix-blend-screen opacity-30 transition-transform duration-75 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(0,0,0,0) 70%)' }}
      />

      <div className="relative z-10 w-full h-full">
        {/* 1. Access Protocol (Entrance Overlay) */}
        <VaultEntrance isOpen={isVaultOpen} onComplete={() => router.push('/shop')} />

        {/* 2. Hero Section */}
        <HeroSection onExplore={() => setIsVaultOpen(true)} />

        {/* 2.5 Intel Feed Marquee */}
        <section className="py-5 border-b border-gray-900 bg-[#020202] overflow-hidden whitespace-nowrap relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#020202] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#020202] to-transparent z-10 pointer-events-none" />
          <div className="flex items-center animate-marquee">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 min-w-max px-12">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">SYNDICATE</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">847 OPERATIVES ACTIVE</span>
                <span className="text-blue-900">·</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">NEXT DROP</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">CLASSIFIED</span>
                <span className="text-blue-900">·</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">ORIGIN</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">100% VERIFIED</span>
                <span className="text-blue-900">·</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">VAULT STATUS</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">OPERATIONAL</span>
                <span className="text-blue-900">·</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. The "Grail" Exhibition */}
        {grailProduct && (
          <section className="max-w-7xl mx-auto px-6 py-32 border-b border-gray-900">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-8">
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] flex items-center gap-4">
                  <Activity size={14} className="animate-pulse" /> The Grail
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
                  {grailProduct.name}
                </h2>

                <div className="flex items-center gap-6 pt-6">
                  <Link href={`/product/${grailProduct.id}`} className="bg-white text-black px-10 py-5 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 group border border-transparent hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                    View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-white font-black italic text-2xl">RM {grailProduct.price.toFixed(2)}</span>
                </div>
              </div>

              <Link href={`/product/${grailProduct.id}`} className="order-1 lg:order-2 relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden bg-[#111] border border-gray-800 group cursor-pointer block">
                <img
                  src={grailProduct.image}
                  className="w-full h-full object-cover brightness-90 contrast-110 group-hover:scale-105 group-hover:brightness-100 transition-all duration-[2s] ease-out glitch-hover"
                  alt={grailProduct.name}
                />
              </Link>
            </div>
          </section>
        )}

        {/* 4. Recent Drops Grid */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-b border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic leading-none">RECENT DROPS.</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Highly curated. Zero filler.</p>
            </div>
            {/* We fake a link to "/shop" since they KIV'd the dedicated page */}
            <Link href="/shop" className="text-blue-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-colors border-b border-blue-500/30 hover:border-white pb-1 flex items-center gap-2">
              Browse Collection <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {recentDrops.map((item, index) => (
              <ProductCards
                key={item.id}
                item={item}
                index={index}
                onAdd={() => handleAddToVault(item)}
                alwaysColor={true}
              />
            ))}
          </div>
        </section>

        {/* 5. Our Ethos */}
        <section id="ethos" className="max-w-7xl mx-auto px-6 py-32 border-b border-gray-900 overflow-hidden">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4">
              Vault Standards
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none mb-6">
              {ethos?.heading || 'OUR ETHOS.'}
            </h2>
            <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
              {ethos?.subheading || 'UNCOMPROMISING STANDARDS.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {(Array.isArray(ethos?.values) ? ethos.values : []).map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] hover:border-blue-600 transition-all group
                  ${idx === 0 ? 'md:col-span-2 p-10 md:p-14' : 'p-10 md:p-12'}
                  ${idx === 2 ? 'md:col-start-2 md:col-span-2' : ''}
                `}
              >
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500">
                  {idx === 0 ? <Activity className="text-blue-500 group-hover:text-white" size={24} /> : 
                   idx === 1 ? <ShieldCheck className="text-blue-500 group-hover:text-white" size={24} /> : 
                   <Cpu className="text-blue-500 group-hover:text-white" size={24} />}
                </div>
                <h3 className="text-xl font-black text-white italic tracking-tighter mb-4 group-hover:text-blue-500 transition-colors">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Artifact Tracking Module */}
        <section id="tracking" className="bg-transparent py-32 relative overflow-hidden px-6">
          <TrackingModule />
        </section>

        {/* 6. The Syndicate Waitlist */}
        <section id="syndicate" className="bg-[#111] max-w-5xl mx-auto px-6 py-24 md:py-32 text-center rounded-[3rem] border border-gray-800 relative group overflow-hidden mt-16">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none mix-blend-screen" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-6 relative inline-block">
              {cmsHome?.syndicateHeading || 'JOIN THE SYNDICATE.'}
              <span className="absolute -top-6 -right-10 text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest not-italic">Secured</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-12 max-w-lg mx-auto leading-relaxed">
              {cmsHome?.syndicateDescription || 'The highest-tier drops go fast. Submit your email to get early access to new drops before they go public.'}
            </p>

            <Link
              href="/join"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-12 py-5 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]"
            >
              Request Access <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </div>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <LiveActivityToast products={products} />
    </main>
  );
}