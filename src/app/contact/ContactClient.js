"use client";
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';

const Section = ({ title, children }) => (
  <div className="border-b border-gray-900 pb-10 mb-10">
    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 text-sm leading-relaxed">{children}</div>
  </div>
);

export default function ContactClient() {
  const { contact, site } = useCMS();
  const whatsapp = contact?.whatsapp;
  const email = contact?.email;
  const address = contact?.address;

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
            <MessageCircle size={14} /> Get In Touch
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none mb-4">
            CONTACT US
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Vault 6 Studios &nbsp;·&nbsp; Malaysia
          </p>
        </div>

        <div className="prose-invert">

          <Section title="Company Details">
            <div className="border border-gray-800 p-6 rounded-lg space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#111] border border-gray-800 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">
                    {site?.name || 'Vault 6 Studios'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {site?.tagline || 'by Crafted Legacies'}
                  </p>
                  {address ? (
                    <p className="text-gray-400 text-sm mt-1">{address}</p>
                  ) : (
                    <p className="text-gray-600 text-xs mt-1">Malaysia</p>
                  )}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Contact Channels">
            <div className="space-y-4">

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 border border-gray-800 hover:border-blue-600/50 bg-[#0a0a0a] hover:bg-blue-600/5 p-5 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-green-600/10 border border-green-600/20 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle size={18} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">WhatsApp</p>
                    <p className="text-gray-400 text-sm">{whatsapp}</p>
                    <p className="text-gray-600 text-xs mt-1">Preferred channel &mdash; fastest response</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-5 border border-gray-800 hover:border-blue-600/50 bg-[#0a0a0a] hover:bg-blue-600/5 p-5 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-600/10 border border-blue-600/20 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">Email</p>
                    <p className="text-gray-400 text-sm">{email}</p>
                    <p className="text-gray-600 text-xs mt-1">For formal enquiries, PDPA requests, and written correspondence</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                </a>
              )}

              {!whatsapp && !email && (
                <div className="border border-gray-800 p-5 rounded-xl">
                  <p className="text-gray-500 text-sm">Contact details are being updated. Please check back shortly.</p>
                </div>
              )}
            </div>
          </Section>

          <Section title="Response Times">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#111] border border-gray-800 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={14} className="text-blue-500" />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-gray-500 text-xs">Typically within <strong className="text-white">a few hours</strong> during business hours. We aim to respond to all messages within 24 hours.</p>
                </div>
                <div>
                  <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">Email</p>
                  <p className="text-gray-500 text-xs">Within <strong className="text-white">1–2 business days</strong>. For urgent matters, WhatsApp is recommended.</p>
                </div>
                <p className="text-gray-600 text-xs border-t border-gray-900 pt-3 mt-3">
                  Business hours: Monday – Friday, 10:00&nbsp;AM – 10:00&nbsp;PM (Malaysia Time, UTC+8). We may respond outside these hours but cannot guarantee it.
                </p>
              </div>
            </div>
          </Section>

          <Section title="What to Include in Your Message">
            <p>To help us resolve your enquiry as quickly as possible, please include the following where applicable:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-500">
              <li><strong className="text-white">Order reference number</strong> — found in your order confirmation or WhatsApp notification</li>
              <li><strong className="text-white">Your name</strong> as provided during checkout</li>
              <li><strong className="text-white">Description of the issue</strong> — with photos if your enquiry relates to condition, damage, or returns</li>
              <li><strong className="text-white">Your preferred resolution</strong> — refund, replacement, or other</li>
            </ul>
          </Section>

          <Section title="Types of Enquiries">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Order & Payment', items: ['Payment confirmation', 'Order status', 'Pre-order timelines', 'Invoice requests'] },
                { title: 'Shipping & Delivery', items: ['Tracking numbers', 'Delayed deliveries', 'Failed delivery', 'Address corrections'] },
                { title: 'Returns & Refunds', items: ['Damaged items', 'Wrong item received', 'Refund status', 'Return logistics'] },
                { title: 'Product Enquiries', items: ['Additional photos', 'Condition clarification', 'Authenticity verification', 'Product availability'] },
              ].map(({ title, items }) => (
                <div key={title} className="border border-gray-800 p-4 rounded-lg">
                  <p className="text-white font-black text-[10px] uppercase tracking-widest mb-3">{title}</p>
                  <ul className="space-y-1">
                    {items.map(item => (
                      <li key={item} className="text-gray-500 text-xs flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-600 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Data Protection Enquiries">
            <p>
              For requests under the <strong className="text-white">Personal Data Protection Act 2010 (PDPA)</strong> — including data access, correction, or withdrawal of consent — please contact us via email with the subject line <strong className="text-white">&ldquo;PDPA Data Request&rdquo;</strong>. We will respond within <strong className="text-white">21 business days</strong> and may require identity verification before processing the request.
            </p>
            <p>
              See our <Link href="/privacy-policy" className="text-blue-500 hover:text-white transition-colors">Privacy Policy</Link> for full details on your data rights.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-wrap gap-6">
          <Link href="/about" className="text-blue-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            About Us
          </Link>
          <Link href="/terms" className="text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Terms &amp; Conditions
          </Link>
          <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/return-policy" className="text-gray-600 hover:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
            Return &amp; Refund Policy
          </Link>
        </div>

      </div>
    </main>
  );
}
