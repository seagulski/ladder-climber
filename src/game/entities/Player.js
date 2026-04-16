import {
  LANES,
  LANE_COUNT,
  PLAYER_MOVE_DURATION,
  COFFEE_DURATION,
  COLORS
} from "../constants.js";

// Visual style per form
const FORMS = {
  intern: {
    bodyColor: 0x44ddbb, headColor: 0x44ddbb,
    bodyW: 16, bodyH: 22, headW: 12, headH: 10,
    tie: false, glow: false
  },
  analyst: {
    bodyColor: 0x4499ff, headColor: 0x5599dd,
    bodyW: 18, bodyH: 24, headW: 12, headH: 10,
    tie: true, tieColor: 0x2266cc, glow: false
  },
  manager: {
    bodyColor: 0xdd8822, headColor: 0xcc7722,
    bodyW: 20, bodyH: 26, headW: 12, headH: 10,
    tie: true, tieColor: 0x993311, glow: false
  },
  executive: {
    bodyColor: 0xaa44ee, headColor: 0x9944cc,
    bodyW: 20, bodyH: 26, headW: 13, headH: 11,
    tie: true, tieColor: 0x6622aa, glow: true, glowColor: 0xaa44ee
  },
  entity: {
    bodyColor: 0xff3388, headColor: 0xff3388,
    bodyW: 18, bodyH: 24, headW: 14, headH: 12,
    tie: false, glow: true, glowColor: 0xff3388
  }
};

export default class Player extends Phaser.GameObjects.Container {
  constructor(scene, startLane = 1) {
    const x = LANES[startLane];
    super(scene, x, 0);

    scene.add.existing(this);

    // Graphics-based visual
    this.gfx = scene.add.graphics();
    this.add(this.gfx);

    // Lane state
    this.currentLane = startLane;
    this.isMovingLane = false;
    this.moveTween = null;

    // Game state
    this.score = 0;
    this.visibility = 0;
    this.alive = true;
    this.form = "intern";

    // Demotion
    this.demotionsRemaining = 3;
    this.demotionCount = 0;

    // Score multiplier
    this.multiplier = 1.0;
    this.maxMultiplier = 1.0;

    // Coffee buff
    this.coffeeActive = false;
    this.coffeeTimer = 0;

    // Grace period
    this.graceTimer = 0;

    this.setDepth(10);
    this.drawForm();
  }

  drawForm() {
    const f = FORMS[this.form] || FORMS.intern;
    const g = this.gfx;
    g.clear();

    // Glow
    if (f.glow) {
      g.fillStyle(f.glowColor, 0.15);
      g.fillCircle(0, -4, 22);
    }

    // Body
    g.fillStyle(this.coffeeActive ? 0xffcc00 : f.bodyColor, 1);
    g.fillRect(-f.bodyW / 2, -f.bodyH / 2, f.bodyW, f.bodyH);

    // Head
    g.fillStyle(this.coffeeActive ? 0xffdd44 : f.headColor, 1);
    g.fillRect(-f.headW / 2, -f.bodyH / 2 - f.headH - 2, f.headW, f.headH);

    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillRect(-3, -f.bodyH / 2 - f.headH + 2, 2, 2);
    g.fillRect(2, -f.bodyH / 2 - f.headH + 2, 2, 2);

    // Tie
    if (f.tie) {
      g.fillStyle(f.tieColor, 1);
      g.fillRect(-2, -f.bodyH / 2, 4, 10);
    }

    // Legs
    g.fillStyle(0x333344, 1);
    g.fillRect(-5, f.bodyH / 2, 4, 6);
    g.fillRect(2, f.bodyH / 2, 4, 6);
  }

  moveToLane(direction) {
    if (!this.alive) return;
    const newLane = this.currentLane + direction;
    if (newLane < 0 || newLane >= LANE_COUNT) return;
    if (this.isMovingLane) return;

    this.currentLane = newLane;
    this.isMovingLane = true;

    if (this.moveTween) this.moveTween.stop();

    this.moveTween = this.scene.tweens.add({
      targets: this,
      x: LANES[newLane],
      duration: PLAYER_MOVE_DURATION,
      ease: "Power2",
      onComplete: () => {
        this.isMovingLane = false;
        this.moveTween = null;
      }
    });
  }

  moveLeft() { this.moveToLane(-1); }
  moveRight() { this.moveToLane(1); }

  addScore(baseAmount) {
    this.score += baseAmount * this.multiplier;
  }

  addVisibility(amount) {
    this.visibility += amount;
  }

  bumpMultiplier(amount) {
    this.multiplier = Math.min(this.multiplier + amount, 3.0);
    if (this.multiplier > this.maxMultiplier) this.maxMultiplier = this.multiplier;
  }

  breakMultiplier() { this.multiplier = 1.0; }

  setForm(newForm) {
    if (newForm === this.form) return;
    this.form = newForm;
    this.drawForm();
  }

  demote(visibilityDrop) {
    this.demotionsRemaining--;
    this.demotionCount++;
    this.breakMultiplier();
    this.visibility = Math.max(0, this.visibility - visibilityDrop);
    this.graceTimer = 4000;
  }

  isInGrace() { return this.graceTimer > 0; }

  activateCoffee() {
    this.coffeeActive = true;
    this.coffeeTimer = COFFEE_DURATION;
    this.drawForm();
  }

  update(delta) {
    if (!this.alive) return;

    if (this.coffeeActive) {
      this.coffeeTimer -= delta;
      if (this.coffeeTimer <= 0) {
        this.coffeeActive = false;
        this.drawForm();
      }
    }

    if (this.graceTimer > 0) {
      this.graceTimer -= delta;
      const blink = Math.floor(this.graceTimer / 120) % 2 === 0;
      this.setAlpha(blink ? 1.0 : 0.3);
      if (this.graceTimer <= 0) this.setAlpha(1.0);
    }
  }

  kill() { this.alive = false; }
}
