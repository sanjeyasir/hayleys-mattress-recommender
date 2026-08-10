import React, { useState } from 'react';
import { 
  Calculator, 
  Activity, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowDownUp,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import type { BodyProfile, RecommendationResult } from '../types';

interface EngineeringExplainerCardProps {
  bodyProfile: BodyProfile;
  recommendations: RecommendationResult[];
  onOpenFullExplainerModal?: () => void;
}

export const EngineeringExplainerCard: React.FC<EngineeringExplainerCardProps> = ({
  bodyProfile,
  recommendations,
  onOpenFullExplainerModal
}) => {
  const [activeTab, setActiveTab] = useState<'math' | 'spine' | 'partner' | 'asymmetry'>('math');
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const [activeZoneKey, setActiveZoneKey] = useState<string>('Lumbar L1–L5 (Lower Back / Lordosis)');

  const currentRec = recommendations[selectedModelIndex] || recommendations[0];
  const { mattress, matchPercentage, derivationFactors, targetFirmnessComputed } = currentRec;

  const spineZones = [
    {
      name: 'Cervical C1–C7 (Neck & Upper Spine)',
      load: '12%',
      role: 'Neutral lordotic curvature preservation',
      pressureDesc: 'Light contact zone. Requires responsive top-layer cushioning (Latex / Quilting) to prevent morning cervical stiffness.',
      optimalTech: 'Memory Foam / Perforated Latex pillow top'
    },
    {
      name: 'Thoracic T1–T12 (Upper Back & Ribcage)',
      load: '28%',
      role: 'Kyphotic curve support and shoulder relief',
      pressureDesc: 'Significant load area. In side sleepers, shoulders protrude deeper into the surface. Independent pocket springs prevent shoulder nerve compression.',
      optimalTech: 'Encased Pocket Springs / Multi-zone contouring'
    },
    {
      name: 'Lumbar L1–L5 (Lower Back / Lordosis)',
      load: '35%',
      role: 'Critical lumbar reinforcement & plumb neutrality',
      pressureDesc: 'Highest biomechanical risk zone. Lack of pushback causes pelvic sag and morning lower back pain. Rubberized coir / high-density foam maintains spinal plumb line.',
      optimalTech: 'Orthopedic Rubberized Coir & High Resilience Core'
    },
    {
      name: 'Pelvic & Sacral S1–S5 (Hips & Center of Mass)',
      load: '20%',
      role: 'Heaviest gravitational mass absorption',
      pressureDesc: 'Primary gravitational center. Absorbs 40-50% of body mass during supine sleep. Reinforced spring tension prevents excessive pelvic sinkage.',
      optimalTech: 'Heavy-Gauge Bonnell / Pocket Spring Network'
    },
    {
      name: 'Lower Extremities (Legs & Feet)',
      load: '5%',
      role: 'Circulatory relief and subtle stabilization',
      pressureDesc: 'Light gravitational zone requiring gentle, even suspension for peripheral vascular blood flow.',
      optimalTech: 'Convoluted Airflow Transition Foam'
    }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-5 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Cpu className="w-5 h-5 text-brand-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                The Engineering Behind Your Match
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                100% DETERMINISTIC CALCULATION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Live mathematical derivation, 5-zone spinal physics, and material kinetics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFullExplainerModal && (
            <button
              onClick={onOpenFullExplainerModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-gold-400" />
              Full Formula Whitepaper
            </button>
          )}
        </div>
      </div>

      {/* Model Selection Tabs for Live Derivation */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Inspect Engineering Derivation For Model:
          </span>
          <span className="text-[10px] font-mono text-brand-300">
            Click to compare math derivations
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {recommendations.slice(0, 4).map((rec, idx) => (
            <button
              key={rec.mattress.id}
              onClick={() => setSelectedModelIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                selectedModelIndex === idx
                  ? 'bg-brand-950 border-brand-500 text-white shadow-lg ring-1 ring-brand-400'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase text-brand-400">
                  {idx === 0 ? 'Optimal Match' : `Option 0${idx + 1}`}
                </span>
                <span className="text-xs font-black font-mono text-gold-400">
                  {rec.matchPercentage}%
                </span>
              </div>
              <div className="text-xs font-extrabold truncate text-white">
                {rec.mattress.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Firmness {rec.mattress.firmness}/10
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-800 pb-3 relative z-10">
        {[
          { id: 'math', label: '1. Mathematical Formula Trace', icon: <Calculator className="w-3.5 h-3.5" /> },
          { id: 'spine', label: '2. 5-Zone Spinal Biomechanics', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'asymmetry', label: '3. Bilateral Asymmetry Neutralization', icon: <ArrowDownUp className="w-3.5 h-3.5" /> },
          { id: 'partner', label: '4. Partner Kinematics & Motion Dampening', icon: <HeartHandshake className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: MATHEMATICAL FORMULA TRACE */}
      {activeTab === 'math' && (
        <div className="space-y-6 relative z-10">
          {/* Top Formula Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-widest block">
                CORE EQUILIBRIUM EQUATION
              </span>
              <div className="font-mono text-xs sm:text-sm text-gold-300 font-bold overflow-x-auto py-1">
                Score({mattress.name}) = 100 - (12 × ΔF) + Bonus(Posture) + Bonus(Spine) + Bonus(Partner)
              </div>
              <p className="text-[11px] text-slate-400 font-light">
                Target Biometric Firmness: <strong className="text-white">{targetFirmnessComputed} / 10</strong> vs Mattress Firmness: <strong className="text-gold-400">{mattress.firmness} / 10</strong> (Firmness Gap ΔF = {Math.abs(mattress.firmness - targetFirmnessComputed).toFixed(1)})
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Calculated Match</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                  {matchPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Point-by-Point Derivation Waterfall */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Point Adjustment Breakdown for {mattress.name}:
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {derivationFactors.length} Rules Applied
              </span>
            </div>

            <div className="space-y-2.5">
              {derivationFactors.map((factor, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-600 transition-all"
                >
                  <div className="space-y-1 sm:w-8/12">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold font-mono flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white">{factor.factor}</h4>
                      <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-900 text-brand-300 border border-slate-800">
                        {factor.category}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-brand-200 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 overflow-x-auto">
                      {factor.formula}
                    </div>
                    <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                      {factor.explanation}
                    </p>
                  </div>

                  <div className="sm:w-3/12 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700/50">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Impact</span>
                    <span className={`font-mono text-sm font-black px-2.5 py-1 rounded-xl ${
                      factor.impact > 0 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : factor.impact < 0 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-slate-700 text-slate-300'
                    }`}>
                      {factor.impact > 0 ? `+${factor.impact}` : factor.impact} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: 5-ZONE SPINAL BIOMECHANICS */}
      {activeTab === 'spine' && (
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Interactive Spinal Column Visual */}
            <div className="md:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                5-Zone Human Load Distribution
              </span>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Click any vertebral region below to inspect why your body profile requires specialized resistance:
              </p>

              <div className="space-y-2">
                {spineZones.map((zone) => (
                  <button
                    key={zone.name}
                    onClick={() => setActiveZoneKey(zone.name)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      activeZoneKey === zone.name
                        ? 'bg-brand-900/80 border-brand-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{zone.name}</div>
                      <div className="text-[10px] text-slate-400">{zone.role}</div>
                    </div>
                    <span className="font-mono text-xs font-black text-gold-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {zone.load}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Zone Deep-Dive Details */}
            <div className="md:col-span-7 bg-slate-850/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
              {(() => {
                const zone = spineZones.find(z => z.name === activeZoneKey) || spineZones[2];
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-brand-400 block font-bold">
                          VERTEBRAL LOAD ZONE ANALYSIS
                        </span>
                        <h4 className="text-base font-extrabold text-white mt-0.5">{zone.name}</h4>
                      </div>
                      <span className="text-xl font-black font-mono text-gold-400">
                        {zone.load} of Body Load
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Biomechanical Pressure Mechanism:
                      </span>
                      <p className="text-xs text-slate-300 font-light leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                        {zone.pressureDesc}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-brand-950/80 border border-brand-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Hayleys Engineered Countermeasure:
                      </div>
                      <p className="text-xs text-slate-200 font-medium">
                        {zone.optimalTech}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
                      Evaluated against your scan metrics: <strong>{bodyProfile.spineDeviationPx}px Spine Plumb Deviation</strong> & <strong>{bodyProfile.bodyType} Morphotype</strong>.
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: BILATERAL ASYMMETRY NEUTRALIZATION */}
      {activeTab === 'asymmetry' && (
        <div className="space-y-6 relative z-10">
          <div className="p-5 rounded-2xl bg-indigo-950/50 border border-indigo-800/60 space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">
                Human Natural Bilateral Asymmetry Profile ({bodyProfile.symmetryRating}% Bilateral Balance)
              </h4>
            </div>
            <p className="text-xs text-indigo-200/90 font-light leading-relaxed">
              Biomechanical research confirms over 95% of healthy adults possess 4–15% natural bilateral asymmetry due to dominant hand usage, daily postural habits, and natural musculoskeletal tone. The Hayleys engine recognizes this rather than forcing an unnatural flat posture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">1. Shoulder Cant (θ)</span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {bodyProfile.shoulderTiltAngle}°
              </div>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                {Math.abs(bodyProfile.shoulderTiltAngle) > 2.5 
                  ? 'Elevated shoulder cant requires independent pocket springs to absorb the lower shoulder without straining the cervical spine.'
                  : 'Balanced shoulder alignment allows standard plush or firm surface support.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">2. Spine Plumb Deviation</span>
              <div className="text-2xl font-black font-mono text-gold-400">
                {bodyProfile.spineDeviationPx} px
              </div>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                {bodyProfile.spineDeviationPx > 18 
                  ? 'Elevated lateral curve benefits from high-density rubberized coir which neutralizes pelvic sag and restores spinal plumb alignment.'
                  : 'Minimal spinal deviation allows versatile medium-firm comfort options.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">3. Shoulder-to-Hip Ratio</span>
              <div className="text-2xl font-black font-mono text-indigo-400">
                {bodyProfile.shoulderHipRatio} ({bodyProfile.bodyType})
              </div>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Calibrates mass distribution between upper torso and pelvic basin, preventing pressure hot-spots during 8 hours of sleep.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: PARTNER KINEMATICS & MOTION ISOLATION */}
      {activeTab === 'partner' && (
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pocket Spring / Visco Physics */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-bold text-white">Independent Pocket Coils & Visco Foam</h4>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-emerald-300 border border-slate-800">
                Vibration Transmission Index &lt; 8% (Zero Partner Disturbance)
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Each barrel spring is individually encased in spun-bond fabric pockets. When one partner shifts or tosses, compression energy is absorbed strictly locally without transferring kinetic waves across the sleep surface.
              </p>
            </div>

            {/* Continuous Bonnell Physics */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <h4 className="text-sm font-bold text-white">Interconnected Bonnell Network</h4>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-amber-300 border border-slate-800">
                Vibration Transmission Index ~ 45% (Solo Sleeper Optimal)
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Hourglass steel coils are helically interconnected along horizontal wire grids. Highly durable and buoyant for solo sleepers, but transfers kinetic shifts when sharing a bed with a partner.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-950 border border-brand-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Applied Arrangement Rule:</span>
              <strong className="text-gold-400 font-bold">{currentRec.recommendedSize} • {currentRec.motionIsolationNote || "Optimized for individual biomechanical contouring."}</strong>
            </div>
            <div className="font-mono text-brand-300 text-[11px] bg-brand-900/80 px-3 py-1.5 rounded-lg border border-brand-700/60 shrink-0">
              Motion Isolation: {mattress.motionIsolationRating}/5
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Calculated entirely client-side with zero latency and zero data sharing.</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">Hayleys Biomechanical Math Engine v2.4</span>
      </div>
    </div>
  );
};

export default EngineeringExplainerCard;
