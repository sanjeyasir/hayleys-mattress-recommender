import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 relative overflow-hidden border-t border-slate-900">
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-brand-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-900">
        
        {/* Logo and Privacy Disclaimer */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4.5 h-4.5 text-gold-400" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold tracking-widest text-white leading-none">HAYLEYS MATTRESS</h4>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                SLEEPMATCH EXPERIENCE
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 font-light leading-relaxed max-w-md">
            This digital body matching application is designed as an interactive showroom tool and diagnostic platform. All optical calculations, Canny contours, and rule scores are processed instantly inside the local web browser. No personal images or profile metrics are sent to remote databases.
          </p>

          <div className="flex items-center gap-2 text-slate-400 text-xs font-light">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Local Browser Security Assured.</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-350">Showroom Solutions</h5>
          <ul className="space-y-2 text-xs font-light text-slate-400">
            <li><a href="#how-it-works" className="hover:text-white transition-colors">Assessment Steps</a></li>
            <li><a href="#scanner" className="hover:text-white transition-colors">Start Posture Scan</a></li>
            <li><a href="#technology" className="hover:text-white transition-colors">Latex & Coir Engineering</a></li>
            <li><a href="#comparison" className="hover:text-white transition-colors">Compare Mattress Catalog</a></li>
          </ul>
        </div>

        {/* Brand Information */}
        <div className="md:col-span-3 space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-350">Company info</h5>
          <p className="text-xs font-light text-slate-400 leading-relaxed">
            Hayleys Fiber PLC<br />
            Mattress & Comfort Solutions Division.<br />
            Colombo, Sri Lanka.<br />
            Email: info@hayleysmattress.com
          </p>
        </div>

      </div>

      {/* Copyright info */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-light gap-4">
        <div>
          © {new Date().getFullYear()} Hayleys Fiber PLC. All Rights Reserved.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>for premium sleep health.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
