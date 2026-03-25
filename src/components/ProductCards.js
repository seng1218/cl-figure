import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ item, index, onAdd, alwaysColor = false }) {
  // Asymmetrical heights for Masonry variety
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
        {/* Provocative Grayscale default, color on hover + glitch effect handled by wrapper */}
        <img 
          src={item.image} 
          className={`w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 ${
            alwaysColor 
              ? 'brightness-90 contrast-110' 
              : 'grayscale brightness-75 contrast-125 group-hover:grayscale-0 group-hover:brightness-100'
          }`}
          alt={item.name} 
        />
        
        {/* Dark brutalist overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px] pointer-events-none">
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAdd();
            }}
            className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-white transition-all transform scale-50 group-hover:scale-100 duration-500 pointer-events-auto"
          >
            <Plus size={32} />
            <span className="text-[9px] font-black uppercase mt-1 tracking-widest">Acquire</span>
          </button>
        </div>
      </Link>

      <Link href={`/product/${item.id}`} className="mt-5 block group/info">
        <span className="text-blue-600 font-black text-[9px] uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(37,99,235,0.8)] block mb-1">{item.series}</span>
        <h3 className="text-lg md:text-2xl font-black text-white tracking-tighter group-hover/info:text-blue-400 transition-colors uppercase italic leading-tight line-clamp-2">{item.name}</h3>
        <div className="flex items-center justify-between mt-3 border-t border-gray-900 pt-3">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em]">Value</span>
          <span className="text-base font-black text-white italic">RM {item.price.toFixed(2)}</span>
        </div>
      </Link>
    </motion.div>
  );
}