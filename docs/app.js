/**
 * MyVacAI — Interactive Frontend & Client-Side Autonomous Fallback Engine
 * Works seamlessly against BOTH the Node.js `/api/*` server AND 100% client-side
 * on static custom domains (e.g. GitHub Pages / Cloudflare Pages at https://myvacai.com).
 */

const STORAGE_KEY = "myvacai_live_state_v1";

function createDefaultPmsState() {
  return {
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
      otaCommissionRate: 0.18
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
}

/**
 * Client-side autonomous engine mirroring src/pms.js + src/agent.js
 */
const LocalMyVacAIEngine = {
  pms: null,
  session: null,
  executionLogs: [],

  init() {
    if (this.pms && this.session) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.pms && parsed.session && Array.isArray(parsed.executionLogs)) {
          this.pms = parsed.pms;
          this.session = parsed.session;
          this.executionLogs = parsed.executionLogs;
          return;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
    this.pms = createDefaultPmsState();
    this.executionLogs = [];
    this.seedInitialSession();
    this.persist();
  },

  persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          pms: this.pms,
          session: this.session,
          executionLogs: this.executionLogs
        })
      );
    } catch (e) {
      // Ignore storage quota errors
    }
  },

  addExecutionLog(entry) {
    const item = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      ...entry
    };
    this.executionLogs.unshift(item);
    if (this.executionLogs.length > 50) this.executionLogs.pop();
    return item;
  },

  checkAvailability({ roomId, nights = 3, guests = 2 } = {}) {
    const rooms = this.pms.rooms.filter(r => r.available > 0 && r.maxGuests >= guests);
    const selected = roomId
      ? this.pms.rooms.find(r => r.id === roomId) || rooms[0] || this.pms.rooms[0]
      : rooms[0] || this.pms.rooms[0];

    const totalRate = selected.ratePerNight * nights;
    const otaTotal = selected.otaRatePerNight * nights;
    const savingsVsOta = otaTotal - totalRate;

    return {
      recommendedRoom: {
        ...selected,
        nights,
        totalRate,
        otaTotal,
        savingsVsOta
      }
    };
  },

  seedInitialSession() {
    const phone = "+357 99 482 190";
    this.executionLogs = [];
    const avail = this.checkAvailability({ roomId: "sea-view-deluxe", nights: 3 });
    const room = avail.recommendedRoom;

    this.session = {
      sessionId: `sess_${phone.replace(/[^0-9]/g, "")}`,
      phone,
      guestName: "Christos T.",
      language: "EN",
      callStatus: "ACTIVE_CALL",
      selectedRoomId: room.id,
      nights: 3,
      checkIn: "Fri, 6 Nov 2026",
      checkOut: "Mon, 9 Nov 2026",
      paymentStatus: "PENDING_3DS",
      reservationCode: null,
      selectedAddons: [],
      callTranscript: [
        {
          role: "ai",
          speaker: "MyVacAI Receptionist (Elena)",
          lang: "EN",
          text: "Kalimera! Thank you for calling Aphrodite Bay Resort & Spa in Limassol. How may I help you plan your stay?",
          time: "00:02"
        },
        {
          role: "guest",
          speaker: "Caller (+357 99 482 190)",
          lang: "EN",
          text: "Hi! Do you have a Sea View room for 3 nights next weekend, November 6th to 9th? And can you send me the link on WhatsApp?",
          time: "00:08"
        },
        {
          role: "ai",
          speaker: "MyVacAI Receptionist (Elena)",
          lang: "EN",
          text: `Yes! We have ${room.available} ${room.name} rooms open for Nov 6–9 at our direct rate of €${room.ratePerNight}/night (€${room.totalRate} total including champagne breakfast — €${room.savingsVsOta} less than Booking.com). I just sent the room photos and a 1-tap Apple Pay / JCC checkout card to your WhatsApp right now while we're on the line!`,
          time: "00:15"
        }
      ],
      whatsappMessages: [
        {
          id: "wa-1",
          sender: "ai",
          type: "room_quote_card",
          time: "17:24",
          title: `✨ ${room.name}`,
          subtitle: `Fri 6 Nov – Mon 9 Nov 2026 (3 Nights • 2 Adults)`,
          image: room.image,
          perks: room.perks,
          ratePerNight: room.ratePerNight,
          totalRate: room.totalRate,
          otaTotal: room.otaTotal,
          savingsVsOta: room.savingsVsOta,
          paymentStatus: "PENDING_3DS",
          text: `Hi Christos T.! Here is the live quote from our front desk call. Tap below to lock in your direct rate with 1-Tap Apple Pay or JCC Smart 3DS (no card numbers needed over the phone).`
        }
      ]
    };

    this.addExecutionLog({
      stage: "VOICE_ASR_INTENT",
      latencyMs: 310,
      badge: "Voice → Intent",
      status: "success",
      summary: "Caller (+357 99 482 190) requested Sea View room (3 nights, Nov 6–9) + WhatsApp checkout link.",
      payload: {
        caller: "+357 99 482 190",
        detectedLanguage: "en-CY",
        intent: "CHECK_AVAILABILITY_AND_WHATSAPP_HANDOFF",
        entities: { roomType: "sea-view-deluxe", checkIn: "2026-11-06", nights: 3, guests: 2 }
      }
    });

    this.addExecutionLog({
      stage: "PMS_WEBHOTELIER_LOOKUP",
      latencyMs: 112,
      badge: "WebHotelier CRS",
      status: "success",
      summary: `Live inventory verified: ${room.available}x ${room.name} available @ €${room.ratePerNight}/night (€${room.totalRate} total vs €${room.otaTotal} OTA).`,
      payload: {
        pms: "WebHotelier + Protel PMS",
        roomCode: room.code,
        availableUnits: room.available,
        directTotalEUR: room.totalRate,
        otaComparisonEUR: room.otaTotal,
        directPerks: room.perks
      }
    });

    this.addExecutionLog({
      stage: "WHATSAPP_3DS_HANDOFF",
      latencyMs: 184,
      badge: "WhatsApp + JCC 3DS",
      status: "success",
      summary: "Dispatched interactive WhatsApp room card + PCI/3DS2 Apple Pay & JCC checkout link while caller is still on the line.",
      payload: {
        channel: "Meta WhatsApp Cloud API",
        recipient: "+357 99 482 190",
        template: "in_call_instant_checkout_v2",
        gateway: "JCC Smart / Viva Wallet 3DS2",
        amountEUR: room.totalRate
      }
    });

    this.persist();
    return this.session;
  },

  runScenario({ scenarioKey = "en_seaview", phone = "+357 99 482 190", customMessage = "", channel = "voice" }) {
    this.init();
    const session = this.session;
    session.phone = phone;
    session.paymentStatus = "PENDING_3DS";
    session.reservationCode = null;
    session.selectedAddons = [];

    if (scenarioKey === "el_swimup") {
      session.language = "EL";
      session.guestName = "Χρήστος Τ.";
      session.selectedRoomId = "swim-up-suite";
      session.nights = 2;
      session.checkIn = "Παρ, 13 Νοε 2026";
      session.checkOut = "Κυρ, 15 Νοε 2026";
      session.callStatus = "ACTIVE_CALL";

      const avail = this.checkAvailability({ roomId: "swim-up-suite", nights: 2 });
      const room = avail.recommendedRoom;

      session.callTranscript = [
        {
          role: "ai",
          speaker: "MyVacAI Υποδοχή (Ελένη)",
          lang: "EL",
          text: "Καλησπέρα σας! Καλώς ήρθατε στο Aphrodite Bay Resort & Spa στη Λεμεσό. Πώς μπορώ να σας εξυπηρετήσω;",
          time: "00:02"
        },
        {
          role: "guest",
          speaker: `Κλήση (${phone})`,
          lang: "EL",
          text: "Καλησπέρα! Έχετε διαθέσιμη σουίτα Swim-Up με πρόσβαση σε πισίνα για 2 βράδια, 13 με 15 Νοεμβρίου; Στείλτε μου την προσφορά στο WhatsApp.",
          time: "00:07"
        },
        {
          role: "ai",
          speaker: "MyVacAI Υποδοχή (Ελένη)",
          lang: "EL",
          text: `Βεβαίως! Έχουμε ${room.available} διαθέσιμες ${room.nameEl} στα €${room.ratePerNight}/βράδυ (€${room.totalRate} συνολικά με πρωινό — κερδίζετε €${room.savingsVsOta} σε σχέση με το Booking.com). Σας έστειλα μόλις τώρα στο WhatsApp φωτογραφίες και σύνδεσμο πληρωμής JCC / Apple Pay!`,
          time: "00:14"
        }
      ];

      session.whatsappMessages = [
        {
          id: `wa-${Date.now()}`,
          sender: "ai",
          type: "room_quote_card",
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          title: `✨ ${room.nameEl}`,
          subtitle: `13–15 Νοε 2026 (2 Βράδια • 2 Ενήλικες)`,
          image: room.image,
          perks: room.perks,
          ratePerNight: room.ratePerNight,
          totalRate: room.totalRate,
          otaTotal: room.otaTotal,
          savingsVsOta: room.savingsVsOta,
          paymentStatus: "PENDING_3DS",
          text: `Γεια σας ${session.guestName}! Αυτή είναι η ζωντανή προσφορά από την τηλεφωνική μας κλήση. Ολοκληρώστε την κράτηση με 1 κλικ μέσω Apple Pay, JCC ή Viva Wallet:`
        }
      ];

      this.addExecutionLog({
        stage: "VOICE_ASR_GREEK",
        latencyMs: 340,
        badge: "Greek ASR (el-CY)",
        status: "success",
        summary: "Detected Greek speaker requesting Swim-Up Junior Suite for 2 nights (13–15 Nov).",
        payload: { language: "el-CY", roomId: "swim-up-suite", nights: 2, totalEUR: room.totalRate }
      });

      this.addExecutionLog({
        stage: "WHATSAPP_HANDOFF_EL",
        latencyMs: 172,
        badge: "WhatsApp + Viva/JCC",
        status: "success",
        summary: `Sent Greek WhatsApp card + €${room.totalRate} 3DS payment link while caller remains on line.`,
        payload: { recipient: phone, roomCode: room.code, amountEUR: room.totalRate }
      });

      this.persist();
      return session;
    }

    if (scenarioKey === "wa_voicenote_villa") {
      session.language = "EN";
      session.guestName = "Christos T.";
      session.selectedRoomId = "family-villa";
      session.nights = 3;
      session.checkIn = "Fri, 20 Nov 2026";
      session.checkOut = "Mon, 23 Nov 2026";
      session.callStatus = "WHATSAPP_VOICE_NOTE";

      const avail = this.checkAvailability({ roomId: "family-villa", nights: 3 });
      const room = avail.recommendedRoom;

      session.callTranscript = [
        {
          role: "guest",
          speaker: "WhatsApp Audio Note (0:09)",
          lang: "EN",
          text: "🎙️ [Voice Note Transcribed]: \"Hi! We're a family of 4 flying into Larnaca on November 20th for 3 nights. Do you have your Private Pool Villa free, and can you arrange an airport Mercedes van?\"",
          time: "Voice Note"
        },
        {
          role: "ai",
          speaker: "MyVacAI Unified Brain",
          lang: "EN",
          text: `Transcribed WhatsApp audio note in 290ms → Checked WebHotelier for Royal Cypress Private Pool Villa (${room.available} unit left @ €${room.ratePerNight}/night) → Prepared instant checkout card + Airport Mercedes V-Class add-on.`,
          time: "Auto-Reply"
        }
      ];

      session.whatsappMessages = [
        {
          id: `wa-vn-${Date.now()}`,
          sender: "guest",
          type: "voice_note",
          duration: "0:09",
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          transcript: "Hi! We're a family of 4 flying into Larnaca on November 20th for 3 nights. Do you have your Private Pool Villa free, and can you arrange an airport Mercedes van?"
        },
        {
          id: `wa-quote-${Date.now() + 1}`,
          sender: "ai",
          type: "room_quote_card",
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          title: `🏡 ${room.name}`,
          subtitle: `20–23 Nov 2026 (3 Nights • Family of 4)`,
          image: room.image,
          perks: room.perks,
          ratePerNight: room.ratePerNight,
          totalRate: room.totalRate,
          otaTotal: room.otaTotal,
          savingsVsOta: room.savingsVsOta,
          paymentStatus: "PENDING_3DS",
          text: `Great news! Our last **${room.name}** is available for Nov 20–23. It includes a private heated infinity pool and complimentary airport transfer! Confirm below with 1-Tap Apple Pay / JCC:`
        }
      ];

      this.addExecutionLog({
        stage: "WHATSAPP_AUDIO_WHISPER",
        latencyMs: 285,
        badge: "Audio Note ASR",
        status: "success",
        summary: "Transcribed 9-second WhatsApp voice note & matched Royal Cypress Private Pool Villa (3 nights).",
        payload: { channel: "whatsapp_audio", roomId: "family-villa", nights: 3, totalEUR: room.totalRate }
      });

      this.persist();
      return session;
    }

    if (scenarioKey === "custom" && customMessage.trim()) {
      const text = customMessage.trim();
      const lower = text.toLowerCase();
      let roomId = session.selectedRoomId || "sea-view-deluxe";
      if (lower.includes("villa") || lower.includes("βίλα") || lower.includes("family")) {
        roomId = "family-villa";
      } else if (lower.includes("swim") || lower.includes("suite") || lower.includes("σουίτα") || lower.includes("pool")) {
        roomId = "swim-up-suite";
      } else if (lower.includes("sea") || lower.includes("deluxe") || lower.includes("θάλασσα")) {
        roomId = "sea-view-deluxe";
      }

      const nightsMatch = lower.match(/(\d+)\s*(night|nights|βράδια|βραδιές)/);
      const nights = nightsMatch ? Math.min(14, Math.max(1, parseInt(nightsMatch[1], 10))) : session.nights || 3;
      session.selectedRoomId = roomId;
      session.nights = nights;

      const avail = this.checkAvailability({ roomId, nights });
      const room = avail.recommendedRoom;

      const aiReply = `I've checked our live WebHotelier inventory! We have ${room.available} ${room.name} available for ${nights} nights at €${room.ratePerNight}/night (€${room.totalRate} total, saving €${room.savingsVsOta} vs OTAs). I've updated your WhatsApp checkout card so you can confirm with 1 tap or add airport pickup & excursions.`;

      session.callTranscript.push(
        {
          role: "guest",
          speaker: channel === "whatsapp" ? `WhatsApp (${phone})` : `Caller (${phone})`,
          lang: session.language,
          text,
          time: "Live"
        },
        {
          role: "ai",
          speaker: "MyVacAI Receptionist (Elena)",
          lang: session.language,
          text: aiReply,
          time: "Live"
        }
      );

      session.whatsappMessages.push(
        {
          id: `wa-guest-${Date.now()}`,
          sender: "guest",
          type: "text",
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          text
        },
        {
          id: `wa-ai-${Date.now() + 1}`,
          sender: "ai",
          type: "room_quote_card",
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          title: `✨ ${room.name}`,
          subtitle: `${nights} Nights • Direct Rate Locked`,
          image: room.image,
          perks: room.perks,
          ratePerNight: room.ratePerNight,
          totalRate: room.totalRate,
          otaTotal: room.otaTotal,
          savingsVsOta: room.savingsVsOta,
          paymentStatus: "PENDING_3DS",
          text: aiReply
        }
      );

      this.addExecutionLog({
        stage: "LIVE_CUSTOM_TURN",
        latencyMs: 325,
        badge: channel === "whatsapp" ? "WhatsApp AI" : "Voice AI",
        status: "success",
        summary: `Processed guest message ("${text.slice(0, 60)}") → Quoted ${room.name} (${nights} nights @ €${room.totalRate}).`,
        payload: { input: text, matchedRoom: room.id, nights, totalEUR: room.totalRate }
      });

      this.persist();
      return session;
    }

    return this.seedInitialSession();
  },

  completeCheckout() {
    this.init();
    const session = this.session;
    if (session.paymentStatus === "PAID") {
      return { session, alreadyPaid: true };
    }

    const room = this.pms.rooms.find(r => r.id === session.selectedRoomId) || this.pms.rooms[0];
    if (room.available > 0) {
      room.available -= 1;
    }
    const nights = session.nights || 3;
    const roomTotal = room.ratePerNight * nights;
    const otaSaved = Math.round(roomTotal * this.pms.property.otaCommissionRate);
    const reservationCode = `WH-CY-${Math.floor(8942 + Math.random() * 900)}`;
    const protelId = Math.floor(40915 + Math.random() * 500);

    const booking = {
      reservationCode,
      guestName: session.guestName || "Christos (Demo Guest)",
      phone: session.phone,
      language: session.language,
      channel:
        session.callStatus === "WHATSAPP_VOICE_NOTE"
          ? "WhatsApp Voice Note → JCC 3DS"
          : "Phone Call → WhatsApp Apple Pay",
      roomId: room.id,
      roomName: room.name,
      checkIn: session.checkIn,
      checkOut: session.checkOut,
      nights,
      roomTotal,
      addons: [],
      totalPaid: roomTotal,
      otaSaved,
      status: `CONFIRMED (Protel #${protelId})`,
      createdAt: "Just now"
    };

    this.pms.bookings.unshift(booking);
    this.pms.metrics.callsAnswered247 += 1;
    this.pms.metrics.directRevenueRecovered += roomTotal;
    this.pms.metrics.otaCommissionSaved += otaSaved;

    session.paymentStatus = "PAID";
    session.reservationCode = booking.reservationCode;

    session.whatsappMessages.forEach(msg => {
      if (msg.type === "room_quote_card") {
        msg.paymentStatus = "PAID";
        msg.reservationCode = booking.reservationCode;
      }
    });

    session.callTranscript.push({
      role: "ai",
      speaker: "MyVacAI Receptionist (Elena)",
      lang: session.language,
      text:
        session.language === "EL"
          ? `Τέλεια! Έλαβα την επιβεβαίωση πληρωμής €${booking.roomTotal} (Κωδικός Κράτησης ${booking.reservationCode}). Σας έστειλα στο WhatsApp τις επιλογές μας για VIP μεταφορά από το αεροδρόμιο Λάρνακας/Πάφου και κρουαζιέρα στο Blue Lagoon!`
          : `Wonderful, ${session.guestName}! Your €${booking.roomTotal} Apple Pay payment just cleared and your booking is confirmed in our system under ${booking.reservationCode}. I've also sent our Vacation Concierge menu to your WhatsApp in case you'd like airport pickup or a Blue Lagoon yacht cruise!`,
      time: "Confirmed"
    });

    const addons = this.pms.conciergeAddons;
    session.whatsappMessages.push({
      id: `wa-conf-${Date.now()}`,
      sender: "ai",
      type: "booking_confirmed_concierge",
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      reservationCode: booking.reservationCode,
      roomName: booking.roomName,
      totalPaid: booking.totalPaid,
      checkIn: session.checkIn,
      checkOut: session.checkOut,
      addons
    });

    this.addExecutionLog({
      stage: "PAYMENT_3DS_WEBHOOK",
      latencyMs: 94,
      badge: "JCC / Apple Pay 3DS",
      status: "success",
      summary: `3D Secure payment of €${booking.roomTotal} authorized for ${session.phone}.`,
      payload: {
        gateway: "JCC Smart / Apple Pay",
        status: "AUTHORIZED_CAPTURED",
        amountEUR: booking.roomTotal,
        eci: "05 (3DS2 Authenticated)"
      }
    });

    this.addExecutionLog({
      stage: "PMS_WRITEBACK_PROTEL",
      latencyMs: 138,
      badge: "Protel PMS Write-Back",
      status: "success",
      summary: `Created confirmed reservation ${booking.reservationCode} (${booking.roomName}) & decremented live room inventory.`,
      payload: {
        reservationCode: booking.reservationCode,
        pmsStatus: booking.status,
        otaCommissionSavedEUR: booking.otaSaved
      }
    });

    this.addExecutionLog({
      stage: "CONCIERGE_UPSELL_DISPATCH",
      latencyMs: 115,
      badge: "MyVacAI Concierge",
      status: "success",
      summary: "Switched thread mode from Receptionist → Vacation Concierge and dispatched 4 personalized Cyprus add-ons.",
      payload: {
        mode: "POST_BOOKING_CONCIERGE",
        upsellOffers: addons.map(a => `${a.shortName} (€${a.price})`)
      }
    });

    this.persist();
    return { session, booking };
  },

  bookConciergeAddon(addonId) {
    this.init();
    const session = this.session;
    const addon = this.pms.conciergeAddons.find(a => a.id === addonId);
    if (!addon) return null;

    let booking = this.pms.bookings.find(
      b =>
        (session.reservationCode && b.reservationCode === session.reservationCode) ||
        (session.phone && b.phone === session.phone)
    );
    if (!booking) booking = this.pms.bookings[0];

    const label = `${addon.shortName} (€${addon.price})`;
    if (!booking.addons.includes(label)) {
      booking.addons.push(label);
      booking.totalPaid += addon.price;
      this.pms.metrics.conciergeUpsellRevenue += addon.price;
      this.pms.metrics.directRevenueRecovered += addon.price;
    }

    if (!session.selectedAddons.includes(addon.id)) {
      session.selectedAddons.push(addon.id);
    }

    session.whatsappMessages.push({
      id: `wa-addon-${Date.now()}`,
      sender: "ai",
      type: "addon_confirmed",
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      addonName: addon.name,
      addonPrice: addon.price,
      icon: addon.icon,
      reservationCode: booking.reservationCode,
      newFolioTotal: booking.totalPaid
    });

    this.addExecutionLog({
      stage: "CONCIERGE_FOLIO_POST",
      latencyMs: 120,
      badge: "Concierge Upsell +€" + addon.price,
      status: "success",
      summary: `Guest added "${addon.shortName}" (+€${addon.price}) via WhatsApp 1-Tap → Posted to Protel Folio ${booking.reservationCode}.`,
      payload: {
        reservationCode: booking.reservationCode,
        addonId: addon.id,
        addonPriceEUR: addon.price,
        updatedFolioTotalEUR: booking.totalPaid
      }
    });

    this.persist();
    return { session, booking, addon };
  },

  updateRoomInventory(roomId, available) {
    this.init();
    const room = this.pms.rooms.find(r => r.id === roomId);
    if (!room) return null;
    room.available = Math.max(0, Math.min(room.totalInventory, available));
    this.addExecutionLog({
      stage: "PMS_INVENTORY_UPDATE",
      latencyMs: 42,
      badge: "Hotelier Admin",
      status: "success",
      summary: `Updated ${room.name}: ${room.available} available @ €${room.ratePerNight}/night.`,
      payload: { roomId: room.id, available: room.available, ratePerNight: room.ratePerNight }
    });
    this.persist();
    return room;
  },

  toggleIntegration(id) {
    this.init();
    const item = this.pms.integrations.find(i => i.id === id);
    if (!item) return null;
    item.status = item.status === "connected" ? "paused" : "connected";
    this.persist();
    return item;
  }
};

