"use client";
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  Trash2,
  Minus,
  Plus,
  Truck,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MY_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka',
  'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
  'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
];

export default function CheckoutPage() {
  const {
    cart,
    cartTotal,
    shippingFee,
    grandTotal,
    clearCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  // --- STATE ---
  const [step, setStep] = useState(1); // 1: shipping, 2: payment
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderedItems, setOrderedItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [shipping, setShipping] = useState({
    fullName: '', phone: '', address1: '', address2: '', city: '', postcode: '', state: '',
  });

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  const certificateRef = useRef(null);

  const isShippingValid = Boolean(
    shipping.fullName.trim() &&
    shipping.phone.trim() &&
    shipping.address1.trim() &&
    shipping.city.trim() &&
    shipping.postcode.trim() &&
    shipping.state
  );

  const FREE_SHIPPING_THRESHOLD = 200;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFree = FREE_SHIPPING_THRESHOLD - cartTotal;

  useEffect(() => {
    if (isSuccess) {
      const end = Date.now() + 3000;
      const colors = ['#2563eb', '#fbbf24', '#ffffff'];
      import('canvas-confetti').then(({ default: confetti }) => {
        (function frame() {
          confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors });
          confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        }());
      });
      const timer = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [isSuccess]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const isCardValid = cardNumber.replace(/\s/g, '').length === 16;

  const handleCardChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setCardNumber(val.replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19));
  };

  const handleExpiryChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setExpiry(val.length > 2 ? `${val.substring(0, 2)}/${val.substring(2, 4)}` : val);
  };

  const getCardType = () => {
    const d = cardNumber[0];
    if (d === '4') return 'Visa';
    if (d === '5') return 'Mastercard';
    return 'Unknown';
  };

  const placeOrder = async () => {
    setOrderError('');
    const res = await fetch('/api/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, shipping, cartTotal, shippingFee, grandTotal, paymentMethod }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Order failed.');
    return data.orderId;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isCardValid || cardName.trim() === '') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    setIsProcessing(true);
    try {
      const id = await placeOrder();
      setOrderId(id);
      setOrderedItems([...cart]);
      clearCart();
      setIsSuccess(true);
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRedirectPayment = async () => {
    setIsProcessing(true);
    setOrderError('');
    try {
      const id = await placeOrder();
      setOrderId(id);
      setOrderedItems([...cart]);
      clearCart();
      setIsSuccess(true);
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(certificateRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, (canvas.height * w) / canvas.width);
    pdf.save('Vault6-Acquisition-Certificate.pdf');
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-center pt-20">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full">
          <div ref={certificateRef} className="bg-white border border-gray-200 rounded-[3rem] shadow-2xl overflow-hidden relative">
            <div className="h-32 bg-gray-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl z-10"><ShieldCheck size={40} className="text-white" /></div>
            </div>
            <div className="p-10 pt-12 space-y-8 text-left relative">
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Official Protocol Verified</p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Certificate of Acquisition</h2>
              </div>
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-dashed border-gray-200 font-mono">
                <div><p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Asset ID</p><p className="text-xs font-black text-gray-900">{orderId}</p></div>
                <div><p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Clearance Date</p><p className="text-xs font-black text-gray-900">{new Date().toLocaleDateString('en-GB')}</p></div>
                <div><p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Vault Status</p><p className="text-xs font-black text-green-600 uppercase">Secured</p></div>
                <div><p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Total Value</p><p className="text-xs font-black text-gray-900">RM {grandTotal.toFixed(2)}</p></div>
              </div>
              {orderedItems.length > 0 && (
                <div className="py-5 border-b border-dashed border-gray-200 space-y-3">
                  <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-3">Acquired Assets</p>
                  {orderedItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 truncate">{item.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Qty {item.quantity} · RM {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-black tracking-widest text-gray-400">Dispatch To</p>
                <p className="text-xs font-bold text-gray-700">{shipping.fullName}</p>
                <p className="text-xs text-gray-500">{shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ''}</p>
                <p className="text-xs text-gray-500">{shipping.postcode} {shipping.city}, {shipping.state}</p>
                <p className="text-xs text-gray-500">{shipping.phone}</p>
              </div>
              <div className="absolute bottom-16 right-12 w-24 h-24 flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  className="absolute inset-0 rounded-full shadow-lg"
                  style={{ background: 'radial-gradient(circle at 30% 30%, #fde047 0%, #ca8a04 50%, #854d0e 100%)', border: '2px solid rgba(133, 77, 14, 0.3)' }}
                />
                <div className="relative text-center z-10">
                  <p className="text-[7px] font-black text-yellow-900/80 leading-tight uppercase tracking-tighter">Official<br />Authentic<br /><span className="text-[10px] text-yellow-900">GENUINE</span></p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-center gap-2 border-t border-gray-100 mt-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Secured session expires in: <span className="text-gray-900 font-mono">{formatTime(timeLeft)}</span>
                </p>
              </div>
              <div className="pt-6 flex justify-between items-end">
                <div className="space-y-1"><div className="w-32 h-[1px] bg-gray-300" /><p className="text-[8px] uppercase font-black text-gray-400 tracking-widest">Collector Signature</p></div>
                <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 opacity-10">Vault 6 Studios</h1>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-4">
            <Link href="/" className="bg-gray-900 text-white py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all">Return to Gallery</Link>
            <div className="flex justify-center gap-8">
              <button onClick={downloadPDF} className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Download PDF</button>
              <button onClick={() => window.print()} className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Print</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- EMPTY CART ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest">Your vault is empty</h1>
        <Link href="/" className="bg-white border border-gray-200 text-gray-900 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Browse Collection</Link>
      </div>
    );
  }

  // --- MAIN CHECKOUT ---
  return (
    <main className="min-h-screen bg-[#fcfcfd] p-4 md:p-12 pt-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* LEFT: SHIPPING (step 1) or SUMMARY (step 2) */}
        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-900">
            <ArrowLeft size={14} /> Back to Gallery
          </Link>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Vault 6 Studios<span className="text-blue-600">.</span>{step === 1 ? 'SHIPPING' : 'SUMMARY'}</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <span className={step === 1 ? 'text-blue-600' : 'text-gray-400'}>1. Shipping</span>
            <ChevronRight size={12} className="text-gray-300" />
            <span className={step === 2 ? 'text-blue-600' : 'text-gray-400'}>2. Payment</span>
          </div>

          {step === 1 ? (
            /* SHIPPING ADDRESS FORM */
            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Delivery Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="As per ID"
                    value={shipping.fullName}
                    onChange={e => setShipping(s => ({ ...s, fullName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Phone <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="+60 12-345 6789"
                    value={shipping.phone}
                    onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Address Line 1 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Unit / Street"
                    value={shipping.address1}
                    onChange={e => setShipping(s => ({ ...s, address1: e.target.value }))}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Address Line 2 <span className="text-gray-300">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="Taman / Area"
                    value={shipping.address2}
                    onChange={e => setShipping(s => ({ ...s, address2: e.target.value }))}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Postcode <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="50000"
                    maxLength={5}
                    inputMode="numeric"
                    value={shipping.postcode}
                    onChange={e => setShipping(s => ({ ...s, postcode: e.target.value.replace(/\D/g, '') }))}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Kuala Lumpur"
                    value={shipping.city}
                    onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">State <span className="text-red-500">*</span></label>
                  <select
                    value={shipping.state}
                    onChange={e => setShipping(s => ({ ...s, state: e.target.value }))}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="">Select state...</option>
                    {MY_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!isShippingValid}
                className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] mt-4 flex items-center justify-center gap-3 transition-all ${isShippingValid ? 'bg-gray-900 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                Continue to Payment <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            /* ORDER SUMMARY */
            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 space-y-6">
              {/* Shipping progress */}
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-blue-600"><Truck size={12} /> {progress >= 100 ? 'Free Shipping Unlocked' : 'Free Shipping Progress'}</div>
                  <span className="text-gray-400">{progress >= 100 ? 'Ready' : `RM ${remainingForFree.toFixed(2)} more`}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
                </div>
              </div>

              {/* Shipping address summary */}
              <div className="bg-blue-50 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2"><MapPin size={10} /> Dispatching to</p>
                  <button onClick={() => setStep(1)} className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Edit</button>
                </div>
                <p className="text-xs font-black text-gray-900">{shipping.fullName} · {shipping.phone}</p>
                <p className="text-xs text-gray-500">{shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ''}, {shipping.postcode} {shipping.city}, {shipping.state}</p>
              </div>

              <AnimatePresence mode="popLayout">
                {cart.map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-6 items-center bg-gray-50/50 p-4 rounded-[2rem]">
                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-black text-gray-900 text-sm">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full border border-gray-100">
                          <button onClick={() => updateQuantity(item.id, -1)}><Minus size={10} /></button>
                          <span className="text-xs font-black text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}><Plus size={10} /></button>
                        </div>
                        <span className="font-black text-gray-900 text-sm">RM {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="pt-6 mt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Subtotal</span><span>RM {cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `RM ${shippingFee.toFixed(2)}`}</span></div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-gray-900 font-black uppercase text-[10px]">Order Total</span>
                  <span className="text-4xl font-black text-gray-900 italic tracking-tighter">RM {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* RIGHT: CART SUMMARY (step 1) or PAYMENT (step 2) */}
        {step === 1 ? (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm h-fit space-y-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-blue-600"><Truck size={12} /> {progress >= 100 ? 'Free Shipping Unlocked' : 'Free Shipping Progress'}</div>
                <span className="text-gray-400">{progress >= 100 ? 'Ready' : `RM ${remainingForFree.toFixed(2)} more`}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
              </div>
            </div>
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-grow">
                  <p className="font-black text-gray-900 text-sm leading-tight">{item.name}</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Qty {item.quantity}</p>
                </div>
                <span className="font-black text-gray-900 text-sm shrink-0">RM {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Subtotal</span><span>RM {cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `RM ${shippingFee.toFixed(2)}`}</span></div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-gray-900 font-black uppercase text-[10px]">Total</span>
                <span className="text-3xl font-black text-gray-900 italic tracking-tighter">RM {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-[3.5rem] p-10 text-white shadow-2xl h-fit">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-600 rounded-3xl shadow-lg shadow-blue-500/20"><CreditCard size={24} /></div>
                <div><h2 className="text-2xl font-black tracking-tight">Payment</h2><p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout</p></div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Card' },
                  { id: 'fpx', label: 'FPX' },
                  { id: 'tng', label: "TnG" },
                  { id: 'grabpay', label: 'Grab' },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${paymentMethod === method.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {orderError && (
              <div className="mb-6 bg-red-900/20 border border-red-900/40 rounded-2xl p-4">
                <p className="text-red-400 text-[10px] font-black uppercase tracking-wider">{orderError}</p>
              </div>
            )}

            {paymentMethod === 'card' ? (
              <motion.form
                className="space-y-6"
                onSubmit={handlePayment}
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-gray-500 ml-4">Name on Card</label>
                  <input
                    required
                    type="text"
                    placeholder="JOHN DOE"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    autoComplete="cc-name"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-[1.5rem] outline-none font-mono uppercase transition-all focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2 relative">
                  <div className="flex justify-between items-center ml-4 mr-4">
                    <label className="text-[9px] uppercase font-black text-gray-500">Card Number</label>
                    {getCardType() !== 'Unknown' && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{getCardType()}</span>
                    )}
                  </div>
                  <input required type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardChange} autoComplete="cc-number" inputMode="numeric" className={`w-full bg-white/5 border p-5 rounded-[1.5rem] outline-none transition-all font-mono ${isCardValid ? 'border-blue-500' : 'border-white/10'}`} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <input required type="text" placeholder="MM/YY" value={expiry} onChange={handleExpiryChange} autoComplete="cc-exp" inputMode="numeric" className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] outline-none font-mono" />
                  <input required type="password" placeholder="CVV" maxLength="3" autoComplete="cc-csc" inputMode="numeric" className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] outline-none font-mono" />
                </div>
                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] mt-6 flex items-center justify-center gap-3 transition-all ${isCardValid && cardName.trim() !== '' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-white/20'}`}
                >
                  {isProcessing ? 'Authorizing...' : <><Lock size={16} /> Pay RM {grandTotal.toFixed(2)}</>}
                </motion.button>
              </motion.form>
            ) : (
              <div className="space-y-8 text-center py-6">
                <div className="space-y-3">
                  <p className="text-4xl font-black text-white">
                    {paymentMethod === 'fpx' && 'FPX Online Banking'}
                    {paymentMethod === 'tng' && "Touch 'n Go eWallet"}
                    {paymentMethod === 'grabpay' && 'GrabPay'}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                    You will be redirected to{' '}
                    {paymentMethod === 'fpx' && "your bank's secure portal"}
                    {paymentMethod === 'tng' && "Touch 'n Go eWallet"}
                    {paymentMethod === 'grabpay' && 'GrabPay'}
                    {' '}to complete your payment of <span className="text-white font-black">RM {grandTotal.toFixed(2)}</span> securely.
                  </p>
                </div>
                <button
                  onClick={handleRedirectPayment}
                  disabled={isProcessing}
                  className="w-full py-6 rounded-[2rem] bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30"
                >
                  {isProcessing ? 'Redirecting...' : <><Lock size={16} /> Confirm &amp; Pay RM {grandTotal.toFixed(2)}</>}
                </button>
              </div>
            )}
          </motion.section>
        )}
      </div>
    </main>
  );
}
