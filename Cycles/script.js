// === INDEX PAGE ===
const generateBtn = document.getElementById('generateBtn');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const birthdayStr = document.getElementById('birthday').value;
        if (!birthdayStr) {
            alert("Please enter a birthday.");
            return;
        }

        // Parse birthday as local date (explicit noon avoids timezone shift)
        const birthDate = new Date(birthdayStr + "T12:00:00");
        const today = new Date();

        // --- Find most recent birthday ---
        let recentBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate(), 12, 0, 0);
        if (recentBirthday > today) {
            recentBirthday.setFullYear(today.getFullYear() - 1);
        }

        // 🌞 NEW: The cycles begin the day AFTER the birthday
        const cycleStart = new Date(recentBirthday);
        cycleStart.setDate(cycleStart.getDate() + 1); // Dec 1 if birthday = Nov 30

        // 🌝 NEW: The cycles end 364 days later (the day before next birthday)
        const cycleEnd = new Date(cycleStart);
        cycleEnd.setDate(cycleEnd.getDate() + 363); // inclusive 364-day span

        // Save all relevant data
        localStorage.setItem('birthday', birthdayStr);
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

        // Birthday highlight
        const birthdayHighlight = document.createElement('div');
        birthdayHighlight.classList.add('cycle-box', 'birthday-box');
        birthdayHighlight.innerHTML = `
         <h2>🎂 Birthday</h2>
         <p>${recentBirthday.toLocaleDateString()}</p>
         <p>This is your solar reset — the 365th day, completing your cycle year.</p>
         `;
        cyclesContainer.appendChild(birthdayHighlight);


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
                <p>Weekly lesson placeholder</p>
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


document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.getElementById("timelineScroller");
  const bar = document.getElementById("timelineBar");
  const marker = document.getElementById("timelineMarker");
  if (!scroller || !bar || !marker) return;

  const page = document.body.dataset.page; // "cycles" | "weeks" | "daily"
  const colors = [
    "#FFD700", // Sun
    "#F56F00", // Moon
    "#C13EFF", // Mars
    "#00CFFF", // Mercury
    "#00FF90", // Jupiter
    "#FF4B91", // Venus
    "#7080FF"  // Saturn
  ];

  // Calculate temporal position
  const cycleStart = new Date(localStorage.getItem("cycleStart"));
  const today = new Date();
  const dayOfYear = Math.floor((today - cycleStart) / (1000 * 60 * 60 * 24));

  const currentCycle = Math.floor(dayOfYear / 52); // 0–6
  const currentWeek = Math.floor(dayOfYear / 7);  // 0–51
  const currentDay = dayOfYear % 7;               // 0–6

  let totalSegments, activeIndex, label;

  if (page === "cycles") {
    totalSegments = 7;
    activeIndex = currentCycle;
    label = "Cycle " + (currentCycle + 1);
  } else if (page === "weeks") {
    totalSegments = 52;
    activeIndex = currentWeek;
    label = "Week " + (currentWeek + 1);
  } else {
    totalSegments = 7;
    activeIndex = currentDay;
    label = "Today";
  }

  // Render segments
  bar.innerHTML = "";
  for (let i = 0; i < totalSegments; i++) {
    const seg = document.createElement("div");
    seg.className = "timeline-segment";
    seg.style.background = colors[i % colors.length];
    if (i === activeIndex) seg.classList.add("active");

    // Clicking a segment moves to that page scope
    seg.addEventListener("click", () => {
      if (page === "cycles") {
        localStorage.setItem("cycle", i + 1);
        window.location.href = "weeks.html";
      } else if (page === "weeks") {
        localStorage.setItem("week", i + 1);
        window.location.href = "daily.html";
      } else {
        localStorage.setItem("selectedDay", i + 1);
        window.location.href = "daily.html";
      }
    });

    bar.appendChild(seg);
  }

  // Label marker
  marker.textContent = label;
  marker.onclick = () => {
    if (page === "cycles") window.location.href = "weeks.html";
    else if (page === "weeks") window.location.href = "daily.html";
    else window.location.href = "daily.html";
  };

  // Scroll to center the active segment
  setTimeout(() => {
    const active = bar.children[activeIndex];
    if (active) {
      const scrollCenter = active.offsetLeft - scroller.offsetWidth / 2 + active.offsetWidth / 2;
      scroller.scrollTo({ left: scrollCenter, behavior: "smooth" });
    }
  }, 200);
});

document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.getElementById("timelineScroller");
  const bar = document.getElementById("timelineBar");
  const selector = document.getElementById("timelineSelector");
  if (!scroller || !bar || !selector) return;

  const totalCycles = 7;
  bar.innerHTML = "";

  for (let i = 1; i <= totalCycles; i++) {
    const node = document.createElement("div");
    node.className = "timeline-node";
    node.textContent = `Cycle ${i}`;
    bar.appendChild(node);
  }

  let scrollTimeout;

  function highlightNearestNode() {
    const nodes = [...bar.children];
    const selectorRect = selector.getBoundingClientRect();
    let closest = null;
    let minDist = Infinity;

    nodes.forEach((node, index) => {
      const rect = node.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(center - selectorRect.left - selectorRect.width / 2);
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });

    nodes.forEach((n, i) => n.classList.toggle("active", i === closest));

    // Optionally: auto-snap to center
    const targetNode = nodes[closest];
    const targetCenter = targetNode.offsetLeft + targetNode.offsetWidth / 2;
    const scrollTo = targetCenter - scroller.offsetWidth / 2;
    scroller.scrollTo({ left: scrollTo, behavior: "smooth" });

    // Save selection or trigger logic
    localStorage.setItem("selectedCycle", closest + 1);
  }

  scroller.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(highlightNearestNode, 150);
  });

  highlightNearestNode();
});

if (cyclesBtn && getUserStatus() === 'guest') {
  cyclesBtn.classList.add('locked');
}
