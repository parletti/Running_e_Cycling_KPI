/**
 * Restituisce una stringa di passo nel formato m:ss min/km.
 * @param {number} minutesFloat - Minuti per chilometro in formato decimale.
 * @returns {string}
 */
function formatPace(minutesFloat) {
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);

  if (seconds === 60) {
    return `${minutes + 1}:00 min/km`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")} min/km`;
}

/**
 * Converte un passo decimale in parti separate minuti/secondi.
 * Gestisce il caso limite di arrotondamento a 60 secondi.
 * @param {number} minutesFloat
 * @returns {{ minutes: number, seconds: number }}
 */
function toMinuteSecondParts(minutesFloat) {
  let minutes = Math.floor(minutesFloat);
  let seconds = Math.round((minutesFloat - minutes) * 60);

  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }

  return { minutes, seconds };
}

/**
 * Converte minuti decimali in ore/minuti/secondi.
 * @param {number} minutesFloat
 * @returns {{ hours: number, minutes: number, seconds: number }}
 */
function toHourMinuteSecondParts(minutesFloat) {
  const totalSeconds = Math.round(minutesFloat * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const remaining = totalSeconds % 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return { hours, minutes, seconds };
}

// Popup "About": apertura e chiusura della descrizione iniziale.
const aboutBtn = document.getElementById("aboutBtn");
const aboutModal = document.getElementById("aboutModal");
const closeAboutBtn = document.getElementById("closeAboutBtn");

aboutBtn.addEventListener("click", () => {
  aboutModal.hidden = false;
});

closeAboutBtn.addEventListener("click", () => {
  aboutModal.hidden = true;
});

aboutModal.addEventListener("click", (event) => {
  if (event.target === aboutModal) {
    aboutModal.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !aboutModal.hidden) {
    aboutModal.hidden = true;
  }
});

// Linguette sezioni: mostra un pannello alla volta.
const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.tabTarget;

    tabButtons.forEach((tabButton) => {
      tabButton.classList.remove("active");
      tabButton.setAttribute("aria-selected", "false");
    });

    tabPanels.forEach((panel) => {
      panel.hidden = panel.id !== targetId;
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
  });
});

// Runner: da passo (min:sec) a velocita (km/h), con auto-compilazione del campo opposto.
document.getElementById("paceToSpeedBtn").addEventListener("click", () => {
  const min = Number(document.getElementById("paceMinutes").value);
  const sec = Number(document.getElementById("paceSeconds").value);
  const result = document.getElementById("paceToSpeedResult");
  const otherResult = document.getElementById("speedToPaceResult");

  otherResult.textContent = "";

  if (!Number.isFinite(min) || !Number.isFinite(sec) || min < 0 || sec < 0 || sec >= 60 || (min === 0 && sec === 0)) {
    result.textContent = "Inserisci un passo valido (es. 5:30).";
    return;
  }

  const totalMinutes = min + sec / 60;
  const speed = 60 / totalMinutes;
  document.getElementById("speedInput").value = speed.toFixed(2);
  result.textContent = `Velocità: ${speed.toFixed(2)} km/h`;
});

// Runner: da velocita (km/h) a passo (min:sec), con auto-compilazione del campo opposto.
document.getElementById("speedToPaceBtn").addEventListener("click", () => {
  const speed = Number(document.getElementById("speedInput").value);
  const result = document.getElementById("speedToPaceResult");
  const otherResult = document.getElementById("paceToSpeedResult");

  otherResult.textContent = "";

  if (!Number.isFinite(speed) || speed <= 0) {
    result.textContent = "Inserisci una velocità valida (> 0).";
    return;
  }

  const paceMinutes = 60 / speed;
  const paceParts = toMinuteSecondParts(paceMinutes);
  document.getElementById("paceMinutes").value = String(paceParts.minutes);
  document.getElementById("paceSeconds").value = String(paceParts.seconds).padStart(2, "0");
  result.textContent = `Passo: ${formatPace(paceMinutes)}`;
});

