import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BodyProfile, RecommendationResult, Mattress } from '../types';
import Badge from '../components/Badge';
import Button from '../components/Button';
import DerivationDetailModal from '../components/DerivationDetailModal';
import { 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  X, 
  Layers, 
  RefreshCw, 
  Calculator, 
  FileText, 
  Award 
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
  onOpenCatalogue,
  onOpenExplainer
}) => {
  const [selectedMattress, setSelectedMattress] = useState<Mattress | null>(null);
  const [inspectDerivationRec, setInspectDerivationRec] = useState<RecommendationResult | null>(null);
  
  // The first recommendation is our optimal match
  const primaryMatch = recommendations[0];
  const runnerUps = recommendations.slice(1, 4);

  // SVG representation map for Hayleys mattress thumbnails
  const renderMattressGraphic = (_id: string, category: string) => {
    switch (category) {
      case 'Spring':
        return (
          <svg className="w-full h-32" viewBox="0 0 180 90">
            <rect x="10" y="10" width="160" height="70" rx="10" fill="#0f172a" />
            {/* Euro top / Pocket Spring representation */}
            <rect x="20" y="20" width="140" height="12" rx="4" fill="#3b82f6" />
            <path d="M 25 55 Q 35 35, 45 55 T 65 55 T 85 55 T 105 55 T 125 55 T 145 55" fill="none" stroke="#93c5fd" strokeWidth="2.5" />
            <rect x="20" y="65" width="140" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <text x="35" y="47" fill="#ffffff" className="text-[9px] font-bold tracking-widest font-mono">HAYLEYS SPRING</text>
          </svg>
        );
      case 'Rubberized Coir':
        return (
          <svg className="w-full h-32" viewBox="0 0 180 90">
            <rect x="10" y="10" width="160" height="70" rx="10" fill="#064e3b" />
            {/* Rubberized Coir Texture & Latex Layer */}
            <rect x="20" y="20" width="140" height="10" rx="3" fill="#34d399" />
            <rect x="20" y="34" width="140" height="20" rx="2" fill="#78350f" stroke="#b45309" strokeWidth="1" strokeDasharray="3 2" />
            <rect x="20" y="58" width="140" height="14" rx="2" fill="#047857" />
            <text x="30" y="47" fill="#fef3c7" className="text-[9px] font-bold tracking-widest font-mono">RUBBERIZED COIR</text>
          </svg>
        );
      default: // Foam
        return (
          <svg className="w-full h-32" viewBox="0 0 180 90">
            <rect x="10" y="10" width="160" height="70" rx="10" fill="#1e1b4b" />
            {/* Foam layers / Gel bubbles */}
            <rect x="20" y="20" width="140" height="12" rx="3" fill="#6366f1" />
            <rect x="20" y="36" width="140" height="14" rx="2" fill="#818cf8" />
            <rect x="20" y="54" width="140" height="18" rx="2" fill="#312e81" />
            <text x="38" y="46" fill="#ffffff" className="text-[9px] font-bold tracking-widest font-mono">COMFORT FOAM</text>
          </svg>
        );
    }
  };

  const getPressureColor = (status: string) => {
    switch (status) {
      case 'high-pressure': return 'bg-rose-500';
      case 'moderate': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const getPressureTextColor = (status: string) => {
    switch (status) {
      case 'high-pressure': return 'text-rose-600';
      case 'moderate': return 'text-amber-600';
      default: return 'text-emerald-600';
    }
  };

  return (
    <section id="results" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
                HAYLEYS SLEEPMATCH CLINICAL REPORT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                100% Deterministic Match
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Your Prescribed Hayleys Mattress Matches
            </h2>
            <p className="text-slate-600 font-light max-w-2xl leading-relaxed">
              Synthesized from your optical posture scan metrics, 5-zone spinal kinematics, and Hayleys Mattress portfolio specifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {onOpenExplainer && (
              <button
                onClick={onOpenExplainer}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-brand-600" />
                Algorithm Derivation Formula
              </button>
            )}

            {onOpenCatalogue && (
              <button
                onClick={onOpenCatalogue}
                className="px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-800 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-brand-700" />
                View Full Catalogue
              </button>
            )}

            <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Reset & Scan Again
            </Button>
          </div>
        </div>

        {/* Diagnostic Grid Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Biometric Geometry Scanner Output */}
          <div className="lg:col-span-5 space-y-6 bg-white border border-slate-200/90 rounded-3xl p-7 premium-shadow">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-brand-800" />
                <h3 className="text-base font-bold text-slate-950">1. Standing Biometric Geometry</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                FRAME ANALYZED
              </span>
            </div>

            {/* OpenCV Overlay Visual */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[290px] shadow-inner">
              <img 
                src={debugCanvasUrl} 
                alt="Skeletal contour scan" 
                className="w-full h-full object-contain max-h-[290px]"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/85 border border-slate-800 px-3 py-1 rounded-lg text-[10px] font-mono text-emerald-400">
                θ: {bodyProfile.shoulderTiltAngle}° • ΔS: {bodyProfile.spineDeviationPx}px
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Spine Alignment</span>
                <span className="text-sm font-black text-slate-950 block mt-0.5">{bodyProfile.spineAlignmentRating}</span>
                <Badge variant={bodyProfile.spineAlignmentRating === 'Excellent' ? 'success' : bodyProfile.spineAlignmentRating === 'Fair' ? 'warning' : 'error'} size="sm">
                  {bodyProfile.spineDeviationPx}px Plumb Deviation
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shoulder Symmetry</span>
                <span className="text-sm font-black text-slate-950 block mt-0.5">{bodyProfile.shoulderAlignmentRating}</span>
                <Badge variant={bodyProfile.shoulderAlignmentRating === 'Aligned' ? 'success' : 'warning'} size="sm">
                  {bodyProfile.shoulderTiltAngle}° Tilt Angle
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Body Symmetry</span>
                <span className="text-sm font-black text-slate-950 block mt-0.5">{bodyProfile.symmetryRating}% Symmetrical</span>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full" style={{ width: `${bodyProfile.symmetryRating}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Morphotype</span>
                <span className="text-sm font-black text-slate-950 block mt-0.5">{bodyProfile.bodyType}</span>
                <span className="text-[10px] text-slate-400 font-light block mt-0.5">SHR Ratio: {bodyProfile.shoulderHipRatio}</span>
              </div>
            </div>

            {/* Natural Asymmetry & Spinal Kinematics Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" /> Natural Bilateral Asymmetry Profile:
                </span>
                <span className="font-mono font-bold text-indigo-700">{bodyProfile.symmetryRating}% Symmetry</span>
              </div>
              <p className="text-[11px] text-indigo-900 font-light leading-relaxed">
                {bodyProfile.asymmetry?.asymmetryReasoning || "Human bodies naturally exhibit 4–15% bilateral variance from handedness, dominant weight-bearing, and muscular tone."}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono text-indigo-800">
                <div className="bg-white/80 p-1.5 rounded-lg text-center border border-indigo-100">
                  <span className="block text-slate-400">Shoulder Δ</span>
                  <span className="font-bold">{bodyProfile.asymmetry?.shoulderLevelDiffPx || 0}px</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg text-center border border-indigo-100">
                  <span className="block text-slate-400">Pelvic Δ</span>
                  <span className="font-bold">{bodyProfile.asymmetry?.pelvicTiltDiffPx || 0}px</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg text-center border border-indigo-100">
                  <span className="block text-slate-400">Lat. Curve</span>
                  <span className="font-bold">{bodyProfile.asymmetry?.lateralSpineCurveMm || 0}mm</span>
                </div>
              </div>
            </div>

            {/* 5-Zone Pressure Distribution */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Calculated 5-Zone Pressure Distribution:
              </span>
              <div className="space-y-2">
                {bodyProfile.pressureZones.map((zone) => (
                  <div key={zone.name} className="flex flex-col gap-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{zone.name}</span>
                      <span className={`capitalize font-bold text-[10px] ${getPressureTextColor(zone.status)}`}>
                        {zone.status.replace('-', ' ')} ({zone.loadPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPressureColor(zone.status)}`} 
                        style={{ width: `${zone.loadPercentage}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescribed Clinical Support Summary */}
            <div className="p-5 rounded-2xl bg-brand-950 text-white space-y-2 relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-28 h-28 bg-brand-700/20 rounded-full blur-xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block">
                PRESCRIBED HAYLEYS SYSTEM
              </span>
              <div className="text-base font-extrabold">{bodyProfile.primarySupportNeed}</div>
              <div className="text-xs text-brand-200 font-light">
                Target Recommended Firmness: <strong className="text-gold-400 text-sm font-bold">{primaryMatch.targetFirmnessComputed} / 10</strong>
              </div>
            </div>
          </div>

          {/* RIGHT: Recommendations Deck */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Primary/Optimal Match Highlight Card */}
            <div className="bg-white border-2 border-brand-950 rounded-3xl p-7 sm:p-8 premium-shadow relative overflow-hidden">
              {/* Premium Top badge */}
              <div className="absolute top-0 right-0 bg-brand-950 text-white px-6 py-2 rounded-bl-3xl text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                OPTIMAL MATCH • {primaryMatch.matchPercentage}%
              </div>

              <div className="flex flex-col md:flex-row gap-8 pt-6">
                {/* Visual Thumbnail */}
                <div className="md:w-5/12 space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center shadow-inner">
                    {renderMattressGraphic(primaryMatch.mattress.id, primaryMatch.mattress.category)}
                  </div>
                  
                  {/* Quick Spec Matrix */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Series:</span>
                      <strong className="text-slate-900 font-bold">{primaryMatch.mattress.category} Series</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thickness:</span>
                      <strong className="text-brand-700 font-bold">{primaryMatch.mattress.thickness}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Firmness Index:</span>
                      <strong className="text-slate-900 font-bold">{primaryMatch.mattress.firmness} / 10</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Warranty:</span>
                      <strong className="text-emerald-700 font-bold">{primaryMatch.mattress.warranty}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-brand-800">
                      <span className="font-bold">Suggested Size:</span>
                      <strong className="font-extrabold">{primaryMatch.recommendedSize}</strong>
                    </div>
                  </div>

                  {/* Mathematical Derivation Trigger */}
                  <button
                    onClick={() => setInspectDerivationRec(primaryMatch)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                  >
                    <Calculator className="w-3.5 h-3.5 text-brand-600" />
                    How Was This Derived? (Math)
                  </button>
                </div>

                {/* Content & Justification */}
                <div className="md:w-7/12 space-y-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 font-bold text-[10px] border border-brand-200">
                        {primaryMatch.mattress.category} Category
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Hayleys Official Portfolio</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2 tracking-tight">
                      {primaryMatch.mattress.name}
                    </h3>
                    
                    <p className="text-xs text-slate-600 font-light leading-relaxed mb-3">
                      {primaryMatch.mattress.description}
                    </p>

                    {/* Biomechanical Rationale */}
                    <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-100 mb-3 space-y-1">
                      <div className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-brand-700" /> Biomechanical Posture Match:
                      </div>
                      <p className="text-xs text-slate-700 font-light leading-relaxed">
                        {primaryMatch.mattress.whyMatchExplain}
                      </p>
                    </div>

                    {/* Partner & Asymmetry Notes */}
                    {(primaryMatch.motionIsolationNote || primaryMatch.asymmetryCompensationNote) && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 mb-3 space-y-1 text-xs">
                        {primaryMatch.motionIsolationNote && (
                          <div className="text-emerald-900 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            {primaryMatch.motionIsolationNote}
                          </div>
                        )}
                        {primaryMatch.asymmetryCompensationNote && (
                          <div className="text-emerald-900 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            {primaryMatch.asymmetryCompensationNote}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Key technologies list */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {primaryMatch.mattress.keyTechnologies.map(tech => (
                        <span key={tech} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <Button 
                      variant="primary" 
                      onClick={() => setSelectedMattress(primaryMatch.mattress)}
                      className="flex-grow"
                    >
                      <Layers className="w-4 h-4" /> Full Layer Specs
                    </Button>

                    <Button 
                      variant={compareList.some(m => m.id === primaryMatch.mattress.id) ? "outline" : "secondary"}
                      onClick={() => onAddToCompare(primaryMatch.mattress)}
                      className="flex items-center justify-center gap-1"
                    >
                      {compareList.some(m => m.id === primaryMatch.mattress.id) ? (
                        <>
                          <Minus className="w-4 h-4" /> Added to Compare
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Compare
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Runner Ups (Top 2, 3 and 4 alternate matches) */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Alternate Prescribed Hayleys Models
                </span>
                <span className="text-xs text-slate-400 font-light">
                  Deterministic compatibility ranking
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {runnerUps.map((match) => (
                  <div 
                    key={match.mattress.id} 
                    className="bg-white border border-slate-200 rounded-3xl p-5 premium-shadow relative flex flex-col justify-between hover:border-brand-400 transition-all"
                  >
                    <div>
                      {/* Match badge */}
                      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 text-[10px] font-bold border border-brand-200">
                        {match.matchPercentage}% MATCH
                      </div>

                      {/* Graphic */}
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-3 max-w-[130px]">
                        {renderMattressGraphic(match.mattress.id, match.mattress.category)}
                      </div>

                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                        {match.mattress.category} Series
                      </span>
                      <h4 className="text-base font-extrabold text-slate-950 mb-1">{match.mattress.name}</h4>
                      <p className="text-[11px] text-slate-500 font-light leading-relaxed mb-3 line-clamp-2">
                        {match.mattress.description}
                      </p>

                      <div className="space-y-1 text-xs text-slate-600 font-light mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Firmness:</span>
                          <span className="font-bold text-slate-900">{match.mattress.firmness} / 10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Thickness:</span>
                          <span className="font-medium text-slate-800">{match.mattress.thickness}</span>
                        </div>
                      </div>

                      {/* Derivation trigger button */}
                      <button
                        onClick={() => setInspectDerivationRec(match)}
                        className="text-[10px] font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 mb-3"
                      >
                        <Calculator className="w-3 h-3" /> See Calculation Derivation →
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <Button variant="outline" size="sm" onClick={() => setSelectedMattress(match.mattress)}>
                        Layer Specs
                      </Button>
                      <Button 
                        variant={compareList.some(m => m.id === match.mattress.id) ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => onAddToCompare(match.mattress)}
                      >
                        {compareList.some(m => m.id === match.mattress.id) ? 'Added to Compare' : 'Add to Compare'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Specifications & Layer-by-Layer Modal */}
      <AnimatePresence>
        {selectedMattress && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto premium-shadow relative text-slate-950 border border-slate-200"
            >
              <button 
                onClick={() => setSelectedMattress(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-800 font-extrabold text-xs border border-brand-200">
                    {selectedMattress.category} Series • {selectedMattress.warranty}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-3 tracking-tight">
                    {selectedMattress.name}
                  </h3>
                  <p className="text-xs font-bold text-brand-600 mt-1">
                    Standard Height / Thickness: {selectedMattress.thickness}
                  </p>
                  <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
                    {selectedMattress.description}
                  </p>
                </div>

                {/* Layer Cross Section */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-600" /> Internal Layer Architecture (Top to Base):
                  </h5>
                  <div className="space-y-2 pt-1">
                    {selectedMattress.layers.map((layer, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
                        <span className="w-5 h-5 rounded-full bg-brand-950 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{layer.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spec Ratings */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Firmness</span>
                    <strong className="text-slate-900 font-bold">{selectedMattress.firmness} / 10</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Cooling Index</span>
                    <strong className="text-sky-600 font-bold">{selectedMattress.coolingRating} / 5</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Pressure Relief</span>
                    <strong className="text-rose-600 font-bold">{selectedMattress.pressureReliefRating} / 5</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Motion Isolation</span>
                    <strong className="text-emerald-600 font-bold">{selectedMattress.motionIsolationRating} / 5</strong>
                  </div>
                </div>

                {/* Materials & Certifications */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Quality Certifications
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedMattress.certifications.map(c => (
                      <span key={c} className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-600" /> {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <Button variant="primary" onClick={() => setSelectedMattress(null)} className="w-full">
                    Close Details
                  </Button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Individual Recommendation Mathematical Derivation Trace Modal */}
      <DerivationDetailModal
        recommendation={inspectDerivationRec}
        bodyProfile={bodyProfile}
        onClose={() => setInspectDerivationRec(null)}
      />

    </section>
  );
};

export default Recommendations;
