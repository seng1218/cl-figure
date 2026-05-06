import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

export const metadata = {
  title: 'About Us | Vault 6 Studios',
  description: 'Vault 6 Studios — Malaysia-based private seller of authenticated Japanese collectible figures. Established 2023.',
};

const Section = ({ title, children }) => (
  <div className="border-b border-gray-900 pb-10 mb-10">
    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 text-sm leading-relaxed">{children}</div>
  </div>
);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors mb-12"
        >
          <ArrowLeft size={12} /> Back to Vault
        </Link>

        <div className="mb-16">
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] flex items-center gap-3 mb-4">
            <Star size={14} /> Company Profile
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none mb-4">
            ABOUT US
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Vault 6 Studios &nbsp;·&nbsp; Established 2023 &nbsp;·&nbsp; Malaysia
          </p>
        </div>

        <div className="prose-invert">

          <Section title="Who We Are">
            <p>
              <strong className="text-white">Vault 6 Studios</strong> is a Malaysia-based private seller of Japanese collectible figures and related merchandise, operating under the brand <strong className="text-white">Crafted Legacies</strong>. We were established in 2023 with a focus on making premium anime and pop-culture collectibles accessible to Malaysian collectors through a transparent, trust-first approach.
            </p>
            <p>
              We operate exclusively within Malaysia and conduct all transactions through our online storefront at <strong className="text-white">vault6studios.com</strong>. Payments are processed securely via <strong className="text-white">Razorpay Curlec</strong> (Curlec Sdn. Bhd.), a Bank Negara Malaysia-licensed payment service provider.
            </p>
            <p className="text-gray-500 text-xs border border-gray-800 p-4 rounded-lg">
              <strong className="text-white">Business Type:</strong> Private individual seller &nbsp;·&nbsp; <strong className="text-white">Country of Operation:</strong> Malaysia &nbsp;·&nbsp; <strong className="text-white">Industry:</strong> Collectibles &amp; Merchandise Retail &nbsp;·&nbsp; <strong className="text-white">Established:</strong> 2023
            </p>
          </Section>

          <Section title="What We Sell">
            <p>
              We specialise in <strong className="text-white">authenticated, condition-graded second-hand and new Japanese collectible figures</strong> from licensed manufacturers, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-500 columns-2">
              <li className="text-gray-400">Taito Corporation</li>
              <li className="text-gray-400">FuRyu Corporation</li>
              <li className="text-gray-400">Banpresto Co. Ltd.</li>
              <li className="text-gray-400">Kotobukiya Co. Ltd.</li>
              <li className="text-gray-400">Alter Co. Ltd.</li>
              <li className="text-gray-400">Good Smile Company</li>
              <li className="text-gray-400">Animester</li>
              <li className="text-gray-400">Bear Panda</li>
            </ul>
            <p>
              Our inventory includes figures from popular anime, game, and manga franchises, covering prize figures, scale figures, non-scale figures, and licensed merchandise. Each item is individually graded and listed with our proprietary <strong className="text-white">10-point Dispatch Condition System</strong> before being made available on the storefront.
            </p>
            <p className="text-gray-500 text-xs">
              Vault 6 Studios is not an authorised distributor of any of the manufacturers listed above. All character intellectual property belongs to the respective rights holders. Product names are used for descriptive identification purposes only.
            </p>
          </Section>

          <Section title="Our Grading Standards">
            <p>
              Every item in our inventory is assessed under our <strong className="text-white">10-point Dispatch Condition Grading System</strong>, ranging from <strong className="text-white">10/10 MISB</strong> (Mint in Sealed Box) to <strong className="text-white">1/10 Battle Scars</strong> (heavily damaged, sold for display/parts). This system ensures buyers receive an honest, consistent assessment of each item&rsquo;s physical state before purchase.
            </p>
            <p>
              In addition to condition grading, each product is assigned an <strong className="text-white">Authenticity Grade</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Verified Authentic</strong> — Authenticated through physical inspection of manufacturer markings, serial codes, and packaging quality.</li>
              <li><strong className="text-white">Authentic but Unverified</strong> — Believed genuine based on available evidence; not subjected to full authentication protocol.</li>
              <li><strong className="text-white">Bootleg</strong> — Non-genuine, openly disclosed as unlicensed reproduction. Sold transparently under clear buyer acknowledgement.</li>
            </ul>
            <p className="text-gray-500 text-xs">
              Our grading and authenticity standards reflect our commitment to transparency. We encourage buyers to contact us for additional photos or information before making a purchase decision.
            </p>
          </Section>

          <Section title="Our Ethos">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-800 p-5 rounded-lg">
                <p className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-3">Curation</p>
                <p className="text-gray-500 text-xs leading-relaxed">Every piece is hand-selected. If it isn&rsquo;t S-tier, it doesn&rsquo;t enter the Vault.</p>
              </div>
              <div className="border border-gray-800 p-5 rounded-lg">
                <p className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-3">Authenticity</p>
                <p className="text-gray-500 text-xs leading-relaxed">Direct sourcing and multi-stage verification. Every authenticity grade is disclosed without exception.</p>
              </div>
              <div className="border border-gray-800 p-5 rounded-lg">
                <p className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-3">Integrity</p>
                <p className="text-gray-500 text-xs leading-relaxed">Accurate condition reporting. What you see in the Archive is what reaches your hands.</p>
              </div>
            </div>
          </Section>

          <Section title="Business Information">
            <p>
              The following information is provided in accordance with Malaysian e-commerce transparency requirements and our payment service provider&rsquo;s compliance guidelines.
            </p>
            <div className="border border-gray-800 p-6 rounded-lg space-y-3 text-sm">
              <div className="flex gap-4">
                <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest w-32 shrink-0">Business Name</span>
                <span className="text-white">Vault 6 Studios (Crafted Legacies)</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest w-32 shrink-0">Business Type</span>
                <span className="text-gray-400">Private seller — collectibles retail</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest w-32 shrink-0">Established</span>
                <span className="text-gray-400">2023</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest w-32 shrink-0">Country</span>
                <span className="text-gray-400">Malaysia</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest w-32 shrink-0">Currency</span>
                <span className="text-gray-400">Malaysian Ringgit (MYR)</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest w-32 shrink-0">Payment</span>
                <span className="text-gray-400">Processed by Razorpay Curlec (Curlec Sdn. Bhd.)</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              For full contact details, trading address, and direct communication channels, see our <Link href="/contact" className="text-blue-500 hover:text-white transition-colors">Contact Us</Link> page.
            </p>
          </Section>

          <Section title="Legal & Compliance">
            <p>
              Vault 6 Studios operates in compliance with applicable Malaysian consumer protection and e-commerce legislation, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Consumer Protection Act 1999 (Act 599)</li>
              <li>Electronic Commerce Act 2006 (Act 658)</li>
              <li>Personal Data Protection Act 2010 (Act 709)</li>
              <li>Sale of Goods Act 1957 (Act 382)</li>
              <li>Trade Marks Act 2019 (Act 815)</li>
              <li>Copyright Act 1987 (Act 332)</li>
            </ul>
            <p>
              Our full legal terms, policies, and buyer rights are documented in the links below.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-900">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors mb-8"
          >
            Contact Us <ArrowRight size={12} />
          </Link>
          <div className="flex flex-wrap gap-6">
            <Link href="/terms" className="text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/return-policy" className="text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
              Return &amp; Refund Policy
            </Link>
            <Link href="/shipping" className="text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
              Shipping Policy
            </Link>
            <Link href="/payment-policy" className="text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
              Payment Policy
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