// Runner avanzato: con 2 parametri su 3 (passo, distanza, tempo) calcola il terzo.
document.getElementById("tripCalcBtn").addEventListener("click", () => {
  const paceMinRaw = document.getElementById("tripPaceMinutes").value.trim();
  const paceSecRaw = document.getElementById("tripPaceSeconds").value.trim();
  const distanceRaw = document.getElementById("tripDistanceKm").value.trim();
  const hoursRaw = document.getElementById("tripHours").value.trim();
  const minutesRaw = document.getElementById("tripMinutes").value.trim();
  const secondsRaw = document.getElementById("tripSeconds").value.trim();
  const result = document.getElementById("tripResult");

  const paceFilled = paceMinRaw !== "" || paceSecRaw !== "";
  const distanceFilled = distanceRaw !== "";
  const timeFilled = hoursRaw !== "" || minutesRaw !== "" || secondsRaw !== "";
  const filledCount = Number(paceFilled) + Number(distanceFilled) + Number(timeFilled);

  if (filledCount !== 2) {
    result.textContent = "Compila esattamente 2 parametri su 3.";
    return;
  }

  let paceMinutes;
  let distanceKm;
  let totalMinutes;

  if (paceFilled) {
    if (paceMinRaw === "" || paceSecRaw === "") {
      result.textContent = "Per il passo compila sia minuti sia secondi.";
      return;
    }

    const min = Number(paceMinRaw);
    const sec = Number(paceSecRaw);
    if (!Number.isFinite(min) || !Number.isFinite(sec) || min < 0 || sec < 0 || sec >= 60 || (min === 0 && sec === 0)) {
      result.textContent = "Passo non valido (usa formato min:sec).";
      return;
    }
    paceMinutes = min + sec / 60;
  }

  if (distanceFilled) {
    distanceKm = Number(distanceRaw);
    if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
      result.textContent = "Distanza non valida (> 0).";
      return;
    }
  }

  if (timeFilled) {
    const hours = hoursRaw === "" ? 0 : Number(hoursRaw);
    const minutes = minutesRaw === "" ? 0 : Number(minutesRaw);
    const seconds = secondsRaw === "" ? 0 : Number(secondsRaw);
    if (
      !Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds) ||
      hours < 0 || minutes < 0 || seconds < 0 || minutes >= 60 || seconds >= 60 ||
      (hours === 0 && minutes === 0 && seconds === 0)
    ) {
      result.textContent = "Tempo totale non valido (ore:minuti:secondi).";
      return;
    }
    totalMinutes = hours * 60 + minutes + seconds / 60;
  }

  if (!paceFilled) {
    const computedPace = totalMinutes / distanceKm;
    const paceParts = toMinuteSecondParts(computedPace);
    document.getElementById("tripPaceMinutes").value = String(paceParts.minutes);
    document.getElementById("tripPaceSeconds").value = String(paceParts.seconds).padStart(2, "0");
    result.textContent = `Passo calcolato: ${formatPace(computedPace)}`;
    return;
  }

  if (!distanceFilled) {
    const computedDistance = totalMinutes / paceMinutes;
    document.getElementById("tripDistanceKm").value = computedDistance.toFixed(2);
    result.textContent = `Distanza calcolata: ${computedDistance.toFixed(2)} km`;
    return;
  }

  const computedTotalMinutes = paceMinutes * distanceKm;
  const timeParts = toHourMinuteSecondParts(computedTotalMinutes);
  document.getElementById("tripHours").value = String(timeParts.hours);
  document.getElementById("tripMinutes").value = String(timeParts.minutes).padStart(2, "0");
  document.getElementById("tripSeconds").value = String(timeParts.seconds).padStart(2, "0");
  result.textContent = `Tempo totale calcolato: ${timeParts.hours}:${String(timeParts.minutes).padStart(2, "0")}:${String(timeParts.seconds).padStart(2, "0")}`;
});

// Ciclisti: calcolo pendenza media percentuale partendo da dislivello e distanza.
document.getElementById("slopeBtn").addEventListener("click", () => {
  const altStart = Number(document.getElementById("altStart").value);
  const altEnd = Number(document.getElementById("altEnd").value);
  const distanceKm = Number(document.getElementById("distanceKm").value);
  const result = document.getElementById("slopeResult");

  if (!Number.isFinite(altStart) || !Number.isFinite(altEnd) || !Number.isFinite(distanceKm) || distanceKm <= 0) {
    result.textContent = "Inserisci valori validi (distanza > 0).";
    return;
  }

  const elevationGain = altEnd - altStart;
  const distanceMeters = distanceKm * 1000;
  const slopePercent = (elevationGain / distanceMeters) * 100;

  result.textContent = `Dislivello: ${elevationGain.toFixed(1)} m | Pendenza media: ${slopePercent.toFixed(2)}%`;
});

// Reset globale: svuota tutti gli input e tutte le aree risultato.
document.querySelectorAll("[data-reset-all]").forEach((button) => {
  button.addEventListener("click", () => {
    const inputIds = [
      "paceMinutes", "paceSeconds", "speedInput",
      "tripPaceMinutes", "tripPaceSeconds", "tripDistanceKm", "tripHours", "tripMinutes", "tripSeconds",
      "altStart", "altEnd", "distanceKm"
    ];
    const resultIds = ["paceToSpeedResult", "speedToPaceResult", "tripResult", "slopeResult"];

    inputIds.forEach((id) => {
      document.getElementById(id).value = "";
    });

    resultIds.forEach((id) => {
      document.getElementById(id).textContent = "";
    });
  });
});
