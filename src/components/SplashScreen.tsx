import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Layers, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';

interface SplashScreenProps {
  onStartAssessment: () => void;
  onOpenCatalogue: () => void;
  onOpenExplainer: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStartAssessment,
  onOpenCatalogue,
  onOpenExplainer
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white overflow-y-auto">
      {/* Background ambient lighting effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-600/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 grid-overlay opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center space-y-10 my-auto">
        
        {/* Top Badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="px-4 py-1.5 rounded-full bg-brand-900/80 border border-brand-700/60 text-brand-300 text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            HAYLEYS MATTRESSES • OFFICIAL PORTFOLIO
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
            🇨🇦 Canadian Springwall Partnership
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            🌿 100% Eco-Friendly Rubberized Coir
          </span>
        </motion.div>

        {/* Hero Branding Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
            Sleep Happily <br />
            <span className="bg-gradient-to-r from-gold-400 via-gold-200 to-brand-300 bg-clip-text text-transparent">
              Ever After.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Welcome to Sri Lanka's premier sleep experience. Combining five decades of natural Ceylon coconut coir craftsmanship with Canadian ergonomic pocket spring engineering.
          </p>
        </motion.div>

        {/* Key Business Value Pillars Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left"
        >
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl space-y-2.5 hover:border-brand-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white">10 Authentic Hayleys Models</h2>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Complete Spring, 100% Natural Rubberized Coir, and High-Resilience Foam mattress collections with up to 15-year warranty.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl space-y-2.5 hover:border-brand-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white">AI Posture Biometrics</h2>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Contactless spine mapping, natural body asymmetry analysis, BMI load modeling, and partner motion-isolation matching.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl space-y-2.5 hover:border-brand-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white">Certified Global Quality</h2>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              ISO 9001 / 14001 certified manufacturing, OEKO-TEX certified allergy-free fabrics, and Colombo flagship showrooms.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-2"
        >
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-gold-500/20 hover:shadow-gold-500/30 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Start Biometric Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCatalogue}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-brand-400" />
            <span>Explore Hayleys Catalogue</span>
          </button>

          <button
            onClick={onOpenExplainer}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-transparent hover:bg-slate-900/50 text-slate-400 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-brand-400" />
            <span>Algorithm Science</span>
          </button>
        </motion.div>

        {/* Bottom Trust Line & Showroom locations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500 font-light"
        >
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span>Experience Centers: 400 Deans Rd, Colombo 10 • Ekala • Galle</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Deterministic Math
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-gold-500" /> Canadian Springwall Certified
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SplashScreen;
