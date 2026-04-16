import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants.js";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x120e18);

    this.add.text(GAME_WIDTH / 2, 120, "LADDER CLIMBER", {
      fontFamily: "monospace", fontSize: "28px", color: "#ffffff"
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 158, "ADVANCE. ADAPT. ALIGN.", {
      fontFamily: "monospace", fontSize: "12px", color: "#aaaaaa"
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 185, "VERTICAL CORPORATE ASCENSION SIMULATOR", {
      fontFamily: "monospace", fontSize: "9px", color: "#555555"
    }).setOrigin(0.5);

    const menuItems = [
      { label: "START CLIMB", action: () => this.scene.start("GameScene") },
      { label: "PERFORMANCE RANKING", action: () => this.scene.start("LeaderboardScene") },
      { label: "PERSONNEL FILE", action: () => this.scene.start("PersonnelFileScene") },
      { label: "QUIT PROFESSIONALLY", action: () => this.showQuitMessage() }
    ];

    let y = 300;
    menuItems.forEach(item => {
      const text = this.add.text(GAME_WIDTH / 2, y, item.label, {
        fontFamily: "monospace", fontSize: "18px", color: "#00ffcc"
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      text.on("pointerover", () => text.setColor("#ffffff"));
      text.on("pointerout", () => text.setColor("#00ffcc"));
      text.on("pointerdown", item.action);

      y += 50;
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, "CLIMB UNTIL YOU BECOME THE SYSTEM", {
      fontFamily: "monospace", fontSize: "10px", color: "#444444"
    }).setOrigin(0.5);

    this.quitToast = null;
  }

  showQuitMessage() {
    if (this.quitToast) this.quitToast.destroy();

    this.quitToast = this.add.text(GAME_WIDTH / 2, 550, "YOUR RESIGNATION HAS BEEN NOTED.", {
      fontFamily: "monospace", fontSize: "12px", color: "#ffcc00",
      backgroundColor: "#211927",
      padding: { left: 8, right: 8, top: 6, bottom: 6 }
    }).setOrigin(0.5);

    this.time.delayedCall(1800, () => {
      if (this.quitToast) { this.quitToast.destroy(); this.quitToast = null; }
    });
  }
}
