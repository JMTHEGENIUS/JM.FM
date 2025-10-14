// utils/zodiac.js
export function toZodiac(longDeg) {
  const names = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const idx = Math.floor((longDeg % 360) / 30);
  return names[idx] || "Unknown";
}
