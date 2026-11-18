import prisma from '../config/db.js';
import { calculateGuideScore, determineBadgeTier } from '../services/trustScoreService.js';
import { sendUserNotification } from '../services/socketService.js';

export const applyAsGuide = async (req, res, next) => {
  try {
    const {
      name,
      email,
      title,
      city,
      state = 'India',
      bio,
      experienceYears = 1,
      hourlyRate = 1800,
      languages = 'Hindi, English',
      niches = 'Heritage & Architecture'
    } = req.body;

    const govIdFile = req.files?.governmentId?.[0]?.filename;
    const certFiles = (req.files?.certificates || []).map(f => f.filename).join(',');

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          role: 'GUIDE',
          avatar: 'assets/images/guides/guide-ramesh.jpg'
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'GUIDE' }
      });
    }

    const initialScore = calculateGuideScore({ rating: 5.0, completedTours: 0, responseRate: 100 });
    const initialBadge = determineBadgeTier({ guideScore: initialScore, completedTours: 0, isIdVerified: false });

    const guideProfile = await prisma.guideProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        title: title || 'Certified Regional Heritage Custodian',
        city,
        state,
        bio,
        experienceYears: parseInt(experienceYears) || 1,
        hourlyRate: parseFloat(hourlyRate) || 1800,
        languages: Array.isArray(languages) ? languages.join(', ') : languages,
        niches: Array.isArray(niches) ? niches.join(', ') : niches,
        governmentIdUrl: govIdFile ? `/uploads/${govIdFile}` : null,
        certificateUrls: certFiles || null,
        verificationStatus: 'PENDING',
        badgeTier: initialBadge,
        guideScore: initialScore
      },
      update: {
        title: title || undefined,
        city,
        state,
        bio,
        experienceYears: parseInt(experienceYears) || 1,
        hourlyRate: parseFloat(hourlyRate) || 1800,
        languages: Array.isArray(languages) ? languages.join(', ') : languages,
        niches: Array.isArray(niches) ? niches.join(', ') : niches,
        governmentIdUrl: govIdFile ? `/uploads/${govIdFile}` : undefined,
        certificateUrls: certFiles || undefined,
        verificationStatus: 'PENDING'
      }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Guide Application Received',
        message: 'Your credentials and Government ID have been submitted for review. Our curation team will verify your application within 24 hours.',
        type: 'GUIDE'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Guide application submitted successfully. Verification status: PENDING.',
      guideProfile
    });
  } catch (err) {
    next(err);
  }
};

export const getGuides = async (req, res, next) => {
  try {
    const { city, language, badge, status } = req.query;

    const where = {};
    if (status) {
      where.verificationStatus = status;
    } else {
      where.verificationStatus = 'APPROVED'; // default to approved for public
    }

    if (city) {
      where.city = { contains: city };
    }
    if (badge) {
      where.badgeTier = badge;
    }

    const guides = await prisma.guideProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        destinations: {
          select: { id: true, name: true, slug: true, city: true }
        }
      },
      orderBy: { guideScore: 'desc' }
    });

    res.json({ success: true, count: guides.length, data: guides });
  } catch (err) {
    next(err);
  }
};

export const getGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const guide = await prisma.guideProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        destinations: true,
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    // Recompute score dynamically
    const liveScore = calculateGuideScore({
      rating: guide.rating,
      completedTours: guide.completedTours,
      responseRate: guide.responseRate
    });

    res.json({ success: true, data: { ...guide, liveScore } });
  } catch (err) {
    next(err);
  }
};

export const updateGuideStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verificationStatus, badgeTier } = req.body;

    const guide = await prisma.guideProfile.findUnique({ where: { id }, include: { user: true } });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    const updated = await prisma.guideProfile.update({
      where: { id },
      data: {
        verificationStatus: verificationStatus || guide.verificationStatus,
        badgeTier: badgeTier || guide.badgeTier
      }
    });

    // Send push notification to guide
    const notification = await prisma.notification.create({
      data: {
        userId: guide.userId,
        title: `Guide Verification Status: ${verificationStatus}`,
        message: verificationStatus === 'APPROVED' 
          ? `Congratulations! Your guide profile has been APPROVED with ${updated.badgeTier} badge tier.`
          : `Your guide profile status was updated to ${verificationStatus}.`,
        type: 'GUIDE'
      }
    });

    sendUserNotification(guide.userId, notification);

    res.json({ success: true, message: 'Guide status updated', data: updated });
  } catch (err) {
    next(err);
  }
};
