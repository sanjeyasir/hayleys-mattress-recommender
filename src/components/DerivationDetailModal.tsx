import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, ShieldCheck } from 'lucide-react';
import type { RecommendationResult, BodyProfile } from '../types';

interface DerivationDetailModalProps {
  recommendation: RecommendationResult | null;
  bodyProfile: BodyProfile | null;
  onClose: () => void;
}

export const DerivationDetailModal: React.FC<DerivationDetailModalProps> = ({
  recommendation,
  bodyProfile,
  onClose
}) => {
  if (!recommendation || !bodyProfile) return null;

  const { mattress, matchPercentage, derivationFactors, targetFirmnessComputed } = recommendation;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Header */}
          <div className="bg-slate-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md">
                <Calculator className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Mathematical Derivation Trace</h3>
                <p className="text-xs text-slate-400 font-light">
                  How <span className="text-gold-400 font-bold">{mattress.name}</span> achieved {matchPercentage}% compatibility
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50">
            {/* Top Score Banner */}
            <div className="p-5 rounded-2xl bg-brand-950 text-white flex items-center justify-between shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-brand-700/20 rounded-full blur-xl" />
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-300">CALCULATED COMPATIBILITY</span>
                <h4 className="text-2xl font-black">{mattress.name}</h4>
                <p className="text-xs text-slate-300 font-light">
                  Target Biometric Firmness: <strong className="text-gold-400 font-bold">{targetFirmnessComputed}/10</strong> | Model Firmness: <strong className="text-white font-bold">{mattress.firmness}/10</strong>
                </p>
              </div>
              <div className="text-3xl font-black text-gold-400 font-mono z-10">
                {matchPercentage}%
              </div>
            </div>

            {/* Posture Scan Diagnostics summary used for this calculation */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Ingested Biometric Inputs from Scan:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Spine Dev</span>
                  <span className="font-bold text-slate-900">{bodyProfile.spineDeviationPx} px</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Shoulder Tilt</span>
                  <span className="font-bold text-slate-900">{bodyProfile.shoulderTiltAngle}°</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">SHR Ratio</span>
                  <span className="font-bold text-slate-900">{bodyProfile.shoulderHipRatio}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Morphotype</span>
                  <span className="font-bold text-emerald-700">{bodyProfile.bodyType}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Mathematical Derivation Factors */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Formula Point Adjustments & Rules Applied:
              </span>

              <div className="space-y-2.5">
                {derivationFactors.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">{item.factor}</h5>
                        <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                      </div>

                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg ${
                        item.impact > 0 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : item.impact < 0 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.impact > 0 ? `+${item.impact}` : item.impact} pts
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 text-brand-300 font-mono text-[11px] border border-slate-800">
                      {item.formula}
                    </div>

                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Size & Partner Kinematics summary */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Prescribed Mattress Dimension & Arrangement:
              </span>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Optimal Tailored Dimension:</span>
                  <strong className="text-brand-800 font-extrabold text-sm">{recommendation.recommendedSize}</strong>
                </div>
                {recommendation.motionIsolationNote && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    ✓ {recommendation.motionIsolationNote}
                  </span>
                )}
              </div>
            </div>

            {/* Biomechanical Rationale */}
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900">
                <ShieldCheck className="w-4 h-4 text-brand-700" /> Hayleys Clinical Sleep Recommendation:
              </div>
              <p className="text-xs text-brand-800 font-light leading-relaxed">
                {mattress.whyMatchExplain}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-light">100% Deterministic • Hayleys Mattress Sleep Engine</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-all cursor-pointer"
            >
              Close Breakdown
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DerivationDetailModal;
