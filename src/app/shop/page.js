"use client";
import { useState, useEffect, useRef } from 'react';
import { allProducts } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import SearchBar from '@/components/SearchBar';
import ProductCards from '@/components/ProductCards';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';

export default function ShopArchive() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Custom Spotlight logic for consistency
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) setSearchTerm(q);
    }

    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAddToVault = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} Secured`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredProducts = allProducts.filter(item => {
    const term = searchTerm.toLowerCase();
    const searchFields = [item.name, item.manufacturer, item.series].filter(Boolean);
    const matchesSearch = searchFields.some(field => field.toLowerCase().includes(term));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aOut = a.stock <= 0 ? 1 : 0;
    const bOut = b.stock <= 0 ? 1 : 0;
    return aOut - bOut;
  });

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-x-hidden">
      
      {/* Provocative Dynamic Spotlight */}
      <div 
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[800px] h-[800px] pointer-events-none z-0 rounded-full mix-blend-screen opacity-30 transition-transform duration-75 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(0,0,0,0) 70%)' }}
      />
      
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-white italic tracking-tighter"
          >
            THE COLLECTION.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mt-6"
          >
            Full Catalog // Curated Collectibles
          </motion.p>
        </div>

        {/* Filtering Logic */}
        <SearchBar 
          setSearchTerm={setSearchTerm} 
          setSelectedCategory={setSelectedCategory} 
        />

        {/* The Grid */}
        <section className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 mt-12">
          {sortedProducts.map((item, index) => (
            <ProductCards
              key={item.id}
              item={item}
              index={index}
              onAdd={() => handleAddToVault(item)}
              alwaysColor={true}
            />
          ))}
          {sortedProducts.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-600 font-black uppercase tracking-widest">No figures match your search.</p>
            </div>
          )}
        </section>

      </div>

      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </main>
  );
}
