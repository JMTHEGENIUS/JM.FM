// === cosmic-calculations.js ===
// Core logic to generate numerology, astrology, and archetype profiles

// Helper — reduce to single digit (except master numbers 11, 22, 33)
function reduceNumber(num) {
  while (num > 9 && ![11, 22, 33].includes(num)) {
    num = num.toString().split('').reduce((a, b) => a + Number(b), 0);
  }
  return num;
}

// === NUMEROLOGY ===
function calculateNumerology(fullName, birthday) {
  const letters = fullName.replace(/[^A-Za-z]/g, "").toUpperCase().split("");
  const numerologyMap = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };

  // Life Path: from birthdate
  const birthDigits = birthday.replace(/-/g, "").split("").map(Number);
  const lifePath = reduceNumber(birthDigits.reduce((a, b) => a + b, 0));

  // Destiny (Expression): all letters’ total
  const destiny = reduceNumber(
    letters.reduce((sum, l) => sum + (numerologyMap[l] || 0), 0)
  );

  // Soul Urge: vowels only
  const vowels = letters.filter(l => "AEIOU".includes(l));
  const soulUrge = reduceNumber(
    vowels.reduce((sum, l) => sum + (numerologyMap[l] || 0), 0)
  );

  // Meaning templates
  const lifePathMeanings = {
    1: "The Pioneer — independent, ambitious, and born to lead.",
    2: "The Diplomat — intuitive, cooperative, and peace-seeking.",
    3: "The Creator — expressive, joyful, and imaginative.",
    4: "The Builder — grounded, reliable, and structured.",
    5: "The Explorer — adventurous, freedom-loving, and adaptable.",
    6: "The Nurturer — compassionate, responsible, and artistic.",
    7: "The Mystic — introspective, spiritual, and analytical.",
    8: "The Manifestor — ambitious, powerful, and success-driven.",
    9: "The Humanitarian — wise, compassionate, and visionary.",
    11: "The Visionary — spiritually awakened, intuitive, and inspiring.",
    22: "The Master Builder — manifesting dreams into tangible reality.",
    33: "The Master Teacher — healer through compassion and creativity."
  };

  return {
    lifePath,
    destiny,
    soulUrge,
    lifePathDesc: lifePathMeanings[lifePath],
    destinyDesc: lifePathMeanings[destiny],
    soulUrgeDesc: lifePathMeanings[soulUrge]
  };
}

// === ASTROLOGY (Simplified placeholders for now) ===
function calculateAstrology(birthday, birthTime, birthLocation) {
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Simple zodiac determination
  const zodiacs = [
    { sign: "Capricorn", start: [12, 22], end: [1, 19] },
    { sign: "Aquarius", start: [1, 20], end: [2, 18] },
    { sign: "Pisces", start: [2, 19], end: [3, 20] },
    { sign: "Aries", start: [3, 21], end: [4, 19] },
    { sign: "Taurus", start: [4, 20], end: [5, 20] },
    { sign: "Gemini", start: [5, 21], end: [6, 20] },
    { sign: "Cancer", start: [6, 21], end: [7, 22] },
    { sign: "Leo", start: [7, 23], end: [8, 22] },
    { sign: "Virgo", start: [8, 23], end: [9, 22] },
    { sign: "Libra", start: [9, 23], end: [10, 22] },
    { sign: "Scorpio", start: [10, 23], end: [11, 21] },
    { sign: "Sagittarius", start: [11, 22], end: [12, 21] }
  ];

  let sunSign = "Unknown";
  for (const z of zodiacs) {
    if (
      (month === z.start[0] && day >= z.start[1]) ||
      (month === z.end[0] && day <= z.end[1])
    ) {
      sunSign = z.sign;
      break;
    }
  }

  // Simplified placeholders for moon and rising signs
  const moonSign = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
                    [Math.floor((date.getDate() * 13) % 12)];
  const risingSign = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
                      [Math.floor((date.getMonth() + date.getDate()) % 12)];

  const sunMeaning = `${sunSign} represents your core essence — your conscious self and how you shine in the world.`;
  const moonMeaning = `${moonSign} reflects your emotions and inner world.`;
  const risingMeaning = `${risingSign} shows how you appear to others and approach new experiences.`;

  return { sunSign, moonSign, risingSign, sunMeaning, moonMeaning, risingMeaning };
}

