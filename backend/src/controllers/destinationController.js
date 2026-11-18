import prisma from '../config/db.js';

export const getDestinations = async (req, res, next) => {
  try {
    const { city, category, crowdLevel, maxPrice, search } = req.query;

    const where = {};

    if (city) {
      where.city = { contains: city };
    }
    if (category) {
      where.category = { contains: category };
    }
    if (crowdLevel) {
      where.crowdLevel = crowdLevel;
    }
    if (maxPrice) {
      where.startingPrice = { lte: parseFloat(maxPrice) };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { tagline: { contains: search } },
        { city: { contains: search } },
        { state: { contains: search } }
      ];
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        guide: {
          include: {
            user: { select: { name: true, avatar: true } }
          }
        }
      },
      orderBy: { crowdPercent: 'asc' } // Peaceful low-crowd destinations first
    });

    const parsed = destinations.map(dest => ({
      ...dest,
      highlights: JSON.parse(dest.highlights || '[]'),
      routeFlight: dest.routeFlight ? JSON.parse(dest.routeFlight) : null,
      routeTrain: dest.routeTrain ? JSON.parse(dest.routeTrain) : null,
      routeRoad: dest.routeRoad ? JSON.parse(dest.routeRoad) : null
    }));

    res.json({ success: true, count: parsed.length, data: parsed });
  } catch (err) {
    next(err);
  }
};

export const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const destination = await prisma.destination.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }]
      },
      include: {
        guide: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } }
          }
        },
        reviews: {
          include: {
            user: { select: { name: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        crowdRecords: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({
      success: true,
      data: {
        ...destination,
        highlights: JSON.parse(destination.highlights || '[]'),
        routeFlight: destination.routeFlight ? JSON.parse(destination.routeFlight) : null,
        routeTrain: destination.routeTrain ? JSON.parse(destination.routeTrain) : null,
        routeRoad: destination.routeRoad ? JSON.parse(destination.routeRoad) : null
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createDestination = async (req, res, next) => {
  try {
    const data = req.body;

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const destination = await prisma.destination.create({
      data: {
        slug,
        name: data.name,
        tagline: data.tagline,
        city: data.city,
        state: data.state,
        region: data.region || 'Central India',
        category: data.category || 'Tribal Traditions',
        image: data.image || 'assets/images/destinations/bastar.jpg',
        crowdLevel: data.crowdLevel || 'peaceful',
        crowdPercent: parseInt(data.crowdPercent) || 15,
        crowdTrend: data.crowdTrend || 'Low visitor density',
        historicalBackstory: data.historicalBackstory || '',
        localCustoms: data.localCustoms || '',
        bestSeason: data.bestSeason || 'October to March',
        difficulty: data.difficulty || 'Easy',
        duration: data.duration || '2 Days / 1 Night',
        startingPrice: parseFloat(data.startingPrice) || 3500,
        mapCoordsX: parseFloat(data.mapCoordsX) || 50,
        mapCoordsY: parseFloat(data.mapCoordsY) || 50,
        highlights: JSON.stringify(data.highlights || []),
        routeFlight: data.routeFlight ? JSON.stringify(data.routeFlight) : null,
        routeTrain: data.routeTrain ? JSON.stringify(data.routeTrain) : null,
        routeRoad: data.routeRoad ? JSON.stringify(data.routeRoad) : null,
        insiderTip: data.insiderTip || '',
        guideId: data.guideId || null
      }
    });

    res.status(201).json({ success: true, message: 'Destination created', data: destination });
  } catch (err) {
    next(err);
  }
};
