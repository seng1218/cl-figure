const CMS_DEFAULTS = {
  announcement: { enabled: false, text: '', link: '', type: 'info' },
  hero: { tagline: 'Established 2023', ctaLabel: 'Enter Vault' },
  home: {
    syndicateHeading: 'JOIN THE SYNDICATE.',
    syndicateDescription: 'The highest-tier drops go fast. Submit your email to get early access to new drops before they go public.',
  },
  brands: ['FuRyu', 'Banpresto', 'Taito', 'Bear Panda', 'Alter', 'Animester'],
  contact: { whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '', email: '', address: '' },
  site: { name: 'Vault 6 Studios', tagline: 'by Crafted Legacies' },
  ethos: {
    heading: 'OUR ETHOS.',
    subheading: 'UNCOMPROMISING STANDARDS.',
    values: [
      { title: 'CURATION', desc: "Every piece is hand-selected. If it isn't S-tier, it doesn't enter the Vault." },
      { title: 'AUTHENTICITY', desc: 'Direct sourcing and multi-stage verification. Every authenticity grade disclosed — no exceptions.' },
      { title: 'INTEGRITY', desc: 'Accurate condition reporting. What you see in the Archive is what reaches your hands.' }
    ]
  }
};

export default CMS_DEFAULTS;
