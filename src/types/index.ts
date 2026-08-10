export interface TechnologyDetails {
  name: string;
  description: string;
  icon: string;
}

export type MattressCategory = 'Spring' | 'Rubberized Coir' | 'Foam';

export interface Mattress {
  id: string;
  name: string;
  category: MattressCategory;
  thickness: string; // e.g. "12 Inches", "10.5 & 12.5 Inches", "8 Inches", etc.
  warranty: string; // e.g. "10 Years", "5 Years", "7 Years"
  image: string;
  description: string;
  firmness: number; // 1-10 (1=Ultra Plush, 10=Extra Firm)
  supportLevel: string; // 'Extra Firm', 'Firm', 'Medium-Firm', 'Medium', 'Soft/Plush'
  coolingRating: number; // 1-5
  pressureReliefRating: number; // 1-5
  motionIsolationRating: number; // 1-5
  keyTechnologies: string[];
  idealPositions: string[];
  bodyTypeSuitability: string[];
  materials: string[];
  layers: string[]; // Step-by-step layer composition from catalogue
  certifications: string[]; // e.g. ['ISO 9001:2015', 'ISO 14001:2015', 'ISPA', 'OEKO-TEX']
  whyMatchExplain: string; // Biomechanical posture rationale
}

export interface PressureZone {
  name: string;
  loadPercentage: number; // calculated load based on alignment/posture
  status: 'optimal' | 'moderate' | 'high-pressure';
  description: string;
}

export interface AsymmetryBreakdown {
  shoulderLevelDiffPx: number;
  pelvicTiltDiffPx: number;
  lateralSpineCurveMm: number;
  dominantSideShift: 'Left' | 'Right' | 'Balanced';
  asymmetryReasoning: string; // e.g., "Dominant right-side shoulder drop from functional handedness & muscular compensation."
}

export interface BodyProfile {
  shoulderWidthPx: number;
  hipWidthPx: number;
  shoulderHipRatio: number;
  shoulderTiltAngle: number; // degrees deviation from horizontal
  spineDeviationPx: number; // max horizontal pixel deviation from central vertical axis
  symmetryRating: number; // 0-100% realistic bilateral symmetry (accounting for natural human asymmetry)
  asymmetry: AsymmetryBreakdown;
  spineAlignmentRating: 'Excellent' | 'Fair' | 'Requires Support';
  shoulderAlignmentRating: 'Aligned' | 'Slight Tilt' | 'Uneven';
  bodyType: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
  pressureZones: PressureZone[];
  calculatedFirmnessScore: number; // 1-10 recommended firmness
  primarySupportNeed: string; // 'Lumbosacral alignment', 'Shoulder pressure relief', 'Contoured lumbar support', etc.
}

export interface UserPreferences {
  sleepingPosition: 'Back Sleeper' | 'Side Sleeper' | 'Stomach Sleeper' | 'Combination Sleeper';
  heightRange: 'Petite (< 160cm / 5\'3")' | 'Average (160-175cm / 5\'3"-5\'9")' | 'Tall (175-190cm / 5\'9"-6\'3")' | 'Very Tall (> 190cm / 6\'3"+)';
  weightRange: 'Lightweight (< 55kg)' | 'Standard (55-75kg)' | 'Heavy (75-95kg)' | 'Extra Heavy (> 95kg)';
  sleeperStatus: 'Single (Solo Sleeper)' | 'Married / Couple (Sharing Bed)';
  priorities: {
    cooling: boolean;
    motionIsolation: boolean;
    pressureRelief: boolean;
  };
}

export interface ScoreDerivationFactor {
  factor: string;
  category: 'Base' | 'Firmness Proximity' | 'Sleeping Position' | 'Morphotype Matching' | 'Spine Orthopedic' | 'Thermal Dissipation' | 'Motion Isolation' | 'Partner Kinematics' | 'Height & Weight Load';
  impact: number; // positive or negative points
  formula: string;
  explanation: string;
}

export interface RecommendationResult {
  mattress: Mattress;
  matchPercentage: number;
  reasons: string[];
  derivationFactors: ScoreDerivationFactor[];
  targetFirmnessComputed: number;
  recommendedSize: string; // e.g. 'King 78" × 72"' or 'Queen 78" × 60"'
  motionIsolationNote?: string;
  asymmetryCompensationNote?: string;
}
