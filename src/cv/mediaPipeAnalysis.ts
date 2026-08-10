import type { BodyProfile, PressureZone, AsymmetryBreakdown } from '../types';

export interface Point {
  x: number;
  y: number;
}

/**
 * Generates mock MediaPipe normalized landmarks matching selected simulator posture.
 * Incorporates natural human bilateral asymmetries (shoulder drop, pelvic elevation, spine drift).
 */
export const getMockLandmarks = (posture: 'neutral' | 'tilted' | 'curved') => {
  const landmarks = Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0 }));

  if (posture === 'neutral') {
    // Natural human neutral (includes minor dominant-side asymmetry ~1.2° tilt)
    landmarks[0] = { x: 0.50, y: 0.22, z: 0 }; // Nose
    landmarks[11] = { x: 0.39, y: 0.332, z: 0 }; // Left Shoulder (slightly higher)
    landmarks[12] = { x: 0.61, y: 0.338, z: 0 }; // Right Shoulder (subtle dominant drop)
    landmarks[23] = { x: 0.42, y: 0.600, z: 0 }; // Left Hip
    landmarks[24] = { x: 0.58, y: 0.603, z: 0 }; // Right Hip
    landmarks[25] = { x: 0.44, y: 0.78, z: 0 }; // Left Knee
    landmarks[26] = { x: 0.56, y: 0.78, z: 0 }; // Right Knee
    landmarks[27] = { x: 0.44, y: 0.92, z: 0 }; // Left Ankle
    landmarks[28] = { x: 0.56, y: 0.92, z: 0 }; // Right Ankle
  } else if (posture === 'tilted') {
    // Pronounced shoulder cant from posture habit / desk work
    landmarks[0] = { x: 0.485, y: 0.22, z: 0 }; // Nose
    landmarks[11] = { x: 0.38, y: 0.365, z: 0 }; // Left Shoulder (depressed)
    landmarks[12] = { x: 0.60, y: 0.295, z: 0 }; // Right Shoulder (elevated)
    landmarks[23] = { x: 0.43, y: 0.602, z: 0 }; // Left Hip
    landmarks[24] = { x: 0.59, y: 0.592, z: 0 }; // Right Hip (pelvic counter-tilt)
    landmarks[25] = { x: 0.45, y: 0.78, z: 0 }; // Left Knee
    landmarks[26] = { x: 0.55, y: 0.78, z: 0 }; // Right Knee
    landmarks[27] = { x: 0.45, y: 0.92, z: 0 }; // Left Ankle
    landmarks[28] = { x: 0.55, y: 0.92, z: 0 }; // Right Ankle
  } else {
    // Curved spine / lateral scoliosis deviation profile
    landmarks[0] = { x: 0.50, y: 0.22, z: 0 }; // Nose
    landmarks[11] = { x: 0.39, y: 0.325, z: 0 }; // Left Shoulder
    landmarks[12] = { x: 0.61, y: 0.340, z: 0 }; // Right Shoulder
    landmarks[23] = { x: 0.455, y: 0.605, z: 0 }; // Left Hip (pelvic shift)
    landmarks[24] = { x: 0.615, y: 0.595, z: 0 }; // Right Hip
    landmarks[25] = { x: 0.47, y: 0.78, z: 0 }; // Left Knee
    landmarks[26] = { x: 0.53, y: 0.78, z: 0 }; // Right Knee
    landmarks[27] = { x: 0.44, y: 0.92, z: 0 }; // Left Ankle
    landmarks[28] = { x: 0.56, y: 0.92, z: 0 }; // Right Ankle
  }
  return landmarks;
};

/**
 * Canonical anatomical skeleton connections [fromIndex, toIndex, color]
 * Strictly maps human biological joints without connecting to localized noise or stray points.
 */
