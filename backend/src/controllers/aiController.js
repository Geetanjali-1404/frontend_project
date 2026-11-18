import { handleAIAssistantChat, generateAIItinerary, summarizeReviews } from '../services/aiService.js';
import prisma from '../config/db.js';

export const chatAssistant = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const result = await handleAIAssistantChat({ message, history });

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const generateItinerary = async (req, res, next) => {
  try {
    const { destinationId, destinationName, budget, duration, interests } = req.body;

    let targetName = destinationName;
    if (destinationId && !targetName) {
      const dest = await prisma.destination.findUnique({ where: { id: destinationId } });
      if (dest) targetName = `${dest.name} (${dest.city}, ${dest.state})`;
    }

    const itinerary = await generateAIItinerary({
      destinationName: targetName,
      budget,
      duration,
      interests
    });

    res.json({
      success: true,
      data: itinerary
    });
  } catch (err) {
    next(err);
  }
};

export const summarizeDestinationReviews = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { destinationId }
    });

    const summary = summarizeReviews(reviews);

    res.json({
      success: true,
      data: summary
    });
  } catch (err) {
    next(err);
  }
};
