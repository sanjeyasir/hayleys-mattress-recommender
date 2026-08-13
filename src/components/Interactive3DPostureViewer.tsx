import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  Rotate3d, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut
} from 'lucide-react';
import type { BodyProfile } from '../types';

interface Interactive3DPostureViewerProps {
  bodyProfile: BodyProfile;
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface PolygonFace3D {
  points: Point3D[];
  region: 'chest' | 'abdomen' | 'shoulder' | 'side' | 'back' | 'pelvis' | 'head' | 'limb';
  baseColor: { r: number; g: number; b: number };
  pressure: number; // 0.0 - 1.0 for heatmap mode
}

export const Interactive3DPostureViewer: React.FC<Interactive3DPostureViewerProps> = ({
  bodyProfile,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Interaction & Camera state
  const [yaw, setYaw] = useState<number>(30); // Horizontal rotation in degrees
  const [pitch, setPitch] = useState<number>(6); // Vertical tilt in degrees
  const [zoom, setZoom] = useState<number>(1.0); // Zoom multiplier
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [viewLayer, setViewLayer] = useState<'solid' | 'heatmap' | 'spine'>('solid');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Extract key biometric calibration inputs
  const {
    shoulderTiltAngle = 0,
    spineDeviationPx = 0,
    shoulderHipRatio = 1.05,
    bodyType = 'Mesomorph',
    calculatedFirmnessScore = 6.5,
    symmetryRating = 88,
    rawLandmarks
  } = bodyProfile;

  // Build 3D Human Anatomy with Flat-Shaded Planar Polygons & Forward Hunch Kyphosis Detection
  const modelData = useMemo(() => {
    const morphScaleX = bodyType === 'Ectomorph' ? 0.88 : bodyType === 'Endomorph' ? 1.20 : 1.0;
    const limbThick = bodyType === 'Ectomorph' ? 0.90 : bodyType === 'Endomorph' ? 1.22 : 1.0;

    let jHead: Point3D;
    let jChin: Point3D;
    let jNeck: Point3D;
    let jShoulderL: Point3D;
    let jShoulderR: Point3D;
    let jElbowL: Point3D;
    let jElbowR: Point3D;
    let jWristL: Point3D;
    let jWristR: Point3D;
    let jHipL: Point3D;
    let jHipR: Point3D;
    let jKneeL: Point3D;
    let jKneeR: Point3D;
    let jAnkleL: Point3D;
    let jAnkleR: Point3D;
    let shoulderWidth: number;
    let hipWidth: number;
    let tiltRad: number;
    let shoulderMidX: number;
    let pelvisMidX: number;
    let lateralSpineDriftX: number;
    let hunchFactor: number = 0; // 0 (upright) to 1.0 (hunched forward kyphosis)

    if (rawLandmarks && rawLandmarks.length >= 29) {
      const getLm = (idx: number, defX: number, defY: number, defZ: number = 0) => {
        const raw = rawLandmarks[idx];
        return {
          x: raw?.x !== undefined ? raw.x : defX,
          y: raw?.y !== undefined ? raw.y : defY,
          z: raw?.z !== undefined ? raw.z : defZ
        };
      };

      const noseLm = getLm(0, 0.50, 0.22, -0.04);
      const shLLm = getLm(11, 0.39, 0.33, 0);
      const shRLm = getLm(12, 0.61, 0.34, 0);
      const elbowLLm = getLm(13, 0.35, 0.45, 0.02);
      const elbowRLm = getLm(14, 0.65, 0.45, 0.02);
      const wristLLm = getLm(15, 0.32, 0.56, 0.05);
      const wristRLm = getLm(16, 0.68, 0.56, 0.05);
      const hipLLm = getLm(23, 0.42, 0.60, 0);
      const hipRLm = getLm(24, 0.58, 0.60, 0);
      const kneeLLm = getLm(25, 0.44, 0.78, -0.02);
      const kneeRLm = getLm(26, 0.56, 0.78, -0.02);
      const ankleLLm = getLm(27, 0.44, 0.92, 0.01);
      const ankleRLm = getLm(28, 0.56, 0.92, 0.01);

      // Detect Forward Hunch: nose forward from shoulder plane or anterior head flexion
      const shZAvg = (shLLm.z + shRLm.z) / 2;
      const noseForwardZ = shZAvg - noseLm.z; // negative z in MediaPipe = closer to camera
      const headYProximity = (shLLm.y + shRLm.y) / 2 - noseLm.y;
      
      if (noseForwardZ > 0.03 || headYProximity < 0.09) {
        hunchFactor = Math.min(1.0, Math.max(0.25, (noseForwardZ * 12) + (0.11 - headYProximity) * 5));
      } else {
        hunchFactor = 0;
      }

      const hipMidXRaw = (hipLLm.x + hipRLm.x) / 2;
      const hipMidYRaw = (hipLLm.y + hipRLm.y) / 2;
      const ankleMidYRaw = (ankleLLm.y + ankleRLm.y) / 2;
      const totalBodyHeightNorm = Math.max(0.45, ankleMidYRaw - noseLm.y);
      const scaleFactor = 385 / totalBodyHeightNorm;

      const mapTo3D = (lm: { x: number; y: number; z: number }, defaultZ: number = 0): Point3D => {
        return {
          x: (lm.x - hipMidXRaw) * scaleFactor,
          y: (lm.y - hipMidYRaw) * scaleFactor + 38,
          z: (lm.z ? -lm.z * scaleFactor * 0.35 : defaultZ)
        };
      };

      jHead = mapTo3D(noseLm, 0);
      jHead.y = Math.min(jHead.y, -165);
      jShoulderL = mapTo3D(shLLm, 0);
      jShoulderR = mapTo3D(shRLm, 0);
      jElbowL = mapTo3D(elbowLLm, 4);
      jElbowR = mapTo3D(elbowRLm, 4);
      jWristL = mapTo3D(wristLLm, 10);
      jWristR = mapTo3D(wristRLm, 10);
      jHipL = mapTo3D(hipLLm, 0);
      jHipR = mapTo3D(hipRLm, 0);
      jKneeL = mapTo3D(kneeLLm, -4);
      jKneeR = mapTo3D(kneeRLm, -4);
      jAnkleL = mapTo3D(ankleLLm, 2);
      jAnkleR = mapTo3D(ankleRLm, 2);

      // Forward hunch modulation (head/neck pushed forward in Z)
      if (hunchFactor > 0) {
        jHead.z += 22 * hunchFactor;
        jHead.y += 6 * hunchFactor;
      }

      jNeck = {
        x: (jShoulderL.x + jShoulderR.x) / 2,
        y: (jShoulderL.y + jShoulderR.y) / 2 - 8,
        z: 10 * hunchFactor
      };

      jChin = {
        x: (jHead.x + jNeck.x) / 2,
        y: (jHead.y + jNeck.y) / 2 + 6,
        z: 12 + 18 * hunchFactor
      };

      const shLineDist = Math.hypot(jShoulderR.x - jShoulderL.x, jShoulderR.y - jShoulderL.y);
      const hipLineDist = Math.hypot(jHipR.x - jHipL.x, jHipR.y - jHipL.y);
      shoulderWidth = Math.max(94, shLineDist);
      hipWidth = Math.max(80, hipLineDist);

      const shoulderCenter = {
        x: (jShoulderL.x + jShoulderR.x) / 2,
        y: (jShoulderL.y + jShoulderR.y) / 2,
        z: 0
      };
      const pelvisCenter = {
        x: (jHipL.x + jHipR.x) / 2,
        y: (jHipL.y + jHipR.y) / 2,
        z: 0
      };

      tiltRad = Math.atan2(jShoulderR.y - jShoulderL.y, jShoulderR.x - jShoulderL.x);

      shoulderMidX = shoulderCenter.x;
      pelvisMidX = pelvisCenter.x;
      // Damped spine drift
      const rawDrift = shoulderMidX - pelvisMidX;
      lateralSpineDriftX = Math.max(-10, Math.min(10, rawDrift * 0.35));
    } else {
      shoulderWidth = 106 * morphScaleX;
      hipWidth = (96 / Math.max(0.78, shoulderHipRatio)) * morphScaleX;

      tiltRad = (shoulderTiltAngle * Math.PI) / 180;
      lateralSpineDriftX = Math.max(-10, Math.min(10, (spineDeviationPx / 28) * 10));

      jNeck = { x: lateralSpineDriftX * 0.2, y: -135, z: 0 };
      jShoulderL = { x: -shoulderWidth / 2, y: -126, z: 0 };
      jShoulderR = { x: shoulderWidth / 2, y: -126, z: 0 };
      jElbowL = { x: -shoulderWidth / 2 - 22, y: -50, z: 4 };
      jElbowR = { x: shoulderWidth / 2 + 22, y: -50, z: 4 };
      jWristL = { x: -shoulderWidth / 2 - 28, y: 22, z: 10 };
      jWristR = { x: shoulderWidth / 2 + 28, y: 22, z: 10 };
      jHipL = { x: -hipWidth / 2, y: 40, z: 0 };
      jHipR = { x: hipWidth / 2, y: 40, z: 0 };
      jKneeL = { x: -hipWidth / 2 + 2, y: 125, z: -3 };
      jKneeR = { x: hipWidth / 2 - 2, y: 125, z: -3 };
      jAnkleL = { x: -hipWidth / 2 + 4, y: 205, z: 2 };
      jAnkleR = { x: hipWidth / 2 - 4, y: 205, z: 2 };
      jHead = { x: 0, y: -176, z: 0 };
      jChin = { x: 0, y: -146, z: 8 };
      shoulderMidX = 0;
      pelvisMidX = 0;
    }

    const joints: Record<string, Point3D> = {
      head: jHead,
      chin: jChin,
      neck: jNeck,
      shoulderL: jShoulderL,
      shoulderR: jShoulderR,
      elbowL: jElbowL,
      elbowR: jElbowR,
      wristL: jWristL,
      wristR: jWristR,
      hipL: jHipL,
      hipR: jHipR,
      kneeL: jKneeL,
      kneeR: jKneeR,
      ankleL: jAnkleL,
      ankleR: jAnkleR,
      toeL: { x: jAnkleL.x, y: jAnkleL.y + 8, z: 20 },
      toeR: { x: jAnkleR.x, y: jAnkleR.y + 8, z: 20 }
    };

    const shoulderCenterY = (jShoulderL.y + jShoulderR.y) / 2;
    const pelvisCenterY = (jHipL.y + jHipR.y) / 2;
    const torsoSpanY = pelvisCenterY - shoulderCenterY;

    // -------------------------------------------------------------
    // CONSTRUCT CLEAN FLAT-SHADED PLANAR POLYGONS FOR THE CHEST & TORSO
    // Prominent, solid faceted polygons connecting shoulders, chest, ribcage & hips
    // -------------------------------------------------------------
    const halfSh = shoulderWidth * 0.52;
    const halfHip = hipWidth * 0.52;
    const chestHunchOffsetZ = hunchFactor * 12; // Forward tilt of chest when hunched
    const zScale = 1.35; // Expansion factor for 3D body depth/boxing

    // 3D Grid of Key Torso Surface Vertices
    // Y0: Clavicular / Superior Shoulder Level
    const vClavMid = { x: shoulderMidX, y: shoulderCenterY - 2, z: (12 + chestHunchOffsetZ) * zScale };
    const vClavL = { x: jShoulderL.x + 4, y: jShoulderL.y, z: (8 + chestHunchOffsetZ) * zScale };
    const vClavR = { x: jShoulderR.x - 4, y: jShoulderR.y, z: (8 + chestHunchOffsetZ) * zScale };
    const vDeltoidL = { x: jShoulderL.x - 8, y: jShoulderL.y + 4, z: 2 * zScale };
    const vDeltoidR = { x: jShoulderR.x + 8, y: jShoulderR.y + 4, z: 2 * zScale };
    const vBackTop = { x: shoulderMidX, y: shoulderCenterY - 4, z: (-16 - (hunchFactor * 14)) * zScale };
    const vBackShL = { x: jShoulderL.x + 6, y: jShoulderL.y - 2, z: -14 * zScale };
    const vBackShR = { x: jShoulderR.x - 6, y: jShoulderR.y - 2, z: -14 * zScale };

    // Y1: Mid Pectoral / Sternum Level
    const yPec = shoulderCenterY + torsoSpanY * 0.24;
    const vSternumMid = { x: shoulderMidX * 0.7 + pelvisMidX * 0.3, y: yPec, z: (18 + chestHunchOffsetZ * 0.8) * zScale };
    const vPecL = { x: shoulderMidX - halfSh * 0.55, y: yPec, z: (17 + chestHunchOffsetZ * 0.8) * zScale };
    const vPecR = { x: shoulderMidX + halfSh * 0.55, y: yPec, z: (17 + chestHunchOffsetZ * 0.8) * zScale };
    const vChestOuterL = { x: shoulderMidX - halfSh * 0.96, y: yPec, z: 4 * zScale };
    const vChestOuterR = { x: shoulderMidX + halfSh * 0.96, y: yPec, z: 4 * zScale };
    const vBackMid = { x: shoulderMidX * 0.7 + pelvisMidX * 0.3, y: yPec, z: (-18 - (hunchFactor * 16)) * zScale }; // Kyphosis hump in back when hunched
    const vBackL1 = { x: shoulderMidX - halfSh * 0.70, y: yPec, z: -14 * zScale };
    const vBackR1 = { x: shoulderMidX + halfSh * 0.70, y: yPec, z: -14 * zScale };

    // Y2: Lower Ribcage / Epigastrium Level
    const yRib = shoulderCenterY + torsoSpanY * 0.50;
    const vXiphoid = { x: shoulderMidX * 0.45 + pelvisMidX * 0.55, y: yRib, z: 15 * zScale };
    const vRibL = { x: shoulderMidX * 0.45 + pelvisMidX * 0.55 - halfSh * 0.52, y: yRib, z: 14 * zScale };
    const vRibR = { x: shoulderMidX * 0.45 + pelvisMidX * 0.55 + halfSh * 0.52, y: yRib, z: 14 * zScale };
    const vRibOuterL = { x: shoulderMidX * 0.45 + pelvisMidX * 0.55 - halfSh * 0.90, y: yRib, z: 2 * zScale };
    const vRibOuterR = { x: shoulderMidX * 0.45 + pelvisMidX * 0.55 + halfSh * 0.90, y: yRib, z: 2 * zScale };
    const vBackRib = { x: shoulderMidX * 0.45 + pelvisMidX * 0.55, y: yRib, z: -16 * zScale };
    const vBackRibL = { x: shoulderMidX * 0.45 + pelvisMidX * 0.55 - halfSh * 0.65, y: yRib, z: -13 * zScale };
    const vBackRibR = { x: shoulderMidX * 0.45 + pelvisMidX * 0.55 + halfSh * 0.65, y: yRib, z: -13 * zScale };

    // Y3: Waist / Umbilicus Level
    const yWaist = shoulderCenterY + torsoSpanY * 0.75;
    const vUmbilicus = { x: shoulderMidX * 0.2 + pelvisMidX * 0.8, y: yWaist, z: 13 * zScale };
    const vAbL = { x: shoulderMidX * 0.2 + pelvisMidX * 0.8 - halfHip * 0.48, y: yWaist, z: 12 * zScale };
    const vAbR = { x: shoulderMidX * 0.2 + pelvisMidX * 0.8 + halfHip * 0.48, y: yWaist, z: 12 * zScale };
    const vFlankL = { x: shoulderMidX * 0.2 + pelvisMidX * 0.8 - halfHip * 0.86, y: yWaist, z: 0 * zScale };
    const vFlankR = { x: shoulderMidX * 0.2 + pelvisMidX * 0.8 + halfHip * 0.86, y: yWaist, z: 0 * zScale };
    const vBackWaist = { x: shoulderMidX * 0.2 + pelvisMidX * 0.8, y: yWaist, z: -13 * zScale };
    const vBackWaistL = { x: shoulderMidX * 0.2 + pelvisMidX * 0.8 - halfHip * 0.60, y: yWaist, z: -11 * zScale };
    const vBackWaistR = { x: shoulderMidX * 0.2 + pelvisMidX * 0.8 + halfHip * 0.60, y: yWaist, z: -11 * zScale };

    // Y4: Pelvic / Pubic Level
    const yPelvis = pelvisCenterY + 12;
    const vPubis = { x: pelvisMidX, y: yPelvis, z: 14 * zScale };
    const vIliacL = { x: jHipL.x + 8, y: yPelvis - 4, z: 11 * zScale };
    const vIliacR = { x: jHipR.x - 8, y: yPelvis - 4, z: 11 * zScale };
    const vHipOuterL = { x: jHipL.x - 4, y: yPelvis, z: 0 * zScale };
    const vHipOuterR = { x: jHipR.x + 4, y: yPelvis, z: 0 * zScale };
    const vSacrum = { x: pelvisMidX, y: yPelvis, z: -16 * zScale };
    const vGluteL = { x: jHipL.x + 4, y: yPelvis + 8, z: -14 * zScale };
    const vGluteR = { x: jHipR.x - 4, y: yPelvis + 8, z: -14 * zScale };

    // Planar Polygon Facets Array
    const faces: PolygonFace3D[] = [
      // --- PROMINENT CHEST FACETS (Pectoral Planar Plates) ---
      // Left Upper Pectoral Plate
      { points: [vClavMid, vClavL, vPecL, vSternumMid], region: 'chest', baseColor: { r: 40, g: 115, b: 210 }, pressure: 0.55 },
      // Right Upper Pectoral Plate
      { points: [vClavMid, vSternumMid, vPecR, vClavR], region: 'chest', baseColor: { r: 40, g: 115, b: 210 }, pressure: 0.55 },
      // Left Anterolateral Chest
      { points: [vClavL, vDeltoidL, vChestOuterL, vPecL], region: 'chest', baseColor: { r: 35, g: 100, b: 190 }, pressure: 0.50 },
      // Right Anterolateral Chest
      { points: [vClavR, vPecR, vChestOuterR, vDeltoidR], region: 'chest', baseColor: { r: 35, g: 100, b: 190 }, pressure: 0.50 },

      // --- MID THORACIC & RIBCAGE PLANAR FACETS ---
      // Left Sternal-Rib Facet
      { points: [vSternumMid, vPecL, vRibL, vXiphoid], region: 'chest', baseColor: { r: 42, g: 118, b: 215 }, pressure: 0.60 },
      // Right Sternal-Rib Facet
      { points: [vSternumMid, vXiphoid, vRibR, vPecR], region: 'chest', baseColor: { r: 42, g: 118, b: 215 }, pressure: 0.60 },
      // Left Outer Ribcage
      { points: [vPecL, vChestOuterL, vRibOuterL, vRibL], region: 'side', baseColor: { r: 32, g: 95, b: 185 }, pressure: 0.45 },
      // Right Outer Ribcage
      { points: [vPecR, vRibR, vRibOuterR, vChestOuterR], region: 'side', baseColor: { r: 32, g: 95, b: 185 }, pressure: 0.45 },

      // --- ABDOMINAL & CORE PLANAR FACETS ---
      // Left Epigastric-Navel Facet
      { points: [vXiphoid, vRibL, vAbL, vUmbilicus], region: 'abdomen', baseColor: { r: 38, g: 110, b: 205 }, pressure: 0.40 },
      // Right Epigastric-Navel Facet
      { points: [vXiphoid, vUmbilicus, vAbR, vRibR], region: 'abdomen', baseColor: { r: 38, g: 110, b: 205 }, pressure: 0.40 },
      // Left Flank
      { points: [vRibL, vRibOuterL, vFlankL, vAbL], region: 'side', baseColor: { r: 30, g: 90, b: 180 }, pressure: 0.35 },
      // Right Flank
      { points: [vRibR, vAbR, vFlankR, vRibOuterR], region: 'side', baseColor: { r: 30, g: 90, b: 180 }, pressure: 0.35 },

      // --- LOWER ABDOMEN & PELVIC FACETS ---
      // Left Hypogastric-Pubic Facet
      { points: [vUmbilicus, vAbL, vIliacL, vPubis], region: 'pelvis', baseColor: { r: 44, g: 122, b: 220 }, pressure: 0.70 },
      // Right Hypogastric-Pubic Facet
      { points: [vUmbilicus, vPubis, vIliacR, vAbR], region: 'pelvis', baseColor: { r: 44, g: 122, b: 220 }, pressure: 0.70 },
      // Left Iliac Flank
      { points: [vAbL, vFlankL, vHipOuterL, vIliacL], region: 'side', baseColor: { r: 32, g: 95, b: 185 }, pressure: 0.65 },
      // Right Iliac Flank
      { points: [vAbR, vIliacR, vHipOuterR, vFlankR], region: 'side', baseColor: { r: 32, g: 95, b: 185 }, pressure: 0.65 },

      // --- POSTERIOR / BACK PLANAR FACETS ---
      // Upper Back / Kyphosis Zone (High pressure if hunched!)
      { points: [vBackTop, vBackShL, vBackL1, vBackMid], region: 'back', baseColor: { r: 28, g: 82, b: 165 }, pressure: hunchFactor > 0.3 ? 0.88 : 0.45 },
      { points: [vBackTop, vBackMid, vBackR1, vBackShR], region: 'back', baseColor: { r: 28, g: 82, b: 165 }, pressure: hunchFactor > 0.3 ? 0.88 : 0.45 },
      // Mid Back Scapular Zone
      { points: [vBackMid, vBackL1, vBackRibL, vBackRib], region: 'back', baseColor: { r: 28, g: 82, b: 165 }, pressure: hunchFactor > 0.3 ? 0.82 : 0.45 },
      { points: [vBackMid, vBackRib, vBackRibR, vBackR1], region: 'back', baseColor: { r: 28, g: 82, b: 165 }, pressure: hunchFactor > 0.3 ? 0.82 : 0.45 },
      // Lumbar Back Zone
      { points: [vBackRib, vBackRibL, vBackWaistL, vBackWaist], region: 'back', baseColor: { r: 30, g: 88, b: 172 }, pressure: 0.65 },
      { points: [vBackRib, vBackWaist, vBackWaistR, vBackRibR], region: 'back', baseColor: { r: 30, g: 88, b: 172 }, pressure: 0.65 },
      // Sacrum / Gluteal Back Zone
      { points: [vBackWaist, vBackWaistL, vGluteL, vSacrum], region: 'back', baseColor: { r: 34, g: 98, b: 185 }, pressure: 0.80 },
      { points: [vBackWaist, vSacrum, vGluteR, vBackWaistR], region: 'back', baseColor: { r: 34, g: 98, b: 185 }, pressure: 0.80 },

      // --- LATERAL SHOULDER-TO-SIDE BRIDGES ---
      { points: [vDeltoidL, vBackShL, vBackL1, vChestOuterL], region: 'side', baseColor: { r: 26, g: 78, b: 160 }, pressure: 0.50 },
      { points: [vDeltoidR, vChestOuterR, vBackR1, vBackShR], region: 'side', baseColor: { r: 26, g: 78, b: 160 }, pressure: 0.50 },
      { points: [vChestOuterL, vBackL1, vBackRibL, vRibOuterL], region: 'side', baseColor: { r: 26, g: 78, b: 160 }, pressure: 0.40 },
      { points: [vChestOuterR, vRibOuterR, vBackRibR, vBackR1], region: 'side', baseColor: { r: 26, g: 78, b: 160 }, pressure: 0.40 },
      { points: [vRibOuterL, vBackRibL, vBackWaistL, vFlankL], region: 'side', baseColor: { r: 26, g: 78, b: 160 }, pressure: 0.35 },
      { points: [vRibOuterR, vFlankR, vBackWaistR, vBackRibR], region: 'side', baseColor: { r: 26, g: 78, b: 160 }, pressure: 0.35 },
      { points: [vFlankL, vBackWaistL, vGluteL, vHipOuterL], region: 'side', baseColor: { r: 26, g: 78, b: 160 }, pressure: 0.55 },
      { points: [vFlankR, vHipOuterR, vGluteR, vBackWaistR], region: 'side', baseColor: { r: 26, g: 78, b: 160 }, pressure: 0.55 }
    ];

    // Damped 24 Vertebrae (C1-S1) with anatomical curve aligned with the torso's boundaries
    const vertebrae: { id: string; name: string; pos: Point3D; region: 'cervical' | 'thoracic' | 'lumbar' | 'sacrum'; load: number }[] = [];
    const totalVertebrae = 24;
    const spineStartY = shoulderCenterY - 4; // Aligned with the top line of the torso (vBackTop.y)
    const spineEndY = pelvisCenterY + 12; // Aligned with the bottom line of the pelvis (yPelvis)

    for (let i = 0; i < totalVertebrae; i++) {
      const t = i / (totalVertebrae - 1);
      const y = spineStartY + t * (spineEndY - spineStartY);
      
      // Sagittal spine curvature: flipped to correct anatomical orientation (Thoracic curves backward/negative, Lumbar curves forward/positive)
      let sagittalZ = -Math.sin(t * Math.PI * 2) * 7.5;
      if (i >= 5 && i <= 18) {
        // Thoracic Kyphosis Arc
        sagittalZ -= Math.sin(((i - 5) / 13) * Math.PI) * (14 * hunchFactor);
      } else if (i < 5) {
        // Cervical anterior displacement
        sagittalZ += (1 - i / 5) * (12 * hunchFactor);
      }

      const coronalX = (1 - t) * (shoulderMidX * 0.2) + t * (pelvisMidX * 0.2) + Math.sin(t * Math.PI) * lateralSpineDriftX;

      let region: 'cervical' | 'thoracic' | 'lumbar' | 'sacrum' = 'thoracic';
      let name = `T${i - 6}`;
      let load = 25;

      if (i < 7) {
        region = 'cervical';
        name = `C${i + 1}`;
        load = Math.round(15 + Math.abs(shoulderTiltAngle) * 1.5 + (hunchFactor * 25));
      } else if (i < 19) {
        region = 'thoracic';
        name = `T${i - 6}`;
        load = Math.round(28 + (hunchFactor * 32));
      } else if (i < 23) {
        region = 'lumbar';
        name = `L${i - 18}`;
        load = Math.abs(lateralSpineDriftX) > 6 ? 42 : 30;
      } else {
        region = 'sacrum';
        name = 'S1';
        load = 35;
      }

      vertebrae.push({ id: name, name, pos: { x: coronalX, y, z: sagittalZ }, region, load });
    }

    const limbSegments = [
      { p1: joints.shoulderL, p2: joints.elbowL, r1: 14 * limbThick, r2: 10 * limbThick },
      { p1: joints.elbowL, p2: joints.wristL, r1: 10 * limbThick, r2: 8 * limbThick },
      { p1: joints.shoulderR, p2: joints.elbowR, r1: 14 * limbThick, r2: 10 * limbThick },
      { p1: joints.elbowR, p2: joints.wristR, r1: 10 * limbThick, r2: 8 * limbThick },
      { p1: joints.hipL, p2: joints.kneeL, r1: 18 * limbThick, r2: 14 * limbThick },
      { p1: joints.kneeL, p2: joints.ankleL, r1: 14 * limbThick, r2: 10 * limbThick },
      { p1: joints.hipR, p2: joints.kneeR, r1: 18 * limbThick, r2: 14 * limbThick },
      { p1: joints.kneeR, p2: joints.ankleR, r1: 14 * limbThick, r2: 10 * limbThick }
    ];

    return { joints, faces, vertebrae, limbSegments, shoulderWidth, hipWidth, tiltRad, hunchFactor };
  }, [bodyType, shoulderHipRatio, shoulderTiltAngle, spineDeviationPx, rawLandmarks]);

  // Main 3D Canvas Rendering Loop: Crisp Flat-Shaded Planar Polygons
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (isAutoRotate) {
        setYaw((prev) => (prev + 0.32) % 360);
      }

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const width = rect.width;
      const height = rect.height;

      // Dark Futuristic Theme Canvas (#060911 with subtle brand blue/navy ambient glow)
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, width, height);

      // 3D Perspective Transformation Math
      const radYaw = (yaw * Math.PI) / 180;
      const radPitch = (pitch * Math.PI) / 180;
      const cosY = Math.cos(radYaw);
      const sinY = Math.sin(radYaw);
      const cosP = Math.cos(radPitch);
      const sinP = Math.sin(radPitch);

      const fov = Math.min(width * 1.15, height) * 0.72 * zoom;
      const cameraZ = 360;
      const centerX = width / 2;
      const centerY = height * 0.49;

      const project = (p: Point3D): { x: number; y: number; scale: number; zDepth: number } => {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosP - z1 * sinP;
        const z2 = p.y * sinP + z1 * cosP + cameraZ;
        const scale = fov / Math.max(10, z2);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          scale,
          zDepth: z2
        };
      };

