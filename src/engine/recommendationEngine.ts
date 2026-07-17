import type { BodyProfile, Mattress, RecommendationResult } from '../types';
import mattressesData from '../data/mattresses.json';

const mattresses = mattressesData as Mattress[];

export interface UserPreferences {
  sleepingPosition: 'Back Sleeper' | 'Side Sleeper' | 'Stomach Sleeper' | 'Combination Sleeper';
  weightRange: 'Under 60kg' | '60-90kg' | 'Over 90kg';
  priorities: {
    cooling: boolean;
    motionIsolation: boolean;
    pressureRelief: boolean;
  };
}

/**
 * Executes the rule-based scoring engine to determine compatibility scores
 * between the calculated body profile, user choices, and the Hayleys Mattress catalog.
 * Returns an array of RecommendationResults sorted by match percentage.
 */
export const calculateRecommendations = (
  bodyProfile: BodyProfile,
  preferences: UserPreferences
): RecommendationResult[] => {
  return mattresses.map((mattress) => {
    let score = 100;
    const reasons: string[] = [];

    // --- RULE 1: Firmness Profile Mapping ---
    // Target firmness is derived from posture scan (spine deviation, body type)
    let targetFirmness = bodyProfile.calculatedFirmnessScore;
    
    // Adjust target firmness based on weight range
    if (preferences.weightRange === 'Over 90kg') {
      targetFirmness += 1; // Needs firmer support for heavy load points
    } else if (preferences.weightRange === 'Under 60kg') {
      targetFirmness -= 1; // Needs softer mattress to allow contours to sink
    }
    targetFirmness = Math.max(3, Math.min(9, targetFirmness));

    const firmnessDiff = Math.abs(mattress.firmness - targetFirmness);
    const firmnessPenalty = firmnessDiff * 10;
    score -= firmnessPenalty;

    if (firmnessDiff <= 1) {
      reasons.push(`The ${mattress.supportLevel} level matches your recommended firmware rating of ${targetFirmness}/10.`);
    } else if (mattress.firmness > targetFirmness) {
      reasons.push(`Offers firmer support than typical, suited for spine alignment corrections.`);
    } else {
      reasons.push(`Designed with plush comforting layers fitting pressure-spike reductions.`);
    }

    // --- RULE 2: Sleeping Position Alignment ---
    const preferredPos = preferences.sleepingPosition;
    if (mattress.idealPositions.includes(preferredPos)) {
      score += 5; // Bonus
      reasons.push(`Excellently suited for your standard sleeping profile as a ${preferredPos}.`);
    } else {
      score -= 15; // Penalty
    }

    // --- RULE 3: Body Type matching ---
    if (mattress.bodyTypeSuitability.includes(bodyProfile.bodyType)) {
      score += 5;
      reasons.push(`Specifically calibrated for individuals with a ${bodyProfile.bodyType} body outline.`);
    } else {
      score -= 8;
    }

    // --- RULE 4: Spine Support Boost ---
    // If spine alignment requires correction, favor orthopedic coir models (Spine Fit or Ortho Support)
    if (bodyProfile.spineAlignmentRating === 'Requires Support') {
      if (mattress.keyTechnologies.includes('Rubberized Coir') || mattress.id === 'hayleys-spine-fit') {
        score += 15;
        reasons.push(`Boosted match: The high-density Coir layers provide rigid support needed to align your spine.`);
      } else {
        score -= 10; // penalty for overly soft models
      }
    }

    // --- RULE 5: Pressure Relief Priority ---
    // If body has high shoulder/hip contours or side sleeping, boost pressure-relieving models (Memoire, Signature Spring)
    if (preferences.priorities.pressureRelief || bodyProfile.shoulderHipRatio > 1.1) {
      if (mattress.pressureReliefRating >= 4) {
        score += 10;
        reasons.push(`Fulfill priority: High pressure-relief index mitigates compression on shoulders and pelvis.`);
      }
    }

    // --- RULE 6: Thermal/Cooling Priority ---
    if (preferences.priorities.cooling) {
      if (mattress.coolingRating >= 4) {
        score += 8;
        reasons.push(`Fulfill priority: Natural materials and ventilation channels ensure high cooling ventilation.`);
      }
    }

    // --- RULE 7: Motion Isolation (for couples) ---
    if (preferences.priorities.motionIsolation) {
      if (mattress.motionIsolationRating >= 4) {
        score += 8;
        reasons.push(`Fulfill priority: Pocket springs or memory foam minimize motion transfer.`);
      }
    }

    // Clamp score to a realistic window (60% to 98% compatibility)
    let matchPercentage = Math.round(score);
    matchPercentage = Math.max(62, Math.min(98, matchPercentage));

    // Combine standard explanation block with dynamic reasons
    const finalReasons = [
      ...reasons.slice(0, 3), // limit to top 3 clear highlights
    ];

    return {
      mattress,
      matchPercentage,
      reasons: finalReasons
    };
  })
  .sort((a, b) => b.matchPercentage - a.matchPercentage); // Sort highest match first
};
export default calculateRecommendations;
