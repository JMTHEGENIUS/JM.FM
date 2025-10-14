// services/astro.js
// Lightweight astronomy helpers + computeChart
// NOTE: This is a good, practical starting point. Replace with Swiss Ephemeris for production precision.

import { toZodiac } from "../utils/zodiac.js";

/** helpers **/
const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

function clamp360(d) {
  d = d % 360;
  if (d < 0) d += 360;
  return d;
}

/**
 * Julian Day from UTC components.
 * Inputs: year, month (1-12), day, hourDecimal (e.g. 14.25)
 */
export function julianDayUTC(year, month, day, hourDecimal) {
  // From Jean Meeus algorithm
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (year + 4716))
           + Math.floor(30.6001 * (month + 1))
           + day + B - 1524.5 + hourDecimal / 24.0;
  return jd;
}

/** Convert date string "YYYY-MM-DD" and time "HH:MM" into JD (UTC).
 * tzOffsetMinutes: optional minutes offset to apply (if time is local).
 * If tzOffset omitted assume time provided is UTC.
 */
function dateTimeToJD({ date, time, tzOffset }) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const hourDecimal = hh + mm / 60.0 - ((tzOffset || 0) / 60.0);
  return julianDayUTC(y, m, d, hourDecimal);
}

/** Mean obliquity of the ecliptic (degrees) using Laskar */
function meanObliquity(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const seconds = 21.448 - 46.8150 * T - 0.00059 * T * T + 0.001813 * T * T * T;
  const eps = 23 + (26 + (seconds / 60)) / 60;
  return eps;
}

/** Greenwich Mean Sidereal Time in degrees */
function gmstDegrees(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T - (T * T * T) / 38710000.0;
  return clamp360(GMST);
}

/** Simple Sun ecliptic longitude (approximate) — good to ~0.01–0.5° */
function sunEclipticLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  // Mean anomaly of the Sun (degrees)
  const M = clamp360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  // Mean longitude
  const L0 = clamp360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(RAD * M)
          + (0.019993 - 0.000101 * T) * Math.sin(RAD * 2 * M)
          + 0.000289 * Math.sin(RAD * 3 * M);
  const trueLong = L0 + C;
  return clamp360(trueLong);
}

/** Simple Moon ecliptic longitude (very approximate) */
function moonEclipticLongitude(jd) {
  // Based on simplified Meeus-ish terms — fine for sign-level and rough degrees
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = clamp360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000);
  const D = clamp360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T*T*T/545868 - T*T*T*T/113065000);
  const M = clamp360(357.5291092 + 35999.0502909 * T - 0.0001536*T*T + T*T*T/24490000);
  const Mprime = clamp360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T*T*T/69699 - T*T*T*T/14712000);
  const F = clamp360(93.2720950 + 483202.0175233 * T - 0.0036539*T*T - T*T*T/3526000 + T*T*T*T/863310000);

  // A few terms of the lunar longitude series (dominant ones)
  const lon = L0
            + 6.289 * Math.sin(RAD * Mprime) 
            + 1.274 * Math.sin(RAD * (2*D - Mprime))
            + 0.658 * Math.sin(RAD * (2*D))
            + 0.214 * Math.sin(RAD * (2*Mprime))
            - 0.11  * Math.sin(RAD * M);

  return clamp360(lon);
}

/** Convert ecliptic longitude (degrees) to zodiac sign and degree-in-sign */
function longToSign(longDeg) {
  const signIndex = Math.floor(longDeg / 30); // 0 Aries .. 11 Pisces
  const signDegree = longDeg % 30;
  const signName = toZodiac(longDeg);
  return { signIndex, signName, degree: +(signDegree.toFixed(4)), longitude: +longDeg.toFixed(4) };
}

/** Local sidereal time in degrees for given jd and longitude (deg east positive) */
function localSiderealTime(jd, lon) {
  const gst = gmstDegrees(jd); // degrees
  const lst = clamp360(gst + lon);
  return lst;
}

/**
 * Ascendant (Rising) calculation (approx).
 * Sources: standard formula using ecliptic obliquity and local sidereal time.
 *
 * Returns ecliptic longitude of the ascendant in degrees.
 */
function ascendantLongitude(jd, latDeg, lonDeg) {
  const eps = meanObliquity(jd) * RAD; // radians
  const lat = latDeg * RAD;

  // Local sidereal time in radians
  const lstDeg = localSiderealTime(jd, lonDeg);
  const theta = lstDeg * RAD;

  // Formula for ascendant (ecliptic longitude):
  // tan(lambda) = (sin(theta)*cos(epsilon) - tan(phi)*sin(epsilon)) / cos(theta)
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const tanLat = Math.tan(lat);
  const numerator = sinTheta * Math.cos(eps) - tanLat * Math.sin(eps);
  const denom = cosTheta;
  const lambdaRad = Math.atan2(numerator, denom);
  let lambdaDeg = clamp360(lambdaRad * DEG);
  // Convert to ecliptic longitude (0-360)
  return +lambdaDeg.toFixed(4);
}

/** Main compute function — returns JSON chart */
export function computeChart({ date, time, lat, lon, tzOffset }) {
  // tzOffset: minutes to subtract from local to get UTC (optional).
  // Example: for US Central Daylight (UTC-5) tzOffset = 300.
  const jd = dateTimeToJD({ date, time, tzOffset });

  // planets we compute (basic set)
  const sunLong = sunEclipticLongitude(jd);
  const moonLong = moonEclipticLongitude(jd);
  const ascLong = ascendantLongitude(jd, lat, lon);

  const sun = longToSign(sunLong);
  const moon = longToSign(moonLong);
  const asc = longToSign(ascLong);

  return {
    requested: { date, time, lat, lon, tzOffset: tzOffset || 0 },
    jd: +jd.toFixed(6),
    sun: { ...sun },
    moon: { ...moon },
    ascendant: { ...asc },
    note: "This engine is approximate. Replace with Swiss Ephemeris for production-grade accuracy. See README for upgrade path."
  };
}
