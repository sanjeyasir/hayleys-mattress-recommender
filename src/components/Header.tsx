import React from 'react';
import Button from './Button';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onStartAssessment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartAssessment }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-45 glass-panel border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Premium Crown Icon */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-brand-950 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-widest text-slate-950 leading-none">
              SLEEPMATCH
            </h1>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
              SLEEPMATCH CLINIC
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-600 uppercase">
          <a href="#how-it-works" className="hover:text-brand-700 transition-colors">How It Works</a>
          <a href="#scanner" className="hover:text-brand-700 transition-colors">Body Scanner</a>
          <a href="#technology" className="hover:text-brand-700 transition-colors">Sleep Science</a>
          <a href="#comparison" className="hover:text-brand-700 transition-colors">Compare models</a>
        </nav>

        {/* Action Call */}
        <div>
          <Button variant="primary" size="sm" onClick={onStartAssessment}>
            Start Assessment
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Header;
