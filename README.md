# MyVacAI (`myvacai.com`) — Hotel AI Receptionist, Call-to-WhatsApp 3DS Checkout & Vacation Concierge

Full-stack MVP prototype & production webhook scaffold for **MyVacAI**:
- **24/7 Multilingual Voice & WhatsApp AI Receptionist** (English, Greek / Ελληνικά, Russian)
- **In-Call WhatsApp 3DS Checkout Handoff** (sends live room photos + 1-Tap Apple Pay / JCC Smart / Viva Wallet link while the guest is still on the phone call)
- **Unified Guest Memory** keyed by E.164 phone number (`+357...`, `+30...`, `+44...`) across Voice Calls, WhatsApp Text, and WhatsApp Voice Notes
- **Cyprus & Greece Regional Stack Adapters**: WebHotelier CRS, Protel PMS, JCC Smart Cyprus, Viva Wallet
- **MyVacAI Vacation Concierge**: Post-booking 1-tap upsells in the same WhatsApp thread (Airport Mercedes Transfer, Blue Lagoon Yacht Cruise, Thalassa Spa, Cliffside Sunset Meze) posted directly to the guest's PMS folio.

## Quick Start

```bash
cd /workspace/myvacai
npm install
node server.js
# Server runs on http://localhost:3456
```

## Key Endpoints

- `GET  /api/pms/state` — Full property state, room inventory, KPIs, and active guest session
- `GET  /api/pms/availability?roomId=sea-view-deluxe&nights=3&guests=2` — Live WebHotelier CRS availability & OTA rate comparison
- `POST /api/agent/scenario` — Trigger interactive voice/WhatsApp scenarios (`en_seaview`, `el_swimup`, `wa_voicenote_villa`, `custom`)
- `POST /api/checkout/pay` — Complete 1-Tap 3DS payment, write reservation to Protel PMS, and trigger Vacation Concierge upsells
- `POST /api/concierge/book` — 1-Tap book a Vacation Concierge add-on onto the guest's room folio
- `POST /api/webhooks/voice` — Production webhook for Vapi / Retell / Twilio SIP voice turns
- `GET|POST /api/webhooks/whatsapp` — Production webhook for Meta WhatsApp Business Cloud API
