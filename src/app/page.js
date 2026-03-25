"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { allProducts } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import HeroSection from '@/components/HeroSection';
import ProductCards from '@/components/ProductCards';
import VaultEntrance from '@/components/VaultEntrance'; 
import Toast from '@/components/Toast';
import { Lock, ArrowRight, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isSyndicateJoined, setIsSyndicateJoined] = useState(false);
  
  // Custom Spotlight logic
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAddToVault = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} Secured`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSyndicateSubmit = (e) => {
    e.preventDefault();
    setIsSyndicateJoined(true);
  };

  // The Grail is the first product
  const grailProduct = allProducts[0];
  // Recent drops are the next 3
  const recentDrops = allProducts.slice(1, 4);

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

        {/* 3. The "Grail" Exhibition */}
        {grailProduct && (
          <section className="max-w-7xl mx-auto px-6 py-32 border-b border-gray-900">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-8">
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] flex items-center gap-4">
                  <Activity size={14} className="animate-pulse" /> Asset 001 / The Grail
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
                  {grailProduct.name}
                </h2>
                <p className="text-gray-500 font-medium text-lg max-w-md leading-relaxed">
                  The absolute apex of the current collection. Forged in limited quantities, authenticated upon arrival. A centerpiece that commands the room.
                </p>
                <div className="flex items-center gap-6 pt-6">
                  <Link href={`/product/${grailProduct.id}`} className="bg-white text-black px-10 py-5 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 group border border-transparent hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                    Inspect Artifact <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-white font-black italic text-2xl">RM {grailProduct.price.toFixed(2)}</span>
                </div>
              </div>
              
              <Link href={`/product/${grailProduct.id}`} className="order-1 lg:order-2 relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden bg-[#111] border border-gray-800 group cursor-pointer block">
                {/* Aberration Glitch Hover effect + Grayscale */}
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay group-hover:bg-transparent transition-all duration-1000 z-10" />
                <img 
                  src={grailProduct.image} 
                  className="w-full h-full object-cover grayscale brightness-75 contrast-125 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-[2s] ease-out glitch-hover relative z-0" 
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
              View All Archives <ArrowRight size={12} />
            </Link>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {recentDrops.map((item, index) => (
              <ProductCards 
                key={item.id} 
                item={item} 
                index={index} 
                onAdd={() => handleAddToVault(item)} 
              />
            ))}
          </div>
        </section>

        {/* 5. Brand ETHOS Manifesto */}
        <section className="bg-transparent py-32 relative overflow-hidden">
          {/* Faint massive background text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[20vw] font-black text-white/5 whitespace-nowrap italic tracking-tighter pointer-events-none select-none">
            THE ETHOS
          </div>
          
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 relative z-10 text-center md:text-left">
            <div className="space-y-6 flex flex-col items-center md:items-start">
              <ShieldCheck size={48} className="text-blue-600 mb-2" strokeWidth={1} />
              <h3 className="text-2xl font-black text-white uppercase tracking-widest">100% Verified</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">No bootlegs. No recasts. Every item is cross-referenced with manufacturer cryptography before entering the Vault.</p>
            </div>
            <div className="space-y-6 flex flex-col items-center md:items-start">
              <Lock size={48} className="text-white mb-2" strokeWidth={1} />
              <h3 className="text-2xl font-black text-white uppercase tracking-widest">Secure Transport</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">Artifacts are sealed in impact-resistant, high-density vault casing, guaranteeing S-Tier mint condition upon arrival.</p>
            </div>
            <div className="space-y-6 flex flex-col items-center md:items-start">
              <Cpu size={48} className="text-blue-600 mb-2" strokeWidth={1} />
              <h3 className="text-2xl font-black text-white uppercase tracking-widest">Asset Tracking</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">Your collection portfolio is digitized. Track provenance and estimated market value seamlessly within your dashboard.</p>
            </div>
          </div>
        </section>

        {/* 6. The Syndicate Waitlist */}
        <section className="bg-[#111] max-w-5xl mx-auto px-6 py-24 md:py-32 text-center rounded-[3rem] border border-gray-800 relative group overflow-hidden mt-16">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none mix-blend-screen" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-6 relative inline-block">
              JOIN THE SYNDICATE.
              <span className="absolute -top-6 -right-10 text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest not-italic">Encrypted</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-12 max-w-lg mx-auto leading-relaxed">
              The highest-tier drops never make it to the public floor. Submit your biometric tag (e-mail) to gain exclusive early access to restricted archives.
            </p>
            
            {isSyndicateJoined ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="inline-block bg-[#111] border border-green-900/50 text-green-500 px-12 py-6 text-xs uppercase font-black tracking-[0.3em] shadow-[0_0_30px_rgba(34,197,94,0.2)]"
              >
                [ Access Requested. Stand by for Comms. ]
              </motion.div>
            ) : (
              <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={handleSyndicateSubmit}>
                <input 
                  type="email" 
                  placeholder="Enter encrypted comms..." 
                  className="flex-grow bg-[#050505] border border-gray-700 text-white px-8 py-5 text-[10px] md:text-xs uppercase font-black tracking-widest focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-700"
                  required
                />
                <button type="submit" className="bg-blue-600 text-white px-10 py-5 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all whitespace-nowrap shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                  Request Access
                </button>
              </form>
            )}
          </div>
        </section>

      </div>
        <Toast 
          message={toastMessage} 
          isVisible={showToast} 
          onClose={() => setShowToast(false)} 
        />
    </main>
  );
}