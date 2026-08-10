import React, { useState } from 'react';
import { 
  UserCheck, 
  Camera, 
  Layers, 
  Award, 
  Compass, 
  Cpu, 
  Eye, 
  Activity, 
  Calculator, 
  CheckCircle2
} from 'lucide-react';

interface HowItWorksProps {
  onOpenExplainer?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenExplainer }) => {
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);

  const steps = [
    {
      id: 1,
      icon: <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-700" />,
      title: "1. Posture & Sleep Profile",
      description: "Select your sleeping arrangement (Solo vs Married / Couple), height stature, weight load, and comfort priorities (cooling, zero disturbance, pressure relief)."
    },
    {
      id: 2,
      icon: <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-brand-700" />,
      title: "2. Optical Geometry Scan",
      description: "Stand upright in front of your camera or use the digital simulator. MediaPipe calculates shoulder tilt, hip width, and plumb-line spine deviation."
    },
    {
      id: 3,
      icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-brand-700" />,
      title: "3. 5-Zone Biomechanics",
      description: "The algorithm computes load percentages across cervical, thoracic, lumbar, pelvic, and lower limb contact zones to derive your Target Firmness Score (1–10)."
    },
    {
      id: 4,
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-brand-700" />,
      title: "4. Hayleys Mattress Matching",
      description: "Every Hayleys Spring, Rubberized Coir, and Foam mattress is evaluated with explainable mathematical formulas to find your optimal ergonomic match."
    }
  ];

  const pipelineStages = [
    {
      stage: 'Phase 01: Computer Vision Ingestion',
      icon: <Eye className="w-5 h-5 text-brand-400" />,
      title: 'MediaPipe 33-Landmark Pose Spatialization',
      formula: 'P_joint = (x_i, y_i, z_i, visibility_i) ∀ i ∈ [0..32]',
      explanation: 'Our in-browser neural network maps 33 anatomical landmark coordinates from the video frame without uploading video to any remote server.',
      highlights: ['Local browser processing', 'Zero latency landmark tracking', '100% Privacy compliant']
    },
    {
      stage: 'Phase 02: Coronal Spine Geometry',
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      title: 'Shoulder Cant & Spine Plumb Deviation Math',
      formula: 'θ_shoulder = arctan((y_R - y_L)/(x_R - x_L)) × 180/π  |  ΔS_spine = max|x_spine(y) - x_plumb|',
      explanation: 'Computes the lateral clavicular angle and vertebral spline curvature against the anatomical gravity plumb line.',
      highlights: ['Detects natural bilateral asymmetry', 'Measures lateral curve (mm/px)', 'Quantifies shoulder drop angle']
    },
    {
      stage: 'Phase 03: 5-Zone Pressure Synthesis',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      title: 'Vertebral Load Distribution & Target Firmness',
      formula: 'F_target = 6.0 + ΔF_spine + ΔF_morphotype + ΔF_weight  (Clamped: 3.0 .. 9.5)',
      explanation: 'Calculates the exact equilibrium resistance needed to maintain spinal neutrality throughout 8 hours of gravitational load.',
      highlights: ['Cervical to sacral load breakdown', 'Body mass index integration', 'Morphotype SHR ratio alignment']
    },
    {
      stage: 'Phase 04: Deterministic Catalogue Scoring',
      icon: <Calculator className="w-5 h-5 text-gold-400" />,
      title: 'Multi-Objective Mattress Compatibility Matrix',
      formula: 'Score(M) = 100 - (12 × |F_M - F_target|) + Bonus_Partner + Bonus_Orthopedic + Bonus_Position',
      explanation: 'Scores every Hayleys mattress model against your biometrics with zero AI hallucinations and complete mathematical transparency.',
      highlights: ['Motion isolation rating matching', 'Orthopedic coir / spring selection', 'Dimension tailoring (Queen/King)']
    }
  ];

  return (
    <section id="how-it-works" className="bg-slate-50 py-16 sm:py-24 border-y border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
            SCIENTIFIC METHODOLOGY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            How The Hayleys SleepMatcher Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Our multi-stage diagnostic engine pairs client-side Computer Vision with orthopedic biomechanics. No guesswork—every recommendation is 100% mathematically derived.
          </p>

          {onOpenExplainer && (
            <div className="pt-2">
              <button
                onClick={onOpenExplainer}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 bg-white px-4 py-2 rounded-full border border-brand-200 shadow-2xs transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-brand-600" />
                Explore Detailed Algorithm Equations & Derivations →
              </button>
            </div>
          )}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 premium-shadow premium-shadow-hover relative flex flex-col justify-between"
            >
              <div>
                {/* Step Number Badge */}
                <div className="absolute top-6 right-6 text-4xl sm:text-5xl font-black text-slate-100 font-mono leading-none select-none">
                  0{step.id}
                </div>

                {/* Icon Container */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-5 border border-brand-100">
                  {step.icon}
                </div>

                {/* Text Details */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Biomechanical & CV Engineering Pipeline Explorer */}
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Interactive Algorithmic Pipeline Architecture
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Tap through the 4 stages to see the exact Computer Vision and mathematical logic
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
              100% Client-Side Neural Execution
            </span>
          </div>

          {/* Pipeline Stage Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {pipelineStages.map((stg, idx) => (
              <button
                key={idx}
                onClick={() => setActivePipelineStage(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  activePipelineStage === idx
                    ? 'bg-brand-950 border-brand-400 text-white shadow-md ring-1 ring-brand-400'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold font-mono flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase truncate">
                    Phase {idx + 1}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {stg.title.split('&')[0]}
                </div>
              </button>
            ))}
          </div>

          {/* Active Stage Deep Dive */}
          {(() => {
            const cur = pipelineStages[activePipelineStage];
            return (
              <div className="p-5 sm:p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    {cur.icon}
                    <div>
                      <span className="text-[10px] font-mono uppercase text-brand-400 block font-bold">
                        {cur.stage}
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-white">{cur.title}</h4>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Step {activePipelineStage + 1} of 4
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-gold-300 border border-slate-800 overflow-x-auto">
                  {cur.formula}
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {cur.explanation}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {cur.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