      // 1. 3D Medical Hologram Floor Matrix
      const floorY = 224;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      for (let r = 40; r <= 180; r += 28) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const pt = project({ x: Math.cos(a) * r, y: floorY, z: Math.sin(a) * r });
          if (a === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // Directional Light Vector for Crisp Flat Polygon Shading
      const lightDir = { x: 0.35, y: -0.45, z: 0.82 };
      const lightLen = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
      const lx = lightDir.x / lightLen;
      const ly = lightDir.y / lightLen;
      const lz = lightDir.z / lightLen;

      // 2. RENDER FLAT PLANAR POLYGON FACES (Chest, Abdomen, Back & Pelvis)
      if (viewLayer === 'solid' || viewLayer === 'heatmap') {
        // Transform and Depth Sort all planar polygon faces
        const renderedFaces = modelData.faces.map((face) => {
          const projPoints = face.points.map((p) => project(p));
          const avgZ = projPoints.reduce((acc, p) => acc + p.zDepth, 0) / projPoints.length;

          // Compute 3D Face Surface Normal for Flat Lambertian Shading
          const p0 = face.points[0];
          const p1 = face.points[1];
          const p2 = face.points[2];
          const u = { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z };
          const v = { x: p2.x - p0.x, y: p2.y - p0.y, z: p2.z - p0.z };
          const nx = u.y * v.z - u.z * v.y;
          const ny = u.z * v.x - u.x * v.z;
          const nz = u.x * v.y - u.y * v.x;
          const nLen = Math.hypot(nx, ny, nz) || 1;

          // Rotate normal by camera view
          const rnx = (nx / nLen) * cosY + (nz / nLen) * sinY;
          const rnz = -(nx / nLen) * sinY + (nz / nLen) * cosY;
          const rny = (ny / nLen) * cosP - rnz * sinP;
          const rnzFinal = (ny / nLen) * sinP + rnz * cosP;

          const dot = rnx * lx + rny * ly + rnzFinal * lz;
          const intensity = Math.max(0.18, Math.min(1.0, 0.40 + dot * 0.60));

          return { face, projPoints, avgZ, intensity };
        });

        // Depth sort: render furthest faces first (Painter's algorithm)
        renderedFaces.sort((a, b) => b.avgZ - a.avgZ);

        renderedFaces.forEach(({ face, projPoints, intensity }) => {
          ctx.beginPath();
          projPoints.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();

          if (viewLayer === 'heatmap') {
            // Pressure Heatmap Ramp
            const p = face.pressure;
            const r = Math.round(p > 0.65 ? 245 : 30 + p * 180);
            const g = Math.round(p > 0.65 ? 140 * intensity : 190 * intensity);
            const b = Math.round(p > 0.65 ? 15 : 240);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.72 + intensity * 0.28})`;
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
          } else {
            // Solid Mode: Clean, Prominent Flat-Shaded Planar Colors
            const r = Math.round(face.baseColor.r * intensity);
            const g = Math.round(face.baseColor.g * intensity);
            const b = Math.round(face.baseColor.b * intensity);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.82 + intensity * 0.18})`;
            
            // Prominent facet edges for the chest
            if (face.region === 'chest') {
              ctx.strokeStyle = 'rgba(147, 197, 253, 0.60)';
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = 'rgba(147, 197, 253, 0.30)';
              ctx.lineWidth = 0.8;
            }
          }

          ctx.fill();
          ctx.stroke();
        });

