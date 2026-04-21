"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const CMS_DEFAULTS = {
  announcement: { enabled: false, text: '', link: '', type: 'info' },
  hero: { tagline: 'Established 2023', ctaLabel: 'Enter Vault' },
  home: {
    syndicateHeading: 'JOIN THE SYNDICATE.',
    syndicateDescription: 'The highest-tier drops go fast. Submit your email to get early access to new drops before they go public.',
  },
  brands: ['FuRyu', 'Banpresto', 'Taito', 'Bear Panda', 'Alter', 'Animester'],
  ethos: [
    { title: '100% Verified', description: 'No bootlegs. No recasts. Every item is verified against manufacturer records before entering our catalog.' },
    { title: 'Secure Transport', description: 'Figures are packed in impact-resistant casing before dispatch. While we cannot control external couriers, we remain reachable if an item is damaged in transit.' },
    { title: 'Order Tracking', description: 'Your order history is digitized. Track your purchases and collection seamlessly within your dashboard.' },
  ],
  contact: { whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '' },
  site: { name: 'Vault 6 Studios', tagline: 'by Crafted Legacies' },
};

const CMSContext = createContext(CMS_DEFAULTS);

export function CMSProvider({ children }) {
  const [cms, setCms] = useState(CMS_DEFAULTS);

  useEffect(() => {
    fetch('/api/cms/', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setCms({ ...CMS_DEFAULTS, ...data }))
      .catch(() => {});
  }, []);

  return <CMSContext.Provider value={cms}>{children}</CMSContext.Provider>;
}

export const useCMS = () => useContext(CMSContext);
