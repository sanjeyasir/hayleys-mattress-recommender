import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Mattress } from '../types';
import Button from '../components/Button';
import { Layers, X } from 'lucide-react';

interface ComparisonProps {
  compareList: Mattress[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const Comparison: React.FC<ComparisonProps> = ({
  compareList,
  onRemove,
  onClear
}) => {
  const compareFeatures = [
    { label: 'Firmness Rating', key: 'firmness', suffix: '/10' },
    { label: 'Support level', key: 'supportLevel' },
    { label: 'Cooling index', key: 'coolingRating', suffix: '/5' },
    { label: 'Pressure Relief', key: 'pressureReliefRating', suffix: '/5' },
    { label: 'Motion Isolation', key: 'motionIsolationRating', suffix: '/5' },
    { label: 'Ideal sleeping positions', key: 'idealPositions', isArray: true },
    { label: 'Body Type suitability', key: 'bodyTypeSuitability', isArray: true },
    { label: 'Key technologies', key: 'keyTechnologies', isArray: true },
    { label: 'Material Composition', key: 'materials', isArray: true }
  ];

  return (
    <section id="comparison" className="bg-white py-24 border-b border-slate-200 scroll-mt-6">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest block">FEATURE DECK</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Compare Mattress Specifications
            </h2>
            <p className="text-slate-600 font-light max-w-xl leading-relaxed">
              Compare materials, dynamic ratings, and physical properties side-by-side to select the ideal model.
            </p>
          </div>

          {compareList.length > 0 && (
            <Button variant="outline" onClick={onClear} className="self-start md:self-auto">
              Clear Comparison List
            </Button>
          )}
        </div>

        {/* Comparison grid / empty states */}
        <AnimatePresence mode="wait">
          {compareList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="border border-dashed border-slate-200 rounded-3xl p-16 text-center max-w-2xl mx-auto space-y-6 bg-slate-50/50"
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-slate-800">Your comparison list is empty</h4>
                <p className="text-xs text-slate-500 font-light max-w-md mx-auto">
                  Click the "Compare" buttons on your recommended mattresses above to analyze structural specs side-by-side.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="overflow-x-auto rounded-3xl border border-slate-200"
            >
              <table className="w-full text-left border-collapse bg-white min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">
                      Specification Features
                    </th>
                    {compareList.map((mattress) => (
                      <th key={mattress.id} className="p-6 text-center relative w-1/4 min-w-[200px] border-l border-slate-200">
                        <button
                          onClick={() => onRemove(mattress.id)}
                          className="absolute top-4 right-4 p-1 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">{mattress.name}</h4>
                        <span className="text-[10px] text-slate-400 font-light uppercase tracking-wider block mt-1">
                          {mattress.supportLevel}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFeatures.map((feat) => (
                    <tr key={feat.label} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all">
                      <td className="p-6 text-xs font-bold text-slate-800 bg-slate-50/20">
                        {feat.label}
                      </td>
                      {compareList.map((mattress) => {
                        const val = (mattress as any)[feat.key];
                        return (
                          <td key={mattress.id + feat.key} className="p-6 text-center text-xs text-slate-600 font-light border-l border-slate-100">
                            {feat.isArray ? (
                              <div className="flex flex-wrap justify-center gap-1">
                                {(val as string[]).map((v) => (
                                  <span key={v} className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200/50 text-[10px] text-slate-600">
                                    {v}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="font-medium text-slate-800">
                                {val}{feat.suffix}
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
