"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Your <span className="text-blue-600">Vault</span></h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{cart.length} Artifacts Secured</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={40} className="text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Vault is Currently Empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow py-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">{item.series}</p>
                        <h4 className="font-black text-gray-900 tracking-tight leading-tight">{item.name}</h4>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="font-black text-sm text-gray-900 italic">RM {item.price.toFixed(2)}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-[#fafafa]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Investment</span>
                  <span className="text-2xl font-black text-gray-900 italic text-blue-600">RM {cartTotal.toFixed(2)}</span>
                </div>
                <Link 
                  href="/checkout" 
                  className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl"
                  onClick={onClose}
                >
                  Secure Checkout <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}