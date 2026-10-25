/**
 * MyVacAI — Hotel AI Receptionist, Call-to-WhatsApp 3DS Checkout & Vacation Concierge
 * Domain: myvacai.com
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRouter = require("./src/webhooks");

const app = express();
const PORT = process.env.PORT || 3456;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "MyVacAI Receptionist & Concierge Core",
    domain: "myvacai.com",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ MyVacAI Server running on http://localhost:${PORT}`);
});
