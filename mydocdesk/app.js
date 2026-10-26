// ============================================================================
// MyDocDesk / MyDocDeskAI — Interactive AI Medical Receptionist & Triage Engine
// ============================================================================

const MEDICAL_SCHEDULE_SLOTS = [
    {
      id: "slot-0930",
      time: "09:30 AM",
      patient: "Eleni Stavrou (Age 6)",
      phone: "+357 99 310 422",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • STANDARD",
      complaint: "Persistent dry cough (5 days), afebrile, eating well",
      notes: "GeSY Beneficiary #812044 • Lungs auscultation requested; no shortness of breath.",
      channel: "WhatsApp Text"
    },
    {
      id: "slot-1030",
      time: "10:30 AM",
      patient: "Nikolas Georgiou (Age 2)",
      phone: "+357 97 820 119",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • STANDARD",
      complaint: "18-month scheduled vaccination & growth check",
      notes: "GeSY Beneficiary #604118 • Child health booklet brought by parents.",
      channel: "Phone Call"
    },
    {
      id: "slot-1230",
      time: "12:30 PM (EMERGENCY BUFFER)",
      patient: "Leo K. (Age 4) — Maria K.",
      phone: "+357 99 614 280",
      priority: 1,
      prioLabel: "🔴 PRIORITY 1 • URGENT BUFFER UNLOCKED",
      complaint: "39.6°C fever since 22:00 last night + acute right ear pain & lethargy",
      notes: "GeSY #948201 • Red-flag screen: No neck stiffness, no breathing distress. Given Nurofen at 07:30. Photo of tympanic thermometer attached on WhatsApp.",
      channel: "Call → WhatsApp Handoff"
    },
    {
      id: "slot-1530",
      time: "03:30 PM",
      patient: "Sophia Christodoulou (Age 9)",
      phone: "+357 99 501 774",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • PHOTO TRIAGED",
      complaint: "Spreading erythematous forearm rash (48h) — High-res photo attached",
      notes: "Private Insurance (Universal Life) • AI attached forearm photo to calendar event so doctor can review before arrival.",
      channel: "WhatsApp Photo Triage"
    },
    {
      id: "slot-1700",
      time: "05:00 PM (EMERGENCY BUFFER)",
      patient: "🔒 Reserved for 🔴 Priority 1 Urgent Cases Only",
      phone: "Hidden from routine public booking",
      priority: 0,
      prioLabel: "🔒 PROTECTED BUFFER SLOT",
      complaint: "Automatically unlocked by Sofia only if an acute Priority 1 patient calls",
      notes: "Prevents routine checkups from consuming same-day emergency capacity.",
      channel: "AI Triage Guard"
    }
];

const DENTAL_SCHEDULE_SLOTS = [
    {
      id: "slot-0930-dent",
      time: "09:30 AM (45m TREATMENT BLOCK)",
      patient: "Kyriakos Andreou (Age 44)",
      phone: "+357 99 412 880",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • 45m ROOT CANAL / CROWN PREP",
      complaint: "Endodontic retreatment & zirconia crown preparation — Lower Left Molar (#36)",
      notes: "Private Dental (€450) • Pre-visit periapical X-ray attached to chart; local anesthesia tray prepped in Chair 1.",
      channel: "Phone Call → WhatsApp"
    },
    {
      id: "slot-1100-dent",
      time: "11:00 AM (60m IMPLANT CONSULT)",
      patient: "Christina Panayiotou (Age 52)",
      phone: "+357 97 605 319",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • 60m IMPLANT & CBCT",
      complaint: "Single-tooth titanium implant consultation & 3D CBCT scan review (#25)",
      notes: "Private Dental • CBCT DICOM link received via WhatsApp intake prior to arrival.",
      channel: "WhatsApp Intake"
    },
    {
      id: "slot-1230-dent",
      time: "12:30 PM (30m CHAIRSIDE EMERGENCY BUFFER)",
      patient: "Dimitris A. (Age 38)",
      phone: "+357 99 845 120",
      priority: 1,
      prioLabel: "🔴 PRIORITY 1 • DENTAL EMERGENCY + PHOTO",
      complaint: "Fractured upper-right premolar porcelain crown (#14) + 8/10 acute thermal toothache",
      notes: "Private Dental (€120 Emergency / Crown Repair) • Smartphone photo (tooth_fracture_UR4.jpg) attached. No facial swelling or fever. Nurse alerted to prep temporary crown cement & composite bonding tray.",
      channel: "Call → WhatsApp Photo Handoff"
    },
    {
      id: "slot-1500-dent",
      time: "03:00 PM (30m HYGIENE & SCALING)",
      patient: "Natalia Georgiadou (Age 29)",
      phone: "+357 99 118 402",
      priority: 2,
      prioLabel: "🟢 PRIORITY 3 • 30m SCALING (ΚΑΘΑΡΙΣΜΟΣ)",
      complaint: "6-month routine ultrasonic scaling, airflow polishing & annual GeSY preventive checkup",
      notes: "GeSY Preventive Dental / Private Airflow • Routed to non-peak afternoon hygiene slot to preserve morning surgery hours.",
      channel: "WhatsApp Booking"
    },
    {
      id: "slot-1700-dent",
      time: "05:00 PM (30m CHAIRSIDE EMERGENCY BUFFER)",
      patient: "🔒 Reserved for 🔴 Priority 1 Acute Dental Trauma / Swelling",
      phone: "Hidden from routine hygiene booking",
      priority: 0,
      prioLabel: "🔒 PROTECTED DENTAL BUFFER",
      complaint: "Unlocked by Sofia only for acute pulpitis, avulsed/fractured teeth, or facial swelling",
      notes: "Protects high-margin same-day emergency chair time from routine cleanings.",
      channel: "AI Triage Guard"
    }
];

