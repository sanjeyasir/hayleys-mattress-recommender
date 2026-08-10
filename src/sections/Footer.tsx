import React from 'react';
import { ShieldCheck, Heart, MapPin, Phone, Mail, FileText, Cpu, BedDouble } from 'lucide-react';

interface FooterProps {
  onOpenCatalogue?: () => void;
  onOpenExplainer?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCatalogue, onOpenExplainer }) => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 relative overflow-hidden border-t border-slate-900">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-500/5 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
        
        {/* Brand & Privacy Disclaimer */}
        <div className="md:col-span-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-md">
              <BedDouble className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h4 className="text-base font-black tracking-tight text-white leading-none">
                HAYLEYS MATTRESSES
              </h4>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-1">
                SLEEP HAPPILY EVER AFTER
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
            Hayleys Mattresses is the premier manufacturer of Spring, Rubberized Coir, and Foam Mattresses in Sri Lanka, partnered with Canadian Springwall. This interactive AI Sleep Recommender processes all biometric and posture contour data 100% locally in your browser.
          </p>

          <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side Optical Privacy Protected.</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {['ISO 9001:2015', 'ISO 14001:2015', 'ISPA Member', 'OEKO-TEX Certified'].map(badge => (
              <span key={badge} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Showrooms Column */}
        <div className="md:col-span-4 space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gold-400" /> Hayleys Showroom Network
          </h5>
          <div className="space-y-3 text-xs text-slate-400 font-light">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">Colombo Showroom</strong>
              <span>No. 400, Deans Rd, Colombo 10</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">Ekala Showroom & Factory</strong>
              <span>131 Minuwangoda Road, Ekala</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">Galle Showroom</strong>
              <span>136 Abdul Wahab Mawatha, Magalle, Galle</span>
            </div>
          </div>
        </div>

        {/* Quick Links & Contact */}
        <div className="md:col-span-3 space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Contact & Tools</h5>
          <ul className="space-y-2 text-xs font-light text-slate-400">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>Hotline: +94 76 0231209</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>mattress.shop@hayleysfibre.com</span>
            </li>
          </ul>

          <div className="pt-3 border-t border-slate-900 space-y-2">
            {onOpenCatalogue && (
              <button
                onClick={onOpenCatalogue}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-brand-400" /> View PDF Catalogue
              </button>
            )}

            {onOpenExplainer && (
              <button
                onClick={onOpenExplainer}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Algorithm Science Deep-Dive
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Copyright info */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 font-light gap-4">
        <div>
          © {new Date().getFullYear()} Hayleys Fibre PLC. All Rights Reserved. www.hayleysmattress.com
        </div>
        <div className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for restful, rejuvenating sleep.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
