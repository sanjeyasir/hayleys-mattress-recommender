import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  ShieldCheck, 
  Calendar,
  FileCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import type { BodyProfile, RecommendationResult } from '../types';

interface PrescriptionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bodyProfile: BodyProfile;
  recommendations: RecommendationResult[];
}

export const PrescriptionReportModal: React.FC<PrescriptionReportModalProps> = ({
  isOpen,
  onClose,
  bodyProfile,
  recommendations
}) => {
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const primaryMatch = recommendations[0];
  const runnerUps = recommendations.slice(1, 4);

  if (!isOpen || !primaryMatch) return null;

  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const rxId = `HAY-RX-${Math.abs(bodyProfile.shoulderWidthPx * 17 + Math.round(bodyProfile.spineDeviationPx * 31)) % 9000 + 1000}`;

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 16;

      // 1. Header Bar
      doc.setFillColor(15, 23, 42); // #0f172a Deep Navy
      doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

      // Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('HAYLEYS MATTRESSES', margin + 8, y + 9);

      doc.setTextColor(212, 175, 55); // Gold
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('SLEEP HAPPILY EVER AFTER  |  CLINICAL SLEEPMATCH PRESCRIPTION', margin + 8, y + 15);

      // Rx ID & Date right aligned
      doc.setTextColor(203, 213, 225);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Prescription ID: ${rxId}`, pageWidth - margin - 8, y + 9, { align: 'right' });
      doc.text(`Date: ${todayStr}`, pageWidth - margin - 8, y + 15, { align: 'right' });

      y += 30;

      // 2. Section: Diagnostic Metrics & Prescribed Target (2 Columns)
      const colWidth = (contentWidth - 6) / 2;

      // Left Box: Biometrics
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, colWidth, 42, 2, 2, 'FD');

      doc.setTextColor(51, 79, 119); // Brand blue
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('1. BIOMETRIC DIAGNOSTIC SCAN', margin + 5, y + 7);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Spine Plumb Deviation:', margin + 5, y + 15);
      doc.text('Shoulder Cant Angle:', margin + 5, y + 22);
      doc.text('Bilateral Symmetry:', margin + 5, y + 29);
      doc.text('Morphotype / SHR:', margin + 5, y + 36);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${bodyProfile.spineDeviationPx} px (${bodyProfile.spineAlignmentRating})`, margin + colWidth - 5, y + 15, { align: 'right' });
      doc.text(`${bodyProfile.shoulderTiltAngle}° (${bodyProfile.shoulderAlignmentRating})`, margin + colWidth - 5, y + 22, { align: 'right' });
      doc.text(`${bodyProfile.symmetryRating}% Balance`, margin + colWidth - 5, y + 29, { align: 'right' });
      doc.text(`${bodyProfile.bodyType} (Ratio ${bodyProfile.shoulderHipRatio})`, margin + colWidth - 5, y + 36, { align: 'right' });

      // Right Box: Target Configuration
      const rightColX = margin + colWidth + 6;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(rightColX, y, colWidth, 42, 2, 2, 'FD');

      doc.setTextColor(51, 79, 119);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('2. PRESCRIBED SURFACE TARGET', rightColX + 5, y + 7);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Target Firmness Index:', rightColX + 5, y + 15);
      doc.text('Tailored Dimension:', rightColX + 5, y + 22);
      doc.text('Motion Isolation:', rightColX + 5, y + 29);
      doc.text('Primary Need:', rightColX + 5, y + 36);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${primaryMatch.targetFirmnessComputed} / 10 Scale`, rightColX + colWidth - 5, y + 15, { align: 'right' });
      doc.text(`${primaryMatch.recommendedSize}`, rightColX + colWidth - 5, y + 22, { align: 'right' });
      doc.text(`${primaryMatch.mattress.motionIsolationRating >= 5 ? 'Zero Disturbance' : 'Standard'}`, rightColX + colWidth - 5, y + 29, { align: 'right' });
      doc.text(`${bodyProfile.primarySupportNeed.substring(0, 22)}...`, rightColX + colWidth - 5, y + 36, { align: 'right' });

      y += 48;

      // 3. Section: #1 Clinically Prescribed Model Card (Highlight)
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'F');

      doc.setTextColor(241, 221, 83); // Gold
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`★ #1 CLINICALLY PRESCRIBED MODEL (${primaryMatch.matchPercentage}% BIOMECHANICAL MATCH)`, margin + 8, y + 8);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(primaryMatch.mattress.name, margin + 8, y + 16);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      const splitRationale = doc.splitTextToSize(primaryMatch.mattress.whyMatchExplain, contentWidth - 16);
      doc.text(splitRationale, margin + 8, y + 22);

      // Spec Pills in dark card
      const pillY = y + 34;
      const specs = [
        `Series: ${primaryMatch.mattress.category}`,
        `Firmness: ${primaryMatch.mattress.firmness} / 10`,
        `Height: ${primaryMatch.mattress.thickness}`,
        `Warranty: ${primaryMatch.mattress.warranty}`
      ];

      let pillX = margin + 8;
      specs.forEach((sp) => {
        doc.setFillColor(30, 41, 59);
        doc.setDrawColor(51, 65, 85);
        doc.roundedRect(pillX, pillY, 38, 7, 1.5, 1.5, 'FD');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(sp, pillX + 19, pillY + 4.8, { align: 'center' });
        pillX += 42;
      });

      // Layer summary text
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.text(`Internal Architecture: ${primaryMatch.mattress.layers.slice(0, 3).map(l => l.replace(/^\d+\.\s*/, '')).join(' • ')}`, margin + 8, y + 49);

      y += 60;

      // 4. Section: Alternate Suitable Hayleys Portfolio Models
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('3. ALTERNATE SUITABLE HAYLEYS MODELS', margin, y + 4);

      y += 8;

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, y, contentWidth, 7, 'FD');

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('Model Name', margin + 4, y + 5);
      doc.text('Series Category', margin + 65, y + 5);
      doc.text('Firmness Index', margin + 115, y + 5);
      doc.text('Compatibility Match', margin + contentWidth - 4, y + 5, { align: 'right' });

      y += 7;

      // Table Rows
      runnerUps.forEach((r, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, y, contentWidth, 7, 'FD');

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(r.mattress.name, margin + 4, y + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(r.mattress.category, margin + 65, y + 4.8);
        doc.text(`${r.mattress.firmness} / 10`, margin + 115, y + 4.8);

        doc.setTextColor(51, 79, 119);
        doc.setFont('helvetica', 'bold');
        doc.text(`${r.matchPercentage}%`, margin + contentWidth - 4, y + 4.8, { align: 'right' });

        y += 7;
      });

      y += 12;

      // 5. Official Showroom Verification & Certifications Footer
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y, margin + contentWidth, y);

      y += 6;
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('Hayleys Mattress Showroom Verification', margin, y + 3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('Manufactured under Canadian Springwall Sleep Products License.', margin, y + 8);
      doc.text('ISO 9001:2015 Quality & ISO 14001:2015 Environmental Certified Manufacture.', margin, y + 13);
      doc.text('Hayleys Fibre PLC / Eco Solutions Division — Sri Lanka.', margin, y + 18);

      // Signature line right
      const sigX = margin + contentWidth - 55;
      doc.setDrawColor(148, 163, 184);
      doc.line(sigX, y + 12, margin + contentWidth, y + 12);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('Certified Sleep Specialist Signature', sigX + 27.5, y + 17, { align: 'center' });

      // Save PDF directly to user's device
      doc.save(`Hayleys_Sleep_Prescription_${rxId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF document:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Modal Top Header with PDF Download CTA */}
          <div className="bg-slate-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <FileCheck className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Hayleys Clinical Sleep Prescription</h3>
                <p className="text-[11px] text-slate-400 font-light">Official Showroom Consultation & Diagnostic Document</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Clean Branded Prescription Document Preview */}
          <div 
            ref={reportRef}
            className="flex-grow overflow-y-auto p-6 sm:p-10 bg-white text-slate-950 space-y-6 select-text"
          >
            {/* Branded Official Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-950 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 text-gold-400 flex items-center justify-center font-bold shadow-md shrink-0">
                  <FileCheck className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 leading-none">
                    HAYLEYS MATTRESSES
                  </h1>
                  <span className="text-[10px] font-bold text-[#194983] uppercase tracking-widest block mt-1">
                    SLEEP HAPPILY EVER AFTER • CLINICAL SLEEPMATCH PRESCRIPTION
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono text-xs text-slate-500 space-y-0.5">
                <div>Prescription ID: <strong className="text-slate-950">{rxId}</strong></div>
                <div className="flex items-center sm:justify-end gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{todayStr}</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold">✓ 100% Deterministic Posture Match</div>
              </div>
            </div>

            {/* Section 1: Biometric Diagnostics & Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                  1. Biometric Diagnostic Scan
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Spine Plumb Deviation:</span>
                    <strong className="text-slate-900">{bodyProfile.spineDeviationPx} px ({bodyProfile.spineAlignmentRating})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shoulder Cant Angle:</span>
                    <strong className="text-slate-900">{bodyProfile.shoulderTiltAngle}° ({bodyProfile.shoulderAlignmentRating})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bilateral Symmetry:</span>
                    <strong className="text-slate-900">{bodyProfile.symmetryRating}% Balance</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Morphotype / SHR:</span>
                    <strong className="text-slate-900">{bodyProfile.bodyType} (Ratio {bodyProfile.shoulderHipRatio})</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                  2. Prescribed Surface Target
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Firmness Index:</span>
                    <strong className="text-brand-700 font-bold text-sm">{primaryMatch.targetFirmnessComputed} / 10 Scale</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tailored Dimension:</span>
                    <strong className="text-slate-900">{primaryMatch.recommendedSize}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Motion Isolation:</span>
                    <strong className="text-emerald-700">{primaryMatch.mattress.motionIsolationRating >= 5 ? 'Zero Disturbance' : 'Standard'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Primary Clinical Need:</span>
                    <strong className="text-slate-900 truncate max-w-[170px]">{bodyProfile.primarySupportNeed}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: #1 Clinically Prescribed Model */}
            <div className="p-6 rounded-2xl bg-slate-950 text-white space-y-4 shadow-md relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest block">
                  ★ #1 PRESCRIBED HAYLEYS MODEL ({primaryMatch.matchPercentage}% BIOMECHANICAL COMPATIBILITY)
                </span>
                <h3 className="text-2xl font-black tracking-tight">{primaryMatch.mattress.name}</h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {primaryMatch.mattress.whyMatchExplain}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Series</span>
                  <strong className="text-white truncate block">{primaryMatch.mattress.category}</strong>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Firmness</span>
                  <strong className="text-gold-400 block">{primaryMatch.mattress.firmness} / 10</strong>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Height</span>
                  <strong className="text-white block">{primaryMatch.mattress.thickness}</strong>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Warranty</span>
                  <strong className="text-emerald-400 block">{primaryMatch.mattress.warranty}</strong>
                </div>
              </div>

              {/* Layer Architecture Snapshot */}
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Internal Layer Architecture:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300 font-light">
                  {primaryMatch.mattress.layers.slice(0, 4).map((l, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
                      <span className="w-4 h-4 rounded-full bg-brand-800 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{l.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Alternate Suitable Models Table */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                3. Alternate Evaluated Hayleys Models
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="p-2.5">Model Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Firmness</th>
                      <th className="p-2.5 text-right">Match Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runnerUps.map((r) => (
                      <tr key={r.mattress.id} className="border-b border-slate-100">
                        <td className="p-2.5 font-bold text-slate-900">{r.mattress.name}</td>
                        <td className="p-2.5 text-slate-600">{r.mattress.category}</td>
                        <td className="p-2.5 text-slate-600">{r.mattress.firmness} / 10</td>
                        <td className="p-2.5 text-right font-mono font-bold text-brand-700">{r.matchPercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Official Verification & Showroom Stamp */}
            <div className="pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs text-slate-500">
              <div className="space-y-1 max-w-sm">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-brand-700" />
                  <span>Hayleys Fibre PLC / Eco Solutions Division</span>
                </div>
                <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                  Manufactured under Canadian Springwall Sleep Products license. ISO 9001:2015 Quality & ISO 14001:2015 Environmental certified.
                </p>
              </div>

              <div className="text-center sm:text-right space-y-1 self-stretch sm:self-auto">
                <div className="w-48 border-b border-slate-400 mx-auto sm:ml-auto h-8" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Hayleys Certified Sleep Specialist Signature
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrescriptionReportModal;