let appState = {
  pms: null,
  session: null,
  executionLogs: [],
  ttsEnabled: false,
  staticMode: false
};

async function apiOrLocal(url, options, localFallbackFn) {
  if (!appState.staticMode) {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.ok) {
            return data;
          }
        }
      }
      appState.staticMode = true;
    } catch (err) {
      appState.staticMode = true;
    }
  }
  return localFallbackFn();
}

function switchTab(tabId) {
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === `tab-${tabId}`);
  });
}

function toggleVoiceAudio() {
  appState.ttsEnabled = !appState.ttsEnabled;
  const btn = document.getElementById("tts-toggle-btn");
  if (appState.ttsEnabled) {
    btn.classList.add("enabled");
    btn.textContent = "🔊 Voice Audio: ON (Speaking)";
    speakLatestAiTurn();
  } else {
    btn.classList.remove("enabled");
    btn.textContent = "🔊 Voice Audio: Off (Click to Speak)";
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

function speakLatestAiTurn() {
  if (!appState.ttsEnabled || !("speechSynthesis" in window) || !appState.session) return;
  const turns = appState.session.callTranscript || [];
  const latestAi = [...turns].reverse().find(t => t.role === "ai");
  if (!latestAi) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(latestAi.text);
  utter.lang = latestAi.lang === "EL" ? "el-GR" : "en-GB";
  utter.rate = 1.02;
  window.speechSynthesis.speak(utter);
}

async function fetchInitialState() {
  const data = await apiOrLocal("/api/pms/state", undefined, () => {
    LocalMyVacAIEngine.init();
    return {
      ok: true,
      pms: LocalMyVacAIEngine.pms,
      activeSession: LocalMyVacAIEngine.session,
      executionLogs: LocalMyVacAIEngine.executionLogs
    };
  });

  if (data && data.ok) {
    appState.pms = data.pms;
    appState.session = data.activeSession;
    appState.executionLogs = data.executionLogs;
    renderAll();
  }
}

async function triggerScenario(scenarioKey, btnEl) {
  if (btnEl) {
    document.querySelectorAll(".scenario-btn").forEach(b => b.classList.remove("active"));
    btnEl.classList.add("active");
  }
  const phone = "+357 99 482 190";
  const data = await apiOrLocal(
    "/api/agent/scenario",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioKey, phone })
    },
    () => {
      const session = LocalMyVacAIEngine.runScenario({ scenarioKey, phone });
      return {
        ok: true,
        session,
        pms: LocalMyVacAIEngine.pms,
        executionLogs: LocalMyVacAIEngine.executionLogs
      };
    }
  );

  if (data && data.ok) {
    appState.session = data.session;
    appState.pms = data.pms;
    appState.executionLogs = data.executionLogs;
    renderAll();
    speakLatestAiTurn();
  }
}

