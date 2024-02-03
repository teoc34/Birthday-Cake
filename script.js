// This function is called when a blow is detected
function blowOutFlame() {
    const flame = document.querySelector('.flame');
    flame.style.transition = 'transform 0.5s, opacity 0.5s';
    flame.style.transform = 'translateX(-50%) translate(50px, -10px)';
    flame.style.opacity = '0';
  
    // Reset the flame after the animation completes
    setTimeout(() => {
      flame.style.transition = 'none';
      flame.style.transform = 'translateX(-50%)';
      flame.style.opacity = '1';
    }, 1000);
  }
  
  function processStream(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 512;
  
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    const checkBlow = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = dataArray.reduce((a, b) => a + b, 0);
  
      if (sum > 10000) { // Threshold value, may need to adjust
        blowOutFlame(); // Animate the flame being blown out
        audioContext.close(); // Stop processing audio
      } else {
        requestAnimationFrame(checkBlow);
      }
    };
    
    checkBlow();
  }
  
  document.getElementById('startButton').addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(processStream)
      .catch(err => console.error('Unable to access the microphone.', err));
  });

  const express = require('express');
  const app = express();
  
  app.use(express.static('public')); // 'public' is the directory where your files are located
  
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
  
  function toggleMusic() {
    var music = document.getElementById("backgroundMusic");
    if (music.paused) {
      music.play();
    } else {
      music.pause();
    }
  }
  function toggleMute() {
    var music = document.getElementById('backgroundMusic');
    music.muted = !music.muted;
  }
  
  