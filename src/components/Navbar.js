"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  const handleTrackingClick = (e, closeMobile = false) => {
    if (closeMobile) setIsMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-700"
        style={{
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          background: isScrolled ? 'rgba(13,13,13,0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        }}
      >
        {/* Logo — ThoughtLab two-line */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/30">Vault 6</span>
          <span className="text-[13px] tracking-[0.2em] uppercase font-semibold text-white">
            {site?.name || 'Studios'}
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Collection', href: '/shop' },
            { label: 'Drops', href: '/drops' },
            { label: 'Tracking', href: '/#tracking', special: true },
            { label: 'Join', href: '/join' },
            { label: 'Member', href: '/member/login' },
          ].map(({ label, href, special }) => (
            <Link
              key={label}
              href={href}
              onClick={special ? (e) => handleTrackingClick(e) : undefined}
              className="text-[10px] tracking-[0.28em] uppercase text-white/40 hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: search + cart + mobile toggle */}
        <div className="flex items-center gap-5">
          {/* Search — desktop only */}
          <form action="/shop" method="GET" className="hidden md:flex items-center gap-2">
            <input
              name="q"
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-[10px] text-white/40 uppercase font-medium tracking-widest w-20 focus:w-36 transition-all placeholder:text-white/20"
            />
            <button type="submit" className="flex items-center text-white/30 hover:text-white transition-colors" aria-label="Search">
              <Search size={13} strokeWidth={1.5} />
            </button>
          </form>

          {/* Cart */}
          <button
            aria-label="Open cart"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-200"
          >
            <ShoppingBag size={15} strokeWidth={1.5} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-[10px] tracking-[0.2em] overflow-hidden whitespace-nowrap"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile toggle */}
          <button
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-white/40 hover:text-white transition-colors duration-200"
          >
            <Menu size={17} strokeWidth={1.5} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center"
            style={{ background: 'rgba(13,13,13,0.97)', backdropFilter: 'blur(20px)' }}
          >
            <button
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="flex flex-col items-center gap-9 text-center">
              {[
                { label: 'Collection', href: '/shop' },
                { label: 'Drops', href: '/drops' },
                { label: 'Tracking', href: '/#tracking', special: true },
                { label: 'Join Syndicate', href: '/join' },
                { label: 'Member Portal', href: '/member/login' },
              ].map(({ label, href, special }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={special ? (e) => handleTrackingClick(e, true) : () => setIsMobileMenuOpen(false)}
                  className="text-3xl font-black uppercase italic tracking-tighter text-white/60 hover:text-white transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
              <div className="w-8 h-px bg-white/10 my-2" />
              <Link
                href="/checkout"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-black uppercase italic tracking-tighter text-white/30 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                Checkout <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
