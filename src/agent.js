/**
 * MyVacAI — Unified Guest Memory & Receptionist Brain Engine
 * Keyed by guest E.164 phone number (+357..., +44..., +30...)
 * Unifies Live Phone Calls, WhatsApp Messages, WhatsApp Voice Notes & 3DS Payment Handoffs
 */

const pms = require("./pms");

const sessions = new Map();
const executionLogs = [];

function addExecutionLog(entry) {
  const item = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    ...entry
  };
  executionLogs.unshift(item);
  if (executionLogs.length > 50) executionLogs.pop();
  return item;
}

function getOrCreateSession(phone = "+357 99 482 190", defaults = {}) {
  const normalizedPhone = phone.trim();
  if (!sessions.has(normalizedPhone)) {
    const avail = pms.checkAvailability({
      roomId: defaults.roomId || "sea-view-deluxe",
      nights: defaults.nights || 3,
      guests: 2
    });

    sessions.set(normalizedPhone, {
      sessionId: `sess_${normalizedPhone.replace(/[^0-9]/g, "")}`,
      phone: normalizedPhone,
      guestName: defaults.guestName || "Christos T.",
      language: defaults.language || "EN",
      callStatus: "ACTIVE_CALL", // IDLE | ACTIVE_CALL | ENDED_FOLLOWUP
      selectedRoomId: avail.recommendedRoom.id,
      nights: avail.recommendedRoom.nights,
      checkIn: "Fri, 6 Nov 2026",
      checkOut: "Mon, 9 Nov 2026",
      paymentStatus: "PENDING_3DS", // PENDING_3DS | PAID
      reservationCode: null,
      selectedAddons: [],
      callTranscript: [],
      whatsappMessages: [],
      updatedAt: new Date().toISOString()
    });
  }
  return sessions.get(normalizedPhone);
}

/**
 * Seed initial realistic interactive state so the demo looks alive immediately on load
 */
