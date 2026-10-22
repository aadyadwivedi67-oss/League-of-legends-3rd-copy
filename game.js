
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const playerHealthBar = document.getElementById("playerHealth");
const playerHealthText = document.getElementById("playerHealthText");
const killsText = document.getElementById("kills");
const enemyCountText = document.getElementById("enemyCount");
const abilityStatus = document.getElementById("abilityStatus");
const gameMessage = document.getElementById("gameMessage");

const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const endTitle = document.getElementById("endTitle");
const endText = document.getElementById("endText");

const keys = {};
const mouse = { x: W / 2, y: H / 2 };

let player;
let enemies = [];
let projectiles = [];
let particles = [];

let gameState = "menu";
let kills = 0;
let abilityCooldown = 0;
let attackCooldown = 0;
let lastTime = 0;
let elapsed = 0;
let burstEffect = 0;

// ---------- RESET THE GAME ----------

function resetGame() {
  player = {
    x: 170,
    y: H / 2,
    radius: 17,
    health: 100,
    maxHealth: 100,
    speed: 245,
    color: "#55d9ff",
    facing: 0
  };

  enemies = [
    makeEnemy(700, 160, 1),
    makeEnemy(800, 310, 2),
    makeEnemy(700, 465, 3)
  ];

  projectiles = [];
  particles = [];
  kills = 0;
  abilityCooldown = 0;
  attackCooldown = 0;
  elapsed = 0;
  burstEffect = 0;

  updateHUD();
}

function makeEnemy(x, y, id) {
  return {
    x, y,
    id,
    radius: 16,
    health: 65,
    maxHealth: 65,
    speed: 65 + Math.random() * 15,
    attackCooldown: Math.random() * 1.5,
    color: "#ff657d",
    dead: false
  };
}

// ---------- GAME CONTROLS ----------

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (["w", "a", "s", "d", "q", " "].includes(key)) {
    event.preventDefault();
  }

  keys[key] = true;

  if (key === "q" && !event.repeat) {
    useAbility();
  }

  if (key === "enter" && gameState === "menu") {
    startGame();
  }

  if (key === "enter" &&
      (gameState === "won" || gameState === "lost")) {
    startGame();
  }
});

document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();

  mouse.x = (event.clientX - rect.left) * W / rect.width;
  mouse.y = (event.clientY - rect.top) * H / rect.height;
});

canvas.addEventListener("mousedown", (event) => {
  if (event.button === 0 && gameState === "playing") {
    attack();
  }
});

document.getElementById("startBtn").addEventListener(
  "click", startGame
);

document.getElementById("restartBtn").addEventListener(
  "click", startGame
);

document.getElementById("playAgainBtn").addEventListener(
  "click", startGame
);

function startGame() {
  resetGame();
  gameState = "playing";

  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");

  gameMessage.textContent = "ELIMINATE ALL ENEMIES";
}

function finishGame(won) {
  if (gameState !== "playing") return;

  gameState = won ? "won" : "lost";

  endTitle.textContent = won ? "VICTORY" : "DEFEAT";
  endTitle.style.color = won ? "#55d9ff" : "#ff657d";

  endText.textContent = won
    ? "The Rift belongs to you. All enemies eliminated!"
    : "Your champion has fallen. Regroup and try again.";

  endScreen.classList.remove("hidden");
  gameMessage.textContent = won ? "VICTORY ACHIEVED" : "CHAMPION DEFEATED";
}

// ---------- BASIC ATTACK ----------

function attack() {
  if (attackCooldown > 0) return;

  attackCooldown = 0.32;

  const angle = Math.atan2(
    mouse.y - player.y,
    mouse.x - player.x
  );

  player.facing = angle;

  projectiles.push({
    x: player.x + Math.cos(angle) * 22,
    y: player.y + Math.sin(angle) * 22,
    vx: Math.cos(angle) * 540,
    vy: Math.sin(angle) * 540,
    radius: 6,
    damage: 22,
    team: "player",
    life: 1.2,
    color: "#66e6ff"
  });

  makeParticles(
    player.x + Math.cos(angle) * 25,
    player.y + Math.sin(angle) * 25,
    "#55d9ff",
    4
  );
}

