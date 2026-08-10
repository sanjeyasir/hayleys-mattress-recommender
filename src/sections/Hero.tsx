import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { ShieldCheck, Compass, Activity, FileText, Award, Sparkles, BedDouble } from 'lucide-react';

interface HeroProps {
  onStartAssessment: () => void;
  onOpenCatalogue: () => void;
  onOpenExplainer: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onStartAssessment, 
  onOpenCatalogue,
  onOpenExplainer 
}) => {
  return (
    <section className="relative overflow-hidden bg-white min-h-[92vh] flex items-center pt-24 pb-16">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-brand-100/50 blur-[110px] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gold-100/40 blur-[90px] -z-10 -translate-x-1/4 translate-y-1/4" />
      
      {/* Subtle blueprint grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-25 -z-20" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headings and Story */}
        <div className="lg:col-span-7 text-left space-y-8">
          
          {/* Brand Tagline Chip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-gold-500" />
            HAYLEYS MATTRESSES • SLEEP HAPPILY EVER AFTER
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 leading-[1.08]"
          >
            AI Posture Scan & <br />
            <span className="text-gradient">Hayleys Sleep Matcher</span>
          </motion.h1>

          {/* Detailed Paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-600 font-light max-w-2xl leading-relaxed"
          >
            Discover your ideal sleep surface engineered by Sri Lanka’s premier mattress manufacturer. Our client-side Computer Vision scanner analyzes spine alignment, shoulder cant, and 5-zone pressure distribution to match you with authentic <strong>Hayleys Spring, Rubberized Coir, and Foam Mattresses</strong>.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Button variant="primary" size="lg" onClick={onStartAssessment} className="shadow-lg shadow-brand-900/10">
              Start Posture Assessment
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onOpenCatalogue}
              className="flex items-center gap-2 border-slate-300 hover:border-brand-600"
            >
              <FileText className="w-4.5 h-4.5 text-brand-700" />
              View Hayleys Catalogue
            </Button>

            <button
              onClick={onOpenExplainer}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-brand-600" />
              How Algorithm Works
            </button>
          </motion.div>

          {/* Trust Factors */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-6 border-t border-slate-100 flex flex-wrap gap-6 text-slate-600 text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Canadian Springwall License</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Eco-Friendly Rubberized Coir</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-600 shrink-0" />
              <span>ISO 9001 & 14001 Standards</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Visuals Card */}
        <div className="lg:col-span-5 flex justify-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-[430px] relative"
          >
            {/* Main Interactive Dark Card */}
            <div className="rounded-3xl bg-slate-950 text-white p-7 relative overflow-hidden shadow-2xl border border-slate-800 space-y-6">
              <div className="absolute top-0 right-0 w-44 h-44 bg-brand-600/15 rounded-full blur-2xl" />
              
              {/* Card Header */}
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <span className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest block">
                    BIOMETRIC CALIBRATION
                  </span>
                  <h4 className="text-base font-extrabold text-white">Hayleys Sleep Clinic</h4>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-[10px] font-mono text-brand-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  CV Engine Active
                </div>
              </div>

              {/* Dynamic Spine Wave SVG */}
              <div className="relative h-28 bg-slate-900/90 rounded-2xl border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 grid-overlay opacity-15" />
                
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90">
                  {/* Grid Axis */}
                  <line x1="0" y1="45" x2="300" y2="45" stroke="rgba(255,255,255,0.06)" />
                  <line x1="150" y1="0" x2="150" y2="90" stroke="rgba(255,255,255,0.06)" />
                  
                  {/* Spine Neutrality Curvature Path */}
                  <path 
                    d="M 10 45 Q 60 15, 110 45 T 210 45 T 290 45" 
                    fill="none" 
                    stroke="rgba(59, 130, 246, 0.85)" 
                    strokeWidth="3.5"
                    className="animate-pulse"
                  />
                  {/* Keypoints */}
                  <circle cx="60" cy="30" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="150" cy="45" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="250" cy="45" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                </svg>

                <div className="absolute bottom-2 left-3 text-[9px] font-mono text-slate-400">
                  θ=1.2° • ΔS=8.4px (Spine Neutral)
                </div>
              </div>

              {/* 3 Mattress Category Indicators */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold block">Spring Series</span>
                  <span className="text-xs font-bold text-white block mt-0.5">Euro & Pocket</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold block">Coir Series</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">Ortho Relief</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold block">Foam Series</span>
                  <span className="text-xs font-bold text-sky-400 block mt-0.5">Comfy Gel</span>
                </div>
              </div>

              {/* Bottom Spec Footer */}
              <div className="flex justify-between items-center border-t border-slate-800 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Catalog Models</span>
                  <span className="font-bold text-brand-300">10 Certified Mattresses</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Warranty Cover</span>
                  <span className="font-bold text-gold-400">Up to 10 Years</span>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-4 -left-4 p-3 rounded-2xl bg-white shadow-xl flex items-center gap-2.5 border border-slate-100 text-slate-900">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold">100% Sri Lankan Coir Heritage</span>
            </div>

            <div className="absolute -bottom-4 -right-4 p-3 rounded-2xl bg-white shadow-xl flex items-center gap-2.5 border border-slate-100 text-slate-900">
              <BedDouble className="w-4 h-4 text-brand-700" />
              <span className="text-xs font-bold">Custom Sizes Available</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
