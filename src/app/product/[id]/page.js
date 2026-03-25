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
import ProductCards from '@/components/ProductCards'; // importing to render related products properly

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [showToast, setShowToast] = useState(false);
  const [buttonState, setButtonState] = useState('idle'); // idle, loading, secured
  const [activeTab, setActiveTab] = useState('overview'); // overview, specs, authenticity

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 font-black uppercase tracking-widest">Item Not Found in Vault</p>
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
            
            <motion.div 
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
              className="aspect-[4/5] rounded-[3rem] bg-[#111] border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative cursor-pointer"
            >
              {/* Inner container to crop image correctly with 3D transform */}
              <motion.div className="w-full h-full rounded-[3rem] overflow-hidden absolute inset-0">
                <motion.img 
                  src={product.image} 
                  style={{ transform: "translateZ(30px) scale(1.05)" }}
                  className="w-full h-full object-cover origin-center" 
                  alt={product.name} 
                />
              </motion.div>
              
              <div 
                style={{ transform: "translateZ(80px)" }} 
                className="absolute top-8 left-8 bg-black/80 backdrop-blur-md text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl pointer-events-none"
              >
                Limited Edition
              </div>
            </motion.div>
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
                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${product.category === 'Ready Stock' ? 'text-green-500 border-green-900/50 bg-green-900/10' : 'text-orange-500 border-orange-900/50 bg-orange-900/10'}`}>
                  {product.category}
                </span>
              </div>
            </section>

            {/* Lore & Specifications Tabs */}
            <div className="mt-8">
              <div className="flex gap-8 border-b border-gray-800 mb-8 relative">
                {['overview', 'specs', 'authenticity'].map(tab => (
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
                      <div className="flex justify-between border-b border-gray-800 pb-3"><span className="text-gray-500 uppercase text-[9px] tracking-widest font-black">Scale</span><span className="text-white font-bold">1/7 scale pre-painted</span></div>
                      <div className="flex justify-between border-b border-gray-800 pb-3"><span className="text-gray-500 uppercase text-[9px] tracking-widest font-black">Material</span><span className="text-white font-bold">ABS, PVC, Polystone</span></div>
                      <div className="flex justify-between border-b border-gray-800 pb-3"><span className="text-gray-500 uppercase text-[9px] tracking-widest font-black">Dimensions</span><span className="text-white font-bold">Approx. 280mm height</span></div>
                    </motion.div>
                  )}
                  {activeTab === 'authenticity' && (
                    <motion.div key="authenticity" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-gray-500 font-medium leading-relaxed max-w-lg text-sm">
                      <p className="mb-4">Guaranteed 100% authentic directly from licensed manufacturers. Every item passing through our Vault undergoes rigorous verification by our expert team.</p>
                      <p>Included: Cryptographic Certificate of Authenticity (CCA) & Original untampered sealing.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Technical Specs Bento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111] p-6 rounded-3xl border border-gray-800 flex items-center gap-4 hover:border-blue-900 transition-colors duration-500">
                <div className="p-3 bg-blue-900/20 text-blue-500 rounded-2xl"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Warranty</p>
                  <p className="text-sm font-bold text-white">CL Lifetime</p>
                </div>
              </div>
              <div className="bg-[#111] p-6 rounded-3xl border border-gray-800 flex items-center gap-4 hover:border-blue-900 transition-colors duration-500">
                <div className="p-3 bg-gray-900 text-gray-400 rounded-2xl"><Zap size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Grade</p>
                  <p className="text-sm font-bold text-white">S-Tier Mint</p>
                </div>
              </div>
            </div>

            {/* Call to Action - Vault Securing */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={handleAddToCart}
                disabled={buttonState !== 'idle'}
                className={`flex-grow py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl overflow-hidden relative
                  ${buttonState === 'idle' ? 'bg-white text-black hover:bg-blue-600 hover:text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]' : ''}
                  ${buttonState === 'loading' ? 'bg-blue-600 text-white shadow-[0_0_50px_rgba(37,99,235,0.5)] scale-[0.98]' : ''}
                  ${buttonState === 'secured' ? 'bg-green-600 text-white shadow-[0_0_50px_rgba(34,197,94,0.4)] bg-opacity-90' : ''}
                `}
              >
                {/* The glowing sweeping effect behind loading */}
                {buttonState === 'loading' && (
                  <motion.div 
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-1/3 bg-white/20 skew-x-12 blur-md"
                  />
                )}
                
                <AnimatePresence mode="wait">
                  {buttonState === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                      <Plus size={18} /> Add to Collection
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

      {/* The Toast Component itself (fallback or subtle global confirmation) */}
      <Toast 
        message={`${product.name} Secured`} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </main>
  );
}