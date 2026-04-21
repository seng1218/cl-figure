"use client";
import { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TYPE_STYLES = {
  info: 'bg-blue-600/10 border-blue-900/40 text-blue-400',
  warning: 'bg-yellow-600/10 border-yellow-900/40 text-yellow-400',
  promo: 'bg-green-600/10 border-green-900/40 text-green-400',
};

export default function AnnouncementBanner() {
  const { announcement } = useCMS();
  const [dismissed, setDismissed] = useState(false);

  if (!announcement?.enabled || dismissed || !announcement.text) return null;

  const style = TYPE_STYLES[announcement.type] || TYPE_STYLES.info;
  const content = (
    <span className="flex items-center gap-2 justify-center flex-1 text-center">
      {announcement.text}
      {announcement.link && <ArrowRight size={12} className="shrink-0" />}
    </span>
  );

  return (
    <div className={`w-full border-b ${style} py-2 px-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest relative z-[110]`}>
      {announcement.link ? (
        <Link href={announcement.link} className="flex-1 flex items-center gap-2 justify-center hover:opacity-80 transition-opacity">
          {content}
        </Link>
      ) : (
        <div className="flex-1">{content}</div>
      )}
      <button onClick={() => setDismissed(true)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        <X size={12} />
      </button>
    </div>
  );
}
