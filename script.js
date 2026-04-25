const PASSWORD = "02.12.25";
const STORAGE_KEY = "love-site-authenticated";
const STORY_KEY = "love-site-story-finished";
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBLahq16OjPRjOCaA8_JsxwWOW69PpTBuM",
  authDomain: "azra-site-log.firebaseapp.com",
  projectId: "azra-site-log",
  storageBucket: "azra-site-log.firebasestorage.app",
  messagingSenderId: "511175935045",
  appId: "1:511175935045:web:3d5ea74c71d6a061e40f2c",
  measurementId: "G-QZKKN6YLC9"
};

const retryLines = [
  "Selam aşkım naber?\n5. Ay'ımıza Girdiğimiz İçin Çok Mutluyum\nBana 5 Ay Boyunca Katlandığın İçin Bu site Ödülün<3",
  "Tamam, hadi biraz heyecanlan...\nMutlu olduğunu görmek bu dünyadaki en güzel şey\nÇünkü ben seninle gulumseyebiliyorum.",
  "Seni çook seviyoruumm.\nBu oyunda da gerçekte de favorim sensin.",
  "5.Ayımız Kutlu OLsun\nUmarım bu 5 ay değilde 5 yıl olur\nHadi ilerle bebisss"
];

const loveMeterLines = [
  "%100 - Bugün de yarın da sonsuz aşk modundayız.",
  "%99 - Bir sarılmayla tüm dunya güzelleşir seviyesi.",
  "%97 - Kalbim yine direkt sana koşuyor.",
  "%101 - Sistem seni görunce biraz şaşırdı ama haklı."
];

const sweetNotes = [
  "Seninle geçen kısa bir an bile tüm günüme yetiyor.",
  "Beni en güzel halime yaklaştıran şey senin sevgin.",
  "Birlikte yaşlanma fikri bile içimi huzurla dolduruyor.",
  "Gülüşün, günümün en sevdigim bildirimi gibi.",
  "Ne olursa olsun kalbimin yönü hep sana donuyor."
];

const puzzleImage = "assets/puzzle-photo-small.jpg";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const logoutButton = document.getElementById("logoutButton");

const startScene = document.getElementById("startScene");
const dialogScene = document.getElementById("dialogScene");
const openLetterButton = document.getElementById("openLetterButton");
const dialogText = document.getElementById("dialogText");
const delayButton = document.getElementById("delayButton");
const acceptButton = document.getElementById("acceptButton");
const finalPopup = document.getElementById("finalPopup");
const restartButton = document.getElementById("restartButton");
const continueButton = document.getElementById("continueButton");
const musicToggleButton = document.getElementById("musicToggleButton");
const siteMusic = document.getElementById("siteMusic");

const loveMeterButton = document.getElementById("loveMeterButton");
const loveMeterResult = document.getElementById("loveMeterResult");
const noteButton = document.getElementById("noteButton");
const noteResult = document.getElementById("noteResult");
const diceButton = document.getElementById("diceButton");
const diceDisplay = document.getElementById("diceDisplay");
const diceResult = document.getElementById("diceResult");
const puzzleBoard = document.getElementById("puzzleBoard");
const shufflePuzzleButton = document.getElementById("shufflePuzzleButton");
const puzzleStatus = document.getElementById("puzzleStatus");
const yesLoveButton = document.getElementById("yesLoveButton");
const noLoveButton = document.getElementById("noLoveButton");
const loveButtonsArea = document.getElementById("loveButtonsArea");
const loveQuestionResult = document.getElementById("loveQuestionResult");
const puzzleCelebrate = document.getElementById("puzzleCelebrate");
const closeCelebrateButton = document.getElementById("closeCelebrateButton");
const loveCodeRain = document.getElementById("loveCodeRain");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePasswordButton");
const neonHeartStage = document.getElementById("neonHeartStage");
const neonHeartCanvas = document.getElementById("neonHeartCanvas");
const flowerFrame = document.getElementById("flowerFrame");

let retryIndex = 0;
let selectedTile = null;
let puzzleCelebrated = false;
let puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let puzzleTiles = [];
let neonHeartAnimationId = 0;
let neonHeartParticles = [];
let neonHeartTargets = [];
let neonTextTargets = [];
let neonAmbientParticles = [];
let neonHeartContext = null;
let neonHeartTargetProgress = 0;
let neonHeartProgress = 0;
let neonHeartPressed = false;
let diceRolling = false;
let diceTimers = [];
let loveCodeBuilt = false;
let loveCodeTimers = [];
let lastNoButtonMove = 0;
let firebaseLoggerPromise = null;