const state = {
  brandKey: "mydocdesk", // 'mydocdesk' | 'mydocdeskai'
  iconKey: "schedule_gold", // 'schedule_navy' | 'schedule_gold' | 'bell' | 'cross'
  voiceAudioEnabled: false,
  guidedTimer: null,
  activeClinic: {
    id: "pediatrics",
    doctorName: "Dr. Andreas Nicolaou",
    clinicTitle: "Dr. Andreas Nicolaou — Pediatrics",
    specialty: "Pediatrics (Παιδίατρος)",
    city: "Limassol",
    coverage: "GeSY & Private"
  },
  activeScenarioKey: "urgent_fever",
  scheduleSlots: [
    {
      id: "slot-0930",
      time: "09:30 AM",
      patient: "Eleni Stavrou (Age 6)",
      phone: "+357 99 310 422",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • STANDARD",
      complaint: "Persistent dry cough (5 days), afebrile, eating well",
      notes: "GeSY Beneficiary #812044 • Lungs auscultation requested; no shortness of breath.",
      channel: "WhatsApp Text"
    },
    {
      id: "slot-1030",
      time: "10:30 AM",
      patient: "Nikolas Georgiou (Age 2)",
      phone: "+357 97 820 119",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • STANDARD",
      complaint: "18-month scheduled vaccination & growth check",
      notes: "GeSY Beneficiary #604118 • Child health booklet brought by parents.",
      channel: "Phone Call"
    },
    {
      id: "slot-1230",
      time: "12:30 PM (EMERGENCY BUFFER)",
      patient: "Leo K. (Age 4) — Maria K.",
      phone: "+357 99 614 280",
      priority: 1,
      prioLabel: "🔴 PRIORITY 1 • URGENT BUFFER UNLOCKED",
      complaint: "39.6°C fever since 22:00 last night + acute right ear pain & lethargy",
      notes: "GeSY #948201 • Red-flag screen: No neck stiffness, no breathing distress. Given Nurofen at 07:30. Photo of tympanic thermometer attached on WhatsApp.",
      channel: "Call → WhatsApp Handoff"
    },
    {
      id: "slot-1530",
      time: "03:30 PM",
      patient: "Sophia Christodoulou (Age 9)",
      phone: "+357 99 501 774",
      priority: 2,
      prioLabel: "🟡 PRIORITY 2 • PHOTO TRIAGED",
      complaint: "Spreading erythematous forearm rash (48h) — High-res photo attached",
      notes: "Private Insurance (Universal Life) • AI attached forearm photo to calendar event so doctor can review before arrival.",
      channel: "WhatsApp Photo Triage"
    },
    {
      id: "slot-1700",
      time: "05:00 PM (EMERGENCY BUFFER)",
      patient: "🔒 Reserved for 🔴 Priority 1 Urgent Cases Only",
      phone: "Hidden from routine public booking",
      priority: 0,
      prioLabel: "🔒 PROTECTED BUFFER SLOT",
      complaint: "Automatically unlocked by Sofia only if an acute Priority 1 patient calls",
      notes: "Prevents routine checkups from consuming same-day emergency capacity.",
      channel: "AI Triage Guard"
    }
  ],
  gesyQueue: [
    {
      id: "gesy-1",
      patient: "Costas Papadopoulos (Age 58)",
      gesyId: "GeSY #449102",
      request: "Monthly refill: Amlodipine 5mg + Atorvastatin 20mg (6-month chronic renewal)",
      timeSaved: "Saved 15m slot",
      approved: false
    },
    {
      id: "gesy-2",
      patient: "Despina Ioannou (Age 41)",
      gesyId: "GeSY #772819",
      request: "Repeat referral to Ophthalmology (Annual diabetic retinal check)",
      timeSaved: "Saved 15m slot",
      approved: false
    },
    {
      id: "gesy-3",
      patient: "Michalis Kyprianou (Age 64)",
      gesyId: "GeSY #319004",
      request: "Routine CBC + Lipid Panel + HbA1c lab requisition before next month's visit",
      timeSaved: "Saved 15m slot",
      approved: false
    }
  ],
  marketplaceDoctors: [
    {
      id: "mp-doc-dental-1",
      name: "Dr. Nikos Constantinou",
      specialty: "Dental",
      specialtyLabel: "🦷 Dental & Implant Clinic (Οδοντίατρος)",
      city: "Limassol",
      area: "Makarios Ave, Limassol",
      coverage: "Private & GeSY Preventive",
      rating: "5.0 ★ (384 reviews)",
      aiStatus: "WhatsApp Tooth Photo Triage & Chair Buffer Active",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 12:30 PM (30m Emergency Toothache/Crown)", urgent: true },
        { label: "Tomorrow 11:00 AM (45m Treatment)", urgent: false },
        { label: "Thu 03:00 PM (30m Scaling / Καθαρισμός)", urgent: false }
      ]
    },
    {
      id: "mp-doc-dental-2",
      name: "Dr. Marina Christoforou",
      specialty: "Dental",
      specialtyLabel: "🦷 Cosmetic & Pediatric Dental (Οδοντιατρείο)",
      city: "Nicosia",
      area: "Engomi, Nicosia",
      coverage: "Private & GeSY Preventive",
      rating: "4.9 ★ (290 reviews)",
      aiStatus: "Live Chairside AI Triage & Photo Intake",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 04:00 PM (30m Emergency Relief Slot)", urgent: true },
        { label: "Tomorrow 09:30 AM (45m Filling / Crown)", urgent: false },
        { label: "Tomorrow 03:30 PM (30m Hygiene / Checkup)", urgent: false }
      ]
    },
    {
      id: "mp-doc-1",
      name: "Dr. Andreas Nicolaou",
      specialty: "Pediatrics",
      specialtyLabel: "👶 Pediatrics (Παιδίατρος)",
      city: "Limassol",
      area: "Agios Athanasios, Limassol",
      coverage: "GeSY & Private",
      rating: "4.9 ★ (312 reviews)",
      aiStatus: "Live AI Schedule Synced",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 12:30 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 10:15 AM", urgent: false },
        { label: "Tomorrow 04:00 PM", urgent: false }
      ]
    },
    {
      id: "mp-doc-2",
      name: "Dr. Elena Georgiou",
      specialty: "Dermatology",
      specialtyLabel: "🔬 Dermatology & Mole Mapping",
      city: "Nicosia",
      area: "Strovolos, Nicosia",
      coverage: "GeSY & Private (€60)",
      rating: "5.0 ★ (428 reviews)",
      aiStatus: "WhatsApp Photo Triage Enabled",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 04:30 PM (Acute Rash Slot)", urgent: true },
        { label: "Tomorrow 11:00 AM", urgent: false },
        { label: "Thu 09:30 AM", urgent: false }
      ]
    },
    {
      id: "mp-doc-3",
      name: "Dr. Marios Petrou",
      specialty: "Cardiology",
      specialtyLabel: "❤️ Cardiology & Echo Lab",
      city: "Larnaca",
      area: "Finikoudes Medical Center, Larnaca",
      coverage: "GeSY & Private",
      rating: "4.9 ★ (275 reviews)",
      aiStatus: "Pre-Visit ECG/Lab Intake Active",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 05:15 PM (Urgent Buffer)", urgent: true },
        { label: "Tomorrow 09:00 AM", urgent: false }
      ]
    },
    {
      id: "mp-doc-4",
      name: "Dr. Katerina Loizou",
      specialty: "Pediatrics",
      specialtyLabel: "👶 Pediatrics & Neonatology",
      city: "Nicosia",
      area: "Engomi, Nicosia",
      coverage: "GeSY Personal Doctor",
      rating: "4.8 ★ (198 reviews)",
      aiStatus: "Live AI Schedule Synced",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 01:00 PM (Urgent Fever Slot)", urgent: true },
        { label: "Tomorrow 03:30 PM", urgent: false }
      ]
    },
    {
      id: "mp-doc-5",
      name: "Dr. Stavros Hadjigeorgiou",
      specialty: "ENT",
      specialtyLabel: "👂 ENT / Otolaryngology (ΩΡΛ)",
      city: "Limassol",
      area: "Makarios Ave, Limassol",
      coverage: "GeSY & Private",
      rating: "4.9 ★ (240 reviews)",
      aiStatus: "Live AI Schedule Synced",
      urgentBufferAvailable: true,
      slots: [
        { label: "🔴 Today 02:15 PM (Acute Ear/Sinus)", urgent: true },
        { label: "Tomorrow 11:30 AM", urgent: false }
      ]
    },
    {
      id: "mp-doc-6",
      name: "Dr. Chloe Constantinou",
      specialty: "Dermatology",
      specialtyLabel: "🔬 Clinical & Pediatric Dermatology",
      city: "Paphos",
      area: "Kato Paphos Medical Plaza",
      coverage: "GeSY & Private",
      rating: "4.9 ★ (164 reviews)",
      aiStatus: "WhatsApp Photo Triage Enabled",
      urgentBufferAvailable: false,
      slots: [
        { label: "Tomorrow 10:00 AM", urgent: false },
        { label: "Tomorrow 02:30 PM", urgent: false }
      ]
    }
  ]
};

