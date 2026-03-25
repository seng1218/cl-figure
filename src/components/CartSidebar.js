"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          />

          {/* The Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#050505] border-l border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center text-white">
              <h2 className="text-xl font-black flex items-center gap-2 italic tracking-tighter">
                <ShoppingBag size={20} /> YOUR CART
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded-full transition-colors relative z-[10000]"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 font-bold uppercase text-xs tracking-widest italic">The Vault is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <div className="w-20 h-20 bg-[#111] border border-gray-800 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none mix-blend-screen" />
                      <img src={item.image} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt={item.name} />
                    </div>
                    <div className="flex-grow text-white">
                      <h3 className="font-bold text-sm leading-tight italic">{item.name}</h3>
                      <p className="text-blue-500 font-black text-xs mt-1">RM {item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-white font-bold px-2 transition-colors">-</button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-white font-bold px-2 transition-colors">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout Button */}
            <div className="p-8 border-t border-gray-800 bg-[#0a0a0a]">
              <div className="flex justify-between items-center mb-6 text-white">
                <span className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">Net Value</span>
                <span className="text-2xl font-black italic">RM {(cartTotal || 0).toFixed(2)}</span>
              </div>
              <Link 
                href="/checkout" 
                onClick={onClose}
                className="block w-full bg-blue-600 text-white text-center py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}