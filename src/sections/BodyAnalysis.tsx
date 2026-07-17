import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeStandingPosture } from '../cv/postureAnalysis';
import { calculateRecommendations } from '../engine/recommendationEngine';
import type { UserPreferences } from '../engine/recommendationEngine';
import type { BodyProfile, RecommendationResult } from '../types';
import { Sparkles, Eye, ShieldAlert, Cpu } from 'lucide-react';

interface BodyAnalysisProps {
  capturedCanvas: HTMLCanvasElement;
  preferences: UserPreferences;
  onAnalysisCompleted: (
    profile: BodyProfile,
    recommendations: RecommendationResult[],
    debugCanvasUrl: string
  ) => void;
}

export const BodyAnalysis: React.FC<BodyAnalysisProps> = ({
  capturedCanvas,
  preferences,
  onAnalysisCompleted
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const steps = [
    { label: "Decoding optical coordinate frame...", icon: <Cpu className="w-5 h-5" /> },
    { label: "Isolating skeletal boundaries & contours...", icon: <Eye className="w-5 h-5" /> },
    { label: "Measuring shoulder tilt & hip geometry...", icon: <Sparkles className="w-5 h-5" /> },
    { label: "Mapping 5-point support load zones...", icon: <ShieldAlert className="w-5 h-5" /> }
  ];

  // 1. Progress bar simulation
  useEffect(() => {
    const totalDuration = 4000; // 4 seconds total
    const intervalTime = 40;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // 2. Step index updates matching progress
  useEffect(() => {
    const stepIndex = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);
    setCurrentStep(stepIndex);
  }, [progress, steps.length]);

  // 3. Perform OpenCV analysis & output results when progress finishes
  useEffect(() => {
    if (progress < 100) return;

    // Small delay to make transition look smooth
    const delayTimer = setTimeout(() => {
      try {
        const debugCanvas = processedCanvasRef.current;
        if (!debugCanvas) return;

        // Run actual OpenCV logic on captured canvas
        const bodyProfile = analyzeStandingPosture(capturedCanvas, debugCanvas);
        
        // Run rule-based scoring engine
        const recommendations = calculateRecommendations(bodyProfile, preferences);

        // Convert debug canvas to dataURL for persistent layout representation
        const debugCanvasUrl = debugCanvas.toDataURL('image/jpeg');

        onAnalysisCompleted(bodyProfile, recommendations, debugCanvasUrl);
      } catch (err) {
        console.error("Error in posture analysis execution:", err);
      }
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [progress, capturedCanvas, preferences, onAnalysisCompleted]);

  return (
    <section className="min-h-[70vh] py-24 bg-slate-950 text-white flex items-center relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand-500/10 blur-[80px]" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-gold-500/5 blur-[80px]" />

      <div className="max-w-xl mx-auto px-6 w-full text-center space-y-10 z-10">
        
        {/* Glowing Circle with Core loading state */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full border border-slate-800" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-brand-500 border-t-transparent"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute inset-6 rounded-full border border-gold-500/30 border-b-transparent"
          />
          
          <div className="text-xl font-bold tracking-wider font-mono text-brand-300">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Dynamic State Text messages */}
        <div className="space-y-3 min-h-[80px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-3 text-sm text-slate-300"
            >
              <div className="text-brand-400">
                {steps[currentStep]?.icon}
              </div>
              <span className="font-medium tracking-wide">
                {steps[currentStep]?.label}
              </span>
            </motion.div>
          </AnimatePresence>

          <p className="text-xs text-slate-500 font-light max-w-xs mx-auto">
            Computing joint matrices. All math calculations are executing client-side.
          </p>
        </div>

        {/* Modern thin progress bar */}
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-gold-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Hidden debug canvas to run the OpenCV measurements */}
        <canvas ref={processedCanvasRef} className="hidden" />

      </div>
    </section>
  );
};

export default BodyAnalysis;
