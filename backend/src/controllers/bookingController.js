import prisma from '../config/db.js';
import { sendUserNotification } from '../services/socketService.js';

export const checkAvailability = async (req, res, next) => {
  try {
    const { destinationId, guideId, date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const existingBookings = await prisma.booking.findMany({
      where: {
        destinationId,
        guideId: guideId || undefined,
        startDate: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    const maxSlotsPerDay = 5; // Conscious non-mass tourism threshold
    const availableSlots = Math.max(0, maxSlotsPerDay - existingBookings.length);

    res.json({
      success: true,
      available: availableSlots > 0,
      availableSlots,
      maxSlotsPerDay,
      date: date
    });
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { destinationId, guideId, startDate, guests = 1, specialRequests } = req.body;
    const userId = req.user.id;

    const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const bookingRef = 'GB-' + Math.floor(100000 + Math.random() * 900000);
    const guestCount = parseInt(guests) || 1;
    const totalAmount = destination.startingPrice * guestCount;

    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        userId,
        destinationId,
        guideId: guideId || destination.guideId,
        startDate: new Date(startDate || Date.now() + 86400000 * 7),
        guests: guestCount,
        totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests
      },
      include: {
        destination: true,
        guide: { include: { user: true } },
        user: true
      }
    });

    // Notify user
    const userNotification = await prisma.notification.create({
      data: {
        userId,
        title: `Booking Created: ${bookingRef}`,
        message: `Your expedition to ${destination.name} has been initiated. Complete checkout to secure your spot with ${booking.guide?.user?.name || 'your native guide'}.`,
        type: 'BOOKING'
      }
    });
    sendUserNotification(userId, userNotification);

    // If guide exists, notify guide
    if (booking.guide?.userId) {
      const guideNotification = await prisma.notification.create({
        data: {
          userId: booking.guide.userId,
          title: `New Expedition Request: ${bookingRef}`,
          message: `${booking.user.name} has booked an expedition for ${guestCount} traveler(s) on ${new Date(booking.startDate).toLocaleDateString()}.`,
          type: 'GUIDE'
        }
      });
      sendUserNotification(booking.guide.userId, guideNotification);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let where = {};
    if (userRole === 'GUIDE' && req.user.guideProfile) {
      where = { guideId: req.user.guideProfile.id };
    } else if (userRole === 'ADMIN') {
      where = {}; // Admin sees all
    } else {
      where = { userId };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        destination: true,
        guide: { include: { user: true } },
        user: { select: { id: true, name: true, email: true, avatar: true } },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id }, { bookingRef: id }]
      },
      include: {
        destination: true,
        guide: { include: { user: true } },
        user: { select: { id: true, name: true, email: true, avatar: true } },
        payment: true
      }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, CONFIRMED, COMPLETED, CANCELLED

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { guide: true }
    });

    // If completed, increment guide completed tours
    if (status === 'COMPLETED' && booking.guideId) {
      await prisma.guideProfile.update({
        where: { id: booking.guideId },
        data: { completedTours: { increment: 1 } }
      });
    }

    // Push notification
    const notification = await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: `Expedition Status Update: ${status}`,
        message: `Your booking #${booking.bookingRef} is now ${status}.`,
        type: 'BOOKING'
      }
    });
    sendUserNotification(booking.userId, notification);

    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check cancellation policy: full refund if > 48h before startDate
    const now = new Date();
    const tourStart = new Date(booking.startDate);
    const diffHours = (tourStart - now) / (1000 * 60 * 60);

    let refundPercent = 100;
    if (diffHours < 24) {
      refundPercent = 50; // Late cancellation
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED', paymentStatus: 'REFUNDED' }
    });

    if (booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: { status: 'REFUNDED' }
      });
    }

    res.json({
      success: true,
      message: `Booking cancelled successfully. Refund: ${refundPercent}%. Reason: ${reason || 'User requested'}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
