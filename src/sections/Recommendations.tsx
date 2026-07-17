import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BodyProfile, RecommendationResult, Mattress } from '../types';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { 
  CheckCircle, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  X, 
  Wind, 
  Layers, 
  Heart,
  RefreshCw
} from 'lucide-react';

interface RecommendationsProps {
  bodyProfile: BodyProfile;
  recommendations: RecommendationResult[];
  debugCanvasUrl: string;
  onReset: () => void;
  onAddToCompare: (mattress: Mattress) => void;
  compareList: Mattress[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  bodyProfile,
  recommendations,
  debugCanvasUrl,
  onReset,
  onAddToCompare,
  compareList
}) => {
  const [selectedMattress, setSelectedMattress] = useState<Mattress | null>(null);
  
  // The first recommendation is our optimal match
  const primaryMatch = recommendations[0];
  const runnerUps = recommendations.slice(1, 3);

  // SVG representation map for mattress thumbnails
  const renderMattressGraphic = (id: string) => {
    const graphics: Record<string, React.ReactNode> = {
      'hayleys-spine-fit': (
        <svg className="w-full h-32 text-slate-200" viewBox="0 0 160 80">
          <rect x="10" y="10" width="140" height="60" rx="8" fill="#1e293b" />
          {/* Ortho spine lines */}
          <line x1="20" y1="40" x2="140" y2="40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          <rect x="25" y="25" width="110" height="30" rx="4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <text x="35" y="45" fill="#ffffff" className="text-[9px] font-bold tracking-wider font-sans">SPINE SUPPORT</text>
        </svg>
      ),
      'hayleys-memoire': (
        <svg className="w-full h-32 text-slate-200" viewBox="0 0 160 80">
          <rect x="10" y="10" width="140" height="60" rx="8" fill="#1d4ed8" />
          {/* Foam layers */}
          <rect x="20" y="20" width="120" height="10" fill="#3b82f6" rx="2" />
          <rect x="20" y="34" width="120" height="10" fill="#60a5fa" rx="2" />
          <rect x="20" y="48" width="120" height="12" fill="#93c5fd" rx="2" />
          <text x="45" y="42" fill="#ffffff" className="text-[9px] font-bold tracking-wider font-sans">MEMORY FOAM</text>
        </svg>
      ),
      'hayleys-royal-touch': (
        <svg className="w-full h-32 text-slate-200" viewBox="0 0 160 80">
          <rect x="10" y="10" width="140" height="60" rx="8" fill="#047857" />
          {/* Latex pins */}
          <circle cx="30" cy="30" r="3" fill="#34d399" />
          <circle cx="50" cy="30" r="3" fill="#34d399" />
          <circle cx="70" cy="30" r="3" fill="#34d399" />
          <circle cx="90" cy="30" r="3" fill="#34d399" />
          <circle cx="110" cy="30" r="3" fill="#34d399" />
          <circle cx="130" cy="30" r="3" fill="#34d399" />
          <circle cx="30" cy="50" r="3" fill="#34d399" />
          <circle cx="50" cy="50" r="3" fill="#34d399" />
          <circle cx="70" cy="50" r="3" fill="#34d399" />
          <circle cx="90" cy="50" r="3" fill="#34d399" />
          <circle cx="110" cy="50" r="3" fill="#34d399" />
          <circle cx="130" cy="50" r="3" fill="#34d399" />
          <text x="40" y="45" fill="#ffffff" className="text-[9px] font-bold tracking-wider font-sans">NATURAL LATEX</text>
        </svg>
      ),
      'hayleys-signature-spring': (
        <svg className="w-full h-32 text-slate-200" viewBox="0 0 160 80">
          <rect x="10" y="10" width="140" height="60" rx="8" fill="#475569" />
          {/* Springs representation */}
          <path d="M 25 50 Q 30 25, 35 50 T 45 50 T 55 50 T 65 50 T 75 50 T 85 50 T 95 50 T 105 50 T 115 50 T 125 50 T 135 50" fill="none" stroke="#e2e8f0" strokeWidth="2" />
          <text x="40" y="42" fill="#ffffff" className="text-[9px] font-bold tracking-wider font-sans">POCKET SPRINGS</text>
        </svg>
      ),
      'hayleys-ortho-support': (
        <svg className="w-full h-32 text-slate-200" viewBox="0 0 160 80">
          <rect x="10" y="10" width="140" height="60" rx="8" fill="#701a75" />
          {/* Dual side split */}
          <rect x="20" y="20" width="60" height="40" fill="#a21caf" rx="2" />
          <rect x="80" y="20" width="60" height="40" fill="#f0abfc" rx="2" />
          <text x="45" y="42" fill="#ffffff" className="text-[9px] font-bold tracking-wider font-sans">DUAL COMFORT</text>
        </svg>
      )
    };
    return graphics[id] || (
      <div className="w-full h-32 bg-brand-800 rounded-xl flex items-center justify-center text-white text-xs font-bold">
        HAYLEYS QUALITY
      </div>
    );
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
        
        {/* Title details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest block">REPORT DASHBOARD</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Your Personalized Sleep Diagnostic
            </h2>
            <p className="text-slate-600 font-light max-w-xl leading-relaxed">
              Based on standing geometry profiles captured client-side. The rule-engine matched your frame to the following mattress density configurations.
            </p>
          </div>

          <Button variant="outline" onClick={onReset} className="flex items-center gap-2 self-start md:self-auto">
            <RefreshCw className="w-4 h-4" /> Reset & Scan Again
          </Button>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Body Scan Diagnostics Report */}
          <div className="lg:col-span-5 space-y-8 bg-white border border-slate-100 rounded-3xl p-8 premium-shadow">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <Activity className="w-5 h-5 text-brand-800" />
              <h3 className="text-lg font-bold text-slate-950">1. Body Geometry Data</h3>
            </div>

            {/* OpenCV overlay image visualization */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-[300px]">
              <img 
                src={debugCanvasUrl} 
                alt="Skeletal contour scan" 
                className="w-full h-full object-contain max-h-[300px]"
              />
              <div className="absolute top-4 right-4 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-[10px] font-mono text-brand-400">
                FRAME ANALYZED
              </div>
            </div>

            {/* Body Metrics Grid summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Spine Alignment</span>
                <span className="text-sm font-bold text-slate-950 block mt-1">{bodyProfile.spineAlignmentRating}</span>
                <Badge variant={bodyProfile.spineAlignmentRating === 'Excellent' ? 'success' : bodyProfile.spineAlignmentRating === 'Fair' ? 'warning' : 'error'} size="sm">
                  {bodyProfile.spineDeviationPx}px Dev
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Shoulder Alignment</span>
                <span className="text-sm font-bold text-slate-950 block mt-1">{bodyProfile.shoulderAlignmentRating}</span>
                <Badge variant={bodyProfile.shoulderAlignmentRating === 'Aligned' ? 'success' : 'warning'} size="sm">
                  {bodyProfile.shoulderTiltAngle}° Tilt
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Body Symmetry</span>
                <span className="text-sm font-bold text-slate-950 block mt-1">{bodyProfile.symmetryRating}% Symmetrical</span>
                <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: `${bodyProfile.symmetryRating}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Calibrated Body Type</span>
                <span className="text-sm font-bold text-slate-950 block mt-1">{bodyProfile.bodyType}</span>
                <span className="text-[10px] text-slate-400 font-light block">Ratio: {bodyProfile.shoulderHipRatio}</span>
              </div>
            </div>

            {/* Pressure Zones list */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Estimated Pressure Distribution
                </span>
                <div className="space-y-3">
                  {bodyProfile.pressureZones.map((zone) => (
                    <div key={zone.name} className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{zone.name}</span>
                        <span className={`capitalize font-semibold text-[10px] ${getPressureTextColor(zone.status)}`}>
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
            </div>

            {/* Prescribed Support Summary */}
            <div className="p-5 rounded-2xl bg-brand-950 text-white space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-700/10 rounded-full blur-xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300">PRESCRIBED SYSTEM</span>
              <div className="text-lg font-extrabold">{bodyProfile.primarySupportNeed}</div>
              <div className="text-xs text-brand-200 font-light">
                Recommended Firmness Index: <strong className="text-gold-400 text-sm font-semibold">{bodyProfile.calculatedFirmnessScore}/10</strong> (Firm support profile)
              </div>
            </div>

          </div>

          {/* RIGHT: Mattress Recommendations Deck */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Primary/Optimal Match Highlight Card */}
            <div className="bg-white border-2 border-brand-950 rounded-3xl p-8 premium-shadow relative overflow-hidden">
              {/* Premium Top badge */}
              <div className="absolute top-0 right-0 bg-brand-950 text-white px-6 py-2 rounded-bl-3xl text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                OPTIMAL SLEEPMATCH • {primaryMatch.matchPercentage}%
              </div>

              <div className="flex flex-col md:flex-row gap-8 pt-6">
                {/* Visual */}
                <div className="md:w-1/3 space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center">
                    {renderMattressGraphic(primaryMatch.mattress.id)}
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-slate-500 font-light">
                    <div className="flex justify-between">
                      <span>Firmness Index:</span>
                      <strong className="text-slate-900 font-bold">{primaryMatch.mattress.firmness}/10</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Support Grade:</span>
                      <strong className="text-slate-900 font-bold">{primaryMatch.mattress.supportLevel}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Cooling Index:</span>
                      <strong className="text-slate-900 font-bold">{primaryMatch.mattress.coolingRating}/5</strong>
                    </div>
                  </div>
                </div>

                {/* Content info */}
                <div className="md:w-2/3 space-y-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-950 mb-2">
                      {primaryMatch.mattress.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-light leading-relaxed mb-4">
                      {primaryMatch.mattress.description}
                    </p>

                    {/* Explanatory justification */}
                    <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100/60 mb-4">
                      <div className="text-xs font-semibold text-brand-850 flex items-center gap-1 mb-1">
                        <ShieldCheck className="w-4 h-4 text-brand-700" /> Posture Alignment Rationale
                      </div>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {primaryMatch.mattress.whyMatchExplain}
                      </p>
                    </div>

                    {/* Technology tags */}
                    <div className="flex flex-wrap gap-2">
                      {primaryMatch.mattress.keyTechnologies.map(tech => (
                        <span key={tech} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <Button 
                      variant="primary" 
                      onClick={() => setSelectedMattress(primaryMatch.mattress)}
                      className="flex-grow"
                    >
                      Learn More Specifications
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
                          <Plus className="w-4 h-4" /> Compare Model
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Runner Ups (Top 2 and 3 matches) */}
            <div className="space-y-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Alternate Recommendations
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {runnerUps.map((match) => (
                  <div key={match.mattress.id} className="bg-white border border-slate-100 rounded-3xl p-6 premium-shadow relative flex flex-col justify-between">
                    <div>
                      {/* Match badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-[10px] font-bold border border-brand-100">
                        {match.matchPercentage}% MATCH
                      </div>

                      {/* Graphic */}
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 max-w-[120px]">
                        {renderMattressGraphic(match.mattress.id)}
                      </div>

                      <h4 className="text-lg font-bold text-slate-950 mb-2">{match.mattress.name}</h4>
                      <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                        {match.mattress.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-500 font-light mb-4">
                        <div className="flex justify-between">
                          <span>Firmness Index:</span>
                          <span className="text-slate-900 font-medium">{match.mattress.firmness}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Support Level:</span>
                          <span className="text-slate-900 font-medium">{match.mattress.supportLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                      <Button variant="outline" size="sm" onClick={() => setSelectedMattress(match.mattress)}>
                        Learn More
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

      {/* Learn More Overlay Specifications Modal */}
      <AnimatePresence>
        {selectedMattress && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto premium-shadow relative text-slate-950"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMattress(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="gold">HAYLEYS PREMIUM RANGE</Badge>
                  <span className="text-xs text-slate-400">Model Specifications</span>
                </div>

                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-3xl font-black text-slate-950 tracking-tight">{selectedMattress.name}</h3>
                  <p className="text-sm text-slate-500 font-light mt-2">{selectedMattress.description}</p>
                </div>

                {/* Spec breakdown details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Mattress properties */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sleep Clinic Ratings</h5>
                    <div className="space-y-3">
                      {[
                        { label: 'Firmness Density', val: selectedMattress.firmness, icon: <Layers className="w-4 h-4 text-brand-600" /> },
                        { label: 'Thermal Cooling', val: selectedMattress.coolingRating, icon: <Wind className="w-4 h-4 text-sky-500" /> },
                        { label: 'Pressure Relief Rating', val: selectedMattress.pressureReliefRating, icon: <Heart className="w-4 h-4 text-rose-500" /> },
                        { label: 'Motion Isolation Rating', val: selectedMattress.motionIsolationRating, icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> }
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="flex items-center gap-2 font-medium text-slate-600">
                            {item.icon} {item.label}
                          </span>
                          <span className="font-bold text-slate-950">{item.val}/10 (or 5)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material Composition details */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Composition</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedMattress.materials.map(mat => (
                        <span key={mat} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium bg-slate-50/50">
                          {mat}
                        </span>
                      ))}
                    </div>

                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-6">Ideal Sleeping Positions</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedMattress.idealPositions.map(pos => (
                        <span key={pos} className="px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-700 font-bold">
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-4">
                  <Button variant="primary" onClick={() => setSelectedMattress(null)} className="w-full">
                    Close Details
                  </Button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Recommendations;
