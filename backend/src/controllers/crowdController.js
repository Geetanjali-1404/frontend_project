import prisma from '../config/db.js';
import { broadcastCrowdUpdate } from '../services/socketService.js';

const getLevelFromPercent = (pct) => {
  if (pct <= 25) return 'LOW';
  if (pct <= 55) return 'MEDIUM';
  if (pct <= 80) return 'HIGH';
  return 'VERY_HIGH';
};

export const getCrowdStatus = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
      include: {
        crowdRecords: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({
      success: true,
      data: {
        destinationId: destination.id,
        name: destination.name,
        crowdPercent: destination.crowdPercent,
        crowdLevel: destination.crowdLevel,
        crowdTrend: destination.crowdTrend,
        recentReports: destination.crowdRecords
      }
    });
  } catch (err) {
    next(err);
  }
};

export const reportCrowd = async (req, res, next) => {
  try {
    const { destinationId, crowdPercent, currentVisitors, source = 'GUIDE_REPORT', note } = req.body;

    const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const pct = parseInt(crowdPercent) || 20;
    const level = getLevelFromPercent(pct);
    const visitors = parseInt(currentVisitors) || Math.round(pct * 2.5);

    // Create crowd audit record
    const crowdRecord = await prisma.crowdData.create({
      data: {
        destinationId,
        currentVisitors: visitors,
        crowdPercent: pct,
        crowdLevel: level,
        source,
        reportedBy: req.user ? `${req.user.name} (${req.user.role})` : 'Sensor/Check-in'
      }
    });

    // Update current status on destination
    const updatedDest = await prisma.destination.update({
      where: { id: destinationId },
      data: {
        crowdPercent: pct,
        crowdLevel: level.toLowerCase(),
        crowdTrend: `${level} density • ${100 - pct}% fewer visitors than mainstream monuments`
      }
    });

    // Broadcast LIVE to all connected WebSockets
    broadcastCrowdUpdate(destinationId, {
      crowdPercent: pct,
      crowdLevel: level.toLowerCase(),
      currentVisitors: visitors,
      trend: updatedDest.crowdTrend
    });

    res.json({
      success: true,
      message: 'Crowd score updated and broadcasted live in real-time',
      data: {
        destinationId,
        crowdPercent: pct,
        crowdLevel: level,
        currentVisitors: visitors,
        record: crowdRecord
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getAllCrowdMeters = async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        city: true,
        state: true,
        crowdPercent: true,
        crowdLevel: true,
        crowdTrend: true
      },
      orderBy: { crowdPercent: 'asc' }
    });

    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
};
