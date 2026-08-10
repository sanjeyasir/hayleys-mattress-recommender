import React, { useState, useEffect, useRef } from 'react';
import { useWebcam } from '../hooks/useWebcam';
import { useMediaPipe } from '../hooks/useMediaPipe';
import Button from '../components/Button';
import { 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Sliders, 
  Settings, 
  RefreshCw, 
  Users, 
  User, 
  HeartHandshake, 
  Ruler, 
  Weight, 
  ArrowRight,
  Edit3
} from 'lucide-react';
import type { UserPreferences } from '../types';
import { CANONICAL_SKELETON_CONNECTIONS } from '../cv/mediaPipeAnalysis';

interface CameraScannerProps {
  onCaptureCompleted: (
    capturedCanvas: HTMLCanvasElement,
    preferences: UserPreferences,
    isSimulator: boolean,
    postureMode?: 'neutral' | 'tilted' | 'curved',
    landmarks?: any[]
  ) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCaptureCompleted }) => {
  const { poseLandmarker, isMediaPipeReady, loadingError } = useMediaPipe();
  const webcam = useWebcam();
  
  const [useSimulator, setUseSimulator] = useState<boolean>(true);
  const [isFlipped, setIsFlipped] = useState<boolean>(true);
  const [simulatorPosture, setSimulatorPosture] = useState<'neutral' | 'tilted' | 'curved'>('neutral');
  const [activeStep, setActiveStep] = useState<'preferences' | 'camera'>('preferences');

  // User input preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    sleepingPosition: 'Back Sleeper',
    heightRange: 'Average (160-175cm / 5\'3"-5\'9")',
    weightRange: 'Standard (55-75kg)',
    sleeperStatus: 'Married / Couple (Sharing Bed)',
    priorities: {
      cooling: false,
      motionIsolation: true,
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
      label: 'Natural Balanced Stance (Subtle Dominant Shoulder ~1.2°)',
      image: '/assets/sim_neutral.png',
      path: "M 100 50 C 100 35, 120 35, 120 50 C 120 65, 100 65, 100 50 M 110 70 L 110 190 M 80 90 L 140 90 M 90 140 L 130 140 M 95 190 L 95 270 M 125 190 L 125 270"
    },
    tilted: {
      label: 'Functional Shoulder Asymmetry (Dominant Drop ~4.2°)',
      image: '/assets/sim_tilted.png',
      path: "M 98 50 C 98 35, 118 35, 118 50 C 118 65, 98 65, 98 50 M 108 70 L 115 190 M 78 86 L 138 94 M 88 138 L 128 142 M 95 190 L 102 270 M 125 190 L 122 270"
    },
    curved: {
      label: 'Lateral Spine Deviation Profile (Coronal Shift ~22px)',
      image: '/assets/sim_curved.png',
      path: "M 100 50 C 100 35, 120 35, 120 50 C 120 65, 100 65, 100 50 M 110 70 C 125 110, 95 150, 110 190 M 80 90 L 140 90 M 90 140 L 130 140 M 95 190 L 105 270 M 125 190 L 115 270"
    }
  };

  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const latestLandmarksRef = useRef<any[] | null>(null);
  const smoothedLandmarksRef = useRef<any[] | null>(null);
  const lastTimestampRef = useRef<number>(0);

  // Generate alignment guide instructions dynamically
  useEffect(() => {
    if (activeStep === 'preferences') return;

    if (useSimulator) {
      setAlignmentStatus('success');
      setAlignmentMessage('✓ Digital simulator aligned. Measuring natural bilateral variations & spine curve...');
      return;
    }

    if (!webcam.isCameraActive) {
      setAlignmentStatus('error');
      setAlignmentMessage('⚠ Accessing camera stream...');
      return;
    }
  }, [useSimulator, webcam.isCameraActive, activeStep]);

  // Real-time MediaPipe Pose landmark tracking, alignment scoring, and skeleton overlay
  const [alignmentScore, setAlignmentScore] = useState<number>(0);
  const [isReadyToCapture, setIsReadyToCapture] = useState<boolean>(false);
  const stabilityCounterRef = useRef<number>(0);

  useEffect(() => {
    if (useSimulator || !webcam.isCameraActive) {
      if (overlayCanvasRef.current) {
        const ctx = overlayCanvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      }
      latestLandmarksRef.current = null;
      smoothedLandmarksRef.current = null;
      setAlignmentScore(useSimulator ? 100 : 0);
      setIsReadyToCapture(useSimulator);
      return;
    }

    const video = activeVideoRef.current;
    const canvas = overlayCanvasRef.current;
    if (!video || !canvas) return;

    let active = true;
    let animationFrameId: number;

    const detectPose = () => {
      if (!active) return;

      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          try {
            let rawLandmarks: any[] | null = null;

            if (poseLandmarker && isMediaPipeReady) {
              const now = performance.now();
              const timestamp = Math.max(now, lastTimestampRef.current + 16.6);
              lastTimestampRef.current = timestamp;

              const results = poseLandmarker.detectForVideo(video, timestamp);
              if (results && results.landmarks && results.landmarks.length > 0) {
                rawLandmarks = results.landmarks[0];
              }
            }

            // ONLY process and draw when an actual human pose is detected (NO fake default skeleton)
            if (rawLandmarks && rawLandmarks.length > 0) {
              // --- ADAPTIVE EMA TEMPORAL SMOOTHING ---
              const prevSmoothed = smoothedLandmarksRef.current;
              const smoothed: any[] = [];

              for (let i = 0; i < rawLandmarks.length; i++) {
                const curr = rawLandmarks[i];
                const prev = prevSmoothed?.[i];

                if (!prev || !curr) {
                  smoothed[i] = curr ? { ...curr } : null;
                } else {
                  const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);
                  const alpha = Math.min(0.70, Math.max(0.25, dist * 8));

                  smoothed[i] = {
                    x: prev.x + alpha * (curr.x - prev.x),
                    y: prev.y + alpha * (curr.y - prev.y),
                    z: (prev.z ?? 0) + alpha * ((curr.z ?? 0) - (prev.z ?? 0)),
                    visibility: (prev.visibility ?? 0.8) * 0.7 + (curr.visibility ?? 0.8) * 0.3
                  };
                }
              }

              smoothedLandmarksRef.current = smoothed;
              latestLandmarksRef.current = smoothed;

              const shL = smoothed[11];
              const shR = smoothed[12];
              const hipL = smoothed[23];
              const hipR = smoothed[24];
              const nose = smoothed[0];

              const threshold = 0.35;
              const shouldersVisible = (shL?.visibility ?? 0) > threshold && (shR?.visibility ?? 0) > threshold;
              const hipsVisible = (hipL?.visibility ?? 0) > threshold && (hipR?.visibility ?? 0) > threshold;
              const headVisible = (nose?.visibility ?? 0) > threshold;

              // --- COMPUTE ALIGNMENT QUALITY SCORE ---
              let score = 0;
              let statusMsg = '';
              let statusType: 'error' | 'warning' | 'success' = 'warning';

              if (!shouldersVisible) {
                statusMsg = '⚠ Step into the frame facing the camera';
                statusType = 'warning';
                score = 20;
              } else {
                score += 35; // Shoulders visible
                if (hipsVisible) score += 25; // Hips visible
                if (headVisible) score += 15; // Head visible

                const shoulderSpan = Math.abs(shR.x - shL.x);
                const shMidX = (shL.x + shR.x) / 2;

                // Centering (ideal: 0.5)
                const centerDeviation = Math.abs(shMidX - 0.5);
                if (centerDeviation < 0.12) {
                  score += 15;
                } else if (centerDeviation < 0.20) {
                  score += 8;
                }

                // Distance span check
                if (shoulderSpan > 0.56) {
                  statusMsg = '⚠ Step backward slightly for full torso alignment';
                  statusType = 'warning';
                  score = Math.min(score, 60);
                } else if (shoulderSpan < 0.15) {
                  statusMsg = '⚠ Step forward into the calibration guide';
                  statusType = 'warning';
                  score = Math.min(score, 60);
                } else if (centerDeviation >= 0.15) {
                  statusMsg = '⚠ Center yourself in front of the lens';
                  statusType = 'warning';
                  score = Math.min(score, 70);
                } else {
                  score += 10; // Good distance & center
                  if (score >= 80) {
                    statusType = 'success';
                    statusMsg = '✓ Perfect stance! Hold steady to take your photo';
                  } else {
                    statusMsg = '✓ Silhouette detected! Adjust posture to complete alignment';
                  }
                }
              }

              // Stability verification
              if (score >= 80) {
                stabilityCounterRef.current = Math.min(30, stabilityCounterRef.current + 1);
              } else {
                stabilityCounterRef.current = Math.max(0, stabilityCounterRef.current - 2);
              }

              const ready = score >= 80 && stabilityCounterRef.current >= 6;
              setAlignmentScore(score);
              setIsReadyToCapture(ready);
              setAlignmentStatus(statusType);
              setAlignmentMessage(ready ? '✓ Optimal Alignment Detected! You are ready to take the photo' : statusMsg);

              // --- DRAW AUTHENTIC SKELETON ON LIVE WEBCAM ---
              const w = canvas.width;
              const h = canvas.height;

              const getPt = (idx: number) => {
                const pt = smoothed[idx];
                if (!pt || (pt.visibility ?? 0) < threshold) return null;
                return { 
                  x: Math.max(10, Math.min(w - 10, pt.x * w)), 
                  y: Math.max(10, Math.min(h - 10, pt.y * h)) 
                };
              };

              // 1. Draw glowing canonical bone connections
              ctx.lineWidth = ready ? 4 : 3;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.shadowBlur = ready ? 12 : 6;
              ctx.shadowColor = ready ? '#10b981' : '#0284c7';

              CANONICAL_SKELETON_CONNECTIONS.forEach(([fromIdx, toIdx, color]) => {
                const p1 = getPt(fromIdx);
                const p2 = getPt(toIdx);
                if (p1 && p2) {
                  ctx.strokeStyle = ready ? '#34d399' : color;
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                }
              });

              // 2. Draw Spine Midline
              const pShL = getPt(11);
              const pShR = getPt(12);
              const pHipL = getPt(23);
              const pHipR = getPt(24);
              const pNose = getPt(0);

              if (pShL && pShR && pHipL && pHipR) {
                const shMid = { x: (pShL.x + pShR.x) / 2, y: (pShL.y + pShR.y) / 2 };
                const hipMid = { x: (pHipL.x + pHipR.x) / 2, y: (pHipL.y + pHipR.y) / 2 };
                
                const dev = Math.abs(shMid.x - hipMid.x);
                ctx.shadowBlur = 10;
                ctx.shadowColor = dev > 15 ? '#ef4444' : '#10b981';
                ctx.strokeStyle = dev > 15 ? '#f87171' : '#34d399';
                ctx.lineWidth = ready ? 4.5 : 3.5;
                
                ctx.beginPath();
                if (pNose) {
                  ctx.moveTo(pNose.x, pNose.y);
                  ctx.lineTo(shMid.x, shMid.y);
                } else {
                  ctx.moveTo(shMid.x, shMid.y);
                }
                ctx.lineTo(hipMid.x, hipMid.y);
                ctx.stroke();

                // Vertical Gravity Plumb Line
                ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(hipMid.x, Math.max(0, shMid.y - 40));
                ctx.lineTo(hipMid.x, Math.min(h, hipMid.y + 120));
                ctx.stroke();
                ctx.setLineDash([]);
              }

              ctx.shadowBlur = 0;

              // 3. Draw Joint Nodes
              const activeJointIndices = [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
              activeJointIndices.forEach((idx) => {
                const pt = getPt(idx);
                if (pt) {
                  ctx.fillStyle = ready ? '#10b981' : idx === 0 ? '#10b981' : (idx === 11 || idx === 12) ? '#38bdf8' : '#f59e0b';
                  ctx.beginPath();
                  ctx.arc(pt.x, pt.y, ready ? 6 : 5, 0, 2 * Math.PI);
                  ctx.fill();

                  ctx.strokeStyle = '#ffffff';
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(pt.x, pt.y, ready ? 6 : 5, 0, 2 * Math.PI);
                  ctx.stroke();
                }
              });
            } else {
              // NO HUMAN IN FRAME: DO NOT LOAD A DEFAULT SKELETON
              latestLandmarksRef.current = null;
              smoothedLandmarksRef.current = null;
              stabilityCounterRef.current = 0;
              setAlignmentScore(0);
              setIsReadyToCapture(false);
              setAlignmentStatus('warning');
              setAlignmentMessage('⚠ Scanning for silhouette... Step into the camera frame');
            }
          } catch (err) {
            console.error('Error in pose detection loop:', err);
          }
        }
      }

      animationFrameId = requestAnimationFrame(detectPose);
    };

    detectPose();

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [useSimulator, webcam.isCameraActive, poseLandmarker, isMediaPipeReady, activeVideoRef]);

  const handleToggleSource = async (toLive: boolean) => {
    if (toLive) {
      setUseSimulator(false);
      await webcam.startWebcam();
    } else {
      webcam.stopWebcam();
      setUseSimulator(true);
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const devId = e.target.value;
    webcam.setSelectedDeviceId(devId);
    webcam.startWebcam(devId);
  };

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (useSimulator) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 640, 480);

      ctx.strokeStyle = 'rgba(79,124,177,0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 480); ctx.stroke();
      }
      for (let y = 0; y < 480; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke();
      }

      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#3b82f6';

      if (simulatorPosture === 'neutral') {
        ctx.strokeStyle = '#93c5fd';
        ctx.beginPath();
        ctx.arc(320, 110, 35, 0, Math.PI * 2);
        ctx.moveTo(320, 145); ctx.lineTo(320, 290);
        ctx.moveTo(250, 158); ctx.lineTo(390, 162); // slight natural human asymmetry
        ctx.moveTo(270, 290); ctx.lineTo(370, 292);
        ctx.moveTo(285, 290); ctx.lineTo(285, 420);
        ctx.moveTo(355, 292); ctx.lineTo(355, 420);
        ctx.stroke();
      } else if (simulatorPosture === 'tilted') {
        ctx.strokeStyle = '#f87171';
        ctx.beginPath();
        ctx.arc(310, 110, 35, 0, Math.PI * 2);
        ctx.moveTo(310, 145);
        ctx.bezierCurveTo(320, 200, 340, 250, 325, 290);
        ctx.moveTo(240, 175); ctx.lineTo(380, 145);
        ctx.moveTo(275, 290); ctx.lineTo(375, 285);
        ctx.moveTo(290, 290); ctx.lineTo(280, 420);
        ctx.moveTo(360, 285); ctx.lineTo(350, 420);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#fb923c';
        ctx.beginPath();
        ctx.arc(320, 110, 35, 0, Math.PI * 2);
        ctx.moveTo(320, 145);
        ctx.bezierCurveTo(365, 210, 275, 260, 320, 290);
        ctx.moveTo(250, 158); ctx.lineTo(390, 164);
        ctx.moveTo(260, 290); ctx.lineTo(380, 290);
        ctx.moveTo(280, 290); ctx.lineTo(280, 420);
        ctx.moveTo(360, 290); ctx.lineTo(360, 420);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      onCaptureCompleted(canvas, preferences, true, simulatorPosture);
    } else {
      const success = webcam.captureFrame(canvas);
      if (success) {
        webcam.stopWebcam();
        onCaptureCompleted(canvas, preferences, false, undefined, smoothedLandmarksRef.current || undefined);
      }
    }
  };

  return (
    <section id="scanner" className="py-16 sm:py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
            BIOMETRIC ASSESSMENT & SCAN
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Hayleys AI Posture & Body Calibration
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Configure your height, weight load, and sleeping arrangement (Single vs Married / Couple), then scan your posture to derive your personalized mattress match.
          </p>

          {/* Mobile Stepper Pill Indicator */}
          <div className="flex sm:hidden items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveStep('preferences')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeStep === 'preferences'
                  ? 'bg-brand-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              1. Sleep Profile
            </button>
            <span className="text-slate-300">→</span>
            <button
              onClick={() => setActiveStep('camera')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeStep === 'camera'
                  ? 'bg-brand-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              2. Camera Scan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Preferences Settings */}
          <div className={`lg:col-span-5 flex flex-col justify-between bg-slate-50 border border-slate-200/90 rounded-3xl p-5 sm:p-7 premium-shadow ${
            activeStep === 'camera' ? 'hidden lg:flex' : 'flex'
          }`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-brand-700" />
                  <h3 className="text-base font-extrabold text-slate-900">Sleep Profile & Kinematics</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold">
                  Step 1 of 2
                </span>
              </div>

              {/* 1. Sleeper Status: Single vs Married / Couple */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-brand-600" /> 1. Sleeping Arrangement (Bed Sharing)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Single (Solo Sleeper)', icon: <User className="w-4 h-4" />, label: 'Solo Sleeper', desc: 'Individual spinal contouring' },
                    { id: 'Married / Couple (Sharing Bed)', icon: <HeartHandshake className="w-4 h-4 text-rose-500" />, label: 'Couple / Married', desc: 'Zero motion disturbance & Queen/King size' }
                  ].map((status) => (
                    <button
                      key={status.id}
                      onClick={() => setPreferences({ 
                        ...preferences, 
                        sleeperStatus: status.id as any,
                        priorities: {
                          ...preferences.priorities,
                          motionIsolation: status.id.includes('Couple') ? true : preferences.priorities.motionIsolation
                        }
                      })}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        preferences.sleeperStatus === status.id
                          ? 'border-brand-700 bg-brand-950 text-white shadow-sm ring-1 ring-brand-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {status.icon}
                        <span className="text-xs font-bold">{status.label}</span>
                      </div>
                      <span className={`text-[10px] block font-light leading-tight ${preferences.sleeperStatus === status.id ? 'text-slate-300' : 'text-slate-400'}`}>
                        {status.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Height Stature */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-indigo-600" /> 2. Height Stature (Mattress Length)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Petite (< 160cm / 5\'3")',
                    'Average (160-175cm / 5\'3"-5\'9")',
                    'Tall (175-190cm / 5\'9"-6\'3")',
                    'Very Tall (> 190cm / 6\'3"+)'
                  ].map((h) => (
                    <button
                      key={h}
                      onClick={() => setPreferences({ ...preferences, heightRange: h as any })}
                      className={`px-3 py-2.5 text-[11px] font-semibold rounded-xl border transition-all text-left truncate cursor-pointer ${
                        preferences.heightRange === h
                          ? 'border-brand-700 bg-brand-950 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Weight Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-emerald-600" /> 3. Body Weight (Core Load Factor)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Lightweight (< 55kg)',
                    'Standard (55-75kg)',
                    'Heavy (75-95kg)',
                    'Extra Heavy (> 95kg)'
                  ].map((w) => (
                    <button
                      key={w}
                      onClick={() => setPreferences({ ...preferences, weightRange: w as any })}
                      className={`px-3 py-2.5 text-[11px] font-semibold rounded-xl border transition-all text-left truncate cursor-pointer ${
                        preferences.weightRange === w
                          ? 'border-brand-700 bg-brand-950 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Sleeping Position */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  4. Primary Sleeping Position
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Back Sleeper', 'Side Sleeper', 'Stomach Sleeper', 'Combination Sleeper'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPreferences({ ...preferences, sleepingPosition: pos })}
                      className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-all text-left cursor-pointer ${
                        preferences.sleepingPosition === pos
                          ? 'border-brand-700 bg-brand-950 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Key Sleep Priorities */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  5. Comfort Priorities
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'cooling', label: 'Cooling & Airflow Ventilation', desc: 'Perforated latex & convoluted airflow foam' },
                    { key: 'motionIsolation', label: 'Zero Partner Motion Disturbance', desc: 'Pocketed springs for undisturbed couples sleep' },
                    { key: 'pressureRelief', label: 'Joint Pressure Relief', desc: 'Contouring memory & latex comfort layers' }
                  ].map((prio) => (
                    <label
                      key={prio.key}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        preferences.priorities[prio.key as keyof UserPreferences['priorities']]
                          ? 'border-brand-400 bg-brand-50/80 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-100/50'
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
                        className="mt-0.5 accent-brand-800 w-4 h-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{prio.label}</span>
                        <span className="text-[10px] text-slate-500 font-light">{prio.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Proceed to Camera Button */}
            <div className="pt-5 mt-5 border-t border-slate-200 lg:hidden">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setActiveStep('camera')}
                className="bg-brand-950 text-white shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Posture Scan</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column: Camera / Simulator Scanning Core */}
          <div className={`lg:col-span-7 flex flex-col justify-between bg-slate-950 rounded-3xl p-4 sm:p-6 text-white relative overflow-hidden shadow-2xl min-h-[480px] sm:min-h-[520px] ${
            activeStep === 'preferences' ? 'hidden lg:flex' : 'flex'
          }`}>
            <div className="absolute top-0 left-0 w-full h-full grid-overlay opacity-[0.04] pointer-events-none" />

            {/* Header info bar */}
            <div className="flex justify-between items-center z-10 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-slate-300 truncate">
                  {useSimulator ? 'Digital Biometric Simulator' : 'Live Optical Spine Scanner'}
                </span>
              </div>

              {/* Mode Toggles */}
              <div className="flex gap-1 sm:gap-2 bg-slate-900 p-1 rounded-full border border-slate-800 shrink-0">
                <button
                  onClick={() => handleToggleSource(false)}
                  className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-full transition-all cursor-pointer ${
                    useSimulator ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Simulator
                </button>
                <button
                  onClick={() => handleToggleSource(true)}
                  className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-full transition-all cursor-pointer ${
                    !useSimulator ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Webcam
                </button>
              </div>
            </div>

            {/* Canvas/Video Viewfinder screen */}
            <div className={`relative flex-grow my-4 bg-slate-900 border rounded-2xl flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[350px] transition-all duration-300 ${
              isReadyToCapture 
                ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.25)]' 
                : 'border-slate-800'
            }`}>
              
              {!isMediaPipeReady && !useSimulator ? (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-4 z-30">
                  <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                  <div>
                    <p className="text-sm font-semibold">Initializing Posture Model...</p>
                    <p className="text-xs text-slate-500 font-light mt-1 max-w-[240px]">
                      Loading MediaPipe Tasks-Vision neural tracking model.
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
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
                  <div className="absolute inset-x-0 top-[20%] border-t border-brand-500/10 pointer-events-none" />
                  <div className="absolute inset-x-0 top-[55%] border-t border-brand-500/10 pointer-events-none" />
                  <div className="absolute inset-y-0 left-[35%] border-l border-brand-500/10 pointer-events-none" />
                  <div className="absolute inset-y-0 left-[65%] border-l border-brand-500/10 pointer-events-none" />

                  {/* Standing Silhouette Overlay */}
                  <svg className="w-full h-full max-w-[300px] max-h-[360px] text-brand-500/20" viewBox="0 0 220 320">
                    <rect x="35" y="20" width="150" height="280" rx="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    
                    <path
                      d={postures[simulatorPosture].path}
                      fill="none"
                      stroke="#38a9fa"
                      strokeWidth="2"
                      className="opacity-70 animate-pulse-slow"
                    />
                  </svg>
                  
                  {/* Indicator Box showing bilateral asymmetry mapping */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate">
                      ASYMMETRY: {simulatorPosture === 'neutral' ? 'Natural ~1.2°' : simulatorPosture === 'tilted' ? 'Shoulder Drop ~4.2°' : 'Coronal ~22px'}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" /> READY
                    </span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {webcam.permissionError ? (
                    <div className="p-6 text-center space-y-4 max-w-sm">
                      <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
                      <h4 className="text-sm font-bold">Camera Blocked</h4>
                      <p className="text-xs text-slate-400 font-light">{webcam.permissionError}</p>
                      <Button variant="outline" size="sm" onClick={() => webcam.startWebcam()}>
                        Retry Access
                      </Button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={activeVideoRef}
                        className="w-full h-full object-cover"
                        style={{ transform: isFlipped ? 'scaleX(-1)' : 'none' }}
                        playsInline
                        muted
                      />

                      <canvas
                        ref={overlayCanvasRef}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{ transform: isFlipped ? 'scaleX(-1)' : 'none' }}
                      />

                      {/* Optical Silhouette Guide HUD */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg className={`w-full h-full max-w-[260px] max-h-[340px] transition-all duration-300 ${
                          isReadyToCapture ? 'text-emerald-400/40 scale-105' : 'text-slate-500/25'
                        }`} viewBox="0 0 220 300">
                          <path
                            d="M110,40 C125,40 135,50 135,65 C135,80 125,90 110,90 C95,90 85,80 85,65 C85,50 95,40 110,40 Z M60,110 L160,110 C175,110 180,120 180,135 C180,150 170,220 170,260 C170,280 160,290 145,290 C135,290 130,280 130,260 L130,200 L90,200 L90,260 C90,280 85,290 75,290 C60,290 50,280 50,260 C50,220 40,150 40,135 C40,120 45,110 60,110 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray={isReadyToCapture ? "none" : "4 4"}
                          />
                        </svg>
                        <div className={`absolute top-[20%] inset-x-0 border-t transition-all ${isReadyToCapture ? 'border-emerald-500/30' : 'border-slate-700/30'} w-full`} />
                        <div className={`absolute top-[60%] inset-x-0 border-t transition-all ${isReadyToCapture ? 'border-emerald-500/30' : 'border-slate-700/30'} w-full`} />
                      </div>

                      {/* Live Alignment HUD Indicator Top Floating Pill */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 backdrop-blur-md transition-all ${
                          isReadyToCapture
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-md'
                            : alignmentScore > 30
                              ? 'bg-slate-950/80 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-950/80 text-slate-400 border border-slate-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isReadyToCapture ? 'bg-emerald-400 animate-ping' : alignmentScore > 30 ? 'bg-amber-400' : 'bg-slate-500'}`} />
                          <span>Alignment: {alignmentScore}%</span>
                        </div>

                        {isReadyToCapture && (
                          <div className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wider uppercase shadow-lg shadow-emerald-500/30 flex items-center gap-1 animate-bounce">
                            <CheckCircle className="w-3.5 h-3.5" /> Ready to Shoot
                          </div>
                        )}
                      </div>

                      {/* Center Ready-to-Shoot Big Notification Badge */}
                      {isReadyToCapture && (
                        <div className="absolute bottom-4 inset-x-4 pointer-events-none flex justify-center">
                          <div className="px-4 py-2 rounded-2xl bg-emerald-950/90 border border-emerald-400/80 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fade-in">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-emerald-200">Optimal Alignment Locked — You can now take the photo!</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {isMediaPipeReady && !isReadyToCapture && (
                <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-lg shadow-brand-500/50 animate-scan pointer-events-none" />
              )}
            </div>

            {/* Bottom Controls Panel */}
            <div className="z-10 space-y-4">
              <div className={`p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 border text-xs transition-all ${
                alignmentStatus === 'success' || isReadyToCapture
                  ? 'bg-emerald-950/70 border-emerald-700 text-emerald-200 shadow-sm'
                  : alignmentStatus === 'warning'
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  <Info className={`w-4 h-4 shrink-0 ${isReadyToCapture ? 'text-emerald-400' : ''}`} />
                  <span className="font-medium tracking-wide text-[11px] sm:text-xs">{alignmentMessage}</span>
                </div>
                {useSimulator && (
                  <div className="flex gap-1">
                    {(['neutral', 'tilted', 'curved'] as const).map((post) => (
                      <button
                        key={post}
                        onClick={() => setSimulatorPosture(post)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize border cursor-pointer ${
                          simulatorPosture === post
                            ? 'bg-brand-500 text-white border-brand-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {post === 'neutral' ? 'Neutral' : post === 'tilted' ? 'Shoulder' : 'Spine Curve'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Device selectors & Capture Button */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={() => setActiveStep('preferences')}
                    className="lg:hidden px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>

                  {!useSimulator && webcam.isCameraActive && (
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {isFlipped ? "Unmirror" : "Mirror"}
                    </button>
                  )}
                  
                  {!useSimulator && webcam.devices.length > 1 && (
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-2.5 py-1">
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={webcam.selectedDeviceId}
                        onChange={handleCameraChange}
                        className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer max-w-[120px]"
                      >
                        {webcam.devices.map((dev) => (
                          <option key={dev.deviceId} value={dev.deviceId} className="bg-slate-900 text-white text-xs">
                            {dev.label || `Camera ${dev.deviceId.slice(0, 4)}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <Button
                  variant="gold"
                  disabled={(!useSimulator && !webcam.isCameraActive) || (!useSimulator && !isMediaPipeReady)}
                  onClick={handleCapture}
                  className={`w-full sm:w-auto font-bold px-7 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all duration-300 ${
                    isReadyToCapture
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-emerald-500/40 ring-4 ring-emerald-500/30 animate-pulse'
                      : 'bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-950'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {isReadyToCapture ? '✓ Take Photo Now' : 'Capture & Calculate Match'}
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
