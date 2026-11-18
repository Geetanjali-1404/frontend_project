import prisma from '../config/db.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'TRAVELER' } });
    const totalGuides = await prisma.guideProfile.count();
    const approvedGuides = await prisma.guideProfile.count({ where: { verificationStatus: 'APPROVED' } });
    const pendingGuides = await prisma.guideProfile.count({ where: { verificationStatus: 'PENDING' } });

    const totalBookings = await prisma.booking.count();
    const confirmedBookings = await prisma.booking.count({ where: { status: 'CONFIRMED' } });
    const completedBookings = await prisma.booking.count({ where: { status: 'COMPLETED' } });

    const payments = await prisma.payment.findMany({ where: { status: 'SUCCESS' } });
    const totalGrossRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const platformCommission = payments.reduce((sum, p) => sum + p.platformCommission, 0);
    const guidePayouts = payments.reduce((sum, p) => sum + p.guideShare, 0);

    const popularDestinations = await prisma.destination.findMany({
      include: { _count: { select: { bookings: true, reviews: true } } },
      orderBy: { bookings: { _count: 'desc' } },
      take: 5
    });

    const topGuides = await prisma.guideProfile.findMany({
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { guideScore: 'desc' },
      take: 5
    });

    res.json({
      success: true,
      metrics: {
        activeUsers: totalUsers,
        totalGuides,
        approvedGuides,
        pendingGuides,
        totalBookings,
        confirmedBookings,
        completedBookings,
        grossVolume: totalGrossRevenue,
        platformCommission,
        guidePayouts
      },
      popularDestinations: popularDestinations.map(d => ({
        id: d.id,
        name: d.name,
        city: d.city,
        bookingsCount: d._count.bookings,
        reviewsCount: d._count.reviews
      })),
      topGuides: topGuides.map(g => ({
        id: g.id,
        name: g.user.name,
        avatar: g.user.avatar,
        score: g.guideScore,
        badge: g.badgeTier,
        tours: g.completedTours
      }))
    });
  } catch (err) {
    next(err);
  }
};

export const getPendingGuides = async (req, res, next) => {
  try {
    const pendingGuides = await prisma.guideProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: pendingGuides.length, data: pendingGuides });
  } catch (err) {
    next(err);
  }
};

export const toggleUserBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked: !!isBlocked }
    });

    res.json({
      success: true,
      message: `User ${user.email} is now ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