        // Draw Solid Limbs (Arms & Legs)
        modelData.limbSegments.forEach(({ p1, p2, r1, r2 }) => {
          const pt1 = project(p1);
          const pt2 = project(p2);

          const dx = pt2.x - pt1.x;
          const dy = pt2.y - pt1.y;
          const len = Math.hypot(dx, dy);
          if (len > 0) {
            const nx1 = (-dy / len) * (r1 * pt1.scale);
            const ny1 = (dx / len) * (r1 * pt1.scale);
            const nx2 = (-dy / len) * (r2 * pt2.scale);
            const ny2 = (dx / len) * (r2 * pt2.scale);

            ctx.fillStyle = viewLayer === 'heatmap'
              ? 'rgba(234, 179, 8, 0.45)'
              : 'rgba(38, 92, 175, 0.80)';
            ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(pt1.x + nx1, pt1.y + ny1);
            ctx.lineTo(pt2.x + nx2, pt2.y + ny2);
            ctx.lineTo(pt2.x - nx2, pt2.y - ny2);
            ctx.lineTo(pt1.x - nx1, pt1.y - ny1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        });
      }

      // 3. Draw 3D Canonical Skeletal Bones
      const j = modelData.joints;
      const bones: [Point3D, Point3D, string][] = [
        [j.shoulderL, j.shoulderR, '#38bdf8'],
        [j.neck, j.head, '#10b981'],
        [j.shoulderL, j.elbowL, '#60a5fa'],
        [j.elbowL, j.wristL, '#60a5fa'],
        [j.shoulderR, j.elbowR, '#60a5fa'],
        [j.elbowR, j.wristR, '#60a5fa'],
        [j.shoulderL, j.hipL, 'rgba(59, 130, 246, 0.6)'],
        [j.shoulderR, j.hipR, 'rgba(59, 130, 246, 0.6)'],
        [j.hipL, j.hipR, '#818cf8'],
        [j.hipL, j.kneeL, '#6366f1'],
        [j.kneeL, j.ankleL, '#6366f1'],
        [j.ankleL, j.toeL, '#818cf8'],
        [j.hipR, j.kneeR, '#6366f1'],
        [j.kneeR, j.ankleR, '#6366f1'],
        [j.ankleR, j.toeR, '#818cf8']
      ];

      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      bones.forEach(([p1, p2, color]) => {
        const pt1 = project(p1);
        const pt2 = project(p2);
        ctx.strokeStyle = color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // 4. Draw Damped Spine Column with Kyphosis & 24 Discs
      const projectedVertebrae = modelData.vertebrae.map((v) => ({
        ...v,
        proj: project(v.pos)
      }));
      projectedVertebrae.sort((a, b) => b.proj.zDepth - a.proj.zDepth);

      // Spine Spline Line
      ctx.beginPath();
      ctx.strokeStyle = modelData.hunchFactor > 0.35 || Math.abs(shoulderTiltAngle) > 3.0 ? '#f59e0b' : '#10b981';
      ctx.lineWidth = 4.0;
      ctx.shadowBlur = 10;
      ctx.shadowColor = modelData.hunchFactor > 0.35 || Math.abs(shoulderTiltAngle) > 3.0 ? '#f59e0b' : '#10b981';

      for (let i = 0; i < modelData.vertebrae.length; i++) {
        const pt = project(modelData.vertebrae[i].pos);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glowing Vertebrae Discs
      projectedVertebrae.forEach((v) => {
        const radius = Math.max(3.2, 5.5 * (fov / Math.max(10, v.proj.zDepth)));
        const color = v.region === 'cervical' ? '#38bdf8' : v.region === 'thoracic' ? (modelData.hunchFactor > 0.35 ? '#f59e0b' : '#10b981') : v.region === 'lumbar' ? '#f59e0b' : '#8b5cf6';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(v.proj.x, v.proj.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      });

      // Joint Nodes
      Object.entries(modelData.joints).forEach(([name, pt3d]) => {
        const pt = project(pt3d);
        const radius = name === 'head' ? 10 * pt.scale : 4.5 * pt.scale;
        
        ctx.fillStyle = (name.includes('shoulder') && Math.abs(shoulderTiltAngle) > 2.5) || (name === 'head' && modelData.hunchFactor > 0.35) ? '#f59e0b' : '#10b981';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(3, radius), 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [yaw, pitch, zoom, isAutoRotate, viewLayer, modelData, shoulderTiltAngle]);

  // Drag Controls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setIsAutoRotate(false);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setYaw((prev) => (prev + dx * 0.7) % 360);
    setPitch((prev) => Math.max(-45, Math.min(45, prev - dy * 0.5)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsAutoRotate(false);
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePosRef.current.x;
    const dy = e.touches[0].clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setYaw((prev) => (prev + dx * 0.7) % 360);
    setPitch((prev) => Math.max(-45, Math.min(45, prev - dy * 0.5)));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const setCameraPreset = (newYaw: number, newPitch: number) => {
    setIsAutoRotate(false);
    setYaw(newYaw);
    setPitch(newPitch);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.75, Math.min(1.8, Number((prev + delta).toFixed(2)))));
  };

  return (
    <>
      {/* Blurred Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-60 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div 
        className={`bg-slate-950 text-white border border-slate-800 flex flex-col transition-all duration-300 ${
          isExpanded 
            ? 'fixed inset-4 sm:inset-10 md:inset-16 z-70 shadow-2xl rounded-3xl' 
            : `relative rounded-2xl ${className}`
        }`}
      >
        {/* Top Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-800 z-10 gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-700/30 border border-brand-400/40 flex items-center justify-center text-brand-400">
              <Rotate3d className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wide text-white block">3D Posture Model</span>
              <span className="text-[10px] text-slate-400 font-light">
                {modelData.hunchFactor > 0.35 ? 'Kyphotic / Forward Hunch Profile' : 'Planar Polygon Biomechanical Simulation'}
              </span>
            </div>
          </div>

          {/* View Mode, Zoom & Orbit Controls */}
          <div className="flex flex-wrap items-center gap-2 md:gap-1.5 justify-start md:justify-end">
            {/* Layer Selector */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
              {(['solid', 'heatmap', 'spine'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setViewLayer(layer)}
                  className={`px-1.5 sm:px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-extrabold capitalize transition-all cursor-pointer ${
                    viewLayer === layer
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {layer === 'solid' ? 'Polygons' : layer === 'heatmap' ? 'Pressure' : 'Spine'}
                </button>
              ))}
            </div>

            {/* Zoom Buttons */}
            <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
              <button
                onClick={() => handleZoom(-0.15)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[8px] sm:text-[9px] font-mono text-slate-400">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => handleZoom(0.15)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto Orbit Toggle */}
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[8px] sm:text-[10px] font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                isAutoRotate 
                  ? 'bg-brand-700 text-white shadow-xs' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isAutoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden sm:inline">{isAutoRotate ? 'Orbit' : 'Paused'}</span>
            </button>

            {/* Expand Modal Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title={isExpanded ? "Collapse view" : "Expand 3D model view"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative flex-grow min-h-[320px] sm:min-h-[360px] md:min-h-[390px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full object-contain"
          />

          {/* Camera View Presets on Left */}
          <div className="absolute bottom-16 left-3 flex flex-row sm:flex-col gap-1 z-10 overflow-x-auto max-w-[calc(100%-24px)] pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setCameraPreset(0, 0)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-extrabold border transition-all cursor-pointer backdrop-blur-md whitespace-nowrap ${
                yaw === 0 ? 'bg-brand-700 text-white border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setCameraPreset(90, 0)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-extrabold border transition-all cursor-pointer backdrop-blur-md whitespace-nowrap ${
                yaw === 90 ? 'bg-brand-700 text-white border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              Side
            </button>
            <button
              onClick={() => setCameraPreset(180, 0)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-extrabold border transition-all cursor-pointer backdrop-blur-md whitespace-nowrap ${
                yaw === 180 ? 'bg-brand-700 text-white border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              Spine
            </button>
            <button
              onClick={() => setCameraPreset(35, 8)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[8px] sm:text-[9px] font-extrabold border transition-all cursor-pointer backdrop-blur-md whitespace-nowrap ${
                yaw === 35 ? 'bg-brand-700 text-white border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              3D Iso
            </button>
          </div>

        {/* Live Orientation HUD on Right */}
        <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-300 pointer-events-none space-y-0.5 text-right">
          <div>Azimuth: <span className="text-[#4A90E2] font-bold">{Math.round(yaw)}°</span></div>
          <div>Elevation: <span className="text-emerald-400 font-bold">{Math.round(pitch)}°</span></div>
        </div>

        {/* Bottom Biometric Posture Summary Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-300 z-10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono block">
                BIOMETRIC CALIBRATION: <strong className="text-white">{bodyType} Morphotype</strong>
              </span>
              {modelData.hunchFactor > 0.35 && (
                <span className="px-2 py-0.5 rounded-md bg-amber-950 border border-amber-500/50 text-[9px] font-bold text-amber-300">
                  Forward Kyphosis / Hunch
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              Shoulder Cant: <span className="text-amber-400 font-bold">{shoulderTiltAngle}°</span> • Spine: <span className="text-emerald-400 font-bold">{Math.min(12, spineDeviationPx)}px</span> • Symmetry: <span className="text-[#4A90E2] font-bold">{symmetryRating}%</span> • Sagittal: <span className={modelData.hunchFactor > 0.35 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{modelData.hunchFactor > 0.35 ? 'Forward Kyphosis' : 'Balanced Lordosis'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Target Firmness: {calculatedFirmnessScore.toFixed(1)}/10</span>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Interactive3DPostureViewer;
