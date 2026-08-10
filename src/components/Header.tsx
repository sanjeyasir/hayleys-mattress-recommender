import React from 'react';
import Button from './Button';
import { FileText, Cpu, BedDouble } from 'lucide-react';

interface HeaderProps {
  onStartAssessment: () => void;
  onOpenCatalogue: () => void;
  onOpenExplainer: () => void;
  onOpenSplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onStartAssessment, 
  onOpenCatalogue,
  onOpenExplainer,
  onOpenSplash
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Hayleys Mattresses Brand Logo */}
        <div 
          onClick={() => {
            if (onOpenSplash) onOpenSplash();
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
          title="Click to view Hayleys Business Showcase"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-950 to-brand-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all">
            <BedDouble className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950 leading-none">
                HAYLEYS <span className="text-brand-700 font-extrabold">MATTRESSES</span>
              </h1>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
              SLEEP HAPPILY EVER AFTER • AI RECOMMENDER
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider text-slate-600 uppercase">
          <a href="#how-it-works" className="hover:text-brand-700 transition-colors">How It Works</a>
          <a href="#scanner" className="hover:text-brand-700 transition-colors">Body Scanner</a>
          <a href="#technology" className="hover:text-brand-700 transition-colors">Sleep Science</a>
          <a href="#comparison" className="hover:text-brand-700 transition-colors">Compare Models</a>
        </nav>

        {/* Action Calls: Catalogue & Explainer & Assessment */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenExplainer}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Detailed explanation of recommendation math"
          >
            <Cpu className="w-3.5 h-3.5 text-brand-600" />
            <span>Algorithm Science</span>
          </button>

          <button
            onClick={onOpenCatalogue}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-brand-700" />
            <span className="hidden sm:inline">View</span> Catalogue
          </button>

          <Button variant="primary" size="sm" onClick={onStartAssessment} className="shadow-md">
            Start Scan
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Header;
