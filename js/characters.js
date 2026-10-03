// Each character is described facing the way its sprites are drawn.
// createFighter() mirrors it when it needs to face the other way.
//   pivot:    x (in sprite-frame pixels) of the body's centre line, used as the mirror axis
//   hitFrame: attack frame on which the hit lands
//   portrait: area of the idle frame shown on the character select card
//   hidden:   true to leave the character off the select screen
const characters = {
  samuraiMack: {
    name: "Samurai Mack",
    hidden: true,
    facing: "right",
    scale: 2.5,
    offset: { x: 215, y: 157 },
    pivot: 98,
    hitFrame: 4,
    attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 },
    portrait: { x: 68, y: 56, width: 60, height: 70 },
    sprites: {
      idle: { imageSrc: "./img/samuraiMack/Idle.png", framesMax: 8 },
      run: { imageSrc: "./img/samuraiMack/Run.png", framesMax: 8 },
      jump: { imageSrc: "./img/samuraiMack/Jump.png", framesMax: 2 },
      fall: { imageSrc: "./img/samuraiMack/Fall.png", framesMax: 2 },
      attack1: { imageSrc: "./img/samuraiMack/Attack1.png", framesMax: 6 },
      takeHit: {
        imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
        framesMax: 4,
      },
      death: { imageSrc: "./img/samuraiMack/Death.png", framesMax: 6 },
    },
  },
  kenji: {
    name: "Kenji",
    hidden: true,
    facing: "left",
    scale: 2.5,
    offset: { x: 215, y: 167 },
    pivot: 98,
    hitFrame: 2,
    attackBox: { offset: { x: -170, y: 50 }, width: 170, height: 50 },
    portrait: { x: 68, y: 62, width: 60, height: 70 },
    sprites: {
      idle: { imageSrc: "./img/kenji/Idle.png", framesMax: 4 },
      run: { imageSrc: "./img/kenji/Run.png", framesMax: 8 },
      jump: { imageSrc: "./img/kenji/Jump.png", framesMax: 2 },
      fall: { imageSrc: "./img/kenji/Fall.png", framesMax: 2 },
      attack1: { imageSrc: "./img/kenji/Attack1.png", framesMax: 4 },
      takeHit: { imageSrc: "./img/kenji/Take hit.png", framesMax: 3 },
      death: { imageSrc: "./img/kenji/Death.png", framesMax: 7 },
    },
  },
  dew: {
    name: "Dew",
    facing: "right",
    scale: 0.56,
    offset: { x: 36, y: -11 },
    pivot: 118.5,
    hitFrame: 1,
    attackBox: { offset: { x: 50, y: 30 }, width: 90, height: 50 },
    portrait: { x: 11, y: 0, width: 214, height: 250 },
    sprites: {
      idle: { imageSrc: "./img/Dew/Idle.png", framesMax: 4 },
      run: { imageSrc: "./img/Dew/Run.png", framesMax: 6 },
      jump: { imageSrc: "./img/Dew/Jump.png", framesMax: 3 },
      fall: { imageSrc: "./img/Dew/Fall.png", framesMax: 2 },
      attack1: { imageSrc: "./img/Dew/Attack1.png", framesMax: 4 },
      takeHit: { imageSrc: "./img/Dew/Take Hit.png", framesMax: 4 },
      death: { imageSrc: "./img/Dew/Death.png", framesMax: 6 },
    },
  },
  teenDew: {
    name: "Teen Dew",
    facing: "right",
    scale: 0.62,
    offset: { x: 30, y: -22 },
    pivot: 97,
    hitFrame: 3,
    attackBox: { offset: { x: 50, y: 30 }, width: 90, height: 50 },
    portrait: { x: 6, y: 0, width: 184, height: 207 },
    sprites: {
      idle: { imageSrc: "./img/Teen Dew/Idle.png", framesMax: 4 },
      run: { imageSrc: "./img/Teen Dew/Run.png", framesMax: 7 },
      jump: { imageSrc: "./img/Teen Dew/Jump.png", framesMax: 3 },
      fall: { imageSrc: "./img/Teen Dew/Fall.png", framesMax: 2 },
      attack1: { imageSrc: "./img/Teen Dew/Attack1.png", framesMax: 7 },
      takeHit: { imageSrc: "./img/Teen Dew/Take Hit.png", framesMax: 5 },
      death: { imageSrc: "./img/Teen Dew/Death.png", framesMax: 6 },
    },
  },
  araf: {
    name: "Araf",
    facing: "right",
    scale: 0.7,
    offset: { x: 49, y: -10 },
    pivot: 113,
    hitFrame: 3,
    attackBox: { offset: { x: 50, y: 30 }, width: 90, height: 50 },
    portrait: { x: 18, y: 0, width: 190, height: 201 },
    sprites: {
      idle: { imageSrc: "./img/Araf/Idle.png", framesMax: 5 },
      run: { imageSrc: "./img/Araf/Run.png", framesMax: 8 },
      jump: { imageSrc: "./img/Araf/Jump.png", framesMax: 3 },
      fall: { imageSrc: "./img/Araf/Fall.png", framesMax: 2 },
      attack1: { imageSrc: "./img/Araf/Attack1.png", framesMax: 5 },
      takeHit: { imageSrc: "./img/Araf/Take Hit.png", framesMax: 5 },
      death: { imageSrc: "./img/Araf/Death.png", framesMax: 8 },
    },
  },
  sanji: {
    name: "Sanji",
    facing: "right",
    scale: 0.65,
    offset: { x: 62, y: 6 },
    pivot: 142,
    hitFrame: 1,
    attackBox: { offset: { x: 40, y: 20 }, width: 110, height: 60 },
    portrait: { x: 40, y: 0, width: 206, height: 241 },
    sprites: {
      idle: { imageSrc: "./img/Sanji/Idle.png", framesMax: 5 },
      run: { imageSrc: "./img/Sanji/Run.png", framesMax: 7 },
      jump: { imageSrc: "./img/Sanji/Jump.png", framesMax: 3 },
      fall: { imageSrc: "./img/Sanji/Fall.png", framesMax: 2 },
      attack1: { imageSrc: "./img/Sanji/Attack1.png", framesMax: 4 },
      takeHit: { imageSrc: "./img/Sanji/Take Hit.png", framesMax: 5 },
      death: { imageSrc: "./img/Sanji/Death.png", framesMax: 6 },
    },
  },
  zoro: {
    name: "Zoro",
    facing: "right",
    scale: 0.65,
    offset: { x: 55, y: 5 },
    pivot: 131,
    hitFrame: 1,
    attackBox: { offset: { x: 40, y: 0 }, width: 100, height: 110 },
    portrait: { x: 45, y: 0, width: 170, height: 240 },
    sprites: {
      idle: { imageSrc: "./img/Zoro/Idle.png", framesMax: 5 },
      run: { imageSrc: "./img/Zoro/Run.png", framesMax: 7 },
      jump: { imageSrc: "./img/Zoro/Jump.png", framesMax: 3 },
      fall: { imageSrc: "./img/Zoro/Fall.png", framesMax: 2 },
      attack1: { imageSrc: "./img/Zoro/Attack1.png", framesMax: 5 },
      takeHit: { imageSrc: "./img/Zoro/Take Hit.png", framesMax: 5 },
      death: { imageSrc: "./img/Zoro/Death.png", framesMax: 6 },
    },
  },
};

const FIGHTER_WIDTH = 50;

function createFighter(characterKey, { position, facing }) {
  const character = characters[characterKey];
  const flip = character.facing !== facing;

  const attackBox = {
    offset: { ...character.attackBox.offset },
    width: character.attackBox.width,
    height: character.attackBox.height,
  };
  // Mirror the attack box to the other side of the fighter's hitbox
  if (flip) {
    attackBox.offset.x =
      FIGHTER_WIDTH - character.attackBox.offset.x - character.attackBox.width;
  }

  // Fighter attaches Image objects to its sprites, so give each fighter its own copy
  const sprites = {};
  for (const sprite in character.sprites) {
    sprites[sprite] = { ...character.sprites[sprite] };
  }

  const fighter = new Fighter({
    position,
    velocity: { x: 0, y: 0 },
    imageSrc: sprites.idle.imageSrc,
    framesMax: sprites.idle.framesMax,
    scale: character.scale,
    offset: character.offset,
    sprites,
    attackBox,
    flip,
    pivot: character.pivot,
    hitFrame: character.hitFrame,
  });
  fighter.name = character.name;
  return fighter;
}
