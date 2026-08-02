const canvas  = document.getElementById("fxCanvas");
const context = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  const rect  = machine.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width  = Math.floor(rect.width  * ratio);
  canvas.height = Math.floor(rect.height * ratio);

  canvas.style.width  = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function sparkBurst(count) {
  const rect    = machine.getBoundingClientRect();
  const centerX = rect.width  * 0.53;
  const centerY = rect.height * 0.32;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.3 + Math.random() * 4.4;
    particles.push({
      x: centerX, y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 35 + Math.random() * 35,
      size: 1 + Math.random() * 2.8,
      yellow: Math.random() > 0.35
    });
  }
}

function drawLightning() {
  if (!lamp.classList.contains("on")) return;
  if (Math.random() > 0.08) return;

  const width  = machine.clientWidth;
  const height = machine.clientHeight;

  let x = width * (0.2 + Math.random() * 0.6);
  let y = 45;

  context.save();
  context.strokeStyle = Math.random() > 0.4 ? "#fff200" : "#ffffff";
  context.lineWidth   = 1.2 + Math.random() * 1.5;
  context.shadowColor = "#fff200";
  context.shadowBlur  = 12;
  context.beginPath();
  context.moveTo(x, y);

  while (y < height * 0.52) {
    x += -11 + Math.random() * 22;
    y += 11  + Math.random() * 15;
    context.lineTo(x, y);
  }

  context.stroke();
  context.restore();
}

function animateParticles() {
  context.clearRect(0, 0, machine.clientWidth, machine.clientHeight);
  drawLightning();

  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.x  += p.vx;
    p.y  += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.vy += 0.025;
    p.life -= 1;

    const opacity = Math.max(0, p.life / 50);

    context.save();
    context.globalAlpha = opacity;
    context.fillStyle   = p.yellow ? "#fff200" : "#ffffff";
    context.shadowColor = "#ff9d00";
    context.shadowBlur  = 9;
    context.beginPath();
    context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });

  // リールアニメーションを毎フレーム更新
  tickAllReels();

  requestAnimationFrame(animateParticles);
}
