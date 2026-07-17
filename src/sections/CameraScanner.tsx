import React, { useState, useEffect } from 'react';
import { useWebcam } from '../hooks/useWebcam';
import { useOpenCv } from '../hooks/useOpenCv';
import Button from '../components/Button';
import { Camera, AlertTriangle, CheckCircle, Info, Sliders, Settings } from 'lucide-react';
import type { UserPreferences } from '../engine/recommendationEngine';

interface CameraScannerProps {
  onCaptureCompleted: (capturedCanvas: HTMLCanvasElement, preferences: UserPreferences) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCaptureCompleted }) => {
  const { isOpenCvReady, loadingError } = useOpenCv();
  const webcam = useWebcam();
  
  const [useSimulator, setUseSimulator] = useState<boolean>(true);
  const [simulatorPosture, setSimulatorPosture] = useState<'neutral' | 'tilted' | 'curved'>('neutral');
  const [isPreferencePhase, setIsPreferencePhase] = useState<boolean>(true);

  // User input preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    sleepingPosition: 'Back Sleeper',
    weightRange: '60-90kg',
    priorities: {
      cooling: false,
      motionIsolation: false,
      pressureRelief: false
    }
  });

  // Camera guides / compliance state
  const [alignmentMessage, setAlignmentMessage] = useState<string>('Align yourself within the guide');
  const [alignmentStatus, setAlignmentStatus] = useState<'error' | 'warning' | 'success'>('warning');

  const activeVideoRef = webcam.videoRef;

  // Simulator guide paths
  const postures = {
    neutral: {
      label: 'Balanced Posture (Ideal Alignment)',
      image: '/assets/sim_neutral.png',
      // SVG path representation of silhouette
      path: "M 100 50 C 100 35, 120 35, 120 50 C 120 65, 100 65, 100 50 M 110 70 L 110 190 M 80 90 L 140 90 M 90 140 L 130 140 M 95 190 L 95 270 M 125 190 L 125 270"
    },
    tilted: {
      label: 'Slight Shoulder Tilt (Spine Strain)',
      image: '/assets/sim_tilted.png',
      path: "M 98 50 C 98 35, 118 35, 118 50 C 118 65, 98 65, 98 50 M 108 70 L 115 190 M 78 86 L 138 94 M 88 138 L 128 142 M 95 190 L 102 270 M 125 190 L 122 270"
    },
    curved: {
      label: 'High Lumbar Compression Profile',
      image: '/assets/sim_curved.png',
      path: "M 100 50 C 100 35, 120 35, 120 50 C 120 65, 100 65, 100 50 M 110 70 C 125 110, 95 150, 110 190 M 80 90 L 140 90 M 90 140 L 130 140 M 95 190 L 105 270 M 125 190 L 115 270"
    }
  };

  // Generate alignment guide instructions dynamically
  useEffect(() => {
    if (isPreferencePhase) return;

    if (useSimulator) {
      setAlignmentStatus('success');
      setAlignmentMessage('✓ Posture simulator aligned correctly. System ready.');
      return;
    }

    if (!webcam.isCameraActive) {
      setAlignmentStatus('error');
      setAlignmentMessage('⚠ Accessing camera stream...');
      return;
    }

    // Simulate simple optical feedback checks over time
    const messages = [
      { msg: '⚠ Step backwards 2-3 meters to fit guide', status: 'warning' as const },
      { msg: '⚠ Align shoulder width box inside vertical bars', status: 'warning' as const },
      { msg: '✓ Alignment matched. Please hold still...', status: 'success' as const }
    ];

    let step = 0;
    setAlignmentMessage(messages[0].msg);
    setAlignmentStatus(messages[0].status);

    const timer = setInterval(() => {
      step++;
      if (step < messages.length) {
        setAlignmentMessage(messages[step].msg);
        setAlignmentStatus(messages[step].status);
      } else {
        clearInterval(timer);
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [useSimulator, webcam.isCameraActive, simulatorPosture, isPreferencePhase]);

  // Handle switching from simulator to live camera
  const handleToggleSource = async (toLive: boolean) => {
    if (toLive) {
      setUseSimulator(false);
      await webcam.startWebcam();
    } else {
      webcam.stopWebcam();
      setUseSimulator(true);
    }
  };

  // Switch camera source on selection changes
  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const devId = e.target.value;
    webcam.setSelectedDeviceId(devId);
    webcam.startWebcam(devId);
  };

  // Process Capture action
  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (useSimulator) {
      // Draw simulated body profiles onto canvas
      ctx.fillStyle = '#1e293b'; // dark blue-slate background
      ctx.fillRect(0, 0, 640, 480);

      // Draw standard blueprint style grids
      ctx.strokeStyle = 'rgba(79,124,177,0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 480); ctx.stroke();
      }
      for (let y = 0; y < 480; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke();
      }

      // Draw abstract human outline shape based on posture selection
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#60a5fa';

      // Draw silhouette vectors
      if (simulatorPosture === 'neutral') {
        // Spine lines
        ctx.strokeStyle = '#93c5fd';
        ctx.beginPath();
        // Head
        ctx.arc(320, 110, 35, 0, Math.PI * 2);
        // Spine
        ctx.moveTo(320, 145); ctx.lineTo(320, 290);
        // Shoulders
        ctx.moveTo(250, 160); ctx.lineTo(390, 160);
        // Hips
        ctx.moveTo(270, 290); ctx.lineTo(370, 290);
        // Legs
        ctx.moveTo(285, 290); ctx.lineTo(285, 420);
        ctx.moveTo(355, 290); ctx.lineTo(355, 420);
        ctx.stroke();
      } else if (simulatorPosture === 'tilted') {
        // Tilted shoulders, offset spine
        ctx.strokeStyle = '#f87171'; // red warning hue
        ctx.beginPath();
        ctx.arc(310, 110, 35, 0, Math.PI * 2);
        // Spine slightly curved
        ctx.moveTo(310, 145);
        ctx.bezierCurveTo(320, 200, 340, 250, 325, 290);
        // Shoulder tilted (left low, right high)
        ctx.moveTo(240, 175); ctx.lineTo(380, 145);
        // Hips
        ctx.moveTo(275, 290); ctx.lineTo(375, 285);
        // Legs
        ctx.moveTo(290, 290); ctx.lineTo(280, 420);
        ctx.moveTo(360, 285); ctx.lineTo(350, 420);
        ctx.stroke();
      } else {
        // Curve layout
        ctx.strokeStyle = '#fb923c'; // orange warning hue
        ctx.beginPath();
        ctx.arc(320, 110, 35, 0, Math.PI * 2);
        // Major spine deviation curve
        ctx.moveTo(320, 145);
        ctx.bezierCurveTo(365, 210, 275, 260, 320, 290);
        // Shoulder
        ctx.moveTo(250, 160); ctx.lineTo(390, 160);
        // Hips wide
        ctx.moveTo(260, 290); ctx.lineTo(380, 290);
        // Legs
        ctx.moveTo(280, 290); ctx.lineTo(280, 420);
        ctx.moveTo(360, 290); ctx.lineTo(360, 420);
        ctx.stroke();
      }

      ctx.shadowBlur = 0; // reset
      onCaptureCompleted(canvas, preferences);
    } else {
      // Capture from raw webcam stream
      const success = webcam.captureFrame(canvas);
      if (success) {
        webcam.stopWebcam();
        onCaptureCompleted(canvas, preferences);
      }
    }
  };

  return (
    <section id="scanner" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest block">POSTURE ASSESSMENT</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Perform Your Custom Body Scan
          </h2>
          <p className="text-slate-600 font-light leading-relaxed">
            Specify your preferences, stand in alignment with the calibration system, and capture your geometry for pressure matching.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Preferences Settings Column */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 border border-slate-100 rounded-3xl p-8 premium-shadow">
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <Sliders className="w-5 h-5 text-brand-700" />
                <h3 className="text-lg font-bold text-slate-900">Sleep Profile & Preferences</h3>
              </div>

              {/* Sleeping Position selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  1. Typical Sleeping Position
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Back Sleeper', 'Side Sleeper', 'Stomach Sleeper', 'Combination Sleeper'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPreferences({ ...preferences, sleepingPosition: pos })}
                      className={`px-4 py-3 text-xs font-medium rounded-2xl border transition-all text-left ${
                        preferences.sleepingPosition === pos
                          ? 'border-brand-600 bg-brand-950 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Range selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  2. Weight Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Under 60kg', '60-90kg', 'Over 90kg'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setPreferences({ ...preferences, weightRange: range })}
                      className={`px-3 py-3 text-xs font-medium rounded-2xl border transition-all text-center ${
                        preferences.weightRange === range
                          ? 'border-brand-600 bg-brand-950 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Health/Comfort Priorities */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  3. Key Sleep Priorities
                </label>
                <div className="space-y-3">
                  {[
                    { key: 'cooling', label: 'Maximum Cooling Ventilation', desc: 'Natural airflow channels' },
                    { key: 'pressureRelief', label: 'Joint Pressure Relief', desc: 'Contouring responsive layers' },
                    { key: 'motionIsolation', label: 'Zero Motion Disturbance', desc: 'Independently wrapped springs' }
                  ].map((prio) => (
                    <label
                      key={prio.key}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        preferences.priorities[prio.key as keyof UserPreferences['priorities']]
                          ? 'border-brand-300 bg-brand-50/50'
                          : 'border-slate-200 bg-white hover:bg-slate-100/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.priorities[prio.key as keyof UserPreferences['priorities']]}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          priorities: {
                            ...preferences.priorities,
                            [prio.key]: e.target.checked
                          }
                        })}
                        className="mt-1 accent-brand-800"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{prio.label}</span>
                        <span className="text-[10px] text-slate-400 font-light">{prio.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <Button
                variant="primary"
                fullWidth
                disabled={!isPreferencePhase}
                onClick={() => setIsPreferencePhase(false)}
                className={isPreferencePhase ? 'bg-brand-950 text-white' : 'bg-slate-300 text-slate-600'}
              >
                {isPreferencePhase ? 'Proceed to Camera Calibration' : 'Preferences Locked'}
              </Button>
            </div>
          </div>

          {/* Camera Scanning Core Column */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl min-h-[500px]">
            {/* Background scanner graphics */}
            <div className="absolute top-0 left-0 w-full h-full grid-overlay opacity-[0.04] pointer-events-none" />

            {/* Header info bar */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                  {useSimulator ? 'Digital Posture Simulator' : 'Showroom Live Optical Scanner'}
                </span>
              </div>

              {/* Mode Toggles */}
              <div className="flex gap-2 bg-slate-900 p-1 rounded-full border border-slate-800">
                <button
                  onClick={() => handleToggleSource(false)}
                  className={`px-3 py-1 text-[10px] font-semibold tracking-wider rounded-full transition-all ${
                    useSimulator ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Simulator
                </button>
                <button
                  onClick={() => handleToggleSource(true)}
                  className={`px-3 py-1 text-[10px] font-semibold tracking-wider rounded-full transition-all ${
                    !useSimulator ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Webcam
                </button>
              </div>
            </div>

            {/* Canvas/Video Viewfinder screen */}
            <div className="relative flex-grow my-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden min-h-[350px]">
              
              {isPreferencePhase ? (
                /* Prompt user to configure settings first */
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-brand-950/80 border border-brand-800 flex items-center justify-center text-brand-400">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold">Lock In Your Sleep Settings</h4>
                  <p className="text-xs text-slate-400 max-w-xs font-light">
                    Complete your preferred sleeping posture and weight factors on the left to activate the body layout scanner.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsPreferencePhase(false)}>
                    Skip to Calibration
                  </Button>
                </div>
              ) : null}

              {/* OpenCV.js Loading Skeleton */}
              {!isOpenCvReady ? (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-4 z-30">
                  <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                  <div>
                    <p className="text-sm font-semibold">Compiling Digital Sleep Clinic...</p>
                    <p className="text-xs text-slate-500 font-light mt-1 max-w-[240px]">
                      Loading optical contour calibration engine (OpenCV.js WebAssembly).
                    </p>
                  </div>
                  {loadingError && (
                    <div className="flex gap-2 items-center bg-rose-950/50 border border-rose-800 p-2.5 rounded-lg text-rose-300 text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{loadingError}</span>
                    </div>
                  )}
                </div>
              ) : null}

              {useSimulator ? (
                /* Mode A: Vector Silhouette Simulator */
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
                  {/* Grid Lines for alignment */}
                  <div className="absolute inset-x-0 top-[20%] border-t border-brand-500/10 pointer-events-none" />
                  <div className="absolute inset-x-0 top-[55%] border-t border-brand-500/10 pointer-events-none" />
                  <div className="absolute inset-y-0 left-[35%] border-l border-brand-500/10 pointer-events-none" />
                  <div className="absolute inset-y-0 left-[65%] border-l border-brand-500/10 pointer-events-none" />

                  {/* Standing Silhouette Overlay */}
                  <svg className="w-full h-full max-w-[320px] max-h-[380px] text-brand-500/20" viewBox="0 0 220 320">
                    {/* Outer guidelines */}
                    <rect x="35" y="20" width="150" height="280" rx="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    
                    {/* Spine alignment vector */}
                    <path
                      d={postures[simulatorPosture].path}
                      fill="none"
                      stroke="#38a9fa"
                      strokeWidth="2"
                      className="opacity-70 animate-pulse-slow"
                    />
                  </svg>
                  
                  {/* Indicator Box showing alignment coordinates */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">CALIBRATION OFFSET: 0.0px</span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> SECURE ALIGNMENT
                    </span>
                  </div>
                </div>
              ) : (
                /* Mode B: Live Camera View */
                <div className="absolute inset-0 flex items-center justify-center">
                  {webcam.permissionError ? (
                    <div className="p-8 text-center space-y-4 max-w-sm">
                      <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
                      <h4 className="text-sm font-bold">Camera Blocked</h4>
                      <p className="text-xs text-slate-400 font-light">{webcam.permissionError}</p>
                      <Button variant="outline" size="sm" onClick={() => webcam.startWebcam()}>
                        Retry Access
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Video Stream Element */}
                      <video
                        ref={activeVideoRef}
                        className="w-full h-full object-cover transform -scale-x-100"
                        playsInline
                        muted
                      />

                      {/* Stand guide overlay on top of video */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg className="w-full h-full max-w-[280px] max-h-[350px] text-emerald-500/30" viewBox="0 0 220 300">
                          {/* Guide shape */}
                          <path
                            d="M110,40 C125,40 135,50 135,65 C135,80 125,90 110,90 C95,90 85,80 85,65 C85,50 95,40 110,40 Z M60,110 L160,110 C175,110 180,120 180,135 C180,150 170,220 170,260 C170,280 160,290 145,290 C135,290 130,280 130,260 L130,200 L90,200 L90,260 C90,280 85,290 75,290 C60,290 50,280 50,260 C50,220 40,150 40,135 C40,120 45,110 60,110 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                        </svg>

                        {/* Top horizontal head guide line */}
                        <div className="absolute top-[20%] inset-x-0 border-t border-brand-500/30 w-full" />
                        {/* Hip guideline */}
                        <div className="absolute top-[60%] inset-x-0 border-t border-brand-500/30 w-full" />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Scanning visual sweep bar when camera or simulator is ready */}
              {!isPreferencePhase && isOpenCvReady && (
                <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-lg shadow-brand-500/50 animate-scan pointer-events-none" />
              )}
            </div>

            {/* Bottom Controls Panel */}
            <div className="z-10 space-y-4">
              
              {/* Alignment Banner feedback */}
              {!isPreferencePhase && (
                <div className={`p-3.5 rounded-2xl flex items-center justify-between border text-xs transition-all ${
                  alignmentStatus === 'success'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : alignmentStatus === 'warning'
                      ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                      : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span className="font-light tracking-wide">{alignmentMessage}</span>
                  </div>
                  {useSimulator && (
                    <div className="flex gap-2">
                      {(['neutral', 'tilted', 'curved'] as const).map((post) => (
                        <button
                          key={post}
                          onClick={() => setSimulatorPosture(post)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize border ${
                            simulatorPosture === post
                              ? 'bg-brand-500 text-white border-brand-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {post}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Device selectors & Capture Button triggers */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Device Selector drop if live mode */}
                {!useSimulator && webcam.devices.length > 1 ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={webcam.selectedDeviceId}
                      onChange={handleCameraChange}
                      className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer max-w-[150px]"
                    >
                      {webcam.devices.map((dev) => (
                        <option key={dev.deviceId} value={dev.deviceId} className="bg-slate-900 text-white text-xs">
                          {dev.label || `Camera ${dev.deviceId.slice(0, 4)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 font-light italic">
                    {useSimulator ? 'Running on virtual local dataset' : 'Active system capture input'}
                  </div>
                )}

                {/* Capture Execution CTA */}
                <Button
                  variant="gold"
                  disabled={isPreferencePhase || (!useSimulator && !webcam.isCameraActive) || !isOpenCvReady}
                  onClick={handleCapture}
                  className="w-full sm:w-auto bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-950 font-bold px-8 py-3 rounded-full flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Capture Profile & Scan
                </Button>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CameraScanner;
