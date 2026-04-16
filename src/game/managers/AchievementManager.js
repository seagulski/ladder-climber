import { ACHIEVEMENTS } from "../data/achievements.js";

const STORAGE_KEY = "ladder_climber_achievements_v1";

export default class AchievementManager {
  constructor() {
    this.globalUnlocked = this.loadGlobal();
    this.resetRun();
  }

  loadGlobal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  saveGlobal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.globalUnlocked));
    } catch { /* silent */ }
  }

  resetRun() {
    this.stats = {
      startTime: 0,
      endTime: 0,
      score: 0,
      highestTitleIndex: 0,
      highestFloor: 1,
      demotions: 0,
      laneChanges: 0,
      lastLane: null,
      laneHistory: [],
      noHitStart: 0,
      longestNoHitMs: 0,
      powerups: {},
      powerupTypes: new Set(),
      lastPromotionTime: 0,
      gameOver: false
    };
    this.runUnlocked = [];
    this.runIds = new Set();
  }

  startRun(time) {
    this.resetRun();
    this.stats.startTime = time;
    this.stats.noHitStart = time;
  }

  // --- Event hooks ---

  onTitleChanged(titleIndex, time) {
    if (titleIndex > this.stats.highestTitleIndex) {
      this.stats.highestTitleIndex = titleIndex;
      this.stats.lastPromotionTime = time;
    }
    this.check(time);
  }

  onFloorChanged(floorNumber, time) {
    if (floorNumber > this.stats.highestFloor) {
      this.stats.highestFloor = floorNumber;
    }
    this.check(time);
  }

  onDemotion(time) {
    this.stats.demotions++;
    this.check(time);
  }

  onLaneChange(laneIndex, time) {
    if (this.stats.lastLane !== null && this.stats.lastLane !== laneIndex) {
      this.stats.laneChanges++;
      this.stats.laneHistory.push({ lane: laneIndex, time });
      if (this.stats.laneHistory.length > 10) this.stats.laneHistory.shift();
    }
    this.stats.lastLane = laneIndex;
    this.checkCustom(time);
    this.check(time);
  }

  onHit(time) {
    const streak = time - this.stats.noHitStart;
    if (streak > this.stats.longestNoHitMs) this.stats.longestNoHitMs = streak;
    this.stats.noHitStart = time;
    this.check(time);
  }

  onPowerup(effectKey, time) {
    this.stats.powerups[effectKey] = (this.stats.powerups[effectKey] || 0) + 1;
    this.stats.powerupTypes.add(effectKey);
    this.check(time);
  }

  onGameOver(time) {
    this.stats.endTime = time;
    this.stats.gameOver = true;
    const streak = time - this.stats.noHitStart;
    if (streak > this.stats.longestNoHitMs) this.stats.longestNoHitMs = streak;
    this.check(time);
  }

  updateTime(time) {
    const streak = time - this.stats.noHitStart;
    if (streak > this.stats.longestNoHitMs) this.stats.longestNoHitMs = streak;
    this.check(time);
  }

  // --- Core check ---

  check(time) {
    const elapsed = time - this.stats.startTime;

    for (const a of ACHIEVEMENTS) {
      if (this.globalUnlocked[a.id] || this.runIds.has(a.id)) continue;

      let pass = false;

      switch (a.type) {
        case "titleIndexAtLeast":
          pass = this.stats.highestTitleIndex >= a.value;
          break;
        case "timeAtLeast":
          pass = elapsed >= a.value;
          break;
        case "demotionsAtLeast":
          pass = this.stats.demotions >= a.value;
          break;
        case "loseWithinMs":
          pass = this.stats.gameOver && (this.stats.endTime - this.stats.startTime) <= a.value;
          break;
        case "laneChangesAtLeast":
          pass = this.stats.laneChanges >= a.value;
          break;
        case "noHitStreakAtLeast":
          pass = this.stats.longestNoHitMs >= a.value;
          break;
        case "powerupAtLeast":
          pass = (this.stats.powerups[a.key] || 0) >= a.value;
          break;
        case "floorAtLeast":
          pass = this.stats.highestFloor >= a.value;
          break;
      }

      if (pass) this.unlock(a);
    }
  }

  checkCustom(time) {
    // Circle Back — switch lanes back-forth 3 times in 3 seconds
    if (!this.globalUnlocked["circle_back"] && !this.runIds.has("circle_back")) {
      const recent = this.stats.laneHistory.filter(e => time - e.time <= 3000);
      if (recent.length >= 6) {
        // Check for alternating pattern
        let alternating = true;
        for (let i = 2; i < recent.length; i++) {
          if (recent[i].lane !== recent[i - 2].lane) { alternating = false; break; }
        }
        if (alternating) {
          const a = ACHIEVEMENTS.find(x => x.id === "circle_back");
          if (a) this.unlock(a);
        }
      }
    }

    // Thought Leader — Director without coffee
    if (!this.globalUnlocked["thought_leader"] && !this.runIds.has("thought_leader")) {
      if (this.stats.highestTitleIndex >= 47 && (this.stats.powerups["speed"] || 0) === 0) {
        const a = ACHIEVEMENTS.find(x => x.id === "thought_leader");
        if (a) this.unlock(a);
      }
    }

    // Role Eliminated — reach Manager then lose
    if (!this.globalUnlocked["role_eliminated"] && !this.runIds.has("role_eliminated")) {
      if (this.stats.gameOver && this.stats.highestTitleIndex >= 30) {
        const a = ACHIEVEMENTS.find(x => x.id === "role_eliminated");
        if (a) this.unlock(a);
      }
    }

    // Sudden Exit — lose within 5s of promotion
    if (!this.globalUnlocked["sudden_exit"] && !this.runIds.has("sudden_exit")) {
      if (this.stats.gameOver && this.stats.lastPromotionTime > 0) {
        const sincePromo = this.stats.endTime - this.stats.lastPromotionTime;
        if (sincePromo <= 5000) {
          const a = ACHIEVEMENTS.find(x => x.id === "sudden_exit");
          if (a) this.unlock(a);
        }
      }
    }

    // Wellness Initiative — 3 different powerup types
    if (!this.globalUnlocked["wellness_initiative"] && !this.runIds.has("wellness_initiative")) {
      if (this.stats.powerupTypes.size >= 3) {
        const a = ACHIEVEMENTS.find(x => x.id === "wellness_initiative");
        if (a) this.unlock(a);
      }
    }
  }

  unlock(achievement) {
    this.globalUnlocked[achievement.id] = true;
    this.saveGlobal();
    this.runIds.add(achievement.id);
    this.runUnlocked.push(achievement);
  }

  // --- Accessors ---

  getRunUnlocked() { return [...this.runUnlocked]; }
  getGlobalUnlockedCount() { return Object.keys(this.globalUnlocked).filter(k => this.globalUnlocked[k]).length; }
  isUnlocked(id) { return !!this.globalUnlocked[id]; }
}