function isSmallScreen() {
  return window.innerWidth <= 760;
}

function redirectToHome() {
  window.location.href = "home.html";
}

function redirectToMemories() {
  window.location.href = "memories.html";
}

function redirectToLogin() {
  window.location.href = "index.html";
}

function getFirebaseLogger() {
  if (!firebaseLoggerPromise) {
    firebaseLoggerPromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore-lite.js")
    ]).then(([appModule, firestoreModule]) => {
      const app = appModule.initializeApp(FIREBASE_CONFIG);
      const db = firestoreModule.getFirestore(app);

      return { db, firestoreModule };
    });
  }

  return firebaseLoggerPromise;
}

function buildVisitPayload(eventName) {
  return {
    event: eventName,
    page: document.body.dataset.page || "unknown",
    enteredAt: new Date().toISOString(),
    userAgent: navigator.userAgent || "",
    language: navigator.language || "",
    domain: window.location.hostname || "",
    path: window.location.pathname || "",
    screen: window.screen ? `${window.screen.width}x${window.screen.height}` : ""
  };
}

async function logVisit(eventName) {
  try {
    const { db, firestoreModule } = await getFirebaseLogger();
    await firestoreModule.addDoc(
      firestoreModule.collection(db, "visits"),
      buildVisitPayload(eventName)
    );
  } catch (error) {
    console.warn("Log kaydi atilamadi:", error);
  }
}

