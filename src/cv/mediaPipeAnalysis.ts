import type { BodyProfile, PressureZone } from '../types';

export interface Point {
  x: number;
  y: number;
}

/**
 * Generates mock MediaPipe normalized landmarks matching selected simulator posture.
 */
export const getMockLandmarks = (posture: 'neutral' | 'tilted' | 'curved') => {
  const landmarks = Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0 }));

  if (posture === 'neutral') {
    // Balanced
    landmarks[0] = { x: 0.50, y: 0.22, z: 0 }; // Nose
    landmarks[11] = { x: 0.39, y: 0.33, z: 0 }; // Left Shoulder
    landmarks[12] = { x: 0.61, y: 0.33, z: 0 }; // Right Shoulder
    landmarks[23] = { x: 0.42, y: 0.60, z: 0 }; // Left Hip
    landmarks[24] = { x: 0.58, y: 0.60, z: 0 }; // Right Hip
    landmarks[25] = { x: 0.44, y: 0.78, z: 0 }; // Left Knee
    landmarks[26] = { x: 0.56, y: 0.78, z: 0 }; // Right Knee
    landmarks[27] = { x: 0.44, y: 0.92, z: 0 }; // Left Ankle
    landmarks[28] = { x: 0.56, y: 0.92, z: 0 }; // Right Ankle
  } else if (posture === 'tilted') {
    // Shoulder tilted
    landmarks[0] = { x: 0.48, y: 0.22, z: 0 }; // Nose
    landmarks[11] = { x: 0.38, y: 0.36, z: 0 }; // Left Shoulder
    landmarks[12] = { x: 0.60, y: 0.30, z: 0 }; // Right Shoulder
    landmarks[23] = { x: 0.43, y: 0.60, z: 0 }; // Left Hip
    landmarks[24] = { x: 0.59, y: 0.59, z: 0 }; // Right Hip
    landmarks[25] = { x: 0.45, y: 0.78, z: 0 }; // Left Knee
    landmarks[26] = { x: 0.55, y: 0.78, z: 0 }; // Right Knee
    landmarks[27] = { x: 0.45, y: 0.92, z: 0 }; // Left Ankle
    landmarks[28] = { x: 0.55, y: 0.92, z: 0 }; // Right Ankle
  } else {
    // Curved spine
    landmarks[0] = { x: 0.50, y: 0.22, z: 0 }; // Nose
    landmarks[11] = { x: 0.39, y: 0.33, z: 0 }; // Left Shoulder
    landmarks[12] = { x: 0.61, y: 0.33, z: 0 }; // Right Shoulder
    landmarks[23] = { x: 0.45, y: 0.60, z: 0 }; // Left Hip (shifted)
    landmarks[24] = { x: 0.61, y: 0.60, z: 0 }; // Right Hip
    landmarks[25] = { x: 0.47, y: 0.78, z: 0 }; // Left Knee
    landmarks[26] = { x: 0.53, y: 0.78, z: 0 }; // Right Knee
    landmarks[27] = { x: 0.44, y: 0.92, z: 0 }; // Left Ankle
    landmarks[28] = { x: 0.56, y: 0.92, z: 0 }; // Right Ankle
  }
  return landmarks;
};

