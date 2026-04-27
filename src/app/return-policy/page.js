import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Return & Refund Policy | Vault 6 Studios',
  description: 'Return and refund policy for Vault 6 Studios — governed under the Consumer Protection Act 1999 (Malaysia).',
};

const Section = ({ title, children }) => (
  <div className="border-b border-gray-900 pb-10 mb-10">
    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 text-sm leading-relaxed">{children}</div>
  </div>
);

export default function ReturnPolicyPage() {
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
            <ShieldCheck size={14} /> Legal
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none mb-4">
            RETURN &amp; REFUND POLICY
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Effective: 1 January 2025 &nbsp;·&nbsp; Jurisdiction: Malaysia
          </p>
        </div>

        <div className="prose-invert">

          <Section title="1. Overview">
            <p>
              This Return &amp; Refund Policy is governed by the <strong className="text-white">Consumer Protection Act 1999 (Act 599)</strong> and the <strong className="text-white">E-Commerce Consumer Protection Guidelines</strong> issued by the Ministry of Domestic Trade &amp; Cost of Living (KPDN), Malaysia.
            </p>
            <p>
              By purchasing from Vault 6 Studios, you acknowledge and agree to the terms set out in this policy.
            </p>
          </Section>

          <Section title="2. Eligibility for Returns">
            <p>Returns are accepted under the following conditions only:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Item received is <strong className="text-white">damaged or defective</strong> due to transit or manufacturing fault.</li>
              <li>Item received is <strong className="text-white">materially different</strong> from the product listing (e.g. wrong figure, wrong variant).</li>
              <li>Item is <strong className="text-white">missing components</strong> that were explicitly stated as included in the listing.</li>
            </ul>
            <p className="text-gray-500 text-xs mt-4">
              Returns are <strong className="text-white">not accepted</strong> for change of mind, collector's remorse, or minor cosmetic variations inherent to prize figure manufacturing tolerances.
            </p>
          </Section>

          <Section title="3. Return Window">
            <p>
              Return requests must be submitted within <strong className="text-white">7 calendar days</strong> from the date of delivery, in accordance with Section 14 of the Consumer Protection Act 1999.
            </p>
            <p>
              Requests submitted after this window will not be entertained unless the defect is latent and could not reasonably have been discovered within the return period.
            </p>
          </Section>

          <Section title="4. Condition of Returned Items">
            <p>All returned items must be:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>In the <strong className="text-white">same condition as received</strong> — including all original packaging, accessories, and documentation.</li>
              <li>Securely packed to prevent additional damage in transit.</li>
              <li>Accompanied by <strong className="text-white">photographic evidence</strong> of the defect or discrepancy, submitted at the time of the return request.</li>
            </ul>
            <p className="text-gray-500 text-xs mt-4">
              Items returned in a condition worse than received, or without original packaging, may be subject to partial refund or rejection at our discretion.
            </p>
          </Section>

          <Section title="5. Non-Returnable Items">
            <p>The following are strictly non-returnable:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Items listed as <strong className="text-white">Pre-Order</strong> — unless the item arrives damaged or incorrect.</li>
              <li>Items where the original seal has been <strong className="text-white">broken by the buyer</strong> after receipt, unless the defect is internal.</li>
              <li>Items purchased during <strong className="text-white">clearance or final-sale</strong> promotions, where explicitly marked as non-returnable.</li>
            </ul>
          </Section>

          <Section title="6. How to Request a Return">
            <p>To initiate a return:</p>
            <ol className="list-decimal list-inside space-y-3">
              <li>Contact us via WhatsApp within the 7-day window.</li>
              <li>Provide your <strong className="text-white">order reference</strong>, photos of the defective or incorrect item, and a brief description of the issue.</li>
              <li>Await confirmation. We will respond within <strong className="text-white">2 business days</strong>.</li>
              <li>If approved, ship the item back to the address provided. <strong className="text-white">Return shipping cost</strong> is borne by the buyer unless the fault is ours.</li>
            </ol>
          </Section>

          <Section title="7. Refunds">
            <p>Upon receipt and inspection of the returned item:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Approved refunds will be processed within <strong className="text-white">7–14 business days</strong>.</li>
              <li>Refunds are issued via the <strong className="text-white">original payment method</strong> (bank transfer, e-wallet, or platform credit).</li>
              <li>Original shipping fees are non-refundable unless the return is due to our error.</li>
            </ul>
          </Section>

          <Section title="8. Exchanges">
            <p>
              We do not offer direct exchanges. If your return is approved, a <strong className="text-white">full refund</strong> will be issued and you may place a new order for the correct item, subject to stock availability.
            </p>
          </Section>

          <Section title="9. Governing Law">
            <p>
              This policy is subject to and construed in accordance with the laws of <strong className="text-white">Malaysia</strong>. Any disputes shall be resolved under the jurisdiction of the Malaysian courts, with reference to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Consumer Protection Act 1999 (Act 599)</li>
              <li>Sale of Goods Act 1957 (Act 382)</li>
              <li>Electronic Commerce Act 2006 (Act 658)</li>
            </ul>
          </Section>

          <Section title="10. Contact">
            <p>
              For all return and refund enquiries, reach us via WhatsApp. Contact details are available in the footer of this site.
            </p>
            <p className="text-gray-500 text-xs">
              Vault 6 Studios operates as a private seller of authentic Japanese collectible figures, registered and operating within Malaysia.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 text-center">
          <Link
            href="/shop"
            className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors"
          >
            Back to Collection
          </Link>
        </div>

      </div>
    </main>
  );
}
