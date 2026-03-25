"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

export default function Toast({ message, isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-28 left-1/2 z-[110] w-full max-w-xs md:max-w-sm"
        >
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4">
            <div className="bg-blue-500 p-2 rounded-xl text-white">
              <ShieldCheck size={18} />
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">System Update</p>
              <p className="text-sm font-bold text-white tracking-tight">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}