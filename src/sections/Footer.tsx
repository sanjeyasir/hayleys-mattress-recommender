import React from 'react';
import { ShieldCheck, Heart, MapPin, Phone, Mail, FileText, BedDouble, Award } from 'lucide-react';

interface FooterProps {
  onOpenCatalogue?: () => void;
  onOpenExplainer?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCatalogue }) => {
  return (
    <footer className="relative bg-[#0c2444] text-white pt-16 pb-12 overflow-hidden border-t border-[#194983]/50">
      {/* Linkcover theme background with gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src="/linkcover.jpg" 
          alt="Hayleys Footer Cover" 
          className="w-full h-full object-cover object-center opacity-15 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081628] via-[#0c2444]/90 to-[#194983]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
        
        {/* Brand & Mission */}
        <div className="md:col-span-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4A90E2] to-[#194983] flex items-center justify-center text-white shadow-lg shadow-[#194983]/40">
              <BedDouble className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-black tracking-tight text-white leading-none">
                HAYLEYS MATTRESSES
              </h4>
              <span className="text-[10px] font-bold text-[#4A90E2] uppercase tracking-widest block mt-1">
                GOOD SLEEP • HEALTHY LIFE
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-300 font-light leading-relaxed max-w-sm">
            Sri Lanka’s premier manufacturer of Spring, Natural Rubberized Coir, and High-Resilience Foam Mattresses. In partnership with Canadian Springwall, delivering handcrafted ergonomic comfort and restorative sleep.
          </p>

          <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 9001 & 14001 Certified Manufacturing Standards</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {['10-Year Warranty', 'Canadian Springwall License', '100% Natural Coir', 'OEKO-TEX Fabric'].map(badge => (
              <span key={badge} className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-[10px] font-medium text-slate-200">
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Showrooms Column */}
        <div className="md:col-span-4 space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#4A90E2] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#4A90E2]" /> Hayleys Showroom Network
          </h5>
          <div className="space-y-3 text-xs text-slate-300 font-light">
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1 hover:border-[#4A90E2]/40 transition-colors">
              <strong className="text-white block font-semibold">Colombo Flagship Showroom</strong>
              <span>No. 400, Deans Rd, Colombo 10</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1 hover:border-[#4A90E2]/40 transition-colors">
              <strong className="text-white block font-semibold">Ekala Showroom & Factory</strong>
              <span>131 Minuwangoda Road, Ekala</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1 hover:border-[#4A90E2]/40 transition-colors">
              <strong className="text-white block font-semibold">Galle Regional Showroom</strong>
              <span>136 Abdul Wahab Mawatha, Magalle, Galle</span>
            </div>
          </div>
        </div>

        {/* Quick Links & Contact */}
        <div className="md:col-span-3 space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Customer Support</h5>
          <ul className="space-y-2.5 text-xs font-light text-slate-300">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#4A90E2] shrink-0" />
              <span>Hotline: +94 76 0231209</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">mattress.shop@hayleysfibre.com</span>
            </li>
          </ul>

          <div className="pt-3 border-t border-white/10 space-y-2">
            {onOpenCatalogue && (
              <button
                onClick={onOpenCatalogue}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#194983] to-[#4A90E2] hover:from-[#133867] hover:to-[#357ecf] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4" /> View Mattress Catalogue
              </button>
            )}

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Custom Mattress Sizes Made on Request</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright info */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 font-light gap-4">
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
