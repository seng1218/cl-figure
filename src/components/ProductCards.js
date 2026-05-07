"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Bell, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function PreorderCountdown({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline) - Date.now();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!timeLeft) return null;
  return (
    <div className="flex items-center gap-2 mt-2 mb-1">
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-500">Closes in</span>
      <span className="text-[8px] font-mono font-black text-orange-400">{timeLeft.d}d {timeLeft.h}h {timeLeft.m}m</span>
    </div>
  );
}

function DropCountdown({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline) - Date.now();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!timeLeft) return null;
  return (
    <div className="flex items-center gap-2 mt-2 mb-1">
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500">Drops in</span>
      <span className="text-[8px] font-mono font-black text-blue-400">{timeLeft.d}d {timeLeft.h}h {timeLeft.m}m</span>
    </div>
  );
}

export default function ProductCard({ item, index, onAdd, onNotify, alwaysColor = false }) {
  const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[2/3]'];
  const aspectClass = heights[index % heights.length];
  const [imgLoaded, setImgLoaded] = useState(false);

  if (item.comingSoon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 3) * 0.1, duration: 0.45, ease: "easeOut" }}
        className="group break-inside-avoid mb-8"
      >
        {/* Card image — not a link, triggers notify */}
        <div
          onClick={() => onNotify && onNotify(item)}
          className={`block relative ${aspectClass} overflow-hidden bg-[#111] border border-blue-900/20 cursor-pointer`}
        >
          {/* Blurred silhouette image */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: imgLoaded ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={item.image}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover blur-xl brightness-50 scale-110 saturate-50"
              alt="Coming Soon"
              onLoad={() => setImgLoaded(true)}
            />
          </motion.div>

          {/* Scanline texture */}
          <div
            className="absolute inset-0 z-[1] opacity-25 pointer-events-none"
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)' }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 z-[2]" />

          {/* Animated light sweep */}
          <motion.div
            animate={{ x: ['-150%', '250%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-blue-400/[0.06] to-transparent skew-x-12 z-[3] pointer-events-none"
          />

          {/* INCOMING badge */}
          <div className="absolute top-4 left-4 z-[4] flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-900/40">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.9)]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">Incoming</span>
          </div>

          {/* Lock icon center */}
          <div className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-blue-600/20 rounded-full scale-[2]" />
              <Lock size={28} className="text-blue-500/30 relative" />
            </div>
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-[5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 pointer-events-none">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.3em] flex items-center gap-2 pointer-events-auto translate-y-4 group-hover:translate-y-0 duration-500 shadow-2xl shadow-blue-900/50">
              <Bell size={11} /> Get Notified
            </div>
          </div>
        </div>

        {/* Info below card */}
        <div
          onClick={() => onNotify && onNotify(item)}
          className="mt-5 cursor-pointer group/info"
        >
          <span className="text-blue-600 font-black text-[9px] uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(37,99,235,0.8)] block mb-1">{item.series || ''}</span>
          <h3 className="text-lg md:text-2xl font-black text-white tracking-tighter group-hover/info:text-blue-400 transition-colors uppercase italic leading-tight line-clamp-2">{item.name}</h3>
          <div className="flex items-center gap-2 mt-3 mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">Coming Soon</span>
          </div>
          {item.releaseDate && <DropCountdown deadline={item.releaseDate} />}
          <div className="flex items-center justify-between border-t border-gray-900 pt-3 mt-2">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Price</span>
            <span className="text-sm font-black text-gray-700 italic tracking-[0.3em]">— —</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.45, ease: "easeOut" }}
      className="group break-inside-avoid mb-8"
    >
      <Link href={`/product/${item.id}`} className={`block relative ${aspectClass} overflow-hidden bg-[#111] border border-[#222]`}>
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: imgLoaded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={item.image}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 ${
              alwaysColor
                ? 'brightness-90 contrast-110'
                : 'grayscale brightness-75 contrast-125 group-hover:grayscale-0 group-hover:brightness-100'
            }`}
            alt={item.name}
            onLoad={() => setImgLoaded(true)}
          />
        </motion.div>

        {/* Warm ambient glow — bridges cold UI with warm figure tones */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[1]"
          style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(251,146,60,0.08) 0%, rgba(244,114,182,0.05) 50%, transparent 75%)' }}
        />

        {/* Gradient overlay — pill CTA slides up from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 pointer-events-none">
          {item.stock > 0 ? (
            <button
              onClick={(e) => { e.preventDefault(); onAdd(); }}
              className="bg-white text-black px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all pointer-events-auto translate-y-4 group-hover:translate-y-0 duration-500 shadow-2xl"
            >
              Secure Piece <ArrowRight size={11} />
            </button>
          ) : (
            <div className="bg-red-900/80 text-white px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.3em] border border-red-500 translate-y-4 group-hover:translate-y-0 duration-500">
              Sold Out
            </div>
          )}
        </div>
      </Link>

      <Link href={`/product/${item.id}`} className="mt-5 block group/info">
        <span className="text-blue-600 font-black text-[9px] uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(37,99,235,0.8)] block mb-1">{item.series || ''}</span>
        <h3 className="text-lg md:text-2xl font-black text-white tracking-tighter group-hover/info:text-blue-400 transition-colors uppercase italic leading-tight line-clamp-2">{item.name}</h3>
        <div className="flex items-center gap-2 mt-3 mb-2">
          <ShieldCheck size={10} className="text-blue-500 shrink-0" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">Origin Verified</span>
        </div>
        {item.category === 'Pre-order' && item.preorderDeadline && (
          <PreorderCountdown deadline={item.preorderDeadline} />
        )}
        <div className="flex items-center justify-between border-t border-gray-900 pt-3">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Price</span>
          <span className="text-base font-black text-white italic">RM {item.price.toFixed(2)}</span>
        </div>
      </Link>
    </motion.div>
  );
}
