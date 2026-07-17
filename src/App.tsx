import { useState } from 'react';
import Header from './components/Header';
import Hero from './sections/Hero';
import HowItWorks from './sections/HowItWorks';
import CameraScanner from './sections/CameraScanner';
import BodyAnalysis from './sections/BodyAnalysis';
import Recommendations from './sections/Recommendations';
import Comparison from './sections/Comparison';
import TechInfo from './sections/TechInfo';
import Footer from './sections/Footer';

import type { BodyProfile, RecommendationResult, Mattress } from './types';
import type { UserPreferences } from './engine/recommendationEngine';

type FlowState = 'idle' | 'analyzing' | 'results';

function App() {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  
  // Canvas and calculation outputs
  const [capturedCanvas, setCapturedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [debugCanvasUrl, setDebugCanvasUrl] = useState<string>('');
  const [bodyProfile, setBodyProfile] = useState<BodyProfile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  
  // Comparison deck
  const [compareList, setCompareList] = useState<Mattress[]>([]);

  // Smooth scroll handler to target elements
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartAssessment = () => {
    setFlowState('idle');
    scrollToSection('scanner');
  };

  // Called when camera captures frame successfully
  const handleCaptureCompleted = (canvas: HTMLCanvasElement, prefs: UserPreferences) => {
    setCapturedCanvas(canvas);
    setPreferences(prefs);
    setFlowState('analyzing');
    scrollToSection('scanner'); // Keep user positioned at scanning block
  };

  // Called when OpenCV analysis loader finishes
  const handleAnalysisCompleted = (
    profile: BodyProfile,
    recs: RecommendationResult[],
    debugUrl: string
  ) => {
    setBodyProfile(profile);
    setRecommendations(recs);
    setDebugCanvasUrl(debugUrl);
    setFlowState('results');

    // Auto-scroll to results after short frame render
    setTimeout(() => {
      scrollToSection('results');
    }, 100);
  };

  const handleReset = () => {
    setFlowState('idle');
    setCapturedCanvas(null);
    setDebugCanvasUrl('');
    setBodyProfile(null);
    setRecommendations([]);
    setTimeout(() => {
      scrollToSection('scanner');
    }, 50);
  };

  const handleAddToCompare = (mattress: Mattress) => {
    setCompareList((prev) => {
      const exists = prev.some((m) => m.id === mattress.id);
      if (exists) {
        // Remove
        return prev.filter((m) => m.id !== mattress.id);
      } else {
        // Add (Limit comparison to 3 models max)
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 mattresses at a time.');
          return prev;
        }
        
        // Auto scroll to comparison table after adding
        setTimeout(() => {
          scrollToSection('comparison');
        }, 100);

        return [...prev, mattress];
      }
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-50/20">
      {/* Premium Header */}
      <Header onStartAssessment={handleStartAssessment} />

      {/* Main Single Page Content */}
      <main className="flex-grow pt-20">
        {/* 1. Hero Section */}
        <Hero onStartAssessment={handleStartAssessment} />

        {/* 2. How It Works Section */}
        <HowItWorks />

        {/* 3. Interactive Arena (Scanner / Loading / Results) */}
        <div id="scanner" className="scroll-mt-20">
          {flowState === 'idle' && (
            <CameraScanner onCaptureCompleted={handleCaptureCompleted} />
          )}

          {flowState === 'analyzing' && capturedCanvas && preferences && (
            <BodyAnalysis
              capturedCanvas={capturedCanvas}
              preferences={preferences}
              onAnalysisCompleted={handleAnalysisCompleted}
            />
          )}

          {flowState === 'results' && bodyProfile && (
            <Recommendations
              bodyProfile={bodyProfile}
              recommendations={recommendations}
              debugCanvasUrl={debugCanvasUrl}
              onReset={handleReset}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
            />
          )}
        </div>

        {/* 4. Comparison Section */}
        <Comparison
          compareList={compareList}
          onRemove={handleRemoveFromCompare}
          onClear={handleClearCompare}
        />

        {/* 5. Sleep Science & Tech Info */}
        <TechInfo />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
