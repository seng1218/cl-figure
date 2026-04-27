"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, ShieldCheck, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TrackingModule() {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsTracking(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/track/?id=${encodeURIComponent(orderId.trim())}`);
      const data = await res.json();

      if (data.success) {
        setResult(data.tracking);
      } else {
        setError(data.error || 'Failed to find artifact.');
      }
    } catch (err) {
      setError('Connection error. Try again.');
    } finally {
      setIsTracking(false);
    }
  };

  const steps = [
    { id: 'pending', label: 'Order Placed', icon: Package },
    { id: 'processing', label: 'Secured in Vault', icon: ShieldCheck },
    { id: 'dispatched', label: 'Dispatched', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getStepIndex = (status) => {
    return steps.findIndex(s => s.id === status);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">ARTIFACT TRACKING</h2>
          <p className="text-gray-400 text-sm font-bold mb-8">Enter your Vault 6 Order ID to track the deployment status of your figure.</p>

          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="e.g. V6-XXXX-XXX"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 text-white pl-12 pr-4 py-4 rounded-xl font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all uppercase placeholder:normal-case"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isTracking || !orderId}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isTracking ? 'Scanning...' : 'Track Artifact'}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex items-center gap-3 text-red-500"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-bold text-sm">{error}</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 pt-4 border-t border-gray-800"
              >
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Status</p>
                    <p className="text-2xl font-black text-blue-500 uppercase tracking-wider">{result.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Items</p>
                    <p className="text-sm font-bold text-white">{result.items?.length || 0} Artifact(s)</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative pt-8">
                  <div className="absolute top-12 left-6 right-6 h-1 bg-gray-800 rounded-full hidden md:block" />
                  <div 
                    className="absolute top-12 left-6 h-1 bg-blue-600 rounded-full hidden md:block transition-all duration-1000"
                    style={{ width: `calc(${(getStepIndex(result.status) / 3) * 100}% - 3rem)` }}
                  />

                  <div className="flex flex-col md:flex-row justify-between relative z-10 gap-6 md:gap-0">
                    {steps.map((step, index) => {
                      const isActive = getStepIndex(result.status) >= index;
                      const Icon = step.icon;
                      
                      return (
                        <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                            isActive ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-[#111] border-gray-800 text-gray-600'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="md:text-center">
                            <p className={`font-black text-[10px] md:text-xs uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-600'}`}>
                              {step.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* External Tracking Link */}
                {result.trackingNumber && (
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Courier details</p>
                      <p className="font-bold text-white text-lg">{result.courier || 'Courier'}</p>
                      <p className="font-mono text-blue-400 mt-1">{result.trackingNumber}</p>
                    </div>
                    <a
                      href={`https://tracking.my/track/${result.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all text-center flex justify-center items-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Live Tracking
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
