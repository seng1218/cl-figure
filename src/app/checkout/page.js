"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Trash2,
  Minus,
  Plus,
  Truck,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

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
    removeFromCart,
    updateQuantity,
  } = useCart();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [shipping, setShipping] = useState({
    fullName: '', phone: '', address1: '', address2: '', city: '', postcode: '', state: '',
  });

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

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    setOrderError('');
    try {
      const res = await fetch('/api/payment/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, shipping }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Payment initiation failed.');

      // Persist display data for success page — survives external redirect
      try {
        sessionStorage.setItem('v6_shipping', JSON.stringify(shipping));
        sessionStorage.setItem('v6_total', grandTotal.toFixed(2));
        sessionStorage.setItem('v6_items', JSON.stringify(
          cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, image: i.image }))
        ));
      } catch {
        // sessionStorage may be unavailable (private mode) — non-fatal
      }

      window.location.href = data.url;
    } catch (err) {
      setOrderError(err.message);
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest">Your vault is empty</h1>
        <Link href="/" className="bg-white border border-gray-200 text-gray-900 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfd] p-4 md:p-12 pt-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* LEFT: SHIPPING (step 1) or SUMMARY (step 2) */}
        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-900">
            <ArrowLeft size={14} /> Back to Gallery
          </Link>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">
            Vault 6 Studios<span className="text-blue-600">.</span>{step === 1 ? 'SHIPPING' : 'SUMMARY'}
          </h1>

          {/* Step indicator */}
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <span className={step === 1 ? 'text-blue-600' : 'text-gray-400'}>1. Shipping</span>
            <ChevronRight size={12} className="text-gray-300" />
            <span className={step === 2 ? 'text-blue-600' : 'text-gray-400'}>2. Payment</span>
          </div>

          {step === 1 ? (
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
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Payment</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout via HitPay</p>
                </div>
              </div>

              {/* Payment method selector — informational, HitPay shows all on their page */}
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

            <div className="space-y-6">
              <div className="bg-white/5 rounded-3xl p-6 text-center space-y-3">
                <div className="flex justify-center mb-3">
                  <ShieldCheck size={32} className="text-blue-500 opacity-80" />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  You will be redirected to <span className="text-white font-black">HitPay</span> to complete your payment of{' '}
                  <span className="text-white font-black">RM {grandTotal.toFixed(2)}</span> securely.
                </p>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest pt-1">
                  Cards · FPX · Touch &apos;n Go · GrabPay · and more
                </p>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="w-full py-6 rounded-[2rem] bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? 'Redirecting to HitPay...'
                  : <><Lock size={16} /> Pay RM {grandTotal.toFixed(2)}</>
                }
              </button>

              <p className="text-center text-gray-700 text-[9px] font-black uppercase tracking-widest">
                256-bit SSL · PCI DSS compliant · Powered by HitPay
              </p>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
