import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  BedDouble,
  User,
  Users
} from 'lucide-react';

interface SplashScreenProps {
  onStartAssessment: () => void;
  onOpenCatalogue: () => void;
  onOpenExplainer?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStartAssessment,
  onOpenCatalogue
}) => {
  const [sleeperType, setSleeperType] = useState<'individual' | 'couple'>('individual');
  const [userName, setUserName] = useState<string>('');

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      sessionStorage.setItem('hayleys_user_name', userName.trim());
      sessionStorage.setItem('hayleys_sleeper_type', sleeperType);
    }
    onStartAssessment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 text-white overflow-y-auto p-3 sm:p-6 backdrop-blur-2xl">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#4A90E2]/25 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#194983]/35 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute inset-0 grid-overlay opacity-25" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl bg-slate-900 text-slate-900 rounded-3xl overflow-hidden shadow-2xl my-auto grid grid-cols-1 lg:grid-cols-12 border-2 border-[#4A90E2]/40"
      >
        {/* Large Prominent High-Contrast Visual Section (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#081628] p-4 sm:p-6 flex flex-col justify-between items-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#194983]">
          
          {/* Subtle glow behind the image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#194983]/40 via-transparent to-[#4A90E2]/30 pointer-events-none" />

          {/* Top Brand Tagline */}
          <div className="w-full flex items-center justify-between pb-3 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#194983] to-[#4A90E2] flex items-center justify-center text-white shadow-md">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white leading-none tracking-tight">
                  HAYLEYS <span className="text-[#4A90E2]">MATTRESSES</span>
                </h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                  OFFICIAL SLEEP PORTAL
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#194983]/60 border border-[#4A90E2]/50 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#4A90E2]" />
              Official Visual Showcase
            </span>
          </div>

          {/* LARGE HIGH-CONTRAST IMAGE CONTAINER */}
          <div className="w-full my-auto py-2 z-10 flex items-center justify-center">
            <div className="relative w-full max-w-[480px] max-h-[520px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#4A90E2]/50 bg-black group">
              <img 
                src="/content.jpg" 
                alt="Hayleys Mattresses Sleep Happily Ever After" 
                className="w-full h-full max-h-[520px] object-contain object-center bg-[#081628] group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/content.png';
                }}
              />
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="w-full pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-medium z-10">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gold-400" />
              <span>Canadian Springwall License</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Natural Rubberized Coir</span>
            </div>
          </div>
        </div>

        {/* Right Welcome & Action Form (5 cols on lg) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#194983]/10 text-[#194983] text-[10px] font-extrabold uppercase tracking-wider">
              Smart Mattress Recommender
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              Sleep Happily <br />
              <span className="text-[#194983]">Ever After.</span>
            </h2>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Find your ideal mattress matched to your posture, comfort feel, and spinal support needs.
            </p>
          </div>

          {/* Simple Form */}
          <form onSubmit={handleEnter} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Your Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kasun Perera"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Sleeping Arrangement
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSleeperType('individual')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    sleeperType === 'individual'
                      ? 'bg-[#194983]/10 border-[#194983] text-[#194983] shadow-xs ring-1 ring-[#194983]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4 text-[#194983]" />
                  <div>
                    <span className="text-xs font-bold block leading-tight">Solo Sleeper</span>
                    <span className="text-[10px] text-slate-400 block">Single / Queen</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSleeperType('couple')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    sleeperType === 'couple'
                      ? 'bg-[#194983]/10 border-[#194983] text-[#194983] shadow-xs ring-1 ring-[#194983]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#194983]" />
                  <div>
                    <span className="text-xs font-bold block leading-tight">Couple</span>
                    <span className="text-[10px] text-slate-400 block">Queen / King</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#194983] to-[#4A90E2] hover:from-[#133867] hover:to-[#357ecf] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#194983]/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Find My Perfect Mattress</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onOpenCatalogue}
                className="w-full py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#194983]" />
                <span>Explore Full Catalogue</span>
              </button>
            </div>
          </form>

          {/* Quick Direct Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              onClick={onStartAssessment}
              className="text-[11px] text-slate-400 hover:text-[#194983] font-medium transition-colors cursor-pointer"
            >
              Skip directly to mattress collection →
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default SplashScreen;
