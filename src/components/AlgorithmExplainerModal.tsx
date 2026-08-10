import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Cpu, 
  Eye, 
  Activity, 
  Sparkles,
  Sliders, 
  Calculator, 
  ArrowRight,
  Users,
  Ruler,
  Weight
} from 'lucide-react';

interface AlgorithmExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmExplainerModal: React.FC<AlgorithmExplainerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Interactive Sandbox parameters
  const [simSpineDev, setSimSpineDev] = useState<number>(18);
  const [simShoulderTilt, setSimShoulderTilt] = useState<number>(2.8);
  const [simRatio] = useState<number>(1.12);
  const [simHeight, setSimHeight] = useState<'Petite' | 'Average' | 'Tall' | 'Very Tall'>('Tall');
  const [simWeight, setSimWeight] = useState<'Lightweight (< 55kg)' | 'Standard (55-75kg)' | 'Heavy (75-95kg)' | 'Extra Heavy (> 95kg)'>('Standard (55-75kg)');
  const [simStatus, setSimStatus] = useState<'Single (Solo Sleeper)' | 'Married / Couple (Sharing Bed)'>('Married / Couple (Sharing Bed)');
  const [simPosition] = useState<'Back Sleeper' | 'Side Sleeper' | 'Stomach Sleeper' | 'Combination Sleeper'>('Back Sleeper');

  // Compute live sandbox formula
  const computedMorphotype = simRatio > 1.14 ? 'Ectomorph' : simRatio < 0.96 ? 'Endomorph' : 'Mesomorph';
  let computedFirmness = 6;
  if (simSpineDev > 24) computedFirmness += 2;
  else if (simSpineDev > 12) computedFirmness += 1;

  if (computedMorphotype === 'Ectomorph') computedFirmness -= 2;
  else if (computedMorphotype === 'Endomorph') computedFirmness += 1;

  if (simWeight === 'Extra Heavy (> 95kg)') computedFirmness += 1.5;
  else if (simWeight === 'Heavy (75-95kg)') computedFirmness += 0.8;
  else if (simWeight === 'Lightweight (< 55kg)') computedFirmness -= 1.0;
  computedFirmness = Math.max(3, Math.min(9.5, computedFirmness));

  const isCouple = simStatus === 'Married / Couple (Sharing Bed)';
  const recommendedSize = isCouple 
    ? (simHeight === 'Tall' || simHeight === 'Very Tall' ? 'King 78" × 72"' : 'Queen 75" × 60"')
    : (simHeight === 'Tall' || simHeight === 'Very Tall' ? 'Double 78" × 48"' : 'Single 75" × 36"');

  // Sample comparison
  const euroTopDiff = Math.abs(7 - computedFirmness);
  const euroTopScore = Math.min(99, Math.max(65, Math.round(100 - (euroTopDiff * 9) + 8 + 6 + (isCouple ? 12 : 4) + (simSpineDev > 18 ? 14 : 0))));

  const orthoCoirDiff = Math.abs(9.5 - computedFirmness);
  const orthoCoirScore = Math.min(99, Math.max(65, Math.round(100 - (orthoCoirDiff * 9) + (simPosition === 'Back Sleeper' ? 8 : -10) + (isCouple ? 4 : 4) + (simSpineDev > 18 ? 14 : -10))));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Top Modal Header */}
          <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
                <Cpu className="w-5 h-5 text-brand-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold tracking-wide text-white">
                    Hayleys SleepMatch Mathematical Engine
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Deterministic Biometrics
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-light">
                  How optical spine mapping, natural human asymmetry, BMI load, and marital sleep status derive your mattress
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close Explainer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Step Selector Tab Navigation */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2 flex-nowrap shrink-0">
              {[
                { id: 1, title: '1. Spine Mapping', icon: <Eye className="w-3.5 h-3.5" /> },
                { id: 2, title: '2. Bilateral Asymmetry', icon: <Activity className="w-3.5 h-3.5" /> },
                { id: 3, title: '3. Multi-Factor Formula', icon: <Calculator className="w-3.5 h-3.5" /> },
                { id: 4, title: '4. Live Math Sandbox', icon: <Sliders className="w-3.5 h-3.5 text-gold-600" /> }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeStep === step.id
                      ? 'bg-brand-950 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {step.icon}
                  <span>{step.title}</span>
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono hidden lg:block shrink-0">
              Zero Hallucination • 100% Explainable Biomechanical Math
            </div>
          </div>

          {/* Modal Main Scrollable Content */}
          <div className="flex-grow overflow-y-auto p-6 sm:p-8 bg-slate-50 space-y-8">
            
            {/* STEP 1: ANATOMICAL SPINE MAPPING */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">STAGE 01: SKELETAL MAPPING</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Multi-Vertebra Anatomical Spine Spline Mapping
                  </h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed mt-2 max-w-3xl">
                    Instead of a generic straight line, our Computer Vision engine maps your spine through an anatomical spline anchored across 6 vertebral landmarks: <strong>Atlas C1, Cervical C7, Thoracic T4 & T8, Lumbar L3, and Sacrum S1</strong>.
                  </p>
                </div>

                {/* Mathematical Formula Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      θ
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Shoulder Cant / Tilt Angle</h4>
                    <div className="p-3 bg-slate-900 text-brand-300 font-mono text-xs rounded-xl border border-slate-800">
                      θ = arctan( (y_R - y_L) / (x_R - x_L) ) × (180/π)
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Measures angular deviation of clavicular line from horizontal plane. Angles &gt; 2.5° indicate asymmetric shoulder height requiring independent pocket spring contouring.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      SHR
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Anthropometric Ratio (SHR)</h4>
                    <div className="p-3 bg-slate-900 text-brand-300 font-mono text-xs rounded-xl border border-slate-800">
                      SHR = ||S_R - S_L|| / ||H_R - H_L||
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Computes shoulder biacromial diameter divided by pelvic bitrochanteric width to classify body somatotype (Ectomorph &gt; 1.14, Mesomorph 0.96–1.14, Endomorph &lt; 0.96).
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 font-bold text-xs">
                      ΔS
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Coronal Plumb-Line Spine Deviation</h4>
                    <div className="p-3 bg-slate-900 text-brand-300 font-mono text-xs rounded-xl border border-slate-800">
                      ΔS = max(|x_Nose - x_PelvisMid|, |x_ShMid - x_PelvisMid|)
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Measures horizontal deflection from central plumb axis. Lateral deviation &gt; 18px mandates high-density Rubberized Coir orthopedic reinforcement.
                    </p>
                  </div>
                </div>

                {/* Optical Triangulation Pipeline */}
                <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
                    <Eye className="w-4 h-4" /> Optical Landmark Triangulation Overview
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono block">1. FRAME INGEST</span>
                      <p className="text-xs font-bold text-white mt-1">Optical Coordinates</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Nose, Shoulders, Pelvis, Knees</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono block">2. CORONAL AXIS</span>
                      <p className="text-xs font-bold text-white mt-1">Plumb Plumb Line</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Calculates lateral shift (ΔS)</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono block">3. ANGULAR TILT</span>
                      <p className="text-xs font-bold text-white mt-1">Clavicle Cant (θ)</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Measures bilateral shoulder drop</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono block">4. TARGET DENSITY</span>
                      <p className="text-xs font-bold text-emerald-400 mt-1">Firmness Index</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">1–10 Hayleys firmness mapping</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: NATURAL HUMAN ASYMMETRY */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">STAGE 02: BIOLOGICAL ASYMMETRY</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Why Natural Human Bodies Are Never 100% Symmetrical
                  </h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed mt-2 max-w-3xl">
                    In medical kinesiology, true 100% geometric symmetry does not exist in living human beings. Healthy individuals naturally exhibit 4% to 25% bilateral variation due to four fundamental biomechanical causes:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">1</span>
                    <h4 className="text-sm font-bold text-slate-900">Functional Handedness & Shoulder Depression</h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      The dominant arm (right for ~90% of humans) has increased trapezius and latissimus dorsi mass, causing a natural 1.5° to 4.0° downward depression on the dominant shoulder.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">2</span>
                    <h4 className="text-sm font-bold text-slate-900">Unilateral Pelvic Stance Load</h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Humans naturally rest 60–70% of standing weight on one dominant leg, producing a subtle pelvic tilt (Δy = 3–8px) that rotates the sacral base.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">3</span>
                    <h4 className="text-sm font-bold text-slate-900">Thoracic Organ Asymmetry & Ribcage Rotation</h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      The human heart on the left and liver on the right create natural asymmetry in internal cavity mass, driving minor lateral spinal rotation (5–12mm).
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                    <span className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 font-bold text-xs">4</span>
                    <h4 className="text-sm font-bold text-slate-900">Hayleys Zoned Engineering Response</h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Instead of forcing the body onto an unnaturally rigid flat plank, Hayleys <strong>Independently Encased Pocket Springs</strong> and <strong>Rubberized Coir + Latex Euro Tops</strong> deflect independently under each shoulder and hip to restore spine neutrality.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: MULTI-FACTOR SCORING & COUPLES SLEEP */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">STAGE 03: DETERMINISTIC SCORING & PARTNERS</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Multi-Factor Compatibility Formula & Couples Kinematics
                  </h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed mt-2 max-w-3xl">
                    Our scoring equation accounts for standing spine deviation, BMI mass load, height lever arm, and whether you sleep solo or sharing a bed with a partner.
                  </p>
                </div>

                <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">MASTER RECOMMENDATION EQUATION</span>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm sm:text-base font-mono text-brand-300 overflow-x-auto leading-relaxed">
                    Score(M) = 100 - (9 × |F_M - F_Target|) + B_Partner + B_Pos + B_Morph + B_Ortho + B_Height + B_Cool
                  </div>
                  <div className="text-xs text-slate-400 font-light grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <strong className="text-white font-semibold">1. Couples / Married Sleep (B_Partner):</strong> Pocketed Spring models earn a +12 bonus for zero partner disturbance, while Bonnell interconnected coils receive a -12 deduction.
                    </div>
                    <div>
                      <strong className="text-white font-semibold">2. Height & Dimension Selection:</strong> Tall (&gt; 175cm) sleepers automatically receive 78" Extended Length sizing suggestions (King/Queen 78" lengths).
                    </div>
                    <div>
                      <strong className="text-white font-semibold">3. Weight Load Calibration:</strong> Heavier individuals (&gt; 75kg) shift target firmness upward to prevent pelvic sagging.
                    </div>
                    <div>
                      <strong className="text-white font-semibold">4. Orthopedic Spine Correction:</strong> +14 points for 100% Eco-Friendly Rubberized Coir when spine deviation &gt; 18px.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: LIVE INTERACTIVE MATH SANDBOX */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">STAGE 04: INTERACTIVE LAB</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Live Biometric Algorithm Simulator
                  </h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed mt-2 max-w-3xl">
                    Adjust the biometric inputs below (including height, weight, and single vs married status) to observe live score derivations for Hayleys models.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left: Input Controls */}
                  <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-brand-600" /> Biometric Input Controls
                    </h4>

                    {/* Sleeper Status */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-brand-600" /> Sleeping Arrangement:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Single (Solo Sleeper)', 'Married / Couple (Sharing Bed)'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setSimStatus(s)}
                            className={`py-2 text-[11px] font-bold rounded-xl border transition-all text-center ${
                              simStatus === s
                                ? 'bg-brand-950 text-white border-brand-950'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {s.includes('Couple') ? 'Couple / Married' : 'Solo Sleeper'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Height Category */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 text-indigo-600" /> Height:
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['Petite', 'Average', 'Tall', 'Very Tall'] as const).map((h) => (
                          <button
                            key={h}
                            onClick={() => setSimHeight(h)}
                            className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all text-center ${
                              simHeight === h
                                ? 'bg-brand-950 text-white border-brand-950'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Spine Dev Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">Spine Deviation (ΔS):</span>
                        <span className="font-mono font-bold text-brand-700">{simSpineDev} px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="40"
                        value={simSpineDev}
                        onChange={(e) => setSimSpineDev(Number(e.target.value))}
                        className="w-full accent-brand-600 cursor-pointer"
                      />
                    </div>

                    {/* Shoulder Tilt */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">Shoulder Tilt Angle (θ):</span>
                        <span className="font-mono font-bold text-indigo-700">{simShoulderTilt}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.2"
                        value={simShoulderTilt}
                        onChange={(e) => setSimShoulderTilt(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    {/* Weight Category */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Weight className="w-3.5 h-3.5 text-emerald-600" /> Weight:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['Lightweight (< 55kg)', 'Standard (55-75kg)', 'Heavy (75-95kg)', 'Extra Heavy (> 95kg)'] as const).map((w) => (
                          <button
                            key={w}
                            onClick={() => setSimWeight(w)}
                            className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all text-center truncate ${
                              simWeight === w
                                ? 'bg-brand-950 text-white border-brand-950'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Outcome */}
                  <div className="lg:col-span-6 space-y-5">
                    <div className="bg-brand-950 text-white rounded-3xl p-6 space-y-4 shadow-xl border border-brand-900">
                      <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">CALCULATED TARGET METRICS</span>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 font-light">Recommended Firmness</span>
                          <div className="text-3xl font-black text-white">{computedFirmness.toFixed(1)} / 10</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-light">Suggested Mattress Size</span>
                          <div className="text-base font-extrabold text-gold-400">{recommendedSize}</div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                        <div>F_Target = 6 + ΔF_Spine({simSpineDev > 18 ? '+2' : '0'}) + ΔF_Morph({computedMorphotype === 'Ectomorph' ? '-2' : computedMorphotype === 'Endomorph' ? '+1' : '0'}) + ΔF_Weight</div>
                        <div className="text-emerald-400 font-bold">Partner Motion Isolation: {isCouple ? 'Mandatory (+12 pts on Pocket Springs)' : 'Solo Tuning (+4 pts)'}</div>
                      </div>
                    </div>

                    {/* Live Match Comparison */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Live Model Scores:</span>

                      {/* Pristine Euro Top */}
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">Pristine Euro Top (12" Spring)</span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">Pocketed Coils</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-light block mt-0.5">
                            {isCouple ? 'Zero partner disturbance boost active' : 'Adaptive bilateral suspension'}
                          </span>
                        </div>
                        <div className="text-xl font-black text-brand-700">{euroTopScore}%</div>
                      </div>

                      {/* Orthopaedic Coir */}
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">Orthopaedic Coir (4" Coir)</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Firmness 9.5</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-light block mt-0.5">
                            {simSpineDev > 18 ? 'Rigid spine-neutralizing boost active (+14)' : 'Extra-firm alignment hold'}
                          </span>
                        </div>
                        <div className="text-xl font-black text-brand-700">{orthoCoirScore}%</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Controls */}
          <div className="bg-slate-950 text-slate-300 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Hayleys Mattress AI Biometric System • Pure Explainable Math</span>
            </div>

            <div className="flex items-center gap-3">
              {activeStep < 4 ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  Next Stage <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer shadow-md"
                >
                  Close Explainer
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AlgorithmExplainerModal;
