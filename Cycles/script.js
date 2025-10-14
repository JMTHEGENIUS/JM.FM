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

        // Inside weekly.html JS
          document.querySelectorAll('#weeksContainer .week-box').forEach((box, index) => {
            box.addEventListener('click', () => {
              const selectedDay = (index * 7) + 1;  // example: week 1 starts at day 1, week 2 at 8, etc.
              localStorage.setItem('selectedDay', selectedDay);
              window.location.href = 'daily.html';
  });
});

    }

    // --- DAILY PAGE ---
if (document.getElementById('dailyTitle')) {

  // Clear selectedDay so it doesn't override current week logic
    localStorage.removeItem('selectedDay');


    const cycleNumber = parseInt(localStorage.getItem('cycle')) || 1;
    const weekNumber = parseInt(localStorage.getItem('week')) || 1;
    const weekStart = parseInt(localStorage.getItem('weekStart')) || 1;

    const cycleStartStr = localStorage.getItem('cycleStart');
    const cycleStart = cycleStartStr ? new Date(cycleStartStr) : new Date();

    const birthdayStr = localStorage.getItem('birthday');
    const birthday = birthdayStr ? new Date(birthdayStr + "T12:00:00") : null;

    const dailyData = [
        { day: "Sunday", lesson: "Focus on self-reflection.", affirmation: "I grow each day with purpose.", planet: "Sun", sign: "Leo", colors: "Gold", chakra: "Solar Plexus", journalPrompt: "What did I learn today?" },
        { day: "Monday", lesson: "Connect with intuition.", affirmation: "I trust my inner guidance.", planet: "Moon", sign: "Cancer", colors: "Silver", chakra: "Sacral", journalPrompt: "How did I feel emotionally today?" },
        { day: "Tuesday", lesson: "Take action towards goals.", affirmation: "I move forward with confidence.", planet: "Mars", sign: "Aries", colors: "Red", chakra: "Root", journalPrompt: "What action did I take today?" },
        { day: "Wednesday", lesson: "Communicate clearly.", affirmation: "I express myself with clarity.", planet: "Mercury", sign: "Gemini", colors: "Blue", chakra: "Throat", journalPrompt: "What conversations mattered today?" },
        { day: "Thursday", lesson: "Expand your knowledge.", affirmation: "I seek wisdom every day.", planet: "Jupiter", sign: "Sagittarius", colors: "Purple", chakra: "Third Eye", journalPrompt: "What new knowledge did I gain today?" },
        { day: "Friday", lesson: "Balance relationships.", affirmation: "I nurture harmony around me.", planet: "Venus", sign: "Libra", colors: "Pink", chakra: "Heart", journalPrompt: "How did I connect with others today?" },
        { day: "Saturday", lesson: "Rest and recharge.", affirmation: "I honor my body and mind.", planet: "Saturn", sign: "Capricorn", colors: "Black", chakra: "Root", journalPrompt: "How did I rest today?" }
    ];

    // Determine currentDay based on whether it's the current week
    let currentDay;

    // Calculate current week number relative to cycleStart
    const today = new Date();
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const todayWeekNumber = Math.floor((today - cycleStart) / msPerWeek) + 1;

    if (weekStart === todayWeekNumber) {
        // Current week → show today's day
        currentDay = ((today - cycleStart) / (24 * 60 * 60 * 1000)) % 7 + 1; 
        currentDay = Math.floor(currentDay); // ensure integer
    } else {
        // Past/future week → show first day
        currentDay = 1;
    }

    function renderDay(n) {
        currentDay = n;

        const globalDay = weekStart + (n - 1);
        const date = new Date(cycleStart);
        date.setDate(date.getDate() + (globalDay - 1));

        const weekday = date.getDay();
        const info = dailyData[weekday];

        document.getElementById('dailyTitle').textContent =
            `${date.toLocaleString('default', { weekday: 'long' })}, ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;

        document.getElementById('dailylesson').textContent = info.lesson;

        document.getElementById('dailyInfo').innerHTML = `
            <h3>Daily Info</h3>
            <p><strong>Affirmation:</strong> ${info.affirmation}</p>
            <p><strong>Planetary Energy:</strong> ${info.planet}</p>
            <p><strong>Ruling Planet:</strong> ${info.planet}</p>
            <p><strong>Ruling Sign:</strong> ${info.sign}</p>
            <p><strong>Day Number:</strong> ${n}</p>
            <p><strong>Day Colors:</strong> ${info.colors}</p>
            <p><strong>Chakra:</strong> ${info.chakra}</p>
        `;

        // Journal prompt above journal box
        const journalPromptEl = document.getElementById('journalPrompt');
        if (journalPromptEl) journalPromptEl.textContent = info.journalPrompt;
    }

    document.getElementById('prevDay').addEventListener('click', () => {
        if (currentDay > 1) renderDay(currentDay - 1);
    });

    document.getElementById('nextDay').addEventListener('click', () => {
        if (currentDay < 7) renderDay(currentDay + 1);
    });

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
  const zodiacMeaningEl = document.getElementById("zodiacMeaning");
  const lifePathNumEl = document.getElementById("lifePathNum");
  const lifePathMeaningEl = document.getElementById("lifePathMeaning");
  const dayNumEl = document.getElementById("dayNum");
  const dayNumMeaningEl = document.getElementById("dayNumMeaning");
});

// Robust birthday parser: YYYY-MM-DD, MM-DD-YYYY, MM/DD/YYYY
// === ZODIAC & NUMEROLOGY SECTION (replace old block with this) ===
(function() {
  // ==================== UTILITY FUNCTIONS ====================
  function sumDigits(n) {
    return String(n).split("").map(Number).reduce((a,b)=>a+b,0);
  }

  // Reduce numbers while preserving master numbers 11, 22, 33
  function reduceMasterSafe(n) {
    n = Number(n);
    if ([11,22,33].includes(n)) return n;
    while (n > 9 && ![11,22,33].includes(n)) {
      n = sumDigits(n);
      if ([11,22,33].includes(n)) return n;
    }
    return n;
  }

  // Robust birthday parser: supports YYYY-MM-DD, MM-DD-YYYY, MM/DD/YYYY
  function parseBirthday(str) {
    const parts = str.split(/[^0-9]+/).filter(Boolean);
    if (parts.length === 3) {
      if (parts[0].length === 4) return { year:+parts[0], month:+parts[1], day:+parts[2] };
      return { month:+parts[0], day:+parts[1], year:+parts[2] };
    }
    const d = new Date(str);
    if (!isNaN(d)) return { year:d.getFullYear(), month:d.getMonth()+1, day:d.getDate() };
    return null;
  }

  // ==================== NUMEROLOGY ====================
  function calculateLifePath(yearVal, monthVal, dayVal) {
    const m = reduceMasterSafe(monthVal);
    const d = reduceMasterSafe(dayVal);
    const y = reduceMasterSafe(sumDigits(yearVal));
    const total = m + d + y;
    return reduceMasterSafe(total);
  }

  function calculateDayNumber(dayVal) {
    return reduceMasterSafe(dayVal);
  }

  function calculateDestinyNumber(fullName) {
    if (!fullName) return null;
    const letters = fullName.toUpperCase().replace(/[^A-Z]/g,'').split('');
    const letterValues = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
                          J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
                          S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
    const total = letters.reduce((sum,l)=>sum+(letterValues[l]||0),0);
    return reduceMasterSafe(total);
  }

  function calculateSoulUrgeNumber(fullName) {
    if (!fullName) return null;
    const vowels = fullName.toUpperCase().match(/[AEIOUY]/g);
    if (!vowels) return null;
    const letterValues = {A:1,E:5,I:9,O:6,U:3,Y:7};
    const total = vowels.reduce((sum,l)=>sum+(letterValues[l]||0),0);
    return reduceMasterSafe(total);
  }

    const numerologyMeanings = {
      lifePath:{1:"Leadership, independence, and self-mastery.",
                2:"Cooperation, diplomacy, and intuitive harmony.",
                3:"Creativity, expression, and joyful communication.",
                4:"Discipline, structure, and reliable manifestation.",
                5:"Freedom, adaptability, and exploration.",
                6:"Responsibility, nurturing, and love.",
                7:"Spirituality, introspection, and deep wisdom.",
                8:"Power, success, and material manifestation.",
                9:"Compassion, completion, and global service.",
                11:"Spiritual illumination and visionary intuition.",
                22:"Master builder, manifesting dreams into form.",
                33:"Master teacher, divine compassion in action."},
      destiny:{1:"Lead with innovation and courage.",
               2:"Peacekeeping and emotional intelligence.",
               3:"Light through art, humor, and communication.",
               4:"Build lasting foundations of security and trust.",
               5:"Experience freedom and inspire change.",
               6:"Nurture others through beauty, love, and service.",
               7:"Seek truth and share higher wisdom.",
               8:"Master power, leadership, and wealth consciousness.",
               9:"Complete cycles and heal the collective.",
               11:"Be a lightbearer and spiritual teacher.",
               22:"Manifest grand visions for humanity.",
               33:"Guide others through sacred compassion."},
      soulUrge:{1:"Desire independence and to be seen as a leader.",
                2:"Long for harmony and deep emotional connection.",
                3:"Crave expression, laughter, and creativity.",
                4:"Seek stability, order, and meaningful work.",
                5:"Yearn for freedom, travel, and new experiences.",
                6:"Desire family, love, and beauty in all forms.",
                7:"Seek spiritual truth and solitude for reflection.",
                8:"Desire success, recognition, and material mastery.",
                9:"Crave connection, purpose, and emotional healing.",
                11:"Inspire others through divine light.",
                22:"Create lasting spiritual legacies.",
                33:"Embody unconditional love and sacred teaching."},
      dayNum: {1:"A pioneer day — take charge and lead through initiative.",
               2:"A cooperative day — focus on balance, partnership, and patience.",
               3:"A creative day — express yourself freely through art or conversation.",
               4:"A productive day — build routines and finish what you start.",
               5:"A dynamic day — explore something new or change your scenery.",
               6:"A nurturing day — tend to relationships, home, and harmony.",
               7:"A reflective day — seek solitude, study, or spiritual insight.",
               8:"An empowered day — set goals and take bold, decisive action.",
               9:"A compassionate day — release old energy and help someone in need.",
               11:"A visionary day — follow intuition and share inspired ideas.",
               22:"A manifesting day — plan tangible steps for a long-term dream.",
               33:"A heart-centered day — guide or teach through love and example."}
    };

  // ==================== ZODIAC ====================
  const zodiacData = [
    { sign:"Capricorn", start:[12,22], end:[1,19], meaning:"Practical, grounded, and ambitious." },
    { sign:"Aquarius", start:[1,20], end:[2,18], meaning:"Visionary, independent, and humanitarian." },
    { sign:"Pisces", start:[2,19], end:[3,20], meaning:"Empathic, imaginative, and spiritual." },
    { sign:"Aries", start:[3,21], end:[4,19], meaning:"Bold, fiery, and pioneering." },
    { sign:"Taurus", start:[4,20], end:[5,20], meaning:"Stable, artistic, and sensual." },
    { sign:"Gemini", start:[5,21], end:[6,20], meaning:"Curious, communicative, and quick-minded." },
    { sign:"Cancer", start:[6,21], end:[7,22], meaning:"Nurturing, protective, and intuitive." },
    { sign:"Leo", start:[7,23], end:[8,22], meaning:"Radiant, generous, and strong." },
    { sign:"Virgo", start:[8,23], end:[9,22], meaning:"Analytical, healing, and devoted." },
    { sign:"Libra", start:[9,23], end:[10,22], meaning:"Balanced, graceful, and diplomatic." },
    { sign:"Scorpio", start:[10,23], end:[11,21], meaning:"Transformative, passionate, and intense." },
    { sign:"Sagittarius", start:[11,22], end:[12,21], meaning:"Adventurous, wise, and freedom-loving." }
  ];

  const zodiacMoonData = [
    { sign:"Aries", meaning:"Your emotions ignite quickly; you crave excitement and act on feeling." },
    { sign:"Taurus", meaning:"You find comfort in stability and sensual pleasure — slow to anger, slow to change." },
    { sign:"Gemini", meaning:"Your feelings shift like the wind; you need mental stimulation and variety." },
    { sign:"Cancer", meaning:"You’re deeply nurturing and sensitive — emotions ebb and flow like the tides." },
    { sign:"Leo", meaning:"Your heart seeks recognition and warmth — you shine through affection and pride." },
    { sign:"Virgo", meaning:"You analyze emotions; peace comes from order, service, and quiet acts of love." },
    { sign:"Libra", meaning:"Your heart seeks harmony and beauty; balance in relationships is vital." },
    { sign:"Scorpio", meaning:"You feel everything intensely — passion and transformation fuel your emotions." },
    { sign:"Sagittarius", meaning:"You crave emotional freedom — optimism and exploration keep your spirit alive." },
    { sign:"Capricorn", meaning:"You manage feelings with discipline — you express care through responsibility." },
    { sign:"Aquarius", meaning:"You need emotional independence — you love through friendship and ideals." },
    { sign:"Pisces", meaning:"Your emotions are boundless and compassionate — intuition is your language of love." }
];

  const zodiacRisingData = [
    { sign:"Aries", meaning:"You appear bold, spontaneous, and direct — people see your fire first." },
    { sign:"Taurus", meaning:"You come across as calm, steady, and sensual — grounded in presence." },
    { sign:"Gemini", meaning:"You project curiosity and wit — adaptable and talkative in every crowd." },
    { sign:"Cancer", meaning:"You seem nurturing and intuitive — others feel safe around your energy." },
    { sign:"Leo", meaning:"You radiate confidence and charisma — a natural spotlight follows you." },
    { sign:"Virgo", meaning:"You appear organized, thoughtful, and helpful — others trust your discernment." },
    { sign:"Libra", meaning:"You seem charming, balanced, and stylish — relationships shape your identity." },
    { sign:"Scorpio", meaning:"You exude mystery and intensity — people sense your depth immediately." },
    { sign:"Sagittarius", meaning:"You give off adventurous, optimistic vibes — open-minded and inspiring." },
    { sign:"Capricorn", meaning:"You appear mature and reliable — ambition and structure define your aura." },
    { sign:"Aquarius", meaning:"You come across as unique and independent — a visionary energy surrounds you." },
    { sign:"Pisces", meaning:"You appear dreamy and empathetic — your vibe is mystical and fluid." }
];

  function getZodiac(month, day) {
    return zodiacData.find(z => (month===z.start[0] && day>=z.start[1]) || (month===z.end[0] && day<=z.end[1])) || { sign:"Unknown", meaning:"" };
  }

  // ==================== ARCHETYPE ====================
    function generateArchetype(lifePath, sunSign, moonSign, risingSign) {
      const archetypes = {
        1:"The Celestial Leader",2:"The Harmonizer of Worlds",3:"The Luminous Creator",
        4:"The Star Architect",5:"The Cosmic Explorer",6:"The Sacred Healer",
        7:"The Mystic Seer",8:"The Galactic Builder",9:"The Universal Visionary",
        11:"The Light Messenger",22:"The Master Alchemist",33:"The Divine Teacher"
      };
      const starArchetype = archetypes[lifePath] || "The Cosmic Wanderer";

      const elementMap = { Fire:["Aries","Leo","Sagittarius"], Earth:["Taurus","Virgo","Capricorn"],
                          Air:["Gemini","Libra","Aquarius"], Water:["Cancer","Scorpio","Pisces"] };

      const signs = [sunSign, moonSign, risingSign];
      const elementCount = { Fire:0, Earth:0, Air:0, Water:0 };
      for (const [el, signsArr] of Object.entries(elementMap)) {
        elementCount[el] = signs.filter(s => signsArr.includes(s)).length;
      }

      const dominantElement = Object.keys(elementCount).reduce((a,b)=>elementCount[a]>=elementCount[b]?a:b);
      const elementalBalance = Object.entries(elementCount).map(([el,count])=>`${el}: ${count}`).join(", ");

      const fixedStarSets = {
        Fire:[{name:"Aldebaran",meaning:"Bravery and sacred mission — the Eye of the Bull."},
              {name:"Regulus",meaning:"Royalty, heart-centered leadership, divine courage."}],
        Earth:[{name:"Spica",meaning:"Harvest, mastery, abundance, and grace."},
              {name:"Capella",meaning:"Wisdom of the Earth and nurturing creation."}],
        Air:[{name:"Vega",meaning:"Harmony, inspiration, and celestial artistry."},
            {name:"Altair",meaning:"Intellectual clarity and the power of ideas."}],
        Water:[{name:"Fomalhaut",meaning:"Spiritual dreams, intuition, and sacred imagination."},
              {name:"Achernar",meaning:"Emotional renewal and compassion through change."}]
      };

      const fixedStars = fixedStarSets[dominantElement] || [
        {name:"Sirius",meaning:"Illumination and divine guidance."},
        {name:"Antares",meaning:"Transformation and deep inner power."}
      ];

      const activations = {
        1:"Take initiative — start the project you've been delaying.",
        2:"Meditate on balance and partnership daily.",
        3:"Write, sing, or create something joyful this week.",
        4:"Build a system or habit that grounds your vision.",
        5:"Travel or explore something new to reset your spirit.",
        6:"Practice empathy and offer healing service to someone.",
        7:"Spend a night under the stars journaling your insights.",
        8:"Set tangible goals aligned with your higher purpose.",
        9:"Release the past and act from compassion, not control.",
        11:"Share a message or vision that uplifts the collective.",
        22:"Begin manifesting a dream that benefits your community.",
        33:"Guide someone who needs support — teach through love."
      };
      const activationSteps = activations[lifePath] || "Ground your cosmic insight into daily action.";

      return { starArchetype, dominantElement, elementalBalance, fixedStars, activationSteps };
    }

 // ==================== MAIN DISPLAY ====================
  document.addEventListener("DOMContentLoaded", () => {
    const birthdayStr = localStorage.getItem("birthday");
    const fullName = localStorage.getItem("fullName") || "Mystery Soul";
    if (!birthdayStr) return;

    const parsed = parseBirthday(birthdayStr);
    if (!parsed) return;
    const { year, month, day } = parsed;

    // Zodiac
    const zodiac = getZodiac(month, day);
    if (document.getElementById("zodiacSign")) document.getElementById("zodiacSign").textContent = zodiac.sign;
    if (document.getElementById("zodiacMeaning")) document.getElementById("zodiacMeaning").textContent = zodiac.meaning;

    // Numerology
    const lifePath = calculateLifePath(year, month, day);
    const destiny = calculateDestinyNumber(fullName);
    const soulUrge = calculateSoulUrgeNumber(fullName);
    const dayNumber = calculateDayNumber(day);

    if (document.getElementById("lifePathNum")) document.getElementById("lifePathNum").textContent = lifePath;
    if (document.getElementById("lifePathMeaning")) document.getElementById("lifePathMeaning").textContent = numerologyMeanings.lifePath[lifePath];
    if (document.getElementById("destinyNum")) document.getElementById("destinyNum").textContent = destiny;
    if (document.getElementById("destinyMeaning")) document.getElementById("destinyMeaning").textContent = numerologyMeanings.destiny[destiny];
    if (document.getElementById("soulUrgeNum")) document.getElementById("soulUrgeNum").textContent = soulUrge;
    if (document.getElementById("soulUrgeMeaning")) document.getElementById("soulUrgeMeaning").textContent = numerologyMeanings.soulUrge[soulUrge];
    if (document.getElementById("dayNum")) document.getElementById("dayNum").textContent = dayNumber;
    if (document.getElementById("dayNumMeaning")) document.getElementById("dayNumMeaning").textContent = numerologyMeanings.dayNum[dayNumber];

    // Archetype
    const moonSign = localStorage.getItem("moonSign") || "Gemini";
    const risingSign = localStorage.getItem("risingSign") || "Leo";
    const archetype = generateArchetype(lifePath, zodiac.sign, moonSign, risingSign);

    if (document.getElementById("archetype"))
      document.getElementById("archetype").textContent = archetype.starArchetype;
    if (document.getElementById("dominantElement"))
      document.getElementById("dominantElement").textContent = archetype.dominantElement;
    if (document.getElementById("elementalBalance"))
      document.getElementById("elementalBalance").textContent = archetype.elementalBalance;
    if (document.getElementById("fixedStars"))
      document.getElementById("fixedStars").innerHTML = archetype.fixedStars
        .map(f => `<li><strong>${f.name}:</strong> ${f.meaning}</li>`)
        .join('');
    if (document.getElementById("activationSteps"))
      document.getElementById("activationSteps").textContent = archetype.activationSteps;

    console.log("🔮 Archetype generated:", archetype);
  });
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

