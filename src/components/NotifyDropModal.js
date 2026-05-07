"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function NotifyDropModal({ product, onClose }) {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | duplicate | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/notify-drop/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId: product.id, productName: product.name, website }),
      });
      const data = await res.json();
      if (res.status === 409) { setStatus('duplicate'); return; }
      if (!data.success) { setErrorMsg(data.error || 'Failed.'); setStatus('error'); return; }
      setStatus('success');
    } catch {
      setErrorMsg('Connection error.'); setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="bg-[#0a0a0a] border border-gray-800 max-w-md w-full p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.9)]" />
              <span className="text-blue-600 font-black text-[9px] uppercase tracking-[0.4em]">Incoming Drop</span>
            </div>
            <h2 className="text-2xl font-black text-white italic tracking-tighter leading-tight">{product.name}</h2>
            <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest mt-1">{product.series}</p>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <CheckCircle2 size={32} className="text-green-500 mx-auto mb-4" />
              <p className="text-white font-black uppercase tracking-widest text-sm">Locked in.</p>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">You drop when it drops.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed">
                Get notified the moment this piece releases. No spam — one email, one drop.
              </p>

              <input
                type="text"
                name="website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors text-sm"
              />

              {status === 'duplicate' && (
                <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={12} /> Already registered for this drop.
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span className="animate-pulse">Registering...</span>
                ) : (
                  <><Bell size={14} /> Notify Me On Drop</>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
