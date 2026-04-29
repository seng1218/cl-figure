"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const CITIES = ['Kuala Lumpur', 'Petaling Jaya', 'Johor Bahru', 'Penang', 'Shah Alam', 'Ipoh', 'Kota Kinabalu', 'Kuching', 'Subang Jaya', 'Klang'];
const ACTIONS = ['is viewing', 'is browsing', 'is checking out'];
const MINS = [1, 2, 3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 30];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function LiveActivityToast({ products = [] }) {
  const [toast, setToast] = useState(null);
  const timersRef = useRef([]);

  useEffect(() => {
    if (products.length === 0) return;

    const addTimer = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
      return id;
    };

    const showNext = () => {
      const product = pick(products);
      setToast({ city: pick(CITIES), name: product.name, action: pick(ACTIONS), mins: pick(MINS), id: Date.now() });
      addTimer(() => {
        setToast(null);
        addTimer(showNext, 30000 + Math.random() * 60000);
      }, 5000);
    };

    addTimer(showNext, 15000 + Math.random() * 15000);

    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  }, [products]);

  return (
    <div className="fixed bottom-8 left-4 md:left-8 z-[150] pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-2xl max-w-[280px]"
          >
            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck size={14} className="text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-[11px] leading-snug">
                Operative in <span className="text-blue-400">{toast.city}</span> {toast.action}{' '}
                <span className="font-black line-clamp-1">{toast.name}</span>
              </p>
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mt-0.5">{toast.mins}m ago</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
