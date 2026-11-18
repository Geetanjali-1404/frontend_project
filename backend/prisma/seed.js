import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Clearing previous seed data ---');
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.crowdData.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.guideProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('--- Seeding Users (Admin & Traveler) ---');
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const travelerPassword = await bcrypt.hash('traveler123', salt);
  const guidePassword = await bcrypt.hash('guide123', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'GoBeyond Administrator',
      email: 'admin@gobeyond.travel',
      passwordHash: adminPassword,
      role: 'ADMIN',
      avatar: 'assets/images/travelers/traveler-anita.jpg',
      isVerified: true
    }
  });

  const traveler = await prisma.user.create({
    data: {
      name: 'Anita Sharma',
      email: 'anita@gobeyond.travel',
      passwordHash: travelerPassword,
      role: 'TRAVELER',
      avatar: 'assets/images/travelers/traveler-anita.jpg',
      isVerified: true
    }
  });

  const travelerMarcus = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'marcus@gmail.com',
      passwordHash: travelerPassword,
      role: 'TRAVELER',
      avatar: 'assets/images/travelers/traveler-marcus.jpg',
      isVerified: true
    }
  });

  console.log('--- Seeding Guides ---');
  const guideUsersData = [
    {
      name: 'Ramesh Mandavi',
      email: 'ramesh.bastar@gobeyond.travel',
      title: 'Indigenous Muria Historian & Dhokra Guild Master',
      city: 'Jagdalpur',
      state: 'Chhattisgarh',
      avatar: 'assets/images/guides/guide-ramesh.jpg',
      bio: 'Born in a village of 7th-generation metalsmiths in Bastar, Ramesh has spent his life documenting the oral epics of the Muria people and saving the ancient Dhokra casting technique.',
      experienceYears: 16,
      hourlyRate: 1900,
      rating: 4.98,
      completedTours: 210,
      responseRate: 99.0,
      badgeTier: 'VERIFIED_EXPERT',
      verificationStatus: 'APPROVED',
      languages: 'Gondi, Halbi, Hindi, English'
    },
    {
      name: 'Pronob Kalita',
      email: 'pronob.majuli@gobeyond.travel',
      title: 'Sattriya Mask Maker & Brahmaputra Naturalist',
      city: 'Majuli Island',
      state: 'Assam',
      avatar: 'assets/images/guides/guide-pronob.jpg',
      bio: 'Pronob grew up in Samaguri Satra, where theatrical masks of mythological deities are molded with river clay and bamboo.',
      experienceYears: 12,
      hourlyRate: 1750,
      rating: 4.95,
      completedTours: 165,
      responseRate: 98.0,
      badgeTier: 'VERIFIED_EXPERT',
      verificationStatus: 'APPROVED',
      languages: 'Assamese, Hindi, English, Bengali'
    },
    {
      name: 'Shankar Nayak',
      email: 'shankar.hampi@gobeyond.travel',
      title: 'Archaeologist & Native Tungabhadra Coracle Guide',
      city: 'Anegundi / Hampi',
      state: 'Karnataka',
      avatar: 'assets/images/guides/guide-shankar.jpg',
      bio: 'With a degree in Epigraphy and South Indian Archaeology, Shankar can read 14th-century Kannada inscriptions carved into Hampi boulders.',
      experienceYears: 18,
      hourlyRate: 2100,
      rating: 4.99,
      completedTours: 380,
      responseRate: 99.5,
      badgeTier: 'VERIFIED_EXPERT',
      verificationStatus: 'APPROVED',
      languages: 'Kannada, Telugu, Hindi, English'
    },
    {
      name: 'Tsering Dorje',
      email: 'tsering.spiti@gobeyond.travel',
      title: 'High-Altitude Native Monk-Scholar',
      city: 'Kaza & Tabo',
      state: 'Himachal Pradesh',
      avatar: 'assets/images/guides/guide-tsering.jpg',
      bio: 'Tsering studied for 8 years at the Tabo Monastery Institute of Higher Buddhist Philosophy before showing travelers the fragile alpine soul of Spiti Valley.',
      experienceYears: 14,
      hourlyRate: 2400,
      rating: 4.97,
      completedTours: 120,
      responseRate: 97.0,
      badgeTier: 'GOLD',
      verificationStatus: 'APPROVED',
      languages: 'Spiti Bhoti, Tibetan, Hindi, English'
    },
    {
      name: 'Meenakshi Raman',
      email: 'meenakshi.chettinad@gobeyond.travel',
      title: 'Chettiar Heritage Conservator & Gastronomy Historian',
      city: 'Karaikudi',
      state: 'Tamil Nadu',
      avatar: 'assets/images/guides/guide-meenakshi.jpg',
      bio: 'A native of Kanadukathan village, Meenakshi grew up in 100-room teak mansions and works to prevent historic family homes from demolition.',
      experienceYears: 11,
      hourlyRate: 1800,
      rating: 4.96,
      completedTours: 195,
      responseRate: 99.0,
      badgeTier: 'VERIFIED_EXPERT',
      verificationStatus: 'APPROVED',
      languages: 'Tamil, English, Hindi'
    },
    {
      name: 'Vijay Singh Shekhawat',
      email: 'vijay.nawalgarh@gobeyond.travel',
      title: 'Fresco Restoration Artisan & Shekhawati Storyteller',
      city: 'Nawalgarh',
      state: 'Rajasthan',
      avatar: 'assets/images/guides/guide-vijay.jpg',
      bio: 'Vijay preserves the open-air fresco havelis of Nawalgarh, teaching travelers ancient mineral pigment mixing.',
      experienceYears: 15,
      hourlyRate: 1700,
      rating: 4.94,
      completedTours: 140,
      responseRate: 96.5,
      badgeTier: 'GOLD',
      verificationStatus: 'APPROVED',
      languages: 'Rajasthani, Hindi, English'
    },
    {
      name: 'Karan Joshi',
      email: 'karan.pending@gobeyond.travel',
      title: 'Kumaon Pine Trail Naturalist',
      city: 'Almora',
      state: 'Uttarakhand',
      avatar: 'assets/images/guides/guide-anand.jpg',
      bio: 'Newly applied custodian seeking verification for sacred deodar groves in Kumaon.',
      experienceYears: 3,
      hourlyRate: 1200,
      rating: 5.0,
      completedTours: 2,
      responseRate: 95.0,
      badgeTier: 'BRONZE',
      verificationStatus: 'PENDING',
      governmentIdUrl: '/uploads/sample-aadhar-card.pdf',
      languages: 'Kumaoni, Hindi, English'
    }
  ];

  const guideProfilesMap = {};

  for (const g of guideUsersData) {
    const user = await prisma.user.create({
      data: {
        name: g.name,
        email: g.email,
        passwordHash: guidePassword,
        role: 'GUIDE',
        avatar: g.avatar,
        isVerified: g.verificationStatus === 'APPROVED'
      }
    });

    const profile = await prisma.guideProfile.create({
      data: {
        userId: user.id,
        title: g.title,
        city: g.city,
        state: g.state,
        bio: g.bio,
        experienceYears: g.experienceYears,
        hourlyRate: g.hourlyRate,
        rating: g.rating,
        completedTours: g.completedTours,
        responseRate: g.responseRate,
        badgeTier: g.badgeTier,
        verificationStatus: g.verificationStatus,
        languages: g.languages,
        governmentIdUrl: g.governmentIdUrl || null,
        guideScore: Number(((g.rating / 5 * 100 * 0.70) + (Math.min(g.completedTours / 50 * 100, 100) * 0.20) + (g.responseRate * 0.10)).toFixed(1))
      }
    });

    guideProfilesMap[g.city] = profile.id;
  }

  console.log('--- Seeding Destinations ---');
  const destinationsSeedData = [
    {
      id: 'bastar-tribal-crafts',
      slug: 'bastar-tribal-crafts',
      name: 'Bastar Tribal Heritage & Dhokra Artisans',
      tagline: '4,000-year-old lost-wax bell metal casting & sacred forest groves',
      city: 'Jagdalpur',
      state: 'Chhattisgarh',
      region: 'Central India',
      category: 'Tribal Traditions',
      image: 'assets/images/destinations/bastar.jpg',
      crowdLevel: 'peaceful',
      crowdPercent: 14,
      crowdTrend: 'Very quiet • 92% fewer crowds than mainstream monuments',
      historicalBackstory: 'Hidden in the dense Sal canopies of Dandakaranya, the Maria and Muria indigenous communities have preserved prehistoric lost-wax bronze casting untouched by industrialized production for four millennia.',
      localCustoms: 'Always ask permission before photographing village deities (Mata Gudi). Purchasing handicrafts directly from family forges supports sustainable local livelihoods.',
      bestSeason: 'October to March',
      difficulty: 'Easy',
      duration: '2 Days / 1 Night',
      startingPrice: 3800,
      mapCoordsX: 55,
      mapCoordsY: 56,
      highlights: JSON.stringify(['Interactive Dhokra Wax Modeling', 'Sacred Mata Gudi Forest Shrine', 'Chitrakote Horseshoe Falls Sunset', 'Organic Mahua Tea Tasting']),
      routeFlight: JSON.stringify({
        hub: 'Swami Vivekananda Airport, Raipur (RPR)',
        distance: '285 km',
        transferTime: '5.5 hours',
        transport: 'Prepaid Cab'
      }),
      routeTrain: JSON.stringify({
        hub: 'Jagdalpur Railway Station (JDB)',
        distance: '12 km',
        transferTime: '25 minutes',
        transport: 'E-Rickshaw'
      }),
      routeRoad: JSON.stringify({
        highway: 'NH-30 via Kanker Valley National Highway',
        roadCondition: 'Smooth 2-lane scenic forest road with mountain pass viewpoints',
        travelTime: '6 hours driving time from Raipur'
      }),
      insiderTip: 'Join our Sunday morning village Haat (market) walk at Tokapal at 8:30 AM before temperatures rise.',
      guideCity: 'Jagdalpur'
    },
    {
      id: 'majuli-river-satras',
      slug: 'majuli-river-satras',
      name: 'Majuli Island Neo-Vaishnavite Satras',
      tagline: 'Living monastery-islands, bamboo mask artistry & choral Borgeet chants',
      city: 'Majuli Island',
      state: 'Assam',
      region: 'Northeast India',
      category: 'Sacred Rituals',
      image: 'assets/images/destinations/majuli.jpg',
      crowdLevel: 'peaceful',
      crowdPercent: 19,
      crowdTrend: 'Serene morning river mist • 85% crowd reduction vs Guwahati',
      historicalBackstory: 'Cradled by the mighty Brahmaputra river, Majuli is the world\'s largest river island and the spiritual epicenter of 15th-century Saint Sankaradeva\'s Neo-Vaishnavite reform.',
      localCustoms: 'Remove footwear outside monastery prayer halls (Namghar). Dress conservatively covering shoulders and knees.',
      bestSeason: 'November to April',
      difficulty: 'Easy',
      duration: '3 Days / 2 Nights',
      startingPrice: 4600,
      mapCoordsX: 84,
      mapCoordsY: 32,
      highlights: JSON.stringify(['Handmade Bamboo Mask Crafting', 'Monastic Evening Prayer with Cymbals', 'Mishing Tribal Stilt Village Dinner', 'Brahmaputra Sunset Canoe Ride']),
      routeFlight: JSON.stringify({
        hub: 'Jorhat Airport (JRH) / Dibrugarh (DIB)',
        distance: '22 km to Nimati Ghat + 1 hr ferry',
        transferTime: '1.5 hours total',
        transport: 'Cab + Ro-Ro Ferry'
      }),
      routeTrain: JSON.stringify({
        hub: 'Jorhat Town Railway Station (JTTN)',
        distance: '18 km to Nimati Ferry Ghat',
        transferTime: '40 minutes by cab',
        transport: 'Cab'
      }),
      routeRoad: JSON.stringify({
        highway: 'Brahmaputra Ferry Crossing via Nimati Ghat',
        roadCondition: 'Ro-Ro Modern Ferry allows vehicle boarding',
        travelTime: '1 hour scenic boat ride across the Brahmaputra'
      }),
      insiderTip: 'Visit Samaguri Satra where 83-year-old guru molds masks out of clay, cow dung, and bamboo frames.',
      guideCity: 'Majuli Island'
    },
    {
      id: 'hampi-anegundi-boulders',
      slug: 'hampi-anegundi-boulders',
      name: 'Anegundi & Northern Boulder Ruins',
      tagline: 'The pre-Vijayanagara mythological kingdom across the Tungabhadra',
      city: 'Anegundi / Hampi',
      state: 'Karnataka',
      region: 'South India',
      category: 'Ancient Architecture',
      image: 'assets/images/destinations/hampi.jpg',
      crowdLevel: 'peaceful',
      crowdPercent: 22,
      crowdTrend: 'Escape 90% of tourist crowds flocking to the southern bazaar',
      historicalBackstory: 'While thousands crowd the southern stone chariot at Hampi, cross the river in a round wicker coracle boat to Anegundi—a 5,000-year-old settlement older than the Vijayanagara Empire itself.',
      localCustoms: 'Respect ongoing rituals at Durga Temple; avoid climbing onto ruined monolithic carved pillars.',
      bestSeason: 'October to March',
      difficulty: 'Moderate',
      duration: 'Full Day (7 hrs)',
      startingPrice: 2900,
      mapCoordsX: 39,
      mapCoordsY: 69,
      highlights: JSON.stringify(['Hand-paddled Coracle Boat Ride', 'Prehistoric Cave Paintings', 'Banana Fiber Craft Workshop', 'Sunset over Vijayanagara Aqueducts']),
      routeFlight: JSON.stringify({
        hub: 'Jindal Vidyanagar Airport, Bellary (VDY) / Hubli (HBX)',
        distance: '38 km (Vidyanagar) / 145 km (Hubli)',
        transferTime: '45 minutes from VDY',
        transport: 'Cab'
      }),
      routeTrain: JSON.stringify({
        hub: 'Hosapete Junction (HPT)',
        distance: '13 km to Hampi / 24 km to Anegundi',
        transferTime: '30 minutes by private auto or cab',
        transport: 'Auto / Cab'
      }),
      routeRoad: JSON.stringify({
        highway: 'NH-50 & NH-67 Expressway',
        roadCondition: 'Four-lane national highway until Hosapete',
        travelTime: '6 hours driving time from Bengaluru'
      }),
      insiderTip: 'Ascend the 575 steps of Anjanadri Hill at 5:15 AM for a sunrise silhouette over 20 kilometers of ruined palaces.',
      guideCity: 'Anegundi / Hampi'
    },
    {
      id: 'spiti-dhankar-monasteries',
      slug: 'spiti-dhankar-monasteries',
      name: 'Spiti Valley Mud Fortresses & Tabo Frescoes',
      tagline: '1,000-year-old Ajanta of the Himalayas perched on 3,890m cliffs',
      city: 'Kaza & Tabo',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      category: 'Ancient Architecture',
      image: 'assets/images/destinations/spiti.jpg',
      crowdLevel: 'peaceful',
      crowdPercent: 11,
      crowdTrend: 'Deep alpine tranquility • 98% lower footprint than Manali',
      historicalBackstory: 'Founded in 996 CE, Tabo Gompa holds pristine mud-sculpted life-size Bodhisattvas and mineral-pigment frescoes untouched by modern restoration.',
      localCustoms: 'Walk around monasteries, chortens, and mani stone walls strictly in a clockwise direction. No flash photography.',
      bestSeason: 'May to October',
      difficulty: 'Challenging',
      duration: '4 Days / 3 Nights',
      startingPrice: 8500,
      mapCoordsX: 41,
      mapCoordsY: 19,
      highlights: JSON.stringify(['1,000-Year-Old Tabo Clay Murals', 'Dhankar Cliff Hanging Gompa', 'Fossil Hunting in Langza', 'Milky Way Stargazing at 4,000m']),
      insiderTip: 'Drink sea buckthorn herbal tea with monks to prevent altitude sickness naturally.',
      guideCity: 'Kaza & Tabo'
    },
    {
      id: 'chettinad-mansions-culinary',
      slug: 'chettinad-mansions-culinary',
      name: 'Chettinad Heritage Mansions & Athangudi Tile Guilds',
      tagline: '1,000-window teak palaces, handmade floral tiles & fiery culinary masterclasses',
      city: 'Karaikudi',
      state: 'Tamil Nadu',
      region: 'South India',
      category: 'Living Crafts',
      image: 'assets/images/destinations/chettinad.jpg',
      crowdLevel: 'peaceful',
      crowdPercent: 18,
      crowdTrend: 'Gentle heritage pace • 88% fewer tourists than Madurai',
      historicalBackstory: 'In the 19th and early 20th centuries, the Nattukottai Chettiars built monumental architectural estates blending Dravidian stone carving with European stained glass and Burmese teak.',
      localCustoms: 'Eating on banana leaves is an art: fold the leaf upward away from you to express satisfaction with the meal.',
      bestSeason: 'October to March',
      difficulty: 'Easy',
      duration: '2 Days / 1 Night',
      startingPrice: 4200,
      mapCoordsX: 44,
      mapCoordsY: 79,
      highlights: JSON.stringify(['1912 Burmese Teak Mansion Tour', 'Athangudi Handmade Tile Studio', 'Traditional 7-Course Spice Lunch', 'Antique Brass & Teak Scavenger Walk']),
      insiderTip: 'Visit the tile workshop at 10 AM to watch artisans pour colored liquid cement into brass stencils.',
      guideCity: 'Karaikudi'
    },
    {
      id: 'shekhawati-painted-havelis',
      slug: 'shekhawati-painted-havelis',
      name: 'Shekhawati Open-Air Fresco Havelis',
      tagline: 'The world\'s largest open-air art gallery with 400-year-old painted courtyards',
      city: 'Nawalgarh',
      state: 'Rajasthan',
      region: 'North India',
      category: 'Living Crafts',
      image: 'assets/images/destinations/nawalgarh.jpg',
      crowdLevel: 'peaceful',
      crowdPercent: 16,
      crowdTrend: 'Quiet rustic lanes • 91% crowd reduction vs Jaipur monuments',
      historicalBackstory: 'Along the historic Silk Route caravan trails, Marwari merchants commissioned painters (Chiteras) to cover every inch of their massive havelis with intricate murals of mythology, steam locomotives, and gramophones.',
      localCustoms: 'Many havelis are still private residences; greet the elderly family custodians with a warm "Khamma Ghani".',
      bestSeason: 'October to March',
      difficulty: 'Easy',
      duration: '2 Days / 1 Night',
      startingPrice: 3200,
      mapCoordsX: 38,
      mapCoordsY: 34,
      highlights: JSON.stringify(['Anandi Lal Poddar Haveli Frescoes', 'Natural Mineral Pigment Workshop', 'Camel-Cart Sunset Dune Ride', 'Traditional Ker Sangri Thali Dinner']),
      insiderTip: 'Bring a high-CRI flashlight to illuminate intricate gold-leaf ceiling motifs inside the mirror rooms.',
      guideCity: 'Nawalgarh'
    }
  ];

  const createdDestinations = [];

  for (const d of destinationsSeedData) {
    const guideId = guideProfilesMap[d.guideCity] || null;

    const dest = await prisma.destination.create({
      data: {
        id: d.id,
        slug: d.slug,
        name: d.name,
        tagline: d.tagline,
        city: d.city,
        state: d.state,
        region: d.region,
        category: d.category,
        image: d.image,
        crowdLevel: d.crowdLevel,
        crowdPercent: d.crowdPercent,
        crowdTrend: d.crowdTrend,
        historicalBackstory: d.historicalBackstory,
        localCustoms: d.localCustoms,
        bestSeason: d.bestSeason,
        difficulty: d.difficulty,
        duration: d.duration,
        startingPrice: d.startingPrice,
        mapCoordsX: d.mapCoordsX,
        mapCoordsY: d.mapCoordsY,
        highlights: d.highlights,
        routeFlight: d.routeFlight || null,
        routeTrain: d.routeTrain || null,
        routeRoad: d.routeRoad || null,
        insiderTip: d.insiderTip || null,
        guideId: guideId
      }
    });

    createdDestinations.push(dest);

    // Seed Initial Crowd Data
    await prisma.crowdData.create({
      data: {
        destinationId: dest.id,
        currentVisitors: Math.round(dest.crowdPercent * 2.2),
        crowdPercent: dest.crowdPercent,
        crowdLevel: dest.crowdPercent <= 25 ? 'LOW' : 'MEDIUM',
        source: 'GUIDE_REPORT',
        reportedBy: 'Native Guide Guild Check-in'
      }
    });
  }

  console.log('--- Seeding Bookings & Payments ---');
  const bastarDest = createdDestinations.find(d => d.id === 'bastar-tribal-crafts');
  const rameshGuide = guideProfilesMap['Jagdalpur'];

  if (bastarDest && rameshGuide) {
    const booking1 = await prisma.booking.create({
      data: {
        bookingRef: 'GB-742910',
        userId: traveler.id,
        destinationId: bastarDest.id,
        guideId: rameshGuide,
        startDate: new Date(Date.now() + 86400000 * 5),
        guests: 2,
        totalAmount: 7600,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        specialRequests: 'Interested in hands-on lost-wax metal model casting.'
      }
    });

    const payment1 = await prisma.payment.create({
      data: {
        bookingId: booking1.id,
        transactionId: 'pay_GB_razorpay_8910248',
        provider: 'UPI',
        amount: 7600,
        guideShare: 6460, // 85%
        platformCommission: 1140, // 15%
        status: 'SUCCESS'
      }
    });

    // Seed Verified Review
    await prisma.review.create({
      data: {
        userId: traveler.id,
        destinationId: bastarDest.id,
        guideId: rameshGuide,
        rating: 5,
        comment: 'Ramesh is a true living encyclopedia of Bastar. We sat inside the family forge and poured molten bell metal into clay molds. No crowds, just pure authenticity.',
        isVerifiedStay: true,
        pros: 'Deep cultural hospitality, zero commercial tourist rush, delicious organic forest honey',
        cons: 'Limited mobile connectivity in village courtyards',
        guideReply: 'Namaste Anita ji! It was our family honour to host you. The ancestral spirits of Dandakaranya bless your conscious travels.'
      }
    });

    // Seed Notification
    await prisma.notification.create({
      data: {
        userId: traveler.id,
        title: 'Booking Confirmed: GB-742910',
        message: 'Your expedition to Bastar Tribal Heritage has been confirmed. Guide Ramesh Mandavi has prepared your schedule.',
        type: 'BOOKING'
      }
    });
  }

  console.log('=======================================================');
  console.log('  GO BEYOND SEED COMPLETED SUCCESSFULLY!');
  console.log('  Admin Login: admin@gobeyond.travel / admin123');
  console.log('  Traveler Login: anita@gobeyond.travel / traveler123');
  console.log('  Destinations: 6 seeded with full route & crowd data');
  console.log('  Guides: 7 registered (6 approved, 1 pending review)');
  console.log('=======================================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
