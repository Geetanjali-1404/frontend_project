/**
 * Guide Score & Trust Engine
 * Formula:
 * Guide Score = (Rating × 70%) + (Completed Tours × 20%) + (Response Rate × 10%)
 */

export const calculateGuideScore = ({ rating = 5.0, completedTours = 0, responseRate = 100.0 }) => {
  // Normalize rating (0-5) to 0-100
  const normalizedRating = Math.min(Math.max(rating, 0), 5) * 20; // 5 -> 100

  // Normalize completed tours (50+ tours = 100%)
  const normalizedTours = Math.min((completedTours / 50) * 100, 100);

  // Response rate is already 0-100%
  const normalizedResponse = Math.min(Math.max(responseRate, 0), 100);

  const guideScore = (normalizedRating * 0.70) + (normalizedTours * 0.20) + (normalizedResponse * 0.10);
  return Number(guideScore.toFixed(1));
};

export const determineBadgeTier = ({ guideScore, completedTours, isIdVerified }) => {
  if (isIdVerified && guideScore >= 88 && completedTours >= 25) {
    return 'VERIFIED_EXPERT';
  }
  if (guideScore >= 78 && completedTours >= 12) {
    return 'GOLD';
  }
  if (guideScore >= 65 && completedTours >= 4) {
    return 'SILVER';
  }
  return 'BRONZE';
};
