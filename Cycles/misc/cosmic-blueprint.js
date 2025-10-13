// === cosmic-blueprint.js ===
document.addEventListener("DOMContentLoaded", () => {
  const blueprint = JSON.parse(localStorage.getItem("cosmicBlueprint"));

  if (!blueprint) {
    alert("Please generate your Cosmic Blueprint first.");
    window.location.href = "index.html";
    return;
  }

  // === USER INFO ===
  document.getElementById("userName").textContent = blueprint.fullName || "Guest User";
  document.getElementById("userBirthday").textContent = blueprint.birthday || "—";
  document.getElementById("userBirthTime").textContent = blueprint.birthTime || "—";
  document.getElementById("userBirthLocation").textContent = blueprint.birthLocation || "—";

  // === NUMEROLOGY ===
  if (blueprint.numerology) {
    document.getElementById("lifePathNum").textContent = blueprint.numerology.lifePath || "—";
    document.getElementById("destinyNum").textContent = blueprint.numerology.destiny || "—";
    document.getElementById("soulUrgeNum").textContent = blueprint.numerology.soulUrge || "—";

    document.getElementById("lifePathDesc").textContent = blueprint.numerology.lifePathDesc || "";
    document.getElementById("destinyDesc").textContent = blueprint.numerology.destinyDesc || "";
    document.getElementById("soulUrgeDesc").textContent = blueprint.numerology.soulUrgeDesc || "";
  }

  // === ASTROLOGY ===
  if (blueprint.birthChart) {
    document.getElementById("sunSign").textContent = blueprint.birthChart.sunSign || "—";
    document.getElementById("moonSign").textContent = blueprint.birthChart.moonSign || "—";
    document.getElementById("risingSign").textContent = blueprint.birthChart.risingSign || "—";

    document.getElementById("sunMeaning").textContent = blueprint.birthChart.sunMeaning || "";
    document.getElementById("moonMeaning").textContent = blueprint.birthChart.moonMeaning || "";
    document.getElementById("risingMeaning").textContent = blueprint.birthChart.risingMeaning || "";
  }

  // === ARCHETYPE ===
  if (blueprint.archetype) {
    document.getElementById("starArchetype").textContent = blueprint.archetype.starArchetype || "—";
    document.getElementById("archetypeSummary").textContent = blueprint.archetype.archetypeSummary || "";
  }

  // === ELEMENTAL BALANCE ===
  if (Array.isArray(blueprint.elementalBalance)) {
    document.getElementById("elementalBalance").innerHTML = blueprint.elementalBalance
      .map(e => `<li>${e}</li>`)
      .join("");
  }

  // === FIXED STARS ===
  if (Array.isArray(blueprint.fixedStars)) {
    document.getElementById("fixedStars").innerHTML = blueprint.fixedStars
      .map(star => `<li><strong>${star.name}:</strong> ${star.meaning}</li>`)
      .join("");
  }

  // === ACTIVATION STEPS ===
  if (blueprint.activationSteps) {
    document.getElementById("activationSteps").textContent = blueprint.activationSteps;
  }

  // === BACK BUTTON ===
  const backBtn = document.getElementById("backToCyclesBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "cycles.html";
    });
  }
});
