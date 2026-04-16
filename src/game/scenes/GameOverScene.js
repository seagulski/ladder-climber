import Phaser from "phaser";
import LeaderboardManager from "../managers/LeaderboardManager.js";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants.js";

const MESSAGES = [
  "Your services are no longer aligned with business needs.",
  "After a thorough review, we've decided to go in a different direction.",
  "We wish you the best in your future endeavors.",
  "This decision was not made lightly.",
  "Please return your badge and any company property.",
  "Security will escort you to the lobby."
];

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.runData = {
      score: data.score ?? 0,
      highestTitle: data.highestTitle ?? "Intern (Unpaid)",
      timeSurvivedMs: data.timeSurvivedMs ?? 0,
      demotions: data.demotions ?? 0,
      highestFloor: data.highestFloor ?? 1,
      maxMultiplier: data.maxMultiplier ?? 1.0,
      achievementsThisRun: data.achievementsThisRun || []
    };
    this.nameValue = "";
    this.submitted = false;
  }

  create() {
    this.leaderboard = new LeaderboardManager();
    this.qualifies = this.leaderboard.qualifies(this.runData.score);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0810);

    // Header
    this.add.text(GAME_WIDTH / 2, 50, "SERVICES NO LONGER REQUIRED", {
      fontFamily: "monospace", fontSize: "16px", color: "#ff6666"
    }).setOrigin(0.5);

    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    this.add.text(GAME_WIDTH / 2, 85, msg, {
      fontFamily: "monospace", fontSize: "10px", color: "#777777",
      wordWrap: { width: 380 }, align: "center"
    }).setOrigin(0.5);

    // Career Summary
    this.add.text(GAME_WIDTH / 2, 130, "CAREER SUMMARY", {
      fontFamily: "monospace", fontSize: "14px", color: "#ffffff"
    }).setOrigin(0.5);

    const d = this.runData;
    const time = this.formatTime(d.timeSurvivedMs);
    const stats = [
      `Score:       ${d.score}`,
      `Title:       ${d.highestTitle}`,
      `Floor:       ${d.highestFloor}`,
      `Time:        ${time}`,
      `Demotions:   ${d.demotions}`,
      `Multiplier:  ${d.maxMultiplier.toFixed(1)}x`
    ];

    this.add.text(40, 155, stats.join("\n"), {
      fontFamily: "monospace", fontSize: "11px", color: "#cccccc", lineSpacing: 6
    });

    // Achievements this run
    const achievements = d.achievementsThisRun;
    if (achievements.length > 0) {
      this.add.text(40, 300, "NEW PERSONNEL RECORDS", {
        fontFamily: "monospace", fontSize: "11px", color: "#00ffcc"
      });
      const names = achievements.map(a => `  ${a.name}`).join("\n");
      this.add.text(40, 318, names, {
        fontFamily: "monospace", fontSize: "10px", color: "#ffffff", lineSpacing: 4
      });
    }

    // Share button
    const shareBtn = this.add.text(GAME_WIDTH / 2, 390, "SHARE CAREER", {
      fontFamily: "monospace", fontSize: "12px", color: "#888888"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    shareBtn.on("pointerover", () => shareBtn.setColor("#00ffcc"));
    shareBtn.on("pointerout", () => shareBtn.setColor("#888888"));
    shareBtn.on("pointerdown", () => this.shareCareer(shareBtn));

    // Name entry or non-qualifying
    const entryY = 430;

    if (this.qualifies) {
      this.add.text(GAME_WIDTH / 2, entryY - 20, "ENTER EMPLOYEE NAME", {
        fontFamily: "monospace", fontSize: "14px", color: "#ffcc00"
      }).setOrigin(0.5);

      this.nameText = this.add.text(GAME_WIDTH / 2, entryY + 15, "_", {
        fontFamily: "monospace", fontSize: "22px", color: "#ffffff",
        backgroundColor: "#1a1628",
        padding: { left: 10, right: 10, top: 6, bottom: 6 }
      }).setOrigin(0.5);

      this.submitBtn = this.add.text(GAME_WIDTH / 2, entryY + 70, "FILE PERFORMANCE", {
        fontFamily: "monospace", fontSize: "16px", color: "#00ffcc"
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      this.submitBtn.on("pointerover", () => this.submitBtn.setColor("#ffffff"));
      this.submitBtn.on("pointerout", () => this.submitBtn.setColor("#00ffcc"));
      this.submitBtn.on("pointerdown", () => this.submitScore());

      this.skipBtn = this.add.text(GAME_WIDTH / 2, entryY + 105, "SKIP FILING", {
        fontFamily: "monospace", fontSize: "12px", color: "#666666"
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      this.skipBtn.on("pointerover", () => this.skipBtn.setColor("#ffffff"));
      this.skipBtn.on("pointerout", () => this.skipBtn.setColor("#666666"));
      this.skipBtn.on("pointerdown", () => this.goToRetry());

      this.input.keyboard.on("keydown", this.handleKey, this);
    } else {
      this.add.text(GAME_WIDTH / 2, entryY, "PERFORMANCE DID NOT QUALIFY", {
        fontFamily: "monospace", fontSize: "13px", color: "#666666"
      }).setOrigin(0.5);

      this.createRetryButtons(entryY + 50);
    }
  }

  handleKey(event) {
    if (this.submitted) return;

    if (event.key === "Enter") {
      this.submitScore();
      return;
    }
    if (event.key === "Backspace") {
      this.nameValue = this.nameValue.slice(0, -1);
      this.refreshName();
      return;
    }
    if (event.key.length === 1 && this.nameValue.length < 12) {
      const ch = event.key.toUpperCase();
      if (/^[A-Z0-9 ]$/.test(ch)) {
        this.nameValue += ch;
        this.refreshName();
      }
    }
  }

  refreshName() {
    this.nameText.setText(this.nameValue.length > 0 ? this.nameValue : "_");
  }

  submitScore() {
    if (this.submitted) return;
    this.submitted = true;

    const entry = this.leaderboard.addEntry({
      name: this.nameValue || "ANON",
      score: this.runData.score,
      highestTitle: this.runData.highestTitle,
      timeSurvivedMs: this.runData.timeSurvivedMs,
      demotions: this.runData.demotions
    });

    this.scene.start("LeaderboardScene", {
      highlightName: entry.name,
      highlightScore: entry.score
    });
  }

  goToRetry() {
    this.scene.start("GameScene");
  }

  createRetryButtons(y) {
    const retry = this.add.text(GAME_WIDTH / 2, y, "RE-ENTER WORKFORCE", {
      fontFamily: "monospace", fontSize: "18px", color: "#00ffcc"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retry.on("pointerover", () => retry.setColor("#ffffff"));
    retry.on("pointerout", () => retry.setColor("#00ffcc"));
    retry.on("pointerdown", () => this.scene.start("GameScene"));

    const ranking = this.add.text(GAME_WIDTH / 2, y + 40, "VIEW PERFORMANCE RANKING", {
      fontFamily: "monospace", fontSize: "12px", color: "#888888"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    ranking.on("pointerover", () => ranking.setColor("#ffffff"));
    ranking.on("pointerout", () => ranking.setColor("#888888"));
    ranking.on("pointerdown", () => this.scene.start("LeaderboardScene"));

    const quit = this.add.text(GAME_WIDTH / 2, y + 75, "QUIT PROFESSIONALLY", {
      fontFamily: "monospace", fontSize: "12px", color: "#555555"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    quit.on("pointerover", () => quit.setColor("#ffffff"));
    quit.on("pointerout", () => quit.setColor("#555555"));
    quit.on("pointerdown", () => this.scene.start("TitleScene"));

    this.input.keyboard.on("keydown-SPACE", () => this.scene.start("GameScene"));
  }

  shareCareer(btn) {
    const d = this.runData;
    const time = this.formatTime(d.timeSurvivedMs);
    const text = [
      `LADDER CLIMBER — Career Summary`,
      ``,
      `I reached ${d.highestTitle}`,
      `Score: ${d.score} | Floor: ${d.highestFloor}`,
      `Time: ${time} | Demotions: ${d.demotions}`,
      `Multiplier: ${d.maxMultiplier.toFixed(1)}x`,
      ``,
      `Can you climb higher?`,
      `ladderclimber.io`
    ].join("\n");

    if (navigator.share) {
      navigator.share({ title: "Ladder Climber", text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        btn.setText("COPIED TO CLIPBOARD");
        btn.setColor("#00ffcc");
        this.time.delayedCall(2000, () => {
          btn.setText("SHARE CAREER");
          btn.setColor("#888888");
        });
      }).catch(() => {});
    }
  }

  formatTime(ms) {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  shutdown() {
    this.input.keyboard.off("keydown", this.handleKey, this);
  }
}
