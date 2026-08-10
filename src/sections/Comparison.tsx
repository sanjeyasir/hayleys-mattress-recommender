import React, { useState } from 'react';
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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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
    <section id="comparison" className="bg-white py-16 sm:py-24 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
                HAYLEYS MATTRESS SPECIFICATION MATRIX
              </span>
              {compareList.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-mono font-bold">
                  {compareList.length} of 3 Models Selected
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Compare Hayleys Mattress Models
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl leading-relaxed">
              Compare physical layers, orthopedic densities, thickness dimensions, and warranty coverage side-by-side.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {compareList.length > 0 && (
              <div className="flex sm:hidden bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    viewMode === 'table' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500'
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    viewMode === 'cards' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500'
                  }`}
                >
                  Cards View
                </button>
              </div>
            )}

            {onOpenCatalogue && (
              <Button variant="outline" size="sm" onClick={onOpenCatalogue} className="text-xs">
                Browse Full Catalogue
              </Button>
            )}
            {compareList.length > 0 && (
              <Button variant="outline" size="sm" onClick={onClear} className="text-xs">
                Clear List
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
              className="border border-dashed border-slate-300 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-5 bg-slate-50/50"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto text-brand-700">
                <Layers className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-bold text-slate-900">Your comparison list is empty</h4>
                <p className="text-xs text-slate-500 font-light max-w-md mx-auto leading-relaxed">
                  Click the <strong>"+ Compare"</strong> button on your recommended mattresses above to analyze structural layers, warranties, and densities side-by-side.
                </p>
              </div>
            </motion.div>
          ) : viewMode === 'cards' ? (
            /* Mobile Card-by-Card View */
            <div className="grid grid-cols-1 gap-6 sm:hidden">
              {compareList.map((mattress) => (
                <div key={mattress.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 relative">
                  <button
                    onClick={() => onRemove(mattress.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 text-[10px] font-bold border border-brand-200 uppercase">
                      {mattress.category} Series
                    </span>
                    <h4 className="text-lg font-black text-slate-950 mt-1">{mattress.name}</h4>
                    <span className="text-xs text-gold-600 font-bold block">{mattress.thickness} • {mattress.warranty}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    {compareFeatures.map((feat) => {
                      const val = (mattress as any)[feat.key];
                      return (
                        <div key={feat.key} className="flex justify-between items-start py-1 border-b border-slate-50">
                          <span className="text-slate-400 text-[11px] font-medium">{feat.label}:</span>
                          <span className="text-right font-bold text-slate-800 max-w-[60%]">
                            {feat.isArray ? (
                              <div className="flex flex-wrap justify-end gap-1">
                                {(val as string[]).map((v) => (
                                  <span key={v} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                                    {v}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              `${val}${feat.suffix || ''}`
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Responsive Table View */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm"
            >
              <div className="min-w-[640px]">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-950 text-white border-b border-slate-800">
                      <th className="p-4 sm:p-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4">
                        Specification Features
                      </th>
                      {compareList.map((mattress) => (
                        <th key={mattress.id} className="p-4 sm:p-6 text-center relative w-1/4 min-w-[200px] border-l border-slate-800">
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
                          <h4 className="text-sm sm:text-base font-extrabold text-white mt-1.5">{mattress.name}</h4>
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
                        <td className="p-3.5 sm:p-5 text-xs font-bold text-slate-800 bg-slate-50/40">
                          {feat.label}
                        </td>
                        {compareList.map((mattress) => {
                          const val = (mattress as any)[feat.key];
                          return (
                            <td key={mattress.id + feat.key} className="p-3.5 sm:p-5 text-center text-xs text-slate-600 font-light border-l border-slate-100">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Comparison;
