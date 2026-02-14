function formatPace(minutesFloat) {
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);

  if (seconds === 60) {
    return `${minutes + 1}:00 min/km`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")} min/km`;
}

function toMinuteSecondParts(minutesFloat) {
  let minutes = Math.floor(minutesFloat);
  let seconds = Math.round((minutesFloat - minutes) * 60);

  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }

  return { minutes, seconds };
}

document.getElementById("paceToSpeedBtn").addEventListener("click", () => {
  const min = Number(document.getElementById("paceMinutes").value);
  const sec = Number(document.getElementById("paceSeconds").value);
  const result = document.getElementById("paceToSpeedResult");

  if (!Number.isFinite(min) || !Number.isFinite(sec) || min < 0 || sec < 0 || sec >= 60 || (min === 0 && sec === 0)) {
    result.textContent = "Inserisci un passo valido (es. 5:30).";
    return;
  }

  const totalMinutes = min + sec / 60;
  const speed = 60 / totalMinutes;
  document.getElementById("speedInput").value = speed.toFixed(2);
  result.textContent = `Velocità: ${speed.toFixed(2)} km/h`;
});

document.getElementById("speedToPaceBtn").addEventListener("click", () => {
  const speed = Number(document.getElementById("speedInput").value);
  const result = document.getElementById("speedToPaceResult");

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

document.getElementById("resetAllBtn").addEventListener("click", () => {
  const inputIds = ["paceMinutes", "paceSeconds", "speedInput", "altStart", "altEnd", "distanceKm"];
  const resultIds = ["paceToSpeedResult", "speedToPaceResult", "slopeResult"];

  inputIds.forEach((id) => {
    document.getElementById(id).value = "";
  });

  resultIds.forEach((id) => {
    document.getElementById(id).textContent = "";
  });
});
