import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Download, 
  ExternalLink, 
  Layers, 
  Award, 
  Maximize2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2,
  Sparkles,
  BedDouble,
  Ruler
} from 'lucide-react';
import mattressesData from '../data/mattresses.json';
import type { Mattress } from '../types';

interface CatalogueViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'portfolio' | 'pdf' | 'sizes' | 'bases';
}

export const CatalogueViewerModal: React.FC<CatalogueViewerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'portfolio'
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'pdf' | 'sizes' | 'bases'>(initialTab);
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Spring' | 'Rubberized Coir' | 'Foam'>('All');
  const [selectedMattressDetail, setSelectedMattressDetail] = useState<Mattress | null>(null);

  const mattresses = mattressesData as Mattress[];

  const filteredMattresses = categoryFilter === 'All'
    ? mattresses
    : mattresses.filter(m => m.category === categoryFilter);

  const sizeGuidelines = [
    { type: 'Single', dimensions: ['72" × 36"', '75" × 36"', '78" × 36"'], idealFor: 'Solo sleepers, kids & teens rooms, studio divans' },
    { type: 'Double', dimensions: ['72" × 48"', '75" × 48"', '78" × 48"'], idealFor: 'Guest rooms, solo sleepers wanting extra space' },
    { type: 'Queen', dimensions: ['72" × 60"', '75" × 60"', '78" × 60"'], idealFor: 'Master bedrooms, couples wanting balanced space' },
    { type: 'King', dimensions: ['72" × 72"', '75" × 72"', '78" × 72"'], idealFor: 'Luxury suites, family cosleeping, maximum freedom' }
  ];

  const bedBases = [
    {
      name: 'Partition Base',
      desc: 'Modular dual-split base for easy movement up stairways, delivering balanced structural foundation.',
      heights: '10.5" & 12" Heights',
      features: ['Castors or solid legs', 'Padded fabric top', 'Even weight distribution']
    },
    {
      name: 'Drawers Base',
      desc: 'Smart under-bed integrated sliding storage drawers to maximize bedroom space without compromising stability.',
      heights: '10.5" & 12" Heights',
      features: ['Heavy-duty glide rails', 'Smooth fabric upholstery', 'Customized fabric finishes']
    },
    {
      name: 'Basic Divan Base',
      desc: 'Classic reinforced divan base with 2.5" floor clearance, conceived in harmony with Hayleys mattresses.',
      heights: '10.5" & 12" Heights',
      features: ['Solid wood framework', 'ISPA compliant support', 'Eliminates mattress sagging']
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Top Modal Header */}
          <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold tracking-wide text-white">Hayleys Mattresses</h3>
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-bold border border-gold-500/30">
                    Official Product Catalogue
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-light">
                  Sleep Happily Ever After • Canadian Springwall Licensed • ISO 9001 & 14001 Certified
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close Catalogue"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Subheader Tabs */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'portfolio'
                    ? 'bg-brand-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Layers className="w-4 h-4" /> Interactive Portfolio ({mattresses.length} Models)
              </button>

              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'pdf'
                    ? 'bg-brand-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <FileText className="w-4 h-4 text-rose-500" /> Original PDF Catalogue
              </button>

              <button
                onClick={() => setActiveTab('sizes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'sizes'
                    ? 'bg-brand-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Ruler className="w-4 h-4 text-indigo-500" /> Size Dimensions
              </button>

              <button
                onClick={() => setActiveTab('bases')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'bases'
                    ? 'bg-brand-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <BedDouble className="w-4 h-4 text-emerald-600" /> Bed Bases & Headboards
              </button>
            </div>

            {/* Direct PDF actions */}
            <div className="flex items-center gap-2">
              <a
                href="/mattress_catalogue.pdf"
                download="Hayleys_Mattress_Catalogue.pdf"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-brand-600" /> Download PDF (2.0 MB)
              </a>
              <a
                href="/mattress_catalogue.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" /> Open Fullscreen
              </a>
            </div>
          </div>

          {/* Modal Main Content Body */}
          <div className="flex-grow overflow-y-auto p-6 bg-slate-50">
            {/* TAB 1: INTERACTIVE DIGITAL PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* Category Selector Chips */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                  <div className="flex gap-2">
                    {(['All', 'Spring', 'Rubberized Coir', 'Foam'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          categoryFilter === cat
                            ? 'bg-brand-600 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat} {cat !== 'All' ? `(${mattresses.filter(m => m.category === cat).length})` : `(${mattresses.length})`}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-slate-500 font-light">
                    Showing <strong className="font-bold text-slate-800">{filteredMattresses.length}</strong> Hayleys Mattress specifications
                  </div>
                </div>

                {/* Mattress Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMattresses.map((mattress) => (
                    <div
                      key={mattress.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:border-brand-400 group"
                    >
                      <div>
                        {/* Card Header & Badges */}
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            mattress.category === 'Spring' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : mattress.category === 'Rubberized Coir'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {mattress.category} Series
                          </span>

                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                            {mattress.warranty}
                          </div>
                        </div>

                        {/* Title & Thickness */}
                        <h4 className="text-lg font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                          {mattress.name}
                        </h4>
                        <div className="text-xs font-semibold text-brand-600 mb-3">
                          Height / Thickness: {mattress.thickness}
                        </div>

                        <p className="text-xs text-slate-500 font-light leading-relaxed mb-4 line-clamp-3">
                          {mattress.description}
                        </p>

                        {/* Ratings Strip */}
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4 bg-slate-50/60 rounded-xl px-2">
                          <div className="text-center">
                            <span className="text-[9px] text-slate-400 uppercase font-semibold block">Firmness</span>
                            <span className="text-xs font-bold text-slate-800">{mattress.firmness}/10</span>
                          </div>
                          <div className="text-center border-x border-slate-200">
                            <span className="text-[9px] text-slate-400 uppercase font-semibold block">Cooling</span>
                            <span className="text-xs font-bold text-sky-600">{mattress.coolingRating}/5</span>
                          </div>
                          <div className="text-center">
                            <span className="text-[9px] text-slate-400 uppercase font-semibold block">Pressure Relief</span>
                            <span className="text-xs font-bold text-rose-600">{mattress.pressureReliefRating}/5</span>
                          </div>
                        </div>

                        {/* Layer Preview bullets */}
                        <div className="space-y-1 mb-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Key Structural Layers ({mattress.layers.length} Layers):
                          </span>
                          {mattress.layers.slice(0, 3).map((layer, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-light truncate">
                              <CheckCircle2 className="w-3 h-3 text-brand-500 shrink-0" />
                              <span className="truncate">{layer}</span>
                            </div>
                          ))}
                          {mattress.layers.length > 3 && (
                            <span className="text-[10px] text-brand-600 font-medium pl-4 block">
                              + {mattress.layers.length - 3} more internal engineered layers
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Modal Trigger for Layer by Layer Breakdown */}
                      <button
                        onClick={() => setSelectedMattressDetail(mattress)}
                        className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Layers className="w-3.5 h-3.5" /> View Layer Cross-Section & Specs
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ORIGINAL EMBEDDED PDF DOCUMENT */}
            {activeTab === 'pdf' && (
              <div className="h-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative">
                <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span className="font-semibold text-white">mattress_catalogue.pdf</span>
                    <span className="text-slate-500">| 23 Pages • 300 DPI High Resolution</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">Viewing direct from Hayleys archive</span>
                    <a
                      href="/mattress_catalogue.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
                    >
                      <Maximize2 className="w-3 h-3" /> Full Screen Mode
                    </a>
                  </div>
                </div>

                <div className="flex-grow w-full h-[650px] bg-slate-800">
                  <object
                    data="/mattress_catalogue.pdf"
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <div className="p-12 text-center text-white space-y-4">
                      <p className="text-base font-bold">PDF preview is supported in modern browsers.</p>
                      <p className="text-xs text-slate-400">Click below to open or download the complete 23-page Hayleys Mattress catalogue directly.</p>
                      <a
                        href="/mattress_catalogue.pdf"
                        download="Hayleys_Mattress_Catalogue.pdf"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-lg hover:bg-brand-500 transition-all"
                      >
                        <Download className="w-4 h-4" /> Download PDF Brochure
                      </a>
                    </div>
                  </object>
                </div>
              </div>
            )}

            {/* TAB 3: SIZES & DIMENSION GUIDELINES */}
            {activeTab === 'sizes' && (
              <div className="space-y-8">
                <div className="max-w-3xl">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-1">PRECISION TAILORING</span>
                  <h3 className="text-2xl font-black text-slate-900">Hayleys Mattresses Size Guidelines</h3>
                  <p className="text-sm text-slate-500 font-light mt-1">
                    Once you’ve selected your ideal comfort and support model, choose the exact dimensions to fit your space. Hayleys also manufactures custom non-standard sizes upon request.
                  </p>
                </div>

                {/* Size Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sizeGuidelines.map((sg) => (
                    <div key={sg.type} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-black text-sm mb-4">
                          {sg.type}
                        </div>
                        <h4 className="text-xl font-extrabold text-slate-900 mb-1">{sg.type} Bed</h4>
                        <p className="text-xs text-slate-400 font-light mb-4">{sg.idealFor}</p>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Standard Length Options:</span>
                          {sg.dimensions.map((dim) => (
                            <div key={dim} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 flex justify-between items-center">
                              <span>{dim}</span>
                              <span className="text-[10px] text-slate-400 font-normal">Inch Standard</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-brand-700 font-medium">
                        ✓ Available in all 10 mattress models
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Sizes Callout */}
                <div className="bg-brand-950 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-brand-700/20 rounded-full blur-2xl" />
                  <div className="space-y-2 z-10">
                    <h4 className="text-xl font-extrabold">Need Custom Non-Standard Sizing?</h4>
                    <p className="text-xs text-slate-300 max-w-xl font-light leading-relaxed">
                      Hayleys Mattresses offers precision custom sizing engineered to fit your antique wooden four-poster beds, imported bed frames, or customized bedroom architecture.
                    </p>
                  </div>
                  <div className="z-10 shrink-0">
                    <a
                      href="tel:+94760231209"
                      className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                    >
                      <Phone className="w-4 h-4" /> Call Hotline: +94 76 0231209
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BED BASES & HEADBOARDS */}
            {activeTab === 'bases' && (
              <div className="space-y-8">
                <div className="max-w-3xl">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-1">FOUNDATION ERGONOMICS</span>
                  <h3 className="text-2xl font-black text-slate-900">Hayleys Bed Bases & Headboards</h3>
                  <p className="text-sm text-slate-500 font-light mt-1">
                    Conceived to work in perfect harmony with Hayleys mattresses to maintain longevity and performance.
                  </p>
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                    ⚠️ Official Catalogue Notice: Hayleys mattresses cannot be placed on solid unventilated plywood or hardboard top divans. Always pair with ventilated Hayleys slatted, pocketed, or reinforced bases.
                  </div>
                </div>

                {/* Bases list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {bedBases.map((base) => (
                    <div key={base.name} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-bold text-slate-900">{base.name}</h4>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                            {base.heights}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-light mb-4 leading-relaxed">{base.desc}</p>
                        
                        <div className="space-y-2 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Features:</span>
                          {base.features.map((feat) => (
                            <div key={feat} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                        Floor clearance: 2.5 Inches (Supports castors & customized fabric wraps)
                      </div>
                    </div>
                  ))}
                </div>

                {/* Headboard collection highlight */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">AESTHETIC BEDROOM HARMONY</span>
                    <h4 className="text-2xl font-black text-slate-900">Range of 7 Designer Headboards</h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      A headboard creates a pleasing and reassuring backdrop to your sleep sanctuary. Hayleys offers seven stylish designer headboards available in a rich palette of premium fabrics, ensuring a perfect design union between headboard, mattress, and base.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Tufted Diamond', 'Vertical Fluting', 'Minimalist Block', 'Floating Panels', 'Chesterfield', 'Modern Linear', 'Curved Wings'].map(h => (
                        <span key={h} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                    <h5 className="text-sm font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4" /> Hayleys Quality Standards
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-300 font-light">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> ISO 9001:2015 Quality Management Certified
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> ISO 14001:2015 Environmental System
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> ISPA (International Sleep Products Association) Member
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> OEKO-TEX Standard 100 Certified Skin-Safe Fabrics
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Contact Strip */}
          <div className="bg-slate-950 text-slate-400 px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <MapPin className="w-3.5 h-3.5 text-brand-400" /> Showrooms: Colombo • Ekala • Galle
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-400" /> Hotline: +94 76 0231209
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> mattress.shop@hayleysfibre.com
              </span>
            </div>

            <div className="text-[11px] text-slate-500">
              © Hayleys Fibre PLC. All Rights Reserved.
            </div>
          </div>
        </motion.div>

        {/* Modal Sub-View for Detailed Layer Cross-Section */}
        <AnimatePresence>
          {selectedMattressDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative border border-slate-200"
              >
                <button
                  onClick={() => setSelectedMattressDetail(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-800 font-extrabold text-xs border border-brand-200">
                      {selectedMattressDetail.category} Series • {selectedMattressDetail.warranty}
                    </span>
                    <h3 className="text-2xl font-black text-slate-950 mt-3">{selectedMattressDetail.name}</h3>
                    <p className="text-xs text-brand-600 font-bold mt-1">Height / Thickness: {selectedMattressDetail.thickness}</p>
                    <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">{selectedMattressDetail.description}</p>
                  </div>

                  {/* Layer by Layer Visual Cross Section */}
                  <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-600" /> Layer-by-Layer Material Architecture (From Top to Base):
                    </h5>
                    <div className="space-y-2 pt-2">
                      {selectedMattressDetail.layers.map((layer, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                        >
                          <span className="w-6 h-6 rounded-full bg-brand-950 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{layer.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications and Key Tech */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Key Features</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMattressDetail.keyTechnologies.map(t => (
                          <span key={t} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tested Standards</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMattressDetail.certifications.map(c => (
                          <span key={c} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedMattressDetail(null)}
                    className="w-full py-3 rounded-xl bg-brand-950 text-white font-bold text-xs hover:bg-brand-900 transition-all cursor-pointer"
                  >
                    Back to Catalogue
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default CatalogueViewerModal;
