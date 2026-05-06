"use client";
import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';

export default function Footer() {
  const { contact } = useCMS();
  const whatsapp = contact?.whatsapp;
  const email = contact?.email;
  const address = contact?.address;
  const hasContact = whatsapp || email || address;

  return (
    <footer className="border-t border-gray-900 bg-[#020202] py-8 text-center relative z-10 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-4">

        <div className="flex items-center flex-wrap justify-center gap-6">
          <Link href="/about" className="text-gray-700 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Contact Us
          </Link>
          <Link href="/privacy-policy" className="text-gray-700 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-700 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Terms &amp; Conditions
          </Link>
          <Link href="/payment-policy" className="text-gray-700 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Payment Policy
          </Link>
          <Link href="/shipping" className="text-gray-700 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Shipping
          </Link>
          <Link href="/return-policy" className="text-gray-700 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Return Policy
          </Link>
        </div>

        {hasContact && (
          <div className="flex items-center flex-wrap justify-center gap-4 text-gray-700 text-[9px] font-bold uppercase tracking-[0.2em]">
            {email && (
              <a href={`mailto:${email}`} className="hover:text-gray-400 transition-colors">{email}</a>
            )}
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
                WA {whatsapp}
              </a>
            )}
            {address && (
              <span>{address}</span>
            )}
          </div>
        )}

        <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Vault 6 Studios. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
