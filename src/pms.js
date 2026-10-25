/**
 * MyVacAI — Mock PMS & Availability Engine
 * Simulates WebHotelier / Protel / Mews PMS + JCC / Viva Wallet Checkout
 * Preloaded with "Aphrodite Bay Resort & Spa" (Limassol / Paphos, Cyprus)
 */

const state = {
  property: {
    id: "aphrodite-bay-cy",
    name: "Aphrodite Bay Resort & Spa",
    location: "Amathus Coast, Limassol, Cyprus",
    stars: 5,
    currency: "EUR",
    symbol: "€",
    pmsProvider: "WebHotelier + Protel PMS",
    paymentGateway: "JCC Smart / Viva Wallet 3DS",
    phone: "+357 25 000 890",
    whatsapp: "+357 25 000 890",
    otaCommissionRate: 0.18 // 18% average OTA fee saved on direct bookings
  },

  rooms: [
    {
      id: "sea-view-deluxe",
      code: "SVD",
      name: "Mediterranean Sea View Deluxe",
      nameEl: "Deluxe Δωμάτιο με Θέα Θάλασσα",
      nameRu: "Делюкс с видом на Средиземное море",
      ratePerNight: 240,
      otaRatePerNight: 275,
      available: 4,
      totalInventory: 18,
      maxGuests: 2,
      sizeSqm: 38,
      perks: ["Champagne Breakfast Buffet", "Panoramic Sea Balcony", "Free Cancellation (48h)"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      description: "Floor-to-ceiling Mediterranean views, king bed, marble rain shower, and private sunset terrace."
    },
    {
      id: "swim-up-suite",
      code: "SUS",
      name: "Aegean Swim-Up Junior Suite",
      nameEl: "Junior Σουίτα Swim-Up με Πρόσβαση σε Πισίνα",
      nameRu: "Люкс Swim-Up с прямым выходом к бассейну",
      ratePerNight: 380,
      otaRatePerNight: 430,
      available: 2,
      totalInventory: 8,
      maxGuests: 3,
      sizeSqm: 54,
      perks: ["Direct Infinity Pool Access", "VIP Lounge & Breakfast", "Complimentary Late Checkout"],
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80",
      description: "Step directly from your private wooden sundeck into the heated saltwater infinity lagoon."
    },
    {
      id: "family-villa",
      code: "RPV",
      name: "Royal Cypress Private Pool Villa",
      nameEl: "Βίλα Royal Cypress με Ιδιωτική Πισίνα",
      nameRu: "Вилла Royal Cypress с частным бассейном",
      ratePerNight: 620,
      otaRatePerNight: 710,
      available: 1,
      totalInventory: 4,
      maxGuests: 5,
      sizeSqm: 115,
      perks: ["Private Heated Pool & Garden", "Dedicated Beach Cabana", "Complimentary Airport Transfer"],
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
      description: "Two-bedroom luxury coastal sanctuary with private infinity pool, outdoor dining pergola, and butler service."
    }
  ],

  conciergeAddons: [
    {
      id: "airport-transfer",
      name: "Larnaca / Paphos Airport Private Mercedes V-Class Transfer",
      shortName: "Airport Mercedes Transfer",
      price: 75,
      category: "Transfer",
      icon: "🚐",
      description: "Chauffeur meet & greet at LCA or PFO arrivals with flight tracking and chilled towels."
    },
    {
      id: "blue-lagoon-yacht",
      name: "Akamas & Blue Lagoon Sunset Catamaran Cruise (For 2)",
      shortName: "Blue Lagoon Yacht Cruise",
      price: 140,
      category: "Excursion",
      icon: "⛵",
      description: "4-hour afternoon cruise with snorkeling, Cypriot wine, and fresh fruit platter."
    },
    {
      id: "thalassa-spa",
      name: "Thalassa Couples Aromatherapy & Hammam Ritual (90 min)",
      shortName: "Thalassa Couples Spa",
      price: 190,
      category: "Wellness",
      icon: "💆‍♀️",
      description: "Full-body Cypriot olive oil & neroli massage followed by private sea-view thermal suite."
    },
    {
      id: "sunset-meze",
      name: "Cliffside Ouzeri & Cypriot Meze Chef's Table (VIP Hold)",
      shortName: "Cliffside Sunset Meze Table",
      price: 95,
      category: "Dining",
      icon: "🍷",
      description: "Front-row sunset table reservation with 14-course traditional seafood & halloumi meze."
    }
  ],

  integrations: [
    {
      id: "webhotelier",
      name: "WebHotelier Booking Engine",
      region: "Cyprus & Greece (#1 CRS)",
      category: "CRS / Availability",
      status: "connected",
      latencyMs: 112,
      description: "Real-time rate parity, promo code injection, and instant reservation push."
    },
    {
      id: "protel",
      name: "Protel / Planet PMS",
      region: "EU & Mediterranean",
      category: "Property Management",
      status: "connected",
      latencyMs: 145,
      description: "Two-way room inventory sync, guest profile lookup, and concierge folio posting."
    },
    {
      id: "jcc_cyprus",
      name: "JCC Smart Payment Gateway",
      region: "Cyprus Local Acquirer",
      category: "Payments (3DS2)",
      status: "connected",
      latencyMs: 94,
      description: "One-tap Apple Pay, Google Pay, and 3D Secure card links sent via WhatsApp."
    },
    {
      id: "viva_wallet",
      name: "Viva.com Smart Checkout",
      region: "Greece & Eurozone",
      category: "Payments (3DS2)",
      status: "connected",
      latencyMs: 108,
      description: "Instant IBAN settlement and local European payment methods on WhatsApp."
    },
    {
      id: "whatsapp_cloud",
      name: "Meta WhatsApp Business Cloud API",
      region: "Global",
      category: "Messaging & Voice Notes",
      status: "connected",
      latencyMs: 165,
      description: "Rich interactive room cards, voice note transcription, and automated templates."
    },
    {
      id: "vapi_voice",
      name: "Low-Latency SIP Voice AI (+357 / +30)",
      region: "Cyprus & Greece DID",
      category: "Telephony & ASR",
      status: "connected",
      latencyMs: 360,
      description: "Sub-500ms multilingual voice agent (English, Greek, Russian, German) with PBX failover."
    }
  ],

  metrics: {
    callsAnswered247: 318,
    whatsappThreadsActive: 94,
    handoffConversionRate: 68.4,
    directRevenueRecovered: 42850,
    otaCommissionSaved: 7713,
    conciergeUpsellRevenue: 6420,
    missedCallsPrevented: 127
  },

  bookings: [
    {
      reservationCode: "WH-CY-8941",
      guestName: "Andreas Georgiou",
      phone: "+357 99 310 442",
      language: "EL",
      channel: "Phone Call → WhatsApp 3DS",
      roomName: "Aegean Swim-Up Junior Suite",
      checkIn: "2026-11-06",
      checkOut: "2026-11-08",
      nights: 2,
      roomTotal: 760,
      addons: ["Cliffside Sunset Meze Table (€95)"],
      totalPaid: 855,
      otaSaved: 137,
      status: "CONFIRMED (Protel #40912)",
      createdAt: "14 mins ago"
    },
    {
      reservationCode: "WH-CY-8940",
      guestName: "Sophie & James Miller",
      phone: "+44 7700 900412",
      language: "EN",
      channel: "Phone Call → WhatsApp Apple Pay",
      roomName: "Mediterranean Sea View Deluxe",
      checkIn: "2026-11-12",
      checkOut: "2026-11-16",
      nights: 4,
      roomTotal: 960,
      addons: ["Airport Mercedes Transfer (€75)", "Blue Lagoon Yacht Cruise (€140)"],
      totalPaid: 1175,
      otaSaved: 173,
      status: "CONFIRMED (Protel #40911)",
      createdAt: "42 mins ago"
    },
    {
      reservationCode: "WH-CY-8939",
      guestName: "Elena Sokolova",
      phone: "+357 96 812 009",
      language: "RU",
      channel: "WhatsApp Voice Note → JCC Link",
      roomName: "Royal Cypress Private Pool Villa",
      checkIn: "2026-11-20",
      checkOut: "2026-11-23",
      nights: 3,
      roomTotal: 1860,
      addons: ["Thalassa Couples Spa (€190)"],
      totalPaid: 2050,
      otaSaved: 335,
      status: "CONFIRMED (Protel #40908)",
      createdAt: "2 hours ago"
    }
  ]
};

function checkAvailability({ roomId, nights = 3, guests = 2 } = {}) {
  const rooms = state.rooms.filter(r => r.available > 0 && r.maxGuests >= guests);
  const selected = roomId
    ? state.rooms.find(r => r.id === roomId) || rooms[0]
    : rooms[0] || state.rooms[0];

  const totalRate = selected.ratePerNight * nights;
  const otaTotal = selected.otaRatePerNight * nights;
  const savingsVsOta = otaTotal - totalRate;

  return {
    property: state.property.name,
    pmsSource: "WebHotelier Live API",
    queriedAt: new Date().toISOString(),
    nights,
    guests,
    recommendedRoom: {
      ...selected,
      nights,
      totalRate,
      otaTotal,
      savingsVsOta
    },
    allAvailableRooms: rooms.map(r => ({
      id: r.id,
      code: r.code,
      name: r.name,
      ratePerNight: r.ratePerNight,
      available: r.available,
      totalRate: r.ratePerNight * nights
    }))
  };
}

function updateRoomInventory(roomId, updates = {}) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return null;
  if (typeof updates.available === "number") {
    room.available = Math.max(0, Math.min(room.totalInventory, updates.available));
  }
  if (typeof updates.ratePerNight === "number" && updates.ratePerNight > 0) {
    room.ratePerNight = updates.ratePerNight;
    room.otaRatePerNight = Math.round(updates.ratePerNight * 1.15);
  }
  return room;
}