// Predefined Rich Triage Scenarios
const SCENARIOS = {
  urgent_fever: {
    callerDisplay: "Patient Caller: Maria K. (+357 99 614 280)",
    statusLabel: "LIVE CALL • 🔴 PRIORITY 1 TRIAGE",
    caseId: "Case #MD-409",
    prioClass: "prio-1",
    prioPill: "🔴 PRIORITY 1 • URGENT SAME-DAY",
    prioHeadline: "Unlocks Hidden 12:30 PM Emergency Buffer Slot",
    coverage: "GeSY Beneficiary #948201",
    callTurns: [
      {
        speaker: "Sofia (AI Medical Receptionist)",
        role: "ai",
        text: "Good morning, Dr. Nicolaou's Pediatric Clinic. The doctor is currently examining a patient, so I am his AI Medical Receptionist Sofia. How can I help your child today?"
      },
      {
        speaker: "Maria K. (Mother)",
        role: "caller",
        text: "Hi, my 4-year-old son Leo has had a 39.6°C fever since last night, he's pulling his right ear crying, and he's very lethargic this morning. Can the doctor see him today?"
      },
      {
        speaker: "Sofia (AI Medical Receptionist)",
        role: "ai",
        text: "I'm sorry Leo isn't feeling well. Let me quickly check 2 red-flag questions for Dr. Nicolaou: Is Leo breathing comfortably and able to drink fluids without neck stiffness?"
      },
      {
        speaker: "Maria K. (Mother)",
        role: "caller",
        text: "Yes, his breathing is normal and he drank water after Nurofen at 7:30 AM, just acute ear pain and high fever."
      },
      {
        speaker: "Sofia (AI Medical Receptionist)",
        role: "ai",
        text: "Got it. Because of the 39.6°C fever and acute ear pain in a 4-year-old, I have flagged Leo as Priority 1 Urgent and unlocked Dr. Nicolaou's protected 12:30 PM Emergency Buffer Slot. I just sent the confirmation and pre-visit card to your WhatsApp!"
      }
    ],
    waMessages: [
      {
        dir: "incoming",
        html: `<strong>🩺 Priority 1 Urgent Slot Unlocked</strong><br/>Hello Maria! While we were on the phone, I prepared Leo's Pre-Visit Case Note for <strong>Dr. Nicolaou</strong> and unlocked today's protected emergency slot:<div class="wa-slot-card urgent"><div class="wa-slot-title">🔴 Today at 12:30 PM (Emergency Buffer Slot)</div><div style="font-size:0.72rem; color:#475569;">Patient: Leo K. (4y) • Chief Complaint: 39.6°C fever + acute right otalgia</div><div class="wa-slot-btn-row"><button type="button" class="wa-slot-btn urgent" onclick="confirmSuggestedSlot()">✓ Confirm 12:30 PM Urgent Slot</button><button type="button" class="wa-slot-btn secondary" onclick="simulatePatientPhotoUpload()">📷 Attach Thermometer / Ear Photo</button></div></div>`
      },
      {
        dir: "outgoing",
        html: `Thank you! Confirming 12:30 PM. GeSY ID is #948201.`
      },
      {
        dir: "incoming",
        html: `✅ <strong>Confirmed for Today at 12:30 PM!</strong><br/>Dr. Nicolaou already has your 3-bullet Case Note on his screen:<br/>• <strong>Sx:</strong> 39.6°C fever (12h) + acute R ear pain<br/>• <strong>Meds:</strong> Nurofen given 07:30 AM<br/>• <strong>Red Flags:</strong> Negative (breathing normal, taking fluids)`
      }
    ],
    caseFields: [
      { label: "Patient & Coverage", val: "Leo K. (Age 4) • GeSY #948201", full: false },
      { label: "Triage Score & Action", val: "🔴 P1 Urgent → Unlocked 12:30 PM Buffer", full: false },
      { label: "Chief Complaint & Duration", val: "39.6°C fever since 22:00 last night + acute right ear pain (otalgia) & lethargy", full: true },
      { label: "Red-Flag Screen & Meds", val: "✓ Breathing normal, drinking fluids, no neck stiffness. Last dose: Ibuprofen (Nurofen) at 07:30 AM.", full: true }
    ],
    logs: [
      "[10:14:02] SIP_INBOUND +35799614280 → Doctor in Exam Room 1 → AI Sofia answered in 180ms",
      "[10:14:19] CLINICAL_INTAKE extracted: age=4y, temp=39.6C, sx=['acute_otalgia','lethargy'], red_flags=false",
      "[10:14:20] PRIORITY_ENGINE score=P1_URGENT (Rule: Pediatric Fever >39.0C + Acute Pain)",
      "[10:14:21] CALENDAR_GUARD unlocked hidden 12:30 PM Emergency Buffer Slot & pinned SOAP Note #MD-409"
    ]
  },

  dental_emergency: {
    callerDisplay: "Patient Caller: Dimitris A. (+357 99 845 120)",
    statusLabel: "LIVE CALL + PHOTO • 🔴 DENTAL P1 URGENT",
    caseId: "Case #MD-415",
    prioClass: "prio-1",
    prioPill: "🔴 PRIORITY 1 • 30-MIN EMERGENCY CHAIR SLOT",
    prioHeadline: "Unlocks 12:30 PM Emergency Relief Slot + Attaches Tooth Photo",
    coverage: "Private Dental (€120 Emergency / Crown Repair)",
    callTurns: [
      {
        speaker: "Sofia (AI Dental Receptionist)",
        role: "ai",
        text: "Good morning, Dr. Nikos Constantinou's Dental & Implant Clinic. Dr. Constantinou currently has both hands chairside in Surgery Chair 1 with gloves on mid-procedure, so I am his AI Receptionist Sofia. How can I help with your teeth today?"
      },
      {
        speaker: "Dimitris A. (Patient)",
        role: "caller",
        text: "Hi, I fractured my upper-right premolar crown biting something hard at breakfast and I have sharp throbbing pain—8 out of 10—whenever air or cold water touches it. I have client meetings all day tomorrow, can Dr. Constantinou see me today?"
      },
      {
        speaker: "Sofia (AI Dental Receptionist)",
        role: "ai",
        text: "I'm sorry you're in pain, Dimitris—let's get you into the chair today. Quick dental red-flag screen for Dr. Constantinou: Do you have any facial swelling spreading toward your eye or neck, fever, or uncontrolled bleeding? Also, can you snap a quick smartphone photo on WhatsApp so the dentist knows whether to prepare composite bonding or temporary crown cement?"
      },
      {
        speaker: "Dimitris A. (Patient)",
        role: "caller",
        text: "No facial swelling, no fever, and no bleeding—just the fractured crown piece and sharp sensitivity. I'll send a smartphone photo on WhatsApp right now."
      },
      {
        speaker: "Sofia (AI Dental Receptionist)",
        role: "ai",
        text: "Perfect. I have triaged this as a Priority 1 Dental Emergency, unlocked Dr. Constantinou's protected 12:30 PM 30-Minute Emergency Chair Slot, and sent your WhatsApp confirmation and photo upload prompt so Chair 1 is prepped before you walk in!"
      }
    ],
    waMessages: [
      {
        dir: "outgoing",
        html: `📷 <strong>[Attached Photo: tooth_fracture_UR4.jpg]</strong><br/>Here is the fractured upper-right premolar (#14) and the porcelain crown piece.`
      },
      {
        dir: "incoming",
        html: `<strong>🦷 Priority 1 Dental Emergency Slot Unlocked (#MD-415)</strong><br/>Thank you Dimitris! I attached <code>tooth_fracture_UR4.jpg</code> to Dr. Constantinou's Chair 1 calendar and locked your emergency relief slot:<div class="wa-slot-card urgent"><div class="wa-slot-title">🔴 Today at 12:30 PM (30-Min Emergency Chair Slot)</div><div style="font-size:0.72rem; color:#475569;">Patient: Dimitris A. • Tooth #14 Crown Fracture &amp; Acute Thermal Pain (8/10)</div><div class="wa-slot-btn-row"><button type="button" class="wa-slot-btn urgent" onclick="confirmSuggestedSlot()">✓ Confirm 12:30 PM Chair Slot</button><button type="button" class="wa-slot-btn secondary" onclick="simulatePatientPhotoUpload()">📷 Upload Extra X-Ray / Photo</button></div></div>`
      },
      {
        dir: "incoming",
        html: `✅ <strong>3-Bullet Dental SOAP Note Pinned for Dr. Constantinou:</strong><br/>• <strong>Tooth/Site:</strong> Upper Right Premolar (#14) — fractured porcelain crown<br/>• <strong>Pain/Pulp Status:</strong> 8/10 sharp thermal sensitivity, no facial swelling, no fever<br/>• <strong>Tray Prep:</strong> Temporary crown cement / composite bonding tray pre-flagged for nurse`
      }
    ],
    caseFields: [
      { label: "Patient & Coverage", val: "Dimitris A. (+357 99 845 120) • Private Dental (€120 Emergency / Crown Repair)", full: false },
      { label: "Chair Slot & Duration", val: "🔴 P1 Urgent → Today 12:30 PM (30m Emergency Chair Slot)", full: false },
      { label: "Tooth / Site & Photo Intake", val: "Upper Right Premolar (#14) — fractured porcelain crown + 8/10 sharp thermal sensitivity. Smartphone photo attached (tooth_fracture_UR4.jpg).", full: true },
      { label: "Red-Flag Screen & Tray Prep", val: "✓ No facial swelling, no fever, no bleeding. Temporary crown cement / composite bonding tray pre-flagged for nurse in Chair 1.", full: true }
    ],
    logs: [
      "[10:29:04] SIP_INBOUND +35799845120 → Dentist Chairside (Surgery Chair 1, Gloves On) → AI Sofia answered in 160ms",
      "[10:29:18] DENTAL_TRIAGE extracted: site=UR4_tooth_14, sx=['crown_fracture','thermal_pain_8_10'], swelling=false",
      "[10:29:22] WA_MEDIA_INGEST attached intraoral photo 'tooth_fracture_UR4.jpg' to Case #MD-415",
      "[10:29:23] CHAIR_SCHEDULER unlocked 12:30 PM (30m Emergency Chair Slot) & flagged nurse for Crown/Composite Tray"
    ]
  },

  soon_rash: {
    callerDisplay: "WhatsApp Intake: Andreas M. (+357 99 208 511)",
    statusLabel: "WHATSAPP PHOTO TRIAGE • 🟡 PRIORITY 2",
    caseId: "Case #MD-410",
    prioClass: "prio-2",
    prioPill: "🟡 PRIORITY 2 • SEE WITHIN 24–48H",
    prioHeadline: "Photo Pre-Attached • Booked Next Standard Slot (Tomorrow 10:15 AM)",
    coverage: "Private / Universal Life",
    callTurns: [
      {
        speaker: "Andreas M. (Patient Voice Note)",
        role: "caller",
        text: "🎙️ [WhatsApp Voice Note 0:14]: 'Hi doctor's office, I noticed a red circular rash on my forearm 2 days ago that is itchy and spreading slightly. No fever. Can I send a photo and book a check?'"
      },
      {
        speaker: "Sofia (AI Medical Receptionist)",
        role: "ai",
        text: "Hello Andreas! I transcribed your voice note. Because you have no fever, breathing issue, or facial swelling, this is triaged as Priority 2 (Within 24–48h). Please send a clear photo of your forearm on WhatsApp so the doctor can inspect it alongside your booking."
      }
    ],
    waMessages: [
      {
        dir: "outgoing",
        html: `📷 <strong>[Attached Image: forearm_rash_day2.jpg]</strong><br/>Here is the photo from this morning. It itches mildly, no fever.`
      },
      {
        dir: "incoming",
        html: `<strong>🩺 Photo Attached to Case Note #MD-410</strong><br/>Thank you Andreas! I attached your high-resolution photo directly to the doctor's schedule card and reserved our next Priority 2 consultation slot:<div class="wa-slot-card"><div class="wa-slot-title">🟡 Tomorrow at 10:15 AM (Standard Priority 2 Slot)</div><div style="font-size:0.72rem; color:#475569;">Note: Today's 12:30 PM emergency slot stays protected for acute fevers, while your photo is queued for doctor review today.</div><div class="wa-slot-btn-row"><button type="button" class="wa-slot-btn" onclick="confirmSuggestedSlot()">✓ Confirm Tomorrow 10:15 AM</button></div></div>`
      }
    ],
    caseFields: [
      { label: "Patient & Coverage", val: "Andreas M. (Age 34) • Private (€60)", full: false },
      { label: "Triage Score & Action", val: "🟡 P2 Soon → Tomorrow 10:15 AM + Photo", full: false },
      { label: "Chief Complaint & Media", val: "Erythematous pruritic rash on right forearm (48h duration). High-res photo attached (`forearm_rash_day2.jpg`).", full: true },
      { label: "Red-Flag Screen", val: "✓ Afebrile, no mucosal involvement, no anaphylaxis signs. Safe for 24h slot.", full: true }
    ],
    logs: [
      "[10:18:05] WA_VOICENOTE +35799208511 transcribed via Whisper ASR (320ms)",
      "[10:18:09] WA_MEDIA_INGEST saved `forearm_rash_day2.jpg` to patient encounter #MD-410",
      "[10:18:10] PRIORITY_ENGINE score=P2_SOON (Protected 12:30 PM emergency slot; offered Tomorrow 10:15 AM)"
    ]
  },

  routine_gesy: {
    callerDisplay: "Patient Caller: Costas P. (+357 99 449 102)",
    statusLabel: "ASYNC GeSY FILTER • 🟢 PRIORITY 3",
    caseId: "Case #MD-411",
    prioClass: "prio-3",
    prioPill: "🟢 PRIORITY 3 • ASYNC GeSY QUEUE",
    prioHeadline: "Zero Calendar Slot Wasted • Added to 5-Min End-of-Day GeSY Batch",
    coverage: "GeSY Beneficiary #449102",
    callTurns: [
      {
        speaker: "Sofia (AI Medical Receptionist)",
        role: "ai",
        text: "Good morning! You've reached the AI Reception Desk. The doctor is with a patient right now—how can I assist you?"
      },
      {
        speaker: "Costas P. (Patient)",
        role: "caller",
        text: "Hello, I don't need an exam, I just need the doctor to renew my monthly GeSY blood pressure pills (Amlodipine 5mg) before I go to the pharmacy."
      },
      {
        speaker: "Sofia (AI Medical Receptionist)",
        role: "ai",
        text: "I can take care of that without making you come in or wait on hold! Confirming Costas Papadopoulos, GeSY ID #449102, Amlodipine 5mg + Atorvastatin 20mg. Any new dizziness or blood pressure readings above 140/90?"
      },
      {
        speaker: "Costas P. (Patient)",
        role: "caller",
        text: "No, my pressure is 122/78 every morning."
      },
      {
        speaker: "Sofia (AI Medical Receptionist)",
        role: "ai",
        text: "Perfect. I logged your BP reading (122/78) and added your renewal to the doctor's 1-Click End-of-Day GeSY Approval Queue. You'll receive a WhatsApp message as soon as it's signed!"
      }
    ],
    waMessages: [
      {
        dir: "incoming",
        html: `<strong>🟢 GeSY Prescription Logged (#MD-411)</strong><br/>Hello Mr. Papadopoulos! Your renewal request is in the doctor's <strong>End-of-Day GeSY Queue</strong>:<br/>• <strong>Medication:</strong> Amlodipine 5mg (GeSY #449102)<br/>• <strong>Home BP Logged:</strong> 122/78 mmHg (Stable)<br/>• <strong>Status:</strong> Doctor approves batch at 1:30 PM — we will message you here as soon as the pharmacy code is active!`
      }
    ],
    caseFields: [
      { label: "Patient & GeSY ID", val: "Costas Papadopoulos • GeSY #449102", full: false },
      { label: "Triage Score & Action", val: "🟢 P3 Routine → EOD GeSY Batch Queue", full: false },
      { label: "Admin Request Summary", val: "Repeat chronic GeSY prescription: Amlodipine 5mg + Atorvastatin 20mg. Saves a 20-minute in-person slot.", full: true },
      { label: "Safety Check", val: "✓ Home BP 122/78 mmHg, zero side effects reported. Ready for 1-click approval.", full: true }
    ],
    logs: [
      "[10:21:11] SIP_INBOUND +35799449102 → Intent classified: GESY_PRESCRIPTION_RENEWAL",
      "[10:21:24] PRIORITY_ENGINE score=P3_ASYNC_GESY (0 calendar slots consumed — saved 20 min)",
      "[10:21:25] GESY_BATCH_QUEUE appended item #gesy-1 for 1-click doctor sign-off"
    ]
  },

  greek_urgent: {
    callerDisplay: "Κλήση Ασθενούς: Ελένη Μ. (+357 99 712 900)",
    statusLabel: "ΖΩΝΤΑΝΗ ΚΛΗΣΗ (EL) • 🔴 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 1",
    caseId: "Case #MD-412",
    prioClass: "prio-1",
    prioPill: "🔴 ΠΡΟΤΕΡΑΙΟΤΗΤΑ 1 • ΕΠΕΙΓΟΝ ΣΗΜΕΡΑ",
    prioHeadline: "Ξεκλείδωμα Κρυφού Επείγοντος Ραντεβού 12:30 μ.μ.",
    coverage: "Δικαιούχος ΓεΣΥ #903115",
    callTurns: [
      {
        speaker: "Σοφία (AI Ιατρική Γραμματεία)",
        role: "ai",
        text: "Καλημέρα σας! Καλέσατε στο ιατρείο. Ο γιατρός εξετάζει ασθενή αυτή τη στιγμή, είμαι η Σοφία, η ψηφιακή βοηθός του. Πώς μπορώ να σας βοηθήσω;"
      },
      {
        speaker: "Ελένη Μ. (Μητέρα)",
        role: "caller",
        text: "Γεια σας, ο γιος μου έχει πυρετό 39.5 από χθες το βράδυ και πονάει πολύ το αυτί του, μπορεί να μας δει ο γιατρός σήμερα;"
      },
      {
        speaker: "Σοφία (AI Ιατρική Γραμματεία)",
        role: "ai",
        text: "Περαστικά του! Λόγω υψηλού πυρετού (39.5°C) και οξέος πόνου στο αυτί, το περιστατικό κατατάσσεται ως Προτεραιότητα 1 (Επείγον). Ξεκλείδωσα το ειδικό επείγον κενό του γιατρού σήμερα στις 12:30 μ.μ. και σας έστειλα επιβεβαίωση στο WhatsApp!"
      }
    ],
    waMessages: [
      {
        dir: "incoming",
        html: `<strong>🔴 Επείγον Ραντεβού (Προτεραιότητα 1)</strong><br/>Καλημέρα κα Ελένη! Κρατήσαμε το επείγον ραντεβού σήμερα στις <strong>12:30 μ.μ.</strong> και ενημερώσαμε τον φάκελο του γιατρού:<div class="wa-slot-card urgent"><div class="wa-slot-title">🔴 Σήμερα 12:30 μ.μ. (Επείγον Buffer Slot)</div><div style="font-size:0.72rem; color:#475569;">Συμπτώματα: Πυρετός 39.5°C + Οξύς πόνος στο αυτί • ΓεΣΥ #903115</div><div class="wa-slot-btn-row"><button type="button" class="wa-slot-btn urgent" onclick="confirmSuggestedSlot()">✓ Επιβεβαίωση 12:30 μ.μ.</button></div></div>`
      }
    ],
    caseFields: [
      { label: "Ασθενής & Κάλυψη", val: "Γιώργος Μ. (5 ετών) • ΓεΣΥ #903115", full: false },
      { label: "Προτεραιότητα", val: "🔴 P1 Επείγον → Σήμερα 12:30 μ.μ.", full: false },
      { label: "Σημείωση Περιστατικού (Case Note)", val: "Πυρετός 39.5°C από χθες βράδυ + οξύς πόνος στο δεξί αυτί. Χωρίς δύσπνοια.", full: true },
      { label: "Γλώσσα Φωνητικής Διαλογής", val: "🇬🇷/🇨🇾 Ελληνικά (Αυτόματη απομαγνητοφώνηση & σύνοψη φακέλου)", full: true }
    ],
    logs: [
      "[10:25:01] SIP_INBOUND_EL +35799712900 → Greek Medical ASR (290ms)",
      "[10:25:14] PRIORITY_ENGINE score=P1_URGENT → Unlocked 12:30 PM Emergency Buffer Slot",
      "[10:25:15] WHATSAPP_TEMPLATE sent in Greek + SOAP Case Note attached to Doctor Calendar"
    ]
  }
};