/**
 * Analyzes posture geometry from MediaPipe landmarks, rendering rich data grids and skeleton paths on a debug canvas.
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

  // Map normalized coordinate markers to canvas pixels
  const nose = { x: landmarks[0].x * imgWidth, y: landmarks[0].y * imgHeight };
  const shL = { x: landmarks[11].x * imgWidth, y: landmarks[11].y * imgHeight };
  const shR = { x: landmarks[12].x * imgWidth, y: landmarks[12].y * imgHeight };
  const hipL = { x: landmarks[23].x * imgWidth, y: landmarks[23].y * imgHeight };
  const hipR = { x: landmarks[24].x * imgWidth, y: landmarks[24].y * imgHeight };
  const kneeL = { x: landmarks[25].x * imgWidth, y: landmarks[25].y * imgHeight };
  const kneeR = { x: landmarks[26].x * imgWidth, y: landmarks[26].y * imgHeight };
  const ankleL = { x: landmarks[27].x * imgWidth, y: landmarks[27].y * imgHeight };
  const ankleR = { x: landmarks[28].x * imgWidth, y: landmarks[28].y * imgHeight };

  // Midpoints
  const shMid = { x: (shL.x + shR.x) / 2, y: (shL.y + shR.y) / 2 };
  const hipMid = { x: (hipL.x + hipR.x) / 2, y: (hipL.y + hipR.y) / 2 };
  const kneeMid = { x: (kneeL.x + kneeR.x) / 2, y: (kneeL.y + kneeR.y) / 2 };

  // --- Geometry calculations ---
  const shoulderWidth = Math.sqrt(Math.pow(shR.x - shL.x, 2) + Math.pow(shR.y - shL.y, 2));
  const hipWidth = Math.sqrt(Math.pow(hipR.x - hipL.x, 2) + Math.pow(hipR.y - hipL.y, 2));
  const shoulderHipRatio = Number((shoulderWidth / hipWidth).toFixed(2));

  // Shoulder Tilt (angle with horizontal plane)
  const shDx = shR.x - shL.x;
  const shDy = shR.y - shL.y;
  const shAngleRad = Math.atan2(shDy, shDx);
  const shoulderTilt = Number((shAngleRad * 180 / Math.PI).toFixed(1));

  // Spine Deviation: calculate deviation from pelvic-center plumb line
  const devNose = Math.abs(nose.x - hipMid.x);
  const devShoulders = Math.abs(shMid.x - hipMid.x);
  const devKnees = Math.abs(kneeMid.x - hipMid.x);

  const rawSpineDeviation = Math.max(devNose, devShoulders, devKnees * 0.5);
  const spineDeviation = Number(Math.min(rawSpineDeviation, 45).toFixed(1));

  // Symmetry (compare distances from central vertical axis)
  const shDistL = Math.abs(shL.x - shMid.x);
  const shDistR = Math.abs(shR.x - shMid.x);
  const hipDistL = Math.abs(hipL.x - hipMid.x);
  const hipDistR = Math.abs(hipR.x - hipMid.x);
  const shDiff = Math.abs(shDistL - shDistR);
  const hipDiff = Math.abs(hipDistL - hipDistR);
  const symmetry = Math.round(Math.max(100 - (shDiff + hipDiff) * 1.5, 65));

  // --- DRAW OVERLAYS ---

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

  ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(minX, minY, boxWidth, boxHeight);
  ctx.setLineDash([]);

  // 3. Draw bones with cyber glow
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  
  // Torso / Hips frame
  ctx.strokeStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(shL.x, shL.y); ctx.lineTo(shR.x, shR.y);
  ctx.moveTo(hipL.x, hipL.y); ctx.lineTo(hipR.x, hipR.y);
  ctx.moveTo(shL.x, shL.y); ctx.lineTo(hipL.x, hipL.y);
  ctx.moveTo(shR.x, shR.y); ctx.lineTo(hipR.x, hipR.y);
  ctx.stroke();

  // Legs
  ctx.strokeStyle = '#6366f1';
  ctx.beginPath();
  ctx.moveTo(hipL.x, hipL.y); ctx.lineTo(kneeL.x, kneeL.y);
  ctx.moveTo(kneeL.x, kneeL.y); ctx.lineTo(ankleL.x, ankleL.y);
  ctx.moveTo(hipR.x, hipR.y); ctx.lineTo(kneeR.x, kneeR.y);
  ctx.moveTo(kneeR.x, kneeR.y); ctx.lineTo(ankleR.x, ankleR.y);
  ctx.stroke();

  // Spine curves path
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

  // 4. Joints Anchors
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
  drawJoint(hipL, '#3b82f6');
  drawJoint(hipR, '#3b82f6');
  drawJoint(kneeL, '#6366f1');
  drawJoint(kneeR, '#6366f1');
  drawJoint(ankleL, '#6366f1');
  drawJoint(ankleR, '#6366f1');

  // 5. Draw Pressure Glow Zones (Hotspots)
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

  // 6. Metric Overlay labels
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(minX + 5, shMid.y - 28, 205, 18);
  ctx.fillRect(minX + 5, hipMid.y - 28, 195, 18);
  ctx.fillRect(minX + 5, midBackY - 28, 155, 18);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(`Shoulders: SHW:${Math.round(shoulderWidth)}px Tilt:${shoulderTilt}°`, minX + 10, shMid.y - 15);
  ctx.fillText(`Hips: HPW:${Math.round(hipWidth)}px Ratio:${shoulderHipRatio}`, minX + 10, hipMid.y - 15);
  ctx.fillText(`Spine Dev: ${spineDeviation}px`, minX + 10, midBackY - 15);

  // --- Posture alignment ratings ---
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
      name: 'Head & Neck',
      loadPercentage: Math.round(10 + Math.abs(shoulderTilt) * 2),
      status: Math.abs(shoulderTilt) > 3.5 ? 'moderate' : 'optimal',
      description: 'Cervical alignment support requirements.'
    },
    {
      name: 'Shoulders & Thoracic',
      loadPercentage: Math.round(25 + Math.abs(shoulderTilt) * 5),
      status: Math.abs(shoulderTilt) > 2.5 ? 'high-pressure' : 'optimal',
      description: 'Lateral compression relief on shoulder blades.'
    },
    {
      name: 'Lumbar Spine',
      loadPercentage: Math.round(20 + spineDeviation * 1.2),
      status: spineDeviation > 20 ? 'high-pressure' : spineDeviation > 10 ? 'moderate' : 'optimal',
      description: 'Lower back fill and alignment support.'
    },
    {
      name: 'Hips & Pelvis',
      loadPercentage: Math.round(30 + (shoulderWidth / hipWidth < 1 ? 8 : 2)),
      status: shoulderWidth / hipWidth < 1 ? 'high-pressure' : 'optimal',
      description: 'Primary sinking load point needing buoyant deflection.'
    },
    {
      name: 'Lower Limbs',
      loadPercentage: 15,
      status: 'optimal',
      description: 'Knee and ankle suspension support.'
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
  calculatedFirmnessScore = Math.max(3, Math.min(9, calculatedFirmnessScore));

  let primarySupportNeed = 'Contoured lumbar support';
  if (spineAlignmentRating === 'Requires Support') {
    primarySupportNeed = 'Rigid spine-neutralizing reinforcement';
  } else if (bodyType === 'Ectomorph') {
    primarySupportNeed = 'Deep shoulder & hip pressure-spike relief';
  } else if (shoulderAlignmentRating === 'Uneven') {
    primarySupportNeed = 'Zoned independent contouring springs';
  }

  return {
    shoulderWidthPx: Math.round(shoulderWidth),
    hipWidthPx: Math.round(hipWidth),
    shoulderHipRatio,
    shoulderTiltAngle: shoulderTilt,
    spineDeviationPx: spineDeviation,
    symmetryRating: symmetry,
    spineAlignmentRating,
    shoulderAlignmentRating,
    bodyType,
    pressureZones,
    calculatedFirmnessScore,
    primarySupportNeed
  };
};
