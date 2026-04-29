"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
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

export default function ProductCard({ item, index, onAdd, alwaysColor = false }) {
  const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[2/3]'];
  const aspectClass = heights[index % heights.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.6, ease: "easeOut" }}
      className="group break-inside-avoid mb-8"
    >
      <Link href={`/product/${item.id}`} className={`block relative ${aspectClass} overflow-hidden bg-[#111] border border-[#222] glitch-hover`}>
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
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Value</span>
          <span className="text-base font-black text-white italic">RM {item.price.toFixed(2)}</span>
        </div>
      </Link>
    </motion.div>
  );
}
