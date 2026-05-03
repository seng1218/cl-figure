"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, AlertTriangle, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MemberAccess() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const router = useRouter();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('idle');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regStatus, setRegStatus] = useState('idle');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'register') setTab('register');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus('loading');
    setLoginError('');
    try {
      const res = await fetch('/api/member/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push('/member');
      } else {
        setLoginStatus('error');
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch {
      setLoginStatus('error');
      setLoginError('Connection failed. Try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      setRegStatus('error');
      setRegError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 8) {
      setRegStatus('error');
      setRegError('Password must be at least 8 characters.');
      return;
    }
    setRegStatus('loading');
    setRegError('');
    try {
      const res = await fetch('/api/member/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, name: regName, password: regPassword, confirmPassword: regConfirm }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push('/member');
      } else {
        setRegStatus('error');
        setRegError(data.error || 'Registration failed.');
      }
    } catch {
      setRegStatus('error');
      setRegError('Connection failed. Try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-10 md:p-12 max-w-md w-full relative z-10 shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
      >
        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.6em] flex items-center gap-3 mb-5">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
            Syndicate Member Portal
          </p>
          <Lock size={28} className="text-blue-600 mb-4" strokeWidth={1} />
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            {tab === 'login' ? 'Member Access' : 'Join Syndicate'}
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl overflow-hidden border border-gray-800 mb-8">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-[10px] uppercase tracking-widest transition-all ${
              tab === 'login'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <LogIn size={12} /> Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-[10px] uppercase tracking-widest transition-all ${
              tab === 'register'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <UserPlus size={12} /> Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-gray-700"
                />
              </div>

              <AnimatePresence>
                {loginStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 bg-red-900/10 border border-red-900/30 p-4"
                  >
                    <AlertTriangle size={14} className="text-red-500 shrink-0" />
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">{loginError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loginStatus === 'loading'}
                className="w-full bg-blue-600 text-white py-5 font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loginStatus === 'loading'
                  ? <span className="animate-pulse">Authenticating...</span>
                  : <>Access Portal <ArrowRight size={14} /></>
                }
              </button>

              <p className="text-center text-gray-700 text-[10px] font-bold uppercase tracking-widest pt-2">
                No account?{' '}
                <button type="button" onClick={() => setTab('register')} className="text-blue-600/70 hover:text-blue-500 transition-colors">
                  Register here
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Operative Name <span className="text-gray-700 normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  autoComplete="name"
                  placeholder="Your name..."
                  className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  className="w-full bg-[#050505] border border-gray-800 text-white p-4 font-bold text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-gray-700"
                />
              </div>

              <AnimatePresence>
                {regStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 bg-red-900/10 border border-red-900/30 p-4"
                  >
                    <AlertTriangle size={14} className="text-red-500 shrink-0" />
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">{regError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={regStatus === 'loading'}
                className="w-full bg-white text-black py-5 font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {regStatus === 'loading'
                  ? <span className="animate-pulse">Provisioning Access...</span>
                  : <>Request Clearance <ArrowRight size={14} /></>
                }
              </button>

              <p className="text-center text-gray-700 text-[10px] font-bold uppercase tracking-widest pt-2">
                Already a member?{' '}
                <button type="button" onClick={() => setTab('login')} className="text-blue-600/70 hover:text-blue-500 transition-colors">
                  Sign in
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-gray-900 flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">
            ← Vault
          </Link>
          <Link href="/shop" className="text-gray-600 hover:text-blue-500 text-[10px] uppercase tracking-widest font-bold transition-colors">
            Browse Collection
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
