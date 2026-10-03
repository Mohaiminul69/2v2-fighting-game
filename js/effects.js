// Visual-only effects: screen shake, hit sparks, fireflies, ground shadows, vignette.
// None of this affects gameplay.

const GROUND_Y = 482;

// ---------- Screen shake ----------
let shakeFrames = 0;
let shakeStrength = 0;

function shakeScreen(strength, frames) {
  shakeStrength = strength;
  shakeFrames = frames;
}

function applyScreenShake() {
  if (shakeFrames <= 0) return;
  shakeFrames--;
  const strength = shakeStrength * (shakeFrames / 12 + 0.3);
  context.translate(
    (Math.random() * 2 - 1) * strength,
    (Math.random() * 2 - 1) * strength
  );
}

// ---------- Hit sparks ----------
const sparks = [];
const impactRings = [];

function spawnHitEffect(attacker, victim) {
  // Impact point: the victim's edge facing the attacker, at the attack's height
  const fromLeft = attacker.position.x < victim.position.x;
  const x = victim.position.x + (fromLeft ? 10 : victim.width - 10);
  const y = attacker.attackBox.position.y + attacker.attackBox.height / 2;
  const direction = fromLeft ? 1 : -1;

  for (let i = 0; i < 16; i++) {
    const angle = (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 3 + Math.random() * 6;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed * direction,
      vy: Math.sin(angle) * speed - 1.5,
      life: 18 + Math.random() * 10,
      maxLife: 28,
      size: 2 + Math.random() * 3,
      color: ["#ffffff", "#fff3b0", "#ffb347", "#ff6b3d"][i % 4],
    });
  }
  impactRings.push({ x, y, life: 10 });

  const finishing = victim.health <= 0;
  shakeScreen(finishing ? 9 : 5, finishing ? 22 : 10);
}

function drawSparks() {
  context.save();
  context.globalCompositeOperation = "lighter";

  for (let i = impactRings.length - 1; i >= 0; i--) {
    const ring = impactRings[i];
    const progress = 1 - ring.life / 10;
    context.globalAlpha = 1 - progress;
    context.strokeStyle = "#fff6d5";
    context.lineWidth = 4 * (1 - progress) + 1;
    context.beginPath();
    context.arc(ring.x, ring.y, 8 + progress * 34, 0, Math.PI * 2);
    context.stroke();
    if (--ring.life <= 0) impactRings.splice(i, 1);
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i];
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.9;
    spark.vy = spark.vy * 0.9 + 0.35;
    context.globalAlpha = Math.max(0, spark.life / spark.maxLife);
    context.fillStyle = spark.color;
    context.fillRect(spark.x, spark.y, spark.size, spark.size);
    if (--spark.life <= 0) sparks.splice(i, 1);
  }

  context.restore();
}

// ---------- Fireflies ----------
const fireflies = Array.from({ length: 22 }, () => ({
  x: Math.random() * 1024,
  y: 160 + Math.random() * 300,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.25,
  phase: Math.random() * Math.PI * 2,
}));

function drawFireflies() {
  context.save();
  context.globalCompositeOperation = "lighter";
  for (const fly of fireflies) {
    fly.phase += 0.03;
    fly.x += fly.vx + Math.sin(fly.phase * 0.7) * 0.2;
    fly.y += fly.vy + Math.cos(fly.phase * 0.5) * 0.15;
    if (fly.x < -10) fly.x = 1034;
    if (fly.x > 1034) fly.x = -10;
    if (fly.y < 140 || fly.y > 470) fly.vy *= -1;

    const glow = 0.35 + Math.sin(fly.phase * 2) * 0.3;
    if (glow <= 0) continue;
    context.globalAlpha = glow * 0.35;
    context.fillStyle = "#ffe9a8";
    context.beginPath();
    context.arc(fly.x, fly.y, 5, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = glow;
    context.fillRect(fly.x - 1, fly.y - 1, 2, 2);
  }
  context.restore();
}

// ---------- Ground shadows ----------
function drawShadow(fighter) {
  const heightAboveGround = GROUND_Y - (fighter.position.y + fighter.height);
  const shrink = Math.max(0.35, 1 - heightAboveGround / 300);
  context.save();
  context.globalAlpha = 0.4 * shrink;
  context.fillStyle = "#000";
  context.beginPath();
  context.ellipse(
    fighter.position.x + fighter.width / 2,
    GROUND_Y + 2,
    34 * shrink,
    7 * shrink,
    0,
    0,
    Math.PI * 2
  );
  context.fill();
  context.restore();
}

// ---------- Vignette ----------
const vignette = context.createRadialGradient(512, 300, 220, 512, 300, 640);
vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
vignette.addColorStop(1, "rgba(0, 0, 0, 0.6)");

function drawVignette() {
  context.fillStyle = vignette;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// ---------- Banner ("FIGHT!") ----------
function showBanner(text) {
  const banner = document.querySelector("#banner");
  banner.innerText = text;
  banner.classList.remove("show");
  void banner.offsetWidth; // restart the CSS animation
  banner.classList.add("show");
}

// ---------- Fit the game to the window ----------
function fitToWindow() {
  const scale = Math.min(window.innerWidth / 1024, window.innerHeight / 576);
  document.querySelector("#game-screen").style.transform = `scale(${scale})`;
}
window.addEventListener("resize", fitToWindow);
fitToWindow();
