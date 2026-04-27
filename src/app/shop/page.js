import { Suspense } from 'react';
import ShopClient from './ShopClient';

export const metadata = {
  title: 'The Collection',
  description: 'Browse all figurines at Vault 6 Studios. S-Tier collectibles, verified authentic, curated for serious collectors.',
  openGraph: {
    title: 'The Collection | Vault 6 Studios',
    description: 'Browse all figurines at Vault 6 Studios.',
    type: 'website',
  },
};

export default function ShopPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#050505] pt-32 pb-24 flex items-center justify-center">
        <p className="text-gray-500 font-black uppercase tracking-widest animate-pulse">Loading Vault...</p>
      </main>
    }>
      <ShopClient />
    </Suspense>
  );
}
