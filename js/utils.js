function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// The health bar snaps down, then a lighter "damage trail" drains after it
function updateHealthBar(side, health) {
  gsap.to(`#${side}-health`, { width: health + "%", duration: 0.15 });
  gsap.to(`#${side}-health-trail`, {
    width: health + "%",
    duration: 0.6,
    delay: 0.35,
    ease: "power2.out",
  });
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  const message = document.getElementById("game-message");
  if (message.classList.contains("show")) return;

  const knockout = player.health <= 0 || enemy.health <= 0;
  let result;
  if (player.health === enemy.health) {
    result = "Draw";
  } else if (player.health > enemy.health) {
    result = `Player 1 Wins &middot; ${player.name}`;
  } else {
    result = `Player 2 Wins &middot; ${enemy.name}`;
  }
  message.innerHTML = `
    <div class="message-title">${knockout ? "K.O." : "Time Up"}</div>
    <div class="message-result">${result}</div>`;
  message.classList.add("show");
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.getElementById("timer").innerText = timer;
    document.getElementById("timer").classList.toggle("low", timer <= 10);
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
