/* ==========================================================
   Birthday Surprise Interactive Scripts
========================================================== */

// --- 1. Canvas Ambient Floating Hearts & Sparkles ---
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class FloatingHeart {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20 + Math.random() * 50;
    this.size = 10 + Math.random() * 16;
    this.speedY = 0.6 + Math.random() * 1.4;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.opacity = 0.2 + Math.random() * 0.6;
    this.color = Math.random() > 0.3 ? '#ff6b8b' : '#ffb703';
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    if (this.y < -20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px serif`;
    ctx.fillText('❤', this.x, this.y);
    ctx.restore();
  }
}

for (let i = 0; i < 28; i++) {
  particles.push(new FloatingHeart());
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// --- 2. Interactive Gift Box Opening ---
function openSurprise() {
  const overlay = document.getElementById('introOverlay');
  const boxLid = document.querySelector('.box-lid');
  
  // Animate Lid opening
  boxLid.style.transform = 'translateY(-40px) rotate(-15deg)';
  
  // Trigger celebration explosion
  fireConfettiBurst();
  
  // Play music
  toggleMusic(true);

  setTimeout(() => {
    overlay.classList.add('hidden');
    // Secondary celebration blast
    setTimeout(fireConfettiBurst, 400);
  }, 700);
}

// Confetti burst helper
function fireConfettiBurst() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff758f', '#ffb703', '#ffffff', '#e84364']
    });
  }
}

// Full-screen Fireworks blast
function triggerFireworks() {
  if (typeof confetti === 'function') {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4d6d', '#f6c90e', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff758f', '#e84364', '#ffd166']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

// --- 3. Interactive Candle Blowing ---
let blownCount = 0;
const totalCandles = 3;

function blowCandle(candleElem) {
  if (!candleElem.classList.contains('blown')) {
    candleElem.classList.add('blown');
    blownCount++;

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.4 },
        colors: ['#ffb703', '#ff4d6d', '#ffffff']
      });
    }

    if (blownCount >= totalCandles) {
      showWishCelebration();
    }
  }
}

function blowAllCandles() {
  document.querySelectorAll('.candle').forEach(c => c.classList.add('blown'));
  blownCount = totalCandles;
  showWishCelebration();
}

function showWishCelebration() {
  const wishMessage = document.getElementById('wishMessage');
  wishMessage.style.display = 'block';
  
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ff4d6d', '#ffb703', '#ffffff', '#ff758f', '#8338ec']
    });
  }
}

// --- 4. Polaroid Lightbox Modal ---
const memories = [
  {
    src: "assets/images/image1.jpeg",
    caption: "Your smile lights up my entire world ✨"
  },
  {
    src: "assets/images/image2.jpeg",
    caption: "Every moment with you is magic 💫"
  },
  {
    src: "assets/images/image3.jpeg",
    caption: "My favorite adventure is you 🗺️"
  },
  {
    src: "assets/images/image4.jpeg",
    caption: "You are the cutest human ever 💕"
  },
  {
    src: "assets/images/image5.jpeg",
    caption: "The sweetest moments we share 🌸"
  },
  {
    src: "assets/images/image6.jpeg",
    caption: "Forever my favorite view 💖"
  },
  {
    src: "assets/images/image7.jpeg",
    caption: "You make my heart skip a beat ✨"
  },
  {
    src: "assets/images/image8.jpeg",
    caption: "To a million more memories 🥂"
  }
];

function openLightbox(index) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');

  // Check if there is a local photo in the card's img tag
  const cardImg = document.getElementById(`img-${index}`);
  img.src = cardImg ? cardImg.src : memories[index].src;
  caption.textContent = memories[index].caption;

  modal.classList.add('active');
}

function closeLightbox(event) {
  if (event.target.id === 'lightboxModal' || event.target.classList.contains('close-lightbox')) {
    document.getElementById('lightboxModal').classList.remove('active');
  }
}

// --- 5. Flip Card ---
function flipCard(cardElem) {
  cardElem.classList.toggle('flipped');
}

// --- 6. Scroll Helper ---
function scrollToSection(sectionId) {
  const sec = document.getElementById(sectionId);
  if (sec) sec.scrollIntoView({ behavior: 'smooth' });
}

// --- 7. Music & Built-in Romantic Melody Synthesizer ---
let isPlaying = false;
let audioCtx = null;
let melodyInterval = null;

const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

musicToggle.addEventListener('click', () => {
  toggleMusic(!isPlaying);
});

function toggleMusic(forcePlay) {
  isPlaying = forcePlay !== undefined ? forcePlay : !isPlaying;

  if (isPlaying) {
    musicToggle.classList.add('playing');
    bgMusic.volume = 0.85;
    
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        stopSynthesizedMelody();
      }).catch((err) => {
        console.log("Audio file play fallback to chime:", err);
        startSynthesizedMelody();
      });
    }
  } else {
    musicToggle.classList.remove('playing');
    bgMusic.pause();
    stopSynthesizedMelody();
  }
}

// Web Audio Soft Music Box Synthesizer (Works completely offline & zero file dependencies)
function startSynthesizedMelody() {
  if (melodyInterval) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Soft music box "Happy Birthday" notes
    const notes = [
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.35 }, { f: 293.66, d: 0.7 }, { f: 261.63, d: 0.7 },
      { f: 349.23, d: 0.7 },  { f: 329.63, d: 1.2 },  { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.35 },
      { f: 293.66, d: 0.7 },  { f: 261.63, d: 0.7 },  { f: 392.00, d: 0.7 },  { f: 349.23, d: 1.2 }
    ];

    let noteIdx = 0;
    melodyInterval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(melodyInterval);
        melodyInterval = null;
        return;
      }
      const note = notes[noteIdx];
      playChime(note.f, note.d);
      noteIdx = (noteIdx + 1) % notes.length;
    }, 750);
  } catch (e) {
    console.log("Web Audio not supported or blocked");
  }
}

function playChime(freq, duration) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function stopSynthesizedMelody() {
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
}
