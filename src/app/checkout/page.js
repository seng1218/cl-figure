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
  Truck
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { 
    cart, 
    cartTotal, 
    shippingFee, 
    grandTotal, 
    clearCart, 
    removeFromCart, 
    updateQuantity 
  } = useCart();

  // --- 1. STATE ---
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [cardName, setCardName] = useState(""); // RESTORED NAME STATE
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 Minutes
  
  const certificateRef = useRef(null);

  // --- 2. SHIPPING PROGRESS LOGIC ---
  const FREE_SHIPPING_THRESHOLD = 500; // Adjust this if needed
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFree = FREE_SHIPPING_THRESHOLD - cartTotal;

  // --- 3. EFFECTS (CONFETTI & TIMER) ---
  useEffect(() => {
    if (isSuccess) {
      const end = Date.now() + 3000;
      const colors = ['#2563eb', '#fbbf24', '#ffffff'];
      (function frame() {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());

      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSuccess]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- 4. CARD INPUT & OUTPUT LOGIC ---
  const isCardValid = cardNumber.replace(/\s/g, "").length === 16;

  const handleCardChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ").substring(0, 19);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    let formatted = val;
    if (val.length > 2) {
      formatted = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setExpiry(formatted.substring(0, 5));
  };

  const getCardType = () => {
    const firstDigit = cardNumber[0];
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    return 'Unknown';
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Requires name and 16-digit card
    if (!isCardValid || cardName.trim() === "") {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsSuccess(true);
      setIsProcessing(false);
      clearCart(); 
    }, 2000);
  };

  // --- 5. PDF DOWNLOAD LOGIC ---
  const downloadPDF = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`CL-Acquisition-Certificate.pdf`);
  };

  // --- 6. RENDER SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-center pt-20">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full">
          <div ref={certificateRef} className="bg-white border-[1px] border-gray-200 rounded-[3rem] shadow-2xl overflow-hidden relative">
            
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
                <div><p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Asset ID</p><p className="text-xs font-black text-gray-900">#CL-PROTO-{Math.random().toString(36).toUpperCase().substring(2, 6)}</p></div>
                <div><p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Clearance Date</p><p className="text-xs font-black text-gray-900">{new Date().toLocaleDateString('en-GB')}</p></div>
                <div><p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Vault Status</p><p className="text-xs font-black text-green-600 uppercase">Secured</p></div>
                <div><p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Total Value</p><p className="text-xs font-black text-gray-900">RM {grandTotal.toFixed(2)}</p></div>
              </div>

              <div className="space-y-3">
                <p className="text-[9px] uppercase font-black tracking-widest text-gray-400">Inventory Clearance</p>
                <p className="text-[10px] font-bold text-gray-500 italic">Transfer Successful - Items Dispatched</p>
              </div>

              {/* THE GOLD SEAL */}
              <div className="absolute bottom-16 right-12 w-24 h-24 flex items-center justify-center pointer-events-none">
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="absolute inset-0 rounded-full shadow-lg"
                  style={{ background: 'radial-gradient(circle at 30% 30%, #fde047 0%, #ca8a04 50%, #854d0e 100%)', border: '2px solid rgba(133, 77, 14, 0.3)' }}
                />
                <div className="relative text-center z-10">
                  <p className="text-[7px] font-black text-yellow-900/80 leading-tight uppercase tracking-tighter">Official<br/>Authentic<br/><span className="text-[10px] text-yellow-900">GENUINE</span></p>
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
                <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 opacity-10">CL FIGURE</h1>
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

  // --- 7. RENDER EMPTY SCREEN ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest">Your vault is empty</h1>
        <Link href="/" className="bg-white border border-gray-200 text-gray-900 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Browse Collection</Link>
      </div>
    );
  }

  // --- 8. MAIN CHECKOUT RENDER ---
  return (
    <main className="min-h-screen bg-[#fcfcfd] p-4 md:p-12 pt-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT SIDE: SUMMARY */}
        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-900">
            <ArrowLeft size={14} /> Back to Gallery
          </Link>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">CL FIGURE<span className="text-blue-600">.</span>SUMMARY</h1>
          
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 space-y-6">
            
            {/* PROGRESS BAR */}
            <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-blue-600"><Truck size={12}/> {progress >= 100 ? "Free Shipping Unlocked" : "Free Shipping Progress"}</div>
                <span className="text-gray-400">{progress >= 100 ? "Ready" : `RM ${remainingForFree.toFixed(2)} more`}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
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
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Vault Subtotal</span><span>RM {cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-400"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : `RM ${shippingFee.toFixed(2)}`}</span></div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-gray-900 font-black uppercase text-[10px]">Total Acquisition</span>
                <span className="text-4xl font-black text-gray-900 italic tracking-tighter">RM {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* RIGHT SIDE: PAYMENT */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-[3.5rem] p-10 text-white shadow-2xl h-fit">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-blue-600 rounded-3xl shadow-lg shadow-blue-500/20"><CreditCard size={24} /></div>
            <div><h2 className="text-2xl font-black tracking-tight">Vault Payment</h2><p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Encrypted Session</p></div>
          </div>

          <motion.form 
            className="space-y-6" 
            onSubmit={handlePayment}
            animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* RESTORED NAME INPUT */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-black text-gray-500 ml-4">Name on Card</label>
              <input 
                required 
                type="text" 
                placeholder="JOHN DOE" 
                value={cardName} 
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
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
              <input 
                required type="text" 
                placeholder="0000 0000 0000 0000" 
                value={cardNumber} 
                onChange={handleCardChange}
                className={`w-full bg-white/5 border p-5 rounded-[1.5rem] outline-none transition-all font-mono ${isCardValid ? "border-blue-500" : "border-white/10"}`} 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <input required type="text" placeholder="MM/YY" value={expiry} onChange={handleExpiryChange} className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] outline-none font-mono" />
              <input required type="password" placeholder="CVV" maxLength="3" className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] outline-none font-mono" />
            </div>

            <motion.button 
              type="submit"
              disabled={isProcessing} 
              className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] mt-6 flex items-center justify-center gap-3 transition-all ${isCardValid && cardName.trim() !== "" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-white/5 text-white/20"}`}
            >
              {isProcessing ? "Authorizing..." : <><Lock size={16} /> Pay RM {grandTotal.toFixed(2)}</>}
            </motion.button>
          </motion.form>
        </motion.section>

      </div>
    </main>
  );
}