async function sendCustomTurn(event, channel) {
  event.preventDefault();
  const inputId = channel === "whatsapp" ? "wa-custom-input" : "voice-custom-input";
  const inputEl = document.getElementById(inputId);
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = "";

  const phone = "+357 99 482 190";
  const data = await apiOrLocal(
    "/api/agent/scenario",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioKey: "custom",
        phone,
        customMessage: text,
        channel
      })
    },
    () => {
      const session = LocalMyVacAIEngine.runScenario({
        scenarioKey: "custom",
        phone,
        customMessage: text,
        channel
      });
      return {
        ok: true,
        session,
        pms: LocalMyVacAIEngine.pms,
        executionLogs: LocalMyVacAIEngine.executionLogs
      };
    }
  );

  if (data && data.ok) {
    appState.session = data.session;
    appState.pms = data.pms;
    appState.executionLogs = data.executionLogs;
    renderAll();
    speakLatestAiTurn();
  }
}

async function handleInstantCheckout() {
  const phone = appState.session?.phone || "+357 99 482 190";
  const data = await apiOrLocal(
    "/api/checkout/pay",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    },
    () => {
      const res = LocalMyVacAIEngine.completeCheckout();
      return {
        ok: true,
        session: res.session,
        pms: LocalMyVacAIEngine.pms,
        executionLogs: LocalMyVacAIEngine.executionLogs
      };
    }
  );

  if (data && data.ok) {
    appState.session = data.session;
    appState.pms = data.pms;
    appState.executionLogs = data.executionLogs;
    renderAll();
    speakLatestAiTurn();
  }
}

