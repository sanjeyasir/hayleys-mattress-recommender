import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { ShieldCheck, Compass, Activity } from 'lucide-react';

interface HeroProps {
  onStartAssessment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  return (
    <section className="relative overflow-hidden bg-white min-h-[90vh] flex items-center pt-20">
      {/* Premium Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-[100px] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-100/30 blur-[80px] -z-10 -translate-x-1/4 translate-y-1/4" />
      
      {/* Decorative sleep waves */}
      <div className="absolute inset-0 grid-overlay opacity-30 -z-20" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Content Column */}
        <div className="lg:col-span-7 text-left space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/50 border border-brand-200/50 text-brand-800 text-xs font-semibold uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            SHOWROOM EXPERIENCE CLINICALLY INSPIRED
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1]"
          >
            Find Your Perfect <br />
            <span className="text-gradient">SleepMatch Mattress</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-600 font-light max-w-xl leading-relaxed"
          >
            Discover your ideal sleep support through intelligent posture scans. Our rule-based alignment analysis identifies pressure zones and matches you with orthopedic mattress technology.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Button variant="primary" size="lg" onClick={onStartAssessment}>
              Start Free Assessment
            </Button>
            <a href="#how-it-works">
              <Button variant="outline" size="lg">
                Explore Technology
              </Button>
            </a>
          </motion.div>

          {/* Quick specs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-8 border-t border-slate-100 flex gap-6 text-slate-500 text-sm font-light"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-600" />
              <span>No AI Guesswork</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              <span>Optical Geometry Scan</span>
            </div>
          </motion.div>
        </div>

        {/* Abstract Premium Visuals Column */}
        <div className="lg:col-span-5 flex justify-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-[400px] h-[450px] relative flex items-center justify-center"
          >
            {/* Background glowing rings */}
            <div className="absolute inset-0 rounded-full border border-slate-100 animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-brand-100/50 animate-pulse-slow" />
            
            {/* Floating visual elements */}
            <div className="absolute top-10 left-10 p-4 rounded-2xl bg-white shadow-xl flex items-center gap-3 border border-slate-100">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold text-slate-800">Spine Neutrality Match</span>
            </div>

            <div className="absolute bottom-16 right-4 p-4 rounded-2xl bg-white shadow-xl flex items-center gap-3 border border-slate-100">
              <div className="text-gold-600 text-xs font-bold font-serif">100%</div>
              <span className="text-xs text-slate-800">Natural Dunlop Latex</span>
            </div>

            {/* Inner Graphic card (mattress contour map representation) */}
            <div className="w-[85%] h-[75%] rounded-3xl bg-slate-950 text-white p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Postural Map</h4>
                  <p className="text-sm font-medium">SmartSleep Clinic</p>
                </div>
                <div className="px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500 text-[10px] text-brand-300">
                  CV Engine Active
                </div>
              </div>

              {/* Dynamic Wave (representing a sleeping body contour in a glowing line) */}
              <div className="my-auto relative h-24 flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.08)" />
                  <line x1="150" y1="0" x2="150" y2="100" stroke="rgba(255,255,255,0.08)" />
                  
                  {/* Spline spine curvature path */}
                  <path 
                    d="M 10 50 Q 50 20, 100 50 T 200 50 T 290 50" 
                    fill="none" 
                    stroke="rgba(59, 130, 246, 0.8)" 
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                  {/* Glowing Points */}
                  <circle cx="50" cy="35" r="4" fill="#3b82f6" />
                  <circle cx="150" cy="50" r="4" fill="#ef4444" />
                  <circle cx="245" cy="50" r="4" fill="#10b981" />
                </svg>
              </div>

              <div className="flex justify-between items-end border-t border-slate-800 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Estimated Symmetry</span>
                  <span className="font-semibold text-brand-300">98% Correct Alignment</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Active Support</span>
                  <span className="font-semibold text-emerald-400">Coir Core Dynamic</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
