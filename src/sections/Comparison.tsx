import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Mattress } from '../types';
import Button from '../components/Button';
import { Layers, X } from 'lucide-react';

interface ComparisonProps {
  compareList: Mattress[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenCatalogue?: () => void;
}

export const Comparison: React.FC<ComparisonProps> = ({
  compareList,
  onRemove,
  onClear,
  onOpenCatalogue
}) => {
  const compareFeatures = [
    { label: 'Mattress Category', key: 'category' },
    { label: 'Thickness / Height', key: 'thickness' },
    { label: 'Warranty Period', key: 'warranty' },
    { label: 'Firmness Rating', key: 'firmness', suffix: ' / 10' },
    { label: 'Support Grade', key: 'supportLevel' },
    { label: 'Thermal Cooling Index', key: 'coolingRating', suffix: ' / 5' },
    { label: 'Pressure Relief Rating', key: 'pressureReliefRating', suffix: ' / 5' },
    { label: 'Motion Isolation Rating', key: 'motionIsolationRating', suffix: ' / 5' },
    { label: 'Key Technologies', key: 'keyTechnologies', isArray: true },
    { label: 'Ideal Sleeping Positions', key: 'idealPositions', isArray: true },
    { label: 'Body Type Suitability', key: 'bodyTypeSuitability', isArray: true },
    { label: 'Quality Certifications', key: 'certifications', isArray: true }
  ];

  return (
    <section id="comparison" className="bg-white py-24 border-b border-slate-200 scroll-mt-6">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
              HAYLEYS MATTRESS SPECIFICATION MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Compare Hayleys Mattress Models
            </h2>
            <p className="text-slate-600 font-light max-w-xl leading-relaxed">
              Compare physical layers, orthopedic densities, thickness dimensions, and warranty coverage side-by-side.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenCatalogue && (
              <Button variant="outline" size="sm" onClick={onOpenCatalogue}>
                Browse All 10 Models
              </Button>
            )}
            {compareList.length > 0 && (
              <Button variant="outline" size="sm" onClick={onClear} className="self-start md:self-auto">
                Clear Comparison List
              </Button>
            )}
          </div>
        </div>

        {/* Comparison grid / empty states */}
        <AnimatePresence mode="wait">
          {compareList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="border border-dashed border-slate-300 rounded-3xl p-16 text-center max-w-2xl mx-auto space-y-6 bg-slate-50/50"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto text-brand-700">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900">Your comparison list is empty</h4>
                <p className="text-xs text-slate-500 font-light max-w-md mx-auto leading-relaxed">
                  Click the <strong>"Compare"</strong> button on your recommended mattresses above to analyze structural layers, warranties, and densities side-by-side.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm"
            >
              <table className="w-full text-left border-collapse bg-white min-w-[720px]">
                <thead>
                  <tr className="bg-slate-950 text-white border-b border-slate-800">
                    <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4">
                      Specification Features
                    </th>
                    {compareList.map((mattress) => (
                      <th key={mattress.id} className="p-6 text-center relative w-1/4 min-w-[220px] border-l border-slate-800">
                        <button
                          onClick={() => onRemove(mattress.id)}
                          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-rose-900/80 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 py-0.5 rounded-full bg-brand-600/30 text-brand-300 text-[9px] font-mono font-bold uppercase">
                          {mattress.category}
                        </span>
                        <h4 className="text-base font-extrabold text-white mt-1.5">{mattress.name}</h4>
                        <span className="text-[11px] text-gold-400 font-semibold block mt-0.5">
                          {mattress.thickness}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFeatures.map((feat) => (
                    <tr key={feat.label} className="border-b border-slate-100 hover:bg-slate-50/70 transition-all">
                      <td className="p-5 text-xs font-bold text-slate-800 bg-slate-50/40">
                        {feat.label}
                      </td>
                      {compareList.map((mattress) => {
                        const val = (mattress as any)[feat.key];
                        return (
                          <td key={mattress.id + feat.key} className="p-5 text-center text-xs text-slate-600 font-light border-l border-slate-100">
                            {feat.isArray ? (
                              <div className="flex flex-wrap justify-center gap-1">
                                {(val as string[]).map((v) => (
                                  <span key={v} className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700">
                                    {v}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="font-bold text-slate-900">
                                {val}{feat.suffix || ''}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Comparison;
