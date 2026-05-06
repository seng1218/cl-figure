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
  Tag,
} from 'lucide-react';

const MY_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka',
  'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
  'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
];

const inputCls = 'w-full bg-[#111] border border-gray-800 rounded-2xl px-4 py-3 text-sm font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors';

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
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

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
  const discountAmount = voucherApplied?.discount || 0;
  const discountedTotal = Math.max(0, cartTotal - discountAmount) + shippingFee;

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setVoucherLoading(true);
    setVoucherError('');
    setVoucherApplied(null);
    try {
      const res = await fetch('/api/voucher/validate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherInput.trim(), cartTotal }),
      });
      const data = await res.json();
      if (data.success) {
        setVoucherApplied({ code: data.code, discount: data.discount, description: data.description });
      } else {
        setVoucherError(data.error || 'Invalid voucher.');
      }
    } catch {
      setVoucherError('Failed to validate voucher.');
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    setOrderError('');
    try {
      const res = await fetch('/api/payment/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, shipping, voucherCode: voucherApplied?.code || null }),
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Vault Empty</span>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-8">Nothing Secured</h1>
        <p className="text-gray-500 text-sm mb-10">Add items to your vault before checking out.</p>
        <Link href="/" className="border border-gray-800 hover:border-blue-600 text-gray-400 hover:text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] p-4 md:p-12 pt-32 pb-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── LEFT: SHIPPING (step 1) or ORDER SUMMARY (step 2) ── */}
        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">

          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
            <ArrowLeft size={12} /> Back to Gallery
          </Link>

          <div>
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em]">
              {step === 1 ? 'Delivery' : 'Your Order'}
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none mt-2">
              {step === 1 ? 'SHIPPING' : 'SUMMARY'}<span className="text-blue-600">.</span>
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <span className={step >= 1 ? 'text-blue-600' : 'text-gray-700'}>1 · Shipping</span>
            <ChevronRight size={10} className="text-gray-700" />
            <span className={step >= 2 ? 'text-blue-600' : 'text-gray-700'}>2 · Payment</span>
          </div>

          {step === 1 ? (
            /* ── SHIPPING FORM ── */
            <div className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-8 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Delivery Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                    Full Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="As per ID"
                    value={shipping.fullName}
                    onChange={e => setShipping(s => ({ ...s, fullName: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                    Phone <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+60 12-345 6789"
                    value={shipping.phone}
                    onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                    Address Line 1 <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Unit / Street"
                    value={shipping.address1}
                    onChange={e => setShipping(s => ({ ...s, address1: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                    Address Line 2 <span className="text-gray-700">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Taman / Area"
                    value={shipping.address2}
                    onChange={e => setShipping(s => ({ ...s, address2: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                    Postcode <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="50000"
                    maxLength={5}
                    inputMode="numeric"
                    value={shipping.postcode}
                    onChange={e => setShipping(s => ({ ...s, postcode: e.target.value.replace(/\D/g, '') }))}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                    City <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Kuala Lumpur"
                    value={shipping.city}
                    onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                    State <span className="text-blue-600">*</span>
                  </label>
                  <select
                    value={shipping.state}
                    onChange={e => setShipping(s => ({ ...s, state: e.target.value }))}
                    className={`${inputCls} appearance-none`}
                  >
                    <option value="" className="bg-[#111]">Select state...</option>
                    {MY_STATES.map(st => <option key={st} value={st} className="bg-[#111]">{st}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!isShippingValid}
                className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] mt-4 flex items-center justify-center gap-3 transition-all ${
                  isShippingValid
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'
                    : 'bg-[#111] text-gray-700 border border-gray-800 cursor-not-allowed'
                }`}
              >
                Continue to Payment <ChevronRight size={14} />
              </button>
            </div>

          ) : (
            /* ── ORDER SUMMARY (step 2 left panel) ── */
            <div className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-8 space-y-6">

              {/* Free shipping progress */}
              <div className="bg-[#111] border border-gray-900 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Truck size={11} />
                    {progress >= 100 ? 'Free Shipping Unlocked' : 'Free Shipping Progress'}
                  </div>
                  <span className="text-gray-600">{progress >= 100 ? 'Ready' : `RM ${remainingForFree.toFixed(2)} more`}</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
                </div>
              </div>

              {/* Shipping address summary */}
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                    <MapPin size={10} /> Dispatching to
                  </p>
                  <button onClick={() => setStep(1)} className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-400 transition-colors">
                    Edit
                  </button>
                </div>
                <p className="text-xs font-black text-white">{shipping.fullName} · {shipping.phone}</p>
                <p className="text-xs text-gray-500">{shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ''}, {shipping.postcode} {shipping.city}, {shipping.state}</p>
              </div>

              {/* Cart items */}
              <AnimatePresence mode="popLayout">
                {cart.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-5 items-center bg-[#111] border border-gray-900 p-4 rounded-[1.5rem]"
                  >
                    <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-white text-sm leading-tight">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-700 hover:text-red-500 transition-colors ml-2 shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <div className="flex items-center gap-3 bg-[#0a0a0a] border border-gray-800 px-3 py-1.5 rounded-full">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-white transition-colors"><Minus size={10} /></button>
                          <span className="text-xs font-black text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-white transition-colors"><Plus size={10} /></button>
                        </div>
                        <span className="font-black text-white text-sm">RM {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Voucher */}
              <div className="pt-4 border-t border-gray-900">
                {voucherApplied ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3">
                    <div>
                      <span className="text-green-400 font-black text-[10px] uppercase tracking-widest">✓ {voucherApplied.code}</span>
                      {voucherApplied.description && <p className="text-green-500/70 text-[10px] mt-0.5">{voucherApplied.description}</p>}
                      <p className="text-green-400 text-xs font-black mt-0.5">−RM {voucherApplied.discount.toFixed(2)}</p>
                    </div>
                    <button onClick={() => { setVoucherApplied(null); setVoucherInput(''); }} className="text-gray-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
                      <Tag size={10} /> Voucher Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={e => { setVoucherInput(e.target.value.toUpperCase()); setVoucherError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
                        placeholder="ENTER CODE"
                        className="flex-1 bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-sm font-black text-white uppercase placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors tracking-widest"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        disabled={voucherLoading || !voucherInput.trim()}
                        className="bg-[#1a1a1a] border border-gray-800 hover:border-blue-600 hover:bg-blue-600/10 text-gray-400 hover:text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 transition-all"
                      >
                        {voucherLoading ? '···' : 'Apply'}
                      </button>
                    </div>
                    {voucherError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{voucherError}</p>}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="pt-6 border-t border-gray-900 space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-600">
                  <span>Subtotal</span><span>RM {cartTotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[10px] font-black uppercase text-green-500">
                    <span>Voucher ({voucherApplied.code})</span><span>−RM {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-600">
                  <span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `RM ${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-900">
                  <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Order Total</span>
                  <span className="text-4xl font-black text-white italic tracking-tighter">RM {discountedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* ── RIGHT: CART PREVIEW (step 1) or PAYMENT (step 2) ── */}
        {step === 1 ? (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-10 h-fit space-y-6">

            <div>
              <span className="text-gray-600 font-black text-[10px] uppercase tracking-[0.4em]">Securing</span>
              <h2 className="text-2xl font-black text-white tracking-tight italic mt-1">Order Preview</h2>
            </div>

            {/* Free shipping bar */}
            <div className="bg-[#111] border border-gray-900 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-blue-600">
                  <Truck size={11} />
                  {progress >= 100 ? 'Free Shipping Unlocked' : 'Free Shipping Progress'}
                </div>
                <span className="text-gray-600">{progress >= 100 ? 'Ready' : `RM ${remainingForFree.toFixed(2)} more`}</span>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-black text-white text-sm leading-tight truncate">{item.name}</p>
                    <p className="text-gray-600 text-[10px] font-bold uppercase mt-0.5">Qty {item.quantity}</p>
                  </div>
                  <span className="font-black text-white text-sm shrink-0">RM {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-gray-900 space-y-2.5">
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-600">
                <span>Subtotal</span><span>RM {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-600">
                <span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `RM ${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-900">
                <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Total</span>
                <span className="text-3xl font-black text-white italic tracking-tighter">RM {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </motion.section>

        ) : (
          /* ── PAYMENT PANEL ── */
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-10 h-fit space-y-8">

            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                <CreditCard size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight italic">PAYMENT</h2>
                <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">Secure Checkout via Razorpay Curlec</p>
              </div>
            </div>

            {/* Payment method pills — informational, Razorpay Curlec shows all on their page */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'card', label: 'Card' },
                { id: 'fpx', label: 'FPX' },
                { id: 'tng', label: 'TnG' },
                { id: 'grabpay', label: 'Grab' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                    paymentMethod === method.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                      : 'bg-[#111] text-gray-500 border-gray-800 hover:border-gray-700 hover:text-gray-300'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>

            {orderError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <p className="text-red-400 text-[10px] font-black uppercase tracking-wider">{orderError}</p>
              </div>
            )}

            {/* Redirect notice */}
            <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 text-center space-y-3">
              <ShieldCheck size={28} className="text-blue-600 mx-auto opacity-80" />
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                You will be redirected to{' '}
                <span className="text-white font-black">Razorpay Curlec</span>{' '}
                to complete your payment of{' '}
                <span className="text-white font-black">RM {discountedTotal.toFixed(2)}</span>{' '}
                securely.
              </p>
              <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest pt-1">
                Cards · FPX · Touch &apos;n Go · GrabPay · and more
              </p>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={isProcessing}
              className="w-full py-6 rounded-[2rem] bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing
                ? 'Redirecting to Razorpay Curlec...'
                : <><Lock size={15} /> Pay RM {discountedTotal.toFixed(2)}</>
              }
            </button>

            <p className="text-center text-gray-700 text-[9px] font-black uppercase tracking-widest">
              256-bit SSL · PCI DSS compliant · Powered by Razorpay Curlec
            </p>

          </motion.section>
        )}
      </div>
    </main>
  );
}