function typeText(element, text, speed = 32) {
  element.textContent = "";
  let index = 0;

  const timer = window.setInterval(() => {
    element.textContent += text[index];
    index += 1;

    if (index >= text.length) {
      window.clearInterval(timer);
    }
  }, speed);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function updatePasswordToggleLabel() {
  if (!passwordInput || !togglePasswordButton) {
    return;
  }

  togglePasswordButton.textContent = passwordInput.type === "password" ? "Goster" : "Gizle";
}

function buildLoveCodeRain() {
  if (!loveCodeRain) {
    return;
  }

  loveCodeRain.innerHTML = "";
  loveCodeTimers.forEach((timer) => window.clearTimeout(timer));
  loveCodeTimers = [];

  const totalLines = 100;
  const text = "seni seviyorum";
  const charDelay = 52;
  const linePause = 120;

  function typeNextLine(lineNumber) {
    if (!loveCodeRain || lineNumber > totalLines) {
      return;
    }

    const line = document.createElement("div");
    line.className = "code-line";

    const content = document.createElement("span");
    const caret = document.createElement("span");
    caret.className = "code-caret";
    caret.textContent = "_";

    line.append(content, caret);
    loveCodeRain.appendChild(line);
    loveCodeRain.scrollTop = loveCodeRain.scrollHeight;

    content.textContent = text[0];
    let charIndex = 1;
    const typeTimer = window.setInterval(() => {
      content.textContent += text[charIndex];
      charIndex += 1;
      loveCodeRain.scrollTop = loveCodeRain.scrollHeight;

      if (charIndex >= text.length) {
        window.clearInterval(typeTimer);
        caret.remove();

        const nextTimer = window.setTimeout(() => {
          typeNextLine(lineNumber + 1);
        }, linePause);

        loveCodeTimers.push(nextTimer);
      }
    }, charDelay);

    loveCodeTimers.push(typeTimer);
  }

  typeNextLine(1);

  loveCodeBuilt = true;
}

function setDiceFace(face) {
  if (!diceDisplay) {
    return;
  }

  diceDisplay.dataset.face = String(face);
  diceDisplay.classList.remove("show-1", "show-2", "show-3", "show-4", "show-5", "show-6", "show-7");
  diceDisplay.classList.add("show-" + String(face));
}

function rollLuckyDice() {
  if (!diceButton || !diceDisplay || !diceResult || diceRolling) {
    return;
  }

  diceTimers.forEach((timer) => window.clearTimeout(timer));
  diceTimers = [];
  diceRolling = true;
  diceButton.disabled = true;
  diceResult.textContent = "Zar donuyor...";
  diceDisplay.classList.remove("rolling");
  setDiceFace(1);
  void diceDisplay.offsetWidth;
  diceDisplay.classList.add("rolling");

  diceTimers.push(window.setTimeout(() => setDiceFace(2), 160));
  diceTimers.push(window.setTimeout(() => setDiceFace(5), 360));
  diceTimers.push(window.setTimeout(() => setDiceFace(6), 620));
  diceTimers.push(window.setTimeout(() => setDiceFace(7), 1120));
  diceTimers.push(window.setTimeout(() => {
    diceDisplay.classList.remove("rolling");
    diceResult.textContent = "Ben istersem zarlar bile 7 gelir.";
    diceRolling = false;
    diceButton.disabled = false;
  }, 1350));
}

function createNeonHeartPoint(t) {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return { x, y };
}

function resizeNeonHeartCanvas() {
  if (!neonHeartCanvas || !neonHeartStage) {
    return;
  }

  const rect = neonHeartStage.getBoundingClientRect();
  const width = Math.max(Math.round(rect.width || neonHeartStage.clientWidth), 260);
  const height = Math.max(Math.round(rect.height || neonHeartStage.clientHeight), 260);
  neonHeartCanvas.width = width;
  neonHeartCanvas.height = height;
}

function buildNeonHeartTargets() {
  if (!neonHeartCanvas) {
    return;
  }

  const width = neonHeartCanvas.width;
  const height = neonHeartCanvas.height;
  const count = width <= 560 ? 70 : 150;
  const scale = Math.min(width / 42, height / 38);
  const centerX = width / 2;
  const centerY = height / 2 - scale * 0.3;

  neonHeartTargets = [];

  for (let i = 0; i < count; i += 1) {
    const t = (Math.PI * 2 * i) / count;
    const point = createNeonHeartPoint(t);
    neonHeartTargets.push({
      x: centerX + point.x * scale,
      y: centerY - point.y * scale
    });
  }
}

function buildNeonTextTargets() {
  if (!neonHeartCanvas) {
    return;
  }

  const width = neonHeartCanvas.width;
  const height = neonHeartCanvas.height;
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d");

  if (!ctx) {
    neonTextTargets = [];
    return;
  }

  const letters = ["A", "Z", "R", "A"];
  const fontSize = Math.min(width * 0.16, height * 0.2);
  const startX = width * 0.18;
  const endX = width * 0.82;
  const baselineY = height * 0.46;
  const depthX = fontSize * 0.03;
  const depthY = fontSize * 0.04;
  const lineWidth = Math.max(2, Math.round(fontSize * 0.038));
  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 italic " + fontSize + "px Arial";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  letters.forEach((letter, index) => {
    const progress = letters.length === 1 ? 0.5 : index / (letters.length - 1);
    const x = startX + (endX - startX) * progress;

    ctx.strokeStyle = "rgba(255, 120, 201, 0.6)";
    ctx.lineWidth = lineWidth + 1;
    ctx.strokeText(letter, x + depthX, baselineY + depthY);

    ctx.strokeStyle = "rgba(255, 240, 247, 1)";
    ctx.lineWidth = lineWidth;
    ctx.strokeText(letter, x, baselineY);
  });

  const imageData = ctx.getImageData(0, 0, width, height).data;
  const step = width <= 560 ? 5 : 4;
  const points = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = imageData[(y * width + x) * 4 + 3];

      if (alpha > 120) {
        points.push({
          x,
          y,
          tint: alpha > 220 ? "front" : "shadow"
        });
      }
    }
  }

  neonTextTargets = points;
}

function buildNeonAmbientParticles() {
  if (!neonHeartCanvas) {
    return;
  }

  const count = neonHeartCanvas.width <= 560 ? 24 : 70;
  neonAmbientParticles = Array.from({ length: count }, () => ({
    x: Math.random() * neonHeartCanvas.width,
    y: Math.random() * neonHeartCanvas.height,
    size: 1.2 + Math.random() * 2.2,
    alpha: 0.18 + Math.random() * 0.25,
    drift: Math.random() * Math.PI * 2,
    speedX: 0.15 + Math.random() * 0.3,
    speedY: 0.12 + Math.random() * 0.26,
    hue: Math.random() > 0.5 ? "88, 255, 240" : "132, 174, 255"
  }));
}