// === COSMIC ARCHETYPE ===
function generateArchetype(lifePath, sunSign, moonSign, risingSign) {
  // Combine numerology and astrology for archetype patterns
  const archetypes = {
    1: "The Celestial Leader",
    2: "The Harmonizer of Worlds",
    3: "The Luminous Creator",
    4: "The Star Architect",
    5: "The Cosmic Explorer",
    6: "The Sacred Healer",
    7: "The Mystic Seer",
    8: "The Galactic Builder",
    9: "The Universal Visionary",
    11: "The Light Messenger",
    22: "The Master Alchemist",
    33: "The Divine Teacher"
  };

  const starArchetype = archetypes[lifePath] || "The Cosmic Wanderer";

  const elementMap = {
    Fire: ["Aries", "Leo", "Sagittarius"],
    Earth: ["Taurus", "Virgo", "Capricorn"],
    Air: ["Gemini", "Libra", "Aquarius"],
    Water: ["Cancer", "Scorpio", "Pisces"]
  };

  const elements = [];
  for (const [el, signs] of Object.entries(elementMap)) {
    if ([sunSign, moonSign, risingSign].some(sign => signs.includes(sign))) {
      elements.push(el);
    }
  }

  const elementalBalance = elements.map(el => {
    if (el === "Fire") return "🔥 Fire: Passion, creativity, and inspiration";
    if (el === "Earth") return "🌍 Earth: Structure, manifestation, and stability";
    if (el === "Air") return "🌬️ Air: Thought, intellect, and communication";
    if (el === "Water") return "💧 Water: Emotion, intuition, and transformation";
  });

  const fixedStars = [
    { name: "Sirius", meaning: "Illumination and higher guidance" },
    { name: "Antares", meaning: "Transformation and power through depth" },
    { name: "Vega", meaning: "Harmony, creativity, and inspiration" },
    { name: "Betelgeuse", meaning: "Leadership and cosmic mastery" }
  ];

  const activationSteps =
    "Meditate under starlight, focus on your breath as cosmic rhythm, and channel your unique energy into creation.";

  const archetypeSummary = `You are ${starArchetype} — blending the energies of ${sunSign}, ${moonSign}, and ${risingSign}. Your role is to bring harmony between cosmic vision and earthly action.`;

  return { starArchetype, archetypeSummary, elementalBalance, fixedStars, activationSteps };
}

// === MASTER FUNCTION ===
export function generateCosmicBlueprint({ fullName, birthday, birthTime, birthLocation }) {
  const numerology = calculateNumerology(fullName, birthday);
  const astrology = calculateAstrology(birthday, birthTime, birthLocation);
  const archetype = generateArchetype(
    numerology.lifePath,
    astrology.sunSign,
    astrology.moonSign,
    astrology.risingSign
  );

  return {
    fullName,
    birthday,
    birthTime,
    birthLocation,
    numerologyNumber: numerology.lifePath,    // ✅ add this
    destiny: numerology.destiny,
    soulUrge: numerology.soulUrge,
    lifePathDesc: numerology.lifePathDesc,
    destinyDesc: numerology.destinyDesc,
    soulUrgeDesc: numerology.soulUrgeDesc,
    birthChart: {                              // ✅ add this
      sunSign: astrology.sunSign,
      moonSign: astrology.moonSign,
      risingSign: astrology.risingSign
    },
    sunMeaning: astrology.sunMeaning,
    moonMeaning: astrology.moonMeaning,
    risingMeaning: astrology.risingMeaning,
    ...archetype
  };
}