// ---------- Q: ARCANE BURST ----------

function useAbility() {
  if (gameState !== "playing" || abilityCooldown > 0) return;

  abilityCooldown = 5;
  burstEffect = 0.4;

  // Damage every enemy in range.
  enemies.forEach((enemy) => {
    if (enemy.dead) return;

    const distance = Math.hypot(
      enemy.x - player.x,
      enemy.y - player.y
    );

    if (distance < 155) {
      damageEnemy(enemy, 38);

      makeParticles(
        enemy.x, enemy.y, "#bc8aff", 16
      );
    }
  });

  // Visual burst around the champion.
  makeParticles(
    player.x, player.y, "#bc8aff", 28
  );
}

// ---------- DAMAGE AND ELIMINATIONS ----------

function damageEnemy(enemy, damage) {
  if (enemy.dead) return;

  enemy.health -= damage;

  if (enemy.health <= 0) {
    enemy.health = 0;
    enemy.dead = true;
    kills++;

    makeParticles(
      enemy.x, enemy.y, "#ff657d", 20
    );

    updateHUD();

    if (kills >= 3) {
      finishGame(true);
    }
  }
}

function updateHUD() {
  if (!player) return;

  const hp = Math.max(0, player.health);

  playerHealthBar.style.width =
    (hp / player.maxHealth * 100) + "%";

  playerHealthText.textContent =
    `${Math.ceil(hp)} / ${player.maxHealth} HP`;

  playerHealthBar.style.background =
    hp < 30
      ? "linear-gradient(90deg,#ff465f,#ff8491)"
      : "linear-gradient(90deg,#39c98c,#87f7c1)";

  killsText.innerHTML = `${kills} <span>/ 3</span>`;

  const remaining = enemies.filter(e => !e.dead).length;

  enemyCountText.textContent =
    `${remaining} ${remaining === 1 ? "enemy" : "enemies"} remaining`;

  abilityStatus.textContent =
    abilityCooldown > 0
      ? abilityCooldown.toFixed(1) + "s"
      : "READY";

  abilityStatus.style.color =
    abilityCooldown > 0 ? "#ffbd70" : "#6fffc1";
}

// ---------- PARTICLES ----------

function makeParticles(x, y, color, amount) {
  for (let i = 0; i < amount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 35 + Math.random() * 160;

    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.25 + Math.random() * 0.4,
      maxLife: 0.65,
      size: 2 + Math.random() * 4,
      color
    });
  }
}

// ---------- UPDATE GAME LOGIC ----------

