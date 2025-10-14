// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chartRoute from "./routes/chart.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/chart", chartRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cosmic-Api listening on ${PORT}`));
