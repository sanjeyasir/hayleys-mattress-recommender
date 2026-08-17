import React, { useState } from 'react';
import Button from './Button';
import { BookOpen, BedDouble, Menu, X, Layers, Compass, Camera } from 'lucide-react';

interface HeaderProps {
  onStartAssessment: () => void;
  onOpenCatalogue: () => void;
  onOpenExplainer?: () => void;
  onOpenSplash?: () => void;
  compareCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onStartAssessment, 
  onOpenCatalogue,
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
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-md">
        <div className="px-4 sm:px-6 h-20 flex items-center justify-between gap-4 relative">
          
          {/* Left side: Navigation links (desktop only) & Logo (mobile only) */}
          <div className="flex-1 flex justify-start items-center gap-4">
            {/* Mobile/Tablet Logo left-aligned */}
            <div 
              onClick={() => {
                if (onOpenSplash) onOpenSplash();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="lg:hidden flex items-center cursor-pointer transition-transform duration-200 hover:scale-105 animate-fade-in"
              title="Living, Sleeping & Beyond (LS&B) - Hayleys Mattresses"
            >
              <img 
                src="/L&S B.png" 
                alt="LS&B - Living, Sleeping & Beyond" 
                className="h-10 sm:h-12 w-auto max-w-[130px] sm:max-w-[160px] object-contain"
              />
            </div>

            <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wider text-slate-600 uppercase">
              <a href="#how-it-works" className="hover:text-[#194983] transition-colors">How It Works</a>
              <a href="#scanner" className="hover:text-[#194983] transition-colors">Find My Mattress</a>
            </nav>
          </div>

          {/* Centered Logo closer to the top border (desktop only) */}
          <div 
            onClick={() => {
              if (onOpenSplash) onOpenSplash();
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-2 items-center justify-center cursor-pointer z-50 transition-transform duration-200 hover:scale-105"
            title="Living, Sleeping & Beyond (LS&B) - Hayleys Mattresses"
          >
            <img 
              src="/L&S B.png" 
              alt="LS&B - Living, Sleeping & Beyond" 
              className="h-14 w-auto max-w-[180px] object-contain"
            />
          </div>

          {/* Right side: Navigation & Action Calls */}
          <div className="flex-1 flex justify-end items-center gap-2.5 sm:gap-3">
            <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wider text-slate-600 uppercase mr-4">
              <a href="#technology" className="hover:text-[#194983] transition-colors">Sleep Science</a>
              <a href="#comparison" className="hover:text-[#194983] transition-colors flex items-center gap-1.5">
                <span>Compare</span>
                {compareCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#194983] text-white text-[10px] font-mono font-bold">
                    {compareCount}
                  </span>
                )}
              </a>
            </nav>

            <button
              onClick={onOpenCatalogue}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              <BookOpen className="w-4 h-4 text-[#194983]" />
              <span>Catalogue</span>
            </button>

            <Button 
              variant="primary" 
              size="sm" 
              onClick={onStartAssessment} 
              className="shadow-md flex shrink-0 px-3 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-xs"
            >
              <span className="hidden sm:inline">Start Assessment</span>
              <span className="sm:hidden">Start Scan</span>
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
          <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-5 space-y-4 rounded-b-2xl shadow-xl">
            <div className="flex flex-col space-y-3 text-xs font-bold text-slate-800">
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="text-left py-2.5 border-b border-slate-100 flex items-center justify-between"
              >
                <span>How It Works</span>
                <Compass className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => handleNavClick('scanner')}
                className="text-left py-2.5 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Find My Mattress</span>
                <Camera className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => handleNavClick('technology')}
                className="text-left py-2.5 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Sleep Science & Materials</span>
                <BedDouble className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => handleNavClick('comparison')}
                className="text-left py-2.5 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Compare Selected Models</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-[10px]">
                  {compareCount} Models
                </span>
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCatalogue();
                }}
                className="p-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#194983]" />
                View Full Catalogue
              </button>

              <Button
                variant="primary"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onStartAssessment();
                }}
                className="w-full justify-center py-3"
              >
                Find My Mattress
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Bottom Action Bar for Mobile Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={onStartAssessment}
          className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-[#194983] py-1"
        >
          <Camera className="w-5 h-5 text-[#194983]" />
          <span className="text-[10px] font-bold">Find Mattress</span>
        </button>

        <button
          onClick={onOpenCatalogue}
          className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-[#194983] py-1"
        >
          <BookOpen className="w-5 h-5 text-[#4A90E2]" />
          <span className="text-[10px] font-bold">Catalogue</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('comparison');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-slate-700 hover:text-[#194983] py-1 relative"
        >
          <div className="relative">
            <Layers className="w-5 h-5 text-[#194983]" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#4A90E2] text-white text-[9px] font-bold flex items-center justify-center font-mono">
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
