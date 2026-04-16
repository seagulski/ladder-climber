import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants.js";

const DEMOTION_MESSAGES = [
  "After careful consideration, your role has been adjusted.",
  "Your performance has been recalibrated.",
  "Leadership has repositioned your trajectory.",
  "This is a growth opportunity in disguise.",
  "We're excited about your revised career path.",
  "Your contributions are being realigned.",
  "Think of this as a strategic pivot.",
  "The org has evolved. Your title has not.",
  "Sometimes the ladder climbs you.",
  "HR would like a word. Several, actually."
];

const DEMOTION_HEADERS = [
  "CAREER REALIGNMENT",
  "ROLE ADJUSTMENT",
  "PERFORMANCE CALIBRATION",
  "STRATEGIC REPOSITIONING",
  "TITLE REVISION"
];

export default class DemotionScene extends Phaser.Scene {
  constructor() {
    super("DemotionScene");
  }

  init(data) {
    this.newTitle = data.newTitle || "Intern (Unpaid)";
    this.demotionsRemaining = data.demotionsRemaining ?? 2;
    this.score = data.score ?? 0;
  }

  create() {
    // Dark overlay
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0810, 0.92);

    // Header
    const header = DEMOTION_HEADERS[Math.floor(Math.random() * DEMOTION_HEADERS.length)];
    this.add.text(GAME_WIDTH / 2, 180, header, {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#ff6666"
    }).setOrigin(0.5);

    // Demotion message
    const msg = DEMOTION_MESSAGES[Math.floor(Math.random() * DEMOTION_MESSAGES.length)];
    this.add.text(GAME_WIDTH / 2, 240, msg, {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#cccccc",
      wordWrap: { width: 340 },
      align: "center"
    }).setOrigin(0.5);

    // New title
    this.add.text(GAME_WIDTH / 2, 320, `Current Role: ${this.newTitle}`, {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Demotions remaining
    const demColor = this.demotionsRemaining <= 1 ? "#ff4444" : "#ffcc00";
    this.add.text(GAME_WIDTH / 2, 360, `Demotions Remaining: ${this.demotionsRemaining}`, {
      fontFamily: "monospace",
      fontSize: "14px",
      color: demColor
    }).setOrigin(0.5);

    // Warning if low
    if (this.demotionsRemaining <= 1) {
      this.add.text(GAME_WIDTH / 2, 395, "PERFORMANCE IMPROVEMENT ZONE", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#ff4444"
      }).setOrigin(0.5);
    }

    // Resume button
    const resume = this.add.text(GAME_WIDTH / 2, 480, "RE-ENTER WORKFORCE", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#00ffcc"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    resume.on("pointerover", () => resume.setColor("#ffffff"));
    resume.on("pointerout", () => resume.setColor("#00ffcc"));
    resume.on("pointerdown", () => {
      this.scene.stop();
      this.scene.resume("GameScene");
    });

    // Also allow space/enter to resume
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.stop();
      this.scene.resume("GameScene");
    });
    this.input.keyboard.on("keydown-ENTER", () => {
      this.scene.stop();
      this.scene.resume("GameScene");
    });
  }
}
