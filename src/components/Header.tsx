import React, { useState } from 'react';
import Button from './Button';
import { FileText, Cpu, BedDouble, Menu, X, Layers, Compass, Camera } from 'lucide-react';

interface HeaderProps {
  onStartAssessment: () => void;
  onOpenCatalogue: () => void;
  onOpenExplainer: () => void;
  onOpenSplash?: () => void;
  compareCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onStartAssessment, 
  onOpenCatalogue,
  onOpenExplainer,
  onOpenSplash,
  compareCount = 0
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (anchorId: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Hayleys Mattresses Brand Logo */}
          <div 
            onClick={() => {
              if (onOpenSplash) onOpenSplash();
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
            title="Click to view Hayleys Business Showcase"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-brand-950 to-brand-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all shrink-0">
              <BedDouble className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-950 leading-none">
                  HAYLEYS <span className="text-brand-700 font-extrabold">MATTRESSES</span>
                </h1>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                SLEEP HAPPILY EVER AFTER • AI RECOMMENDER
              </span>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider text-slate-600 uppercase">
            <a href="#how-it-works" className="hover:text-brand-700 transition-colors">How It Works</a>
            <a href="#scanner" className="hover:text-brand-700 transition-colors">Body Scanner</a>
            <a href="#technology" className="hover:text-brand-700 transition-colors">Sleep Science</a>
            <a href="#comparison" className="hover:text-brand-700 transition-colors flex items-center gap-1">
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-brand-600 text-white text-[10px] font-mono font-bold">
                  {compareCount}
                </span>
              )}
            </a>
          </nav>

          {/* Action Calls: Catalogue & Explainer & Assessment */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenExplainer}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="Detailed explanation of recommendation math"
            >
              <Cpu className="w-3.5 h-3.5 text-brand-600" />
              <span>Algorithm Science</span>
            </button>

            <button
              onClick={onOpenCatalogue}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-50 hover:bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-brand-700" />
              <span>Catalogue</span>
            </button>

            <Button variant="primary" size="sm" onClick={onStartAssessment} className="shadow-md hidden xs:flex">
              Start Scan
            </Button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Out Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-3 text-xs font-bold text-slate-800">
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>How The Science Works</span>
                <Compass className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => handleNavClick('scanner')}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Body Scanner & Calibration</span>
                <Camera className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => handleNavClick('technology')}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Sleep Science & Materials</span>
                <Cpu className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => handleNavClick('comparison')}
                className="text-left py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Compare Mattresses</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 font-mono text-[10px]">
                  {compareCount} Models
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenExplainer();
                }}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-brand-600" />
                Algorithm Science
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCatalogue();
                }}
                className="p-2.5 rounded-xl bg-brand-50 text-brand-800 border border-brand-200 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-brand-700" />
                Catalogue
              </button>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onStartAssessment();
              }}
              className="w-full justify-center"
            >
              Start AI Posture Scan
            </Button>
          </div>
        )}
      </header>

      {/* Sticky Bottom Action Bar for Mobile Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={onStartAssessment}
          className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-brand-700 py-1"
        >
          <Camera className="w-5 h-5 text-brand-600" />
          <span className="text-[10px] font-bold">Scan</span>
        </button>

        <button
          onClick={onOpenExplainer}
          className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-brand-700 py-1"
        >
          <Cpu className="w-5 h-5 text-indigo-600" />
          <span className="text-[10px] font-bold">Science</span>
        </button>

        <button
          onClick={onOpenCatalogue}
          className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-brand-700 py-1"
        >
          <FileText className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-bold">Catalogue</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('comparison');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-brand-700 py-1 relative"
        >
          <div className="relative">
            <Layers className="w-5 h-5 text-amber-600" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                {compareCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Compare</span>
        </button>
      </div>
    </>
  );
};

export default Header;
