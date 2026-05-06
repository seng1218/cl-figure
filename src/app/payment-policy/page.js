import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Payment Policy | Vault 6 Studios',
  description: 'Payment policy for Vault 6 Studios — accepted methods, security, refund processing, and Razorpay Curlec payment gateway information.',
};

const Section = ({ title, children }) => (
  <div className="border-b border-gray-900 pb-10 mb-10">
    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 text-sm leading-relaxed">{children}</div>
  </div>
);

export default function PaymentPolicyPage() {
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
            <CreditCard size={14} /> Legal
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none mb-4">
            PAYMENT POLICY
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Effective: 1 May 2026 &nbsp;·&nbsp; Jurisdiction: Malaysia
          </p>
        </div>

        <div className="prose-invert">

          <Section title="1. Payment Processor">
            <p>
              All payments on <strong className="text-white">vault6studios.com</strong> are processed by <strong className="text-white">Curlec Sdn. Bhd.</strong>, a Malaysia-incorporated company operating as <strong className="text-white">Razorpay Curlec</strong>, a licensed payment service provider regulated by <strong className="text-white">Bank Negara Malaysia (BNM)</strong> under the Financial Services Act 2013.
            </p>
            <p>
              When you proceed to payment, you will be redirected to Razorpay Curlec&rsquo;s secure hosted payment page. By completing payment, you also agree to Razorpay Curlec&rsquo;s Terms of Service and Privacy Policy.
            </p>
            <p className="text-gray-500 text-xs border border-gray-800 p-4 rounded-lg">
              Vault 6 Studios does not directly handle, process, or store any payment card data. All sensitive payment information is transmitted directly to Razorpay Curlec and subject to their PCI DSS-compliant infrastructure.
            </p>
          </Section>

          <Section title="2. Accepted Payment Methods">
            <p>The following payment methods are accepted at checkout, subject to availability via Razorpay Curlec&rsquo;s gateway:</p>

            <div className="space-y-6">
              <div>
                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-2">FPX Online Banking</p>
                <p className="text-gray-500 text-xs mb-2">Direct bank transfer via Financial Process Exchange (FPX), available for all major Malaysian banks:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500 text-xs columns-2">
                  <li>Maybank2u</li>
                  <li>CIMB Clicks</li>
                  <li>Public Bank</li>
                  <li>RHB Now</li>
                  <li>Hong Leong Connect</li>
                  <li>AmBank</li>
                  <li>Bank Islam</li>
                  <li>Bank Rakyat</li>
                  <li>BSN</li>
                  <li>And others</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Credit &amp; Debit Cards</p>
                <p className="text-gray-500 text-xs">Visa and Mastercard credit and debit cards are accepted. Cards must be enabled for online/international transactions. 3D Secure authentication may be required.</p>
              </div>

              <div>
                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-2">E-Wallets</p>
                <p className="text-gray-500 text-xs mb-2">Selected Malaysian e-wallets are supported, subject to Razorpay Curlec gateway availability:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500 text-xs columns-2">
                  <li>GrabPay</li>
                  <li>Touch &lsquo;n Go eWallet</li>
                  <li>Boost</li>
                  <li>ShopeePay</li>
                </ul>
                <p className="text-gray-600 text-xs mt-2">Available e-wallet options are determined by HitPay and may change without prior notice.</p>
              </div>
            </div>

            <p className="text-gray-500 text-xs border border-gray-800 p-4 rounded-lg">
              We do not accept cash payments, bank transfers made outside the Razorpay Curlec checkout, or cryptocurrency. All payments must be completed via the Razorpay Curlec payment page presented at checkout.
            </p>
          </Section>

          <Section title="3. Currency & Pricing">
            <p>
              All prices displayed on vault6studios.com are in <strong className="text-white">Malaysian Ringgit (MYR)</strong>, inclusive of applicable taxes. The amount charged at checkout is the final MYR amount displayed.
            </p>
            <p>
              If you are paying with a card issued in a foreign currency, your card issuer will apply their prevailing exchange rate and any applicable foreign transaction fees. Vault 6 Studios is not responsible for exchange rate differences or foreign transaction charges imposed by your bank or card issuer.
            </p>
            <p>
              Prices are subject to change at any time prior to order confirmation. The price applicable to your order is the price displayed at the time your payment is successfully processed.
            </p>
          </Section>

          <Section title="4. When Payment Is Charged">
            <p>
              Payment is charged <strong className="text-white">in full at the time of checkout</strong> for all order types, including:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Ready Stock orders</strong> — Full payment charged upon checkout. Order is fulfilled and dispatched within 1–2 business days.</li>
              <li><strong className="text-white">Pre-Order items</strong> — Full payment charged at the time of pre-order placement. Items are dispatched upon arrival from the manufacturer or distributor.</li>
            </ul>
            <p>
              A binding sale is formed only when Razorpay Curlec confirms successful payment and we dispatch a written order confirmation via WhatsApp or email, in accordance with Section 5 of our <Link href="/terms" className="text-blue-500 hover:text-white transition-colors">Terms &amp; Conditions</Link>.
            </p>
          </Section>

          <Section title="5. Payment Security">
            <p>
              Vault 6 Studios and Razorpay Curlec implement the following security measures to protect your payment:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-white">PCI DSS Compliance:</strong> Razorpay Curlec is PCI DSS compliant. All card data is handled exclusively within their certified secure environment. We do not receive or store full card numbers, CVVs, or expiry dates.
              </li>
              <li>
                <strong className="text-white">HTTPS Encryption:</strong> All data transmitted between your browser and our site, and between our site and Razorpay Curlec, is encrypted using TLS 1.2 or higher.
              </li>
              <li>
                <strong className="text-white">3D Secure (3DS):</strong> Where supported, card payments may be subject to 3DS authentication (Verified by Visa / Mastercard SecureCode), adding an additional verification step via your card issuer.
              </li>
              <li>
                <strong className="text-white">No Stored Card Data:</strong> We do not store any payment card information in our systems. Each transaction is processed independently through Razorpay Curlec.
              </li>
            </ul>
            <p className="text-gray-500 text-xs">
              If you suspect any fraudulent activity related to a transaction on our site, contact us immediately via WhatsApp and notify your bank or card issuer.
            </p>
          </Section>

          <Section title="6. Failed & Declined Payments">
            <p>
              If your payment is declined or fails to process:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>No order will be placed and no charge will be made to your account.</li>
              <li>You may attempt payment again using the same or a different payment method.</li>
              <li>Common reasons for decline include insufficient funds, card restrictions on online transactions, incorrect card details, or issuer security holds.</li>
              <li>If you continue to experience issues, contact your bank or card issuer first, then contact us for assistance.</li>
            </ol>
            <p className="text-gray-500 text-xs">
              Vault 6 Studios is not liable for any charges imposed by your bank or card issuer in connection with failed payment attempts.
            </p>
          </Section>

          <Section title="7. Refund Processing">
            <p>
              Where a refund is approved under our <Link href="/return-policy" className="text-blue-500 hover:text-white transition-colors">Return &amp; Refund Policy</Link> or due to a seller-initiated cancellation:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Refunds are processed via the <strong className="text-white">original payment method</strong> where possible.</li>
              <li>Refunds are initiated by us through Razorpay Curlec within the timeframe specified in our Return Policy (<strong className="text-white">7–14 business days</strong> after approval).</li>
              <li>The time for a refund to appear in your account depends on your bank or e-wallet provider and may take an additional 3–10 business days after we initiate the refund.</li>
              <li>Original shipping fees are non-refundable unless the return is due to our error.</li>
              <li>Razorpay Curlec processing fees may be deducted from refunds where applicable — we will communicate this clearly before processing.</li>
            </ul>
            <p className="text-gray-500 text-xs">
              If you have not received your refund within the expected timeframe, please contact us with your order reference number for investigation.
            </p>
          </Section>

          <Section title="8. Chargebacks & Payment Disputes">
            <p>
              We take payment integrity seriously. If you have a concern about a charge, we ask that you contact us directly before initiating a chargeback with your bank or card issuer. Most disputes can be resolved quickly through direct communication.
            </p>
            <p>
              Initiating a chargeback or payment reversal without first contacting us constitutes a <strong className="text-white">breach of our Terms &amp; Conditions</strong> (Section 11 — Prohibited Conduct). We reserve the right to contest chargebacks with documentation of order fulfilment and communications.
            </p>
            <p>
              In cases of confirmed fraud or genuine billing errors, we will cooperate fully with Razorpay Curlec and your financial institution to resolve the matter promptly.
            </p>
          </Section>

          <Section title="9. Pre-Order Payment Terms">
            <p>
              Pre-order payments are governed by Section 7 of our <Link href="/terms" className="text-blue-500 hover:text-white transition-colors">Terms &amp; Conditions</Link>. Key payment-specific provisions:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Full payment is collected at the time of pre-order. We do not currently offer deposit or instalment arrangements.</li>
              <li>Buyer-initiated cancellations are eligible for a full refund within <strong className="text-white">14 days</strong> of placing the pre-order.</li>
              <li>After 14 days, pre-order payments are non-refundable on buyer-initiated cancellation, as procurement commitments will have been made.</li>
              <li>If we cancel the pre-order (discontinued item, sourcing failure), a <strong className="text-white">full refund</strong> is issued within 7 business days.</li>
            </ul>
          </Section>

          <Section title="10. Contact">
            <p>
              For all payment-related enquiries — including failed transactions, refund status, or billing discrepancies — contact us via our <Link href="/contact" className="text-blue-500 hover:text-white transition-colors">Contact Us</Link> page. Please include your order reference number and a description of the issue.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-wrap gap-6 justify-center">
          <Link href="/terms" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Terms &amp; Conditions
          </Link>
          <Link href="/return-policy" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Return &amp; Refund Policy
          </Link>
          <Link href="/privacy-policy" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/shipping" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Shipping Policy
          </Link>
        </div>

      </div>
    </main>
  );
}
