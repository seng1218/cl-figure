import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchBar({ setSearchTerm, setSelectedCategory }) {
  return (
    <section className="sticky top-28 z-40 px-6 -mt-10 mb-20">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="max-w-3xl mx-auto bg-[#111]/80 backdrop-blur-3xl border border-gray-800 p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2"
      >
        <div className="flex-grow relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search the archive..." 
            className="w-full pl-16 pr-6 py-5 rounded-full bg-transparent outline-none font-bold text-white placeholder:text-gray-600 focus:ring-0"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="hidden md:block bg-blue-600 text-white px-8 py-5 rounded-full font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer hover:bg-white hover:text-black transition-colors mr-1"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Tiers</option>
          <option value="Ready Stock">In Vault</option>
          <option value="Pre-order">Incoming</option>
        </select>
      </motion.div>
    </section>
  );
}