// 🎈 1. Personalize greeting from URL
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
const greeting = document.getElementById('greeting');

if (name) {
  greeting.textContent = `Happy Birthday, ${name}! 🎉`;
}

// 🔇 2. Toggle mute button
document.getElementById('muteButton').addEventListener('click', () => {
  const music = document.getElementById('backgroundMusic');
  music.muted = !music.muted;
});


// 🔥 3. Blow to extinguish the flame
function blowOutFlame() {
  console.log("🔥 blowOutFlame triggered");

  const flame = document.getElementById('flame');
  const smoke = document.getElementById('smoke');

  console.log("Flame element:", flame);
  console.log("Smoke element:", smoke);

  flame.style.transition = 'transform 0.5s, opacity 0.5s';
  flame.style.transform = 'translateY(-20px)';
  flame.style.opacity = '0';

  smoke.classList.add('active');

  setTimeout(() => {
    flame.style.transition = 'none';
    flame.style.transform = 'translateY(0)';
    flame.style.opacity = '1';
    smoke.classList.remove('active');
  }, 3000);
}



function processStream(stream) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const detectBlow = () => {
  analyser.getByteFrequencyData(dataArray);
  const sum = dataArray.reduce((a, b) => a + b, 0);

  console.log("Mic input sum:", sum); // 💬 Vezi în consola browserului

  if (sum > 500) {
    console.log("💨 Blow detected!");
    blowOutFlame();
    audioContext.close();
  } else {
    requestAnimationFrame(detectBlow);
  }
};
  detectBlow();
}


document.getElementById('startButton').addEventListener('click', () => {
  const music = document.getElementById('backgroundMusic');
  
  // 🎶 Try to play the music on user interaction
  music.play().catch((e) => {
    console.warn("Playback prevented:", e);
  });

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(processStream)
    .catch(err => alert("Can't access mic 💔"));
});

