export interface TechnologyDetails {
  name: string;
  description: string;
  icon: string;
}

export interface Mattress {
  id: string;
  name: string;
  image: string;
  description: string;
  firmness: number; // 1-10
  supportLevel: string; // 'High', 'Medium-High', 'Balanced', 'Gentle'
  coolingRating: number; // 1-5
  pressureReliefRating: number; // 1-5
  motionIsolationRating: number; // 1-5
  keyTechnologies: string[];
  idealPositions: string[];
  bodyTypeSuitability: string[];
  materials: string[];
  whyMatchExplain: string; // Detailed logic breakdown
}

export interface PressureZone {
  name: string;
  loadPercentage: number; // calculated load based on alignment/posture
  status: 'optimal' | 'moderate' | 'high-pressure';
  description: string;
}

export interface BodyProfile {
  shoulderWidthPx: number;
  hipWidthPx: number;
  shoulderHipRatio: number;
  shoulderTiltAngle: number; // degrees deviation from horizontal
  spineDeviationPx: number; // max horizontal pixel deviation from central vertical axis
  symmetryRating: number; // 0-100% left-right symmetry
  spineAlignmentRating: 'Excellent' | 'Fair' | 'Requires Support';
  shoulderAlignmentRating: 'Aligned' | 'Slight Tilt' | 'Uneven';
  bodyType: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
  pressureZones: PressureZone[];
  calculatedFirmnessScore: number; // 1-10 recommended firmness
  primarySupportNeed: string; // 'Lumbosacral alignment', 'Shoulder pressure relief', 'Contoured lumbar support', etc.
}

export interface RecommendationResult {
  mattress: Mattress;
  matchPercentage: number;
  reasons: string[];
}
