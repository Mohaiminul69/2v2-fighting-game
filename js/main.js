const canvas = document.querySelector("#main-canvas");

const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 620,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

// Fighters are created once both players have picked a character
let player;
let enemy;
let fightStarted = false;

function startFight(playerCharacter, enemyCharacter) {
  player = createFighter(playerCharacter, {
    position: { x: 200, y: 0 },
    facing: "right",
  });
  enemy = createFighter(enemyCharacter, {
    position: { x: 700, y: 0 },
    facing: "left",
  });
  document.querySelector("#player-name").innerText = characters[playerCharacter].name;
  document.querySelector("#enemy-name").innerText = characters[enemyCharacter].name;
  fightStarted = true;
  showBanner("FIGHT!");
  decreaseTimer();
}

// Fighters turn to face each other (not in the middle of an attack or a hit)
function updateFacing() {
  const playerOnLeft = player.position.x <= enemy.position.x;
  player.face(playerOnLeft ? "right" : "left");
  enemy.face(playerOnLeft ? "left" : "right");
}

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.save();
  applyScreenShake();
  background.update();
  shop.update();
  context.fillStyle = "rgba(0,0,0,0.15)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawFireflies();
  if (fightStarted) {
    drawShadow(player);
    drawShadow(enemy);
    player.update();
    enemy.update();
  }
  drawSparks();
  context.restore();
  drawVignette();

  if (!fightStarted) return;

  updateFacing();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Player Movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // Player Jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Enemy Movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // enemy Jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // Detect Collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === player.hitFrame
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    spawnHitEffect(player, enemy);
    updateHealthBar("enemy", enemy.health);
  }

  // If Player Misses
  if (player.isAttacking && player.framesCurrent === player.hitFrame) {
    player.isAttacking = false;
  }

  //Detect Collision for enemy
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === enemy.hitFrame
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    spawnHitEffect(enemy, player);
    updateHealthBar("player", player.health);
  }

  // If Enemy Misses
  if (enemy.isAttacking && enemy.framesCurrent === enemy.hitFrame) {
    enemy.isAttacking = false;
  }

  //End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

// Start once every script (effects, character select) has loaded
window.addEventListener("DOMContentLoaded", () => {
  window.requestAnimationFrame(animate);
});

window.addEventListener("keydown", (event) => {
  if (!fightStarted) return;

  if (!player.death) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.death) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "m":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  //Enemy Keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
