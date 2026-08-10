import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  Rotate3d, 
  Play, 
  Pause,
  Maximize2,
  Minimize2
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

export const Interactive3DPostureViewer: React.FC<Interactive3DPostureViewerProps> = ({
  bodyProfile,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Interaction & Camera state
  const [yaw, setYaw] = useState<number>(30); // Horizontal rotation in degrees
  const [pitch, setPitch] = useState<number>(8); // Vertical tilt in degrees
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
    bodyType = 'Mesomorph'
  } = bodyProfile;

  // Build Dynamically Oriented 3D Human Anatomy Mannequin based on detected posture tilts
  const modelData = useMemo(() => {
    // Morphotype volumetric scaling
    const morphScaleX = bodyType === 'Ectomorph' ? 0.86 : bodyType === 'Endomorph' ? 1.22 : 1.0;
    const shoulderWidth = 96 * morphScaleX;
    const chestWidth = 86 * morphScaleX;
    const waistWidth = 70 * morphScaleX;
    const hipWidth = (90 / Math.max(0.78, shoulderHipRatio)) * morphScaleX;
    const limbThick = bodyType === 'Ectomorph' ? 0.88 : bodyType === 'Endomorph' ? 1.25 : 1.0;

    // Biomechanical Kinematic Orientations from Scan
    const tiltRad = (shoulderTiltAngle * Math.PI) / 180;
    const pelvicTiltRad = -tiltRad * 0.65; // Human functional counter-tilt
    const lateralSpineDriftX = (spineDeviationPx / 28) * 22; // Plumb line lateral shift

    // Helper to rotate a point around center (cx, cy) by angle rad in 2D coronal plane
    const rotateCoronal = (p: Point3D, angleRad: number, cy: number, cx: number = 0): Point3D => {
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);
      const dx = p.x - cx;
      const dy = p.y - cy;
      return {
        x: cx + dx * cosA - dy * sinA,
        y: cy + dx * sinA + dy * cosA,
        z: p.z
      };
    };

    // Shoulder & Neck pivot points
    const neckBaseY = -128;
    const rawShoulderL: Point3D = { x: -shoulderWidth / 2, y: -120, z: 0 };
    const rawShoulderR: Point3D = { x: shoulderWidth / 2, y: -120, z: 0 };
    const orientedShoulderL = rotateCoronal(rawShoulderL, tiltRad, neckBaseY, lateralSpineDriftX * 0.3);
    const orientedShoulderR = rotateCoronal(rawShoulderR, tiltRad, neckBaseY, lateralSpineDriftX * 0.3);

    // Pelvis & Hip pivot points
    const pelvisCenterY = 40;
    const rawHipL: Point3D = { x: -hipWidth / 2, y: 40, z: 0 };
    const rawHipR: Point3D = { x: hipWidth / 2, y: 40, z: 0 };
    const orientedHipL = rotateCoronal(rawHipL, pelvicTiltRad, pelvisCenterY, lateralSpineDriftX * 0.2);
    const orientedHipR = rotateCoronal(rawHipR, pelvicTiltRad, pelvisCenterY, lateralSpineDriftX * 0.2);

    // Elbows and Wrists inheriting shoulder tilt
    const rawElbowL: Point3D = { x: -shoulderWidth / 2 - 24, y: -45, z: 5 };
    const rawElbowR: Point3D = { x: shoulderWidth / 2 + 24, y: -45, z: 5 };
    const orientedElbowL = rotateCoronal(rawElbowL, tiltRad * 0.85, neckBaseY, lateralSpineDriftX * 0.3);
    const orientedElbowR = rotateCoronal(rawElbowR, tiltRad * 0.85, neckBaseY, lateralSpineDriftX * 0.3);

    const rawWristL: Point3D = { x: -shoulderWidth / 2 - 32, y: 25, z: 12 };
    const rawWristR: Point3D = { x: shoulderWidth / 2 + 32, y: 25, z: 12 };
    const orientedWristL = rotateCoronal(rawWristL, tiltRad * 0.7, neckBaseY, lateralSpineDriftX * 0.3);
    const orientedWristR = rotateCoronal(rawWristR, tiltRad * 0.7, neckBaseY, lateralSpineDriftX * 0.3);

    // Head orientation (subtle compensatory tilt)
    const headTiltRad = -tiltRad * 0.45;
    const orientedHead = rotateCoronal({ x: 0, y: -168, z: 0 }, headTiltRad, neckBaseY);
    const orientedChin = rotateCoronal({ x: 0, y: -140, z: 8 }, headTiltRad, neckBaseY);

    // Key 3D Human Joint Anchors
    const joints: Record<string, Point3D> = {
      head: orientedHead,
      chin: orientedChin,
      neck: { x: lateralSpineDriftX * 0.25, y: -128, z: 0 },
      shoulderL: orientedShoulderL,
      shoulderR: orientedShoulderR,
      elbowL: orientedElbowL,
      elbowR: orientedElbowR,
      wristL: orientedWristL,
      wristR: orientedWristR,
      hipL: orientedHipL,
      hipR: orientedHipR,
      kneeL: { x: orientedHipL.x + 3, y: 128, z: -4 },
      kneeR: { x: orientedHipR.x - 3, y: 128, z: -4 },
      ankleL: { x: orientedHipL.x + 5, y: 210, z: 2 },
      ankleR: { x: orientedHipR.x - 5, y: 210, z: 2 },
      toeL: { x: orientedHipL.x + 5, y: 218, z: 20 },
      toeR: { x: orientedHipR.x - 5, y: 218, z: 20 }
    };

    // 3D Solid Volumetric Cross-Sections (Head, Neck, Torso, Waist, Pelvis) with Dynamic Tilt
    const bodySlices = [
      // Cranium / Head
      { y: -188, rx: 20, rz: 22, cx: orientedHead.x, cz: 0, tilt: headTiltRad },
      { y: -172, rx: 24, rz: 27, cx: orientedHead.x, cz: 2, tilt: headTiltRad },
      { y: -154, rx: 23, rz: 25, cx: orientedHead.x, cz: 4, tilt: headTiltRad },
      { y: -140, rx: 17, rz: 19, cx: orientedHead.x, cz: 4, tilt: headTiltRad }, // Chin
      // Neck
      { y: -128, rx: 14, rz: 14, cx: lateralSpineDriftX * 0.25, cz: 0, tilt: tiltRad * 0.5 },
      // Upper Torso / Pectorals & Clavicle (Tilted with shoulders)
      { y: -114, rx: shoulderWidth * 0.46, rz: 24, cx: lateralSpineDriftX * 0.35, cz: 4, tilt: tiltRad },
      { y: -90, rx: chestWidth * 0.48, rz: 28, cx: lateralSpineDriftX * 0.55, cz: 6, tilt: tiltRad * 0.75 },
      { y: -65, rx: chestWidth * 0.46, rz: 26, cx: lateralSpineDriftX * 0.75, cz: 4, tilt: tiltRad * 0.45 },
      // Mid-Torso / Waist & Lumbar Spine
      { y: -38, rx: waistWidth * 0.44, rz: 23, cx: lateralSpineDriftX * 0.90, cz: 2, tilt: 0 },
      { y: -12, rx: waistWidth * 0.43, rz: 22, cx: lateralSpineDriftX * 0.75, cz: 2, tilt: pelvicTiltRad * 0.5 },
      // Pelvis & Gluteals (Tilted with pelvic counter-tilt)
      { y: 15, rx: hipWidth * 0.46, rz: 27, cx: lateralSpineDriftX * 0.45, cz: 3, tilt: pelvicTiltRad },
      { y: 40, rx: hipWidth * 0.50, rz: 30, cx: lateralSpineDriftX * 0.25, cz: 0, tilt: pelvicTiltRad },
      { y: 65, rx: hipWidth * 0.44, rz: 26, cx: lateralSpineDriftX * 0.10, cz: -2, tilt: pelvicTiltRad }
    ];

    // Construct 24 Individual 3D Vertebrae (C1-C7, T1-T12, L1-L5, S1)
    const vertebrae: { id: string; name: string; pos: Point3D; region: 'cervical' | 'thoracic' | 'lumbar' | 'sacrum'; load: number }[] = [];
    const totalVertebrae = 24;

    for (let i = 0; i < totalVertebrae; i++) {
      const t = i / (totalVertebrae - 1);
      const y = -128 + t * 168;

      // Sagittal depth curve (Lordosis in cervical/lumbar, kyphosis in thoracic)
      const sagittalZ = Math.sin(t * Math.PI * 2) * 13;

      // Coronal lateral curve based on measured spine deviation
      const coronalX = Math.sin(t * Math.PI) * lateralSpineDriftX;

      let region: 'cervical' | 'thoracic' | 'lumbar' | 'sacrum' = 'thoracic';
      let name = `T${i - 6}`;
      let load = 25;

      if (i < 7) {
        region = 'cervical';
        name = `C${i + 1}`;
        load = Math.round(15 + Math.abs(shoulderTiltAngle) * 2);
      } else if (i < 19) {
        region = 'thoracic';
        name = `T${i - 6}`;
        load = 30;
      } else if (i < 23) {
        region = 'lumbar';
        name = `L${i - 18}`;
        load = spineDeviationPx > 18 ? 48 : 32;
      } else {
        region = 'sacrum';
        name = 'S1';
        load = 38;
      }

      vertebrae.push({
        id: name,
        name,
        pos: { x: coronalX, y, z: sagittalZ },
        region,
        load
      });
    }

    // 3D Solid Limb Tubes (Arms & Legs)
    const limbSegments = [
      // Left Arm
      { p1: joints.shoulderL, p2: joints.elbowL, r1: 12 * limbThick, r2: 10 * limbThick },
      { p1: joints.elbowL, p2: joints.wristL, r1: 10 * limbThick, r2: 8 * limbThick },
      // Right Arm
      { p1: joints.shoulderR, p2: joints.elbowR, r1: 12 * limbThick, r2: 10 * limbThick },
      { p1: joints.elbowR, p2: joints.wristR, r1: 10 * limbThick, r2: 8 * limbThick },
      // Left Leg
      { p1: joints.hipL, p2: joints.kneeL, r1: 17 * limbThick, r2: 14 * limbThick },
      { p1: joints.kneeL, p2: joints.ankleL, r1: 14 * limbThick, r2: 10 * limbThick },
      // Right Leg
      { p1: joints.hipR, p2: joints.kneeR, r1: 17 * limbThick, r2: 14 * limbThick },
      { p1: joints.kneeR, p2: joints.ankleR, r1: 14 * limbThick, r2: 10 * limbThick }
    ];

    return { joints, bodySlices, vertebrae, limbSegments, shoulderWidth, hipWidth, tiltRad };
  }, [bodyType, shoulderHipRatio, shoulderTiltAngle, spineDeviationPx]);

  // Main 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Auto-rotation
      if (isAutoRotate) {
        setYaw((prev) => (prev + 0.35) % 360);
      }

      // Handle HiDPI displays
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

      // Dark Futuristic Cyber-Medical Canvas
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, width, height);

      // 3D Perspective Transformation Math
      const radYaw = (yaw * Math.PI) / 180;
      const radPitch = (pitch * Math.PI) / 180;
      const cosY = Math.cos(radYaw);
      const sinY = Math.sin(radYaw);
      const cosP = Math.cos(radPitch);
      const sinP = Math.sin(radPitch);

      // Adaptive Camera Zoom
      const fov = Math.min(width, height) * 0.95;
      const cameraZ = 350;
      const centerX = width / 2;
      const centerY = height / 2 + 10;

      const project = (p: Point3D): { x: number; y: number; scale: number; zDepth: number } => {
        // Rotate around Y-axis (Yaw)
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X-axis (Pitch)
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

      // 1. 3D Mattress & Bed Grid Floor
      const floorY = 230;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
      
      for (let r = 40; r <= 160; r += 28) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const pt = project({ x: Math.cos(a) * r, y: floorY, z: Math.sin(a) * r });
          if (a === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // 2. RENDER SOLID FILLED 3D HUMAN BODY MESH
      if (viewLayer === 'solid' || viewLayer === 'heatmap') {
        const slices = modelData.bodySlices;

        // Draw solid lofted quads between slices
        for (let s = 0; s < slices.length - 1; s++) {
          const s1 = slices[s];
          const s2 = slices[s + 1];
          const segs = 16; // 16 smooth radial segments

          for (let i = 0; i < segs; i++) {
            const a1 = (i / segs) * Math.PI * 2;
            const a2 = ((i + 1) / segs) * Math.PI * 2;

            // Tilt rotation applied to slice cross-section points
            const cosT1 = Math.cos(s1.tilt || 0);
            const sinT1 = Math.sin(s1.tilt || 0);
            const cosT2 = Math.cos(s2.tilt || 0);
            const sinT2 = Math.sin(s2.tilt || 0);

            const rx1a = Math.cos(a1) * s1.rx;
            const ry1a = rx1a * sinT1;
            const rx2a = Math.cos(a2) * s1.rx;
            const ry2a = rx2a * sinT1;

            const rx1b = Math.cos(a1) * s2.rx;
            const ry1b = rx1b * sinT2;
            const rx2b = Math.cos(a2) * s2.rx;
            const ry2b = rx2b * sinT2;

            const p1 = { x: s1.cx + rx1a * cosT1, y: s1.y + ry1a, z: s1.cz + Math.sin(a1) * s1.rz };
            const p2 = { x: s1.cx + rx2a * cosT1, y: s1.y + ry2a, z: s1.cz + Math.sin(a2) * s1.rz };
            const p3 = { x: s2.cx + rx2b * cosT2, y: s2.y + ry2b, z: s2.cz + Math.sin(a2) * s2.rz };
            const p4 = { x: s2.cx + rx1b * cosT2, y: s2.y + ry1b, z: s2.cz + Math.sin(a1) * s2.rz };

            const proj1 = project(p1);
            const proj2 = project(p2);
            const proj3 = project(p3);
            const proj4 = project(p4);

            // Compute surface normal & cyber-lighting reflection
            const midAngle = (a1 + a2) / 2;
            const lightAngle = radYaw + Math.PI / 4;
            const diffuse = Math.max(0.18, Math.cos(midAngle - lightAngle));

            // Solid Shading Color
            if (viewLayer === 'heatmap') {
              // Heatmap: Emerald for head/limbs, Amber/Red for shoulders & lumbar
              const isShoulderOrLumbar = s >= 5 && s <= 9;
              const intensity = isShoulderOrLumbar ? 0.85 : 0.45;
              const r = Math.round(intensity > 0.6 ? 245 : 52);
              const g = Math.round(intensity > 0.6 ? 158 * diffuse : 211 * diffuse);
              const b = Math.round(intensity > 0.6 ? 11 : 153);
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.45 + diffuse * 0.45})`;
            } else {
              // Solid Cyber-Mannequin Blue/Slate Shading with ambient rim highlights
              const baseBlue = Math.round(35 + diffuse * 60);
              const baseGreen = Math.round(75 + diffuse * 70);
              const baseNavy = Math.round(140 + diffuse * 110);
              ctx.fillStyle = `rgba(${baseBlue}, ${baseGreen}, ${baseNavy}, ${0.70 + diffuse * 0.28})`;
            }

            ctx.beginPath();
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
            ctx.lineTo(proj3.x, proj3.y);
            ctx.lineTo(proj4.x, proj4.y);
            ctx.closePath();
            ctx.fill();

            // Subtle contour lines
            ctx.strokeStyle = viewLayer === 'heatmap' ? 'rgba(251, 191, 36, 0.35)' : 'rgba(147, 197, 253, 0.30)';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        // Draw Solid Volumetric Limbs (Arms & Legs)
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
              : 'rgba(40, 85, 160, 0.75)';
            ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
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
        // Clavicle & Shoulder Girdle (Tilted)
        [j.shoulderL, j.shoulderR, '#38bdf8'],
        [j.neck, j.head, '#10b981'],
        // Left Arm (Tilted)
        [j.shoulderL, j.elbowL, '#60a5fa'],
        [j.elbowL, j.wristL, '#60a5fa'],
        // Right Arm (Tilted)
        [j.shoulderR, j.elbowR, '#60a5fa'],
        [j.elbowR, j.wristR, '#60a5fa'],
        // Torso Frame (Tilted with pelvic counter-tilt)
        [j.shoulderL, j.hipL, 'rgba(59, 130, 246, 0.6)'],
        [j.shoulderR, j.hipR, 'rgba(59, 130, 246, 0.6)'],
        [j.hipL, j.hipR, '#818cf8'],
        // Lower Limbs
        [j.hipL, j.kneeL, '#6366f1'],
        [j.kneeL, j.ankleL, '#6366f1'],
        [j.ankleL, j.toeL, '#818cf8'],
        [j.hipR, j.kneeR, '#6366f1'],
        [j.kneeR, j.ankleR, '#6366f1'],
        [j.ankleR, j.toeR, '#818cf8']
      ];

      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      bones.forEach(([p1, p2, color]) => {
        const pt1 = project(p1);
        const pt2 = project(p2);
        ctx.strokeStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // 4. Draw 3D Internal Illuminated Spine Column & Discs (C1-S1)
      const projectedVertebrae = modelData.vertebrae.map((v) => ({
        ...v,
        proj: project(v.pos)
      }));

      // Sort by depth (Z-buffer)
      projectedVertebrae.sort((a, b) => b.proj.zDepth - a.proj.zDepth);

      // Spine Continuous Spline
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = spineDeviationPx > 16 ? 'rgba(239, 68, 68, 0.95)' : 'rgba(52, 211, 153, 0.95)';
      ctx.beginPath();
      modelData.vertebrae.forEach((v, idx) => {
        const pt = project(v.pos);
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Render Individual 3D Illuminated Discs
      projectedVertebrae.forEach((v) => {
        const { x, y, scale } = v.proj;
        const radius = Math.max(4, 6.8 * scale);

        let color = '#38bdf8';
        if (v.region === 'cervical') color = '#34d399';
        else if (v.region === 'thoracic') color = '#60a5fa';
        else if (v.region === 'lumbar') color = v.load > 38 ? '#f87171' : '#fbbf24';
        else color = '#818cf8';

        // Outer glow
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // White nucleus center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw 3D Spherical Joint Nodes
      Object.entries(modelData.joints).forEach(([key, pt3d]) => {
        if (key.includes('chin') || key.includes('toe')) return;
        const pt = project(pt3d);
        const r = Math.max(4.5, 7.2 * pt.scale);

        ctx.fillStyle = key === 'head' ? '#10b981' : key.includes('shoulder') ? '#38bdf8' : '#6366f1';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 6. Draw 3D Gravitational Plumb Axis Reference (Yellow dashed vertical)
      const plumbTop = project({ x: 0, y: -190, z: 0 });
      const plumbBottom = project({ x: 0, y: 225, z: 0 });

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(plumbTop.x, plumbTop.y);
      ctx.lineTo(plumbBottom.x, plumbBottom.y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [yaw, pitch, isAutoRotate, viewLayer, modelData, spineDeviationPx]);

  // Touch and Mouse Drag Gestures for 360° Orbiting
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

    setYaw((prev) => (prev + dx * 0.7 + 360) % 360);
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

    setYaw((prev) => (prev + dx * 0.8 + 360) % 360);
    setPitch((prev) => Math.max(-45, Math.min(45, prev - dy * 0.6)));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const setCameraPreset = (presetYaw: number, presetPitch: number = 0) => {
    setIsAutoRotate(false);
    setYaw(presetYaw);
    setPitch(presetPitch);
  };

  return (
    <div className={`relative bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
      isExpanded 
        ? 'fixed inset-3 sm:inset-6 z-50 max-h-[92vh]' 
        : className
    }`}>
      
      {/* Top Control Header */}
      <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-10 text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 border border-brand-500/30 flex items-center justify-center text-white shadow-md">
            <Rotate3d className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              <span>Solid 3D Human Biomechanics</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono">
                {shoulderTiltAngle !== 0 ? `θ ${shoulderTiltAngle}° TILT` : 'ALIGNED'}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-light">Solid anatomical fills & dynamic posture orientation</p>
          </div>
        </div>

        {/* View Mode & Auto-Orbit Controls */}
        <div className="flex items-center gap-1.5">
          {/* Layer Selector */}
          <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            {(['solid', 'heatmap', 'spine'] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setViewLayer(layer)}
                className={`px-2 py-1 rounded-lg text-[9px] font-bold capitalize transition-all cursor-pointer ${
                  viewLayer === layer
                    ? 'bg-brand-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {layer === 'solid' ? 'Solid Body' : layer === 'heatmap' ? 'Pressure Map' : 'Spine Only'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isAutoRotate 
                ? 'bg-brand-600 text-white shadow-xs' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isAutoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{isAutoRotate ? 'Orbiting' : 'Paused'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isExpanded ? "Collapse view" : "Expand 3D model view"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded 3D Canvas Viewport (Mobile Responsive Height) */}
      <div className="relative flex-grow min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden">
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
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <button
            onClick={() => setCameraPreset(0, 0)}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer backdrop-blur-md ${
              yaw === 0 ? 'bg-brand-600 text-white border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            Coronal (Front 0°)
          </button>
          <button
            onClick={() => setCameraPreset(90, 0)}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer backdrop-blur-md ${
              yaw === 90 ? 'bg-brand-600 text-white border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            Sagittal (Side 90°)
          </button>
          <button
            onClick={() => setCameraPreset(180, 0)}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer backdrop-blur-md ${
              yaw === 180 ? 'bg-brand-600 text-white border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            Posterior Spine (180°)
          </button>
          <button
            onClick={() => setCameraPreset(45, 12)}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer backdrop-blur-md ${
              yaw === 45 ? 'bg-brand-600 text-white border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            Isometric (3D)
          </button>
        </div>

        {/* Live Orientation HUD on Right */}
        <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-300 pointer-events-none space-y-0.5 text-right">
          <div>Azimuth: <span className="text-brand-400 font-bold">{Math.round(yaw)}°</span></div>
          <div>Elevation: <span className="text-emerald-400 font-bold">{Math.round(pitch)}°</span></div>
        </div>

        {/* Bottom Biometric Posture Summary Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-300 z-10">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono block">
              DYNAMIC TILT ORIENTATION: <strong className="text-white">{bodyType} Morphotype</strong>
            </span>
            <div className="text-[10px] text-slate-400">
              Shoulder Cant: <span className="text-gold-400 font-bold">{shoulderTiltAngle}°</span> • Pelvic Counter-Tilt: <span className="text-brand-400 font-bold">{(-shoulderTiltAngle * 0.65).toFixed(1)}°</span> • Plumb Drift: <span className="text-emerald-400 font-bold">{spineDeviationPx}px</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Orientation Calibrated</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Interactive3DPostureViewer;
