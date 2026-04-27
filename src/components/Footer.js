"use client";
import Link from 'next/link';
import { Network } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-900 bg-[#020202] py-8 text-center relative z-10 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-6">
          <Link href="/return-policy" className="text-gray-700 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Return Policy
          </Link>
        </div>
        <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Vault 6 Studios. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
