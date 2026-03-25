"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Unlock, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function VaultEntrance({ isOpen, onComplete }) {
  const [scanState, setScanState] = useState('idle'); // idle, scanning, granted, failed
  const [progress, setProgress] = useState(0);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setScanState('idle');
      setProgress(0);
    }
  }, [isOpen]);

  const handleTap = () => {
    if (scanState !== 'idle') return;
    setScanState('scanning');
    
    // Simulate a fast, premium biometric scan sequence
    setTimeout(() => {
      handleSuccess();
    }, 1200); // 1.2 seconds is enough for flair without being tedious
  };

  const handleSuccess = () => {
    setScanState('granted');
    setTimeout(() => {
      onComplete();
    }, 1000); // 1s delay before closing
  };

  // Clean up on unmount
  useEffect(() => {
    return () => clearInterval(scanIntervalRef.current);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center font-black select-none pointer-events-auto overflow-hidden"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
          <div 
            className="absolute inset-0 pointer-events-none opacity-20" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} 
          />

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 flex flex-col items-center gap-12"
          >
            {/* The Scanner Mechanism */}
            <div 
              onClick={handleTap}
              className="relative w-64 h-64 flex items-center justify-center cursor-pointer group"
            >
              {/* Central Ring */}
              <div className={`absolute inset-4 rounded-full border bg-gray-900 flex items-center justify-center z-10 transition-colors duration-300
                ${scanState === 'scanning' ? 'border-blue-500 shadow-[inset_0_0_30px_rgba(37,99,235,0.5)] shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]'}
              `}>
                {scanState === 'granted' ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Unlock size={64} className="text-green-500" strokeWidth={1} />
                  </motion.div>
                ) : scanState === 'failed' ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <AlertTriangle size={64} className="text-red-500" strokeWidth={1} />
                  </motion.div>
                ) : (
                  <Fingerprint 
                    size={80} 
                    className={`transition-colors duration-300 ${scanState === 'scanning' ? 'text-blue-500' : 'text-gray-600 group-hover:text-blue-400'}`} 
                    strokeWidth={1} 
                  />
                )}
              </div>

              {/* Scanner Ring (SVG) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none">
                <circle 
                  cx="128" 
                  cy="128" 
                  r="120" 
                  fill="none" 
                  stroke="rgba(37, 99, 235, 0.15)" 
                  strokeWidth="6" 
                />
                <motion.circle 
                  cx="128" 
                  cy="128" 
                  r="120" 
                  fill="none" 
                  stroke={scanState === 'granted' ? '#22c55e' : '#3b82f6'} 
                  strokeWidth="6" 
                  strokeDasharray="754" 
                  initial={{ strokeDashoffset: 754 }}
                  animate={{ strokeDashoffset: scanState === 'scanning' ? 0 : (scanState === 'granted' ? 0 : 754) }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
              </svg>

              {/* Outer Rotating Dashed Ring 1 */}
              <motion.div 
                animate={{ rotate: scanState === 'scanning' ? 360 : 0 }}
                transition={{ duration: scanState === 'scanning' ? 2 : 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-blue-500/30 border-dashed z-0 opacity-50"
                style={{ borderWidth: '4px' }}
              />

              {/* Outer Rotating Dashed Ring 2 */}
              <motion.div 
                animate={{ rotate: scanState === 'scanning' ? -360 : 0 }}
                transition={{ duration: scanState === 'scanning' ? 3 : 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-full border-gray-600/30 border-dashed z-0 opacity-40"
                style={{ borderWidth: '2px' }}
              />

              {/* Scanning Laser Line */}
              {scanState === 'scanning' && (
                <motion.div 
                  initial={{ top: '25%' }}
                  animate={{ top: '75%' }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                  className="absolute left-10 right-10 h-1 bg-blue-500/80 shadow-[0_0_20px_rgba(37,99,235,1)] z-30 rounded-full blur-[1px]"
                />
              )}
            </div>

            {/* Status Information */}
            <div className="text-center h-24 flex flex-col items-center justify-start pointer-events-none">
              <motion.h2 
                key={scanState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xl md:text-2xl tracking-[0.2em] md:tracking-[0.4em] uppercase mb-4 text-cyan-50 
                  ${scanState === 'granted' ? '!text-green-500' : ''}`}
                style={{ textShadow: scanState === 'scanning' ? '0 0 15px rgba(37,99,235,0.6)' : 'none' }}
              >
                {scanState === 'idle' && "Tap to Authenticate"}
                {scanState === 'scanning' && "Analyzing Biometrics"}
                {scanState === 'granted' && "Access Granted"}
              </motion.h2>

              <div className="text-gray-500 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold flex flex-col gap-1 items-center">
                {scanState === 'idle' && <span>Initialize vault scanner protocol</span>}
                {scanState === 'scanning' && <span className="text-blue-400">Verifying signature match</span>}
                {scanState === 'granted' && <span>Welcome back to the Vault</span>}
                
                {/* Simulated Terminal Data Feed for extra effect during scan */}
                {scanState === 'scanning' && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} className="mt-4 text-blue-500 font-mono text-[8px] md:text-[10px]"
                  >
                    {[...Array(3)].map((_, i) => (
                      <div key={i}>{Math.random().toString(36).substring(2, 20).toUpperCase()}</div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
