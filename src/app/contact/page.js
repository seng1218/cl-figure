import { Suspense } from 'react';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us | Vault 6 Studios',
  description: 'Get in touch with Vault 6 Studios — Malaysia collectible figures. WhatsApp, email, or visit our Contact page for order enquiries, returns, and more.',
};

export default function ContactPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#050505] pt-32 pb-24 flex items-center justify-center">
        <p className="text-gray-500 font-black uppercase tracking-widest animate-pulse">Loading...</p>
      </main>
    }>
      <ContactClient />
    </Suspense>
  );
}
