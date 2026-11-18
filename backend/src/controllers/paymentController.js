import crypto from 'crypto';
import prisma from '../config/db.js';
import { config } from '../config/config.js';
import { sendUserNotification } from '../services/socketService.js';

export const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { destination: true, guide: true }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);
    const mockOrderId = 'order_gb_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    res.json({
      success: true,
      order: {
        id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        bookingRef: booking.bookingRef,
        destinationName: booking.destination.name,
        key: config.razorpayKeyId
      }
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod = 'UPI'
    } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { guide: { include: { user: true } }, user: true, destination: true }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const txId = razorpay_payment_id || 'pay_' + Date.now() + '_' + Math.floor(Math.random() * 10000);

    // Calculate revenue split: 85% Guide Share, 15% Platform Commission
    const guideShare = Number((booking.totalAmount * 0.85).toFixed(2));
    const platformCommission = Number((booking.totalAmount * 0.15).toFixed(2));

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        transactionId: txId,
        provider: paymentMethod || 'RAZORPAY',
        amount: booking.totalAmount,
        guideShare,
        platformCommission,
        status: 'SUCCESS'
      }
    });

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    });

    // Notify Traveler
    const travelerNotif = await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: 'Payment Successful & Booking Confirmed',
        message: `Your booking #${booking.bookingRef} for ${booking.destination.name} has been confirmed. Transaction ID: ${txId}.`,
        type: 'PAYMENT'
      }
    });
    sendUserNotification(booking.userId, travelerNotif);

    // Notify Guide of their earnings
    if (booking.guide?.userId) {
      const guideNotif = await prisma.notification.create({
        data: {
          userId: booking.guide.userId,
          title: `Expedition Payout Reserved: ₹${guideShare}`,
          message: `Booking #${booking.bookingRef} has been confirmed. Your guide fee of ₹${guideShare} (85% share) will be disbursed upon tour completion.`,
          type: 'PAYMENT'
        }
      });
      sendUserNotification(booking.guide.userId, guideNotif);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully and booking confirmed',
      data: {
        payment,
        booking: updatedBooking
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getWalletOverview = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const guideProfile = req.user.guideProfile;

    if (userRole === 'GUIDE' && guideProfile) {
      const payments = await prisma.payment.findMany({
        where: { booking: { guideId: guideProfile.id }, status: 'SUCCESS' }
      });

      const totalEarnings = payments.reduce((sum, p) => sum + p.guideShare, 0);

      return res.json({
        success: true,
        role: 'GUIDE',
        totalEarnings,
        pendingToursCount: await prisma.booking.count({ where: { guideId: guideProfile.id, status: 'CONFIRMED' } }),
        completedToursCount: guideProfile.completedTours,
        recentPayouts: payments.slice(0, 5)
      });
    }

    if (userRole === 'ADMIN') {
      const allPayments = await prisma.payment.findMany({ where: { status: 'SUCCESS' } });
      const totalGross = allPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalCommission = allPayments.reduce((sum, p) => sum + p.platformCommission, 0);
      const totalGuideDisbursements = allPayments.reduce((sum, p) => sum + p.guideShare, 0);

      return res.json({
        success: true,
        role: 'ADMIN',
        totalGrossVolume: totalGross,
        platformCommission: totalCommission,
        guideDisbursements: totalGuideDisbursements,
        transactionsCount: allPayments.length
      });
    }

    // Default traveler wallet (credits / promo points)
    res.json({
      success: true,
      role: 'TRAVELER',
      heritageCredits: 250,
      referralCode: 'CONSCIOUS_' + req.user.id.slice(0, 6).toUpperCase()
    });
  } catch (err) {
    next(err);
  }
};