function buildNeonParticles() {
  if (!neonHeartCanvas) {
    return;
  }

  const maxParticles = isSmallScreen() ? 220 : 520;
  const count = Math.min(Math.max(neonHeartTargets.length, neonTextTargets.length), maxParticles);

  neonHeartParticles = Array.from({ length: count }, (_item, index) => {
    const heartTarget = neonHeartTargets[index % neonHeartTargets.length];
    const textTarget = neonTextTargets[index % neonTextTargets.length];

    return {
      x: textTarget.x,
      y: textTarget.y,
      heartX: heartTarget.x,
      heartY: heartTarget.y,
      textX: textTarget.x,
      textY: textTarget.y,
      size: 1.3 + Math.random() * 1.7,
      alpha: 0.42 + Math.random() * 0.48,
      pulse: Math.random() * Math.PI * 2,
      index,
      orderProgress: index / Math.max(count - 1, 1),
      tint: textTarget.tint
    };
  });
}

function drawAmbientParticle(particle, time) {
  if (!neonHeartContext || !neonHeartCanvas) {
    return;
  }

  particle.x += Math.cos(time * 0.0007 + particle.drift) * particle.speedX;
  particle.y += Math.sin(time * 0.0009 + particle.drift) * particle.speedY;

  if (particle.x < -12) {
    particle.x = neonHeartCanvas.width + 12;
  }
  if (particle.x > neonHeartCanvas.width + 12) {
    particle.x = -12;
  }
  if (particle.y < -12) {
    particle.y = neonHeartCanvas.height + 12;
  }
  if (particle.y > neonHeartCanvas.height + 12) {
    particle.y = -12;
  }

  const shimmer = 0.7 + Math.sin(time * 0.002 + particle.drift) * 0.2;
  const glow = neonHeartContext.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    particle.size * 6
  );

  glow.addColorStop(0, "rgba(" + particle.hue + "," + (particle.alpha * 1.4) + ")");
  glow.addColorStop(1, "rgba(" + particle.hue + ",0)");

  neonHeartContext.fillStyle = glow;
  neonHeartContext.beginPath();
  neonHeartContext.arc(particle.x, particle.y, particle.size * 6 * shimmer, 0, Math.PI * 2);
  neonHeartContext.fill();
}

function drawNeonParticle(particle, time, strength) {
  if (!neonHeartContext) {
    return;
  }

  const shimmer = 0.75 + Math.sin(time * 0.003 + particle.pulse) * 0.25;
  const radiusBoost = neonHeartProgress < 0.08 ? 1.15 : 1;
  const radius = particle.size * shimmer * (0.68 + strength * 0.72) * radiusBoost;
  const glow = neonHeartContext.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    radius * 5
  );

  const coreColor = particle.tint === "shadow" ? "255, 193, 230" : "255, 243, 248";
  const midColor = particle.tint === "shadow" ? "255, 109, 194" : "255, 168, 219";
  const dotColor = particle.tint === "shadow" ? "255, 176, 223" : "255, 212, 234";

  glow.addColorStop(0, "rgba(" + coreColor + "," + (0.72 + strength * 0.18) + ")");
  glow.addColorStop(0.3, "rgba(" + midColor + "," + (0.38 + strength * 0.26) + ")");
  glow.addColorStop(1, "rgba(255, 92, 176, 0)");

  neonHeartContext.fillStyle = glow;
  neonHeartContext.beginPath();
  neonHeartContext.arc(particle.x, particle.y, radius * 5, 0, Math.PI * 2);
  neonHeartContext.fill();

  neonHeartContext.fillStyle = "rgba(" + dotColor + "," + (particle.alpha * shimmer * (0.62 + strength * 0.3)) + ")";
  neonHeartContext.beginPath();
  neonHeartContext.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
  neonHeartContext.fill();
}

