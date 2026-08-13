import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Download, 
  Layers, 
  CheckCircle2,
  BedDouble,
  Ruler,
  Eye,
  Maximize2
} from 'lucide-react';
import mattressesData from '../data/mattresses.json';
import { getMattressAsset } from '../data/mattressAssets';
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
  const [imagePreview, setImagePreview] = useState<{ title: string; src: string } | null>(null);
  
  // Track toggle between 'photo' and 'crossSection' per mattress id
  const [activeImageView, setActiveImageView] = useState<Record<string, 'photo' | 'crossSection'>>({});

  const mattresses = mattressesData as Mattress[];

  const filteredMattresses = categoryFilter === 'All'
    ? mattresses
    : mattresses.filter(m => m.category === categoryFilter);

  const toggleImageView = (id: string, view: 'photo' | 'crossSection') => {
    setActiveImageView(prev => ({ ...prev, [id]: view }));
  };

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
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Top Modal Header */}
          <div className="bg-[#0c2444] text-white px-6 py-4 flex items-center justify-between border-b border-[#194983]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A90E2] to-[#194983] flex items-center justify-center text-white shadow-md">
                <BedDouble className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold tracking-wide text-white">Hayleys Mattresses</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#4A90E2]/20 text-[#4A90E2] text-[10px] font-bold border border-[#4A90E2]/30">
                    Product Catalogue
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-light">
                  Good Sleep, Healthy Life • Canadian Springwall Licensed • ISO 9001 & 14001 Certified
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Close Catalogue"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Subheader Tabs */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'bg-[#194983] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Layers className="w-4 h-4" /> All Mattresses ({mattresses.length})
              </button>

              <button
                onClick={() => setActiveTab('sizes')}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'sizes'
                    ? 'bg-[#194983] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Ruler className="w-4 h-4 text-[#4A90E2]" /> Sizes & Dimensions
              </button>

              <button
                onClick={() => setActiveTab('bases')}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'bases'
                    ? 'bg-[#194983] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <BedDouble className="w-4 h-4 text-emerald-600" /> Bed Bases & Divans
              </button>

              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'pdf'
                    ? 'bg-[#194983] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <FileText className="w-4 h-4 text-rose-500" /> PDF Catalogue
              </button>
            </div>

            {/* Direct PDF actions */}
            <div className="flex items-center gap-2">
              <a
                href="/mattress_catalogue.pdf"
                download="Hayleys_Mattress_Catalogue.pdf"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#194983]" /> Download PDF
              </a>
            </div>
          </div>

          {/* Modal Main Content Body */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-50">
            {/* TAB 1: PRODUCT PORTFOLIO WITH IMAGES & CROSS SECTIONS */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* Category Selector Chips */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                  <div className="flex gap-2">
                    {(['All', 'Spring', 'Rubberized Coir', 'Foam'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          categoryFilter === cat
                            ? 'bg-[#194983] text-white shadow-md'
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
                  {filteredMattresses.map((mattress) => {
                    const assets = getMattressAsset(mattress.id);
                    const currentView = activeImageView[mattress.id] || 'photo';
                    const displayImage = currentView === 'photo' ? assets.photo : assets.crossSection;

                    return (
                      <div
                        key={mattress.id}
                        className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all hover:border-[#4A90E2]/60 group"
                      >
                        <div>
                          {/* Image Container with View Switcher */}
                          <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                            <img
                              src={displayImage}
                              alt={mattress.name}
                              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                            />

                            {/* View Switcher Overlay Pills */}
                            <div className="absolute top-3 right-3 flex items-center bg-black/60 backdrop-blur-md p-0.5 rounded-xl border border-white/20 text-[10px]">
                              <button
                                onClick={() => toggleImageView(mattress.id, 'photo')}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                  currentView === 'photo'
                                    ? 'bg-[#4A90E2] text-white shadow-xs'
                                    : 'text-white/80 hover:text-white'
                                }`}
                              >
                                Mattress
                              </button>
                              <button
                                onClick={() => toggleImageView(mattress.id, 'crossSection')}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                  currentView === 'crossSection'
                                    ? 'bg-[#4A90E2] text-white shadow-xs'
                                    : 'text-white/80 hover:text-white'
                                }`}
                              >
                                Cross Section
                              </button>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-3 left-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                                mattress.category === 'Spring' 
                                  ? 'bg-[#194983] text-white'
                                  : mattress.category === 'Rubberized Coir'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-indigo-700 text-white'
                              }`}>
                                {mattress.category}
                              </span>
                            </div>

                            {/* Zoom Button */}
                            <button
                              onClick={() => setImagePreview({ title: `${mattress.name} (${currentView === 'photo' ? 'Exterior' : 'Internal Layers'})`, src: displayImage })}
                              className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm transition-all cursor-pointer"
                              title="Zoom Image"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Content Body */}
                          <div className="p-5 space-y-3">
                            <div className="flex justify-between items-baseline">
                              <h4 className="text-base font-black text-slate-900 group-hover:text-[#194983] transition-colors">
                                {mattress.name}
                              </h4>
                              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                {mattress.warranty}
                              </span>
                            </div>

                            <div className="text-xs font-semibold text-[#194983]">
                              Thickness: {mattress.thickness}
                            </div>

                            <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2">
                              {mattress.description}
                            </p>

                            {/* Ratings Strip */}
                            <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 bg-slate-50/80 rounded-xl px-2">
                              <div className="text-center">
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Firmness</span>
                                <span className="text-xs font-bold text-slate-800">{mattress.firmness}/10</span>
                              </div>
                              <div className="text-center border-x border-slate-200/80">
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Cooling</span>
                                <span className="text-xs font-bold text-[#194983]">{mattress.coolingRating}/5</span>
                              </div>
                              <div className="text-center">
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Support</span>
                                <span className="text-xs font-bold text-emerald-700">{mattress.supportLevel}</span>
                              </div>
                            </div>

                            {/* Key Highlights */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {mattress.keyTechnologies.slice(0, 3).map(tech => (
                                <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-700 font-medium">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom CTA */}
                        <div className="p-5 pt-0">
                          <button
                            onClick={() => setSelectedMattressDetail(mattress)}
                            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#194983] text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full Specifications</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: SIZES & DIMENSIONS */}
            {activeTab === 'sizes' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Hayleys Standard Mattress Dimensions</h4>
                    <p className="text-xs text-slate-500 font-light mt-1 leading-relaxed">
                      All Hayleys mattresses are manufactured in international metric & imperial standard sizes, with custom dimensions available on request.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sizeGuidelines.map(sz => (
                      <div key={sz.type} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-extrabold text-[#194983]">{sz.type} Size</h5>
                          <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">Standard</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sz.dimensions.map(dim => (
                            <span key={dim} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
                              {dim}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 font-light">{sz.idealFor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BED BASES & FRAMES */}
            {activeTab === 'bases' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Hayleys Divan & Storage Bed Bases</h4>
                    <p className="text-xs text-slate-500 font-light mt-1 leading-relaxed">
                      Solid wood foundation frames designed to support Hayleys mattresses for optimal lifespan and zero sagging.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {bedBases.map(b => (
                      <div key={b.name} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h5 className="text-sm font-extrabold text-slate-900">{b.name}</h5>
                          <span className="text-xs font-semibold text-[#194983] block">{b.heights}</span>
                          <p className="text-xs text-slate-500 font-light leading-relaxed">{b.desc}</p>
                        </div>
                        <div className="space-y-1 pt-3 border-t border-slate-200">
                          {b.features.map(f => (
                            <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A90E2] shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: EMBEDDED PDF VIEWER */}
            {activeTab === 'pdf' && (
              <div className="w-full h-full min-h-[600px] flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <div className="p-4 bg-slate-100 flex items-center justify-between border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Official Hayleys Mattresses PDF Document</span>
                  <a
                    href="/mattress_catalogue.pdf"
                    download="Hayleys_Mattress_Catalogue.pdf"
                    className="px-3 py-1 rounded-lg bg-[#194983] text-white text-xs font-bold hover:bg-[#133867] transition-all"
                  >
                    Download PDF File
                  </a>
                </div>
                <iframe
                  src="/mattress_catalogue.pdf"
                  className="w-full flex-grow min-h-[550px] border-0"
                  title="Hayleys Mattress Catalogue PDF"
                />
              </div>
            )}
          </div>

          {/* MATTRESS DETAIL SLIDEOUT MODAL */}
          {selectedMattressDetail && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative"
              >
                <button
                  onClick={() => setSelectedMattressDetail(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-4">
                  {/* Photo and Cross-section preview */}
                  {(() => {
                    const assets = getMattressAsset(selectedMattressDetail.id);
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                          <img src={assets.photo} alt={selectedMattressDetail.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                            Exterior View
                          </span>
                        </div>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                          <img src={assets.crossSection} alt={`${selectedMattressDetail.name} Layers`} className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                            Internal Cross Section
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <div>
                    <span className="text-xs font-bold text-[#194983] uppercase tracking-wider">
                      {selectedMattressDetail.category} Series • {selectedMattressDetail.warranty}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{selectedMattressDetail.name}</h3>
                    <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
                      {selectedMattressDetail.description}
                    </p>
                  </div>

                  {/* Internal Layers */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-slate-900">Internal Structural Layers:</h5>
                    <div className="space-y-1.5">
                      {selectedMattressDetail.layers.map((layer, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                          {layer}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Materials & Certifications */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Key Materials:</span>
                      <ul className="space-y-1 text-slate-600 font-light">
                        {selectedMattressDetail.materials.map(m => (
                          <li key={m}>• {m}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Certifications:</span>
                      <ul className="space-y-1 text-slate-600 font-light">
                        {selectedMattressDetail.certifications.map(c => (
                          <li key={c}>✓ {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* IMAGE PREVIEW MODAL */}
          {imagePreview && (
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl p-4 space-y-3 shadow-2xl border border-slate-800">
                <div className="flex justify-between items-center text-white px-2">
                  <span className="text-sm font-bold">{imagePreview.title}</span>
                  <button
                    onClick={() => setImagePreview(null)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="rounded-2xl overflow-hidden max-h-[75vh] flex items-center justify-center bg-black">
                  <img src={imagePreview.src} alt={imagePreview.title} className="max-w-full max-h-[75vh] object-contain" />
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CatalogueViewerModal;
