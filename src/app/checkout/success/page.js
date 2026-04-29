"use client";
import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('reference_number');
  const hitpayStatus = searchParams.get('status');

  const [tracking, setTracking] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300);
  const certificateRef = useRef(null);

  useEffect(() => {
    // Restore display data from sessionStorage (saved before HitPay redirect)
    try {
      const s = sessionStorage.getItem('v6_shipping');
      const t = sessionStorage.getItem('v6_total');
      const i = sessionStorage.getItem('v6_items');
      if (s) setShipping(JSON.parse(s));
      if (t) setTotal(t);
      if (i) setItems(JSON.parse(i));
    } catch {}
  }, []);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch(`/api/track/?id=${encodeURIComponent(orderId)}`)
      .then(r => r.json())
      .then(data => { if (data.success) setTracking(data.tracking); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    const end = Date.now() + 3000;
    const colors = ['#2563eb', '#fbbf24', '#ffffff'];
    import('canvas-confetti').then(({ default: confetti }) => {
      (function frame() {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const downloadPDF = async () => {
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const canvas = await html2canvas(certificateRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, (canvas.height * w) / canvas.width);
      pdf.save('Vault6-Acquisition-Certificate.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
    }
  };

  // Payment failed state
  if (hitpayStatus && hitpayStatus !== 'completed') {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-center pt-20">
        <div className="max-w-md w-full space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-4xl">✕</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Payment Incomplete</h1>
          <p className="text-gray-500 text-sm">Your payment was not completed. Your cart items have been restored — you can try again.</p>
          {orderId && <p className="text-gray-400 text-xs font-mono">Ref: {orderId}</p>}
          <div className="flex flex-col gap-3">
            <Link href="/checkout" className="bg-gray-900 text-white py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all">
              Try Again
            </Link>
            <Link href="/" className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-colors">
              Return to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayItems = items.length > 0 ? items : (tracking?.items || []);
  const displayTotal = total || tracking?.grandTotal?.toFixed(2) || '—';

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-center pt-20">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full">
        <div ref={certificateRef} className="bg-white border border-gray-200 rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="h-32 bg-gray-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl z-10">
              <ShieldCheck size={40} className="text-white" />
            </div>
          </div>
          <div className="p-10 pt-12 space-y-8 text-left relative">
            <div className="space-y-2 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Official Protocol Verified</p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Certificate of Acquisition</h2>
            </div>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-dashed border-gray-200 font-mono">
              <div>
                <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Asset ID</p>
                <p className="text-xs font-black text-gray-900 break-all">{orderId || '—'}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Clearance Date</p>
                <p className="text-xs font-black text-gray-900">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Vault Status</p>
                <p className="text-xs font-black text-green-600 uppercase">Secured</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Total Value</p>
                <p className="text-xs font-black text-gray-900">RM {displayTotal}</p>
              </div>
            </div>

            {displayItems.length > 0 && (
              <div className="py-5 border-b border-dashed border-gray-200 space-y-3">
                <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-3">Acquired Assets</p>
                {displayItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-900 truncate">{item.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Qty {item.quantity}{item.price != null ? ` · RM ${Number(item.price).toFixed(2)}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {shipping && (
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-black tracking-widest text-gray-400">Dispatch To</p>
                <p className="text-xs font-bold text-gray-700">{shipping.fullName}</p>
                <p className="text-xs text-gray-500">{shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ''}</p>
                <p className="text-xs text-gray-500">{shipping.postcode} {shipping.city}, {shipping.state}</p>
                <p className="text-xs text-gray-500">{shipping.phone}</p>
              </div>
            )}

            {/* Authenticity seal */}
            <div className="absolute bottom-16 right-12 w-24 h-24 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="absolute inset-0 rounded-full shadow-lg"
                style={{ background: 'radial-gradient(circle at 30% 30%, #fde047 0%, #ca8a04 50%, #854d0e 100%)', border: '2px solid rgba(133, 77, 14, 0.3)' }}
              />
              <div className="relative text-center z-10">
                <p className="text-[7px] font-black text-yellow-900/80 leading-tight uppercase tracking-tighter">
                  Official<br />Authentic<br /><span className="text-[10px] text-yellow-900">GENUINE</span>
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 border-t border-gray-100 mt-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                Secured session expires in: <span className="text-gray-900 font-mono">{formatTime(timeLeft)}</span>
              </p>
            </div>

            <div className="pt-6 flex justify-between items-end">
              <div className="space-y-1">
                <div className="w-32 h-[1px] bg-gray-300" />
                <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest">Collector Signature</p>
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 opacity-10">Vault 6 Studios</h1>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <Link href="/" className="bg-gray-900 text-white py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all">
            Return to Gallery
          </Link>
          <div className="flex justify-center gap-8">
            <button onClick={downloadPDF} className="text-blue-600 font-black text-[10px] uppercase tracking-widest">
              Download PDF
            </button>
            <button onClick={() => window.print()} className="text-gray-400 font-black text-[10px] uppercase tracking-widest">
              Print
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