function animateNeonHeart(time) {
  if (!neonHeartCanvas || !neonHeartContext) {
    return;
  }

  neonHeartContext.clearRect(0, 0, neonHeartCanvas.width, neonHeartCanvas.height);
  const progressSpeed = neonHeartPressed ? 0.018 : 0.012;
  neonHeartProgress += (neonHeartTargetProgress - neonHeartProgress) * progressSpeed;
  const easedProgress =
    neonHeartProgress < 0.5
      ? 4 * neonHeartProgress * neonHeartProgress * neonHeartProgress
      : 1 - Math.pow(-2 * neonHeartProgress + 2, 3) / 2;

  for (const ambientParticle of neonAmbientParticles) {
    drawAmbientParticle(ambientParticle, time);
  }

  for (const particle of neonHeartParticles) {
    const lineWindow = 0.5;
    const sweepProgress = easedProgress * (1 + lineWindow);
    const localProgress = (sweepProgress - particle.orderProgress) / lineWindow;
    const clampedProgress = Math.max(0, Math.min(localProgress, 1));
    const particleProgress = clampedProgress * clampedProgress * (3 - 2 * clampedProgress);
    particle.x = particle.textX + (particle.heartX - particle.textX) * particleProgress;
    particle.y = particle.textY + (particle.heartY - particle.textY) * particleProgress;

    drawNeonParticle(particle, time, particleProgress);
  }

  neonHeartAnimationId = window.requestAnimationFrame(animateNeonHeart);

  if (!neonHeartPressed && Math.abs(neonHeartProgress - neonHeartTargetProgress) < 0.01) {
    window.cancelAnimationFrame(neonHeartAnimationId);
    neonHeartAnimationId = 0;
  }
}

function rebuildNeonHeartScene() {
  if (!neonHeartCanvas) {
    return;
  }

  resizeNeonHeartCanvas();
  buildNeonHeartTargets();
  buildNeonTextTargets();
  buildNeonAmbientParticles();
  buildNeonParticles();
}

function startNeonHeartAnimation() {
  if (!neonHeartCanvas || !neonHeartStage) {
    return;
  }

  neonHeartContext = neonHeartCanvas.getContext("2d");
  neonHeartTargetProgress = 0;
  neonHeartProgress = 0;
  rebuildNeonHeartScene();

  if (neonHeartAnimationId) {
    window.cancelAnimationFrame(neonHeartAnimationId);
  }

  neonHeartAnimationId = window.requestAnimationFrame(animateNeonHeart);
}

function resumeNeonHeartAnimation() {
  if (!neonHeartAnimationId && neonHeartContext) {
    neonHeartAnimationId = window.requestAnimationFrame(animateNeonHeart);
  }
}

function triggerNeonHeart() {
  if (!neonHeartParticles.length || neonHeartCanvas.width < 10) {
    rebuildNeonHeartScene();
  }

  neonHeartPressed = true;
  neonHeartTargetProgress = 1;
  resumeNeonHeartAnimation();
}

function releaseNeonHeart() {
  neonHeartPressed = false;
  neonHeartTargetProgress = 0;
  resumeNeonHeartAnimation();
}

function setupMobilePerformanceGuards() {
  if (flowerFrame && !flowerFrame.getAttribute("src")) {
    flowerFrame.setAttribute("src", flowerFrame.dataset.src || "flower-source.html");
  }
}

function renderPuzzle() {
  if (!puzzleBoard) {
    return;
  }

  puzzleOrder.forEach((pieceIndex, position) => {
    const tile = puzzleTiles[position];

    if (!tile) {
      return;
    }

    const x = pieceIndex % 3;
    const y = Math.floor(pieceIndex / 3);
    tile.dataset.piece = String(pieceIndex);
    tile.style.backgroundPosition = (-x * 100) + "% " + (-y * 100) + "%";
    tile.classList.toggle("selected", selectedTile === position);
  });
}

function handlePuzzleTileClick(position) {
  if (selectedTile === null) {
    selectedTile = position;
    puzzleStatus.textContent = "Bir parca sectin. Simdi degistirmek istedigin diger parcaya tikla.";
    renderPuzzle();
    return;
  }

  if (selectedTile === position) {
    selectedTile = null;
    puzzleStatus.textContent = "Secim iptal edildi.";
    renderPuzzle();
    return;
  }

  const firstPiece = puzzleOrder[selectedTile];
  puzzleOrder[selectedTile] = puzzleOrder[position];
  puzzleOrder[position] = firstPiece;
  selectedTile = null;
  renderPuzzle();
  checkPuzzleSolved();
}