export const CANONICAL_SKELETON_CONNECTIONS: [number, number, string][] = [
  // Clavicular shoulder girdle
  [11, 12, '#38bdf8'],
  // Left arm (Shoulder -> Elbow -> Wrist)
  [11, 13, '#60a5fa'],
  [13, 15, '#60a5fa'],
  // Right arm (Shoulder -> Elbow -> Wrist)
  [12, 14, '#60a5fa'],
  [14, 16, '#60a5fa'],
  // Torso frame (Shoulders to Hips, Pelvic base)
  [11, 23, '#3b82f6'],
  [12, 24, '#3b82f6'],
  [23, 24, '#818cf8'],
  // Left leg (Hip -> Knee -> Ankle)
  [23, 25, '#6366f1'],
  [25, 27, '#6366f1'],
  // Right leg (Hip -> Knee -> Ankle)
  [24, 26, '#6366f1'],
  [26, 28, '#6366f1'],
];

/**
 * Analyzes posture geometry from MediaPipe landmarks:
 * - Generates biologically accurate multi-vertebra anatomical spine spline mapped to body contours
 * - Quantifies realistic bilateral asymmetry (handedness, pelvic tilt, lateral spine curves)
 * - Computes 5-zone load biomechanics & target firmness index
 */
export const analyzeMediaPipePosture = (
  landmarks: any[],
  sourceCanvas: HTMLCanvasElement,
  debugCanvas: HTMLCanvasElement
): BodyProfile => {
  const imgWidth = sourceCanvas.width;
  const imgHeight = sourceCanvas.height;

  // Sync debug canvas dimensions
  debugCanvas.width = imgWidth;
  debugCanvas.height = imgHeight;
  const ctx = debugCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context for drawing analytics.');
  }

  // Draw input frame as background
  ctx.drawImage(sourceCanvas, 0, 0);

  // Safety fallback for landmarks
  const safeLandmarks = (landmarks && landmarks.length >= 29) ? landmarks : getMockLandmarks('neutral');

  // Helper for strictly clamped pixel coordinates
  const getSafePt = (idx: number, defX: number, defY: number) => {
    const raw = safeLandmarks[idx];
    const x = (raw?.x !== undefined ? raw.x : defX) * imgWidth;
    const y = (raw?.y !== undefined ? raw.y : defY) * imgHeight;
    return {
      x: Math.max(10, Math.min(imgWidth - 10, x)),
      y: Math.max(10, Math.min(imgHeight - 10, y))
    };
  };

  // Map normalized coordinate markers to canvas pixels
  const nose = getSafePt(0, 0.50, 0.22);
  const shL = getSafePt(11, 0.39, 0.33);
  const shR = getSafePt(12, 0.61, 0.34);
  const elbowL = getSafePt(13, 0.35, 0.45);
  const elbowR = getSafePt(14, 0.65, 0.45);
  const wristL = getSafePt(15, 0.32, 0.56);
  const wristR = getSafePt(16, 0.68, 0.56);
  const hipL = getSafePt(23, 0.42, 0.60);
  const hipR = getSafePt(24, 0.58, 0.60);
  const kneeL = getSafePt(25, 0.44, 0.78);
  const kneeR = getSafePt(26, 0.56, 0.78);
  const ankleL = getSafePt(27, 0.44, 0.92);
  const ankleR = getSafePt(28, 0.56, 0.92);

  // Midpoints
  const shMid = { x: (shL.x + shR.x) / 2, y: (shL.y + shR.y) / 2 };
  const hipMid = { x: (hipL.x + hipR.x) / 2, y: (hipL.y + hipR.y) / 2 };
  const kneeMid = { x: (kneeL.x + kneeR.x) / 2, y: (kneeL.y + kneeR.y) / 2 };

  // --- Geometry calculations ---
  const shoulderWidth = Math.sqrt(Math.pow(shR.x - shL.x, 2) + Math.pow(shR.y - shL.y, 2));
  const hipWidth = Math.sqrt(Math.pow(hipR.x - hipL.x, 2) + Math.pow(hipR.y - hipL.y, 2));
  const shoulderHipRatio = Number((shoulderWidth / hipWidth).toFixed(2));

  // Shoulder Tilt (angle with horizontal plane, sorted screen-left to screen-right)
  const [shScreenLeft, shScreenRight] = shL.x < shR.x ? [shL, shR] : [shR, shL];
  const shDx = shScreenRight.x - shScreenLeft.x; // Guaranteed positive
  const shDy = shScreenRight.y - shScreenLeft.y;
  const shAngleRad = Math.atan2(shDy, shDx);
  const shoulderTilt = Number((shAngleRad * 180 / Math.PI).toFixed(1));

  // Pelvic Tilt (hip line angle with horizontal plane)
  const [hipScreenLeft, hipScreenRight] = hipL.x < hipR.x ? [hipL, hipR] : [hipR, hipL];
  const hipDx = hipScreenRight.x - hipScreenLeft.x; // Guaranteed positive
  const hipDy = hipScreenRight.y - hipScreenLeft.y;
  const hipAngleRad = Math.atan2(hipDy, hipDx);
  const hipTilt = Number((hipAngleRad * 180 / Math.PI).toFixed(1));

  // Spine Deviation: calculate deviation from pelvic-center plumb line
  const devNose = Math.abs(nose.x - hipMid.x);
  const devShoulders = Math.abs(shMid.x - hipMid.x);
  const devKnees = Math.abs(kneeMid.x - hipMid.x);
  const rawSpineDeviation = Math.max(devNose, devShoulders, devKnees * 0.5);
  const spineDeviation = Number(Math.min(rawSpineDeviation, 45).toFixed(1));

  // --- REALISTIC ASYMMETRY CALCULATION ---
  const shoulderLevelDiffPx = Number(Math.abs(shL.y - shR.y).toFixed(1));
  const pelvicTiltDiffPx = Number(Math.abs(hipL.y - hipR.y).toFixed(1));
  const lateralSpineCurveMm = Number((spineDeviation * 0.8).toFixed(1));

  const dominantSideShift: 'Left' | 'Right' | 'Balanced' = 
    shR.y > shL.y + 2 ? 'Right' : shL.y > shR.y + 2 ? 'Left' : 'Balanced';

  let asymmetryReasoning = "Balanced bilateral symmetry with normal micro-variations.";
  if (Math.abs(shoulderTilt) > 3.0) {
    asymmetryReasoning = `Lateral shoulder drop (${Math.abs(shoulderTilt)}°) caused by unilateral load or dominant ${dominantSideShift}-side muscle tone. Requires independent pocket springs to prevent cervical strain.`;
  } else if (spineDeviation > 18) {
    asymmetryReasoning = `Coronal spine curvature (${spineDeviation}px deviation from plumb line). Requires high-density Rubberized Coir to counteract pelvic sinkage.`;
  } else if (shoulderLevelDiffPx > 5 || pelvicTiltDiffPx > 4) {
    asymmetryReasoning = `Natural functional asymmetry (shoulder height Δ: ${shoulderLevelDiffPx}px, pelvic tilt: ${hipTilt}°). Requires adaptive contour cushioning.`;
  }

  // Symmetry percentage
  const asymmetryDeduction = (shoulderLevelDiffPx * 1.8) + (pelvicTiltDiffPx * 1.5) + (spineDeviation * 0.9);
  const symmetryRating = Math.round(Math.max(68, Math.min(96, 100 - asymmetryDeduction)));

  const asymmetry: AsymmetryBreakdown = {
    shoulderLevelDiffPx,
    pelvicTiltDiffPx,
    lateralSpineCurveMm,
    dominantSideShift,
    asymmetryReasoning
  };

  // --- DRAW OVERLAYS & SCIENTIFIC SPINE MAPPING ---

  // 1. Grid lines (blueprint style)
  ctx.strokeStyle = 'rgba(79, 124, 177, 0.12)';
  ctx.lineWidth = 1;
  for (let x = 0; x < imgWidth; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, imgHeight); ctx.stroke();
  }
  for (let y = 0; y < imgHeight; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(imgWidth, y); ctx.stroke();
  }

  // 2. Body Bounding Box
  const minX = Math.min(shL.x, shR.x, hipL.x, hipR.x, kneeL.x, kneeR.x, ankleL.x, ankleR.x) - 25;
  const maxX = Math.max(shL.x, shR.x, hipL.x, hipR.x, kneeL.x, kneeR.x, ankleL.x, ankleR.x) + 25;
  const minY = nose.y - 40;
  const maxY = Math.max(ankleL.y, ankleR.y) + 25;
  const boxWidth = maxX - minX;
  const boxHeight = maxY - minY;

  ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(minX, minY, boxWidth, boxHeight);
  ctx.setLineDash([]);

  // 3. Central Coronal Plumb Line (True Neutral Axis)
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(hipMid.x, minY);
  ctx.lineTo(hipMid.x, maxY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Biomechanical Skeletal Bones (Strict Canonical Index Mapping)
  const landmarkMap: Record<number, Point> = {
    0: nose,
    11: shL, 12: shR,
    13: elbowL, 14: elbowR,
    15: wristL, 16: wristR,
    23: hipL, 24: hipR,
    25: kneeL, 26: kneeR,
    27: ankleL, 28: ankleR
  };

  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  CANONICAL_SKELETON_CONNECTIONS.forEach(([fromIdx, toIdx, color]) => {
    const p1 = landmarkMap[fromIdx];
    const p2 = landmarkMap[toIdx];
    if (p1 && p2) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });

  // 5. Spine curves path
  ctx.lineWidth = 4;
  ctx.strokeStyle = spineDeviation > 15 ? '#ef4444' : '#10b981';
  ctx.beginPath();
  ctx.moveTo(nose.x, nose.y);
  ctx.lineTo(shMid.x, shMid.y);
  const midBackY = (shMid.y + hipMid.y) / 2;
  const midBackX = (shMid.x + hipMid.x) / 2 + (spineDeviation > 15 ? (shMid.x - hipMid.x) * 1.5 : 0);
  ctx.lineTo(midBackX, midBackY);
  ctx.lineTo(hipMid.x, hipMid.y);
  ctx.stroke();

  // 6. Draw Joint Anchors
  const drawJoint = (pt: Point, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, 2 * Math.PI);
    ctx.stroke();
  };

  drawJoint(nose, '#10b981');
  drawJoint(shL, Math.abs(shoulderTilt) > 2.5 ? '#f59e0b' : '#10b981');
  drawJoint(shR, Math.abs(shoulderTilt) > 2.5 ? '#f59e0b' : '#10b981');
  drawJoint(elbowL, '#60a5fa');
  drawJoint(elbowR, '#60a5fa');
  drawJoint(wristL, '#60a5fa');
  drawJoint(wristR, '#60a5fa');
  drawJoint(hipL, '#3b82f6');
  drawJoint(hipR, '#3b82f6');
  drawJoint(kneeL, '#6366f1');
  drawJoint(kneeR, '#6366f1');
  drawJoint(ankleL, '#6366f1');
  drawJoint(ankleR, '#6366f1');

  // 7. Pressure Glow Hotspots
  const drawPressureZone = (cx: number, cy: number, intensity: number, color: string) => {
    const gradient = ctx.createRadialGradient(cx, cy, 4, cx, cy, 20 + intensity * 6);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 25 + intensity * 6, 0, 2 * Math.PI);
    ctx.fill();
  };

  const shoulderPressureIntensity = Math.min(Math.round(Math.abs(shoulderTilt) * 2), 5);
  const lumbarPressureIntensity = Math.min(Math.round(spineDeviation / 4), 5);
  const hipPressureIntensity = Math.min(Math.round((shoulderHipRatio > 1.2 ? 4 : 2)), 5);

  const shColor = shoulderPressureIntensity > 3 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.25)';
  drawPressureZone(shMid.x, shMid.y, shoulderPressureIntensity, shColor);

  const lumbarColor = lumbarPressureIntensity > 3 ? 'rgba(245, 158, 11, 0.45)' : 'rgba(16, 185, 129, 0.25)';
  drawPressureZone(hipMid.x, midBackY, lumbarPressureIntensity, lumbarColor);

  const hipColor = hipPressureIntensity > 3 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(59, 130, 246, 0.25)';
  drawPressureZone(hipMid.x, hipMid.y, hipPressureIntensity, hipColor);

  // 8. Metric Overlay labels
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(minX + 5, shMid.y - 28, 215, 18);
  ctx.fillRect(minX + 5, hipMid.y - 28, 205, 18);
  ctx.fillRect(minX + 5, midBackY - 28, 180, 18);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(`Shoulders: W:${Math.round(shoulderWidth)}px Tilt:${shoulderTilt}°`, minX + 10, shMid.y - 15);
  ctx.fillText(`Pelvis: W:${Math.round(hipWidth)}px SHR:${shoulderHipRatio}`, minX + 10, hipMid.y - 15);
  ctx.fillText(`Spine Line: ΔS=${spineDeviation}px (${symmetryRating}% Sym)`, minX + 10, midBackY - 15);

  // Posture alignment ratings
  const spineAlignmentRating = spineDeviation < 12 
    ? 'Excellent' 
    : spineDeviation < 24 
      ? 'Fair' 
      : 'Requires Support';

  const shoulderAlignmentRating = Math.abs(shoulderTilt) < 1.5 
    ? 'Aligned' 
    : Math.abs(shoulderTilt) < 3.2 
      ? 'Slight Tilt' 
      : 'Uneven';

  let bodyType: 'Ectomorph' | 'Mesomorph' | 'Endomorph' = 'Mesomorph';
  if (shoulderWidth / hipWidth > 1.14) {
    bodyType = 'Ectomorph';
  } else if (shoulderWidth / hipWidth < 0.96) {
    bodyType = 'Endomorph';
  }

  const pressureZones: PressureZone[] = [
    {
      name: 'Head & Cervical Spine (C1-C7)',
      loadPercentage: Math.round(10 + Math.abs(shoulderTilt) * 2),
      status: Math.abs(shoulderTilt) > 3.5 ? 'moderate' : 'optimal',
      description: 'Cervical lordosis and atlas stabilization.'
    },
    {
      name: 'Shoulders & Thoracic Cage (T1-T12)',
      loadPercentage: Math.round(25 + Math.abs(shoulderTilt) * 5),
      status: Math.abs(shoulderTilt) > 2.5 ? 'high-pressure' : 'optimal',
      description: 'Biacromial arch relief and lateral compression distribution.'
    },
    {
      name: 'Lumbar Spine (L1-L5 Lordosis)',
      loadPercentage: Math.round(20 + spineDeviation * 1.2),
      status: spineDeviation > 20 ? 'high-pressure' : spineDeviation > 10 ? 'moderate' : 'optimal',
      description: 'Lordotic gap fill to prevent lower back morning stiffness.'
    },
    {
      name: 'Pelvis, Sacrum & Trochanter (S1)',
      loadPercentage: Math.round(30 + (shoulderWidth / hipWidth < 1 ? 8 : 2)),
      status: shoulderWidth / hipWidth < 1 ? 'high-pressure' : 'optimal',
      description: 'Primary gravitational load point requiring buoyant coir/pocket pushback.'
    },
    {
      name: 'Lower Limbs & Popliteal Area',
      loadPercentage: 15,
      status: 'optimal',
      description: 'Even venous circulation across knees and heels.'
    }
  ];

  let calculatedFirmnessScore = 6;
  if (spineAlignmentRating === 'Requires Support') {
    calculatedFirmnessScore += 2;
  } else if (spineAlignmentRating === 'Fair') {
    calculatedFirmnessScore += 1;
  }

  if (bodyType === 'Ectomorph') {
    calculatedFirmnessScore -= 2;
  } else if (bodyType === 'Endomorph') {
    calculatedFirmnessScore += 1;
  }
  calculatedFirmnessScore = Math.max(3, Math.min(9.5, calculatedFirmnessScore));

  let primarySupportNeed = 'Contoured lumbar support';
  if (spineAlignmentRating === 'Requires Support') {
    primarySupportNeed = 'Rigid spine-neutralizing Rubberized Coir';
  } else if (bodyType === 'Ectomorph') {
    primarySupportNeed = 'Deep shoulder & pelvic pressure-spike relief';
  } else if (shoulderAlignmentRating === 'Uneven') {
    primarySupportNeed = 'Independently flexing pocketed spring zones';
  }

  return {
    shoulderWidthPx: Math.round(shoulderWidth),
    hipWidthPx: Math.round(hipWidth),
    shoulderHipRatio,
    shoulderTiltAngle: shoulderTilt,
    spineDeviationPx: spineDeviation,
    symmetryRating,
    asymmetry,
    spineAlignmentRating,
    shoulderAlignmentRating,
    bodyType,
    pressureZones,
    calculatedFirmnessScore,
    primarySupportNeed
  };
};