// ============================================================================
// Brand & Logo Switcher (MyDocDesk vs MyDocDeskAI + Bell vs Cross Shield)
// ============================================================================
function setBrandVariant(newBrandKey, newIconKey, silent) {
  state.brandKey = "mydocdesk";
  if (newIconKey) state.iconKey = newIconKey;

  const brandPlain = "MyDocDesk";
  const domainText = "mydocdesk.com";
  const ICON_META = {
    schedule_navy: {
      path: "./assets/icon-schedule-gold-navy.png",
      label: "Schedule Shield + Gold/Navy/Teal (v1)",
      tagline: "INTELLIGENT MEDICAL RECEPTION • AI Voice & WhatsApp Triage"
    },
    schedule_gold: {
      path: "./assets/icon-schedule-gold-cross.png",
      label: "Gold Cross + Schedule Shield (v2)",
      tagline: "INTELLIGENT MEDICAL RECEPTION • AI Voice & WhatsApp Triage"
    },
    bell: {
      path: "./assets/icon-bell.png",
      label: "Reception Bell + Stethoscope",
      tagline: "INTELLIGENT MEDICAL RECEPTION • AI Voice & WhatsApp Triage"
    },
    cross: {
      path: "./assets/icon-cross.png",
      label: "Cool Navy/Teal Schedule Shield",
      tagline: "SMART TRIAGE AND SCHEDULING • AI Voice & WhatsApp Triage"
    }
  };

  const meta = ICON_META[state.iconKey] || ICON_META.schedule_navy;

  const topbarImg = document.getElementById("topbar-logo-img");
  if (topbarImg) topbarImg.src = meta.path;

  const waImg = document.getElementById("wa-logo-img");
  if (waImg) waImg.src = meta.path;

  const domainPill = document.getElementById("topbar-domain-pill");
  if (domainPill) domainPill.textContent = domainText;

  const taglineEl = document.getElementById("topbar-tagline");
  if (taglineEl) taglineEl.textContent = meta.tagline;

  document.title = `${brandPlain} (${domainText}) — ${meta.tagline}`;

  document.querySelectorAll(".js-brand-name").forEach((el) => {
    el.textContent = brandPlain;
  });

  ["schedule_navy", "schedule_gold", "bell", "cross"].forEach((k) => {
    document.getElementById(`btn-icon-${k}`)?.classList.toggle("active", k === state.iconKey);
    document.getElementById(`studio-card-${k}`)?.classList.toggle("active", k === state.iconKey);
  });

  const activePill = document.getElementById("active-brand-pill");
  if (activePill) {
    activePill.textContent = `Active: ${brandPlain} • ${meta.label} (${domainText})`;
  }

  if (!silent) showToast(`✨ Active MyDocDesk logo set to: ${meta.label}!`);
}