function setupPuzzleBoard() {
  if (!puzzleBoard || puzzleTiles.length) {
    return;
  }

  puzzleBoard.innerHTML = "";

  for (let position = 0; position < puzzleOrder.length; position += 1) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "puzzle-tile";
    tile.dataset.position = String(position);
    tile.setAttribute("aria-label", "Puzzle parcasi " + (position + 1));
    tile.style.backgroundImage = "url('" + puzzleImage + "')";
    tile.style.backgroundSize = "300% 300%";
    tile.addEventListener("click", () => handlePuzzleTileClick(position));
    puzzleTiles.push(tile);
    puzzleBoard.appendChild(tile);
  }
}

function shufflePuzzle() {
  for (let i = puzzleOrder.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = puzzleOrder[i];
    puzzleOrder[i] = puzzleOrder[j];
    puzzleOrder[j] = temp;
  }
}

function checkPuzzleSolved() {
  const solved = puzzleOrder.every((piece, index) => piece === index);

    if (solved) {
      puzzleStatus.textContent = "Puzzle tamamlandi. Biz yine cok tatliyiz.";
      if (!puzzleCelebrated && puzzleCelebrate) {
        puzzleCelebrated = true;
        loveCodeBuilt = false;
        if (loveCodeRain) {
          loveCodeRain.innerHTML = "";
        }
        puzzleCelebrate.classList.remove("hidden");
        window.setTimeout(buildLoveCodeRain, 40);
      }
      return;
    }

  puzzleStatus.textContent = "Guzel gidiyor. Biraz daha kaldi.";
}

function moveNoButton() {
  if (!loveButtonsArea || !noLoveButton) {
    return;
  }

  const now = Date.now();
  if (now - lastNoButtonMove < 260) {
    return;
  }
  lastNoButtonMove = now;

  const areaWidth = Math.max(loveButtonsArea.clientWidth - noLoveButton.offsetWidth, 0);
  const areaHeight = Math.max(loveButtonsArea.clientHeight - noLoveButton.offsetHeight, 0);
  const maxX = isSmallScreen() ? Math.min(areaWidth, 170) : areaWidth;
  const maxY = isSmallScreen() ? Math.min(areaHeight, 105) : areaHeight;
  const nextX = Math.floor(Math.random() * (maxX + 1));
  const nextY = Math.floor(Math.random() * (maxY + 1));

  noLoveButton.style.transform = "translate(" + nextX + "px, " + nextY + "px)";

  if (loveQuestionResult) {
    loveQuestionResult.textContent = "Hayır butonu biraz utangaç, kaçıyor.";
  }
}

function updateMusicButton(isPlaying) {
  if (!musicToggleButton) {
    return;
  }

  musicToggleButton.textContent = isPlaying ? "Muzigi Durdur" : "Muzigi Cal";
}

async function tryPlayMusic() {
  if (!siteMusic) {
    return;
  }

  try {
    siteMusic.volume = 0.55;
    await siteMusic.play();
    updateMusicButton(true);
  } catch (_error) {
    updateMusicButton(false);
  }
}

if (musicToggleButton && siteMusic) {
  musicToggleButton.addEventListener("click", async () => {
    if (siteMusic.paused) {
      await tryPlayMusic();
      return;
    }

    siteMusic.pause();
    updateMusicButton(false);
  });
}

if (siteMusic) {
  ["click", "keydown", "touchstart"].forEach((eventName) => {
    document.addEventListener(
      eventName,
      () => {
        if (siteMusic.paused) {
          tryPlayMusic();
        }
      },
      { once: true }
    );
  });

  updateMusicButton(!siteMusic.paused);
}

if (loginForm) {
  updatePasswordToggleLabel();

  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener("click", () => {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
      updatePasswordToggleLabel();
    });
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const password = String(formData.get("password") || "").trim();

    if (password === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      localStorage.removeItem(STORY_KEY);
      message.textContent = "Sifre dogru. giris yapiliyor...";
      message.className = "feedback success";
      logVisit("password_success");
      window.setTimeout(redirectToHome, 600);
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    message.textContent = "Sifre hatali. Bir daha dene.";
    message.className = "feedback error";
  });
}

