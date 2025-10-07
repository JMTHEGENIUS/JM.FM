// === INDEX PAGE ===
const generateBtn = document.getElementById('generateBtn');

if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const birthdayInput = document.getElementById('birthday').value;
        if (!birthdayInput) {
            alert("Please enter a birthday.");
            return;
        }

        // Parse birthday as local date (explicit noon avoids timezone shift)
        const birthDate = new Date(birthdayInput + "T12:00:00");
        const today = new Date();

        // Store birthday in ISO format (YYYY-MM-DD) to ensure reliable parsing later
        const isoBirthday = birthDate.toISOString().split("T")[0];
        localStorage.setItem('birthday', isoBirthday);

        // --- Find most recent birthday ---
        let recentBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate(), 12, 0, 0);
        if (recentBirthday > today) {
            recentBirthday.setFullYear(today.getFullYear() - 1);
        }

        // 🌞 Cycles begin the day AFTER the birthday
        const cycleStart = new Date(recentBirthday);
        cycleStart.setDate(cycleStart.getDate() + 1); // e.g., Dec 1 if birthday = Nov 30

        // 🌝 Cycles end 364 days later (the day before next birthday)
        const cycleEnd = new Date(cycleStart);
        cycleEnd.setDate(cycleEnd.getDate() + 363); // inclusive 364-day span

        // Save all relevant cycle data
        localStorage.setItem('recentBirthday', recentBirthday.toISOString());
        localStorage.setItem('cycleStart', cycleStart.toISOString());
        localStorage.setItem('cycleEnd', cycleEnd.toISOString());

        // Navigate to cycles page
        window.location.href = 'cycles.html';
    });
}


