"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCMS } from '@/context/CMSContext';
import Link from 'next/link';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const { site } = useCMS();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the color change slightly earlier (at 20px)
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set body overflow hidden when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 pointer-events-none"
      >
        <div
          className={`mx-auto flex justify-between items-center transition-all duration-700 rounded-full px-8 pointer-events-auto
            ${isScrolled
              ? 'max-w-4xl h-16 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
              : 'max-w-7xl h-20 bg-transparent border-transparent'
            }`}
        >
          {/* LOGO WITH CONTRAST FIX */}
          <Link href="/" className="flex flex-col leading-none">
            <span className={`text-2xl font-black tracking-tighter transition-all duration-500
              ${isScrolled
                ? 'text-white'
                : 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]'
              }`}
            >
              {site?.name || 'Vault 6 Studios'}<span className="text-blue-500">.</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mt-0.5">{site?.tagline || 'by Crafted Legacies'}</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className={`hidden md:flex items-center gap-8 ${isScrolled ? 'text-gray-400' : 'text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'}`}>
            <Link href="/shop" className="text-[10px] uppercase font-black tracking-[0.2em] hover:text-white transition-colors">
              Collection
            </Link>
            <Link href="/#ethos" className="text-[10px] uppercase font-black tracking-[0.2em] hover:text-white transition-colors">
              Ethos
            </Link>
            <Link href="/join" className="text-[10px] uppercase font-black tracking-[0.2em] hover:text-blue-500 transition-colors text-blue-600">
              Join
            </Link>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Input */}
            <form action="/shop" method="GET" className={`hidden md:flex items-center rounded-full px-3 py-1.5 transition-all duration-300 ${isScrolled ? 'bg-[#111] border border-gray-800' : 'bg-white/10 border border-white/20 backdrop-blur-sm'}`}>
              <input
                name="q"
                type="text"
                placeholder="SEARCH VAULT..."
                className="bg-transparent border-none outline-none text-[10px] text-white uppercase font-black tracking-widest pl-3 w-28 focus:w-48 transition-all placeholder:text-gray-500"
              />
              <button type="submit" className="flex items-center justify-center ml-1 hover:opacity-70 transition-opacity" aria-label="Search">
                <Search size={14} className={isScrolled ? 'text-gray-500' : 'text-white/80'} />
              </button>
            </form>

            {itemCount > 0 && (
              <Link
                href="/checkout"
                className={`hidden md:flex items-center gap-2 text-[10px] uppercase font-black tracking-widest transition-colors duration-500
                  ${isScrolled ? 'text-gray-500 hover:text-blue-500' : 'text-white/90 hover:text-white drop-shadow-md'}
                `}
              >
                Checkout <ArrowRight size={14} />
              </Link>
            )}

            {/* Cart Button with contrast border */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`relative p-3 rounded-full transition-all duration-500 shadow-xl
                ${isScrolled
                  ? 'bg-[#111] text-white hover:bg-blue-600 border border-gray-800'
                  : 'bg-white/10 text-white border border-white/20 hover:scale-110 backdrop-blur-sm'
                }`}
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden relative p-3 rounded-full transition-all duration-500 shadow-xl
                ${isScrolled
                  ? 'bg-[#111] text-white hover:bg-blue-600 border border-gray-800'
                  : 'bg-white/10 text-white border border-white/20 hover:scale-110 backdrop-blur-sm'
                }`}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 p-3 bg-[#111] text-white rounded-full hover:bg-blue-600 border border-gray-800 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-10 text-center">
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-black text-white uppercase italic tracking-tighter hover:text-blue-500 transition-colors"
              >
                Collection
              </Link>
              <Link
                href="/#ethos"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-black text-white uppercase italic tracking-tighter hover:text-blue-500 transition-colors"
              >
                Ethos
              </Link>
              <Link
                href="/join"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-black text-blue-600 uppercase italic tracking-tighter hover:text-blue-400 transition-colors"
              >
                Join Syndicate
              </Link>
              <div className="w-16 h-px bg-gray-800 my-4" />
              <Link
                href="/checkout"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-black text-gray-500 uppercase italic tracking-tighter flex items-center gap-2 hover:text-white transition-colors"
              >
                Checkout <ArrowRight size={20} className="text-blue-600" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}