function update(dt) {
  if (gameState !== "playing") return;

  elapsed += dt;

  attackCooldown = Math.max(0, attackCooldown - dt);
  abilityCooldown = Math.max(0, abilityCooldown - dt);
  burstEffect = Math.max(0, burstEffect - dt);

  // Player movement.
  let dx = 0;
  let dy = 0;

  if (keys["w"] || keys["arrowup"]) dy--;
  if (keys["s"] || keys["arrowdown"]) dy++;
  if (keys["a"] || keys["arrowleft"]) dx--;
  if (keys["d"] || keys["arrowright"]) dx++;

  // Normalize diagonal movement.
  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy);
    dx /= length;
    dy /= length;
  }

  player.x += dx * player.speed * dt;
  player.y += dy * player.speed * dt;

  // Keep the champion inside the arena.
  player.x = Math.max(25, Math.min(W - 25, player.x));
  player.y = Math.max(25, Math.min(H - 25, player.y));

  player.facing = Math.atan2(
    mouse.y - player.y,
    mouse.x - player.x
  );

  // Enemy AI: chase, approach and attack.
  enemies.forEach((enemy) => {
    if (enemy.dead) return;

    enemy.attackCooldown -= dt;

    const vx = player.x - enemy.x;
    const vy = player.y - enemy.y;
    const distance = Math.hypot(vx, vy) || 1;

    // Enemies approach when far away.
    if (distance > 235) {
      enemy.x += (vx / distance) * enemy.speed * dt;
      enemy.y += (vy / distance) * enemy.speed * dt;
    }

    // Avoid overlapping the player.
    if (distance < 38) {
      enemy.x -= (vx / distance) * enemy.speed * 0.35 * dt;
      enemy.y -= (vy / distance) * enemy.speed * 0.35 * dt;
    }

    // Enemies fire magical projectiles at range.
    if (distance < 390 && enemy.attackCooldown <= 0) {
      enemy.attackCooldown = 1.5 + Math.random() * 0.5;

      const angle = Math.atan2(vy, vx);

      projectiles.push({
        x: enemy.x + Math.cos(angle) * 20,
        y: enemy.y + Math.sin(angle) * 20,
        vx: Math.cos(angle) * 230,
        vy: Math.sin(angle) * 230,
        radius: 6,
        damage: 8,
        team: "enemy",
        life: 2,
        color: "#ff718b"
      });
    }
  });

  // Move projectiles and detect hits.
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;

    let remove = p.life <= 0 ||
      p.x < 0 || p.x > W ||
      p.y < 0 || p.y > H;

    if (!remove && p.team === "player") {
      for (const enemy of enemies) {
        if (enemy.dead) continue;

        const distance = Math.hypot(
          p.x - enemy.x, p.y - enemy.y
        );

        if (distance < enemy.radius + p.radius) {
          damageEnemy(enemy, p.damage);

          makeParticles(p.x, p.y, p.color, 5);
          remove = true;
          break;
        }
      }
    }

    if (!remove && p.team === "enemy") {
      const distance = Math.hypot(
        p.x - player.x, p.y - player.y
      );

      if (distance < player.radius + p.radius) {
        player.health = Math.max(
          0, player.health - p.damage
        );

        makeParticles(p.x, p.y, "#ff657d", 6);
        remove = true;

        if (player.health <= 0) {
          finishGame(false);
        }
      }
    }

    if (remove) {
      projectiles.splice(i, 1);
    }
  }

  // Update particles.
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    p.vx *= 0.98;
    p.vy *= 0.98;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  updateHUD();
}

// ---------- ARENA DRAWING ----------

function drawArena() {
  // Base grass.
  ctx.fillStyle = "#294b39";
  ctx.fillRect(0, 0, W, H);

  // Soft terrain patches.
  for (let i = 0; i < 55; i++) {
    const x = (i * 173 + 31) % W;
    const y = (i * 97 + 43) % H;

    ctx.fillStyle = i % 2 === 0
      ? "#345641"
      : "#234331";

    ctx.beginPath();
    ctx.ellipse(x, y, 30, 17, i * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Small grass flecks.
  ctx.fillStyle = "#73966a";

  for (let i = 0; i < 190; i++) {
    const x = (i * 137 + 17) % W;
    const y = (i * 83 + 29) % H;

    ctx.fillRect(x, y, 2, 2);
  }

  // Central stone lane.
  ctx.beginPath();
  ctx.moveTo(0, 255);
  ctx.lineTo(1000, 205);
  ctx.lineTo(1000, 365);
  ctx.lineTo(0, 415);
  ctx.closePath();

  ctx.fillStyle = "#59635b";
  ctx.fill();

  ctx.strokeStyle = "#82877a";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Stone paving lines.
  ctx.strokeStyle = "#444e49";
  ctx.lineWidth = 2;

  for (let x = -150; x < W + 150; x += 65) {
    const y = 335 - x * 0.05;

    ctx.beginPath();
    ctx.moveTo(x, y - 65);
    ctx.lineTo(x, y + 75);
    ctx.stroke();
  }

  for (let y = 265; y < 410; y += 35) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y - 50);
    ctx.stroke();
  }

  // Magical river.
  const river = ctx.createLinearGradient(0, 0, W, H);
  river.addColorStop(0, "#234c52");
  river.addColorStop(0.5, "#326c70");
  river.addColorStop(1, "#234c52");

  ctx.beginPath();
  ctx.moveTo(350, 0);
  ctx.lineTo(480, 0);
  ctx.lineTo(650, H);
  ctx.lineTo(510, H);
  ctx.closePath();

  ctx.fillStyle = river;
  ctx.fill();

  ctx.strokeStyle = "#6cc8bb55";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Decorative crystals at the arena edges.
  drawCrystal(65, 75, "#55d9ff");
  drawCrystal(935, 520, "#ff657d");
  drawCrystal(910, 75, "#ff657d");
  drawCrystal(80, 520, "#55d9ff");

  // Arena boundary.
  ctx.strokeStyle = "#a2c9a044";
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, W - 10, H - 10);
}

