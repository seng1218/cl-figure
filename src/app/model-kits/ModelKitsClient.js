"use client";
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import ProductCards from '@/components/ProductCards';
import Toast from '@/components/Toast';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    num: '01',
    label: 'Merchant Licensed',
    desc: 'Officially licensed to print and sell. Every kit is an authorized physical reproduction — not a bootleg.',
  },
  {
    num: '02',
    label: 'Pre-Printed Parts',
    desc: 'We handle the printing. Parts arrive clean, measured, and ready for your assembly session.',
  },
  {
    num: '03',
    label: 'Yours to Build',
    desc: 'Assemble with CA glue, sand, prime, and paint. Full creative control over finish and display.',
  },
];

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function ModelKitsClient() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle');
  const [website, setWebsite] = useState(''); // honeypot

  useEffect(() => {
    fetch('/api/products/', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data.filter(p => p.category === '3D Print Kit'));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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
    <main className="min-h-screen bg-[#0d0d0d] text-[#f0ede8]">

      {/* ── HERO ── */}
      <section className="pt-40 pb-24 px-6 md:px-12 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[9px] tracking-[0.6em] uppercase text-white/25 mb-8"
          >
            Vault 6 Studios — Fabricator Division
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-6xl md:text-[9rem] font-black uppercase italic tracking-tighter leading-none text-white mb-8"
          >
            3D Print<br />Kits.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-white/35 text-xs font-medium tracking-[0.3em] uppercase max-w-md"
          >
            Licensed. Pre-Printed. Yours to Build.
          </motion.p>
        </div>
      </section>

      {/* ── FEATURE LIST ── */}
      <section className="py-20 px-6 md:px-12 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto divide-y divide-white/[0.06]">
          {FEATURES.map(({ num, label, desc }, i) => (
            <FadeUp key={label} delay={i * 0.08}>
              <div className="py-10 grid grid-cols-12 gap-6 items-start">
                <span className="col-span-1 text-[10px] font-black text-white/20 tracking-widest pt-0.5">{num}</span>
                <h3 className="col-span-4 md:col-span-3 text-sm font-black uppercase tracking-[0.2em] text-white/80">
                  {label}
                </h3>
                <p className="col-span-7 md:col-span-8 text-white/35 text-xs leading-relaxed font-medium">
                  {desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── PRODUCT GRID or COMING SOON ── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">

          {loading ? (
            <div className="py-32 text-center">
              <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
                Scanning Fabrication Queue...
              </p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <>
              <FadeUp>
                <div className="flex items-center gap-6 mb-16">
                  <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white">
                    Available Kits
                  </h2>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-[9px] tracking-[0.4em] uppercase text-white/25 font-black">
                    {sortedProducts.length} Kit{sortedProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </FadeUp>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <FadeUp>
              <div className="border border-white/[0.06] py-24 px-8 text-center">
                <p className="text-[9px] tracking-[0.6em] uppercase text-white/20 font-black mb-8">
                  Status: Pre-Production
                </p>
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-6">
                  Kits Incoming.
                </h2>
                <p className="text-white/30 text-xs leading-relaxed font-medium max-w-sm mx-auto mb-14">
                  First batch in fabrication. Drop notification goes to the waitlist only — public won&apos;t see it until it&apos;s gone.
                </p>

                {subStatus === 'success' ? (
                  <div className="flex items-center justify-center gap-3 text-white/60">
                    <CheckCircle2 size={14} strokeWidth={1.5} />
                    <span className="font-black text-[10px] uppercase tracking-[0.3em]">
                      Locked In. You&apos;ll know first.
                    </span>
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
                      className="flex-1 bg-white/[0.03] border border-white/[0.08] text-white/80 text-xs font-mono px-4 py-3 outline-none focus:border-white/20 placeholder:text-white/15 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={subStatus === 'loading'}
                      className="bg-white text-black px-6 py-3 font-black text-[9px] uppercase tracking-[0.3em] hover:bg-white/80 transition-colors disabled:opacity-40 flex items-center gap-2 justify-center whitespace-nowrap"
                    >
                      {subStatus === 'loading' ? 'Queuing...' : <><span>Notify Me</span><ArrowRight size={10} /></>}
                    </button>
                  </form>
                )}

                {subStatus === 'duplicate' && (
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mt-4">
                    Already in the queue.
                  </p>
                )}
                {subStatus === 'error' && (
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mt-4">
                    Failed. Try again.
                  </p>
                )}

                <div className="mt-14 pt-8 border-t border-white/[0.06]">
                  <Link
                    href="/shop"
                    className="text-white/20 hover:text-white/60 text-[9px] font-black uppercase tracking-[0.4em] transition-colors inline-flex items-center gap-2"
                  >
                    Browse Ready Stock Instead <ArrowRight size={9} />
                  </Link>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </main>
  );
}
