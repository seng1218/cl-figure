import { Suspense } from 'react';
import ModelKitsClient from './ModelKitsClient';

export const metadata = {
  title: '3D Print Kits',
  description: 'Merchant-licensed 3D printed model kits from Vault 6 Studios. Pre-printed parts, shipped to you ready to assemble, paint, and display.',
  openGraph: {
    title: '3D Print Kits | Vault 6 Studios',
    description: 'Merchant-licensed 3D printed model kits. Pre-printed, ship to you, yours to build.',
    type: 'website',
  },
};

export default function ModelKitsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#050505] pt-32 pb-24 flex items-center justify-center">
        <p className="text-gray-500 font-black uppercase tracking-widest animate-pulse">Initializing Fabricator...</p>
      </main>
    }>
      <ModelKitsClient />
    </Suspense>
  );
}