function drawCrystal(x, y, color) {
  ctx.save();
  ctx.translate(x, y);

  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, -17);
  ctx.lineTo(11, -3);
  ctx.lineTo(7, 14);
  ctx.lineTo(-7, 14);
  ctx.lineTo(-11, -3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ---------- CHAMPION DRAWING ----------

function drawChampion(entity, isPlayer) {
  if (!isPlayer && entity.dead) return;

  ctx.save();
  ctx.translate(entity.x, entity.y);

  // Shadow.
  ctx.fillStyle = "#07100b99";
  ctx.beginPath();
  ctx.ellipse(3, 9, 22, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Selection circle.
  ctx.strokeStyle = isPlayer ? "#55d9ff" : "#ff657d";
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 23, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Champion body.
  ctx.fillStyle = isPlayer ? "#286fba" : "#9f304d";
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  // Armor outline.
  ctx.strokeStyle = isPlayer ? "#9befff" : "#ffb1c0";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Direction indicator.
  const angle = isPlayer
    ? player.facing
    : Math.atan2(player.y - entity.y, player.x - entity.x);

  ctx.rotate(angle);

  ctx.fillStyle = isPlayer ? "#b9f7ff" : "#ffc0cb";

  ctx.beginPath();
  ctx.moveTo(8, -5);
  ctx.lineTo(24, 0);
  ctx.lineTo(8, 5);
  ctx.closePath();
  ctx.fill();

  // Center gem.
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Health bar.
  if (!isPlayer) {
    drawHealthBar(
      entity.x - 24,
      entity.y - 31,
      48,
      entity.health / entity.maxHealth,
      "#ff536e"
    );

    ctx.fillStyle = "#f5dce1";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("HOLLOW " + entity.id, entity.x, entity.y - 38);
  }
}

function drawHealthBar(x, y, width, ratio, color) {
  ctx.fillStyle = "#0a1016";
  ctx.fillRect(x - 1, y - 1, width + 2, 6);

  ctx.fillStyle = "#3c4652";
  ctx.fillRect(x, y, width, 4);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * Math.max(0, ratio), 4);
}

// ---------- DRAW PROJECTILES AND EFFECTS ----------

function drawEffects() {
  projectiles.forEach((p) => {
    ctx.save();

    ctx.shadowBlur = 16;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = Math.max(
      0, Math.min(1, p.life / p.maxLife)
    );

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  // Q ability visual ring.
  if (burstEffect > 0 && player) {
    const progress = 1 - burstEffect / 0.4;

    ctx.save();
    ctx.globalAlpha = burstEffect / 0.4;
    ctx.strokeStyle = "#c59aff";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.arc(
      player.x, player.y,
      30 + progress * 125,
      0, Math.PI * 2
    );
    ctx.stroke();

    ctx.restore();
  }
}

function draw() {
  drawArena();

  // Draw all active enemies.
  enemies.forEach((enemy) => {
    drawChampion(enemy, false);
  });

  if (player) {
    drawChampion(player, true);
  }

  drawEffects();

  // Aiming reticle.
  if (gameState === "playing") {
    ctx.save();
    ctx.strokeStyle = "#ffffffcc";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 9, 0, Math.PI * 2);
    ctx.moveTo(mouse.x - 14, mouse.y);
    ctx.lineTo(mouse.x - 5, mouse.y);
    ctx.moveTo(mouse.x + 5, mouse.y);
    ctx.lineTo(mouse.x + 14, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 14);
    ctx.lineTo(mouse.x, mouse.y - 5);
    ctx.moveTo(mouse.x, mouse.y + 5);
    ctx.lineTo(mouse.x, mouse.y + 14);
    ctx.stroke();

    ctx.restore();
  }
}

// ---------- MAIN GAME LOOP ----------

function gameLoop(timestamp) {
  const dt = lastTime
    ? Math.min((timestamp - lastTime) / 1000, 0.04)
    : 0;

  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(gameLoop);
}

resetGame();
requestAnimationFrame(gameLoop);
