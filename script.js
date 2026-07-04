const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");

// Reproduce el audio
playBtn.addEventListener("click", () => {
  audio.play();
});

// Pausa el audio
pauseBtn.addEventListener("click", () => {
  audio.pause();
});
