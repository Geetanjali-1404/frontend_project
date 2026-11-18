import express from 'express';
import { authenticate, requireRole, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

// Controllers
import * as authController from '../controllers/authController.js';
import * as guideController from '../controllers/guideController.js';
import * as destinationController from '../controllers/destinationController.js';
import * as bookingController from '../controllers/bookingController.js';
import * as crowdController from '../controllers/crowdController.js';
import * as recommendationController from '../controllers/recommendationController.js';
import * as routeController from '../controllers/routeController.js';
import * as reviewController from '../controllers/reviewController.js';
import * as paymentController from '../controllers/paymentController.js';
import * as notificationController from '../controllers/notificationController.js';
import * as adminController from '../controllers/adminController.js';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

// --- 1. Authentication & Authorization ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.getMe);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.post('/auth/google', authController.googleAuth);

// --- 2 & 3. Guides & Verification System ---
router.post(
  '/guides/apply',
  upload.fields([
    { name: 'governmentId', maxCount: 1 },
    { name: 'certificates', maxCount: 5 }
  ]),
  guideController.applyAsGuide
);
router.get('/guides', guideController.getGuides);
router.get('/guides/:id', guideController.getGuideById);
router.patch('/guides/:id/status', authenticate, requireRole('ADMIN'), guideController.updateGuideStatus);

// --- Destinations ---
router.get('/destinations', destinationController.getDestinations);
router.get('/destinations/:id', destinationController.getDestinationById);
router.post('/destinations', authenticate, requireRole('ADMIN'), destinationController.createDestination);

// --- 4. Booking Management ---
router.get('/bookings/availability', bookingController.checkAvailability);
router.post('/bookings', authenticate, bookingController.createBooking);
router.get('/bookings', authenticate, bookingController.getUserBookings);
router.get('/bookings/:id', authenticate, bookingController.getBookingById);
router.patch('/bookings/:id/status', authenticate, bookingController.updateBookingStatus);
router.post('/bookings/:id/cancel', authenticate, bookingController.cancelBooking);

// --- 5. Real-Time Crowd Density Engine ---
router.get('/crowd', crowdController.getAllCrowdMeters);
router.get('/crowd/:destinationId', crowdController.getCrowdStatus);
router.post('/crowd/report', optionalAuth, crowdController.reportCrowd);

// --- 6. Recommendation Engine ---
router.get('/recommendations', recommendationController.getRecommendations);

// --- 7. Maps & Route Optimization ---
router.get('/routes/:destinationId', routeController.getRouteOptimization);
router.post('/routes/multi-stop', routeController.getMultiStopRoute);

// --- 8. Review & Trust System ---
router.post('/reviews', authenticate, reviewController.addReview);
router.post('/reviews/:id/reply', authenticate, reviewController.replyToReview);
router.get('/reviews/destination/:destinationId', reviewController.getDestinationReviews);

// --- 9. Payments ---
router.post('/payments/create-order', authenticate, paymentController.createOrder);
router.post('/payments/verify', authenticate, paymentController.verifyPayment);
router.get('/payments/wallet', authenticate, paymentController.getWalletOverview);

// --- 10. Notification Service ---
router.get('/notifications', authenticate, notificationController.getNotifications);
router.patch('/notifications/:id/read', authenticate, notificationController.markAsRead);

// --- 11. Admin Dashboard ---
router.get('/admin/metrics', authenticate, requireRole('ADMIN'), adminController.getDashboardMetrics);
router.get('/admin/guides/pending', authenticate, requireRole('ADMIN'), adminController.getPendingGuides);
router.patch('/admin/users/:id/block', authenticate, requireRole('ADMIN'), adminController.toggleUserBlock);

// --- 12. AI Features ---
router.post('/ai/chat', aiController.chatAssistant);
router.post('/ai/itinerary', aiController.generateItinerary);
router.get('/ai/summarize/:destinationId', aiController.summarizeDestinationReviews);

export default router;