// ============================================================================
// Tab Navigation
// ============================================================================
function switchTab(tabId) {
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${tabId}`);
  });
  document.querySelectorAll(".nav-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function jumpToMobileSection(elementId, btnEl) {
  switchTab("simulator");
  document.querySelectorAll(".mjump-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  const target = document.getElementById(elementId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ============================================================================
// Clinic / Doctor Customizer
// ============================================================================
const CLINIC_PRESETS = {
  pediatrics: {
    id: "pediatrics",
    doctorName: "Dr. Andreas Nicolaou",
    clinicTitle: "Dr. Andreas Nicolaou — Pediatrics",
    specialty: "Pediatrics (Παιδίατρος)",
    city: "Limassol",
    coverage: "GeSY & Private"
  },
  dental: {
    id: "dental",
    doctorName: "Dr. Nikos Constantinou",
    clinicTitle: "Dr. Nikos Constantinou — Dental & Implant Clinic",
    specialty: "Dental & Implantology (Οδοντιατρείο)",
    city: "Limassol",
    coverage: "Private & GeSY Preventive"
  },
  dermatology: {
    id: "dermatology",
    doctorName: "Dr. Elena Georgiou",
    clinicTitle: "Dr. Elena Georgiou — Dermatology & Laser",
    specialty: "Dermatology",
    city: "Nicosia",
    coverage: "GeSY & Private"
  },
  cardiology: {
    id: "cardiology",
    doctorName: "Dr. Marios Petrou",
    clinicTitle: "Dr. Marios Petrou — Cardiology Center",
    specialty: "Cardiology",
    city: "Larnaca",
    coverage: "GeSY & Private"
  }
};

function selectClinicPreset(presetKey, btnEl) {
  const preset = CLINIC_PRESETS[presetKey];
  if (!preset) return;
  state.activeClinic = { ...preset };
  document.querySelectorAll(".preset-pill").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  applyClinicBranding();
  if (presetKey === "dental") {
    state.scheduleSlots = DENTAL_SCHEDULE_SLOTS.map((s) => ({ ...s }));
    renderDoctorSchedule();
    triggerScenario("dental_emergency", document.getElementById("btn-scen-dental"));
    showToast("🦷 Switched to Dr. Nikos Constantinou — Dental & Implant Clinic (30m Emergency Chair Buffer + Photo Intake Active)!");
  } else if (presetKey === "dermatology") {
    state.scheduleSlots = MEDICAL_SCHEDULE_SLOTS.map((s) => ({ ...s }));
    renderDoctorSchedule();
    triggerScenario("soon_rash", document.getElementById("btn-scen-soon"));
  } else if (presetKey === "cardiology") {
    state.scheduleSlots = MEDICAL_SCHEDULE_SLOTS.map((s) => ({ ...s }));
    renderDoctorSchedule();
    triggerScenario("routine_gesy", document.getElementById("btn-scen-gesy"));
  } else {
    state.scheduleSlots = MEDICAL_SCHEDULE_SLOTS.map((s) => ({ ...s }));
    renderDoctorSchedule();
    triggerScenario("urgent_fever", document.getElementById("btn-scen-urgent"));
  }
}

function applyCustomClinicForm(e) {
  e.preventDefault();
  const input = document.getElementById("custom-clinic-name-input");
  const name = (input?.value || "").trim();
  if (!name) return;
  state.activeClinic = {
    doctorName: name,
    clinicTitle: name,
    specialty: "Specialist Clinic",
    city: "Cyprus"
  };
  document.querySelectorAll(".preset-pill").forEach((b) => b.classList.remove("active"));
  applyClinicBranding();
  showToast(`🩺 AI Medical Receptionist Sofia is now answering for ${name}!`);
}

function applyClinicBranding() {
  const c = state.activeClinic;
  const step1Label = document.getElementById("step1-clinic-label");
  if (step1Label) step1Label.textContent = c.clinicTitle;
  const busyDoc = document.getElementById("busy-doc-name");
  if (busyDoc) busyDoc.textContent = c.doctorName;
  const callTitle = document.getElementById("call-clinic-title");
  if (callTitle) callTitle.textContent = c.clinicTitle;
  const waTitle = document.getElementById("wa-clinic-title");
  if (waTitle) waTitle.textContent = c.clinicTitle;
}

// ============================================================================
// Scenario Rendering & Interactive Triage Flow
// ============================================================================
function triggerScenario(scenKey, btnEl) {
  const scen = SCENARIOS[scenKey];
  if (!scen) return;
  state.activeScenarioKey = scenKey;

  if (btnEl) {
    document.querySelectorAll(".scenario-btn").forEach((b) => b.classList.remove("active"));
    btnEl.classList.add("active");
  }

  document.getElementById("caller-phone-display").textContent = scen.callerDisplay;
  document.getElementById("call-status-label").textContent = scen.statusLabel;
  document.getElementById("case-id-badge").textContent = scen.caseId;
  document.getElementById("case-note-coverage").textContent = scen.coverage;

  // Render Call Transcript
  const callList = document.getElementById("call-transcript-list");
  callList.innerHTML = scen.callTurns
    .map(
      (t) => `
      <div class="turn-bubble ${t.role}">
        <span class="turn-speaker">${t.speaker}</span>
        <div>${t.text}</div>
      </div>`
    )
    .join("");

  // Render WhatsApp Thread
  const waList = document.getElementById("wa-messages-list");
  waList.innerHTML = scen.waMessages
    .map((m) => `<div class="wa-msg ${m.dir}">${m.html}</div>`)
    .join("");

  // Render Priority Banner
  const prioBanner = document.getElementById("triage-prio-banner");
  prioBanner.className = `prio-banner ${scen.prioClass}`;
  document.getElementById("triage-prio-pill").textContent = scen.prioPill;
  document.getElementById("triage-prio-headline").textContent = scen.prioHeadline;

  // Render Case Note Fields
  const caseGrid = document.getElementById("case-note-grid");
  caseGrid.innerHTML = scen.caseFields
    .map(
      (f) => `
      <div class="case-field ${f.full ? "full" : ""}">
        <div class="case-field-label">${f.label}</div>
        <div class="case-field-val">${f.val}</div>
      </div>`
    )
    .join("");

  // Render Execution Logs
  const logsList = document.getElementById("execution-logs-list");
  logsList.innerHTML = scen.logs.map((l) => `<div class="log-item">${l}</div>`).join("");

  if (state.voiceAudioEnabled && scen.callTurns.length > 0) {
    const lastAi = [...scen.callTurns].reverse().find((t) => t.role === "ai");
    if (lastAi) speakSofiaText(lastAi.text, scenKey === "greek_urgent" ? "el-GR" : "en-GB");
  }
}

// ============================================================================
// 4-Step Interactive Guided Tour
// ============================================================================
function playClinicRingtone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    [0, 0.22].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now + offset);
      gain.gain.setValueAtTime(0.08, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.17);
    });
  } catch (_) {}
}

function runInteractiveStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`step-card-${i}`)?.classList.toggle("active", i === stepNum);
  }

  if (stepNum === 1) {
    playClinicRingtone();
    triggerScenario("urgent_fever", document.getElementById("btn-scen-urgent"));
    showToast("📞 Step 1: Patient calls while Dr. Nicolaou is in Exam Room 1 — AI Sofia answers immediately!");
  } else if (stepNum === 2) {
    showToast("🩺 Step 2: Sofia screens red flags & scores Leo (39.6°C fever + acute ear pain) as 🔴 PRIORITY 1!");
    document.getElementById("triage-prio-banner")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else if (stepNum === 3) {
    showToast("🔓 Step 3: Sofia unlocks Dr. Nicolaou's hidden 12:30 PM Emergency Buffer Slot!");
  } else if (stepNum === 4) {
    confirmSuggestedSlot();
  }
}

function startGuidedTour() {
  if (state.guidedTimer) {
    clearInterval(state.guidedTimer);
    state.guidedTimer = null;
  }
  const btn = document.getElementById("btn-guided-demo");
  if (btn) {
    btn.classList.add("playing");
    btn.textContent = "⏳ Running 4-Step Triage Demo...";
  }
  let step = 1;
  runInteractiveStep(step);
  state.guidedTimer = setInterval(() => {
    step += 1;
    if (step <= 4) {
      runInteractiveStep(step);
    } else {
      clearInterval(state.guidedTimer);
      state.guidedTimer = null;
      if (btn) {
        btn.classList.remove("playing");
        btn.textContent = "▶ Replay Guided Triage Demo";
      }
    }
  }, 2600);
}

function confirmSuggestedSlot() {
  const waList = document.getElementById("wa-messages-list");
  if (!waList) return;
  const passDiv = document.createElement("div");
  passDiv.className = "wa-msg incoming";
  passDiv.innerHTML = `✅ <strong>Appointment Locked &amp; Case Note Pinned!</strong><br/>Dr. ${state.activeClinic.doctorName} now sees your structured 3-bullet Pre-Visit Case Note on his schedule. Reply here anytime to attach photos or lab results.`;
  waList.appendChild(passDiv);
  waList.scrollTop = waList.scrollHeight;
  showToast(`✅ Confirmed slot & attached Pre-Visit Case Note to ${state.activeClinic.doctorName}'s live schedule!`);
}

