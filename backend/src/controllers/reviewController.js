import prisma from '../config/db.js';
import { calculateGuideScore, determineBadgeTier } from '../services/trustScoreService.js';
import { summarizeReviews } from '../services/aiService.js';

export const addReview = async (req, res, next) => {
  try {
    const { destinationId, guideId, rating = 5, comment, bookingId, pros, cons } = req.body;
    const userId = req.user.id;

    if (!destinationId || !comment) {
      return res.status(400).json({ success: false, message: 'Destination and review comment are required' });
    }

    // Check verified booking status
    let isVerifiedStay = false;
    if (bookingId) {
      const verifiedBooking = await prisma.booking.findFirst({
        where: { id: bookingId, userId, status: { in: ['CONFIRMED', 'COMPLETED'] } }
      });
      if (verifiedBooking) isVerifiedStay = true;
    } else {
      // Check if user has ANY completed booking at this destination
      const completed = await prisma.booking.findFirst({
        where: { userId, destinationId, status: { in: ['CONFIRMED', 'COMPLETED'] } }
      });
      if (completed) isVerifiedStay = true;
    }

    const review = await prisma.review.create({
      data: {
        userId,
        destinationId,
        guideId,
        rating: Math.min(Math.max(parseInt(rating), 1), 5),
        comment,
        isVerifiedStay,
        pros: pros || 'Rich ancestral knowledge, respectful hospitality',
        cons: cons || 'Limited road lighting at night'
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });

    // Update Guide Score if guideId provided
    if (guideId) {
      const allGuideReviews = await prisma.review.findMany({ where: { guideId } });
      const avgRating = allGuideReviews.reduce((acc, r) => acc + r.rating, 0) / (allGuideReviews.length || 1);

      const guide = await prisma.guideProfile.findUnique({ where: { id: guideId } });
      if (guide) {
        const newScore = calculateGuideScore({
          rating: avgRating,
          completedTours: guide.completedTours,
          responseRate: guide.responseRate
        });
        const newBadge = determineBadgeTier({
          guideScore: newScore,
          completedTours: guide.completedTours,
          isIdVerified: guide.verificationStatus === 'APPROVED'
        });

        await prisma.guideProfile.update({
          where: { id: guideId },
          data: {
            rating: Number(avgRating.toFixed(2)),
            reviewCount: allGuideReviews.length,
            guideScore: newScore,
            badgeTier: newBadge
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Verified review published successfully',
      data: review
    });
  } catch (err) {
    next(err);
  }
};

export const replyToReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const review = await prisma.review.findUnique({
      where: { id },
      include: { guide: true }
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Verify requesting user is the guide or admin
    if (req.user.role !== 'ADMIN' && (!req.user.guideProfile || req.user.guideProfile.id !== review.guideId)) {
      return res.status(403).json({ success: false, message: 'Only the assigned guide or admin can respond to this review' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { guideReply: reply }
    });

    res.json({
      success: true,
      message: 'Guide response published',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

export const getDestinationReviews = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { destinationId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        guide: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const summary = summarizeReviews(reviews);

    res.json({
      success: true,
      count: reviews.length,
      aiSummary: summary,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};