if (document.body.dataset.page === "home") {
  if (localStorage.getItem(STORAGE_KEY) !== "true") {
    redirectToLogin();
  }

  openLetterButton.addEventListener("click", () => {
    startScene.classList.add("hidden");
    dialogScene.classList.remove("hidden");
    retryIndex = 0;
    typeText(dialogText, retryLines[retryIndex]);
  });

  delayButton.addEventListener("click", () => {
    retryIndex = Math.min(retryIndex + 1, retryLines.length - 1);
    typeText(dialogText, retryLines[retryIndex], 26);

    if (retryIndex === retryLines.length - 1) {
      delayButton.textContent = "[Uzatma siteye geç]";
    }
  });

  acceptButton.addEventListener("click", () => {
    finalPopup.classList.remove("hidden");
  });

  continueButton.addEventListener("click", () => {
    localStorage.setItem(STORY_KEY, "true");
    redirectToMemories();
  });

  restartButton.addEventListener("click", () => {
    finalPopup.classList.add("hidden");
    dialogScene.classList.add("hidden");
    startScene.classList.remove("hidden");
    retryIndex = 0;
    delayButton.textContent = "[Hayır biraz daha sürsün]";
  });

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORY_KEY);
    redirectToLogin();
  });
}

if (document.body.dataset.page === "memories") {
  if (localStorage.getItem(STORAGE_KEY) !== "true") {
    redirectToLogin();
  }

  if (localStorage.getItem(STORY_KEY) !== "true") {
    redirectToHome();
  }

  if (sessionStorage.getItem("memories-log-sent") !== "true") {
    sessionStorage.setItem("memories-log-sent", "true");
    logVisit("memories_opened");
  }

  if (loveMeterButton) {
    loveMeterButton.addEventListener("click", () => {
      loveMeterResult.textContent = randomItem(loveMeterLines);
    });
  }

  if (noteButton) {
    noteButton.addEventListener("click", () => {
      noteResult.textContent = randomItem(sweetNotes);
    });
  }

  if (diceButton) {
    diceButton.addEventListener("click", rollLuckyDice);
  }

  if (yesLoveButton) {
    yesLoveButton.addEventListener("click", () => {
      loveQuestionResult.textContent = "Biliyordum.";
    });
  }

  if (noLoveButton) {
    if (isSmallScreen()) {
      noLoveButton.addEventListener("click", (event) => {
        event.preventDefault();
        moveNoButton();
      });
    } else {
      noLoveButton.addEventListener("mouseenter", moveNoButton);
      noLoveButton.addEventListener("pointerdown", moveNoButton);
    }
  }

  if (shufflePuzzleButton) {
    shufflePuzzleButton.addEventListener("click", () => {
      selectedTile = null;
      puzzleCelebrated = false;
      if (puzzleCelebrate) {
        puzzleCelebrate.classList.add("hidden");
      }
      shufflePuzzle();
      renderPuzzle();
      puzzleStatus.textContent = "Puzzle karistirildi. Haydi tamamlayalim.";
    });
  }

  if (closeCelebrateButton) {
    closeCelebrateButton.addEventListener("click", () => {
      puzzleCelebrate.classList.add("hidden");
    });
  }

  if (neonHeartStage) {
    neonHeartStage.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      triggerNeonHeart();
    });
    neonHeartStage.addEventListener("pointerup", releaseNeonHeart);
    neonHeartStage.addEventListener("pointercancel", releaseNeonHeart);

    neonHeartStage.addEventListener("mousedown", (event) => {
      event.preventDefault();
      triggerNeonHeart();
    });
    neonHeartStage.addEventListener("mouseup", releaseNeonHeart);
    neonHeartStage.addEventListener("touchstart", (event) => {
      event.preventDefault();
      triggerNeonHeart();
    }, { passive: false });
    neonHeartStage.addEventListener("touchend", () => {
      releaseNeonHeart();
    });
    neonHeartStage.addEventListener("touchcancel", releaseNeonHeart);
    neonHeartStage.addEventListener("click", () => {
      triggerNeonHeart();
      window.setTimeout(releaseNeonHeart, 1800);
    });

    rebuildNeonHeartScene();
    if (neonHeartCanvas && neonHeartCanvas.getContext) {
      neonHeartContext = neonHeartCanvas.getContext("2d");
      neonHeartAnimationId = window.requestAnimationFrame(animateNeonHeart);
    }
    window.setTimeout(rebuildNeonHeartScene, 250);
    window.addEventListener("resize", rebuildNeonHeartScene);
  }

  setupMobilePerformanceGuards();
  setupPuzzleBoard();
  shufflePuzzle();
  renderPuzzle();
  checkPuzzleSolved();
}
