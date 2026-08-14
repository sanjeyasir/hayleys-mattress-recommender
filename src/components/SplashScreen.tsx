import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Award, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A90E2] text-slate-900 overflow-y-auto p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg bg-white text-slate-900 rounded-3xl my-auto border border-slate-200 p-6 pt-16 sm:p-8 sm:pt-20 space-y-6 shadow-2xl shadow-black/40"
      >
        {/* Logo placed properly inside the card closer to the top border */}
        <div 
          onClick={onStartAssessment}
          className="absolute top-4 left-1/2 -translate-x-1/2 cursor-pointer transition-transform hover:scale-105 z-20"
          title="Living, Sleeping & Beyond (LS&B) - Hayleys Mattresses"
        >
          <img 
            src="/L&S B.png" 
            alt="LS&B - Living, Sleeping & Beyond" 
            className="h-10 sm:h-12 w-auto object-contain max-w-[140px] sm:max-w-[165px]"
          />
        </div>

        {/* Top Header with Sleep Recommender badge, centered */}
        <div className="flex items-center justify-center pb-4 border-b border-slate-100 pt-2">
          <span className="px-3 py-1 rounded-full bg-brand-700/10 text-brand-700 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Sleep Recommender
          </span>
        </div>

        {/* Welcome Text */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            Good Sleep, <br />
            <span className="text-brand-700">Healthy Life.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Find your ideal Hayleys mattress matched to your posture, comfort feel, and spinal alignment requirements.
          </p>
        </div>

        {/* Simple Questionnaire Form */}
        <form onSubmit={handleEnter} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Sleeping Arrangement
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSleeperType('individual')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  sleeperType === 'individual'
                    ? 'bg-brand-700/10 border-brand-700 text-brand-700 shadow-xs ring-1 ring-brand-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4 text-brand-700" />
                <div>
                  <span className="text-xs font-bold block leading-tight">Solo Sleeper</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Single / Queen</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSleeperType('couple')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  sleeperType === 'couple'
                    ? 'bg-brand-700/10 border-brand-700 text-brand-700 shadow-xs ring-1 ring-brand-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4 text-brand-700" />
                <div>
                  <span className="text-xs font-bold block leading-tight">Couple / Married</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Queen / King</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Your Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kasun Perera"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all font-medium"
            />
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-700" />
              <span>Canadian Springwall</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Natural Ceylon Coir</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-700 to-brand-400 hover:from-brand-800 hover:to-brand-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-brand-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Find My Perfect Mattress</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenCatalogue}
              className="w-full py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-brand-700" />
              <span>Explore Full Catalogue</span>
            </button>
          </div>
        </form>

        {/* Quick Direct Skip */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={onStartAssessment}
            className="text-[11px] text-slate-400 hover:text-brand-700 font-medium transition-colors cursor-pointer"
          >
            Skip directly to mattress collection →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
