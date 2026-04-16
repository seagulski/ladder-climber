import Phaser from "phaser";
import Player from "../entities/Player.js";
import LadderManager from "../managers/LadderManager.js";
import ObstacleManager from "../managers/ObstacleManager.js";
import DifficultyManager from "../managers/DifficultyManager.js";
import AchievementManager from "../managers/AchievementManager.js";
import BackgroundManager from "../managers/BackgroundManager.js";
import SoundManager from "../managers/SoundManager.js";
import { getFloorNumber, getFloorData, getZoneForFloor, getFloorLabel } from "../data/floors.js";
import { getStageForVisibility, getNextStage, CAREER_STAGES } from "../data/titles.js";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  LANES,
  BASE_SCROLL_SPEED,
  VISIBILITY_COFFEE_BONUS,
  COLORS
} from "../constants.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.leftPressed = false;
    this.rightPressed = false;

    // Mobile touch — swipe or tap left/right half
    this.touchLeft = false;
    this.touchRight = false;
    this.input.on("pointerdown", (pointer) => {
      this.sound_mgr.ensureContext(); // unlock audio on first touch
      if (pointer.x < GAME_WIDTH / 2) {
        this.touchLeft = true;
      } else {
        this.touchRight = true;
      }
    });
    this.input.on("pointerup", () => {
      this.touchLeft = false;
      this.touchRight = false;
    });

    // Player
    this.player = new Player(this, 1);
    this.playerScreenY = GAME_HEIGHT * 0.65;

    // Managers
    this.ladderManager = new LadderManager(this);
    this.difficultyManager = new DifficultyManager();
    this.obstacleManager = new ObstacleManager(this, this.difficultyManager);
    this.achievementManager = new AchievementManager();
    this.backgroundManager = new BackgroundManager(this);
    this.sound_mgr = new SoundManager();

    // Camera scroll
    this.cameraY = -200;
    this.cameras.main.scrollY = this.cameraY;
    this.player.y = this.cameraY + this.playerScreenY;

    this.ladderManager.createInitial(this.cameraY);
    this.backgroundManager.init(this.cameraY);

    // Scroll
    this.scrollSpeed = BASE_SCROLL_SPEED;
    this.distanceClimbed = 0;

    // Career
    this.currentStage = getStageForVisibility(0);
    this.highestStageIndex = 0;
    this.highestTitle = this.currentStage.title;

    // Floor
    this.currentFloor = 0;
    this.highestFloor = 1;
    this.currentZone = getZoneForFloor(1);
    this.lastZoneId = null;

    // Hit cooldown
    this.hitCooldown = 0;

    // Timer
    this.runStartTime = this.time.now;
    this.achievementManager.startRun(this.runStartTime);

    // Track lane changes for achievements
    this.lastPlayerLane = this.player.currentLane;

    // Paused state (during demotion scene)
    this.isPaused = false;

    // --- HUD ---
    this.titleText = this.add.text(16, 16, this.currentStage.title, {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#ffffff"
    }).setScrollFactor(0).setDepth(100);

    this.scoreText = this.add.text(GAME_WIDTH - 16, 16, "0", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#00ffcc"
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.multiplierText = this.add.text(GAME_WIDTH - 16, 36, "1.0x", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#888888"
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.floorText = this.add.text(GAME_WIDTH / 2, 16, "FLOOR 1", {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#666666"
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    // Visibility bar
    this.visBarBg = this.add.rectangle(16, 38, 160, 6, COLORS.hudBarBg)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.visBar = this.add.rectangle(16, 38, 1, 6, COLORS.hudBar)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(101);

    // Demotions remaining indicator
    this.demotionDots = [];
    for (let i = 0; i < 3; i++) {
      const dot = this.add.rectangle(16 + i * 14, 50, 8, 8, 0x00ffcc)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
      this.demotionDots.push(dot);
    }

    // Zone label
    this.zoneLabelText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "#1a1828",
      padding: { left: 12, right: 12, top: 8, bottom: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0);

    // Promotion toast
    this.promotionText = this.add.text(GAME_WIDTH / 2, 70, "", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#ffcc00"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0);

    // Achievement toast
    this.achievementToast = this.add.text(GAME_WIDTH / 2, 90, "", {
      fontFamily: "monospace", fontSize: "10px", color: "#ffcc00",
      backgroundColor: "#1a1628",
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0);

    this.lastAchievementCount = 0;

    // Warning indicators — one per lane at top of screen
    this.warnings = [];
    for (let i = 0; i < 4; i++) {
      // Convert lane world-x to screen-x (lanes are in world space but warnings are HUD)
      const indicator = this.add.triangle(0, 0, 0, 0, 6, 12, -6, 12, 0xff4444)
        .setScrollFactor(0).setDepth(99).setAlpha(0);
      // We'll position these dynamically based on lane positions
      this.warnings.push(indicator);
    }

    // CRT scanline overlay
    this.createCRTOverlay();

    // Corporate message ticker
    this.tickerText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 24, "", {
      fontFamily: "monospace", fontSize: "9px", color: "#555555"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(0);
    this.nextTickerTime = 8000;
    this.promotionCount = 0;

    // Onboarding (first run hints)
    this.showOnboarding();

    // World event listener
    this.events.on("world-event", (event) => {
      this.showEventBanner(event.label);
    });

    // Listen for resume from demotion scene
    this.events.on("resume", () => {
      this.isPaused = false;
    });
  }

  createCRTOverlay() {
    const g = this.add.graphics().setScrollFactor(0).setDepth(500).setAlpha(0.06);
    for (let y = 0; y < GAME_HEIGHT; y += 3) {
      g.fillStyle(0x000000, 1);
      g.fillRect(0, y, GAME_WIDTH, 1);
    }
  }

  update(time, delta) {
    if (!this.player.alive || this.isPaused) return;

    // --- Input ---
    this.handleInput();

    // --- Floor / Zone ---
    const floorNum = getFloorNumber(this.distanceClimbed);
    const floorData = getFloorData(floorNum);

    if (floorNum !== this.currentFloor) {
      this.currentFloor = floorNum;
      if (floorNum > this.highestFloor) this.highestFloor = floorNum;
      this.currentZone = floorData.zone;
      this.achievementManager.onFloorChanged(floorNum, time);

      if (this.currentZone.id !== this.lastZoneId) {
        this.lastZoneId = this.currentZone.id;
        this.ladderManager.setZone(this.currentZone.id);
        this.showZoneLabel(this.currentZone.label);
      }

      // Named floor labels every 10 floors
      const floorLabel = getFloorLabel(floorNum);
      if (floorLabel) {
        this.showFloorLabel(floorLabel);
      }
    }

    // --- Scroll ---
    this.scrollSpeed = BASE_SCROLL_SPEED * floorData.scrollSpeedMod;
    const coffeeBoost = this.player.coffeeActive ? 0.4 : 0;
    const frameScroll = this.scrollSpeed + coffeeBoost;

    this.cameraY -= frameScroll;
    this.cameras.main.scrollY = this.cameraY;
    this.distanceClimbed += frameScroll;

    // Player locked to screen position
    this.player.y = this.cameraY + this.playerScreenY;

    // Score: distance * multiplier
    this.player.addScore(frameScroll);
    this.player.visibility += 0.08;

    // Multiplier grows slowly from clean climbing
    this.player.bumpMultiplier(0.0003);

    // --- Player update ---
    this.player.update(delta);

    // --- Cooldowns ---
    if (this.hitCooldown > 0) this.hitCooldown -= delta;

    // --- Managers ---
    this.difficultyManager.update(this.player.score, time);
    this.ladderManager.update(this.cameraY);
    this.obstacleManager.update(this.cameraY, floorData, time);
    this.backgroundManager.update(this.cameraY, this.currentZone);

    // --- Collisions ---
    if (!this.player.isInGrace()) {
      this.checkHazardCollisions();
    }
    this.checkPowerupCollisions();

    // --- Warnings ---
    this.updateWarnings();

    // --- Career ---
    this.updateCareer();

    // --- Achievements ---
    this.achievementManager.updateTime(time, Math.floor(this.player.score));
    // Track lane changes
    if (this.player.currentLane !== this.lastPlayerLane) {
      this.achievementManager.onLaneChange(this.player.currentLane, time);
      this.lastPlayerLane = this.player.currentLane;
    }
    // Check for new unlocks
    this.checkAchievementToasts();

    // --- Ticker ---
    this.updateTicker(time);

    // --- HUD ---
    this.updateHUD();
  }

  handleInput() {
    const leftDown = this.cursors.left.isDown || this.keyA.isDown || this.touchLeft;
    const rightDown = this.cursors.right.isDown || this.keyD.isDown || this.touchRight;

    if (leftDown && !this.leftPressed) {
      this.player.moveLeft();
      this.sound_mgr.laneSwitch();
      this.leftPressed = true;
    }
    if (!leftDown) this.leftPressed = false;

    if (rightDown && !this.rightPressed) {
      this.player.moveRight();
      this.sound_mgr.laneSwitch();
      this.rightPressed = true;
    }
    if (!rightDown) this.rightPressed = false;

    // Reset touch after processing (one tap = one move)
    this.touchLeft = false;
    this.touchRight = false;
  }

  checkHazardCollisions() {
    if (this.hitCooldown > 0) return;

    const px = this.player.x;
    const py = this.player.y;
    const halfW = 12;
    const halfH = 16;

    for (const hazard of this.obstacleManager.hazards) {
      if (!hazard.active) continue;
      // Delayed hazards only collide when solid
      if (hazard.getData("behavior") === "delayed" && !hazard.getData("solid")) continue;

      const hx = hazard.x;
      const hy = hazard.y;
      const hw = hazard.width / 2;
      const hh = hazard.height / 2;

      if (px + halfW > hx - hw && px - halfW < hx + hw &&
          py + halfH > hy - hh && py - halfH < hy + hh) {
        this.onHazardHit(hazard);
        break;
      }
    }
  }

  checkPowerupCollisions() {
    const px = this.player.x;
    const py = this.player.y;

    for (let i = this.obstacleManager.powerups.length - 1; i >= 0; i--) {
      const pu = this.obstacleManager.powerups[i];
      if (!pu.active) continue;

      const dist = Math.abs(px - pu.x) + Math.abs(py - pu.y);
      if (dist < 40) {
        this.onPowerupCollect(pu);
      }
    }
  }

  onHazardHit(hazard, time) {
    this.sound_mgr.hit();
    this.cameras.main.shake(100, 0.006);

    // Red flash overlay
    const overlay = this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0xff4444, 0.35
    ).setScrollFactor(0).setDepth(150);
    this.tweens.add({
      targets: overlay,
      alpha: 0,
      duration: 300,
      onComplete: () => overlay.destroy()
    });

    // Particle burst at hazard position
    this.spawnParticles(hazard.x, hazard.y, hazard.fillColor || 0xff4444, 8);

    this.hitCooldown = 600;
    this.obstacleManager.destroyHazard(hazard);

    // Break multiplier + notify systems
    this.player.breakMultiplier();
    this.difficultyManager.onHit(this.time.now);
    this.achievementManager.onHit(this.time.now);

    // Trigger demotion
    this.handleDemotion();
  }

  handleDemotion() {
    // Calculate visibility drop (lose ~40% of current stage progress)
    const currentStageVis = this.currentStage.visibility;
    const nextStage = getNextStage(this.currentStage.index);
    const stageBand = nextStage ? nextStage.visibility - currentStageVis : 200;
    const visDrop = stageBand * 0.4;

    this.player.demote(visDrop);
    this.difficultyManager.onDemotion(this.time.now);
    this.achievementManager.onDemotion(this.time.now);
    this.sound_mgr.demote();

    // Recalculate current stage after visibility drop
    this.currentStage = getStageForVisibility(this.player.visibility);
    this.player.setForm(this.currentStage.form);

    if (this.player.demotionsRemaining < 0) {
      // Game over
      this.handleGameOver();
    } else {
      // Show demotion scene (pauses game)
      this.isPaused = true;
      this.scene.pause();
      this.scene.launch("DemotionScene", {
        newTitle: this.currentStage.title,
        demotionsRemaining: this.player.demotionsRemaining,
        score: Math.floor(this.player.score)
      });
    }
  }

  handleGameOver() {
    this.player.kill();
    this.achievementManager.onGameOver(this.time.now);
    this.sound_mgr.gameOver();

    const timeSurvived = this.time.now - this.runStartTime;

    this.time.delayedCall(600, () => {
      this.scene.start("GameOverScene", {
        score: Math.floor(this.player.score),
        highestTitle: this.highestTitle,
        timeSurvivedMs: timeSurvived,
        demotions: this.player.demotionCount,
        highestFloor: this.highestFloor,
        maxMultiplier: this.player.maxMultiplier,
        achievementsThisRun: this.achievementManager.getRunUnlocked()
      });
    });
  }

  onPowerupCollect(powerup) {
    const effect = powerup.getData("effect");
    const color = powerup.fillColor || 0xffcc00;

    this.achievementManager.onPowerup(effect, this.time.now);
    this.sound_mgr.collect();

    switch (effect) {
      case "speed":
        this.player.activateCoffee();
        this.player.addVisibility(VISIBILITY_COFFEE_BONUS);
        this.player.addScore(10);
        break;

      case "shield":
        // Headphones — grant grace period (immune to hits)
        this.player.graceTimer = 5000;
        this.player.addScore(15);
        break;

      case "clear_lane":
        // Focus Block — destroy all hazards in player's current lane
        this.clearPlayerLane();
        this.player.addScore(20);
        break;

      case "promote":
        // Promotion Letter — big visibility boost
        this.player.addVisibility(60);
        this.player.addScore(50);
        break;

      case "invuln":
        // PTO Shield — longer grace + speed boost
        this.player.graceTimer = 8000;
        this.player.activateCoffee();
        this.player.addScore(25);
        break;
    }

    // Collect effect — expanding ring + particles
    const ring = this.add.circle(powerup.x, powerup.y, 6, color, 0).setStrokeStyle(2, color, 0.8).setDepth(20);
    this.tweens.add({
      targets: ring,
      scaleX: 3, scaleY: 3,
      alpha: 0,
      duration: 250,
      onComplete: () => ring.destroy()
    });
    this.spawnParticles(powerup.x, powerup.y, color, 5);

    this.obstacleManager.destroyPowerup(powerup);
  }

  clearPlayerLane() {
    const px = this.player.x;
    for (let i = this.obstacleManager.hazards.length - 1; i >= 0; i--) {
      const h = this.obstacleManager.hazards[i];
      if (Math.abs(h.x - px) < 30) {
        this.obstacleManager.destroyHazard(h);
      }
    }
  }

  updateCareer() {
    const stage = getStageForVisibility(this.player.visibility);

    if (stage.index !== this.currentStage.index) {
      const promoted = stage.index > this.currentStage.index;
      this.currentStage = stage;
      this.player.setForm(stage.form);

      this.achievementManager.onTitleChanged(stage.index, this.time.now);

      if (promoted && stage.index > this.highestStageIndex) {
        this.highestStageIndex = stage.index;
        this.highestTitle = stage.title;
        this.showPromotion(stage.title);
        this.player.addScore(100);
        this.sound_mgr.promote();
        this.promotionCount++;
        // Fake applause every 3rd promotion
        if (this.promotionCount % 3 === 0) {
          this.time.delayedCall(400, () => this.sound_mgr.applause());
        }
      }
    }
  }

  showPromotion(title) {
    this.promotionText.setText(`PROMOTED — ${title}`);
    this.promotionText.setAlpha(1);
    this.promotionText.y = 70;

    this.tweens.add({
      targets: this.promotionText,
      alpha: 0,
      y: 55,
      duration: 2200,
      ease: "Power2"
    });

    // Player scale pop
    this.tweens.add({
      targets: this.player,
      scaleX: 1.3, scaleY: 1.3,
      yoyo: true,
      duration: 150,
      ease: "Back.easeOut"
    });

    // Sparkle particles around player
    this.spawnParticles(this.player.x, this.player.y, 0xffdd44, 10);
  }

  showZoneLabel(label) {
    this.zoneLabelText.setText(label);
    this.zoneLabelText.setAlpha(1);

    this.tweens.add({
      targets: this.zoneLabelText,
      alpha: 0,
      duration: 3000,
      delay: 1500,
      ease: "Power2"
    });
  }

  checkAchievementToasts() {
    const unlocked = this.achievementManager.getRunUnlocked();
    if (unlocked.length > this.lastAchievementCount) {
      const newest = unlocked[unlocked.length - 1];
      this.lastAchievementCount = unlocked.length;
      this.showAchievementToast(newest.name);
    }
  }

  showAchievementToast(name) {
    this.sound_mgr.achievement();
    this.achievementToast.setText(`ACHIEVEMENT — ${name}`);
    this.achievementToast.setAlpha(1);
    this.achievementToast.y = 90;

    this.tweens.add({
      targets: this.achievementToast,
      alpha: 0,
      y: 80,
      duration: 2500,
      delay: 1200,
      ease: "Power2"
    });
  }

  updateWarnings() {
    const cameraTop = this.cameraY;
    const warningRange = 600; // how far ahead to look
    const warningZoneTop = cameraTop - warningRange;
    const warningZoneBottom = cameraTop;

    // Only warn about moving hazards (slack_storm etc)
    for (let i = 0; i < LANES.length; i++) {
      const laneX = LANES[i];
      let closestDist = Infinity;
      let closestColor = 0x7b68ee;

      for (const hazard of this.obstacleManager.hazards) {
        if (!hazard.active) continue;
        if (hazard.getData("behavior") !== "moving") continue;
        if (Math.abs(hazard.x - laneX) > 30) continue;

        if (hazard.y < warningZoneBottom && hazard.y > warningZoneTop) {
          const dist = warningZoneBottom - hazard.y;
          if (dist < closestDist) {
            closestDist = dist;
            closestColor = hazard.fillColor || 0x7b68ee;
          }
        }
      }

      const indicator = this.warnings[i];
      if (closestDist < Infinity) {
        const proximity = 1 - (closestDist / warningRange);
        const alpha = 0.15 + proximity * 0.75;
        const scale = 0.3 + proximity * 1.8;

        indicator.setAlpha(alpha);
        indicator.setScale(scale);
        indicator.setPosition(laneX, 68 + (1 - proximity) * 8);
        indicator.setFillStyle(closestColor);
      } else {
        indicator.setAlpha(0);
      }
    }
  }

  showFloorLabel(label) {
    const text = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.35, label, {
      fontFamily: "monospace", fontSize: "9px", color: "#555555"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150).setAlpha(0.7);

    this.tweens.add({
      targets: text,
      alpha: 0,
      duration: 2500,
      delay: 1500,
      onComplete: () => text.destroy()
    });
  }

  showEventBanner(label) {
    const banner = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.25, label, {
      fontFamily: "monospace", fontSize: "11px", color: "#ffcc00",
      backgroundColor: "#1a1628",
      padding: { left: 10, right: 10, top: 6, bottom: 6 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0);

    this.tweens.add({
      targets: banner,
      alpha: 1,
      duration: 300,
      yoyo: false
    });

    this.tweens.add({
      targets: banner,
      alpha: 0,
      duration: 1500,
      delay: 3000,
      onComplete: () => banner.destroy()
    });
  }

  spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const px = x + (Math.random() - 0.5) * 20;
      const py = y + (Math.random() - 0.5) * 20;
      const size = 2 + Math.random() * 3;
      const p = this.add.rectangle(px, py, size, size, color).setDepth(15);
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 60;
      this.tweens.add({
        targets: p,
        x: px + Math.cos(angle) * speed,
        y: py + Math.sin(angle) * speed,
        alpha: 0,
        scaleX: 0.2, scaleY: 0.2,
        duration: 300 + Math.random() * 200,
        onComplete: () => p.destroy()
      });
    }
  }

  updateTicker(time) {
    if (time < this.nextTickerTime) return;
    this.nextTickerTime = time + 12000 + Math.random() * 8000;

    const messages = [
      "Leadership has updated priorities.",
      "Your calendar has been optimized.",
      "A new initiative has been announced.",
      "Quarterly targets have shifted.",
      "An alignment session has been scheduled.",
      "Your visibility is being monitored.",
      "Cross-functional synergies detected.",
      "A reorg is under consideration.",
      "Your role is evolving.",
      "Strategy has been recalibrated.",
      "Someone moved your cheese.",
      "Please update your OKRs.",
      "The org chart has been refreshed.",
      "A culture initiative is underway.",
      "Your manager's manager has thoughts."
    ];

    const msg = messages[Math.floor(Math.random() * messages.length)];
    this.tickerText.setText(msg);
    this.tickerText.setAlpha(0.6);

    this.tweens.add({
      targets: this.tickerText,
      alpha: 0,
      duration: 4000,
      delay: 3000,
      ease: "Power2"
    });
  }

  showOnboarding() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const moveHint = isMobile ? "TAP LEFT / RIGHT" : "← → or A/D";

    const hint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.45,
      `${moveHint}  TO MOVE\nAVOID HAZARDS   COLLECT POWER-UPS`, {
      fontFamily: "monospace", fontSize: "10px", color: "#00ffcc",
      align: "center", lineSpacing: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0.8);

    this.tweens.add({
      targets: hint,
      alpha: 0,
      duration: 2000,
      delay: 4000,
      onComplete: () => hint.destroy()
    });

    // Mobile: show tap zone indicators
    if (isMobile) {
      const leftZone = this.add.text(30, GAME_HEIGHT / 2, "◄", {
        fontSize: "28px", color: "#00ffcc"
      }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0.3);

      const rightZone = this.add.text(GAME_WIDTH - 30, GAME_HEIGHT / 2, "►", {
        fontSize: "28px", color: "#00ffcc"
      }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0.3);

      this.tweens.add({
        targets: [leftZone, rightZone],
        alpha: 0,
        duration: 2000,
        delay: 5000,
        onComplete: () => { leftZone.destroy(); rightZone.destroy(); }
      });
    }
  }

  updateHUD() {
    const score = Math.floor(this.player.score);
    this.scoreText.setText(score.toString());
    this.titleText.setText(this.currentStage.title);
    this.floorText.setText(`FLOOR ${this.currentFloor}`);

    // Multiplier display
    const mult = this.player.multiplier;
    this.multiplierText.setText(`${mult.toFixed(1)}x`);
    if (mult >= 2.0) {
      this.multiplierText.setColor("#ffcc00");
    } else if (mult >= 1.5) {
      this.multiplierText.setColor("#00ffcc");
    } else {
      this.multiplierText.setColor("#888888");
    }

    // Visibility bar
    const nextStage = getNextStage(this.currentStage.index);
    if (nextStage) {
      const current = this.player.visibility - this.currentStage.visibility;
      const needed = nextStage.visibility - this.currentStage.visibility;
      const progress = Math.min(Math.max(current / needed, 0), 1);
      this.visBar.setSize(Math.max(1, 160 * progress), 6);
    } else {
      this.visBar.setSize(160, 6);
    }

    // Demotion dots
    for (let i = 0; i < this.demotionDots.length; i++) {
      if (i < this.player.demotionsRemaining) {
        this.demotionDots[i].setFillStyle(0x00ffcc);
      } else {
        this.demotionDots[i].setFillStyle(0x332233);
      }
    }
  }
}