function simulatePatientPhotoUpload() {
  const waList = document.getElementById("wa-messages-list");
  if (!waList) return;
  const outMsg = document.createElement("div");
  outMsg.className = "wa-msg outgoing";
  outMsg.innerHTML = `📷 <strong>[Uploaded Photo: patient_symptom_photo.jpg]</strong><br/>Attached photo for the doctor to review before our appointment.`;
  waList.appendChild(outMsg);

  const inMsg = document.createElement("div");
  inMsg.className = "wa-msg incoming";
  inMsg.innerHTML = `🩺 <strong>Photo Added to Doctor's Case Card!</strong><br/>I attached <code>patient_symptom_photo.jpg</code> directly onto your calendar slot so ${state.activeClinic.doctorName} can inspect it before you walk in.`;
  waList.appendChild(inMsg);
  waList.scrollTop = waList.scrollHeight;

  showToast("📷 Symptom photo attached to the Doctor's Pre-Visit Case Note!");
}

// ============================================================================
// Custom Patient Prompts & Live Triage Classifier
// ============================================================================
function sendQuickPrompt(channel, text) {
  handlePatientTurn(channel, text);
}

function sendCustomTurn(e, channel) {
  e.preventDefault();
  const inputId = channel === "voice" ? "voice-custom-input" : "wa-custom-input";
  const input = document.getElementById(inputId);
  const text = (input?.value || "").trim();
  if (!text) return;
  input.value = "";
  handlePatientTurn(channel, text);
}

