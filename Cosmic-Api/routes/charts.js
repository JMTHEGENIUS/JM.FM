// routes/chart.js
import express from "express";
import { computeChart } from "../services/astro.js";

const router = express.Router();

/**
 * POST /api/chart
 * body: { date: "YYYY-MM-DD", time: "HH:MM" (24h), lat: number, lon: number, tzOffset?: number }
 * tzOffset is minutes offset from UTC (optional) — if omitted we assume local time is already UTC or you can send "Z" in time.
 */
router.post("/", async (req, res) => {
  try {
    const { date, time, lat, lon, tzOffset } = req.body;
    if (!date || !time || typeof lat !== "number" || typeof lon !== "number") {
      return res.status(400).json({ error: "Missing required fields: date, time, lat, lon" });
    }

    const chart = computeChart({ date, time, lat, lon, tzOffset });
    res.json(chart);
  } catch (err) {
    console.error("Chart error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

export default router;
