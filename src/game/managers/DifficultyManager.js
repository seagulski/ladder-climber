// Difficulty bands control spawn rates, hazard variety, and pacing
const BANDS = [
  {
    band: 1, minScore: 0,
    spawnInterval: 220,
    comboChance: 0.0,
    movingChance: 0.1,
    powerupChance: 0.30,
    preferTags: ["calm", "intro", "reward"]
  },
  {
    band: 2, minScore: 800,
    spawnInterval: 195,
    comboChance: 0.08,
    movingChance: 0.18,
    powerupChance: 0.24,
    preferTags: ["standard"]
  },
  {
    band: 3, minScore: 2200,
    spawnInterval: 170,
    comboChance: 0.16,
    movingChance: 0.25,
    powerupChance: 0.18,
    preferTags: ["standard", "pressure"]
  },
  {
    band: 4, minScore: 4500,
    spawnInterval: 150,
    comboChance: 0.24,
    movingChance: 0.32,
    powerupChance: 0.14,
    preferTags: ["pressure", "combo"]
  },
  {
    band: 5, minScore: 8000,
    spawnInterval: 135,
    comboChance: 0.34,
    movingChance: 0.40,
    powerupChance: 0.10,
    preferTags: ["pressure", "combo", "event"]
  }
];

export default class DifficultyManager {
  constructor() {
    this.band = 1;
    this.struggleUntil = 0;
    this.recentHits = 0;
    this.lastHitTime = 0;
  }

  update(score, time) {
    // Determine band from score
    this.band = 1;
    for (const b of BANDS) {
      if (score >= b.minScore) this.band = b.band;
    }

    // Decay recent hits over time
    if (time - this.lastHitTime > 10000) {
      this.recentHits = 0;
    }
  }

  onHit(time) {
    this.recentHits++;
    this.lastHitTime = time;

    // Enter struggle mode if hit twice quickly
    if (this.recentHits >= 2) {
      this.struggleUntil = time + 6000;
    }
  }

  onDemotion(time) {
    this.struggleUntil = time + 8000;
    this.recentHits = 0;
  }

  isStruggling(time) {
    return time < this.struggleUntil;
  }

  getConfig(time) {
    const base = BANDS[this.band - 1] || BANDS[0];
    const config = { ...base };

    if (this.isStruggling(time)) {
      // Mercy: wider spawns, more powerups, fewer combos
      config.spawnInterval = Math.floor(config.spawnInterval * 1.3);
      config.powerupChance += 0.15;
      config.comboChance *= 0.4;
      config.movingChance *= 0.5;
      config.preferTags = ["calm", "reward", "recovery"];
    }

    return config;
  }
}
