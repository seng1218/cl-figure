import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Shipping Policy | Vault 6 Studios',
  description: 'Shipping policy for Vault 6 Studios — delivery coverage, timeframes, packaging standards, and lost parcel procedures for Malaysia.',
};

const Section = ({ title, children }) => (
  <div className="border-b border-gray-900 pb-10 mb-10">
    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 text-sm leading-relaxed">{children}</div>
  </div>
);

export default function ShippingPolicyPage() {
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
            SHIPPING POLICY
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Effective: 1 May 2026 &nbsp;·&nbsp; Jurisdiction: Malaysia
          </p>
        </div>

        <div className="prose-invert">

          <Section title="1. Delivery Coverage">
            <p>
              Vault 6 Studios ships to <strong className="text-white">all addresses within Malaysia</strong>, including Peninsular Malaysia, Sabah, and Sarawak. We do not currently offer international shipping.
            </p>
            <p>
              P.O. Box addresses are not accepted as delivery addresses due to the fragile and high-value nature of our products. A physical street address with a valid contact number is required for all orders.
            </p>
          </Section>

          <Section title="2. Courier Partners">
            <p>
              We ship via the following courier partners. The assigned courier is selected at our discretion based on your delivery zone, parcel weight, and service availability:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li><strong className="text-white">J&amp;T Express</strong> — Nationwide coverage, standard parcels</li>
              <li><strong className="text-white">Pos Laju (Poslaju)</strong> — Nationwide coverage including rural zones</li>
              <li><strong className="text-white">NinjaVan</strong> — Peninsular Malaysia, urban delivery</li>
              <li><strong className="text-white">DHL eCommerce</strong> — Premium service for high-value items</li>
              <li><strong className="text-white">Shopee Express / Lalamove</strong> — Supplementary service for certain zones</li>
            </ul>
            <p className="text-gray-500 text-xs mt-2">
              We reserve the right to change courier providers at any time without prior notice. Regardless of courier assignment, the service standards in this policy apply in full.
            </p>
          </Section>

          <Section title="3. Processing Time">
            <p>
              Processing time is the period between order payment confirmation and the parcel being handed to the courier.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-white">Ready Stock items:</strong> Packed and dispatched within <strong className="text-white">1–2 business days</strong> of payment confirmation.
              </li>
              <li>
                <strong className="text-white">Pre-Order items:</strong> Dispatched upon arrival from the manufacturer/distributor. See Section 7 of our <Link href="/terms" className="text-blue-500 hover:text-white transition-colors">Terms &amp; Conditions</Link> for pre-order delivery timelines.
              </li>
            </ul>
            <p className="text-gray-500 text-xs">
              Business days are Monday to Friday, excluding Malaysian public holidays (Federal and Selangor). Orders placed after 3:00 PM on a business day or on weekends/public holidays will begin processing on the next business day.
            </p>
          </Section>

          <Section title="4. Estimated Delivery Timeframes">
            <p>
              The following are estimated delivery windows after dispatch. These are guidelines provided by the respective couriers and are not guaranteed:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-white font-black text-[10px] uppercase tracking-widest py-3 pr-6">Region</th>
                    <th className="text-left text-white font-black text-[10px] uppercase tracking-widest py-3 pr-6">Estimated Delivery</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-gray-900">
                    <td className="py-3 pr-6 text-gray-400">Peninsular Malaysia (major cities)</td>
                    <td className="py-3 text-white font-bold">1–3 business days</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="py-3 pr-6 text-gray-400">Peninsular Malaysia (suburban / rural)</td>
                    <td className="py-3 text-white font-bold">2–5 business days</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="py-3 pr-6 text-gray-400">Sabah &amp; Sarawak (urban)</td>
                    <td className="py-3 text-white font-bold">3–7 business days</td>
                  </tr>
                  <tr className="border-b border-gray-900">
                    <td className="py-3 pr-6 text-gray-400">Sabah &amp; Sarawak (interior / rural)</td>
                    <td className="py-3 text-white font-bold">5–10 business days</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 text-gray-400">Labuan</td>
                    <td className="py-3 text-white font-bold">3–7 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-500 text-xs mt-4">
              Delivery timeframes may be extended during peak periods (Hari Raya Aidilfitri, Chinese New Year, Deepavali, year-end festive season) and may be affected by adverse weather, natural events, or nationwide disruptions. We will communicate known delays proactively.
            </p>
          </Section>

          <Section title="5. Shipping Rates">
            <p>
              Shipping fees are calculated at checkout based on parcel weight, dimensions, and delivery zone. The applicable rate will be clearly displayed before you confirm payment.
            </p>
            <p>
              For select promotions, free shipping may be offered above a qualifying order value. Promotional shipping terms are stated on the relevant campaign page or announcement banner.
            </p>
            <p className="text-gray-500 text-xs">
              We do not add mark-ups to courier rates. The fee charged reflects the actual shipping cost. Shipping fees are non-refundable except where the return is due to our error, as detailed in our <Link href="/return-policy" className="text-blue-500 hover:text-white transition-colors">Return &amp; Refund Policy</Link>.
            </p>
          </Section>

          <Section title="6. Packaging Standards">
            <p>
              We take packaging seriously. All collectible figures are packed to minimise the risk of damage in transit:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Primary protection:</strong> Figure boxes are individually wrapped in bubble wrap (minimum 2 layers) and surrounded by foam padding or kraft paper fill.</li>
              <li><strong className="text-white">Outer carton:</strong> Parcels are shipped in a corrugated cardboard outer box sized appropriately to prevent movement. Oversized figures may require custom-cut foam inserts.</li>
              <li><strong className="text-white">MISB / Sealed items:</strong> Factory-sealed boxes are never opened for repacking. The sealed item is nested within the outer shipping carton with adequate cushioning.</li>
              <li><strong className="text-white">Multiple items:</strong> Orders containing multiple figures are individually padded and secured within a single outer carton where weight permits, or shipped in separate parcels.</li>
              <li><strong className="text-white">Fragile labelling:</strong> All parcels are labelled with &ldquo;FRAGILE — THIS SIDE UP&rdquo; markings.</li>
            </ul>
            <p className="text-gray-500 text-xs mt-2">
              Despite our packaging standards, courier handling may cause damage. We strongly recommend examining your parcel for visible external damage before signing for delivery, and noting any damage with the delivery agent.
            </p>
          </Section>

          <Section title="7. Tracking">
            <p>
              A tracking number will be sent to you via <strong className="text-white">WhatsApp</strong> (or email, where applicable) within <strong className="text-white">24 hours</strong> of dispatch. You may use this number to track your parcel directly on the courier&rsquo;s website.
            </p>
            <p>
              If you have not received a tracking number within 3 business days of payment confirmation (for Ready Stock items), please contact us immediately.
            </p>
          </Section>

          <Section title="8. Damaged in Transit">
            <p>
              If your item arrives visibly damaged due to transit mishandling:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Photograph the <strong className="text-white">outer packaging</strong> (before opening), the <strong className="text-white">inner packaging</strong>, and the <strong className="text-white">damaged item</strong> immediately.</li>
              <li>Contact us via WhatsApp within <strong className="text-white">24 hours</strong> of delivery with your order reference and the photographs.</li>
              <li>We will lodge a damage claim with the courier on your behalf. Most couriers require claim submission within 7 days of delivery.</li>
              <li>Pending the outcome of the courier investigation, we will offer a replacement (subject to stock availability) or a full refund.</li>
            </ol>
            <p className="text-gray-500 text-xs mt-2">
              Damage claims require photographic evidence. Claims submitted without photos or after the 24-hour window may be rejected by the courier, limiting our ability to compensate.
            </p>
          </Section>

          <Section title="9. Lost Parcels">
            <p>
              A parcel is considered lost if it has not been delivered within <strong className="text-white">14 calendar days</strong> beyond the estimated delivery window and the tracking information shows no movement for 7 or more consecutive days.
            </p>
            <p>
              To report a potential lost parcel:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Contact us with your order reference and tracking number.</li>
              <li>We will file a loss investigation with the courier. Investigations typically take 7–14 business days.</li>
              <li>Upon confirmation of loss, we will offer a replacement (subject to stock) or a full refund of the item value plus shipping fees.</li>
            </ol>
            <p className="text-gray-500 text-xs mt-2">
              Vault 6 Studios assumes responsibility for parcels up to the point of confirmed courier handover. Liability for loss or damage thereafter is subject to the outcome of courier claim procedures.
            </p>
          </Section>

          <Section title="10. Failed Delivery & Return to Sender">
            <p>
              Delivery may fail due to: incorrect or incomplete address provided, recipient unavailable after multiple delivery attempts, refusal of delivery, or parcel held at a pick-up point left uncollected.
            </p>
            <p>
              If a parcel is returned to us by the courier:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>We will notify you via WhatsApp upon receipt of the returned parcel.</li>
              <li><strong className="text-white">Re-delivery:</strong> You may request re-delivery at your own expense (re-shipping fee applies).</li>
              <li><strong className="text-white">Refund:</strong> If you choose not to have the item re-shipped, we will issue a refund of the item value. Original shipping fees are non-refundable where the return was caused by an incorrect address or failed delivery due to your absence.</li>
            </ul>
            <p>
              Please ensure your delivery address and contact number are accurate at the time of order. Vault 6 Studios is not liable for failed delivery resulting from incorrect information provided by the buyer.
            </p>
          </Section>

          <Section title="11. Large & Oversized Items">
            <p>
              Items at 1:4 scale or larger, premium scale figures (over 40cm), or items with exceptionally large original packaging (e.g. figures with large base components or multiple accessories) may incur additional handling or packaging fees, which will be communicated to you prior to dispatch.
            </p>
            <p>
              For oversize orders, delivery timeframes may be extended by 1–2 additional business days to allow for appropriate packaging preparation.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For all shipping enquiries — including tracking, delayed deliveries, damage claims, or failed delivery — please visit our <Link href="/contact" className="text-blue-500 hover:text-white transition-colors">Contact Us</Link> page.
            </p>
            <p>
              Providing your order reference number in your message will allow us to resolve your query faster.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-wrap gap-6 justify-center">
          <Link href="/privacy-policy" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Terms &amp; Conditions
          </Link>
          <Link href="/return-policy" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Return Policy
          </Link>
        </div>

      </div>
    </main>
  );
}
