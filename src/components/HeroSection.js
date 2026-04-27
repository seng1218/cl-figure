"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';

export default function HeroSection({ onExplore }) {
  const { scrollY } = useScroll();
  const { hero, site } = useCMS();

  // Parallax for marquee
  const sliderX = useTransform(scrollY, [0, 1000], [0, -1000]);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-[#050505] flex items-center justify-center pt-20">

      {/* BACKGROUND VISUAL WITH PARALLAX */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        <motion.img
          style={{ y: useTransform(scrollY, [0, 1000], [0, 300]) }}
          src="/banner.png"
          alt="Vault Artifact"
          className="w-full h-full object-cover object-top opacity-20 scale-110 mix-blend-luminosity grayscale contrast-125"
        />
        {/* Provocative harsh dark fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />
      </div>

      {/* Infinite Scrolling Provocative Marquee */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden whitespace-nowrap z-0 pointer-events-none opacity-20 hidden md:block">
        <motion.div style={{ x: sliderX, WebkitTextStroke: '2px rgba(255,255,255,0.7)' }} className="flex gap-8 items-center text-[12vw] font-black uppercase italic leading-none text-transparent">
          <span>UNRIVALED.</span>
          <span>EXCLUSIVE.</span>
          <span>S-TIER.</span>
          <span>ARCHIVED.</span>
          <span>UNRIVALED.</span>
          <span>EXCLUSIVE.</span>
          <span>S-TIER.</span>
        </motion.div>
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 text-center px-6 mix-blend-exclusion">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-black text-[10px] md:text-xs tracking-[1em] uppercase mb-8 block opacity-80"
        >
          {hero?.tagline || 'Established 2023'}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-7xl md:text-[12rem] font-black text-white tracking-tighter mb-8 italic leading-none drop-shadow-2xl"
        >
          {site?.name || 'Vault 6 Studios'}<span className="text-blue-600 animate-pulse">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-6 mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExplore}
            className="group relative bg-white text-black px-12 py-6 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-blue-600 hover:text-white transition-all overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
            <span className="relative z-10">{hero?.ctaLabel || 'Enter Vault'}</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </motion.button>
          
          <a href="/shop" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
            Browse the Archive
          </a>
        </motion.div>
      </div>
    </section>
  );
}