function handlePatientTurn(channel, text) {
  const lower = text.toLowerCase();
  const isGreek = /[α-ωάέήίόύώ]/i.test(text);
  const isDental = /tooth|teeth|dentist|dental|toothache|crown|filling|root canal|implant|cleaning|scaling|gum|molar|δόντ|δοντ|οδοντ|σφράγισμ|σφραγισμ|καθαρισμ|απονεύρωσ|ούλ/.test(lower);
  const isDentalHygiene = /cleaning|scaling|whitening|polish|hygiene|checkup|καθαρισμ|λεύκανσ|έλεγχ/.test(lower);
  const isUrgent = /39|40|fever|ear|pain|urgent|blood|breath|broke|broken|fractur|swell|throbb|πυρετ|πον|επείγ|σήμερα|έσπασ|πρήξ/.test(lower);
  const isGesy = /gesy|prescription|refill|renew|pills|γεσυ|συνταγ|φάρμακ/.test(lower);

  let aiReply = "";
  let prioClass = "prio-2";
  let prioPill = "🟡 PRIORITY 2 • STANDARD SLOT";
  let prioHeadline = "Booked Next Available Standard Slot (Tomorrow 10:15 AM)";

  if (isDental) {
    if (isDentalHygiene && !isUrgent) {
      prioClass = "prio-3";
      prioPill = "🟢 PRIORITY 3 • 30-MIN HYGIENE / SCALING SLOT";
      prioHeadline = "Routed to Non-Peak 30m Ultrasonic Scaling (Καθαρισμός) Slot";
      aiReply = isGreek
        ? "Καταχώρησα το αίτημά σας για οδοντιατρικό καθαρισμό / προληπτικό έλεγχο (Προτεραιότητα 3 — 30 λεπτά) σε απογευματινό ραντεβού ώστε να προστατευθούν τα επείγοντα χειρουργικά κενά!"
        : "I have triaged your routine dental scaling & polishing (καθαρισμός) into a 30-minute non-peak hygiene slot so the dentist's morning surgical blocks stay open for emergencies!";
    } else if (isUrgent) {
      prioClass = "prio-1";
      prioPill = "🔴 PRIORITY 1 • 30-MIN EMERGENCY CHAIR SLOT";
      prioHeadline = "Unlocks 12:30 PM Emergency Chair Buffer + Requests Tooth Photo";
      aiReply = isGreek
        ? "Λόγω οξέος οδοντικού πόνου / θραύσης δοντιού, το περιστατικό κατατάσσεται ως Οδοντιατρικό Επείγον (Προτεραιότητα 1). Ξεκλείδωσα το 30λεπτο επείγον κενό στις 12:30 μ.μ. — στείλτε μας μια φωτογραφία στο WhatsApp για να ετοιμάσουμε τον δίσκο εργαλείων!"
        : `Because you have an acute dental emergency (broken tooth/crown or severe toothache), I unlocked ${state.activeClinic.doctorName}'s 12:30 PM 30-Minute Emergency Chair Slot and flagged the nurse to prep the bonding/crown tray. Please snap a quick tooth photo on WhatsApp!`;
    } else {
      prioClass = "prio-2";
      prioPill = "🟡 PRIORITY 2 • 45–60 MIN DENTAL TREATMENT SLOT";
      prioHeadline = "Booked 45m Dental Treatment Block (Tomorrow 11:00 AM) + Photo/X-Ray Intake";
      aiReply = isGreek
        ? "Κατέγραψα το οδοντιατρικό ιστορικό σας (Προτεραιότητα 2 — 45λεπτο ραντεβού θεραπείας/σφραγίσματος/εμφυτεύματος). Στείλτε μας φωτογραφία ή ακτινογραφία στο WhatsApp!"
        : "I have logged your dental treatment case (Priority 2 — 45-to-60 minute clinical chair slot for filling, root canal, or implant consult) for Tomorrow at 11:00 AM. Feel free to attach a smartphone photo or X-ray on WhatsApp!";
    }
  } else if (isUrgent) {
    prioClass = "prio-1";
    prioPill = "🔴 PRIORITY 1 • URGENT SAME-DAY";
    prioHeadline = "Unlocks Hidden 12:30 PM Emergency Buffer Slot";
    aiReply = isGreek
      ? "Λόγω των οξέων συμπτωμάτων, το περιστατικό κατατάσσεται ως Προτεραιότητα 1 (Επείγον). Ξεκλείδωσα το επείγον ραντεβού στις 12:30 μ.μ. και ενημέρωσα τον φάκελο του γιατρού!"
      : `Because you described acute symptoms, I have triaged this as Priority 1 Urgent, unlocked ${state.activeClinic.doctorName}'s 12:30 PM Emergency Buffer Slot, and attached your Case Note!`;
  } else if (isGesy) {
    prioClass = "prio-3";
    prioPill = "🟢 PRIORITY 3 • ASYNC GeSY QUEUE";
    prioHeadline = "Zero Clinic Slot Wasted • Added to End-of-Day GeSY Batch";
    aiReply = isGreek
      ? "Καταχώρησα το αίτημα συνταγογράφησης ΓεΣΥ στη λίστα έγκρισης του γιατρού χωρίς να χρειαστεί επίσκεψη!"
      : "I have logged your GeSY prescription renewal into the doctor's 5-Minute End-of-Day Approval Queue so you don't need to wait or book an exam slot!";
  } else {
    aiReply = isGreek
      ? "Κατέγραψα το ιστορικό σας (Προτεραιότητα 2). Το επόμενο διαθέσιμο ραντεβού είναι αύριο στις 10:15 π.μ. Στείλτε μας φωτογραφία ή εξετάσεις στο WhatsApp!"
      : "I have created your Pre-Visit Case Note (Priority 2). Our next available consultation slot is Tomorrow at 10:15 AM—feel free to send any photo or lab PDF here on WhatsApp!";
  }

  if (channel === "voice") {
    const callList = document.getElementById("call-transcript-list");
    callList.insertAdjacentHTML(
      "beforeend",
      `<div class="turn-bubble caller"><span class="turn-speaker">Patient Caller</span><div>${text}</div></div>
       <div class="turn-bubble ai"><span class="turn-speaker">Sofia (AI Medical Receptionist)</span><div>${aiReply}</div></div>`
    );
    callList.scrollTop = callList.scrollHeight;
  } else {
    const waList = document.getElementById("wa-messages-list");
    waList.insertAdjacentHTML(
      "beforeend",
      `<div class="wa-msg outgoing">${text}</div>
       <div class="wa-msg incoming"><strong>🩺 Sofia (AI Triage):</strong> ${aiReply}</div>`
    );
    waList.scrollTop = waList.scrollHeight;
  }

  // Update Priority Banner & Case Note Card live
  const prioBanner = document.getElementById("triage-prio-banner");
  prioBanner.className = `prio-banner ${prioClass}`;
  document.getElementById("triage-prio-pill").textContent = prioPill;
  document.getElementById("triage-prio-headline").textContent = prioHeadline;

  const caseGrid = document.getElementById("case-note-grid");
  caseGrid.innerHTML = `
    <div class="case-field"><div class="case-field-label">Patient Channel</div><div class="case-field-val">${channel === "voice" ? "📞 Live Phone Call" : "💬 WhatsApp Chat"}</div></div>
    <div class="case-field"><div class="case-field-label">Assigned Triage Priority</div><div class="case-field-val">${prioPill}</div></div>
    <div class="case-field full"><div class="case-field-label">Patient Statement & Chief Complaint</div><div class="case-field-val">"${text}"</div></div>
    <div class="case-field full"><div class="case-field-label">AI Action Taken</div><div class="case-field-val">${prioHeadline}</div></div>
  `;

  if (state.voiceAudioEnabled) {
    speakSofiaText(aiReply, isGreek ? "el-GR" : "en-GB");
  }
}

// ============================================================================
// Web Speech API (Voice Output & Live Microphone Input)
// ============================================================================
function toggleVoiceAudio() {
  state.voiceAudioEnabled = !state.voiceAudioEnabled;
  const btn = document.getElementById("tts-toggle-btn");
  if (btn) {
    btn.classList.toggle("active", state.voiceAudioEnabled);
    btn.textContent = state.voiceAudioEnabled
      ? "🔊 Voice Audio: ON (Sofia Speaking)"
      : "🔊 Voice Audio: Off (Tap to Hear Sofia)";
  }
  if (state.voiceAudioEnabled) {
    speakSofiaText(
      `Hello, I am Sofia, the AI Medical Receptionist for ${state.activeClinic.doctorName}. I triage patient calls, take clinical case notes, and manage urgent buffer slots.`,
      "en-GB"
    );
  } else if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function speakSofiaText(text, lang = "en-GB") {
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 1.02;
    window.speechSynthesis.speak(u);
  } catch (_) {}
}

