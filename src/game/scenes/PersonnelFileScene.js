import Phaser from "phaser";
import { ACHIEVEMENTS } from "../data/achievements.js";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants.js";

const STORAGE_KEY = "ladder_climber_achievements_v1";

export default class PersonnelFileScene extends Phaser.Scene {
  constructor() {
    super("PersonnelFileScene");
  }

  create() {
    this.unlockedMap = this.loadUnlocked();

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0c0912);

    this.add.text(GAME_WIDTH / 2, 40, "PERSONNEL FILE", {
      fontFamily: "monospace", fontSize: "22px", color: "#ffffff"
    }).setOrigin(0.5);

    const unlockedCount = ACHIEVEMENTS.filter(a => this.unlockedMap[a.id]).length;
    this.add.text(GAME_WIDTH / 2, 70, `${unlockedCount}/${ACHIEVEMENTS.length} RECORDS UNLOCKED`, {
      fontFamily: "monospace", fontSize: "12px", color: "#00ffcc"
    }).setOrigin(0.5);

    // Achievement list
    const sorted = [...ACHIEVEMENTS].sort((a, b) => {
      const aU = !!this.unlockedMap[a.id];
      const bU = !!this.unlockedMap[b.id];
      if (aU !== bU) return aU ? -1 : 1;
      return 0;
    });

    let y = 100;
    sorted.forEach(achievement => {
      const unlocked = !!this.unlockedMap[achievement.id];

      // Background strip
      this.add.rectangle(GAME_WIDTH / 2, y + 18, GAME_WIDTH - 40, 40,
        unlocked ? 0x1a1628 : 0x100e16
      ).setStrokeStyle(1, unlocked ? 0x2d2440 : 0x1a1822);

      // Status
      this.add.text(30, y + 6, unlocked ? "UNLOCKED" : "LOCKED", {
        fontFamily: "monospace", fontSize: "8px",
        color: unlocked ? "#00ffcc" : "#555555"
      });

      // Name
      const displayName = unlocked || !achievement.secret ? achievement.name : "CLASSIFIED RECORD";
      this.add.text(30, y + 18, displayName, {
        fontFamily: "monospace", fontSize: "12px",
        color: unlocked ? "#ffffff" : "#888888"
      });

      // Description
      const displayDesc = unlocked || !achievement.secret
        ? achievement.description
        : "Unlock to reveal this personnel record.";
      this.add.text(30, y + 32, displayDesc, {
        fontFamily: "monospace", fontSize: "9px",
        color: unlocked ? "#bbbbbb" : "#555555",
        wordWrap: { width: GAME_WIDTH - 60 }
      });

      y += 50;
    });

    // Back button
    const back = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, "RETURN TO TITLE", {
      fontFamily: "monospace", fontSize: "16px", color: "#00ffcc"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    back.on("pointerover", () => back.setColor("#ffffff"));
    back.on("pointerout", () => back.setColor("#00ffcc"));
    back.on("pointerdown", () => this.scene.start("TitleScene"));

    this.input.keyboard.on("keydown-ESC", () => this.scene.start("TitleScene"));
  }

  loadUnlocked() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
}
