class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    flip = false,
    pivot = 0,
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
    this.flip = flip;
    this.pivot = pivot;
  }

  draw() {
    const frameWidth = this.image.width / this.framesMax;
    const drawX = this.position.x - this.offset.x;
    // Keep enlarged pixel art crisp; smooth only sprites that are drawn smaller
    context.imageSmoothingEnabled = this.scale < 1;

    // Mirror horizontally around the pivot line so the sprite stays over its hitbox
    if (this.flip) {
      const pivotX = drawX + this.pivot * this.scale;
      context.save();
      context.translate(pivotX * 2, 0);
      context.scale(-1, 1);
    }

    context.drawImage(
      this.image,
      this.framesCurrent * frameWidth,
      0,
      frameWidth,
      this.image.height,
      drawX,
      this.position.y - this.offset.y,
      frameWidth * this.scale,
      this.image.height * this.scale
    );

    if (this.flip) context.restore();
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

// Gap kept between a fighter's hitbox and the left/right edge of the screen
const SCREEN_MARGIN = 10;

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
    nativeFacing = "right",
    pivot = 0,
    hitFrame = 0,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      pivot,
    });
    this.hitFrame = hitFrame;
    // The direction the sprites are drawn facing; facing the other way mirrors them
    this.nativeFacing = nativeFacing;
    this.facing = nativeFacing;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: { ...attackBox.offset },
      width: attackBox.width,
      height: attackBox.height,
    };
    this.nativeAttackOffsetX = attackBox.offset.x;
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;
    this.death = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    if (!this.death) this.animateFrames();

    // Attack Boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Drawing AttackBox
    // context.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Screen edges: left and right only, jumping height isn't capped
    this.position.x = Math.max(
      SCREEN_MARGIN,
      Math.min(canvas.width - this.width - SCREEN_MARGIN, this.position.x)
    );

    // Gravity Function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 94) {
      this.velocity.y = 0;
      this.position.y = 332;
    } else this.velocity.y += gravity;
    console.log(this.position.y);
  }

  // True while an animation that must finish is playing (attack, getting hit, dying)
  isBusy() {
    if (this.image === this.sprites.death.image) return true;
    return (
      (this.image === this.sprites.attack1.image ||
        this.image === this.sprites.takeHit.image) &&
      this.framesCurrent < this.framesMax - 1
    );
  }

  face(direction) {
    if (this.facing === direction || this.isBusy()) return;
    this.facing = direction;
    this.flip = direction !== this.nativeFacing;
    // Mirror the attack box to the other side of the hitbox
    this.attackBox.offset.x = this.flip
      ? this.width - this.nativeAttackOffsetX - this.attackBox.width
      : this.nativeAttackOffsetX;
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    // Overriding all the other animation with the death animation
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.death = true;
      return;
    }

    // Overriding all the other animation with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    // Override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
          this.framesHold = 4;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
          this.framesHold = 4;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
