/* ======================================================================
   Reproductor de audio + fondo animado (Summer Retro Festival)
   ====================================================================== */

const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const seek = document.getElementById("seek");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");

/* ----------------------------------------------------------------------
   1. Lógica del reproductor
   ---------------------------------------------------------------------- */

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
  if (audio.paused) audio.play();
  else audio.pause();
});

// Cambia el icono y (des)activa el fondo animado
audio.addEventListener("play", () => {
  playPauseBtn.textContent = "⏸";
  playPauseBtn.setAttribute("aria-label", "Pausar");
  visuals.start();
});

audio.addEventListener("pause", () => {
  playPauseBtn.textContent = "▶";
  playPauseBtn.setAttribute("aria-label", "Reproducir");
  visuals.stop();
});

audio.addEventListener("loadedmetadata", () => {
  seek.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", updateProgress);

audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  updateProgress();
  visuals.stop();
});

seek.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = parseFloat(seek.value);
  const pct = (audio.currentTime / audio.duration) * 100;
  seek.style.setProperty("--progress", pct + "%");
  currentEl.textContent = formatTime(audio.currentTime);
});

/* ----------------------------------------------------------------------
   2. Fondo animado (partículas)
   ---------------------------------------------------------------------- */

const visuals = (() => {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");

  // Paleta veraniega y alegre
  const COLORS = ["#ff7eb3", "#fee440", "#4cc9f0", "#f72585", "#b14aff", "#ffd86b", "#06ffa5", "#ff9e00"];

  let particles = [];
  let intensity = 0;        // brillo actual (0..1), suaviza el encendido/apagado
  let target = 0;           // objetivo: 1 suena, 0 pausa
  let rafId = null;
  let W = 0, H = 0;         // dimensiones lógicas

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // hex (#ff7eb3) + alpha -> "rgba(...)"
  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  // Crea una partícula nueva
  function makeParticle(initial) {
    const isOrb = Math.random() < 0.72;
    if (isOrb) {
      const r = rand(14, 90);
      return {
        type: "orb",
        r,
        baseX: rand(0, W),
        y: initial ? rand(-50, H) : H + r,
        vy: -rand(0.15, 0.75) * (1 + 30 / r),  // los pequeños suben más rápido
        vx: rand(-0.15, 0.15),
        swayAmp: rand(8, 55),
        swayFreq: rand(0.0004, 0.0016),
        phase: rand(0, Math.PI * 2),
        twinkleSpd: rand(0.001, 0.004),
        twinklePh: rand(0, Math.PI * 2),
        color: pick(COLORS),
        alpha: rand(0.12, 0.4),
      };
    }
    return {
      type: "confetti",
      size: rand(5, 12),
      x: rand(0, W),
      y: initial ? rand(0, H) : H + 20,
      vy: -rand(0.4, 1.3),
      vx: rand(-0.6, 0.6),
      rot: rand(0, Math.PI * 2),
      vrot: rand(-0.06, 0.06),
      color: pick(COLORS),
      alpha: rand(0.5, 1),
    };
  }

  function targetCount() {
    const area = W * H;
    const orbs = Math.min(36, Math.max(16, Math.round(area / 42000)));
    const conf = Math.min(18, Math.max(8, Math.round(area / 95000)));
    return orbs + conf;
  }

  function rebuildParticles() {
    const count = targetCount();
    particles = [];
    for (let i = 0; i < count; i++) particles.push(makeParticle(true));
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildParticles();
  }

  function step() {
    // Suavizado del brillo (encendido/apagado progresivo)
    intensity += (target - intensity) * 0.06;

    ctx.clearRect(0, 0, W, H);
    const now = performance.now();

    // --- Orbes con mezcla aditiva (brillo) ---
    ctx.globalCompositeOperation = "lighter";
    for (const p of particles) {
      if (p.type !== "orb") continue;
      p.baseX += p.vx;
      p.y += p.vy;
      p.twinklePh += p.twinkleSpd;
      if (p.y < -p.r - 40) Object.assign(p, makeParticle(false));

      const x = p.baseX + Math.sin(now * p.swayFreq + p.phase) * p.swayAmp;
      const tw = 0.7 + 0.3 * Math.sin(p.twinklePh);
      const a = p.alpha * intensity * tw;
      const g = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r);
      g.addColorStop(0, rgba(p.color, a));
      g.addColorStop(1, rgba(p.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- Confeti (mezcla normal) ---
    ctx.globalCompositeOperation = "source-over";
    for (const p of particles) {
      if (p.type !== "confetti") continue;
      p.x += p.vx + Math.sin(now * 0.001 + p.rot) * 0.3;
      p.y += p.vy;
      p.rot += p.vrot;
      if (p.y < -20 || p.x < -30 || p.x > W + 30) Object.assign(p, makeParticle(false));

      ctx.globalAlpha = p.alpha * intensity;
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // Continúa mientras haya brillo o se esté reproduciendo
    if (intensity > 0.01 || target > 0) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }

  // API pública
  return {
    init() {
      resize();
      window.addEventListener("resize", resize);
    },
    start() {
      target = 1;
      if (!rafId) rafId = requestAnimationFrame(step);
    },
    stop() {
      target = 0;
      // el bucle se detiene solo cuando el fundido llega casi a 0
      if (!rafId) rafId = requestAnimationFrame(step);
    },
  };
})();

visuals.init();
