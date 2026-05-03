"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Calendar, LogOut, ExternalLink, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PERKS = [
  { title: 'Early Drop Access', desc: 'New vault entries 24hrs before public release.' },
  { title: 'Verified Badge', desc: 'Syndicate member status across all comms.' },
  { title: 'Flash Sale Alerts', desc: 'First notification when rare units surface.' },
];

export default function MemberPage() {
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/member/profile/', { cache: 'no-store' });
      if (!res.ok) {
        router.push('/member/login');
        return;
      }
      const data = await res.json();
      if (data.success) setMember(data.member);
      else router.push('/member/login');
    } catch {
      router.push('/member/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/member/auth/', { method: 'DELETE' });
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em]">Authenticating...</p>
        </div>
      </main>
    );
  }

  if (!member) return null;

  const memberNumber = String(parseInt(member.id, 10) % 9999 + 1).padStart(4, '0');
  const joinDate = new Date(member.joinedAt).toLocaleDateString('en-MY', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-[#050505] p-6 lg:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.04)_0%,rgba(0,0,0,1)_60%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-8 mb-12">
          <div>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] flex items-center gap-3 mb-2">
              <Shield size={12} /> Member Portal
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
              {member.name ? member.name.toUpperCase() : 'OPERATIVE'}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-colors mb-2"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>

        {/* Member Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-blue-900/30 rounded-[2rem] p-8 md:p-12 mb-8 relative overflow-hidden shadow-[0_0_60px_rgba(37,99,235,0.06)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 border-2 border-blue-800 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              <User size={32} className="text-white" strokeWidth={1.5} />
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-900/50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {member.tier || 'syndicate'}
                </span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  member.status === 'active'
                    ? 'bg-green-900/20 text-green-500 border-green-900/30'
                    : 'bg-red-900/20 text-red-500 border-red-900/30'
                }`}>
                  {member.status}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white italic tracking-tight mb-1">
                {member.name || 'Anonymous Operative'}
              </h2>
              <p className="text-gray-500 text-sm font-bold">{member.email}</p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-gray-700 text-[9px] font-black uppercase tracking-widest mb-1">Member</p>
              <p className="text-blue-600 font-black text-3xl">#{memberNumber}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Joined</p>
              <p className="text-white font-bold text-sm flex items-center gap-2">
                <Calendar size={12} className="text-blue-600" /> {joinDate}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Clearance</p>
              <p className="text-white font-bold text-sm flex items-center gap-2">
                <Shield size={12} className="text-blue-600" /> Syndicate
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Last Access</p>
              <p className="text-white font-bold text-sm flex items-center gap-2">
                <Clock size={12} className="text-blue-600" />
                {member.lastLoginAt
                  ? new Date(member.lastLoginAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'First login'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#0a0a0a] border border-gray-800 rounded-[2rem] p-8 md:p-10 mb-8"
        >
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-3 border-b border-gray-800 flex items-center gap-3">
            <Star size={14} className="text-blue-600" /> Member Privileges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PERKS.map(perk => (
              <div key={perk.title} className="space-y-2">
                <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest">{perk.title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <Link
            href="/shop"
            className="flex-1 bg-blue-600 text-white py-5 font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
          >
            Browse the Vault <ExternalLink size={12} />
          </Link>
          <Link
            href="/"
            className="flex-1 border border-gray-800 text-gray-400 py-5 font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:text-white hover:border-gray-600 transition-all"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
