import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { ShieldCheck, Sparkles, BookOpen, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartAssessment: () => void;
  onOpenCatalogue: () => void;
  onOpenExplainer?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onStartAssessment, 
  onOpenCatalogue
}) => {
  return (
    <section className="relative overflow-hidden bg-white min-h-[88vh] flex items-center pt-24 pb-16">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-[#4A90E2]/10 blur-[110px] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-[#194983]/10 blur-[90px] -z-10 -translate-x-1/4 translate-y-1/4" />
      
      {/* Subtle blueprint grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30 -z-20" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headings and Story */}
        <div className="lg:col-span-7 text-left space-y-8">
          
          {/* Brand Tagline Chip */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#194983]/10 border border-[#4A90E2]/30 text-[#194983] text-xs font-bold uppercase tracking-wider shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#4A90E2]" />
            HAYLEYS MATTRESSES • SLEEP HAPPILY EVER AFTER
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 leading-[1.1]"
          >
            Find Your Ideal <br />
            <span className="text-gradient">Hayleys Mattress</span>
          </motion.h1>

          {/* Clean Customer-Centric Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 font-light max-w-2xl leading-relaxed"
          >
            Wake up revitalized every morning. Whether you need the buoyant pressure relief of <strong>Pocketed Springs</strong>, the posture-aligning firmness of <strong>100% Natural Rubberized Coir</strong>, or the soothing cooling of <strong>Gel Memory Foam</strong>, our simple recommender pairs you with the perfect mattress.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Button variant="primary" size="lg" onClick={onStartAssessment} className="shadow-lg shadow-[#194983]/20">
              <span>Find My Perfect Mattress</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onOpenCatalogue}
              className="flex items-center gap-2 border-slate-300 hover:border-[#194983]"
            >
              <BookOpen className="w-4 h-4 text-[#194983]" />
              Browse Full Catalogue
            </Button>
          </motion.div>

          {/* Trust Factors */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-slate-100 flex flex-wrap gap-6 text-slate-600 text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#194983] shrink-0" />
              <span>Canadian Springwall License</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Natural Ceylon Coir</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4A90E2] shrink-0" />
              <span>Up to 10-Year Warranty</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual Product Showcase Card */}
        <div className="lg:col-span-5 flex justify-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[430px] relative"
          >
            {/* Main Showcase Card */}
            <div className="rounded-3xl bg-white p-5 shadow-2xl border border-slate-200/80 space-y-4 relative overflow-hidden">
              
              {/* Featured Mattress Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                <img 
                  src="/Pristine Euro Top.jpg" 
                  alt="Pristine Euro Top Mattress" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#194983] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Signature Collection
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold shadow-sm">
                  10-Year Warranty
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-extrabold text-slate-900">Pristine Euro Top</h4>
                  <span className="text-xs font-bold text-[#194983]">Spring Series</span>
                </div>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Pocketed springs with 3" natural latex Euro top for zero partner disturbance and cooling comfort.
                </p>
              </div>

              {/* 3 Mattress Series Highlights */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Spring</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">Euro Top</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Coir</span>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">Orthopaedic</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Foam</span>
                  <span className="text-xs font-bold text-[#194983] block mt-0.5">Comfy Gel</span>
                </div>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-4 -left-4 p-3 rounded-2xl bg-white shadow-xl flex items-center gap-2.5 border border-slate-100 text-slate-900">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-800">100% Genuine Sri Lankan Heritage</span>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
