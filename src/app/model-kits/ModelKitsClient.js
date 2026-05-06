"use client";
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import ProductCards from '@/components/ProductCards';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: ShieldCheck,
    label: 'Merchant Licensed',
    desc: 'Officially licensed to print and sell. Every kit is an authorized physical reproduction — not a bootleg.',
  },
  {
    icon: Cpu,
    label: 'Pre-Printed Parts',
    desc: 'We handle the printing. Parts arrive clean, measured, and ready for your assembly session.',
  },
  {
    icon: Wrench,
    label: 'Yours to Build',
    desc: 'Assemble with CA glue, sand, prime, and paint. Full creative control over finish and display.',
  },
];

export default function ModelKitsClient() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle'); // idle | loading | success | error | duplicate
  const [website, setWebsite] = useState(''); // honeypot
  const spotlightRef = useRef(null);

  useEffect(() => {
    fetch('/api/products/', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data.filter(p => p.category === '3D Print Kit'));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleAddToVault = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} Added to Build Queue`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();
      if (res.status === 409) { setSubStatus('duplicate'); return; }
      if (!data.success) { setSubStatus('error'); return; }
      setSubStatus('success');
      setEmail('');
    } catch {
      setSubStatus('error');
    }
  };

  const sortedProducts = [...products].sort((a, b) => (a.stock <= 0 ? 1 : 0) - (b.stock <= 0 ? 1 : 0));

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-x-hidden">
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[800px] h-[800px] pointer-events-none z-0 rounded-full mix-blend-screen opacity-30 transition-transform duration-75 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(0,0,0,0) 70%)' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-black text-[9px] uppercase tracking-[0.6em] block mb-6"
          >
            Vault 6 Studios // Fabricator Division
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none"
          >
            BUILD THE<br />VAULT.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mt-6"
          >
            3D Print Model Kits // Licensed. Pre-Printed. Yours to Build.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-[#1a1a1a] bg-[#0a0a0a] p-8 hover:border-orange-500/30 transition-colors duration-500"
            >
              <Icon size={20} className="text-orange-500 mb-5" />
              <h3 className="font-black text-white uppercase tracking-tighter text-lg italic mb-2">{label}</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Product grid or coming soon */}
        {loading ? (
          <div className="py-24 text-center">
            <p className="text-gray-600 font-black uppercase tracking-widest text-xs animate-pulse">
              Scanning Fabrication Queue...
            </p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <>
            <div className="mb-12 flex items-center gap-4">
              <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
                Available Kits
              </h2>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
              <span className="text-orange-500 font-black text-[9px] uppercase tracking-[0.4em]">
                {sortedProducts.length} Kit{sortedProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-9">
              {sortedProducts.map((item, index) => (
                <ProductCards
                  key={item.id}
                  item={item}
                  index={index}
                  onAdd={() => handleAddToVault(item)}
                  alwaysColor={true}
                />
              ))}
            </section>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-24 border border-[#1a1a1a] bg-[#080808] text-center px-8"
          >
            <span className="text-orange-500/50 font-black text-[9px] uppercase tracking-[0.6em] block mb-6">
              Status: Pre-Production
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-4">
              KITS INCOMING.
            </h2>
            <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-md mx-auto mb-12">
              First batch in fabrication. Drop notification goes to the waitlist only — public won&apos;t see it until it&apos;s gone.
            </p>

            {subStatus === 'success' ? (
              <div className="flex items-center justify-center gap-3 text-orange-400">
                <CheckCircle2 size={16} />
                <span className="font-black text-xs uppercase tracking-[0.3em]">Locked In. You&apos;ll know first.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-[#0f0f0f] border border-[#1f1f1f] text-white text-xs font-mono px-4 py-3 outline-none focus:border-orange-500/50 placeholder:text-gray-700 transition-colors"
                />
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="bg-orange-500 text-black px-6 py-3 font-black text-[9px] uppercase tracking-[0.3em] hover:bg-orange-400 transition-colors disabled:opacity-50 flex items-center gap-2 justify-center whitespace-nowrap"
                >
                  {subStatus === 'loading' ? 'Queuing...' : <><span>Notify Me</span> <ArrowRight size={10} /></>}
                </button>
              </form>
            )}

            {subStatus === 'duplicate' && (
              <p className="text-orange-500/60 text-[9px] font-black uppercase tracking-[0.3em] mt-3">
                Already in the queue.
              </p>
            )}
            {subStatus === 'error' && (
              <p className="text-red-500/60 text-[9px] font-black uppercase tracking-[0.3em] mt-3">
                Failed. Try again.
              </p>
            )}

            <div className="mt-12 pt-8 border-t border-[#111]">
              <Link
                href="/shop"
                className="text-gray-600 hover:text-white text-[9px] font-black uppercase tracking-[0.4em] transition-colors inline-flex items-center gap-2"
              >
                Browse Ready Stock Instead <ArrowRight size={9} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </main>
  );
}