// === ALL OTHER PAGES ===
document.addEventListener("DOMContentLoaded", () => {
    const recentBirthdayStr = localStorage.getItem('recentBirthday');
    if (!recentBirthdayStr) return;

    const recentBirthday = new Date(recentBirthdayStr);

    const cycleStartStr = localStorage.getItem('cycleStart');
    const cycleStart = new Date(cycleStartStr);


    // --- CYCLES PAGE ---
    const cyclesContainer = document.getElementById('cyclesContainer');
    if (cyclesContainer) {
        const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
        const tarot = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers"];
        const diamondOrder = [0, 2, 1, 3, 5, 4, 6]; // diamond layout

        diamondOrder.forEach(i => {
            const startDayNum = i * 52 + 1;
            const endDayNum = (i + 1) * 52;

            // Use cycleStart as the true day 1 of the cycle calendar
            const startDate = new Date(cycleStart);
             startDate.setDate(startDate.getDate() + (startDayNum - 1));
            const endDate = new Date(cycleStart);
             endDate.setDate(endDate.getDate() + (endDayNum - 1));


            const div = document.createElement('div');
            div.classList.add("cycle-box");
            div.innerHTML = `
                <h2>Cycle ${i + 1}</h2>
                <p>Days ${startDayNum}–${endDayNum}</p>
                <p>${startDate.toLocaleDateString()} → ${endDate.toLocaleDateString()}</p>
                <p><strong>Planet:</strong> ${planets[i]}</p>
                <p><strong>Tarot:</strong> ${tarot[i]}</p>
            `;

            div.addEventListener('click', () => {
                localStorage.setItem('cycle', i + 1);
                localStorage.setItem('startDay', startDayNum);
                localStorage.setItem('endDay', endDayNum);
                localStorage.setItem('cycleStartDate', startDate.toISOString());
                window.location.href = 'weeks.html';
            });

            cyclesContainer.appendChild(div);
        });
    }

    // --- WEEKS PAGE ---
    const weeksContainer = document.getElementById('weeksContainer');
    if (weeksContainer) {
        const cycleNumber = parseInt(localStorage.getItem('cycle'));
        const startDay = parseInt(localStorage.getItem('startDay'));
        const cycleStartDate = new Date(localStorage.getItem('cycleStartDate'));
        const cycleTitle = document.getElementById('cycleTitle');
        const cycleDescription = document.getElementById('cycleDescription');

        const cycleDescriptions = {
  1: `Cycle 1: Sun Energy

  Tarot: Wheel of Fortune

  Utilize personal power and ability to advance business plans, employment, and partnerships.

  Approach people with your ideas and projects. Be influential, seek favors and ask for what is desired.

  Great time for personal and business promotion.

  Time for investing and making big money moves (loans, creative money ideas, etc.).

  A time to take a chance at playing “bigger”.

  Step forward with a clear vision because this is a powerful time for standing out and basking in the limelight. Accept recognition with integrity and heart-centeredness.

  Powerfully creative time for advancement.
  A time to shine.`,

  2: `Cycle 2: Mercury Energy

  Tarot: Justice

  Limited travel, quick changes, moving things around that only take a short time.

  Good time for lectures, speaking, performances, and art exhibits.

  Very good time for planting, gardening, and nature interests.

  Not a time for changing business or starting a new career.

  Not a time for purchasing a new home or making extended deals or projects.

  Unwise to make long-term contracts, borrow/lend money, or speculate.`,

  3: `Cycle 3: Mars Energy

  Tarot: Magician

  Excellent for expansion, but requires care.

  Great vitality and energy can be expressed in many ways.

  Use discrimination and judgment.

  Work through lingering obstacles with persistence.

  Good time for long hours of focused work.

  Communication with women is favorable; avoid arguments and disagreements.`,

  4: `Cycle 4: Uranus Energy

  Tarot: Chariot

  Cosmic energy influences mental, emotional, and psychic aspects.

  Excellent time for writing, planning, and applying ideas practically.

  Good for study and building knowledge.

  Imagination is highly charged — inspiration flows strongly.

  Be cautious with truth in reports and documents — trust intuition.

  Not ideal for marriage, buying property, or business propositions.`,

  5: `Cycle 5: Jupiter Energy

  Tarot: High Priestess

  A time of fruition and successful culmination of personal/private affairs.

  Ideas and projects prosper, expand, and yield results.

  Optimism, sociability, and openness prevail.

  Good for long journeys, spiritual studies, and philosophy.

  Excellent for collecting money, selling, and speculation.`,

  6: `Cycle 6: Venus Energy

  Tarot: Star

  Cycle for relaxation, pleasure, and entertainment.

  Business prospers while social connections deepen.

  Good for renewing friendships (but avoid trips on water).

  Arts and beautification flourish.

  Men gain cooperation from women.

  Money transactions and investments flourish.`,

  7: `Cycle 7: Saturn Energy

  Tarot: Tower

  Breaking down the old for new growth.

  Don’t resist endings; cooperate with clearing and release.

  Review business, relationships, projects carefully — salvage what’s useful, release the rest.

  Mind/body may be at low ebb — avoid impulsivity.

  Rest and postpone major decisions until Cycle 1.

  Good for nature walks and reflection, not for new ventures.`
};


 cycleTitle.textContent = `Cycle ${cycleNumber}`;
 cycleDescription.innerText = cycleDescriptions[cycleNumber] || "No description available.";


 // Weekly lessons for each cycle (Circle 7 themes)
const weeklyLessons = {
  1: [
    "Week 1 – Awakening the Divine Mind: Recognize the power of thought and begin directing it consciously.",
    "Week 2 – Manifestation through Will: Apply your personal power toward righteous purpose.",
    "Week 3 – Building Foundations: Structure your goals with order and clarity.",
    "Week 4 – The Fire of Action: Move courageously with faith and vision.",
    "Week 5 – Balance of Power: Practice humility while standing in strength.",
    "Week 6 – Illumination of Self: Let your inner light reveal new pathways.",
    "Week 7 – Reflection and Renewal: Integrate what has been learned before moving forward."
  ],
  2: [
    "Week 1 – Harmony with Nature: Move gently, attuned to natural rhythms.",
    "Week 2 – The Art of Listening: Receive wisdom through stillness and intuition.",
    "Week 3 – Service and Cooperation: Build peace through mutual respect.",
    "Week 4 – Healing Waters: Purify thoughts, words, and emotions.",
    "Week 5 – The Path of Patience: Let divine timing unfold without haste.",
    "Week 6 – Inner Balance: Align feeling and reason into harmony.",
    "Week 7 – Reflection in Stillness: Observe how peace transforms understanding."
  ],
  3: [
    "Week 1 – Strength and Endurance: Direct your energy toward perseverance.",
    "Week 2 – Purification through Work: Discipline the mind and body in purpose.",
    "Week 3 – Courage and Determination: Face inner resistance with love and will.",
    "Week 4 – Mastery through Challenge: Convert struggle into strength.",
    "Week 5 – Refinement of Character: Let restraint reveal wisdom.",
    "Week 6 – Purity of Action: Act with conscious intent and divine justice.",
    "Week 7 – Rest in Achievement: Review effort and prepare for renewal."
  ],
  4: [
    "Week 1 – Awakening of Insight: Observe divine law in all experience.",
    "Week 2 – The Power of Truth: Let honesty guide thought and deed.",
    "Week 3 – Spiritual Study: Deepen understanding through sacred learning.",
    "Week 4 – Wisdom in Silence: Listen to the higher voice within.",
    "Week 5 – Expression of Genius: Share your unique vibration with the world.",
    "Week 6 – Reformation: Release the old; accept divine inspiration.",
    "Week 7 – Union of Mind and Spirit: Align intellect with divine will."
  ],
  5: [
    "Week 1 – Expansion through Knowledge: Open the mind to universal law.",
    "Week 2 – Abundance in Gratitude: Recognize prosperity as a state of mind.",
    "Week 3 – Sharing Wisdom: Spread truth with joy and understanding.",
    "Week 4 – Higher Study: Seek wisdom beyond form and tradition.",
    "Week 5 – Spiritual Journey: Reflect on the path of unfoldment.",
    "Week 6 – Prosperity through Purpose: Let service increase abundance.",
    "Week 7 – Illumined Awareness: Perceive unity in all experiences."
  ],
  6: [
    "Week 1 – Beauty in Simplicity: Appreciate divine harmony in all creation.",
    "Week 2 – Heart-Centered Living: Lead with love and compassion.",
    "Week 3 – Union and Cooperation: Strengthen bonds with righteous companions.",
    "Week 4 – Creative Expression: Let art and beauty uplift the soul.",
    "Week 5 – Rest and Pleasure: Restore vitality through joy.",
    "Week 6 – Peaceful Prosperity: Enjoy the fruits of balance and care.",
    "Week 7 – Reflection on Love: Honor all relationships as divine mirrors."
  ],
  7: [
    "Week 1 – Completion and Review: Reflect upon the year’s progress.",
    "Week 2 – Letting Go: Release attachments to prepare for renewal.",
    "Week 3 – Inner Cleansing: Purify the heart through contemplation.",
    "Week 4 – Solitude and Prayer: Seek guidance in stillness.",
    "Week 5 – Closure of the Old: Accept the end of cycles with peace.",
    "Week 6 – Seeds of Renewal: Prepare mentally for new beginnings.",
    "Week 7 – Rest in the Infinite: Reconnect with divine source and readiness."
  ]
};


        const weekOrder = [0, 2, 1, 3, 5, 4, 6]; // diamond layout

        weekOrder.forEach(i => {
            const weekStartDay = startDay + i * 7;
            let weekEndDay = weekStartDay + 6;
            if (i === 6) weekEndDay = startDay + 51; // last week takes remainder

            const weekStartDate = new Date(cycleStartDate);
            weekStartDate.setDate(weekStartDate.getDate() + (i * 7));
            const weekEndDate = new Date(cycleStartDate);
            weekEndDate.setDate(weekEndDate.getDate() + (i === 6 ? 51 : (i * 7 + 6)));

            const div = document.createElement('div');
            div.classList.add("week-box");
            div.innerHTML = `
                <h2>Week ${i + 1}</h2>
                <p>Days ${weekStartDay}–${weekEndDay}</p>
                <p>${weekStartDate.toLocaleDateString()} → ${weekEndDate.toLocaleDateString()}</p>
                <p>${weeklyLessons[cycleNumber]?.[i] || "Weekly lesson placeholder"}</p>

            `;

            div.addEventListener('click', () => {
                localStorage.setItem('week', i + 1);
                localStorage.setItem('weekStart', weekStartDay);
                localStorage.setItem('weekEnd', weekEndDay);
                localStorage.setItem('weekStartDate', weekStartDate.toISOString());
                window.location.href = 'daily.html';
            });

            weeksContainer.appendChild(div);
        });
    }

    // --- DAILY PAGE ---
if (document.getElementById('dailyTitle')) {

    const cycleNumber = parseInt(localStorage.getItem('cycle')) || 1;
    const weekNumber = parseInt(localStorage.getItem('week')) || 1;
    const weekStart = parseInt(localStorage.getItem('weekStart')) || 1;

    // Use cycleStart instead of recentBirthday to align with new logic
    const cycleStartStr = localStorage.getItem('cycleStart');
    const cycleStart = cycleStartStr ? new Date(cycleStartStr) : new Date();

    // Also pull the true birthday for display if needed
    const birthdayStr = localStorage.getItem('birthday');
    const birthday = birthdayStr ? new Date(birthdayStr + "T12:00:00") : null;


    // Example dailyData object - expand with your actual data
    const dailyData = [
        { day: "Sunday", lesson: "Focus on self-reflection.", affirmation: "I grow each day with purpose.", planet: "Sun", sign: "Leo", colors: "Gold", chakra: "Solar Plexus", journalPrompt: "What did I learn today?" },
        { day: "Monday", lesson: "Connect with intuition.", affirmation: "I trust my inner guidance.", planet: "Moon", sign: "Cancer", colors: "Silver", chakra: "Sacral", journalPrompt: "How did I feel emotionally today?" },
        { day: "Tuesday", lesson: "Take action towards goals.", affirmation: "I move forward with confidence.", planet: "Mars", sign: "Aries", colors: "Red", chakra: "Root", journalPrompt: "What action did I take today?" },
        { day: "Wednesday", lesson: "Communicate clearly.", affirmation: "I express myself with clarity.", planet: "Mercury", sign: "Gemini", colors: "Blue", chakra: "Throat", journalPrompt: "What conversations mattered today?" },
        { day: "Thursday", lesson: "Expand your knowledge.", affirmation: "I seek wisdom every day.", planet: "Jupiter", sign: "Sagittarius", colors: "Purple", chakra: "Third Eye", journalPrompt: "What new knowledge did I gain today?" },
        { day: "Friday", lesson: "Balance relationships.", affirmation: "I nurture harmony around me.", planet: "Venus", sign: "Libra", colors: "Pink", chakra: "Heart", journalPrompt: "How did I connect with others today?" },
        { day: "Saturday", lesson: "Rest and recharge.", affirmation: "I honor my body and mind.", planet: "Saturn", sign: "Capricorn", colors: "Black", chakra: "Root", journalPrompt: "How did I rest today?" }
    ];

    let currentDay = 1; // start with first day of the week

    function renderDay(n) {
        currentDay = n;

        const globalDay = weekStart + (n - 1);
        // Calculate date based on true cycle start (the day after the birthday)
        const date = new Date(cycleStart);
        date.setDate(date.getDate() + (globalDay - 1));


        const weekday = date.getDay();
        const info = dailyData[weekday];

        // Calendar box: display actual date and day of the week
         document.getElementById('dailyTitle').textContent =
         `${date.toLocaleString('default', { weekday: 'long' })}, ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;


        // Daily lesson inside calendar box
        document.getElementById('dailylesson').textContent = info.lesson;

        // Left column: detailed daily info
        document.getElementById('dailyInfo').innerHTML = `
            <h3>Daily Info</h3>
            <p><strong>Affirmation:</strong> ${info.affirmation}</p>
            <p><strong>Planetary Energy:</strong> ${info.planet}</p>
            <p><strong>Ruling Planet:</strong> ${info.planet}</p>
            <p><strong>Ruling Sign:</strong> ${info.sign}</p>
            <p><strong>Day Number:</strong> ${n}</p>
            <p><strong>Day Colors:</strong> ${info.colors}</p>
            <p><strong>Chakra:</strong> ${info.chakra}</p>
            <p><strong>Journal Prompt:</strong> ${info.journalPrompt}</p>
        `;
    }

    // Prev/Next buttons
    document.getElementById('prevDay').addEventListener('click', () => {
        if (currentDay > 1) renderDay(currentDay - 1);
    });

    document.getElementById('nextDay').addEventListener('click', () => {
        if (currentDay < 7) renderDay(currentDay + 1);
    });

    // Render the first day by default
    renderDay(currentDay);

    // Highlight if today = birthday
if (
  birthday &&
  date.getDate() === birthday.getDate() &&
  date.getMonth() === birthday.getMonth()
) {
  document.getElementById('dailylesson').textContent = "🎂 Birthday — Solar Reset Day! Reflect on your growth and set new intentions.";
  document.getElementById('dailyInfo').innerHTML = `
      <h3>Birthday Reflections</h3>
      <p>This is your 365th day — completing one full solar year.</p>
      <p>Take time to review your cycles and celebrate renewal.</p>
  `;
}

}

});

function showCycleDescription(cycleNumber) {
  // Hide all descriptions
  document.querySelectorAll('.cycle-text').forEach(el => {
    el.classList.add('hidden');
  });

  // Show the one we need
  const target = document.getElementById(`cycle${cycleNumber}`);
  if (target) {
    target.classList.remove('hidden');
  }
}

// Example: run this when a week box is clicked
document.querySelectorAll('#weeksContainer .week-box').forEach((box, index) => {
  box.addEventListener('click', () => {
    showCycleDescription(index + 1); 
  });
});

// Optional: show cycle 1 by default when page loads
showCycleDescription(1);


const cycleColors = [
  "#FFD700", // Sun - Gold
  "#F56F00", // Moon - Orange
  "#C13EFF", // Mars - Purple
  "#00CFFF", // Mercury - Light Blue
  "#00FF90", // Jupiter - Green
  "#FF4B91", // Venus - Pink
  "#7080FF"  // Saturn - Indigo
];


document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("timelineBar");
  const marker = document.getElementById("timelineMarker");
  if (!bar || !marker) return;

  const page = document.body.dataset.page; // we'll tag each page type
  const colors = [
    "#FFD700","#F56F00","#C13EFF","#00CFFF",
    "#00FF90","#FF4B91","#7080FF"
  ];

  const cycleStart = new Date(localStorage.getItem("cycleStart"));
  const today = new Date();

  const dayOfYear = Math.floor((today - cycleStart) / (1000*60*60*24));
  const currentCycle = Math.floor(dayOfYear / 52);  // 0–6
  const currentWeek = Math.floor(dayOfYear / 7) % 7; // 0–6 inside current cycle
  const currentDay = dayOfYear % 7; // 0–6 inside week

  // Helper: create colored segment bar
  function renderSegments(total, activeIndex) {
    bar.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const seg = document.createElement("div");
      seg.className = "timeline-segment";
      seg.style.background = colors[i % colors.length];
      if (i === activeIndex) seg.classList.add("active");
      bar.appendChild(seg);
    }
  }

  if (page === "cycles") {
    renderSegments(7, currentCycle);
    marker.textContent = "Cycle " + (currentCycle + 1);
    marker.onclick = () => window.location.href = "weeks.html";
  }

  if (page === "weeks") {
    renderSegments(7, currentWeek);
    marker.textContent = "Week " + (currentWeek + 1);
    marker.onclick = () => window.location.href = "daily.html";
  }

  if (page === "daily") {
    renderSegments(7, currentDay);
    marker.textContent = "Today";
    marker.onclick = () => window.location.href = "daily.html";
  }
});





// === Update birthday box in left column with next upcoming birthday + countdown ===
const userBirthdayEl = document.getElementById('userBirthday');
if (userBirthdayEl) {
    const birthdayStr = localStorage.getItem('recentBirthday');
    if (birthdayStr) {
        const birthDate = new Date(birthdayStr);
        const today = new Date();

        // Set next birthday to this year initially
        let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

        // If this year's birthday already passed, use next year
        if (nextBirthday < today) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }

        // Update birthday display
        userBirthdayEl.textContent = nextBirthday.toLocaleDateString();

        // Calculate days until next birthday
        const oneDay = 1000 * 60 * 60 * 24; // ms in a day
        const diffDays = Math.ceil((nextBirthday - today) / oneDay);

        // Add countdown below the date
        let countdownEl = document.getElementById('birthdayCountdown');
        if (!countdownEl) {
            countdownEl = document.createElement('p');
            countdownEl.id = 'birthdayCountdown';
            userBirthdayEl.parentNode.appendChild(countdownEl);
        }
        countdownEl.textContent = `${diffDays} day${diffDays !== 1 ? 's' : ''} until your next birthday 🎉`;

    } else {
        userBirthdayEl.textContent = "Not set yet";
    }
}




// === ZODIAC & NUMEROLOGY SECTION (replace the old block with this) ===
(function() {
  const zodiacSignEl = document.getElementById("zodiacSign");
  const zodiacMeaningEl = document.getElementById("zodiacMeaning");
  const lifePathNumEl = document.getElementById("lifePathNum");
  const lifePathMeaningEl = document.getElementById("lifePathMeaning");
  const dayNumEl = document.getElementById("dayNum");
  const dayNumMeaningEl = document.getElementById("dayNumMeaning");

  const storedBirthday = localStorage.getItem("birthday");
  if (!storedBirthday) return; // nothing to do

  // Robust birthday parser: supports YYYY-MM-DD, MM-DD-YYYY, MM/DD/YYYY, "11-30-1997", etc.
  function parseBirthday(str) {
    const parts = str.split(/[^0-9]+/).filter(Boolean);
    if (parts.length === 3) {
      // If first part is 4 digits assume ISO-style (YYYY-MM-DD)
      if (parts[0].length === 4) {
        return { year: parseInt(parts[0], 10), month: parseInt(parts[1], 10), day: parseInt(parts[2], 10) };
      } else {
        // otherwise assume MM-DD-YYYY or MM/DD/YYYY
        return { month: parseInt(parts[0], 10), day: parseInt(parts[1], 10), year: parseInt(parts[2], 10) };
      }
    }
    // fallback: try Date parsing
    const d = new Date(str);
    if (!isNaN(d)) return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    return null;
  }

  const parsed = parseBirthday(storedBirthday);
  if (!parsed) {
    console.warn("Could not parse birthday:", storedBirthday);
    return;
  }

  const { day, month, year } = parsed;

  // --- Zodiac (kept same as what you've been using) ---
  const zodiacData = [
    { sign: "Capricorn", start: [12, 22], end: [1, 19], meaning: "Practical, grounded, and ambitious. You climb steadily toward your purpose." },
    { sign: "Aquarius", start: [1, 20], end: [2, 18], meaning: "Visionary, independent, and humanitarian. You walk to your own rhythm." },
    { sign: "Pisces", start: [2, 19], end: [3, 20], meaning: "Empathic, imaginative, and spiritual. You feel deeply and see beyond form." },
    { sign: "Aries", start: [3, 21], end: [4, 19], meaning: "Bold, fiery, and pioneering. You initiate new cycles with courage." },
    { sign: "Taurus", start: [4, 20], end: [5, 20], meaning: "Stable, artistic, and sensual. You manifest beauty through consistency." },
    { sign: "Gemini", start: [5, 21], end: [6, 20], meaning: "Curious, communicative, and quick-minded. You thrive through connection and learning." },
    { sign: "Cancer", start: [6, 21], end: [7, 22], meaning: "Nurturing, protective, and intuitive. You embody the heart of home and care." },
    { sign: "Leo", start: [7, 23], end: [8, 22], meaning: "Radiant, generous, and strong. You express divine light through creativity." },
    { sign: "Virgo", start: [8, 23], end: [9, 22], meaning: "Analytical, healing, and devoted. You refine the world through service." },
    { sign: "Libra", start: [9, 23], end: [10, 22], meaning: "Balanced, graceful, and diplomatic. You bring harmony and beauty wherever you go." },
    { sign: "Scorpio", start: [10, 23], end: [11, 21], meaning: "Transformative, passionate, and intense. You are rebirth embodied." },
    { sign: "Sagittarius", start: [11, 22], end: [12, 21], meaning: "Adventurous, wise, and freedom-loving. You seek truth through exploration." }
  ];

  const zodiac = zodiacData.find(z => (
    (month === z.start[0] && day >= z.start[1]) ||
    (month === z.end[0] && day <= z.end[1])
  ));

  if (zodiacSignEl) zodiacSignEl.textContent = zodiac ? zodiac.sign : "Unknown";
  if (zodiacMeaningEl) zodiacMeaningEl.textContent = zodiac ? zodiac.meaning : "";

  // --- Numerology helpers ---
  function sumDigits(n) {
    return String(n).split("").map(Number).reduce((a, b) => a + b, 0);
  }

  // Reduce preserving master numbers 11,22,33.
  function reduceMasterSafe(n) {
    n = Number(n);
    // If it's already a master number, keep it
    if ([11, 22, 33].includes(n)) return n;
    // Reduce until single digit or a master number appears
    while (n > 9 && ![11, 22, 33].includes(n)) {
      n = sumDigits(n);
      if ([11,22,33].includes(n)) return n;
    }
    return n;
  }

  // ---- Life Path calculation (correct method for preserving masters) ----
  // Reduce month/day/year individually (preserving masters) then sum and reduce (preserving masters)
  function calcLifePath(yearVal, monthVal, dayVal) {
    const mReduced = reduceMasterSafe(monthVal);         // keeps 11 if month is 11
    const dReduced = reduceMasterSafe(dayVal);           // e.g., 30 -> 3
    const yearDigitSum = sumDigits(yearVal);             // e.g., 1997 -> 26
    const yReduced = reduceMasterSafe(yearDigitSum);     // 26 -> 8

    const total = mReduced + dReduced + yReduced;       // e.g., 11 + 3 + 8 = 22
    const lifePath = reduceMasterSafe(total);            // preserve master 22

    // return breakdown too so you can inspect results in the console
    return { lifePath, breakdown: { month: mReduced, day: dReduced, year: yReduced, total } };
  }

  // Day number: reduce day-of-month (30 -> 3). If someone is born on 11 we keep 11 as master day.
  function calcDayNum(dayVal) {
    return reduceMasterSafe(dayVal);
  }

  // --- Compute and display ---
  const { lifePath, breakdown } = calcLifePath(year, month, day);
  const dayNumber = calcDayNum(day);

  if (lifePathNumEl) lifePathNumEl.textContent = lifePath;
  if (dayNumEl) dayNumEl.textContent = dayNumber;

  const lifePathMeanings = {
    1: "Leader and pioneer — independence, originality, and courage.",
    2: "Diplomat and peacemaker — harmony and cooperation.",
    3: "Creative communicator — joy, artistry, and expression.",
    4: "Builder and stabilizer — structure, service, and discipline.",
    5: "Adventurer — freedom, exploration, and adaptability.",
    6: "Nurturer — love, responsibility, and beauty.",
    7: "Seeker of truth — introspection and spiritual study.",
    8: "Manifestor — material success and responsibility.",
    9: "Humanitarian — compassion and completion.",
    11: "Master Illuminator — intuition, inspiration, spiritual teaching.",
    22: "Master Builder — turning vision into practical reality.",
    33: "Master Teacher — unconditional love and service."
  };

  if (lifePathMeaningEl) lifePathMeaningEl.textContent = lifePathMeanings[lifePath] || "";
  if (dayNumMeaningEl) dayNumMeaningEl.textContent =
    `Day ${dayNumber} reflects your daily essence — ${lifePathMeanings[dayNumber] || "expressed through instinct and daily rhythm."}`;

  // Helpful console trace for debugging / learning:
  console.group("Numerology trace");
  console.log("Stored birthday:", storedBirthday);
  console.log("Parsed (YYYY-MM-DD):", `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
  console.log("Breakdown -> month reduced:", breakdown.month, ", day reduced:", breakdown.day, ", year reduced:", breakdown.year);
  console.log("Sum:", breakdown.total, "→ lifePath:", lifePath);
  console.log("dayNumber:", dayNumber);
  console.groupEnd();

  // Optionally store values for other pages (keeps your existing flow)
  localStorage.setItem("lifePathNum", String(lifePath));
  localStorage.setItem("dayNum", String(dayNumber));
})();


// === Cosmic Toggle (unchanged) ===
document.addEventListener("DOMContentLoaded", () => {
  const toggleCosmicBtn = document.getElementById("toggleCosmicBtn");
  const cosmicContent = document.getElementById("cosmicContent");

  if (toggleCosmicBtn && cosmicContent) {
    toggleCosmicBtn.addEventListener("click", () => {
      cosmicContent.classList.toggle("visible");
      cosmicContent.classList.toggle("hidden");

      toggleCosmicBtn.innerHTML = cosmicContent.classList.contains("visible")
        ? "<span>🌙 Hide Your Cosmic Blueprint 🌙</span>"
        : "<span>✨ Reveal Your Cosmic Blueprint ✨</span>";
    });
  }
});


