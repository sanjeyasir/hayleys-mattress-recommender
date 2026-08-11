import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { BodyProfile, RecommendationResult, Mattress } from '../types';
import Button from '../components/Button';
import PrescriptionReportModal from '../components/PrescriptionReportModal';
import Interactive3DPostureViewer from '../components/Interactive3DPostureViewer';
import { getMattressAsset } from '../data/mattressAssets';
import { 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  X, 
  RefreshCw, 
  FileText, 
  Download, 
  Eye, 
  Maximize2 
} from 'lucide-react';

interface RecommendationsProps {
  bodyProfile: BodyProfile;
  recommendations: RecommendationResult[];
  debugCanvasUrl: string;
  onReset: () => void;
  onAddToCompare: (mattress: Mattress) => void;
  compareList: Mattress[];
  onOpenCatalogue?: () => void;
  onOpenExplainer?: () => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  bodyProfile,
  recommendations,
  debugCanvasUrl,
  onReset,
  onAddToCompare,
  compareList,
  onOpenCatalogue
}) => {
  const [selectedMattress, setSelectedMattress] = useState<Mattress | null>(null);
  const [geometryViewMode, setGeometryViewMode] = useState<'2d' | '3d'>('3d');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeImageView, setActiveImageView] = useState<Record<string, 'photo' | 'crossSection'>>({});
  const [zoomImage, setZoomImage] = useState<{ title: string; src: string } | null>(null);
  
  // The first recommendation is our optimal match
  const primaryMatch = recommendations[0];
  const runnerUps = recommendations.slice(1, 4);

  const toggleImageView = (id: string, view: 'photo' | 'crossSection') => {
    setActiveImageView(prev => ({ ...prev, [id]: view }));
  };

  const getPressureColor = (status: string) => {
    switch (status) {
      case 'high-pressure': return 'bg-rose-500';
      case 'moderate': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <section id="results" className="bg-slate-50 py-16 sm:py-20 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#194983]/10 text-[#194983] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#4A90E2]" />
              Your Personalized Sleep Prescription
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Recommended Hayleys Mattresses
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-2xl leading-relaxed">
              Based on your posture scan and sleep preferences, here are your best-fitting Hayleys models engineered for optimal spinal alignment and pressure relief.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 text-xs border-slate-300"
            >
              <Download className="w-4 h-4 text-[#194983]" />
              <span>Download Sleep Report</span>
            </Button>

            <button
              onClick={onReset}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Retake Scan</span>
            </button>
          </div>
        </div>

        {/* Top Summary Banner: Posture & Biometric Indicators */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Posture Metrics Breakdown */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-[11px] font-bold text-[#194983] uppercase tracking-wider block">
                Biometric Summary
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                Target Firmness Score: <span className="text-[#194983]">{(bodyProfile.calculatedFirmnessScore || 6.5).toFixed(1)} / 10</span>
              </h3>
              <p className="text-xs text-slate-500 font-light mt-1">
                Your posture profile benefits most from a <strong className="text-slate-800 font-semibold">{bodyProfile.calculatedFirmnessScore >= 7 ? 'Firm / Orthopaedic' : bodyProfile.calculatedFirmnessScore >= 5 ? 'Medium-Firm' : 'Plush / Cushioning'}</strong> sleeping surface.
              </p>
            </div>

            {/* Quick Posture Stat Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Spine Alignment</span>
                <span className="text-xs font-bold text-slate-800 capitalize mt-0.5 block">
                  {bodyProfile.spineAlignmentRating}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Shoulder Balance</span>
                <span className="text-xs font-bold text-slate-800 capitalize mt-0.5 block">
                  {bodyProfile.shoulderAlignmentRating}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Body Morphology</span>
                <span className="text-xs font-bold text-slate-800 capitalize mt-0.5 block">
                  {bodyProfile.bodyType}
                </span>
              </div>
            </div>

            {/* 5-Zone Pressure Distribution Bar */}
            {bodyProfile.pressureZones && bodyProfile.pressureZones.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">5-Zone Body Weight Distribution:</span>
                  <span className="text-[11px] text-slate-400 font-light">Calculated load points</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {bodyProfile.pressureZones.map((zone) => (
                    <div key={zone.name} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block truncate">{zone.name}</span>
                      <span className="text-xs font-black text-slate-800 block mt-0.5">{zone.loadPercentage}%</span>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full ${getPressureColor(zone.status)}`}
                          style={{ width: `${Math.min(zone.loadPercentage * 3, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Visual Posture Viewer (2D / 3D Toggle) */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-[#4A90E2] uppercase tracking-wider">
                Posture Model
              </span>
              <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[10px]">
                <button
                  onClick={() => setGeometryViewMode('3d')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    geometryViewMode === '3d' ? 'bg-[#4A90E2] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D Spine
                </button>
                <button
                  onClick={() => setGeometryViewMode('2d')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    geometryViewMode === '2d' ? 'bg-[#4A90E2] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2D Scan
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 aspect-[4/3] flex items-center justify-center relative">
              {geometryViewMode === '3d' ? (
                <Interactive3DPostureViewer bodyProfile={bodyProfile} />
              ) : debugCanvasUrl ? (
                <img src={debugCanvasUrl} alt="2D Optical Scan" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-xs text-slate-400 font-light">
                  Posture scan loaded successfully.
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 text-center font-light">
              Interactive biometric spine alignment simulation
            </div>
          </div>

        </div>

        {/* PRIMARY MATCH SPOTLIGHT CARD */}
        {primaryMatch && (() => {
          const mattress = primaryMatch.mattress;
          const assets = getMattressAsset(mattress.id);
          const currentView = activeImageView[mattress.id] || 'photo';
          const displayImage = currentView === 'photo' ? assets.photo : assets.crossSection;
          const isCompared = compareList.some(m => m.id === mattress.id);

          return (
            <div className="bg-white rounded-3xl border-2 border-[#4A90E2] overflow-hidden shadow-xl space-y-0">
              
              {/* Card Banner Header */}
              <div className="bg-gradient-to-r from-[#194983] via-[#2566b4] to-[#4A90E2] text-white px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-300" />
                  <span className="text-xs sm:text-sm font-black tracking-wide uppercase">
                    ⭐ #1 Top Recommended Match ({primaryMatch.matchPercentage}% Match Score)
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold border border-white/20">
                  {mattress.category} Series
                </span>
              </div>

              {/* Card Body Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Product Image & Cross-Section with Toggle */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                    <img
                      src={displayImage}
                      alt={mattress.name}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                    />

                    {/* Switcher Pills */}
                    <div className="absolute top-3 right-3 flex items-center bg-black/60 backdrop-blur-md p-0.5 rounded-xl border border-white/20 text-[10px]">
                      <button
                        onClick={() => toggleImageView(mattress.id, 'photo')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          currentView === 'photo' ? 'bg-[#4A90E2] text-white shadow-xs' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Mattress
                      </button>
                      <button
                        onClick={() => toggleImageView(mattress.id, 'crossSection')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          currentView === 'crossSection' ? 'bg-[#4A90E2] text-white shadow-xs' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Cross Section
                      </button>
                    </div>

                    {/* Zoom Button */}
                    <button
                      onClick={() => setZoomImage({ title: `${mattress.name} (${currentView === 'photo' ? 'Exterior' : 'Internal Layers'})`, src: displayImage })}
                      className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm transition-all cursor-pointer"
                      title="Zoom Image"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Thickness: <strong className="text-slate-800">{mattress.thickness}</strong></span>
                    <span>Warranty: <strong className="text-slate-800">{mattress.warranty}</strong></span>
                  </div>
                </div>

                {/* Right Match Description & Actions */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                      {mattress.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mt-2">
                      {mattress.description}
                    </p>
                  </div>

                  {/* Why Match Explanation Box */}
                  <div className="p-4 rounded-2xl bg-[#f0f6fc] border border-[#b8d7f5] space-y-1">
                    <h4 className="text-xs font-bold text-[#194983] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#194983]" />
                      Why This Is Your Optimal Match:
                    </h4>
                    <p className="text-xs text-slate-700 font-light leading-relaxed">
                      {primaryMatch.reasons?.[0] || mattress.whyMatchExplain}
                    </p>
                  </div>

                  {/* Key Technologies Pills */}
                  <div className="flex flex-wrap gap-2">
                    {mattress.keyTechnologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-xl bg-slate-100 text-xs text-slate-700 font-medium border border-slate-200">
                        ✓ {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => onAddToCompare(mattress)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                        isCompared
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-[#194983] text-white hover:bg-[#133867] shadow-md shadow-[#194983]/20'
                      }`}
                    >
                      {isCompared ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{isCompared ? 'Remove from Compare' : 'Add to Compare'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedMattress(mattress)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#194983]" />
                      <span>View Layer Details</span>
                    </button>

                    {onOpenCatalogue && (
                      <button
                        onClick={onOpenCatalogue}
                        className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-slate-100 text-slate-600 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Catalogue</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>

            </div>
          );
        })()}

        {/* RUNNER-UP ALTERNATIVE MATCHES */}
        {runnerUps.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">
                Alternative Hayleys Matches
              </h3>
              <span className="text-xs text-slate-500 font-light">
                Close alternatives matching your profile
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {runnerUps.map((rec) => {
                const mattress = rec.mattress;
                const assets = getMattressAsset(mattress.id);
                const currentView = activeImageView[mattress.id] || 'photo';
                const displayImage = currentView === 'photo' ? assets.photo : assets.crossSection;
                const isCompared = compareList.some(m => m.id === mattress.id);

                return (
                  <div
                    key={mattress.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Image Container */}
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
                              currentView === 'photo' ? 'bg-[#4A90E2] text-white shadow-xs' : 'text-white/80 hover:text-white'
                            }`}
                          >
                            Mattress
                          </button>
                          <button
                            onClick={() => toggleImageView(mattress.id, 'crossSection')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                              currentView === 'crossSection' ? 'bg-[#4A90E2] text-white shadow-xs' : 'text-white/80 hover:text-white'
                            }`}
                          >
                            Cross Section
                          </button>
                        </div>

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#194983] text-white text-[10px] font-extrabold uppercase">
                            {rec.matchPercentage}% Match
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-[#194983] uppercase">{mattress.category}</span>
                            <h4 className="text-base font-black text-slate-900">{mattress.name}</h4>
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {mattress.warranty}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2">
                          {mattress.description}
                        </p>

                        <div className="text-xs text-slate-600 font-medium">
                          Thickness: <strong>{mattress.thickness}</strong> • Firmness: <strong>{mattress.firmness}/10</strong>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-5 pt-0 flex gap-2">
                      <button
                        onClick={() => onAddToCompare(mattress)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isCompared
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 hover:bg-[#194983] text-slate-700 hover:text-white'
                        }`}
                      >
                        {isCompared ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isCompared ? 'Compared' : '+ Compare'}</span>
                      </button>

                      <button
                        onClick={() => setSelectedMattress(mattress)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MATTRESS DETAIL SLIDEOUT MODAL */}
        {selectedMattress && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setSelectedMattress(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                {(() => {
                  const assets = getMattressAsset(selectedMattress.id);
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                        <img src={assets.photo} alt={selectedMattress.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                          Exterior
                        </span>
                      </div>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                        <img src={assets.crossSection} alt={`${selectedMattress.name} Layers`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                          Cross Section
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <span className="text-xs font-bold text-[#194983] uppercase tracking-wider">
                    {selectedMattress.category} Series • {selectedMattress.warranty}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{selectedMattress.name}</h3>
                  <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
                    {selectedMattress.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h5 className="text-xs font-bold text-slate-900">Internal Structural Layers:</h5>
                  <div className="space-y-1.5">
                    {selectedMattress.layers.map((layer, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                        {layer}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* IMAGE ZOOM PREVIEW */}
        {zoomImage && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl p-4 space-y-3 shadow-2xl border border-slate-800">
              <div className="flex justify-between items-center text-white px-2">
                <span className="text-sm font-bold">{zoomImage.title}</span>
                <button
                  onClick={() => setZoomImage(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden max-h-[75vh] flex items-center justify-center bg-black">
                <img src={zoomImage.src} alt={zoomImage.title} className="max-w-full max-h-[75vh] object-contain" />
              </div>
            </div>
          </div>
        )}

        {/* PRESCRIPTION DOWNLOAD REPORT MODAL */}
        <PrescriptionReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          bodyProfile={bodyProfile}
          recommendations={recommendations}
        />

      </div>
    </section>
  );
};

export default Recommendations;
