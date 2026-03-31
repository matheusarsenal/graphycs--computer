const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const cx = W / 2;
const cy = H / 2;
const trackRx = 360;
const trackRy = 210;
let speed = 0.012;
let lapAngle = 0;
let paused = false;
const carImage = new Image();
const trackImage = new Image();
let loadedCount = 0;

function assetLoaded() {
  loadedCount += 1;
  if (loadedCount === 2) {
    requestAnimationFrame(update);
  }
}

carImage.onload = assetLoaded;
trackImage.onload = assetLoaded;
carImage.src = '../pngimg.com - formula_1_PNG32.png';
trackImage.src = '../pista oval - foto satelite.png';

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') speed = Math.min(speed + 0.004, 0.08);
  if (e.key === 'ArrowDown') speed = Math.max(speed - 0.004, 0.002);
  if (e.key === ' ') paused = !paused;
});

function resetScene() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
}

function drawTrack() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#2f8c36';
  ctx.fillRect(0, 0, W, H);

  const marginX = 36;
  const marginY = 28;
  ctx.drawImage(trackImage, marginX, marginY, W - marginX * 2, H - marginY * 2);
  ctx.restore();
}

function drawPitSign() {
  const px = cx - 240;
  const py = cy + 100;
  const armAngle = Math.sin(performance.now() / 600) * 0.35;
  const scale = 0.8 + Math.sin(performance.now() / 800) * 0.1; // Escala dinâmica

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  // Padrão T → Op → T: translada para o centro, aplica escala, translada de volta
  ctx.translate(px, py);
  ctx.scale(scale, scale);
  ctx.translate(-px, -py);
  
  ctx.fillStyle = '#2c2c2c';
  ctx.fillRect(px - 120, py - 14, 240, 28);
  ctx.fillStyle = '#eee';
  ctx.fillRect(px - 120, py - 14, 90, 28);
  ctx.fillStyle = '#c62828';
  ctx.fillRect(px - 30, py - 14, 34, 28);
  ctx.fillRect(px + 14, py - 14, 34, 28);

  ctx.translate(px + 80, py);
  ctx.rotate(armAngle);
  ctx.translate(-(px + 80), -py);
  ctx.fillStyle = '#ffeb3b';
  ctx.fillRect(px + 60, py - 10, 40, 20);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('PIT', px + 66, py + 5);
  ctx.restore();
}

function drawCar(x, y, direction) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(direction);
  const width = 60;
  const height = 26;
  ctx.drawImage(carImage, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawHUD() {
  ctx.save();
  ctx.fillStyle = '#f5f5f5';
  ctx.font = '14px Arial';
  ctx.fillText('↑/↓ acelera/freia · SPACE pausa', 20, 28);
  ctx.fillText(`velocidade: ${(speed * 100).toFixed(1)}`, 20, 50);
  ctx.restore();
}

function pathPoint(angle) {
  const x = Math.cos(angle) * trackRx;
  const y = Math.sin(angle) * trackRy;
  const direction = Math.atan2(trackRy * Math.cos(angle), -trackRx * Math.sin(angle));
  return { x: cx + x, y: cy + y, direction };
}

function update() {
  resetScene();
  if (!paused) lapAngle += speed;

  drawTrack();
  drawPitSign();

  const leader = pathPoint(lapAngle);
  const follower = pathPoint(lapAngle - 5);

  drawCar(leader.x, leader.y, leader.direction);
  drawCar(follower.x, follower.y, follower.direction);

  drawHUD();
  requestAnimationFrame(update);
}
