import prisma from '../config/db.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const { interests, budget, season, crowdPreference = 'peaceful', language } = req.query;

    const allDestinations = await prisma.destination.findMany({
      include: {
        guide: {
          include: {
            user: { select: { name: true, avatar: true } }
          }
        }
      }
    });

    // Score destinations
    const interestArray = interests ? interests.split(',').map(s => s.trim().toLowerCase()) : [];
    const maxBudget = budget ? parseFloat(budget) : null;

    const scored = allDestinations.map(dest => {
      let score = 50; // base score

      // 1. Category / Interest match
      if (interestArray.length > 0) {
        const destCat = dest.category.toLowerCase();
        const matchesInterest = interestArray.some(item => destCat.includes(item) || dest.name.toLowerCase().includes(item));
        if (matchesInterest) score += 30;
      }

      // 2. Budget match
      if (maxBudget) {
        if (dest.startingPrice <= maxBudget) {
          score += 20;
        } else if (dest.startingPrice <= maxBudget * 1.25) {
          score += 5;
        } else {
          score -= 15;
        }
      }

      // 3. Low Crowd Bonus
      if (dest.crowdPercent <= 25) {
        score += 15;
      } else if (dest.crowdPercent <= 50) {
        score += 5;
      }

      // 4. Season match
      if (season && dest.bestSeason.toLowerCase().includes(season.toLowerCase())) {
        score += 15;
      }

      // 5. Language match if guide is available
      if (language && dest.guide?.languages?.toLowerCase().includes(language.toLowerCase())) {
        score += 10;
      }

      return {
        ...dest,
        recommendationScore: score,
        matchReasons: [
          dest.crowdPercent <= 25 ? 'Zero Mass Tourism & Serene' : null,
          maxBudget && dest.startingPrice <= maxBudget ? 'Within Your Target Budget' : null,
          dest.guide ? `Verified Native Guide: ${dest.guide.user.name}` : null
        ].filter(Boolean)
      };
    });

    scored.sort((a, b) => b.recommendationScore - a.recommendationScore);

    res.json({
      success: true,
      query: { interests: interestArray, budget: maxBudget, season, crowdPreference },
      count: scored.length,
      recommendations: scored
    });
  } catch (err) {
    next(err);
  }
};
