"use client";
import { MessageSquareCode, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommsPortal() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-4 pointer-events-none">

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-[#111] border border-gray-800 p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] pointer-events-auto max-w-[320px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-blue-500">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase font-black tracking-widest">Secure Line</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                System operatives are standing by. For inquiries regarding Vault inventory, shipping protocols, or asset authentication, initiate comms.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full block text-center bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-lg hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                Launch Encrypted Chat
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative bg-[#050505] text-white p-4 rounded-full border border-gray-800 shadow-2xl hover:border-blue-500 hover:text-blue-500 transition-all pointer-events-auto flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquareCode size={24} className="relative z-10" />
        </button>
      </div>
    </>
  );
}
