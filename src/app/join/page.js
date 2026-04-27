"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, Shield, Bell, ArrowRight, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const BENEFITS = [
  { icon: Bell, label: 'Early Drop Access', desc: 'New vault entries hit your inbox 24hrs before public release.' },
  { icon: Shield, label: 'Verified Collector Badge', desc: 'Exclusive Syndicate member status across all communications.' },
  { icon: Zap, label: 'Flash Sale Alerts', desc: 'Instant notification when prices drop or rare units surface.' },
];

export default function JoinPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | duplicate
  const [errorMsg, setErrorMsg] = useState('');
  const [memberCount, setMemberCount] = useState(null);
  const [website, setWebsite] = useState(''); // Honeypot
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, website }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        if (data.count) setMemberCount(data.count);
        const end = Date.now() + 2500;
        const colors = ['#2563eb', '#fff', '#60a5fa'];
        (function frame() {
          confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
          confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        }());
      } else if (res.status === 409) {
        setStatus('duplicate');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Connection failed. Try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col">
      {/* Mouse spotlight */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[800px] h-[800px] pointer-events-none z-0 rounded-full mix-blend-screen opacity-40 transition-transform duration-75 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(0,0,0,0) 70%)' }}
      />

      {/* Back nav */}
      <div className="relative z-10 px-6 pt-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-colors flex items-center gap-2">
          ← Vault
        </Link>
        <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
          <Users size={12} />
          {memberCount !== null ? `${memberCount} Members` : 'The Syndicate'}
        </span>
      </div>

      <div className="relative z-10 flex-grow flex items-center px-6 py-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Manifesto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-12"
          >
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-blue-600 font-black text-[10px] uppercase tracking-[0.6em] flex items-center gap-3 mb-6"
              >
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                Syndicate Access
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none"
              >
                JOIN THE<br />
                <span className="text-blue-600">SYNDICATE.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-gray-500 text-base leading-relaxed mt-8 max-w-md"
              >
                The rarest drops never make it to the public. Syndicate members get first look,
                first claim, and zero FOMO. Submit your credentials to gain clearance.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-6"
            >
              {BENEFITS.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-5 group"
                >
                  <div className="shrink-0 w-10 h-10 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center group-hover:border-blue-900 group-hover:bg-blue-900/10 transition-all">
                    <Icon size={16} className="text-blue-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-wider">{label}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 pt-4 border-t border-gray-900"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 border-2 border-[#050505] flex items-center justify-center text-[8px] font-black text-white"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                Collectors already inside the Vault
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT: Form card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
              {/* Ambient corner glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-900/20 border border-green-900/40 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                      <CheckCircle2 size={40} className="text-green-500" strokeWidth={1} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-white italic tracking-tighter">ACCESS GRANTED.</h2>
                      <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Clearance: Syndicate</p>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      A confirmation has been dispatched to your inbox. Watch for vault comms.
                    </p>
                    {memberCount && (
                      <p className="text-blue-600/60 font-black text-[10px] uppercase tracking-widest">
                        Member #{memberCount} of the Syndicate
                      </p>
                    )}
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all group"
                    >
                      Browse the Vault <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="mb-10">
                      <Lock size={32} className="text-blue-600 mb-6" strokeWidth={1} />
                      <h2 className="text-3xl font-black text-white italic tracking-tighter">Request Clearance</h2>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Syndicate application form</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Operative Name <span className="text-gray-700 normal-case">(optional)</span></label>
                        <input
                          type="text"
                          placeholder="Your name..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Secure Comms Channel <span className="text-red-600">*</span></label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-gray-700"
                        />
                      </div>

                      {/* Honeypot field - hidden from users, caught by bots */}
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          tabIndex="-1"
                          autoComplete="off"
                        />
                      </div>

                      <AnimatePresence>
                        {(status === 'error' || status === 'duplicate') && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 bg-red-900/10 border border-red-900/30 p-4"
                          >
                            <AlertTriangle size={14} className="text-red-500 shrink-0" />
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">
                              {status === 'duplicate'
                                ? 'This operative is already in the Syndicate.'
                                : errorMsg}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-white text-black py-5 font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                      >
                        {status === 'loading' ? (
                          <span className="animate-pulse">Transmitting...</span>
                        ) : (
                          <>Request Syndicate Access <ArrowRight size={14} /></>
                        )}
                      </button>
                    </form>

                    <p className="text-gray-700 text-[9px] font-bold uppercase tracking-widest text-center mt-8 leading-relaxed">
                      No spam. Vault drops only. Unsubscribe anytime.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