function toggleIntegration(integrationId) {
  const item = state.integrations.find(i => i.id === integrationId);
  if (!item) return null;
  item.status = item.status === "connected" ? "paused" : "connected";
  return item;
}

function recordConfirmedBooking({
  guestName,
  phone,
  language = "EN",
  roomId = "sea-view-deluxe",
  nights = 3,
  checkIn = "2026-11-06",
  checkOut = "2026-11-09",
  channel = "Phone Call → WhatsApp Apple Pay"
}) {
  const room = state.rooms.find(r => r.id === roomId) || state.rooms[0];
  if (room.available > 0) {
    room.available -= 1;
  }
  const roomTotal = room.ratePerNight * nights;
  const otaSaved = Math.round(roomTotal * state.property.otaCommissionRate);
  const reservationCode = `WH-CY-${Math.floor(8942 + Math.random() * 900)}`;
  const protelId = Math.floor(40915 + Math.random() * 500);

  const booking = {
    reservationCode,
    guestName: guestName || "Christos (Demo Guest)",
    phone,
    language,
    channel,
    roomId: room.id,
    roomName: room.name,
    checkIn,
    checkOut,
    nights,
    roomTotal,
    addons: [],
    totalPaid: roomTotal,
    otaSaved,
    status: `CONFIRMED (Protel #${protelId})`,
    createdAt: "Just now"
  };

  state.bookings.unshift(booking);
  state.metrics.callsAnswered247 += 1;
  state.metrics.directRevenueRecovered += roomTotal;
  state.metrics.otaCommissionSaved += otaSaved;

  return booking;
}

function addConciergeAddonToBooking({ reservationCode, addonId, phone }) {
  const addon = state.conciergeAddons.find(a => a.id === addonId);
  if (!addon) return null;

  let booking = state.bookings.find(
    b => (reservationCode && b.reservationCode === reservationCode) || (phone && b.phone === phone)
  );

  if (!booking) {
    booking = state.bookings[0];
  }

  const label = `${addon.shortName} (€${addon.price})`;
  if (!booking.addons.includes(label)) {
    booking.addons.push(label);
    booking.totalPaid += addon.price;
    state.metrics.conciergeUpsellRevenue += addon.price;
    state.metrics.directRevenueRecovered += addon.price;
  }

  return { booking, addon };
}

function getState() {
  return state;
}

module.exports = {
  getState,
  checkAvailability,
  updateRoomInventory,
  toggleIntegration,
  recordConfirmedBooking,
  addConciergeAddonToBooking
};