async function handleBookAddon(addonId) {
  const phone = appState.session?.phone || "+357 99 482 190";
  const data = await apiOrLocal(
    "/api/concierge/book",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, addonId })
    },
    () => {
      const res = LocalMyVacAIEngine.bookConciergeAddon(addonId);
      return {
        ok: true,
        session: res ? res.session : LocalMyVacAIEngine.session,
        pms: LocalMyVacAIEngine.pms,
        executionLogs: LocalMyVacAIEngine.executionLogs
      };
    }
  );

  if (data && data.ok) {
    appState.session = data.session;
    appState.pms = data.pms;
    appState.executionLogs = data.executionLogs;
    renderAll();
  }
}

async function adjustInventory(roomId, delta) {
  const room = appState.pms.rooms.find(r => r.id === roomId);
  if (!room) return;
  const targetAvailable = room.available + delta;
  const data = await apiOrLocal(
    `/api/pms/rooms/${roomId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: targetAvailable })
    },
    () => {
      LocalMyVacAIEngine.updateRoomInventory(roomId, targetAvailable);
      return {
        ok: true,
        pms: LocalMyVacAIEngine.pms,
        executionLogs: LocalMyVacAIEngine.executionLogs
      };
    }
  );

  if (data && data.ok) {
    appState.pms = data.pms;
    if (data.executionLogs) appState.executionLogs = data.executionLogs;
    renderAll();
  }
}

async function toggleIntegrationStatus(id) {
  const data = await apiOrLocal(
    `/api/pms/integrations/${id}/toggle`,
    { method: "POST" },
    () => {
      LocalMyVacAIEngine.toggleIntegration(id);
      return {
        ok: true,
        pms: LocalMyVacAIEngine.pms
      };
    }
  );

  if (data && data.ok) {
    appState.pms = data.pms;
    renderDashboard();
  }
}

function renderAll() {
  renderSimulator();
  renderDashboard();
}

function renderSimulator() {
  const session = appState.session;
  if (!session) return;

  document.getElementById("caller-phone-display").textContent = `Caller: ${session.phone} (${session.language})`;
  document.getElementById("call-status-label").textContent =
    session.callStatus === "WHATSAPP_VOICE_NOTE"
      ? "WHATSAPP VOICE NOTE • 0:09"
      : "LIVE INBOUND CALL • ACTIVE";

  // 1. Render Call Transcript
  const transcriptBox = document.getElementById("call-transcript-list");
  transcriptBox.innerHTML = session.callTranscript
    .map(
      turn => `
      <div class="transcript-turn ${turn.role}">
        <div class="turn-meta">
          <span>${turn.speaker}</span>
          <span>${turn.time}</span>
        </div>
        <div>${turn.text}</div>
      </div>
    `
    )
    .join("");
  transcriptBox.scrollTop = transcriptBox.scrollHeight;

  // 2. Render WhatsApp Thread
  const waBox = document.getElementById("wa-messages-list");
  waBox.innerHTML = session.whatsappMessages
    .map(msg => {
      if (msg.type === "voice_note") {
        return `
          <div class="wa-bubble guest">
            <div style="font-weight:700; font-size:0.75rem; color:#075e54; margin-bottom:4px;">
              🎙️ Voice Note (${msg.duration}) • Transcribed by MyVacAI
            </div>
            <div style="font-style:italic; color:#334155;">"${msg.transcript}"</div>
          </div>
        `;
      }

      if (msg.type === "room_quote_card") {
        const isPaid = msg.paymentStatus === "PAID";
        return `
          <div class="wa-bubble">
            <img src="${msg.image}" alt="${msg.title}" class="wa-room-img" />
            <div class="wa-room-title">${msg.title}</div>
            <div class="wa-room-sub">${msg.subtitle}</div>
            <div class="wa-perks">
              ${(msg.perks || []).map(p => `<span class="wa-perk-tag">✓ ${p}</span>`).join("")}
            </div>
            <div style="font-size:0.79rem; color:#334155; margin-bottom:6px;">${msg.text}</div>
            <div class="wa-price-box">
              <div>
                <div class="wa-price-main">€${msg.totalRate} <span style="font-size:0.74rem; font-weight:500;">(€${msg.ratePerNight}/night)</span></div>
                <div class="wa-price-ota">Booking.com / Expedia: €${msg.otaTotal}</div>
              </div>
              <span class="wa-savings-pill">Save €${msg.savingsVsOta} Direct</span>
            </div>
            ${
              isPaid
                ? `<button class="wa-pay-btn paid" disabled>
                     ✅ Paid €${msg.totalRate} • Confirmed (${msg.reservationCode})
                   </button>`
                : `<button class="wa-pay-btn" onclick="handleInstantCheckout()">
                      Pay / JCC 3DS — Pay €${msg.totalRate} Now (1-Tap)
                   </button>`
            }
          </div>
        `;
      }

      if (msg.type === "booking_confirmed_concierge") {
        return `
          <div class="wa-bubble" style="border: 1.5px solid #22c55e;">
            <div style="font-weight:800; color:#15803d; margin-bottom:4px;">
              🎉 Reservation Locked in Protel PMS (${msg.reservationCode})
            </div>
            <div style="font-size:0.78rem; color:#334155; margin-bottom:8px;">
              <strong>${msg.roomName}</strong> • ${msg.checkIn} → ${msg.checkOut}<br/>
              Tap any <strong>MyVacAI Vacation Concierge</strong> experience below to add it straight to your room folio:
            </div>
            <div class="wa-addons-grid">
              ${(msg.addons || [])
                .map(addon => {
                  const alreadyAdded = (session.selectedAddons || []).includes(addon.id);
                  return `
                    <button class="wa-addon-btn" onclick="handleBookAddon('${addon.id}')">
                      <span>${addon.icon} ${addon.shortName}</span>
                      <span class="wa-addon-price">${alreadyAdded ? "✓ Added" : `+€${addon.price}`}</span>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </div>
        `;
      }

      if (msg.type === "addon_confirmed") {
        return `
          <div class="wa-bubble" style="background:#f0fdf4; border:1px solid #86efac;">
            <div style="font-weight:700; color:#14532d;">
              ${msg.icon} Concierge Upsell Confirmed (+€${msg.addonPrice})
            </div>
            <div style="font-size:0.78rem; color:#166534; margin-top:2px;">
              Added <strong>${msg.addonName}</strong> to Reservation <strong>${msg.reservationCode}</strong>. Updated Folio Total: <strong>€${msg.newFolioTotal}</strong>.
            </div>
          </div>
        `;
      }

      return `
        <div class="wa-bubble ${msg.sender === "guest" ? "guest" : ""}">
          <div>${msg.text}</div>
        </div>
      `;
    })
    .join("");
  waBox.scrollTop = waBox.scrollHeight;

  // 3. Render Unified Memory Card
  document.getElementById("mem-session-id").textContent = session.sessionId;
  const memGrid = document.getElementById("memory-grid-box");
  memGrid.innerHTML = `
    <div class="memory-item">
      <div class="memory-item-label">Guest &amp; Language</div>
      <div class="memory-item-val">${session.guestName} (${session.language})</div>
    </div>
    <div class="memory-item">
      <div class="memory-item-label">Matched Room</div>
      <div class="memory-item-val">${session.selectedRoomId} (${session.nights}n)</div>
    </div>
    <div class="memory-item">
      <div class="memory-item-label">3DS &amp; PMS Status</div>
      <div class="memory-item-val" style="color:${session.paymentStatus === "PAID" ? "#16a34a" : "#d97706"}">
        ${session.paymentStatus === "PAID" ? `PAID (${session.reservationCode})` : "AWAITING 1-TAP PAY"}
      </div>
    </div>
  `;

  // 4. Render Execution Logs
  const logsBox = document.getElementById("execution-logs-list");
  logsBox.innerHTML = (appState.executionLogs || [])
    .map(
      log => `
      <div class="log-card">
        <div class="log-top">
          <span class="log-stage">[${log.timestamp}] ${log.stage}</span>
          <span class="log-latency">${log.latencyMs}ms • ${log.badge}</span>
        </div>
        <div class="log-summary">${log.summary}</div>
        <div class="log-json">${JSON.stringify(log.payload)}</div>
      </div>
    `
    )
    .join("");
}

function renderDashboard() {
  const pms = appState.pms;
  if (!pms) return;

  const m = pms.metrics;
  document.getElementById("kpi-grid-box").innerHTML = `
    <div class="kpi-card">
      <div class="kpi-label">Calls &amp; Voice Notes Answered</div>
      <div class="kpi-value">${m.callsAnswered247}</div>
      <div class="kpi-delta">↑ ${m.missedCallsPrevented} after-hours calls saved</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Call → WhatsApp Conversion</div>
      <div class="kpi-value">${m.handoffConversionRate}%</div>
      <div class="kpi-delta">↑ Instant 3DS Apple Pay / JCC links</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Direct Revenue Recovered</div>
      <div class="kpi-value">€${m.directRevenueRecovered.toLocaleString()}</div>
      <div class="kpi-delta">↑ This month via MyVacAI</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">OTA Commissions Saved (18%)</div>
      <div class="kpi-value" style="color:#16a34a;">€${m.otaCommissionSaved.toLocaleString()}</div>
      <div class="kpi-delta">↑ Kept by hotel vs Booking.com</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Concierge Upsell Revenue</div>
      <div class="kpi-value" style="color:#0284c7;">€${m.conciergeUpsellRevenue.toLocaleString()}</div>
      <div class="kpi-delta">↑ Transfers, Yacht, Spa &amp; Dining</div>
    </div>
  `;

  // Bookings table
  document.getElementById("bookings-table-body").innerHTML = pms.bookings
    .map(
      b => `
      <tr>
        <td data-label="Res Code"><span class="code-badge">${b.reservationCode}</span></td>
        <td data-label="Guest & Phone">
          <strong>${b.guestName}</strong>
          <div style="font-size:0.73rem; color:#64748b;">${b.phone} (${b.language})</div>
        </td>
        <td data-label="Channel Path"><span style="font-size:0.77rem; font-weight:600;">${b.channel}</span></td>
        <td data-label="Room & Stay">
          <strong>${b.roomName}</strong>
          <div style="font-size:0.73rem; color:#64748b;">${b.nights} Nights (${b.checkIn})</div>
        </td>
        <td data-label="Concierge Upsells">
          ${
            b.addons && b.addons.length
              ? b.addons.map(a => `<div style="font-size:0.74rem; color:#0369a1; font-weight:600;">+ ${a}</div>`).join("")
              : `<span style="color:#94a3b8; font-size:0.74rem;">None yet</span>`
          }
        </td>
        <td data-label="Total Paid"><strong style="font-size:0.9rem;">€${b.totalPaid}</strong></td>
        <td data-label="OTA Saved"><span class="status-confirmed">Saved €${b.otaSaved}</span></td>
      </tr>
    `
    )
    .join("");

  // Inventory list
  document.getElementById("inventory-list-box").innerHTML = pms.rooms
    .map(
      r => `
      <div class="inv-item">
        <div>
          <div style="font-weight:700; font-size:0.86rem;">${r.name} <span style="color:#64748b; font-weight:500;">(${r.code})</span></div>
          <div style="font-size:0.75rem; color:#475569;">Direct Rate: <strong>€${r.ratePerNight}/night</strong> (OTA: €${r.otaRatePerNight})</div>
        </div>
        <div class="inv-controls">
          <button class="inv-btn" onclick="adjustInventory('${r.id}', -1)">-</button>
          <span style="font-weight:800; min-width:65px; text-align:center; font-size:0.82rem;">
            ${r.available} / ${r.totalInventory} left
          </span>
          <button class="inv-btn" onclick="adjustInventory('${r.id}', 1)">+</button>
        </div>
      </div>
    `
    )
    .join("");

  // Integrations grid
  document.getElementById("integrations-grid-box").innerHTML = pms.integrations
    .map(
      int => `
      <div class="integration-card">
        <div class="int-top">
          <span class="int-name">${int.name}</span>
          <button class="int-status ${int.status}" onclick="toggleIntegrationStatus('${int.id}')">
            ${int.status === "connected" ? `● Connected (${int.latencyMs}ms)` : "○ Paused"}
          </button>
        </div>
        <div style="font-size:0.72rem; color:#0284c7; font-weight:600; margin-bottom:3px;">${int.region} • ${int.category}</div>
        <div style="font-size:0.73rem; color:#475569;">${int.description}</div>
      </div>
    `
    )
    .join("");
}

window.addEventListener("DOMContentLoaded", fetchInitialState);

// Support ?tab=dashboard or ?tab=setup query param for direct linking & screenshots
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  if (tab && ["simulator", "dashboard", "setup"].includes(tab)) {
    switchTab(tab);
  }
});