function startLiveMicSpeech() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    handlePatientTurn("voice", "My child has a 39.5 fever since last night, can the doctor see us today?");
    showToast("🎙️ Simulated voice input: 'My child has a 39.5 fever since last night, can the doctor see us today?'");
    return;
  }
  const rec = new SpeechRec();
  rec.lang = "en-US";
  rec.interimResults = false;
  const heroBtn = document.getElementById("btn-live-mic-hero");
  if (heroBtn) heroBtn.classList.add("listening");
  rec.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    state.voiceAudioEnabled = true;
    handlePatientTurn("voice", transcript);
  };
  rec.onend = () => {
    if (heroBtn) heroBtn.classList.remove("listening");
  };
  rec.onerror = () => {
    if (heroBtn) heroBtn.classList.remove("listening");
    handlePatientTurn("voice", "My child has a 39.5 fever since last night, can the doctor see us today?");
  };
  rec.start();
}

// ============================================================================
// Clinic ROI Calculator
// ============================================================================
function updateClinicRoi() {
  const callsPerDay = Number(document.getElementById("roi-calls-slider")?.value || 65);
  const visitFee = Number(document.getElementById("roi-fee-slider")?.value || 60);
  const gesyPerDay = Number(document.getElementById("roi-gesy-slider")?.value || 18);

  document.getElementById("roi-calls-val").textContent = `${callsPerDay} calls/day`;
  document.getElementById("roi-fee-val").textContent = `€${visitFee} / visit`;
  document.getElementById("roi-gesy-val").textContent = `${gesyPerDay} admin calls/day`;

  // 22 working days/month
  const hoursSavedMo = Math.round((callsPerDay * 1.8 * 22) / 60);
  const recoveredVisitsPerWeek = Math.max(3, Math.round(callsPerDay * 0.14));
  const recoveredRevYr = recoveredVisitsPerWeek * visitFee * 48;
  const slotsSavedMo = gesyPerDay * 22;

  document.getElementById("roi-hours-saved").textContent = `${hoursSavedMo} hrs / mo`;
  document.getElementById("roi-missed-rev").textContent = `€${recoveredRevYr.toLocaleString()} / yr`;
  document.getElementById("roi-slots-saved").textContent = `${slotsSavedMo} calls / mo`;
}

// ============================================================================
// Tab 2: Doctor's Live Schedule & GeSY Queue Rendering
// ============================================================================
function renderDoctorSchedule() {
  const container = document.getElementById("doctor-schedule-list");
  if (!container) return;

  container.innerHTML = state.scheduleSlots
    .map((s) => {
      const cls =
        s.priority === 1
          ? "prio-1"
          : s.priority === 2
          ? "prio-2"
          : "buffer-locked";
      return `
      <div class="schedule-slot-item ${cls}">
        <div class="slot-top-row">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="slot-time-badge">${s.time}</span>
            <strong style="font-size:0.86rem; color:#0f172a;">${s.patient}</strong>
            <span style="font-size:0.74rem; color:#64748b;">(${s.phone})</span>
          </div>
          <span class="code-badge" style="${s.priority === 1 ? "background:#dc2626;color:#fff;border-color:#dc2626;" : ""}">${s.prioLabel}</span>
        </div>
        <div class="slot-notes-box">
          <div><strong>🩺 Chief Complaint:</strong> ${s.complaint}</div>
          <div style="margin-top:3px; color:#475569;"><strong>📋 AI Pre-Visit Note:</strong> ${s.notes}</div>
        </div>
      </div>`;
    })
    .join("");
}

function renderGesyQueue() {
  const box = document.getElementById("gesy-queue-box");
  if (!box) return;
  box.innerHTML = state.gesyQueue
    .map(
      (g) => `
      <div class="gesy-item">
        <div style="flex:1; min-width:200px;">
          <div style="font-size:0.82rem; font-weight:800; color:#0f172a;">
            ${g.patient} <span style="color:#0d9488; font-size:0.73rem;">(${g.gesyId})</span>
          </div>
          <div style="font-size:0.75rem; color:#475569; margin-top:2px;">${g.request}</div>
        </div>
        <button
          type="button"
          class="gesy-approve-btn ${g.approved ? "approved" : ""}"
          onclick="approveGesyItem('${g.id}')"
        >
          ${g.approved ? "✓ Approved & Sent on WhatsApp" : "✓ 1-Click Approve"}
        </button>
      </div>`
    )
    .join("");
}

function approveGesyItem(id) {
  const item = state.gesyQueue.find((x) => x.id === id);
  if (!item) return;
  item.approved = true;
  renderGesyQueue();
  showToast(`✅ Approved GeSY request for ${item.patient} — Sofia automatically notified the patient on WhatsApp!`);
}

function approveAllGesy() {
  state.gesyQueue.forEach((g) => (g.approved = true));
  renderGesyQueue();
  const kpi = document.getElementById("kpi-gesy-count");
  if (kpi) kpi.textContent = "0 Pending (All Done!)";
  showToast("✅ All End-of-Day GeSY prescriptions & referrals approved in 1 click!");
}

// ============================================================================
// Tab 3: Phase 2 Preview — Patient Discovery & Live Slot Marketplace
// ============================================================================
function renderMarketplaceDoctors() {
  const grid = document.getElementById("marketplace-doctors-grid");
  if (!grid) return;

  const specFilter = document.getElementById("mp-specialty-filter")?.value || "all";
  const cityFilter = document.getElementById("mp-city-filter")?.value || "all";
  const query = (document.getElementById("mp-symptom-input")?.value || "").trim().toLowerCase();

  const filtered = state.marketplaceDoctors.filter((d) => {
    if (specFilter !== "all" && d.specialty !== specFilter) return false;
    if (cityFilter !== "all" && d.city !== cityFilter) return false;
    if (query) {
      const hay = `${d.name} ${d.specialtyLabel} ${d.city} ${d.area}`.toLowerCase();
      const matchFever = /fever|child|kid|ear|πυρετ/.test(query) && (d.specialty === "Pediatrics" || d.specialty === "ENT");
      const matchRash = /rash|skin|mole|δέρμ/.test(query) && d.specialty === "Dermatology";
      const matchHeart = /heart|bp|chest|καρδ/.test(query) && d.specialty === "Cardiology";
      const matchDental = /tooth|teeth|dental|dentist|crown|filling|implant|cleaning|δόντ|δοντ|οδοντ|σφράγισμ|καθαρισμ/.test(query) && d.specialty === "Dental";
      if (!hay.includes(query) && !matchFever && !matchRash && !matchHeart && !matchDental) return false;
    }
    return true;
  });

  grid.innerHTML = filtered
    .map(
      (d) => `
      <div class="doctor-mp-card ${d.urgentBufferAvailable ? "urgent-ready" : ""}">
        <div class="doc-mp-header">
          <div>
            <div class="doc-mp-name">${d.name}</div>
            <div class="doc-mp-spec">${d.specialtyLabel}</div>
            <div style="font-size:0.74rem; color:#64748b; margin-top:2px;">📍 ${d.area} • ${d.coverage}</div>
          </div>
          <span class="code-badge">${d.rating}</span>
        </div>
        <div style="font-size:0.73rem; background:#f8fafc; padding:6px 9px; border-radius:7px; border:1px solid #e2e8f0; color:#334155;">
          🤖 <strong>AI Receptionist Live:</strong> ${d.aiStatus}
        </div>
        <div style="font-size:0.72rem; font-weight:800; color:#0f172a; text-transform:uppercase;">
          Tap a Live Verified Slot to Book with Case Note:
        </div>
        <div class="doc-mp-slots">
          ${d.slots
            .map(
              (s) => `
              <button
                type="button"
                class="doc-slot-pill ${s.urgent ? "urgent" : ""}"
                onclick="bookMarketplaceSlot('${d.name}', '${s.label}')"
              >
                ${s.label}
              </button>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

function bookMarketplaceSlot(docName, slotLabel) {
  showToast(`🎉 Booked ${slotLabel} with ${docName}! Sofia sent your WhatsApp confirmation & Pre-Visit Case Note.`);
}

// ============================================================================
// Live Notification Toast Helper
// ============================================================================
function showToast(msg) {
  const banner = document.getElementById("live-toast-banner");
  const textEl = document.getElementById("live-toast-text");
  if (!banner || !textEl) return;
  textEl.textContent = msg;
  banner.hidden = false;
}

// ============================================================================
// Initialize on DOMContentLoaded
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  setBrandVariant("mydocdesk", "schedule_gold", true);
  triggerScenario("urgent_fever", document.getElementById("btn-scen-urgent"));
  updateClinicRoi();
  renderDoctorSchedule();
  renderGesyQueue();
  renderMarketplaceDoctors();
});