function seedInitialSession() {
  const phone = "+357 99 482 190";
  sessions.delete(phone);
  executionLogs.length = 0;

  const session = getOrCreateSession(phone, {
    guestName: "Christos T.",
    language: "EN",
    roomId: "sea-view-deluxe",
    nights: 3
  });

  const avail = pms.checkAvailability({ roomId: "sea-view-deluxe", nights: 3 });
  const room = avail.recommendedRoom;

  session.callTranscript = [
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
      text: `Yes! We have 4 ${room.name} rooms open for Nov 6–9 at our direct rate of €${room.ratePerNight}/night (€${room.totalRate} total including champagne breakfast — €${room.savingsVsOta} less than Booking.com). I just sent the room photos and a 1-tap Apple Pay / JCC checkout card to your WhatsApp right now while we're on the line!`,
      time: "00:15"
    }
  ];

  session.whatsappMessages = [
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
      text: `Hi ${session.guestName}! Here is the live quote from our front desk call. Tap below to lock in your direct rate with 1-Tap Apple Pay or JCC Smart 3DS (no card numbers needed over the phone).`
    }
  ];

  addExecutionLog({
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

  addExecutionLog({
    stage: "PMS_WEBHOTELIER_LOOKUP",
    latencyMs: 112,
    badge: "WebHotelier CRS",
    status: "success",
    summary: `Live inventory verified: 4x ${room.name} available @ €${room.ratePerNight}/night (€${room.totalRate} total vs €${room.otaTotal} OTA).`,
    payload: {
      pms: "WebHotelier + Protel PMS",
      roomCode: room.code,
      availableUnits: room.available,
      directTotalEUR: room.totalRate,
      otaComparisonEUR: room.otaTotal,
      directPerks: room.perks
    }
  });

  addExecutionLog({
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

  return session;
}

/**
 * Trigger a preset or custom scenario (English, Greek, Russian, or Voice Note)
 */
function runScenario({ scenarioKey = "en_seaview", phone = "+357 99 482 190", customMessage = "", channel = "voice" }) {
  const session = getOrCreateSession(phone);
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

    const avail = pms.checkAvailability({ roomId: "swim-up-suite", nights: 2 });
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
        text: `Βεβαίως! Έχουμε 2 διαθέσιμες ${room.nameEl} στα €${room.ratePerNight}/βράδυ (€${room.totalRate} συνολικά με πρωινό — κερδίζετε €${room.savingsVsOta} σε σχέση με το Booking.com). Σας έστειλα μόλις τώρα στο WhatsApp φωτογραφίες και σύνδεσμο πληρωμής JCC / Apple Pay!`,
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

    addExecutionLog({
      stage: "VOICE_ASR_GREEK",
      latencyMs: 340,
      badge: "Greek ASR (el-CY)",
      status: "success",
      summary: "Detected Greek speaker requesting Swim-Up Junior Suite for 2 nights (13–15 Nov).",
      payload: { language: "el-CY", roomId: "swim-up-suite", nights: 2, totalEUR: room.totalRate }
    });

    addExecutionLog({
      stage: "WHATSAPP_HANDOFF_EL",
      latencyMs: 172,
      badge: "WhatsApp + Viva/JCC",
      status: "success",
      summary: `Sent Greek WhatsApp card + €${room.totalRate} 3DS payment link while caller remains on line.`,
      payload: { recipient: phone, roomCode: room.code, amountEUR: room.totalRate }
    });

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

    const avail = pms.checkAvailability({ roomId: "family-villa", nights: 3 });
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
        text: `Transcribed WhatsApp audio note in 290ms → Checked WebHotelier for Royal Cypress Private Pool Villa (1 unit left @ €${room.ratePerNight}/night) → Prepared instant checkout card + Airport Mercedes V-Class add-on.`,
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

    addExecutionLog({
      stage: "WHATSAPP_AUDIO_WHISPER",
      latencyMs: 285,
      badge: "Audio Note ASR",
      status: "success",
      summary: "Transcribed 9-second WhatsApp voice note & matched Royal Cypress Private Pool Villa (3 nights).",
      payload: { channel: "whatsapp_audio", roomId: "family-villa", nights: 3, totalEUR: room.totalRate }
    });

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

    const avail = pms.checkAvailability({ roomId, nights });
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

    addExecutionLog({
      stage: "LIVE_CUSTOM_TURN",
      latencyMs: 325,
      badge: channel === "whatsapp" ? "WhatsApp AI" : "Voice AI",
      status: "success",
      summary: `Processed guest message ("${text.slice(0, 60)}") → Quoted ${room.name} (${nights} nights @ €${room.totalRate}).`,
      payload: { input: text, matchedRoom: room.id, nights, totalEUR: room.totalRate }
    });

    return session;
  }

  // Default: English Sea View Deluxe scenario
  return seedInitialSession();
}

/**
 * Complete 1-Tap 3DS Checkout from the WhatsApp Card -> Writes back to PMS & triggers Vacation Concierge Upsells
 */
function completeCheckout(phone = "+357 99 482 190") {
  const session = getOrCreateSession(phone);
  if (session.paymentStatus === "PAID") {
    return { session, alreadyPaid: true };
  }

  const booking = pms.recordConfirmedBooking({
    guestName: session.guestName,
    phone: session.phone,
    language: session.language,
    roomId: session.selectedRoomId,
    nights: session.nights,
    checkIn: session.checkIn,
    checkOut: session.checkOut,
    channel: session.callStatus === "WHATSAPP_VOICE_NOTE"
      ? "WhatsApp Voice Note → JCC 3DS"
      : "Phone Call → WhatsApp Apple Pay"
  });

  session.paymentStatus = "PAID";
  session.reservationCode = booking.reservationCode;

  // Mark existing quote cards as PAID
  session.whatsappMessages.forEach(msg => {
    if (msg.type === "room_quote_card") {
      msg.paymentStatus = "PAID";
      msg.reservationCode = booking.reservationCode;
    }
  });

  // Add Voice confirmation on the active call
  session.callTranscript.push({
    role: "ai",
    speaker: "MyVacAI Receptionist (Elena)",
    lang: session.language,
    text: session.language === "EL"
      ? `Τέλεια! Έλαβα την επιβεβαίωση πληρωμής €${booking.roomTotal} (Κωδικός Κράτησης ${booking.reservationCode}). Σας έστειλα στο WhatsApp τις επιλογές μας για VIP μεταφορά από το αεροδρόμιο Λάρνακας/Πάφου και κρουαζιέρα στο Blue Lagoon!`
      : `Wonderful, ${session.guestName}! Your €${booking.roomTotal} Apple Pay payment just cleared and your booking is confirmed in our system under ${booking.reservationCode}. I've also sent our Vacation Concierge menu to your WhatsApp in case you'd like airport pickup or a Blue Lagoon yacht cruise!`,
    time: "Confirmed"
  });

  // Push WhatsApp confirmation + interactive Vacation Concierge upsell carousel
  const addons = pms.getState().conciergeAddons;
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
    text: session.language === "EL"
      ? `✅ Η κράτησή σας (${booking.reservationCode}) επιβεβαιώθηκε! Θέλετε να προσθέσετε κάποια εμπειρία MyVacAI Concierge στη διαμονή σας με 1 κλικ;`
      : `✅ **Booking Confirmed (${booking.reservationCode})!** Your room is locked in Protel PMS.\n\n🌴 **MyVacAI Vacation Concierge:** Would you like to add any VIP experiences to your stay with 1 tap?`,
    addons
  });

  addExecutionLog({
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

  addExecutionLog({
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

  addExecutionLog({
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

  return { session, booking };
}

/**
 * 1-Tap Book a Vacation Concierge Add-on (Airport Transfer, Yacht, Spa, Meze)
 */
function bookConciergeAddon({ phone = "+357 99 482 190", addonId }) {
  const session = getOrCreateSession(phone);
  const result = pms.addConciergeAddonToBooking({
    reservationCode: session.reservationCode,
    addonId,
    phone: session.phone
  });

  if (!result) return null;
  const { booking, addon } = result;

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
    newFolioTotal: booking.totalPaid,
    text: `${addon.icon} **Added to your stay (${booking.reservationCode}):** ${addon.name} (+€${addon.price}). Our concierge team has reserved your slot and updated your room folio (New Total: €${booking.totalPaid}).`
  });

  addExecutionLog({
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

  return { session, booking, addon };
}

function getAllSessions() {
  return Array.from(sessions.values());
}

function getExecutionLogs() {
  return executionLogs;
}

// Initialize default seed session on startup
seedInitialSession();

module.exports = {
  getOrCreateSession,
  seedInitialSession,
  runScenario,
  completeCheckout,
  bookConciergeAddon,
  getAllSessions,
  getExecutionLogs,
  addExecutionLog
};
