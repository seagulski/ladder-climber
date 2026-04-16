import Phaser from "phaser";
import LeaderboardManager from "../managers/LeaderboardManager.js";
import GlobalLeaderboard from "../managers/GlobalLeaderboard.js";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants.js";

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super("LeaderboardScene");
  }

  init(data) {
    this.highlightName = data?.highlightName || null;
    this.highlightScore = data?.highlightScore || null;
    this.activeTab = "global"; // default to global
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0d0a12);

    this.add.text(GAME_WIDTH / 2, 40, "PERFORMANCE RANKING", {
      fontFamily: "monospace", fontSize: "20px", color: "#ffffff"
    }).setOrigin(0.5);

    // Tab buttons
    this.globalTab = this.add.text(GAME_WIDTH / 2 - 70, 72, "GLOBAL", {
      fontFamily: "monospace", fontSize: "13px", color: "#00ffcc"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.localTab = this.add.text(GAME_WIDTH / 2 + 70, 72, "LOCAL", {
      fontFamily: "monospace", fontSize: "13px", color: "#666666"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.globalTab.on("pointerdown", () => this.switchTab("global"));
    this.localTab.on("pointerdown", () => this.switchTab("local"));

    // Entries container
    this.entriesGroup = this.add.group();

    // Column headers
    this.add.text(24, 98, "RK", { fontFamily: "monospace", fontSize: "10px", color: "#ffcc00" });
    this.add.text(50, 98, "NAME", { fontFamily: "monospace", fontSize: "10px", color: "#ffcc00" });
    this.add.text(170, 98, "SCORE", { fontFamily: "monospace", fontSize: "10px", color: "#ffcc00" });
    this.add.text(240, 98, "TITLE", { fontFamily: "monospace", fontSize: "10px", color: "#ffcc00" });

    // Loading text
    this.loadingText = this.add.text(GAME_WIDTH / 2, 300, "LOADING...", {
      fontFamily: "monospace", fontSize: "12px", color: "#555555"
    }).setOrigin(0.5);

    // Back button
    const back = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, "RETURN TO TITLE", {
      fontFamily: "monospace", fontSize: "16px", color: "#00ffcc"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    back.on("pointerover", () => back.setColor("#ffffff"));
    back.on("pointerout", () => back.setColor("#00ffcc"));
    back.on("pointerdown", () => this.scene.start("TitleScene"));

    this.input.keyboard.on("keydown-ESC", () => this.scene.start("TitleScene"));

    // Load initial tab
    this.switchTab(this.activeTab);
  }

  switchTab(tab) {
    this.activeTab = tab;
    this.globalTab.setColor(tab === "global" ? "#00ffcc" : "#666666");
    this.localTab.setColor(tab === "local" ? "#00ffcc" : "#666666");

    this.clearEntries();
    this.loadingText.setAlpha(1);

    if (tab === "global") {
      this.loadGlobal();
    } else {
      this.loadLocal();
    }
  }

  async loadGlobal() {
    const entries = await GlobalLeaderboard.fetch("score");
    this.loadingText.setAlpha(0);
    this.renderEntries(entries.map(e => ({
      name: e.name,
      score: e.score,
      highestTitle: e.highest_title
    })));
  }

  loadLocal() {
    const lb = new LeaderboardManager();
    const entries = lb.getEntries();
    this.loadingText.setAlpha(0);
    this.renderEntries(entries);
  }

  clearEntries() {
    this.entriesGroup.clear(true, true);
  }

  renderEntries(entries) {
    if (entries.length === 0) {
      const empty = this.add.text(GAME_WIDTH / 2, 250, "NO RECORDS ON FILE", {
        fontFamily: "monospace", fontSize: "13px", color: "#555555"
      }).setOrigin(0.5);
      this.entriesGroup.add(empty);
      return;
    }

    entries.forEach((entry, i) => {
      const y = 118 + i * 24;
      if (y > GAME_HEIGHT - 90) return; // don't overflow

      const isHighlight = entry.name === this.highlightName &&
                          entry.score === this.highlightScore;
      const color = isHighlight ? "#00ffcc" : "#cccccc";

      const rank = this.add.text(24, y, `${i + 1}`, {
        fontFamily: "monospace", fontSize: "11px", color });
      const name = this.add.text(50, y, entry.name, {
        fontFamily: "monospace", fontSize: "11px", color });
      const score = this.add.text(170, y, `${entry.score}`, {
        fontFamily: "monospace", fontSize: "11px", color });
      const title = this.add.text(240, y, entry.highestTitle || "", {
        fontFamily: "monospace", fontSize: "9px", color,
        wordWrap: { width: 180 }
      });

      this.entriesGroup.addMultiple([rank, name, score, title]);
    });
  }
}
