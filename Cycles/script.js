// === INDEX PAGE ===
const generateBtn = document.getElementById('generateBtn');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const birthdayStr = document.getElementById('birthday').value;
        if (!birthdayStr) {
            alert("Please enter a birthday.");
            return;
        }

        // Parse birthday with explicit noon time
        const birthDate = new Date(birthdayStr + "T12:00:00");
        const today = new Date();

        // Most recent birthday calculation
        let recentBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate(), 12, 0, 0);
        if (recentBirthday > today) {
            recentBirthday.setFullYear(today.getFullYear() - 1);
        }

        // Save
        localStorage.setItem('birthday', birthdayStr);
        localStorage.setItem('recentBirthday', recentBirthday.toISOString());

        // Navigate to cycles page
        window.location.href = 'cycles.html';
    });
}

// === ALL OTHER PAGES ===
document.addEventListener("DOMContentLoaded", () => {
    const recentBirthdayStr = localStorage.getItem('recentBirthday');
    if (!recentBirthdayStr) return;

    const recentBirthday = new Date(recentBirthdayStr);

    // --- CYCLES PAGE ---
    const cyclesContainer = document.getElementById('cyclesContainer');
    if (cyclesContainer) {
        const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
        const tarot = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers"];
        const diamondOrder = [0, 2, 1, 3, 5, 4, 6]; // diamond layout

        diamondOrder.forEach(i => {
            const startDayNum = i * 52 + 1;
            const endDayNum = (i + 1) * 52;

            const startDate = new Date(recentBirthday);
            startDate.setDate(startDate.getDate() + (startDayNum - 1));
            const endDate = new Date(recentBirthday);
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
    const recentBirthday = new Date(localStorage.getItem('recentBirthday')) || new Date();

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
        const date = new Date(recentBirthday);
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
