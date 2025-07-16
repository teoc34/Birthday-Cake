const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
const greeting = document.getElementById('greeting');

if (name) {
  greeting.textContent = `Happy Birthday, ${name}! 🎉`;
}

document.getElementById('muteButton').addEventListener('click', () => {
  const music = document.getElementById('backgroundMusic');
  music.muted = !music.muted;
});

function blowOutFlame() {
  const flame = document.getElementById('flame');
  const smoke = document.getElementById('smoke');

  console.log("🔥 blowOutFlame triggered");

  flame.style.animation = 'none';
  flame.style.transition = 'transform 0.5s, opacity 0.5s';
  flame.style.transform = 'translateY(-20px)';
  flame.style.opacity = '0';

  smoke.classList.add('active');

  setTimeout(() => {
    flame.style.transition = 'none';
    flame.style.transform = 'translateY(0)';
    flame.style.opacity = '1';
    flame.style.animation = 'flicker 0.15s infinite';
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

  let lastSum = 0;
  let blowCooldown = false;

  const detectBlow = () => {
    analyser.getByteFrequencyData(dataArray);
    const sum = dataArray.reduce((a, b) => a + b, 0);

    console.log("Mic input sum:", sum);

    const delta = sum - lastSum;
    lastSum = sum;

    if (delta > 3000 && sum > 9000 && !blowCooldown) {
      console.log("💨 Blow detected!");
      blowOutFlame();

      blowCooldown = true;
      audioContext.close();
    } else {
      requestAnimationFrame(detectBlow);
    }
  };

  detectBlow(); 
}

document.getElementById('startButton').addEventListener('click', () => {
  const music = document.getElementById('backgroundMusic');

  music.play().catch((e) => {
    console.warn("Playback prevented:", e);
  });

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(processStream)
    .catch(err => alert("Can't access mic"));
});
