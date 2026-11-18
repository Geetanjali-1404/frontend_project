import prisma from '../config/db.js';

export const getRouteOptimization = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    const destination = await prisma.destination.findUnique({
      where: { id: destinationId }
    });

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const flight = destination.routeFlight ? JSON.parse(destination.routeFlight) : {
      hub: 'Nearest Regional Airport',
      distance: '65 km',
      transferTime: '1 hr 45 min',
      transport: 'Prepaid Taxi / Cab'
    };

    const train = destination.routeTrain ? JSON.parse(destination.routeTrain) : {
      hub: 'Nearest Junction Railway Station',
      distance: '18 km',
      transferTime: '35 min',
      transport: 'Shared / Private Rickshaw'
    };

    const road = destination.routeRoad ? JSON.parse(destination.routeRoad) : {
      highway: 'National Highway Connectivity',
      roadCondition: 'Paved 2-lane scenic route',
      travelTime: '2 hours from nearest district headquarters',
      details: 'Daylight travel recommended through heritage countryside'
    };

    res.json({
      success: true,
      destination: {
        id: destination.id,
        name: destination.name,
        city: destination.city,
        state: destination.state,
        coords: { x: destination.mapCoordsX, y: destination.mapCoordsY }
      },
      routes: {
        flight: {
          hub: flight.hub,
          distance: flight.distance,
          duration: flight.transferTime,
          transport: 'Prepaid Cab / Taxi',
          details: flight.details
        },
        railway: {
          hub: train.hub,
          distance: train.distance,
          duration: train.transferTime,
          transport: 'Local Shuttle / E-Rickshaw',
          details: train.details
        },
        road: {
          highway: road.highway,
          condition: road.roadCondition,
          duration: road.travelTime,
          insiderTip: destination.insiderTip || 'Travel early morning to witness undisturbed rural life.'
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMultiStopRoute = async (req, res, next) => {
  try {
    const { destinationIds } = req.body; // array of IDs

    if (!destinationIds || !Array.isArray(destinationIds)) {
      return res.status(400).json({ success: false, message: 'Array of destination IDs is required' });
    }

    const destinations = await prisma.destination.findMany({
      where: { id: { in: destinationIds } }
    });

    const stops = destinations.map((dest, idx) => ({
      stopOrder: idx + 1,
      name: dest.name,
      city: dest.city,
      state: dest.state,
      estimatedStay: dest.duration,
      connectingDistance: idx === 0 ? 'Start' : '~140 km (3.5 hours by scenic express)'
    }));

    res.json({
      success: true,
      totalStops: stops.length,
      estimatedTripDuration: `${stops.length * 2} Days`,
      stops
    });
  } catch (err) {
    next(err);
  }
};
