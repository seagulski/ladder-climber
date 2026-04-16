import Phaser from "phaser";
import LeaderboardManager from "../managers/LeaderboardManager.js";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants.js";

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super("LeaderboardScene");
  }

  init(data) {
    this.highlightName = data?.highlightName || null;
    this.highlightScore = data?.highlightScore || null;
  }

  create() {
    const lb = new LeaderboardManager();
    const entries = lb.getEntries();

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0d0a12);

    this.add.text(GAME_WIDTH / 2, 50, "PERFORMANCE RANKING", {
      fontFamily: "monospace", fontSize: "20px", color: "#ffffff"
    }).setOrigin(0.5);

    // Column headers
    const headerY = 95;
    this.add.text(30, headerY, "RK", { fontFamily: "monospace", fontSize: "11px", color: "#ffcc00" });
    this.add.text(60, headerY, "NAME", { fontFamily: "monospace", fontSize: "11px", color: "#ffcc00" });
    this.add.text(180, headerY, "SCORE", { fontFamily: "monospace", fontSize: "11px", color: "#ffcc00" });
    this.add.text(260, headerY, "TITLE", { fontFamily: "monospace", fontSize: "11px", color: "#ffcc00" });

    if (entries.length === 0) {
      this.add.text(GAME_WIDTH / 2, 200, "NO RECORDS ON FILE", {
        fontFamily: "monospace", fontSize: "14px", color: "#666666"
      }).setOrigin(0.5);
    }

    entries.forEach((entry, i) => {
      const y = 120 + i * 42;
      const isHighlight = entry.name === this.highlightName && entry.score === this.highlightScore;
      const color = isHighlight ? "#00ffcc" : "#d6d6d6";

      this.add.text(30, y, `${i + 1}`, { fontFamily: "monospace", fontSize: "12px", color });
      this.add.text(60, y, entry.name, { fontFamily: "monospace", fontSize: "12px", color });
      this.add.text(180, y, `${entry.score}`, { fontFamily: "monospace", fontSize: "12px", color });
      this.add.text(260, y, entry.highestTitle, {
        fontFamily: "monospace", fontSize: "10px", color,
        wordWrap: { width: 150 }
      });
    });

    // Back button
    const back = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, "RETURN TO TITLE", {
      fontFamily: "monospace", fontSize: "16px", color: "#00ffcc"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    back.on("pointerover", () => back.setColor("#ffffff"));
    back.on("pointerout", () => back.setColor("#00ffcc"));
    back.on("pointerdown", () => this.scene.start("TitleScene"));

    this.input.keyboard.on("keydown-ESC", () => this.scene.start("TitleScene"));
  }
}
