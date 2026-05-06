import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Vault 6 Studios',
  description: 'Terms and Conditions for Vault 6 Studios — governed under the Consumer Protection Act 1999, Electronic Commerce Act 2006, and Sale of Goods Act 1957 (Malaysia).',
};

const Section = ({ title, children }) => (
  <div className="border-b border-gray-900 pb-10 mb-10">
    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 text-sm leading-relaxed">{children}</div>
  </div>
);

export default function TermsPage() {
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
            TERMS &amp; CONDITIONS
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Effective: 1 May 2026 &nbsp;·&nbsp; Jurisdiction: Malaysia
          </p>
        </div>

        <div className="prose-invert">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using the Vault 6 Studios website (<strong className="text-white">vault6studios.com</strong>) and placing an order, you (&ldquo;Buyer&rdquo;, &ldquo;you&rdquo;) unconditionally agree to be bound by these Terms &amp; Conditions (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you must not place an order or use our services.
            </p>
            <p>
              These Terms constitute a legally binding contract between you and Vault 6 Studios (&ldquo;Seller&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) under the <strong className="text-white">Contracts Act 1950</strong> and are supplemented by the <strong className="text-white">Electronic Commerce Act 2006 (Act 658)</strong>, which governs the formation of electronic contracts in Malaysia.
            </p>
            <p className="text-gray-500 text-xs border border-gray-800 p-4 rounded-lg">
              Nothing in these Terms excludes or limits any rights you have under mandatory consumer protection legislation, including the <strong className="text-white">Consumer Protection Act 1999 (Act 599)</strong>. Your statutory rights are preserved in full.
            </p>
          </Section>

          <Section title="2. About Vault 6 Studios">
            <p>
              Vault 6 Studios is a private seller of Japanese collectible figures and merchandise, operating within Malaysia. We specialise in authenticated, graded second-hand and new figures from manufacturers including but not limited to Taito, FuRyu, Banpresto, Kotobukiya, Alter, and Good Smile Company.
            </p>
            <p>
              Vault 6 Studios is not an authorised distributor of any figure manufacturer. All character intellectual property (IP), trademarks, and copyrights referenced in product listings belong to their respective rights holders.
            </p>
          </Section>

          <Section title="3. Product Listings, Descriptions & Condition Grading">
            <p>
              All products are listed with our proprietary <strong className="text-white">10-point Dispatch Condition Grading System</strong>, which represents our honest assessment of each item at the time of listing:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li><strong className="text-white">10/10 MISB</strong> — Mint in Sealed Box; factory seal intact and untampered</li>
              <li><strong className="text-white">9/10 MIB</strong> — Mint in Box; opened but figure and box are mint</li>
              <li><strong className="text-white">8/10 BIB</strong> — Displayed Mint; opened for display, mint figure returned to box</li>
              <li><strong className="text-white">7/10 Minor Wear</strong> — Minor box wear or light surface dust</li>
              <li><strong className="text-white">6/10 Moderate Wear</strong> — Noticeable box damage or minor scuffs on figure</li>
              <li><strong className="text-white">5/10 Loose Mint</strong> — No box; figure itself is mint condition</li>
              <li><strong className="text-white">4/10 Displayed Imperfect</strong> — Missing minor accessories or small visible marks</li>
              <li><strong className="text-white">3/10 Damaged</strong> — Broken parts or heavy surface scuffs</li>
              <li><strong className="text-white">2/10 Heavy Damage</strong> — Major broken pieces or missing core components</li>
              <li><strong className="text-white">1/10 Battle Scars</strong> — Salvaged or heavily damaged; sold for parts/display</li>
            </ul>
            <p>
              Condition grades represent our good-faith assessment. Minor subjective variation in grading is inherent to the second-hand collectibles market and does not constitute misrepresentation. Buyers are encouraged to contact us for additional photos before purchase.
            </p>
            <p>
              Product photography and descriptions are provided in good faith. Colours may vary slightly due to monitor calibration. Where a discrepancy exists between the listing description and the item received, our <Link href="/return-policy" className="text-blue-500 hover:text-white transition-colors">Return &amp; Refund Policy</Link> applies.
            </p>
          </Section>

          <Section title="4. Authenticity Grades & Bootleg Disclosure">
            <p>
              Each product is assigned one of three <strong className="text-white">Authenticity Grades</strong>:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong className="text-white">Verified Authentic:</strong> Item has been authenticated by us through physical inspection of manufacturer markings, serial codes, packaging print quality, and material finish consistent with licensed production.
              </li>
              <li>
                <strong className="text-white">Authentic but Unverified:</strong> Item is believed to be genuine based on available evidence, but has not been subjected to full authentication protocol. Purchased as-is.
              </li>
              <li>
                <strong className="text-white">Bootleg:</strong> Item is a <strong className="text-white">non-genuine, unlicensed reproduction</strong> manufactured by a third party without authorisation from the original IP rights holder. See critical disclosure below.
              </li>
            </ul>

            <div className="border border-yellow-900/50 bg-yellow-950/10 p-5 rounded-lg space-y-3 mt-4">
              <p className="text-yellow-500 font-black text-xs uppercase tracking-widest">⚠ Bootleg Items — Critical Disclosure</p>
              <p>
                Items listed under the <strong className="text-white">Bootleg</strong> authenticity grade are openly disclosed as non-licensed, non-genuine merchandise. By purchasing a Bootleg-graded item, you explicitly acknowledge and agree to all of the following:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>The item is <strong className="text-white">not produced, endorsed, or licensed</strong> by the original character IP holder, franchise owner, or any authorised manufacturer.</li>
                <li>The item may infringe upon registered trademarks, copyrights, or design rights held by third parties.</li>
                <li>Vault 6 Studios makes <strong className="text-white">no warranty of non-infringement</strong> and accepts no liability for any IP-related claim arising from your possession or display of the item.</li>
                <li>You accept <strong className="text-white">full personal responsibility</strong> for compliance with the laws of your jurisdiction regarding the import, possession, display, or resale of non-genuine goods.</li>
                <li>Bootleg items are <strong className="text-white">sold as collectible display pieces only</strong> — not as replacements for or representations of genuine licensed products.</li>
                <li>No quality warranty is given; Bootleg items are sold strictly <strong className="text-white">as-is</strong> and are <strong className="text-white">non-returnable</strong> except where item received does not match listing description.</li>
              </ul>
              <p className="text-gray-500 text-xs">
                Vault 6 Studios complies with the <strong className="text-white">Trade Marks Act 2019</strong> and <strong className="text-white">Copyright Act 1987</strong> of Malaysia. Bootleg items are disclosed transparently and are not represented as genuine products. Buyers in jurisdictions where possession of unlicensed reproductions is prohibited bear sole legal responsibility.
              </p>
            </div>
          </Section>

          <Section title="5. Ordering & Contract Formation">
            <p>
              In accordance with <strong className="text-white">Section 7 of the Electronic Commerce Act 2006</strong>, a binding contract of sale is formed at the point when:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>You submit your order via our checkout and</li>
              <li>Payment is successfully processed and confirmed by Razorpay Curlec, and</li>
              <li>We dispatch a written order confirmation via WhatsApp or email.</li>
            </ol>
            <p>
              Placing an item in your cart does not constitute a reservation or binding order. Stock is confirmed only upon payment clearance.
            </p>
            <p>
              We reserve the right to <strong className="text-white">cancel any order</strong> at our sole discretion if: (a) the item is discovered to be damaged after packing; (b) a pricing error has occurred; (c) we suspect fraudulent activity; or (d) the item has been simultaneously sold. In such cases, a full refund will be issued within 3 business days.
            </p>
          </Section>

          <Section title="6. Pricing & Payment">
            <p>
              All prices are stated in <strong className="text-white">Malaysian Ringgit (MYR)</strong>, inclusive of applicable taxes. Prices are subject to change without notice prior to order confirmation.
            </p>
            <p>
              Payments are processed by <strong className="text-white">Curlec Sdn. Bhd. (Razorpay Curlec)</strong> through their secure payment gateway. Accepted payment methods include FPX online banking, major credit and debit cards, and supported e-wallets. By proceeding with payment, you also agree to Razorpay Curlec&rsquo;s Terms of Service and Privacy Policy.
            </p>
            <p>
              We do not store, process, or have access to full payment card details. All payment data is handled exclusively by Razorpay Curlec in compliance with PCI DSS standards.
            </p>
          </Section>

          <Section title="7. Pre-Order Terms">
            <p>
              Products listed under the <strong className="text-white">Pre-Order</strong> category are items not yet in stock that will be dispatched upon arrival from the manufacturer or distributor.
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong className="text-white">Estimated Arrival Dates:</strong> All pre-order timelines are estimates based on manufacturer information and are subject to change. Delays caused by the manufacturer, distributor, customs, or logistics providers are beyond our control and do not constitute a breach of contract.
              </li>
              <li>
                <strong className="text-white">Delay Notification:</strong> We will notify you via WhatsApp or email if an item is delayed by more than <strong className="text-white">60 days</strong> from the original estimated dispatch date.
              </li>
              <li>
                <strong className="text-white">Buyer-Initiated Cancellation:</strong> You may cancel a pre-order within <strong className="text-white">14 days</strong> of placing the order for a full refund. After 14 days, pre-order payments are non-refundable on buyer-initiated cancellation, as we will have committed to procurement from our supplier.
              </li>
              <li>
                <strong className="text-white">Seller-Initiated Cancellation:</strong> If the item is discontinued, permanently out of stock, or cannot be sourced, we will cancel the pre-order and issue a <strong className="text-white">full refund</strong> within 7 business days.
              </li>
              <li>
                <strong className="text-white">Extended Delay &mdash; Buyer Option:</strong> If an item is delayed by more than <strong className="text-white">6 months</strong> beyond the original estimated date, you may contact us to request a refund at your discretion.
              </li>
            </ul>
          </Section>

          <Section title="8. Implied Conditions under Sale of Goods Act 1957">
            <p>
              Under the <strong className="text-white">Sale of Goods Act 1957 (Act 382)</strong>, the following implied conditions apply to all sales:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Title:</strong> We warrant that we have the right to sell the items listed.</li>
              <li><strong className="text-white">Description:</strong> Goods will correspond substantially with their listing description.</li>
              <li><strong className="text-white">Fitness for Purpose / Merchantable Quality:</strong> Where an item is sold as a display collectible, it will be of merchantable quality consistent with the stated condition grade.</li>
            </ul>
            <p className="text-gray-500 text-xs mt-2">
              These implied conditions are not excluded or limited by any provision of these Terms. Your statutory rights are fully preserved.
            </p>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              All <strong className="text-white">original content</strong> on this site — including product photography, written descriptions, site design, and branding — is copyright &copy; Vault 6 Studios. Reproduction or redistribution without written permission is prohibited.
            </p>
            <p>
              All <strong className="text-white">character intellectual property</strong> referenced in product listings (character names, designs, likenesses, franchise names) belongs to their respective rights holders (e.g. Taito Corporation, FuRyu Corporation, Banpresto Co. Ltd., Kotobukiya Co. Ltd., Good Smile Company, and the associated anime/game/manga IP holders). Use of such names is for descriptive identification purposes only and does not imply endorsement or affiliation.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              To the maximum extent permitted by Malaysian law, our aggregate liability to you for any claim arising from a transaction shall not exceed the <strong className="text-white">total value paid for the specific order</strong> to which the claim relates.
            </p>
            <p>
              We are not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Consequential, indirect, or special damages (including loss of display opportunity, loss of resale value, or emotional distress)</li>
              <li>Delays caused by courier providers, customs authorities, or natural events beyond our control (force majeure)</li>
              <li>Damage caused by the buyer&rsquo;s mishandling of an item after delivery</li>
              <li>IP claims arising from the buyer&rsquo;s purchase or possession of Bootleg-grade items (see Section 4)</li>
              <li>Third-party website content linked from our site</li>
            </ul>
            <p className="text-gray-500 text-xs mt-2">
              Nothing in this section limits liability for death or personal injury caused by negligence, fraudulent misrepresentation, or any other liability that cannot lawfully be excluded.
            </p>
          </Section>

          <Section title="11. Prohibited Conduct">
            <p>When using our site and services, you agree not to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide false or fraudulent information in any order or communication</li>
              <li>Attempt to gain unauthorised access to our administrative systems</li>
              <li>Engage in chargebacks or payment reversals in bad faith</li>
              <li>Reproduce, redistribute, or commercially exploit our product photography or descriptions without permission</li>
              <li>Use our site in a manner that violates any applicable Malaysian law or regulation</li>
            </ul>
          </Section>

          <Section title="12. Governing Law & Dispute Resolution">
            <p>
              These Terms are governed by and construed in accordance with the laws of <strong className="text-white">Malaysia</strong>. Any dispute arising from or in connection with these Terms shall first be attempted to be resolved through direct negotiation. If unresolved within 30 days, disputes shall be submitted to the jurisdiction of the <strong className="text-white">Malaysian courts</strong>.
            </p>
            <p>
              Consumers may also seek resolution through the <strong className="text-white">Tribunal for Consumer Claims Malaysia (Tribunal Tuntutan Pengguna Malaysia)</strong> for claims not exceeding RM50,000, in accordance with the Consumer Protection Act 1999.
            </p>
            <p>
              Applicable statutes include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Consumer Protection Act 1999 (Act 599)</li>
              <li>Sale of Goods Act 1957 (Act 382)</li>
              <li>Contracts Act 1950 (Act 136)</li>
              <li>Electronic Commerce Act 2006 (Act 658)</li>
              <li>Trade Marks Act 2019 (Act 815)</li>
              <li>Copyright Act 1987 (Act 332)</li>
            </ul>
          </Section>

          <Section title="13. Amendments">
            <p>
              We reserve the right to amend these Terms at any time. Material changes will be announced on this site at least <strong className="text-white">14 days</strong> before taking effect. Your continued use of our services after the effective date constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              For any legal queries or correspondence regarding these Terms, please visit our <Link href="/contact" className="text-blue-500 hover:text-white transition-colors">Contact Us</Link> page. For company profile and business information, see our <Link href="/about" className="text-blue-500 hover:text-white transition-colors">About Us</Link> page.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-wrap gap-6 justify-center">
          <Link href="/about" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Contact Us
          </Link>
          <Link href="/privacy-policy" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/payment-policy" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Payment Policy
          </Link>
          <Link href="/shipping" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Shipping Policy
          </Link>
          <Link href="/return-policy" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Return Policy
          </Link>
        </div>

      </div>
    </main>
  );
}
