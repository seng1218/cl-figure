import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Vault 6 Studios',
  description: 'Privacy Policy for Vault 6 Studios — compliant with Malaysia Personal Data Protection Act 2010 (PDPA) and GDPR principles.',
};

const Section = ({ title, children }) => (
  <div className="border-b border-gray-900 pb-10 mb-10">
    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 text-sm leading-relaxed">{children}</div>
  </div>
);

export default function PrivacyPolicyPage() {
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
            PRIVACY POLICY
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Effective: 1 May 2026 &nbsp;·&nbsp; Jurisdiction: Malaysia
          </p>
        </div>

        <div className="prose-invert">

          <Section title="1. Data Controller & Overview">
            <p>
              This Privacy Policy governs the collection, use, storage, and disclosure of personal data by <strong className="text-white">Vault 6 Studios</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), operating at <strong className="text-white">vault6studios.com</strong>, in compliance with the <strong className="text-white">Personal Data Protection Act 2010 (Act 709) (PDPA)</strong> of Malaysia and, where applicable, the principles of the EU <strong className="text-white">General Data Protection Regulation (GDPR)</strong>.
            </p>
            <p>
              By placing an order, creating an account, subscribing to our newsletter, or otherwise interacting with this site, you consent to the practices described herein. If you do not agree, please refrain from using our services.
            </p>
            <p className="text-gray-500 text-xs border border-gray-800 p-4 rounded-lg">
              <strong className="text-white">Note to EU/EEA Residents:</strong> Where our processing activities fall within the territorial scope of GDPR (Article 3), we honour the GDPR rights set out in Section 9 of this policy in addition to your PDPA rights.
            </p>
          </Section>

          <Section title="2. Personal Data We Collect">
            <p>We collect the following categories of personal data when you interact with us:</p>

            <div className="space-y-6">
              <div>
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">Identity &amp; Contact Data</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Mobile phone number</li>
                  <li>Delivery address (street, city, postcode, state)</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">Transaction Data</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Order history, items purchased, quantities, and amounts paid</li>
                  <li>Payment method type (e.g. credit card, FPX, e-wallet) — we do not store full card numbers; payment is processed by Curlec Sdn. Bhd. (Razorpay Curlec).</li>
                  <li>Shipping tracking numbers and dispatch records</li>
                  <li>Voucher codes used and discounts applied</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">Account &amp; Membership Data (if applicable)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Member email and name</li>
                  <li>Password (stored as a cryptographic hash — never in plaintext)</li>
                  <li>Membership tier, loyalty points, and total spend records</li>
                  <li>Admin notes and internal correspondence</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">Technical &amp; Usage Data</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>IP address and general geolocation (country/city) — processed by Cloudflare, Inc. as our infrastructure provider</li>
                  <li>Browser type, operating system, and device type</li>
                  <li>Pages visited and interaction patterns on this site</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">Communication Data</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>Messages and enquiries submitted via WhatsApp or email</li>
                  <li>Feedback and reviews you voluntarily submit</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="3. Legal Basis for Processing (Seven PDPA Principles)">
            <p>
              Under the PDPA 2010, we process personal data in accordance with the following seven Data Protection Principles:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li><strong className="text-white">General Principle:</strong> Data is collected only for lawful purposes directly related to our business activities.</li>
              <li><strong className="text-white">Notice &amp; Choice:</strong> You are informed of the purposes at or before the point of collection. Consent is obtained for non-essential processing such as direct marketing.</li>
              <li><strong className="text-white">Disclosure:</strong> We do not disclose personal data to third parties except as described in Section 5 of this policy, or as required by law.</li>
              <li><strong className="text-white">Security:</strong> Appropriate technical and organisational measures are in place to protect data against unauthorised access, loss, or destruction.</li>
              <li><strong className="text-white">Retention:</strong> Data is not retained beyond what is necessary for the stated purposes, or the minimum retention period required by law.</li>
              <li><strong className="text-white">Data Integrity:</strong> We take reasonable steps to ensure personal data is accurate, complete, and up-to-date.</li>
              <li><strong className="text-white">Access:</strong> You have the right to access and correct your personal data as described in Section 9.</li>
            </ul>
          </Section>

          <Section title="4. How We Use Your Personal Data">
            <p>We process your personal data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>To <strong className="text-white">process and fulfil orders</strong>, including payment verification, packaging, and dispatch</li>
              <li>To <strong className="text-white">communicate with you</strong> regarding your order status, shipping updates, and returns</li>
              <li>To <strong className="text-white">maintain your membership account</strong> and administer loyalty points and tier benefits</li>
              <li>To <strong className="text-white">send marketing communications</strong> (newsletters, promotions) — only where you have subscribed or given explicit consent, and only until you withdraw such consent</li>
              <li>To <strong className="text-white">detect and prevent fraud</strong>, unauthorised transactions, and abuse of our platform</li>
              <li>To <strong className="text-white">comply with legal and regulatory obligations</strong>, including tax records required under the Income Tax Act 1967 and other applicable Malaysian statutes</li>
              <li>To <strong className="text-white">improve our services</strong> through aggregated, anonymised analysis of site usage patterns</li>
            </ul>
            <p className="text-gray-500 text-xs mt-4">
              We do not use personal data for automated profiling or decision-making that produces legal or similarly significant effects without human review.
            </p>
          </Section>

          <Section title="5. Disclosure to Third Parties">
            <p>
              We do not sell, rent, or trade your personal data. We share personal data only with the following categories of third parties, strictly on a need-to-know basis:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong className="text-white">Curlec Sdn. Bhd. / Razorpay Curlec (Payment Processor):</strong> Your payment details are submitted directly to Razorpay Curlec&rsquo;s secure gateway. We receive only transaction confirmation and payment method type. Razorpay Curlec&rsquo;s privacy policy governs their handling of payment data.
              </li>
              <li>
                <strong className="text-white">Courier Partners</strong> (J&amp;T Express, PosLaju, NinjaVan, DHL eCommerce, etc.): Your name, delivery address, and phone number are shared with the assigned courier solely for the purpose of parcel delivery.
              </li>
              <li>
                <strong className="text-white">Cloudflare, Inc. (Infrastructure Provider):</strong> Technical data including IP addresses passes through Cloudflare&rsquo;s network for security, DDoS protection, and content delivery. Cloudflare is certified under SOC 2 Type II and ISO 27001.
              </li>
              <li>
                <strong className="text-white">Resend, Inc. (Transactional Email):</strong> Where email is used to deliver membership credentials or transactional notifications, Resend processes your email address solely for message delivery.
              </li>
            </ul>
            <p className="text-gray-500 text-xs mt-4">
              We may disclose personal data if required to do so by law, court order, or directive from a competent Malaysian authority under the PDPA 2010 or the Communications and Multimedia Act 1998.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Order and transaction records:</strong> Retained for a minimum of <strong className="text-white">7 years</strong> from the date of transaction, in accordance with the Income Tax Act 1967 and the Companies Act 2016 (audit trail requirements).</li>
              <li><strong className="text-white">Member account data:</strong> Retained for the duration of active membership plus <strong className="text-white">2 years</strong> after account deletion, to resolve any outstanding disputes.</li>
              <li><strong className="text-white">Newsletter subscription data:</strong> Retained until you unsubscribe or withdraw consent.</li>
              <li><strong className="text-white">Communication records:</strong> Retained for <strong className="text-white">3 years</strong> for dispute resolution purposes.</li>
              <li><strong className="text-white">Technical log data:</strong> Retained for up to <strong className="text-white">90 days</strong> by Cloudflare per their standard data retention policy.</li>
            </ul>
            <p className="text-gray-500 text-xs mt-4">
              Upon expiry of the applicable retention period, personal data is deleted or anonymised in accordance with Section 9 of the PDPA 2010.
            </p>
          </Section>

          <Section title="7. Data Security">
            <p>We implement the following technical and organisational security measures:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>All data transmitted between your browser and our site is encrypted using <strong className="text-white">TLS 1.2 or higher (HTTPS)</strong>.</li>
              <li>Member passwords are stored as <strong className="text-white">cryptographic hashes</strong> (one-way bcrypt or equivalent); no plaintext passwords are stored or accessible to us.</li>
              <li>Admin access to customer data is protected by a <strong className="text-white">time-limited session token system</strong> with no persistent access keys in the codebase.</li>
              <li>Data is stored on <strong className="text-white">Cloudflare Workers KV</strong>, which operates within Cloudflare&rsquo;s global infrastructure with physical and logical access controls, SOC 2 Type II certification, and data residency in the APAC region.</li>
              <li>We apply the principle of <strong className="text-white">least privilege</strong>: only personnel with a direct operational need can access personal data.</li>
            </ul>
            <p>
              Despite these measures, no data transmission over the internet can be guaranteed to be 100% secure. We will notify affected individuals and, where required, the relevant authority, within a reasonable time in the event of a data breach that may cause harm.
            </p>
          </Section>

          <Section title="8. Cookies & Tracking Technologies">
            <p>We use minimal cookies:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Session cookie (admin_session):</strong> An HTTP-only, Secure, SameSite=Strict cookie used exclusively for administrative authentication. Not set for regular shoppers.</li>
              <li><strong className="text-white">Cloudflare security cookies:</strong> Cloudflare may set cookies (e.g. <code className="text-blue-400 text-xs">__cf_bm</code>) for bot detection and DDoS mitigation. These are strictly functional and not used for advertising.</li>
            </ul>
            <p>
              We do not use third-party advertising cookies, social media tracking pixels, or behavioural analytics tools (e.g. Google Analytics, Facebook Pixel).
            </p>
            <p className="text-gray-500 text-xs">
              You may control cookies via your browser settings. Disabling functional cookies may affect the checkout experience.
            </p>
          </Section>

          <Section title="9. Your Rights">
            <p>
              Under the PDPA 2010, you have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li><strong className="text-white">Right of Access (Section 30, PDPA):</strong> You may request a copy of the personal data we hold about you. We will respond within <strong className="text-white">21 days</strong> of receipt of a valid written request.</li>
              <li><strong className="text-white">Right of Correction (Section 34, PDPA):</strong> You may request correction of inaccurate or incomplete personal data. We will correct or supplement the data within <strong className="text-white">21 days</strong> or notify you if we are unable to do so.</li>
              <li><strong className="text-white">Right to Withdraw Marketing Consent (Section 38, PDPA):</strong> You may opt out of direct marketing at any time by contacting us or using the unsubscribe link in any marketing email. Withdrawal does not affect the lawfulness of prior processing.</li>
              <li><strong className="text-white">Right to Restrict Processing:</strong> In limited circumstances, you may request that we restrict processing of your data while a dispute or correction request is pending.</li>
            </ul>
            <p>
              <strong className="text-white">For EU/EEA Residents (GDPR):</strong> In addition to the above, you have the right to data portability (Article 20), the right to object to processing based on legitimate interests (Article 21), and the right to lodge a complaint with your local data protection supervisory authority.
            </p>
            <p>
              To exercise any of these rights, contact us via WhatsApp or email with subject line <strong className="text-white">&ldquo;PDPA Data Request&rdquo;</strong>. We may require you to verify your identity before processing the request.
            </p>
          </Section>

          <Section title="10. International Data Transfers">
            <p>
              Your personal data may be processed by Cloudflare, Inc. on servers located in Singapore and other APAC jurisdictions. Cloudflare participates in cross-border data transfer frameworks and maintains Standard Contractual Clauses (SCCs) where applicable.
            </p>
            <p>
              We do not transfer personal data outside Malaysia to countries without adequate data protection laws without ensuring appropriate safeguards are in place, in compliance with Section 129 of the PDPA 2010.
            </p>
          </Section>

          <Section title="11. Children's Privacy">
            <p>
              Our services are not directed at individuals under the age of <strong className="text-white">18</strong>. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a person under 18, please contact us immediately for deletion.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Material changes will be notified via a site announcement banner or email (for registered members) at least <strong className="text-white">14 days</strong> before the change takes effect. Continued use of our services after the effective date constitutes acceptance of the revised policy.
            </p>
            <p className="text-gray-500 text-xs">
              All prior versions of this policy are archived and available on request.
            </p>
          </Section>

          <Section title="13. Contact & Data Officer">
            <p>
              For all data protection enquiries, access requests, correction requests, or complaints, please visit our <Link href="/contact" className="text-blue-500 hover:text-white transition-colors">Contact Us</Link> page.
            </p>
            <p className="text-gray-500 text-xs">
              Vault 6 Studios operates as a private seller of collectible figures, registered and operating within Malaysia.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-wrap gap-6 justify-center">
          <Link href="/terms" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Terms &amp; Conditions
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
