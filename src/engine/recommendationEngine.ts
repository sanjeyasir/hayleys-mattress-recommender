import type { BodyProfile, Mattress, RecommendationResult, ScoreDerivationFactor, UserPreferences } from '../types';
import mattressesData from '../data/mattresses.json';

export type { UserPreferences };

const mattresses = mattressesData as Mattress[];

/**
 * Calculates deterministic match compatibility scores between standing biometric geometry,
 * height, weight load, sleeper status (Single vs Married/Couple), and Hayleys Mattress catalogue specifications.
 * 
 * Returns full mathematical derivation logs for scientific explainability.
 */
export const calculateRecommendations = (
  bodyProfile: BodyProfile,
  preferences: UserPreferences
): RecommendationResult[] => {
  // Determine optimal mattress size based on Sleeper Status and Height
  let recommendedSize = 'Queen 75" × 60"';
  const isCouple = preferences.sleeperStatus === 'Married / Couple (Sharing Bed)';
  const isTall = preferences.heightRange === 'Tall (175-190cm / 5\'9"-6\'3")' || preferences.heightRange === 'Very Tall (> 190cm / 6\'3"+)';

  if (isCouple) {
    if (isTall || preferences.heightRange === 'Very Tall (> 190cm / 6\'3"+)') {
      recommendedSize = 'King 78" × 72" (Extended Length)';
    } else {
      recommendedSize = 'Queen 75" × 60" / King 75" × 72"';
    }
  } else {
    // Solo sleeper
    if (isTall) {
      recommendedSize = 'Double 78" × 48" / Queen 78" × 60"';
    } else if (preferences.heightRange === 'Petite (< 160cm / 5\'3")') {
      recommendedSize = 'Single 72" × 36" / Double 72" × 48"';
    } else {
      recommendedSize = 'Single 75" × 36" / Double 75" × 48"';
    }
  }

  const allResults = mattresses.map((mattress) => {
    let score = 100;
    const reasons: string[] = [];
    const derivationFactors: ScoreDerivationFactor[] = [];

    // Base entry factor
    derivationFactors.push({
      factor: 'Base Baseline Score',
      category: 'Base',
      impact: 100,
      formula: 'Score_init = 100 pts',
      explanation: 'Starting baseline score before posture, biometric, and sleep arrangement weighting.'
    });

    // --- STEP 1: Derived Target Firmness Computation (Spine + Morphotype + Weight) ---
    let targetFirmness = bodyProfile.calculatedFirmnessScore;

    // Weight adjustments
    if (preferences.weightRange === 'Extra Heavy (> 95kg)') {
      targetFirmness += 1.5;
    } else if (preferences.weightRange === 'Heavy (75-95kg)') {
      targetFirmness += 0.8;
    } else if (preferences.weightRange === 'Lightweight (< 55kg)') {
      targetFirmness -= 1.0;
    }
    targetFirmness = Math.max(3.0, Math.min(9.5, targetFirmness));

    // --- STEP 2: Firmness Distance & Proximity Penalty ---
    // In sleep ergonomics, the target firmness represents an equilibrium point.
    // Models within ±0.8 (e.g., 4.0–5.5 for a 4.8 target) are in the sweet spot.
    const firmnessDiff = Math.abs(mattress.firmness - targetFirmness);
    let firmnessPenalty = Math.round(firmnessDiff * 12);
    // Exponential dampening if firmness is far off (> 2.0 away)
    if (firmnessDiff > 2.0) {
      firmnessPenalty += Math.round((firmnessDiff - 2.0) * 6);
    }
    score -= firmnessPenalty;

    derivationFactors.push({
      factor: 'Firmness Proximity Calibration',
      category: 'Firmness Proximity',
      impact: -firmnessPenalty,
      formula: `ΔF = |${mattress.firmness} - ${targetFirmness.toFixed(1)}| = ${firmnessDiff.toFixed(1)} → Penalty = -${firmnessPenalty} pts`,
      explanation: `Your biometric target firmness is ${targetFirmness.toFixed(1)}/10. ${mattress.name} provides ${mattress.firmness}/10 (Deviation ΔF: ${firmnessDiff.toFixed(1)}). Models closest to ${targetFirmness.toFixed(1)} (e.g. within ±0.7) are prioritized.`
    });

    if (firmnessDiff <= 0.8) {
      reasons.push(`Optimal Firmness Match: The ${mattress.supportLevel} density (${mattress.firmness}/10) is within ±${firmnessDiff.toFixed(1)} of your target ${targetFirmness.toFixed(1)}/10.`);
    } else if (mattress.firmness > targetFirmness) {
      reasons.push(`Provides slightly firmer structural resistance than your ${targetFirmness.toFixed(1)}/10 target.`);
    } else {
      reasons.push(`Engineered with plush cushioning layers for pressure relief.`);
    }

    // --- STEP 3: Marital Status & Bed-Sharing Partner Kinematics ---
    let motionIsolationNote: string | undefined = undefined;
    if (isCouple) {
      // Couple / Married: Zero Partner Disturbance is critical
      if (mattress.motionIsolationRating >= 5) {
        const bonus = 12;
        score += bonus;
        motionIsolationNote = "Zero Partner Disturbance: Encased pocket springs and visco memory absorb partner shifts independently.";
        reasons.push(`Couples / Married Sleep: Pocket spring & memory foam isolate partner motion across the bed.`);
        derivationFactors.push({
          factor: 'Zero Partner Motion Isolation',
          category: 'Partner Kinematics',
          impact: bonus,
          formula: `SleeperStatus(Couple) ∧ MotionRating(${mattress.motionIsolationRating} == 5) → +${bonus} pts`,
          explanation: `When sharing a bed, ${mattress.name}'s independent pocketed coils or dense memory foam prevent kinetic shockwaves from waking your partner.`
        });
      } else if (mattress.keyTechnologies.includes('Bonnell Spring Unit')) {
        const penalty = 12;
        score -= penalty;
        derivationFactors.push({
          factor: 'Interconnected Spring Motion Transfer',
          category: 'Partner Kinematics',
          impact: -penalty,
          formula: `SleeperStatus(Couple) ∧ BonnellNetwork → -${penalty} pts`,
          explanation: `Interconnected Bonnell spring coils transmit partner tossing vibrations across the mattress surface.`
        });
      }
    } else {
      // Single Sleeper
      derivationFactors.push({
        factor: 'Solo Ergonomic Tuning',
        category: 'Partner Kinematics',
        impact: 4,
        formula: `SleeperStatus(Single) → +4 pts`,
        explanation: `Customized exclusively for your individual anatomical curvature.`
      });
    }

    // --- STEP 4: Height & Dimension Compatibility ---
    if (isTall) {
      if (mattress.thickness.includes('12') || mattress.thickness.includes('10') || mattress.category === 'Spring') {
        const bonus = 5;
        score += bonus;
        derivationFactors.push({
          factor: 'Tall Stature Suspension Depth',
          category: 'Height & Weight Load',
          impact: bonus,
          formula: `Height(${preferences.heightRange}) ∧ DeepSuspension → +${bonus} pts`,
          explanation: `Taller individuals distribute gravitational load over a longer lever arm, benefiting from Hayleys deep multi-layer suspension.`
        });
      }
    }

    // --- STEP 5: Sleeping Position Kinematics ---
    const preferredPos = preferences.sleepingPosition;
    if (mattress.idealPositions.includes(preferredPos)) {
      const bonus = 8;
      score += bonus;
      reasons.push(`Calibrated specifically for your natural sleep posture as a ${preferredPos}.`);
      derivationFactors.push({
        factor: 'Sleep Posture Kinematics',
        category: 'Sleeping Position',
        impact: bonus,
        formula: `Position(${preferredPos}) ∈ IdealPositions → +${bonus} pts`,
        explanation: `${mattress.name} is engineered to support spinal neutrality for ${preferredPos}s.`
      });
    } else {
      const penalty = 10;
      score -= penalty;
      derivationFactors.push({
        factor: 'Sleep Posture Variance',
        category: 'Sleeping Position',
        impact: -penalty,
        formula: `Position(${preferredPos}) ∉ IdealPositions → -${penalty} pts`,
        explanation: `${mattress.name}'s suspension profile is less optimized for ${preferredPos} spinal contouring.`
      });
    }

    // --- STEP 6: Body Morphotype (Ecto / Meso / Endomorph) ---
    if (mattress.bodyTypeSuitability.includes(bodyProfile.bodyType)) {
      const bonus = 6;
      score += bonus;
      derivationFactors.push({
        factor: 'Morphotype Mass Distribution Match',
        category: 'Morphotype Matching',
        impact: bonus,
        formula: `Morphotype(${bodyProfile.bodyType}) ∈ Suitability → +${bonus} pts`,
        explanation: `Appropriate density resilience for your shoulder-to-hip anthropometric ratio (${bodyProfile.shoulderHipRatio}).`
      });
    } else {
      const penalty = 5;
      score -= penalty;
      derivationFactors.push({
        factor: 'Morphotype Variance',
        category: 'Morphotype Matching',
        impact: -penalty,
        formula: `Morphotype(${bodyProfile.bodyType}) ∉ Suitability → -${penalty} pts`,
        explanation: `Slight variance from optimal body mass distribution profile.`
      });
    }

    // --- STEP 7: Spine Deviation & Natural Asymmetry Compensation ---
    let asymmetryCompensationNote: string | undefined = undefined;
    if (bodyProfile.spineAlignmentRating === 'Requires Support' || bodyProfile.spineDeviationPx > 18) {
      if (mattress.category === 'Rubberized Coir' || mattress.keyTechnologies.some(t => t.includes('Coir') || t.includes('Euro Top'))) {
        const bonus = 14;
        score += bonus;
        asymmetryCompensationNote = `Orthopedic Coir neutralizes your ${bodyProfile.spineDeviationPx}px lateral spine deviation, keeping vertebrae level.`;
        reasons.push(`Spine Neutrality Priority: High-density Coir / reinforced core counteracts your ${bodyProfile.spineDeviationPx}px spine deviation.`);
        derivationFactors.push({
          factor: 'Orthopedic Spine Neutralization',
          category: 'Spine Orthopedic',
          impact: bonus,
          formula: `SpineDev(${bodyProfile.spineDeviationPx}px > 18) ∧ Coir/EuroTop → +${bonus} pts`,
          explanation: `Rigid rubberized coir or 3" Euro Top prevents pelvic sinkage and restores lumbosacral neutrality.`
        });
      } else {
        const penalty = 10;
        score -= penalty;
        derivationFactors.push({
          factor: 'Spine Support Deficit',
          category: 'Spine Orthopedic',
          impact: -penalty,
          formula: `SpineDev(${bodyProfile.spineDeviationPx}px > 18) ∧ PlushFoam → -${penalty} pts`,
          explanation: `Insufficient structural stiffness to correct elevated lumbosacral deviation.`
        });
      }
    } else if (Math.abs(bodyProfile.shoulderTiltAngle) > 2.5) {
      // Shoulder asymmetry / lateral cant
      if (mattress.keyTechnologies.some(t => t.includes('Pocket') || t.includes('Latex') || t.includes('Memory'))) {
        const bonus = 8;
        score += bonus;
        asymmetryCompensationNote = `Adaptive independent pocket springs / latex cushion your ${Math.abs(bodyProfile.shoulderTiltAngle)}° shoulder height variation.`;
        derivationFactors.push({
          factor: 'Asymmetry Cushioning',
          category: 'Spine Orthopedic',
          impact: bonus,
          formula: `ShoulderTilt(${Math.abs(bodyProfile.shoulderTiltAngle)}° > 2.5) ∧ PocketSpring/Latex → +${bonus} pts`,
          explanation: `Independently deflecting pockets wrap around the dropped dominant shoulder without stressing the neck.`
        });
      }
    }

    // --- STEP 8: Joint Pressure Relief Priority ---
    if (preferences.priorities.pressureRelief || bodyProfile.shoulderHipRatio > 1.15) {
      if (mattress.pressureReliefRating >= 4.5) {
        const bonus = 8;
        score += bonus;
        derivationFactors.push({
          factor: 'Pressure Spike Mitigation',
          category: 'Firmness Proximity',
          impact: bonus,
          formula: `PressureReliefPriority ∧ Rating(${mattress.pressureReliefRating} ≥ 4.5) → +${bonus} pts`,
          explanation: `Perforated natural latex and visco memory layers wrap around shoulder and pelvic contact points.`
        });
      }
    }

    // --- STEP 9: Thermal Cooling & Ventilation Priority ---
    if (preferences.priorities.cooling) {
      if (mattress.coolingRating >= 5) {
        const bonus = 8;
        score += bonus;
        derivationFactors.push({
          factor: 'Thermal Ventilation Boost',
          category: 'Thermal Dissipation',
          impact: bonus,
          formula: `CoolingPriority ∧ Rating(${mattress.coolingRating} == 5) → +${bonus} pts`,
          explanation: `Natural coir airflow channels and convoluted/gel layers dissipate body heat 2-3°C faster.`
        });
      }
    }

    // Clamping to a realistic range (62% to 99%)
    let matchPercentage = Math.round(score);
    matchPercentage = Math.max(62, Math.min(99, matchPercentage));

    return {
      mattress,
      matchPercentage,
      reasons: reasons.slice(0, 3),
      derivationFactors,
      targetFirmnessComputed: Number(targetFirmness.toFixed(1)),
      recommendedSize,
      motionIsolationNote,
      asymmetryCompensationNote
    };
  });

  // 1. Rank all models by match percentage descending
  const rankedByMatch = allResults.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    const target = a.targetFirmnessComputed;
    const diffA = Math.abs(a.mattress.firmness - target);
    const diffB = Math.abs(b.mattress.firmness - target);
    return diffA - diffB;
  });

  // 2. Select Top 4 highest matching models
  const top4 = rankedByMatch.slice(0, 4);
  const remaining = rankedByMatch.slice(4);

  // 3. Present the Top 4 in order of firmness (ascending: plush to firm)
  top4.sort((a, b) => a.mattress.firmness - b.mattress.firmness);

  return [...top4, ...remaining];
};

export default calculateRecommendations;
