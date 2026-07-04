const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const seek = document.getElementById("seek");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");

// Convierte segundos a formato m:ss
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" + s : s);
}

// Pinta el progreso en la barra y actualiza el tiempo actual
function updateProgress() {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  seek.style.setProperty("--progress", pct + "%");
  currentEl.textContent = formatTime(audio.currentTime);
}

// Un único botón: si está parado, reproduce; si suena, pausa
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Cambia el icono a "pause" cuando empieza a sonar
audio.addEventListener("play", () => {
  playPauseBtn.textContent = "⏸";
  playPauseBtn.setAttribute("aria-label", "Pausar");
});

// Vuelve a "play" cuando se pausa o termina
audio.addEventListener("pause", () => {
  playPauseBtn.textContent = "▶";
  playPauseBtn.setAttribute("aria-label", "Reproducir");
});

// Cuando el navegador conoce la duración total de la canción
audio.addEventListener("loadedmetadata", () => {
  seek.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});

// Actualiza la barra mientras suena
audio.addEventListener("timeupdate", updateProgress);

// Al terminar, vuelve al principio
audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  updateProgress();
});

// Permite arrastrar el selector para saltar a otro punto de la canción
seek.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = parseFloat(seek.value);
  const pct = (audio.currentTime / audio.duration) * 100;
  seek.style.setProperty("--progress", pct + "%");
  currentEl.textContent = formatTime(audio.currentTime);
});