// Brand Logo Switcher (Bell & Wave vs Golden Key Crest) with localStorage persistence
const BRAND_LOGOS = {
  bell: {
    icon: "./assets/logo-bell-icon.png",
    lockup: "./assets/logo-bell-wave.jpg",
    badge: "Active: logo-bell-wave.jpg"
  },
  crest: {
    icon: "./assets/logo-crest-icon.png",
    lockup: "./assets/logo-key-crest.jpg",
    badge: "Active: logo-key-crest.jpg"
  },
  headphones: {
    icon: "./assets/logo-headphones-icon.png",
    lockup: "./assets/logo-headphones.jpg",
    badge: "Active: logo-headphones.jpg"
  }
};

function setBrandLogo(key) {
  const cfg = BRAND_LOGOS[key] || BRAND_LOGOS.bell;
  const activeKey = BRAND_LOGOS[key] ? key : "bell";

  const topImg = document.getElementById("topbar-logo-img");
  if (topImg) topImg.src = cfg.icon;

  const waImg = document.getElementById("wa-logo-img");
  if (waImg) waImg.src = cfg.icon;

  const fav = document.querySelector("link[rel=\"icon\"]");
  if (fav) fav.href = cfg.icon;

  const btnBell = document.getElementById("btn-logo-bell");
  const btnCrest = document.getElementById("btn-logo-crest");
  if (btnBell) btnBell.classList.toggle("active", activeKey === "bell");
  if (btnCrest) btnCrest.classList.toggle("active", activeKey === "crest");

  const cardBell = document.getElementById("drawer-card-bell");
  const cardCrest = document.getElementById("drawer-card-crest");
  if (cardBell) cardBell.classList.toggle("active", activeKey === "bell");
  if (cardCrest) cardCrest.classList.toggle("active", activeKey === "crest");

  const badgeEl = document.getElementById("active-logo-badge");
  if (badgeEl) badgeEl.textContent = cfg.badge;

  document.querySelectorAll(".logo-gallery-item[data-logo-key]").forEach(el => {
    el.classList.toggle("active", el.getAttribute("data-logo-key") === activeKey);
  });

  try {
    localStorage.setItem("myvacai_brand_logo", activeKey);
  } catch (e) {}
}

function toggleLogoDrawer() {
  const drawer = document.getElementById("logo-preview-drawer");
  if (!drawer) return;
  drawer.hidden = !drawer.hidden;
}

window.addEventListener("DOMContentLoaded", () => {
  try {
    const savedLogo = localStorage.getItem("myvacai_brand_logo");
    if (savedLogo && BRAND_LOGOS[savedLogo]) {
      setBrandLogo(savedLogo);
    }
  } catch (e) {}
});
