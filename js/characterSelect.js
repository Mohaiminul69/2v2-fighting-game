const characterKeys = Object.keys(characters).filter(
  (key) => !characters[key].hidden
);

// Player 1 fights facing right, player 2 facing left
const selectors = [
  {
    element: document.querySelector("#p1-select"),
    facing: "right",
    index: 0,
    locked: false,
    keys: { left: "a", right: "d", confirm: " " },
  },
  {
    element: document.querySelector("#p2-select"),
    facing: "left",
    index: 1,
    locked: false,
    keys: { left: "ArrowLeft", right: "ArrowRight", confirm: "m" },
  },
];

// One idle image per character, shared by every preview card
const previewImages = {};
for (const key of characterKeys) {
  previewImages[key] = new Image();
  previewImages[key].src = characters[key].sprites.idle.imageSrc;
}

const previews = [];

for (const selector of selectors) {
  const cards = selector.element.querySelector(".cards");

  characterKeys.forEach((key, index) => {
    // A div rather than a button, so a focused card doesn't react to Space
    const card = document.createElement("div");
    card.className = "character-card";

    const preview = document.createElement("canvas");
    preview.width = 72;
    preview.height = 92;
    previews.push({
      canvas: preview,
      key,
      flip: characters[key].facing !== selector.facing,
    });

    const name = document.createElement("span");
    name.innerText = characters[key].name;

    card.append(preview, name);
    card.addEventListener("click", () => {
      if (selector.locked) return;
      selector.index = index;
      lockIn(selector);
    });
    cards.append(card);
  });
}

function renderSelectors() {
  for (const selector of selectors) {
    const cards = selector.element.querySelectorAll(".character-card");
    cards.forEach((card, index) => {
      card.classList.toggle("selected", index === selector.index);
    });
    selector.element.classList.toggle("locked", selector.locked);
  }
}

function lockIn(selector) {
  selector.locked = true;
  renderSelectors();

  if (selectors.every((s) => s.locked)) {
    setTimeout(() => {
      document.querySelector("#character-select").style.display = "none";
      startFight(
        characterKeys[selectors[0].index],
        characterKeys[selectors[1].index]
      );
    }, 600);
  }
}

window.addEventListener("keydown", (event) => {
  if (fightStarted) return;

  for (const selector of selectors) {
    if (selector.locked) continue;
    const count = characterKeys.length;

    switch (event.key) {
      case selector.keys.left:
        selector.index = (selector.index - 1 + count) % count;
        renderSelectors();
        break;
      case selector.keys.right:
        selector.index = (selector.index + 1) % count;
        renderSelectors();
        break;
      case selector.keys.confirm:
        event.preventDefault();
        lockIn(selector);
        break;
    }
  }
});

// Animate the idle previews on the cards
let previewTick = 0;
function animatePreviews() {
  if (fightStarted) return;
  window.requestAnimationFrame(animatePreviews);
  previewTick++;

  for (const { canvas: preview, key, flip } of previews) {
    const character = characters[key];
    const image = previewImages[key];
    if (!image.complete || !image.width) continue;

    const framesMax = character.sprites.idle.framesMax;
    const frameWidth = image.width / framesMax;
    const frame = Math.floor(previewTick / 10) % framesMax;
    const crop = character.portrait;

    // Fit the portrait area into the card, anchored to the bottom
    const scale = Math.min(
      preview.width / crop.width,
      preview.height / crop.height
    );
    const width = crop.width * scale;
    const height = crop.height * scale;
    const previewContext = preview.getContext("2d");
    previewContext.imageSmoothingEnabled = false;
    previewContext.clearRect(0, 0, preview.width, preview.height);
    previewContext.save();
    if (flip) {
      previewContext.translate(preview.width, 0);
      previewContext.scale(-1, 1);
    }
    previewContext.drawImage(
      image,
      frame * frameWidth + crop.x,
      crop.y,
      crop.width,
      crop.height,
      (preview.width - width) / 2,
      preview.height - height,
      width,
      height
    );
    previewContext.restore();
  }
}

renderSelectors();
animatePreviews();
