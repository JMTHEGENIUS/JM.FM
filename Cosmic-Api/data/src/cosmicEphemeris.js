// cosmicEphemeris.js
import fs from "fs";
import { chebyshevEval } from "./chebyshev.js";

export class CosmicEphemeris {
  constructor(path) {
    this.path = path;
    this.header = {};
    this.records = [];
  }

  async load() {
    const buf = fs.readFileSync(`${this.path}/header.440`);
    this.header = this.parseHeader(buf.toString("ascii"));
  }

  parseHeader(text) {
    const lines = text.split("\n").filter(l => l.trim());
    const header = {};
    for (let line of lines) {
      if (line.startsWith("GROUP")) continue;
      if (line.includes("=")) {
        const [key, val] = line.split("=").map(x => x.trim());
        header[key] = val;
      }
    }
    return header;
  }

  getPlanetPosition(julianDay, planetIndex) {
    // TODO: locate record in ascp file
    // For now: return placeholder
    return { x: 0, y: 0, z: 0 };
  }
}
