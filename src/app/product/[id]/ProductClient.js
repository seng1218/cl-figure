"use client";
import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { allProducts } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Toast from '@/components/Toast';
import {
  Plus,
  ShieldCheck,
  Zap,
  Package,
  Info,
  ChevronRight,
  ArrowRight,
  Loader2,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import ProductCards from '@/components/ProductCards';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [showToast, setShowToast] = useState(false);
  const [buttonState, setButtonState] = useState('idle'); // idle, loading, secured
  const [activeTab, setActiveTab] = useState('overview'); // overview, specs
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const product = allProducts.find((p) => p.id.toString() === id);

  const relatedProducts = (allProducts || [])
    .filter((p) =>
      String(p.id) !== String(id) &&
      (p.series === product?.series || p.category === product?.category)
    )
    .slice(0, 3);

  // Vault Securing animation
  const handleAddToCart = () => {
    if (product && buttonState === 'idle') {
      setButtonState('loading');
      setTimeout(() => {
        addToCart(product);
        setButtonState('secured');
        setShowToast(true);

        setTimeout(() => {
          setButtonState('idle');
          setShowToast(false);
        }, 3000);
      }, 1500); // 1.5s encrypting data simulation
    }
  };

  // 3D Tilt Logic
  const imageRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movements
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Map mouse position to rotation angle (max 15 degrees)
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Percentage from center: -0.5 to 0.5
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const renderCTA = () => (
    <button
      onClick={handleAddToCart}
      disabled={buttonState !== 'idle' || product.stock <= 0}
      className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl overflow-hidden relative
        ${buttonState === 'idle' && product.stock > 0 ? 'bg-white text-black hover:bg-blue-600 hover:text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]' : ''}
        ${buttonState === 'idle' && product.stock <= 0 ? 'bg-red-900/40 text-red-500 border border-red-900/50 cursor-not-allowed' : ''}
        ${buttonState === 'loading' ? 'bg-blue-600 text-white shadow-[0_0_50px_rgba(37,99,235,0.5)] scale-[0.98]' : ''}
        ${buttonState === 'secured' ? 'bg-green-600 text-white shadow-[0_0_50px_rgba(34,197,94,0.4)] bg-opacity-90' : ''}
      `}
    >
      {buttonState === 'loading' && (
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-1/3 bg-white/20 skew-x-12 blur-md"
        />
      )}
      <AnimatePresence mode="wait">
        {buttonState === 'idle' && product.stock > 0 && (
          <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
            <Plus size={18} /> Add to Collection
          </motion.div>
        )}
        {buttonState === 'idle' && product.stock <= 0 && (
          <motion.div key="soldout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
            SOLD OUT
          </motion.div>
        )}
        {buttonState === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 z-10 relative">
            <Loader2 size={18} className="animate-spin" /> Encrypting...
          </motion.div>
        )}
        {buttonState === 'secured' && (
          <motion.div key="secured" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-3">
            <Lock size={18} /> Secured in Vault
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 text-center px-6">
        <p className="text-gray-400 font-black uppercase tracking-widest">Item Not Found in Vault</p>
        <div className="flex gap-8">
          <Link href="/shop" className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Browse Collection</Link>
          <Link href="/" className="text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Return to Vault</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
        >
          <Link href="/" className="hover:text-white transition-colors">Vault</Link>
          <ChevronRight size={12} />
          <span className="text-blue-600">{product.series}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT: Cinematic Gallery with 3D Tilt & Aura */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-32 relative"
          >
            {/* Dynamic Ambient Aura */}
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full scale-110 -z-10 animate-pulse" />

            {(() => {
              const images = product.images?.length ? product.images : [product.image];
              return (
                <>
                  <motion.div
                    ref={imageRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                    className="aspect-[4/5] rounded-[3rem] bg-[#111] border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative cursor-pointer"
                  >
                    <motion.div 
                      className="w-full h-full rounded-[3rem] overflow-hidden absolute inset-0"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <motion.img
                        key={selectedIdx}
                        src={images[selectedIdx]}
                        style={{ transform: "translateZ(30px) scale(1.05)" }}
                        className="w-full h-full object-cover origin-center cursor-zoom-in"
                        alt={product.name}
                      />
                    </motion.div>

                    <div
                      style={{ transform: "translateZ(80px)" }}
                      className="absolute top-8 left-8 bg-black/80 backdrop-blur-md text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl pointer-events-none"
                    >
                      Curated
                    </div>
                  </motion.div>

                  {images.length > 1 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                      {images.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedIdx(i)}
                          className={`shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${i === selectedIdx ? 'border-blue-500 opacity-100' : 'border-gray-800 opacity-50 hover:opacity-80'}`}
                        >
                          <img src={src} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>

          {/* RIGHT: Product Intel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-10"
          >
            <section>
              <h1 className="text-6xl font-black text-white tracking-tighter mb-4 italic">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <span className="text-4xl font-black text-blue-600 italic">RM {product.price.toFixed(2)}</span>
                <span className="h-6 w-[1px] bg-gray-800" />
                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${product.stock <= 0 ? 'text-red-500 border-red-900/50 bg-red-900/10' : (product.category === 'Ready Stock' ? 'text-green-500 border-green-900/50 bg-green-900/10' : 'text-orange-500 border-orange-900/50 bg-orange-900/10')}`}>
                  {product.stock <= 0 ? 'Out of Stock' : product.category}
                </span>
                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${product.stock > 0 ? 'text-gray-400 border-gray-800 bg-gray-900/50' : 'text-red-500 border-red-900/50 bg-red-900/10'}`}>
                  {product.stock > 0 ? `${product.stock} IN STOCK` : 'NO STOCK'}
                </span>
              </div>
            </section>

            {/* Lore & Specifications Tabs */}
            <div className="mt-8">
              <div className="flex gap-8 border-b border-gray-800 mb-8 relative">
                {['overview', 'specs'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors relative z-10 
                      ${activeTab === tab ? 'text-blue-600' : 'text-gray-600 hover:text-white'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 z-20" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[140px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-gray-500 font-medium leading-relaxed text-lg max-w-lg">
                      {product.description || "A meticulously crafted centerpiece for any professional collection. Forged with unparalleled precision and authenticated by the Vault to ensure the highest tier of collectible quality."}
                    </motion.div>
                  )}
                  {activeTab === 'specs' && (
                    <motion.div key="specs" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-4 text-sm font-medium text-gray-400 max-w-md">
                      <div className="flex justify-between border-b border-gray-800 pb-3"><span className="text-gray-500 uppercase text-[9px] tracking-widest font-black">Scale</span><span className="text-white font-bold">{product.scale || '1/7'}</span></div>
                      <div className="flex justify-between border-b border-gray-800 pb-3"><span className="text-gray-500 uppercase text-[9px] tracking-widest font-black">Specifications</span><span className="text-white font-bold text-right ml-4">{product.productSpecs || 'ABS, PVC'}</span></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Authenticity Registry */}
            <div className="bg-[#111] rounded-3xl border border-gray-800 p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 p-4 text-blue-600/5 group-hover:text-blue-600/10 transition-colors duration-500 pointer-events-none">
                <ShieldCheck size={180} />
              </div>

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.3em]">Authentication Details</h3>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-gray-800/80 pb-3">
                  <span className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-500">Origin Status</span>
                  <span className="text-[10px] md:text-xs font-black text-green-500 bg-green-900/20 px-3 py-1 rounded-full border border-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    {product.authenticity || 'Verified Authentic'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-800/80 pb-3 gap-2">
                  <span className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-500">Manufacturer</span>
                  <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest truncate">
                    {product.manufacturer || 'Authorized Maker'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-800/80 pb-3 gap-2">
                  <span className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-500">Dispatch Condition</span>
                  <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest text-right ml-4">{product.dispatchCondition || '10/10 MISB (Mint in Sealed Box)'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-500">Seal Integrity</span>
                  <span className="text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 justify-end ml-4">
                    <Lock size={12} /> {product.sealIntegrity || 'Intact / Untampered'}
                  </span>
                </div>
              </div>
            </div>

            {/* Call to Action - Vault Securing */}
            <div className="hidden md:flex flex-col sm:flex-row gap-4 pt-6">
              <div className="flex-grow">
                {renderCTA()}
              </div>

              <button className="px-8 py-6 rounded-3xl border border-gray-800 hover:bg-[#111] hover:border-gray-700 transition-all text-gray-500 hover:text-white group">
                <Info size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Authenticity Footer */}
            <div className="pt-10 border-t border-gray-800 flex items-center gap-6 opacity-40">
              <div className="flex items-center gap-2">
                <Package size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Original Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Authentic</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Artifacts Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-40 pt-20 border-t border-gray-800">
            <h2 className="text-3xl font-black text-white tracking-tighter italic mb-12">More from the <span className="text-blue-600">Vault.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedProducts.map((item, index) => (
                <ProductCards
                  key={item.id}
                  item={item}
                  index={index}
                  onAdd={() => {
                    addToCart(item);
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#050505]/95 backdrop-blur-xl border-t border-gray-800 z-50">
        {renderCTA()}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={product.images?.length ? product.images[selectedIdx] : product.image}
              className="max-w-full max-h-full object-contain rounded-2xl"
              alt={product.name}
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white bg-black/50 hover:bg-white hover:text-black rounded-full p-4 transition-colors font-black uppercase tracking-widest text-[10px]"
            >
              Close [X]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Toast Component itself (fallback or subtle global confirmation) */}
      <Toast
        message={`${product.name} Secured`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </main>
  );
}